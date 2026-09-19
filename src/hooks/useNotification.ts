import { useCallback } from 'react';
import {
  getAnonymousSessionId,
  hasEasterEggBeenNotified,
  markEasterEggNotified,
  hasSecretLetterBeenNotified,
  markSecretLetterNotified,
} from '../utils/session';

export function useNotification() {
  const notifyEasterEggSolved = useCallback(async () => {
    if (hasEasterEggBeenNotified()) {
      return; // Prevent duplicate sending in this session
    }

    markEasterEggNotified();
    const sessionId = getAnonymousSessionId();

    try {
      const response = await fetch('/api/easter-egg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          event: 'EASTER_EGG_SOLVED',
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        console.warn('API notification response not ok:', response.status);
      }
    } catch (err) {
      // Fail silently to never degrade user experience
      console.warn('Notification non-fatal notice:', err);
    }
  }, []);

  const notifySecretLetterOpened = useCallback(async () => {
    if (hasSecretLetterBeenNotified()) {
      return; // Prevent duplicate sending in this session
    }

    markSecretLetterNotified();
    const sessionId = getAnonymousSessionId();

    try {
      const response = await fetch('/api/secret-letter-opened', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          event: 'SECRET_LETTER_OPENED',
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        console.warn('API notification response not ok:', response.status);
      }
    } catch (err) {
      console.warn('Notification non-fatal notice:', err);
    }
  }, []);

  return {
    notifyEasterEggSolved,
    notifySecretLetterOpened,
  };
}
