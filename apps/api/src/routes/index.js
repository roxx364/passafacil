import { Router } from 'express';
import healthCheck from './health-check.js';
import mercadopagoRouter from './mercadopago.js';
import pixRouter from './pix.js';

const router = Router();

export default () => {
    router.get('/health', healthCheck);
    router.use('/mercadopago', mercadopagoRouter);
    router.use('/pix', pixRouter);

    return router;
};
