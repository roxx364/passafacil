const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Payment } = require('mercadopago');

const app = express();
app.use(cors());
app.use(express.json());

const client = new MercadoPagoConfig({ 
  accessToken: 'TEST-1212481387051060-061821-3e80c9946baa9a4e1cec21c99ba128e0-1972930705'
});

app.post('/mercadopago/create-pix', async (req, res) => {
  try {
    const { amount, description, email, externalReference } = req.body;
    
    const payment = new Payment(client);
    const result = await payment.create({
      body: {
        transaction_amount: amount,
        description,
        payment_method_id: 'pix',
        payer: { email },
        external_reference: externalReference
      }
    });

    res.json({
      paymentId: result.id,
      qrCode: result.point_of_interaction.transaction_data.qr_code,
      qrCodeUrl: result.point_of_interaction.transaction_data.qr_code_base64
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/mercadopago/check-payment/:id', async (req, res) => {
  try {
    const payment = new Payment(client);
    const result = await payment.get({ id: req.params.id });
    res.json({ status: result.status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
