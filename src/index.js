import Projeto from "./Projeto.js";
import Ui from "./Ui.js";
import "./style.css";
import "./mobile.css";

const ui = new Ui();
ui.uiCarregar();
//
if (ui.projetos.length === 0) {
  const projetoPadrao = new Projeto("Projeto Padrão");
  ui.projetos.push(projetoPadrao);
}
//
ui.projetoAtivo = ui.projetos[0];
document.querySelector(".tl-main").textContent = ui.projetoAtivo.nome;

ui.uiAbrirFormulario();
ui.uiPegarFormulario();
ui.uiBotoesTarefa();
ui.uiEditardoFormulario();
ui.uiBarraDeProjetos();
ui.uiPegarFormularioProjeto();
ui.uiRenderizarProjetos();
ui.uiRenderizarTarefas();
ui.uiBtnCancelarForm();
ui.uiDropdown();
ui.uiSwipeMobile();
