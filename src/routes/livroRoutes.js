const { Router } = require('express');
const { criar, listar, buscarPorId, deletar } = require('../controllers/livroController');

const router = Router();

router.post("/", criar);
router.get("/", listar);
router.get('/:id', buscarPorId);
router.delete('/:id', deletar);

module.exports = router;