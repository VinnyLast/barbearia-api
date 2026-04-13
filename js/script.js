let carrinho = [];
// ================= DADOS =================
const API_URL = "https://barbearia-api-23on.onrender.com";

const barbeiros = [
  { nome: "Junior Ferreira", especialidade: "Corte social e degradê", foto: "images/junior.png" },
  { nome: "Diego Alves", especialidade: "Barba e acabamento", foto: "images/diego.png" },
  { nome: "Samuel Santos", especialidade: "Cortes modernos", foto: "images/samuel.png" },
  { nome: "Rian Lukas", especialidade: "Cortes modernos e freestyle", foto: "images/lukas.png" },
  { nome: "Douglas", especialidade: "Barba e acabamento", foto: "images/douglas.png" },
];

const servicos = [
  { nome: "Corte", preco: 25, duracao: 40, img: "images/corte.png" },
  { nome: "Barba", preco: 15, duracao: 20, img: "images/barba.png" },
  { nome: "Pezinho", preco: 10, duracao: 10, img: "images/pezinho.jpeg" },
  { nome: "Luzes", preco: 60, duracao: 30, img: "images/luzes.png" },
  { nome: "Platinado", preco: 80, duracao: 60, img: "images/platinado.png" },
  { nome: "Botox", preco: 50, duracao: 40, img: "images/botox.jpeg" },
  { nome: "Barboterapia", preco: 40, duracao: 30, img: "images/barboterapia.jpeg" },
  { nome: "Pigmentação", preco: 30, duracao: 25, img: "images/pigmentacao.jpeg" },
  { nome: "Hidratação", preco: 35, duracao: 30, img: "images/hidratacao.png" },
  { nome: "Sobrancelha (máquina e tesoura)", preco: 15, duracao: 15, img: "images/sobrancelha.jpeg" },
  { nome: "Freestyle", preco: 20, duracao: 20, img: "images/freestyle.png" },
  { nome: "Depilação (orelha e nariz)", preco: 15, duracao: 15, img: "images/depilacao.jpeg" },
  { nome: "Limpeza facial", preco: 25, duracao: 30, img: "images/limpeza.jpeg" },
];

const combos = [
  { nome: "Corte + Barba", preco: 40, duracao: 60, img: "images/corte+barba.png" },
  { nome: "Corte + Luzes", preco: 75, duracao: 70, img: "images/corte+luzes.png" },
  { nome: "Corte + Platinado", preco: 95, duracao: 90, img: "images/corte+platinado.png" },
  { nome: "Corte + Sobrancelha", preco: 35, duracao: 55, img: "images/corte+sobrancelha.png" },
];

const produtos = [
  { nome: "Pomada", preco: 25, img: "images/pomada.png" },
  { nome: "Shampoo", preco: 30, img: "images/shampoo.png" },
  { nome: "Óleo para barba", preco: 20, img: "images/oleo.gif" },
];

const horarios = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];

// ================= ELEMENTOS =================
const formAgendamento = document.getElementById("formAgendamento");
const selectBarbeiro = document.getElementById("barbeiro");
const selectServico = document.getElementById("servico");
const selectCombo = document.getElementById("combo");
const selectHora = document.getElementById("hora");
const inputData = document.getElementById("data");
const inputNome = document.getElementById("nome");
const inputTelefone = document.getElementById("telefone");
const valor = document.getElementById("valor");
const listaProdutos = document.getElementById("listaProdutos");
const listaAdmin = document.getElementById("listaAdmin");
const listaBarbeiros = document.getElementById("listaBarbeiros");
const listaBarbeirosSelecionavel = document.getElementById("listaBarbeirosSelecionavel");
const listaServicos = document.getElementById("listaServicos");
const listaCombos = document.getElementById("listaCombos");
const loading = document.getElementById("loading");

const blocoServicos = document.getElementById("bloco-servicos") || (listaServicos ? listaServicos.parentElement : null);
const blocoCombos = document.getElementById("bloco-combos") || (listaCombos ? listaCombos.parentElement : null);

// ================= CONFIG INICIAL =================
const hojeConfig = new Date().toISOString().split("T")[0];
inputData.min = hojeConfig;
inputData.value = hojeConfig;

// ================= ABAS =================
function trocarAba(nome, el) {
  document.querySelectorAll(".aba").forEach((aba) => aba.classList.remove("ativa"));
  document.querySelectorAll(".tabs button").forEach((btn) => btn.classList.remove("active"));

  const abaAlvo = document.getElementById(nome);
  if (abaAlvo) abaAlvo.classList.add("ativa");
  if (el) el.classList.add("active");

  const localizacao = document.querySelector(".localizacao");
  const redesSociais = document.querySelector(".redes-sociais");
  const btnWhatsapp = document.querySelector(".cta-whatsapp");

  if (nome === "painel") {
    if (localizacao) localizacao.style.display = "none";
    if (redesSociais) redesSociais.style.display = "none";
    if (btnWhatsapp) btnWhatsapp.style.display = "none";
  } else {
    if (localizacao) localizacao.style.display = "block";
    if (redesSociais) redesSociais.style.display = "block";
    if (btnWhatsapp) btnWhatsapp.style.display = "block";
  }
}

// ================= ADMIN & SEGURANÇA =================
const senhaAdmin = "1234";

function acessarPainel() {
  const senha = prompt("Digite a senha do painel:");
  if (senha === senhaAdmin) {
    trocarAba("painel");
    document.getElementById("btnPainel").style.display = "block";
    carregarAgendamentos();
  } else {
    alert("Senha incorreta!");
  }
}

let cliques = 0;
const header = document.querySelector("header");
if (header) {
  header.addEventListener("click", () => {
    cliques++;
    if (cliques === 5) { acessarPainel(); cliques = 0; }
    setTimeout(() => { cliques = 0; }, 2000);
  });
}

// ================= HELPERS =================
function ehDomingo(data) {
  const [ano, mes, dia] = data.split("-").map(Number);
  const dataLocal = new Date(ano, mes - 1, dia);
  return dataLocal.getDay() === 0;
}

function horarioJaPassou(dataSelecionada, horario) {
  const agora = new Date();
  const [ano, mes, dia] = dataSelecionada.split("-").map(Number);
  const [hora, minuto] = horario.split(":").map(Number);
  const dataHoraHorario = new Date(ano, mes - 1, dia, hora, minuto);
  return dataHoraHorario <= agora;
}

function obterDuracaoSelecionada() {
  const s = servicos.find((s) => s.nome === selectServico.value);
  const c = combos.find((c) => c.nome === selectCombo.value);
  return s ? s.duracao : (c ? c.duracao : 30);
}

function formatarTelefone(valorInput) {
  let tel = valorInput.replace(/\D/g, "").slice(0, 11);
  if (tel.length > 10) tel = tel.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  else if (tel.length > 6) tel = tel.replace(/(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
  else if (tel.length > 2) tel = tel.replace(/(\d{2})(\d+)/, "($1) $2");
  return tel;
}

function limparSelecao(container) {
  if (!container) return;
  container.querySelectorAll(".item-selecao").forEach((el) => el.classList.remove("selecionado"));
}

function atualizarValorSelecionado() {
  const s = servicos.find((s) => s.nome === selectServico.value);
  const c = combos.find((c) => c.nome === selectCombo.value);
  const item = s || c;

  if (item) {
    valor.innerHTML = `
  <div style="display: flex; align-items: center; justify-content: center; gap: 15px; line-height: 1;">
    <strong class="destaque-verdinho" style="font-weight: 800; display: flex; align-items: center;">
      R$ ${item.preco}
    </strong>
    <strong class="destaque-verde" style="font-size: 14px; opacity: 0.9; display: flex; align-items: center; gap: 4px;">
      <i class="fa-solid fa-clock" style="margin-top: 1px;"></i> ${item.duracao} min
    </strong>
  </div>`;
  } else {
    valor.innerHTML = `
      <div class="valor-placeholder">
        <i class="fa-solid fa-wand-magic-sparkles"></i>
        <strong style="font-weight: 600;">Escolha barbeiro e serviço</strong>
      </div>`;
  }
}

function resetarFluxoAgendamento() {
  selectBarbeiro.value = "";
  selectServico.value = "";
  selectCombo.value = "";
  inputNome.value = "";
  inputTelefone.value = "";
  valor.innerHTML = "Escolha um serviço para ver o valor";
  const grid = document.getElementById("gridHorarios");
  if (grid) grid.innerHTML = "";
  if (selectHora) selectHora.value = "";

  limparSelecao(listaBarbeirosSelecionavel);
  limparSelecao(listaServicos);
  limparSelecao(listaCombos);

  document.querySelectorAll(".bloco-minimizado").forEach((bloco) => {
    bloco.classList.remove("bloco-minimizado");
    const resumo = bloco.querySelector(".resumo-selecao");
    if (resumo) resumo.remove();
  });

  if (blocoServicos) blocoServicos.style.display = "none";
  if (blocoCombos) blocoCombos.style.display = "none";
}

function minimizarSecao(idBloco, textoResumo, aoAlterar) {
  const bloco = document.getElementById(idBloco);
  if (!bloco) return;
  bloco.classList.add("bloco-minimizado");
  const antigo = bloco.querySelector(".resumo-selecao");
  if (antigo) antigo.remove();

  const resumo = document.createElement("div");
  resumo.className = "resumo-selecao";
  resumo.innerHTML = `<i class="fa-solid fa-check"></i> Selecionado: <strong>${textoResumo}</strong> <span style="float:right; text-decoration:underline;">Alterar</span>`;
  resumo.onclick = () => {
    bloco.classList.remove("bloco-minimizado");
    resumo.remove();
    if (aoAlterar) aoAlterar();
  };
  bloco.appendChild(resumo);
}

// ================= RENDERIZADORES =================
function renderizarBarbeirosSelecionaveis() {
  if (!listaBarbeirosSelecionavel) return;
  listaBarbeirosSelecionavel.innerHTML = "";
  barbeiros.forEach((b) => {
    const card = document.createElement("div");
    card.className = "item-selecao";
    card.innerHTML = `<img src="${b.foto}" class="item-selecao-img"><span>${b.nome}</span><small>${b.especialidade}</small>`;
    card.addEventListener("click", () => {
      limparSelecao(listaBarbeirosSelecionavel);
      card.classList.add("selecionado");
      selectBarbeiro.value = b.nome;
      setTimeout(() => {
        minimizarSecao("bloco-barbeiro", b.nome);
        if (blocoServicos) blocoServicos.style.display = "block";
        if (blocoCombos) blocoCombos.style.display = "block";
        atualizarHorarios();
      }, 300);
    });
    listaBarbeirosSelecionavel.appendChild(card);
  });
}

function renderizarServicosSelecionaveis() {
  if (!listaServicos) return;
  listaServicos.innerHTML = "";
  servicos.forEach((s) => {
    const card = document.createElement("div");
    card.className = "item-selecao";
    card.innerHTML = `<img src="${s.img}" class="item-selecao-img"><span>${s.nome}</span><small>R$ ${s.preco}</small>`;
    card.addEventListener("click", () => {
      limparSelecao(listaServicos); limparSelecao(listaCombos);
      card.classList.add("selecionado");
      selectServico.value = s.nome; selectCombo.value = "";
      atualizarValorSelecionado();
      setTimeout(() => {
        minimizarSecao("bloco-servicos", s.nome, () => { if (blocoCombos) blocoCombos.style.display = "block"; });
        if (blocoCombos) blocoCombos.style.display = "none";
        atualizarHorarios();
      }, 300);
    });
    listaServicos.appendChild(card);
  });
}

function renderizarCombosSelecionaveis() {
  if (!listaCombos) return;
  listaCombos.innerHTML = "";
  combos.forEach((c) => {
    const card = document.createElement("div");
    card.className = "item-selecao";
    card.innerHTML = `<img src="${c.img}" class="item-selecao-img"><span>${c.nome}</span><small>R$ ${c.preco}</small>`;
    card.addEventListener("click", () => {
      limparSelecao(listaCombos); limparSelecao(listaServicos);
      card.classList.add("selecionado");
      selectCombo.value = c.nome; selectServico.value = "";
      atualizarValorSelecionado();
      setTimeout(() => {
        minimizarSecao("bloco-combos", c.nome, () => { if (blocoServicos) blocoServicos.style.display = "block"; });
        if (blocoServicos) blocoServicos.style.display = "none";
        atualizarHorarios();
      }, 300);
    });
    listaCombos.appendChild(card);
  });
}

function renderizarProdutos() {
  if (!listaProdutos) return;
  listaProdutos.innerHTML = "";
  produtos.forEach((p) => {
    const card = document.createElement("div");
    card.className = "item-selecao";
    if (carrinho.some((item) => item.nome === p.nome)) card.classList.add("selecionado");
    card.innerHTML = `<img src="${p.img}" class="item-selecao-img"><span>${p.nome}</span><small>R$ ${p.preco}</small>`;
    card.addEventListener("click", () => alternarNoCarrinho(p, card));
    listaProdutos.appendChild(card);
  });
}

function alternarNoCarrinho(produto, elemento) {
  const index = carrinho.findIndex((item) => item.nome === produto.nome);
  if (index > -1) { carrinho.splice(index, 1); elemento.classList.remove("selecionado"); }
  else { carrinho.push(produto); elemento.classList.add("selecionado"); }
  atualizarInterfaceCarrinho();
}

function atualizarInterfaceCarrinho() {
  const barra = document.getElementById("barraCarrinho");
  const totalTxt = document.getElementById("totalCarrinho");
  const total = carrinho.reduce((sum, item) => sum + item.preco, 0);
  if (carrinho.length > 0) { barra.style.display = "block"; totalTxt.innerText = `R$ ${total}`; }
  else { barra.style.display = "none"; }
}

function finalizarPedidoCarrinho() {
  if (carrinho.length === 0) return;
  const itens = carrinho.map((p) => `- ${p.nome} (R$ ${p.preco})`).join("\n");
  const total = carrinho.reduce((sum, item) => sum + item.preco, 0);
  const msg = `*Novo Pedido - JR Barbearia*\n\nQuero os seguintes produtos:\n${itens}\n\n*Total: R$ ${total}*`;
  window.open(`https://api.whatsapp.com/send?phone=5575981080660&text=${encodeURIComponent(msg)}`, '_blank');
}

// ================= HORÁRIOS =================
// Funções auxiliares para cálculo de conflito
function horarioParaMinutos(horario) {
  const [h, m] = horario.split(":").map(Number);
  return h * 60 + m;
}

function horariosConflitam(horaInicio1, duracao1, horaInicio2, duracao2 = 30) {
  const inicio1 = horarioParaMinutos(horaInicio1);
  const fim1 = inicio1 + duracao1;
  const inicio2 = horarioParaMinutos(horaInicio2);
  const fim2 = inicio2 + duracao2;
  return inicio1 < fim2 && inicio2 < fim1;
}

// Sua função atualizarHorarios corrigida
async function atualizarHorarios() {
  const dataSel = inputData.value;
  const barbSel = selectBarbeiro.value;
  const grid = document.getElementById("gridHorarios");
  const inputHiddenHora = document.getElementById("hora");

  if (!dataSel || !barbSel) return;

  grid.innerHTML = `
    <div class="loading-horarios">
      <i class="fa-solid fa-circle-notch fa-spin"></i>
      <span>Buscando horários disponíveis...</span>
    </div>
  `;

  if (ehDomingo(dataSel)) {
    grid.innerHTML = `<div class="chip-horario indisponivel" style="grid-column: 1/-1; width: 100%;">Não atendemos aos domingos</div>`;
    return;
  }

  try {
    const res = await fetch(`${API_URL}/horarios?data=${dataSel}&barbeiro=${encodeURIComponent(barbSel)}`);
    
    if (!res.ok) throw new Error("Erro ao buscar dados");
    
    const ocupados = await res.json(); 

    grid.innerHTML = ""; 
    const hoje = new Date().toISOString().split("T")[0];
    const duracaoSel = obterDuracaoSelecionada();

    horarios.forEach((h) => {
      const jaPassou = dataSel === hoje && horarioJaPassou(dataSel, h);

      // Agora a função horariosConflitam existe e será encontrada aqui
      const conflita = ocupados.some((o) => {
        const horaOcupada = o.hora.slice(0, 5); 
        const duracaoOcupada = o.duracao || 30;
        return horariosConflitam(h, duracaoSel, horaOcupada, duracaoOcupada);
      });

      const chip = document.createElement("div");
      chip.className = "chip-horario";
      chip.innerText = h;

      if (conflita || jaPassou) {
        chip.classList.add("indisponivel");
      } else {
        chip.addEventListener("click", () => {
          document.querySelectorAll(".chip-horario").forEach((c) => c.classList.remove("ativo"));
          chip.classList.add("ativo");
          if (inputHiddenHora) inputHiddenHora.value = h;
        });
      }
      grid.appendChild(chip);
    });

  } catch (err) {
    console.error("Erro ao carregar horários:", err);
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:#e74c3c;">Erro ao carregar horários. Tente novamente.</p>`;
  }
}
// ================= AGENDAR =================
formAgendamento.addEventListener("submit", async (e) => {
  e.preventDefault();
  const selecionado = selectServico.value || selectCombo.value;
  
  if (!selectBarbeiro.value || !selecionado || !inputData.value || !selectHora.value) { 
    alert("Preencha tudo!"); 
    return; 
  }

  const agendamento = {
    barbeiro: selectBarbeiro.value,
    servico: selecionado,
    data: inputData.value,
    hora: selectHora.value,
    nome: inputNome.value.trim(),
    telefone: inputTelefone.value,
    duracao: obterDuracaoSelecionada(),
  };

  try {
    const res = await fetch(`${API_URL}/agendar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(agendamento),
    });

    if (!res.ok) throw new Error();
    
    alert("Agendamento realizado com sucesso!");

    if (confirm("Deseja enviar o comprovante pelo WhatsApp?")) {
      const msg = `Agendamento JR Barbearia: ${agendamento.servico} com ${agendamento.barbeiro} dia ${agendamento.data} às ${agendamento.hora}`;
      window.open(`https://api.whatsapp.com/send?phone=5575981080660&text=${encodeURIComponent(msg)}`, '_blank');
    }

    // Limpa o formulário e o fluxo visual
    formAgendamento.reset(); 
    resetarFluxoAgendamento();

    // FORÇA O RECARREGAMENTO LIMPO (Evita versão antiga)
    // O "?v=" gera um número único baseado na hora atual, obrigando o navegador a atualizar
    const novaVersao = window.location.pathname + "?v=" + Date.now();
    window.location.replace(novaVersao);

  } catch (err) { 
    alert("Erro ao agendar. Verifique sua conexão."); 
  }
});
// ================= PAINEL ADMIN =================
async function deletar(id) {
  if (!confirm("Excluir agendamento?")) return;
  try {
    const res = await fetch(`${API_URL}/agendamentos/${id}`, { method: "DELETE" });
    if (res.ok) carregarAgendamentos();
  } catch (err) { alert("Erro ao excluir."); }
}

async function concluir(id) {
  try {
    // 1. Busca os dados atuais antes de deletar para saber o valor
    const resAgendamentos = await fetch(`${API_URL}/agendamentos`);
    const dados = await resAgendamentos.json();
    const agendamento = dados.find(a => a.id === id);

    if (agendamento) {
      // 2. Acha o preço do serviço/combo
      const item = servicos.find(s => s.nome === agendamento.servico) || 
                   combos.find(c => c.nome === agendamento.servico);
      const valorServico = item ? item.preco : 0;

      // 3. Salva no faturamento do dia (localStorage)
      const hoje = new Date().toISOString().split("T")[0];
      const chaveFaturamento = `faturamento_${hoje}`;
      let faturamentoAtual = parseFloat(localStorage.getItem(chaveFaturamento)) || 0;
      
      localStorage.setItem(chaveFaturamento, faturamentoAtual + valorServico);
    }

    // 4. Deleta o agendamento normalmente
    const resDelete = await fetch(`${API_URL}/agendamentos/${id}`, { method: "DELETE" });

    if (resDelete.ok) {
      alert("✅ Serviço concluído e valor somado ao caixa!");
      carregarAgendamentos();
    }
  } catch (err) {
    alert("Erro ao concluir agendamento.");
  }
}

async function carregarAgendamentos() {
  try {
    const res = await fetch(`${API_URL}/agendamentos`);
    const dados = await res.json();
    
    // Pega a data de hoje no formato YYYY-MM-DD
    const hojeObj = new Date();
    const hojeStr = hojeObj.toISOString().split("T")[0];

    // --- LÓGICA DE AUTO-LIMPEZA (DIAS PASSADOS) ---
    dados.forEach(async (a) => {
      const dataAgendamento = a.data.split("T")[0];
      // Se a data do agendamento for menor que hoje, apaga do banco
      if (dataAgendamento < hojeStr) {
        await fetch(`${API_URL}/agendamentos/${a.id}`, { method: "DELETE" });
      }
    });

    // Filtra apenas o que sobrou (Hoje e Futuro) para exibir na tela
    const dadosFiltrados = dados.filter(a => a.data.split("T")[0] >= hojeStr);
    
    // Puxa o faturamento salvo no localStorage para HOJE
    const faturamentoRealizado = parseFloat(localStorage.getItem(`faturamento_${hojeStr}`)) || 0;
    const agendadosHoje = dadosFiltrados.filter(a => a.data.split("T")[0] === hojeStr);

    // Atualiza o resumo no topo
    const resumo = document.getElementById("resumoPainel");
    if (resumo) {
      resumo.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(46,204,113,0.1); padding:12px; border-radius:8px; border:1px solid rgba(46,204,113,0.2);">
          <div style="text-align:left;">
            <span style="font-size:11px; opacity:0.8; display:block; text-transform:uppercase;">Pendentes Hoje</span>
            <strong style="font-size:18px;">${agendadosHoje.length}</strong>
          </div>
          <div style="text-align:right;">
            <span style="font-size:11px; opacity:0.8; display:block; text-transform:uppercase;">Caixa Hoje</span>
            <strong style="font-size:18px; color:#2ecc71;">R$ ${faturamentoRealizado.toFixed(2)}</strong>
          </div>
        </div>`;
    }

    // Renderiza a lista na tela
    listaAdmin.innerHTML = "";
    
    // Ordena por data e hora
    dadosFiltrados.sort((a,b) => a.data.localeCompare(b.data) || a.hora.localeCompare(b.hora));

    if (dadosFiltrados.length === 0) {
      listaAdmin.innerHTML = "<p style='text-align:center; margin-top:20px; opacity:0.5;'>Nenhum agendamento futuro.</p>";
      return;
    }

    dadosFiltrados.forEach((a) => {
      const dataFormatada = a.data.split("T")[0].split("-").reverse().slice(0,2).join("/");
      const li = document.createElement("li");
      li.className = "admin-card visible";
      li.innerHTML = `
        <div class="admin-info">
          <h4 style="margin:0;">${a.nome}</h4>
          <p style="margin:5px 0; font-size:13px; opacity:0.9;">
            <strong>✂️ Serviço:</strong> ${a.servico} <br>
            <strong>📅 Data:</strong> ${dataFormatada} às ${a.hora.slice(0,5)}h
          </p>
          <div class="admin-acoes" style="display:flex; gap:10px; margin-top:10px;">
            <button onclick="concluir(${a.id})" style="flex:1; background:#2ecc71; color:white; border:none; padding:8px; border-radius:5px; cursor:pointer;">Concluir</button>
            <button onclick="deletar(${a.id})" style="flex:1; background:#e74c3c; color:white; border:none; padding:8px; border-radius:5px; cursor:pointer;">Excluir</button>
          </div>
        </div>`;
      listaAdmin.appendChild(li);
    });

  } catch (err) { 
    console.error("Erro ao carregar e limpar agendamentos:", err); 
  }
}
// ================= LOAD =================
window.addEventListener("load", () => {
  renderizarProdutos();
  renderizarBarbeirosSelecionaveis();
  renderizarServicosSelecionaveis();
  renderizarCombosSelecionaveis();
  if (loading) {
    setTimeout(() => { loading.style.opacity = "0"; setTimeout(() => loading.style.display = "none", 400); }, 800);
  }
});

inputData.addEventListener("change", atualizarHorarios);
inputTelefone.addEventListener("input", (e) => e.target.value = formatarTelefone(e.target.value));