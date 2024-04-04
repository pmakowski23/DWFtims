import { GetStaticProps } from 'next';

import Page from '@components/layout/page';
import Header from '@components/layout/header';
import Layout from '@components/layout/layout';
import SponsorsGrid from '@components/sponsors/sponsors-grid';

import { getAllSponsors } from '@lib/cms-api';
import { Sponsor } from '@lib/types';
import { META_DESCRIPTION } from '@lib/constants';

type Props = {
  sponsors: Sponsor[];
};

export default function ExpoPage({ sponsors }: Props) {
  const meta = {
    title: 'Partners',
    description: META_DESCRIPTION
  };

  return (
    <Page meta={meta}>
      <Layout>
        <Header hero="Nasi partnerzy" description={meta.description} />
        <SponsorsGrid sponsors={sponsors} />
      </Layout>
    </Page>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const sponsors = await getAllSponsors();

  return {
    props: {
      sponsors
    },
    revalidate: 60
  };
};
