import 'dotenv/config';
import express from 'express';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import logger from '../utils/logger.js';

const router = express.Router();

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

const preference = new Preference(client);
const payment = new Payment(client);

// POST /mercadopago/create-payment
router.post('/create-payment', async (req, res) => {
  const { amount, description, externalReference } = req.body;

  if (!amount || !description || !externalReference) {
    return res.status(400).json({
      error: 'Missing required fields: amount, description, externalReference',
    });
  }

  const preferenceData = {
    items: [
      {
        title: description,
        quantity: 1,
        unit_price: amount,
      },
    ],
    payer: {
      email: 'test@example.com',
    },
    external_reference: externalReference,
    payment_methods: {
      excluded_payment_methods: [],
      excluded_payment_types: [],
      installments: 1,
    },
  };

  const preferenceResponse = await preference.create({ body: preferenceData });

  if (!preferenceResponse || !preferenceResponse.id) {
    throw new Error('Failed to create Mercado Pago preference');
  }

  const qrCode = preferenceResponse.point_of_interaction?.transaction_data?.qr_code;
  const qrCodeUrl = preferenceResponse.point_of_interaction?.transaction_data?.qr_code_url;

  logger.info(`Mercado Pago preference created: ${preferenceResponse.id}`);

  res.json({
    qrCode: qrCode || null,
    qrCodeUrl: qrCodeUrl || null,
    paymentId: preferenceResponse.id,
  });
});

// POST /mercadopago/create-pix
router.post('/create-pix', async (req, res) => {
  const { amount, description, externalReference } = req.body;

  if (!amount || !description || !externalReference) {
    return res.status(400).json({
      error: 'Missing required fields: amount, description, externalReference',
    });
  }

  const notificationUrl = `${process.env.WEBHOOK_URL || 'http://localhost:3001'}/mercadopago/webhook`;

  const preferenceData = {
    items: [
      {
        title: description,
        quantity: 1,
        unit_price: amount,
      },
    ],
    payer: {
      email: 'test@example.com',
    },
    external_reference: externalReference,
    payment_methods: {
      excluded_payment_methods: [],
      excluded_payment_types: [],
      installments: 1,
    },
    notification_url: notificationUrl,
  };

  const preferenceResponse = await preference.create({ body: preferenceData });

  if (!preferenceResponse || !preferenceResponse.id) {
    throw new Error('Failed to create Mercado Pago PIX preference');
  }

  const qrCode = preferenceResponse.point_of_interaction?.transaction_data?.qr_code;
  const qrCodeUrl = preferenceResponse.point_of_interaction?.transaction_data?.qr_code_url;

  logger.info(`Mercado Pago PIX preference created: ${preferenceResponse.id}`);

  res.json({
    qrCode: qrCode || null,
    qrCodeUrl: qrCodeUrl || null,
    paymentId: preferenceResponse.id,
  });
});

// POST /mercadopago/pix
router.post('/pix', async (req, res) => {
  const { amount, description, email } = req.body;

  if (!amount || !description || !email) {
    return res.status(400).json({
      error: 'Missing required fields: amount, description, email',
    });
  }

  const paymentData = {
    transaction_amount: amount,
    description: description,
    payment_method_id: 'pix',
    payer: {
      email: email,
    },
  };

  const paymentResponse = await payment.create({ body: paymentData });

  if (!paymentResponse || !paymentResponse.id) {
    throw new Error('Failed to create Mercado Pago PIX payment');
  }

  const qrCode = paymentResponse.point_of_interaction?.transaction_data?.qr_code;
  const qrCodeUrl = paymentResponse.point_of_interaction?.transaction_data?.qr_code_url;
  const status = paymentResponse.status || 'pending';

  logger.info(`Mercado Pago PIX payment created: ${paymentResponse.id}`);

  res.json({
    qrCode: qrCode || null,
    qrCodeUrl: qrCodeUrl || null,
    transactionId: paymentResponse.id,
    amount: amount,
    status: status,
  });
});

// GET /mercadopago/check-payment/:paymentId
router.get('/check-payment/:paymentId', async (req, res) => {
  const { paymentId } = req.params;

  if (!paymentId) {
    return res.status(400).json({ error: 'paymentId is required' });
  }

  const paymentResponse = await payment.get({ id: paymentId });

  if (!paymentResponse) {
    throw new Error(`Failed to retrieve payment status for ${paymentId}`);
  }

  const paymentStatus = paymentResponse.status;
  let status = 'pending';

  if (paymentStatus === 'approved') {
    status = 'approved';
  } else if (paymentStatus === 'rejected' || paymentStatus === 'cancelled') {
    status = 'rejected';
  }

  logger.info(`Payment ${paymentId} status: ${paymentStatus}`);

  res.json({
    status,
    paymentId,
  });
});

// GET /mercadopago/payment/:transactionId
router.get('/payment/:transactionId', async (req, res) => {
  const { transactionId } = req.params;

  if (!transactionId) {
    return res.status(400).json({ error: 'transactionId is required' });
  }

  const paymentResponse = await payment.get({ id: transactionId });

  if (!paymentResponse) {
    throw new Error(`Failed to retrieve payment for transaction ${transactionId}`);
  }

  const paymentStatus = paymentResponse.status;
  let status = 'pending';

  if (paymentStatus === 'approved') {
    status = 'approved';
  } else if (paymentStatus === 'rejected') {
    status = 'rejected';
  } else if (paymentStatus === 'cancelled') {
    status = 'rejected';
  }

  const amount = paymentResponse.transaction_amount || 0;
  const email = paymentResponse.payer?.email || '';

  logger.info(`Payment ${transactionId} status checked: ${paymentStatus}`);

  res.json({
    status,
    amount,
    email,
  });
});

export default router;