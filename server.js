const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const client = new MercadoPagoConfig({ 
  accessToken: 'TEST-1212481387051060-061821-3e80c9946baa9a4e1cec21c99ba128e0-1972930705'
});

app.post('/mercadopago/create-pix', async (req, res) => {
  try {
    const { amount, description, email, externalReference } = req.body;
    
    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: [{
          title: description,
          quantity: 1,
          unit_price: Number(amount)
        }],
        payer: { email: email || 'test@test.com' },
        external_reference: externalReference,
        payment_methods: {
          excluded_payment_types: [{ id: 'credit_card' }, { id: 'debit_card' }]
        }
      }
    });

    res.json({
      paymentId: result.id,
      qrCode: result.id,
      qrCodeUrl: `https://www.mercadopago.com.br/checkout/v1/payment/redirect?pref_id=${result.id}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/mercadopago/check-payment/:id', async (req, res) => {
  res.json({ status: 'pending' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
