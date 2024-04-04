import cn from 'classnames';
import { useRef, useEffect } from 'react';
import isMobileOrTablet from '@lib/is-mobile-or-tablet';
import { scrollTo } from '@lib/smooth-scroll';
import styles from './register-confirmation.module.css';
import styleUtils from '../utils/utils.module.css';

type Props = {
  sharePage?: boolean;
};

export default function RegisterConfirmation({ sharePage }: Props) {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sharePage && divRef && divRef.current && isMobileOrTablet()) {
      scrollTo(divRef.current, -30);
    }
  }, [divRef, sharePage]);

  return (
    <div
      className={cn(styles['register-confirmation-layout'], {
        [styles['register-confirmation-share-layout']]: sharePage
      })}
    >
      <div ref={divRef}>
        <div className={styles['register-confirmation-text']}>
          <h2 className={cn(styles.hero, styleUtils.appear, styleUtils['appear-first'])}>
            Zarejestrowałeś się!
          </h2>
          <p className={cn(styles.description, styleUtils.appear, styleUtils['appear-second'])}>
            <>
              Pomyślnie zarejestrowałeś się
              <br className={styleUtils['hide-on-mobile']} />
              na Dzień Wydziału FTIMS 2024.
            </>
          </p>
        </div>
      </div>
    </div>
  );
}
