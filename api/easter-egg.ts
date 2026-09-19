import type { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory rate limiter per serverless instance
const processedSessions = new Set<string>();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { sessionId, event, timestamp } = req.body || {};

    if (!sessionId) {
      return res.status(400).json({ error: 'Missing sessionId' });
    }

    // Anti-spam duplicate session check
    const cacheKey = `easter_egg_${sessionId}`;
    if (processedSessions.has(cacheKey)) {
      return res.status(200).json({ status: 'already_processed' });
    }
    processedSessions.add(cacheKey);

    const recipient = process.env.NOTIFICATION_EMAIL;
    const apiKey = process.env.MAIL_API_KEY;

    console.log(`[EVENT] Easter Egg Solved at ${timestamp || new Date().toISOString()} by session ${sessionId}`);

    // If email environment variables are set, send notification via Resend API
    if (recipient && apiKey) {
      const emailPayload = {
        from: 'Universo Luisa <onboarding@resend.dev>',
        to: [recipient],
        subject: '✨ Luisa encontró el secreto — Easter Egg Resuelto',
        html: `
          <div style="font-family: Georgia, serif; background-color: #080312; color: #f4effa; padding: 30px; border-radius: 12px; border: 1px solid #a855f7;">
            <h1 style="color: #f59e0b; font-size: 24px; margin-bottom: 12px;">✨ Luisa encontró el secreto</h1>
            <p style="font-size: 16px; line-height: 1.6; color: #e9d5ff;">
              El Easter Egg ha sido resuelto exitosamente en la experiencia interactiva.
            </p>
            <p style="font-size: 14px; color: #c084fc; margin-top: 20px;">
              <strong>Evento:</strong> ${event || 'EASTER_EGG_SOLVED'}<br/>
              <strong>Fecha y hora:</strong> ${timestamp || new Date().toLocaleString()}<br/>
              <strong>ID de Sesión:</strong> ${sessionId}
            </p>
            <hr style="border: 0; border-top: 1px solid rgba(168, 85, 247, 0.3); margin: 25px 0;" />
            <p style="font-size: 12px; color: #a78bfa;">
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
      message: 'Easter Egg notification received and processed safely.',
    });
  } catch (error) {
    console.error('Error handling easter-egg endpoint:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
