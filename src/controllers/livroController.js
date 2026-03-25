const {
    criarLivro,
    listarLivros,
    buscarLivroPorId,
    deletarLivro,
} = require('../services/livroService');
const { idParamSchema } = require('../validators/livroSchemas');

const criar = async (req, res) => {
    const { titulo, autor } = req.body;

    if (!titulo || !autor) return res.status(400)
        .json({ erro: 'titulo e autor são obrigatórios'})

    const livro = await criarLivro(titulo, autor);
    res.status(201).json(livro);
}

const listar = async (req, res) => {
    const livros = await listarLivros();
    res.status(200).json(livros);
};

const buscarPorId = async (req, res, next) => {
    try {
        const parseResult = idParamSchema.safeParse(req.params);

        if (!parseResult.success) {
            return res.status(400).json({ erro: 'Parâmetro id inválido' });
        }

        const livro = await buscarLivroPorId(parseResult.data.id);

        if (!livro) {
            return res.status(404).json({ erro: 'Livro não encontrado' });
        }

        return res.status(200).json(livro);
    } catch (error) {
        return next(error);
    }
};

const deletar = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ erro: 'id é obrigatório' });
    }

    await deletarLivro(id);
    res.status(204).send();
};

module.exports = { criar, listar, buscarPorId, deletar };