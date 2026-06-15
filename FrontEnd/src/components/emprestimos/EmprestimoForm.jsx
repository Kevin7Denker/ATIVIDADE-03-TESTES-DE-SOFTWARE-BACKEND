export function EmprestimoForm({ livros, usuarios, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    onSubmit({
      livro_id: Number(fd.get('livro_id')),
      usuario_id: Number(fd.get('usuario_id')),
      data_devolucao_prevista: fd.get('data_devolucao_prevista'),
    });
    e.target.reset();
  };

  const formId = 'emprestimo-novo';

  return (
    <div className="card card--form">
      <h3 className="card__title">Novo emprestimo</h3>
      <form className="form-stack" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor={`${formId}-livro`}>Livro</label>
          <select id={`${formId}-livro`} name="livro_id" required>
            <option value="">Selecione</option>
            {livros.map((l) => (
              <option key={l.id} value={l.id}>
                {l.titulo}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label htmlFor={`${formId}-user`}>Quem retira</label>
          <select id={`${formId}-user`} name="usuario_id" required>
            <option value="">Selecione</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nome} ({u.email})
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label htmlFor={`${formId}-prazo`}>Data de devolucao prevista</label>
          <input id={`${formId}-prazo`} type="date" name="data_devolucao_prevista" required />
        </div>
        <button type="submit" className="btn btn--primary btn--block">
          Registrar emprestimo
        </button>
      </form>
    </div>
  );
}
