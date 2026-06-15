const { Router } = require('express');
const { criar, listar, deletar, buscarPorId, atualizar, buscarPorEmprestimo, quitar } = require('../controllers/multaController');

const router = Router();

router.post('/', criar);
router.get('/', listar);
router.get('/getByEmprestimo/:emprestimo_id', buscarPorEmprestimo);
router.put('/quitar/:id', quitar);
router.get('/:id', buscarPorId);
router.put('/:id', atualizar);
router.delete('/:id', deletar);

module.exports = router;
