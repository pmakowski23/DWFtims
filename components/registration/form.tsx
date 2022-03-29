import { useState, useCallback } from 'react';
import cn from 'classnames';
import FormError from '@lib/form-error';
import LoadingDots from '../utils/loading-dots';
import styleUtils from '../utils/utils.module.css';
import styles from './form.module.css';
import { register } from '@lib/user-api';
import Captcha, { useCaptcha } from '../utils/captcha';
import { Talk } from '@lib/types';
import useConfData from '@lib/hooks/use-conf-data';

type FormState = 'default' | 'loading' | 'error';

type Props = {
  sharePage?: boolean;
  allTalks: Talk[];
};

export default function Form({ sharePage, allTalks }: Props) {
  const [indexNumber, setIndexNumber] = useState('');
  const [selectedTalks, setSelectedTalks] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [focused, setFocused] = useState(false);
  const [formState, setFormState] = useState<FormState>('default');
  const { setPageState, setUserData } = useConfData();
  const {
    ref: captchaRef,
    execute: executeCaptcha,
    reset: resetCaptcha,
    isEnabled: isCaptchaEnabled
  } = useCaptcha();

  const handleAddTalk = (talk: string) => {
    setSelectedTalks([...selectedTalks, talk]);
  };

  const handleRemoveTalk = (talk: string) => {
    const filteredTalks = selectedTalks.filter(t => t !== talk);
    setSelectedTalks(filteredTalks);
  };

  const handleTalkOnClick = (talk: string) => {
    const isTalkInSelectedTalks = selectedTalks.includes(talk);
    if (isTalkInSelectedTalks) {
      handleRemoveTalk(talk);
    } else {
      handleAddTalk(talk);
    }
  };

  const handleRegister = useCallback(async () => {
    try {
      const res = await register(indexNumber, selectedTalks);

      if (!res.ok) {
        throw new FormError(res);
      }

      setUserData({ indexNumber });

      setPageState('ticket');
    } catch (err) {
      let message = 'Ups! coś poszło nie tak.';

      if (err instanceof FormError) {
        const { res } = err;
        const data = res.headers.get('Content-Type')?.includes('application/json')
          ? await res.json()
          : null;

        message = data?.message;
      }

      setErrorMsg(message);
      setFormState('error');
    }
  }, [indexNumber, selectedTalks, setPageState, setUserData]);

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (formState === 'default') {
        setFormState('loading');

        if (isCaptchaEnabled) {
          return executeCaptcha();
        }

        return handleRegister();
      } else {
        setFormState('default');
      }
    },
    [executeCaptcha, formState, isCaptchaEnabled, handleRegister]
  );

  const onTryAgainClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      setFormState('default');
      resetCaptcha();
    },
    [resetCaptcha]
  );

  return (
    <form
      className={cn(styles.form, styleUtils.appear, {
        [styles["share-page"]]: sharePage,
      })}
      onSubmit={onSubmit}
    >
      <div className={styles["form-row"]}>
        <div className={styles["full-width"]}>
          <h3>Podaj numer indeksu</h3>
        </div>
        <label
          htmlFor="index-input-field"
          className={cn(styles["input-label"], {
            [styles.focused]: focused,
          })}
        >
          <input
            className={styles.input}
            autoComplete="off"
            type="indexNumber"
            id="index-input-field"
            pattern="[0-9]{6}"
            value={indexNumber}
            onChange={(e) => setIndexNumber(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Wprowadź numer indeksu"
            aria-label="Twój numer indeksu"
            required
          />
        </label>
        <div className={styles["full-width"]}>
          <h3 className={styles["choose-label"]}>Wybierz wykłady</h3>
        </div>
        {allTalks.map((talk) => (
          <div
            className={cn(styles["input-label"], styles.input, {
              [styles.focused]: selectedTalks.includes(talk.title),
            })}
            onClick={() => handleTalkOnClick(talk.title)}
          >
            <div className={styles["spacing-around"]}>{talk.title}</div>
          </div>
        ))}
        {formState === "error" ? (
          <div className={styles["error-wrapper"]}>
            <h5 className={styles.error}>{errorMsg}</h5>
            <button
              type="button"
              className={cn(styles.submit, styles.register, styles.error)}
              onClick={onTryAgainClick}
            >
              Spróbuj ponownie
            </button>
          </div>
        ) : (
          <div className={styles["submit-wrapper"]}>
            <h5 className={styles.excuse}>
              Rejestracja gwarantuje usprawiedliwienie z zajęć
            </h5>
            <button
              type="submit"
              className={cn(styles.submit, styles[formState])}
              disabled={formState === "loading"}
            >
              {formState === "loading" ? (
                <LoadingDots size={4} />
              ) : (
                <>Zapisz mnie!</>
              )}
            </button>
          </div>
        )}
      </div>
      <Captcha ref={captchaRef} onVerify={handleRegister} />
    </form>
  );
}
