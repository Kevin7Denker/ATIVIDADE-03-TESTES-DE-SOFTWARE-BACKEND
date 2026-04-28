const { Router } = require('express');
const { criar, listar, deletar, buscarPorId, atualizar, buscarPorUsuario } = require('../controllers/emprestimoController');

const router = Router();

router.post('/', criar);
router.get('/', listar);
router.get('/getByUser/:usuario_id', buscarPorUsuario);
router.get('/:id', buscarPorId);
router.put('/:id', atualizar);
router.delete('/:id', deletar);

module.exports = router;
