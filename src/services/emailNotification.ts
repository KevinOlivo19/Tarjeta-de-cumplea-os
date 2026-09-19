import emailjs from '@emailjs/browser';

/**
 * Servicio silencioso de notificación por correo (EmailJS)
 * Se ejecuta en segundo plano sin interrumpir ni mostrar nada en pantalla.
 */
let hasNotifiedSession = false;

export const notificarCartaAbierta = async () => {
  // Evitar enviar múltiples correos si se abre la carta más de una vez en la misma sesión
  if (hasNotifiedSession) return;
  hasNotifiedSession = true;

  // Credenciales de EmailJS configuradas
  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_ae9hrpt';
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_z0z19fb';
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'zuss2S-K7n1mDpZuu';

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email: 'olivokevin8@gmail.com',
        message: 'Se abrió la carta',
        date: new Date().toLocaleString(),
      },
      {
        publicKey: PUBLIC_KEY,
      }
    );
  } catch {
    // Totalmente silencioso: no interrumpe la experiencia de Luisa bajo ninguna circunstancia
  }
};
