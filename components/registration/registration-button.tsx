import cn from 'classnames';
import styleUtils from '../utils/utils.module.css';
import styles from './registration-button.module.css';

interface RegistrationButtonProps {
  isRegistrationStarted: boolean;
  handleStartingRegistration: () => void;
}

const RegistrationButton = ({
  isRegistrationStarted,
  handleStartingRegistration
}: RegistrationButtonProps) => {
  return (
    <div
      className={cn(styles.wrapper, styleUtils.appear, styleUtils['appear-fifth'], {
        [styles['wrapper-hidden']]: isRegistrationStarted,
        [styleUtils.disappear]: isRegistrationStarted
      })}
    >
      <button
        type="submit"
        className={cn(styles.register, styleUtils['center-el'], {
          [styleUtils['move-to-left']]: isRegistrationStarted
        })}
        onClick={handleStartingRegistration}
      >
        Zapisz się na wydarzenia!
      </button>
      <div
        className={cn(styles['only-for'], styleUtils['center-el'], {
          [styleUtils['move-to-left']]: isRegistrationStarted
        })}
      >
        Tylko dla <span className={styles.students}>Studentów</span>.
      </div>
    </div>
  );
};

export default RegistrationButton;
