import Link from 'next/link';
import Image from 'next/image';
import cn from 'classnames';
import { Sponsor } from '@lib/types';
import styles from './sponsors-grid.module.css';

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  return (
    <Link key={sponsor.name} href={sponsor.website}>
      <a
        target="_blank"
        role="button"
        tabIndex={0}
        className={cn(styles.card, {
          [styles.diamond]: sponsor.tier === 'diamond',
          [styles.gold]: sponsor.tier === 'gold'
        })}
      >
        <div className={styles.imageWrapper}>
          <Image
            alt={sponsor.name}
            src={sponsor.logo.url}
            className={cn(styles.image, {
              [styles.silver]: sponsor.tier === 'silver'
            })}
            loading="lazy"
            title={sponsor.name}
            width={900}
            height={500}
          />
        </div>
        {sponsor.tier !== 'silver' && (
          <div className={styles.cardBody}>
            <div>
              <h2 className={styles.name}>{sponsor.name}</h2>
              <p className={styles.description}>{sponsor.description}</p>
            </div>
          </div>
        )}
      </a>
    </Link>
  );
}

type Props = {
  sponsors: Sponsor[];
};

type groupedByTierType = { [tier: string]: Sponsor[] };

export default function SponsorsGrid({ sponsors }: Props) {
  const groupedByTier = sponsors.reduce((reducer, sponsor) => {
    if (!Object.keys(reducer).includes(sponsor.tier)) {
      reducer[sponsor.tier] = [sponsor];
    } else {
      reducer[sponsor.tier].push(sponsor);
    }
    return reducer;
  }, {} as groupedByTierType);

  return (
    <>
      {Object.keys(groupedByTier)
        .sort((a, b) => groupedByTier[b][0].tierRank - groupedByTier[a][0].tierRank)
        .map(tier => (
          <div key={tier}>
            <div className={styles['name-wrapper']}>
              <h2 className={styles.tier}>{tier.toUpperCase()}</h2>
              <Image
                alt={tier}
                src={groupedByTier[tier][0].tierIcon}
                className={styles.image}
                loading="lazy"
                title={tier}
                width={20}
                height={18}
              />
            </div>
            <div className={styles.grid}>
              {groupedByTier[tier]
                .sort((a, b) => (a.name < b.name ? -1 : 1))
                .map(sponsor => (
                  <SponsorCard key={sponsor.name} sponsor={sponsor} />
                ))}
            </div>
          </div>
        ))}
    </>
  );
}
