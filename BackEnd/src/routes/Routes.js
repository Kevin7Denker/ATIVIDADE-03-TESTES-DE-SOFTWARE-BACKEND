const { Router } = require("express");
const usuarioRoutes = require('./usuarioRoutes');
const livroRoutes = require('./livroRoutes');
const emprestimoRoutes = require('./emprestimoRoutes');
const multaRoutes = require('./multaRoutes');

const router = Router();

router.use('/usuarios', usuarioRoutes);
router.use('/livros', livroRoutes);
router.use('/emprestimos', emprestimoRoutes);
router.use('/multas', multaRoutes);

module.exports = router;
