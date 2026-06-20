import 'dotenv/config';
import express from 'express';
import logger from '../utils/logger.js';

const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const { nomeCompleto, email, precoTotal } = req.body;

    if (!nomeCompleto || !email || !precoTotal) {
      return res.status(400).json({ error: 'Missing required fields: nomeCompleto, email, precoTotal' });
    }
    if (typeof precoTotal !== 'number' || precoTotal <= 0) {
      return res.status(400).json({ error: 'precoTotal must be a positive number' });
    }

    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    if (!accessToken) {
      return res.status(500).json({ error: 'Token do Mercado Pago não configurado' });
    }

    const paymentData = {
      transaction_amount: precoTotal,
      description: `Pagamento PassaFácil - ${nomeCompleto}`,
      payment_method_id: 'pix',
      payer: { email: email.trim() },
    };

    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `${email}-${Date.now()}`,
      },
      body: JSON.stringify(paymentData),
    });

    const paymentResponse = await response.json();

    if (!response.ok) {
      logger.error('Mercado Pago error:', paymentResponse);
      return res.status(response.status).json({ error: paymentResponse.message || 'Erro no Mercado Pago' });
    }

    const qrCode = paymentResponse.point_of_interaction?.transaction_data?.qr_code;
    const qrCodeBase64 = paymentResponse.point_of_interaction?.transaction_data?.qr_code_base64;
    const transactionId = paymentResponse.id;

    if (!qrCode) {
      return res.status(500).json({ error: 'QR Code não gerado pelo Mercado Pago' });
    }

    logger.info(`PIX gerado: ${transactionId}`);

    res.json({ qrCode, qrCodeUrl: qrCodeBase64, transactionId });

  } catch (err) {
    logger.error('Erro ao gerar PIX:', err);
    res.status(500).json({ error: 'Erro interno ao gerar PIX' });
  }
});

export default router;