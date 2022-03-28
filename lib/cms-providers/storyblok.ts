/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { Job, Sponsor, Stage, Speaker, Talk } from '@lib/types';

const API_URL = 'https://gapi.storyblok.com/v1/api';
const API_TOKEN = process.env.STORYBLOK_PREVIEW_TOKEN;

/**
 * This transformResponse() function can be removed if you're using the
 * Storyblok data directly. This transformation only happens to adapt the data
 * returned from the GraphQL api to the data structure used in the
 * starter so as not to have to modify the component files.
 */
function transformResponse(response: any[], _speakers?: any) {
  const content = response.map((r: any) => (r.content ? r.content : r));
  content.map((item: any) => {
    Object.keys(item).map(key => {
      // assign the urls directly if not an image
      if (item[key]) {
        const noAssign = ['image', 'logo', 'cardImage'];
        if (item[key].url && noAssign.indexOf(key) === -1) {
          item[key] = item[key].url;
        }

        if (key === '_uid') {
          item.id = item[key];
          delete item[key];
        }

        // remove nesting from schedule and assign speakers
        if (key === 'schedule') {
          item[key] = item[key].map((slot: { content: any; speaker: any }) => {
            slot = slot.content;
            const speakers = _speakers?.filter(
              (speaker: any) => slot.speaker.indexOf(speaker.uuid) !== -1
            );
            slot.speaker = speakers;
            return slot;
          });
        }
      }
    });
  });

  return content;
}

async function fetchCmsAPI(query: string, { variables }: { variables?: Record<string, any> } = {}) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Token: `${API_TOKEN}`
    },
    body: JSON.stringify({
      query,
      variables
    })
  });

  const json = await res.json();
  if (json.errors) {
    // eslint-disable-next-line no-console
    console.error(json.errors);
    throw new Error('Failed to fetch API');
  }

  return json.data;
}

export async function getAllSpeakers(): Promise<Speaker[]> {
  const data = await fetchCmsAPI(`
  {
    SpeakerItems(per_page: 100) {
      items {
        uuid
        content {
          name
          bio
          title
          slug
          linkedin {
            url
          }
          github {
            url
          }
          company
          image {
            url: filename
          }
          talk {
            content
          }
        }
      }
    }
  }  
  `);

  const responseData = data.SpeakerItems.items.map((s: any) => {
    const speaker = s.content;
    speaker.talk = speaker.talk.content;
    speaker.uuid = s.uuid;
    return speaker;
  });
  const transformedData = transformResponse(responseData);
  return transformedData;
}

export async function getAllTalks(): Promise<Talk[]> {
  const data = await fetchCmsAPI(`
  {
    TalkItems(per_page: 100) {
      items {
        uuid
        content {
          title
          title
          description
          start
          end
          speaker {
            uuid
          }
        }
      }
    }
  }
  `);
  const transformedData = transformResponse(data.TalkItems.items);
  return transformedData;
}

export async function getAllStages(): Promise<Stage[]> {
  const speakers = await getAllSpeakers();
  const data = await fetchCmsAPI(`
    {
      StageItems(per_page: 100) {
        items {
          content {
            name
            slug
            stream {
              url
            }
            discord {
              url
            }
            schedule {
              content
            }
          }
        }
      }
    }
  `);

  const transformedData = transformResponse(data.StageItems.items, speakers);
  return transformedData;
}

export async function getAllSponsors(): Promise<Sponsor[]> {
  const data = await fetchCmsAPI(`
  {
    CompanyItems(per_page: 100) {
      items {
        content {
          name
          slug
          description
          logo {
            url: filename
          }
          website {
            url
          }
          tierIcon {
            url: filename
          }
          tier
          tierRank
        }
      }
    }
  }  
  `);

  const transformedData = transformResponse(data.CompanyItems.items);
  return transformedData;
}

export async function getAllJobs(): Promise<Job[]> {
  const data = await fetchCmsAPI(`
    {
      JobItems(per_page: 100) {
        items {
          content {
            _uid
            companyName
            title
            description
            discord {
              url
            }
            link {
              url
            }
            rank
          }
        }
      }
    }
  `);

  const transformedData = transformResponse(data.JobItems.items);
  return transformedData;
}
