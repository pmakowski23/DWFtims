import cn from 'classnames';
import styles from './schedule.module.css';

import TalkCard from '@components/talk/talk-card';

import { Stage, Talk } from '@lib/types';

function StageRow({ stage }: { stage: Stage }) {
  // Group talks by the time block
  const timeBlocks = stage.schedule.reduce((allBlocks: any, talk) => {
    allBlocks[talk.start] = [...(allBlocks[talk.start] || []), talk];
    return allBlocks;
  }, {});

  return (
    <div key={stage.name} className={styles.row}>
      <h3 className={cn(styles['stage-name'], styles[stage.slug])}>
        <span>
          {stage.name.split(' ').map(part => (
            <p key={part} className={styles['name-part']}>
              {part} 
            </p>
          ))}
        </span>
      </h3>
      <div className={cn(styles.talks, styles[stage.slug])}>
        {Object.keys(timeBlocks).map((startTime: string) => (
          <div key={startTime}>
            {timeBlocks[startTime].map((talk: Talk, index: number) => (
              <TalkCard key={talk.title} talk={talk} showTime={index === 0} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

type Props = {
  allStages: Stage[];
};

export default function Schedule({ allStages }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles['row-wrapper']}>
        {allStages
          .sort((a, b) => (a.name > b.name ? 1 : -1))
          .map(stage => stage.schedule.length > 0 && <StageRow key={stage.slug} stage={stage} />)}
      </div>
    </div>
  );
}
