import type { VercelRequest, VercelResponse } from '@vercel/node';

const processedSessions = new Set<string>();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { sessionId, event, timestamp } = req.body || {};

    if (!sessionId) {
      return res.status(400).json({ error: 'Missing sessionId' });
    }

    const cacheKey = `secret_letter_${sessionId}`;
    if (processedSessions.has(cacheKey)) {
      return res.status(200).json({ status: 'already_processed' });
    }
    processedSessions.add(cacheKey);

    const recipient = process.env.NOTIFICATION_EMAIL;
    const apiKey = process.env.MAIL_API_KEY;

    console.log(`[EVENT] Secret Letter Opened at ${timestamp || new Date().toISOString()} by session ${sessionId}`);

    if (recipient && apiKey) {
      const emailPayload = {
        from: 'Universo Luisa <onboarding@resend.dev>',
        to: [recipient],
        subject: '💌 Luisa abrió la Carta Secreta',
        html: `
          <div style="font-family: Georgia, serif; background-color: #080312; color: #f4effa; padding: 30px; border-radius: 12px; border: 1px solid #f59e0b;">
            <h1 style="color: #fbbf24; font-size: 24px; margin-bottom: 12px;">💌 Luisa ha abierto la Carta Secreta</h1>
            <p style="font-size: 16px; line-height: 1.6; color: #e9d5ff;">
              El momento culminante ha ocurrido: la carta secreta ha sido desvelada y el audio secreto ha comenzado a sonar.
            </p>
            <p style="font-size: 14px; color: #fef08a; margin-top: 20px;">
              <strong>Evento:</strong> ${event || 'SECRET_LETTER_OPENED'}<br/>
              <strong>Fecha y hora:</strong> ${timestamp || new Date().toLocaleString()}<br/>
              <strong>ID de Sesión:</strong> ${sessionId}
            </p>
            <hr style="border: 0; border-top: 1px solid rgba(245, 158, 11, 0.3); margin: 25px 0;" />
            <p style="font-size: 12px; color: #d8b4fe;">
              Experiencia Interactiva de Cumpleaños para Luisa.
            </p>
          </div>
        `,
      };

      const mailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailPayload),
      });

      if (!mailRes.ok) {
        console.error('Failed to dispatch email via Resend:', await mailRes.text());
      }
    } else {
      console.log('[DEV NOTICE] NOTIFICATION_EMAIL o MAIL_API_KEY no configuradas aún. Notificación simulada exitosamente.');
    }

    return res.status(200).json({
      success: true,
      message: 'Secret letter notification processed safely.',
    });
  } catch (error) {
    console.error('Error handling secret-letter-opened endpoint:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
