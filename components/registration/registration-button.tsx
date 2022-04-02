import cn from "classnames";
import styleUtils from "../utils/utils.module.css";
import styles from "./registration-button.module.css";

interface RegistrationButtonProps {
  isRegistrationStarted: boolean;
  handleStartingRegistration: () => void;
}

const RegistrationButton = ({
  isRegistrationStarted,
  handleStartingRegistration,
}: RegistrationButtonProps) => {
  return (
    <div
      className={cn(
        styles.wrapper,
        styleUtils.appear,
        styleUtils["appear-fifth"],
        {
          [styles["wrapper-hidden"]]: isRegistrationStarted,
          [styleUtils.disappear]: isRegistrationStarted,
        }
      )}
    >
      <div
        className={cn(styles["only-for"], styleUtils["center-el"], {
          [styleUtils["move-to-left"]]: isRegistrationStarted,
        })}
      >
        Zapisz się na <span className={styles.students}>wydarzenie</span>!
      </div>
      <div className={styles["buttons-wrapper"]}>
        <div>
          <button
            type="submit"
            className={cn(styles.register, styleUtils["center-el"], {
              [styleUtils["move-to-left"]]: isRegistrationStarted,
            })}
            onClick={handleStartingRegistration}
          >
            Dla studentów
          </button>
        </div>
        <div>
          <a
            target="_blank"
            href="https://forms.samorzad.p.lodz.pl/zapisy-na-szkolenia-dzien-wydzialu-ftims/"
          >
            <button
              className={cn(styles.register, styleUtils["center-el"], {
                [styleUtils["move-to-left"]]: isRegistrationStarted,
              })}
            >
              Dla uczniów szkół średnich
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegistrationButton;
