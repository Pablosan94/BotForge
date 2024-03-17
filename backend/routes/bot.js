const express = require('express');

const authMiddleware = require('../middleware/auth');

const botController = require('../controllers/bot');

const router = express.Router();

// /bot => GET
router.get('/', botController.listBots);

// /bot => GET
router.get('/:id', botController.findBot);

// /bot => POST
router.post('/', authMiddleware, botController.createBot);

// /bot => PUT
router.put('/:id', authMiddleware, botController.updateBot);

// /bot => DELETE
router.delete('/:id', authMiddleware, botController.deleteBot);

module.exports = router;
