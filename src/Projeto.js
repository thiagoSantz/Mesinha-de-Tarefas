class Projeto {
  //
  constructor(nome) {
    this.nome = nome;
    this.id = crypto.randomUUID();
    this.tarefas = []; // começa vazio
  }
  //
  projetoAdicionarTarefa(tarefa) {
    this.tarefas.push(tarefa);
  }
  //
  projetoApagarTarefa(tarefa) {
    var indice = this.tarefas.findIndex((t) => t === tarefa);
    this.tarefas.splice(indice, 1);
  }
  //
  projetoEditarTitulo(titulo) {
    this.nome = titulo;
  }
  //
  projetoFiltrar(criterio) {
    if (criterio === "Titulo") {
      return [...this.tarefas].sort((a, b) => a.titulo.localeCompare(b.titulo));
      //
    } else if (criterio === "Data") {
      return [...this.tarefas].sort(
        (a, b) => new Date(a.data) - new Date(b.data),
      );
    } else if (criterio === "Status") {
      var pesoStatus = { Inativo: 2, Atrasado: 1, Andamento: 3, Concluído: 4 };
      return [...this.tarefas].sort(
        (a, b) => pesoStatus[a.status] - pesoStatus[b.status],
      );
    } else if (criterio === "Prioridade") {
      var pesoPrioridade = { Alta: 1, Normal: 2, Baixa: 3 };
      return [...this.tarefas].sort(
        (a, b) => pesoPrioridade[a.prioridade] - pesoPrioridade[b.prioridade],
      );
    }
  }
  //
}
export default Projeto;
