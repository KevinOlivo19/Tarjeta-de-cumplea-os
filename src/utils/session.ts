/**
 * Session utility to handle anonymous session tracking
 * and prevent spamming notification emails.
 */

const SESSION_KEY = 'luisa_birthday_session_id';
const SOLVED_FLAG = 'luisa_easter_egg_notified';
const OPENED_FLAG = 'luisa_secret_letter_notified';

export function getAnonymousSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = 'sess_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now().toString(36);
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function hasEasterEggBeenNotified(): boolean {
  return sessionStorage.getItem(SOLVED_FLAG) === 'true';
}

export function markEasterEggNotified(): void {
  sessionStorage.setItem(SOLVED_FLAG, 'true');
}

export function hasSecretLetterBeenNotified(): boolean {
  return sessionStorage.getItem(OPENED_FLAG) === 'true';
}

export function markSecretLetterNotified(): void {
  sessionStorage.setItem(OPENED_FLAG, 'true');
}
