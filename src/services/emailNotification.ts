import emailjs from '@emailjs/browser';

/**
 * Servicio silencioso de notificación por correo (EmailJS)
 * Se ejecuta en segundo plano sin interrumpir ni mostrar nada en pantalla.
 */
const inMemoryCache = new Set<string>();

const hasBeenNotified = (key: string): boolean => {
  if (inMemoryCache.has(key)) return true;
  try {
    return sessionStorage.getItem(key) === 'true';
  } catch {
    return false;
  }
};

const markAsNotified = (key: string): void => {
  inMemoryCache.add(key);
  try {
    sessionStorage.setItem(key, 'true');
  } catch {
    // Ignorar si sessionStorage no está disponible
  }
};

const enviarEmailSilencioso = async (cacheKey: string, mensaje: string) => {
  if (hasBeenNotified(cacheKey)) {
    console.log(`[EmailJS - Omitido]: Ya se envió "${cacheKey}" en esta sesión. Abre una pestaña nueva de incógnito para re-probar.`);
    return;
  }
  markAsNotified(cacheKey);

  console.log(`[EmailJS - Enviando correo]:`, mensaje);

  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_ae9hrpt';
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_z0z19fb';
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'zuss2S-K7n1mDpZuu';

  try {
    const res = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email: 'olivokevin8@gmail.com',
        message: mensaje,
        subject: mensaje,
        title: mensaje,
        content: mensaje,
        date: new Date().toLocaleString(),
      },
      {
        publicKey: PUBLIC_KEY,
      }
    );
    console.log('[EmailJS - Enviado con éxito!]:', res.status, res.text);
  } catch (error) {
    console.error('[EmailJS - Error al enviar]:', error);
  }
};

/**
 * Notificación 1: Cuando Luisa desbloquea o abre el módulo secreto (?)
 */
export const notificarModuloDesbloqueado = async () => {
  await enviarEmailSilencioso(
    'luisa_noti_modulo_unlocked',
    '✨ Luisa desbloqueó el módulo secreto (?)'
  );
};

/**
 * Notificaciones 2, 3 y 4: Cuando Luisa resuelve cada uno de los 3 acertijos
 */
export const notificarAcertijoResuelto = async (paso: number, respuesta: string) => {
  await enviarEmailSilencioso(
    `luisa_noti_acertijo_${paso}`,
    `✨ [Acertijo ${paso}/3 Resuelto]: Luisa adivinó "${respuesta}"`
  );
};

/**
 * Notificación 5: Cuando Luisa abre el sobre de la carta secreta
 */
export const notificarCartaAbierta = async () => {
  await enviarEmailSilencioso(
    'luisa_noti_carta_abierta',
    '💌 Luisa abrió la Carta Secreta'
  );
};

