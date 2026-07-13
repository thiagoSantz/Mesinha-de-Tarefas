class Tarefa {
  //
  constructor(titulo, descricao, data, prioridade) {
    this.titulo = titulo;
    this.descricao = descricao;
    this.data = data;
    this.prioridade = prioridade;
    this.id = crypto.randomUUID();
    this.status = "Inativo";
  }
  //
  tarefaMudarStatus(novoStatus) {
    this.status = novoStatus;
  }
  //
  tarefaVerificarAtraso() {
    var hoje = new Date();
    var dataVencimento = new Date(this.data);

    if (dataVencimento < hoje && this.status !== "Concluído") {
      this.tarefaMudarStatus("Atrasado");
    }
  }
  //
  tarefaEditar(titulo, descricao, data, prioridade) {
    this.titulo = titulo;
    this.descricao = descricao;
    this.data = data;
    this.prioridade = prioridade;
  }
  //
}
export default Tarefa;