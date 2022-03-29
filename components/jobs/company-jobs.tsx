import { Job } from '@lib/types';
import styles from './jobs-grid.module.css';

type Props = {
  jobs: Job[];
};

function CompanyJobs({ jobs }: Props) {
  return (
    <div className={styles.grid}>
      {jobs.map(job => (
        <a
          key={job.id}
          className={styles.card}
          href={job.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className={styles.cardBody}>
            <div>
              <h3 className={styles.title}>{job.title}</h3>
              <p className={styles.company}>{job.companyName}</p>
              <p className={styles.description}>{job.description}</p>
            </div>
            <p className={styles.link}>
              Oferta
              <svg
                className={styles.icon}
                viewBox="0 0 24 24"
                width="16"
                height="16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                shapeRendering="geometricPrecision"
              >
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <path d="M15 3h6v6" />
                <path d="M10 14L21 3" />
              </svg>
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}

export default CompanyJobs;
