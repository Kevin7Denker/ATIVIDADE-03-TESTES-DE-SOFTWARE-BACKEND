const {
    criarLivro,
    listarLivros,
    buscarLivroPorId,
    atualizarLivro,
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

const atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, autor } = req.body;

        const parseResult = idParamSchema.safeParse({ id });

        if (!parseResult.success) {
            return res.status(400).json({ erro: 'ParÃ¢metro id invÃ¡lido' });
        }

        if (!titulo && !autor) {
            return res.status(400).json({ erro: 'titulo ou autor Ã© obrigatÃ³rio' });
        }

        const livro = await atualizarLivro(titulo, autor, parseResult.data.id);
        return res.status(200).json(livro);
    } catch (error) {
        const status = error.message === 'Livro não encontrado' ? 404 : 400;
        return res.status(status).json({ erro: error.message });
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

module.exports = { criar, listar, buscarPorId, atualizar, deletar };
