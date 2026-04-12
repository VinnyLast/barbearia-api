let carrinho = [];
// ================= DADOS =================
const API_URL = "https://barbearia-api-23on.onrender.com";

const barbeiros = [
  {
    nome: "Junior Ferreira",
    especialidade: "Corte social e degradê",
    foto: "images/junior.png",
  },
  {
    nome: "Diego Alves",
    especialidade: "Barba e acabamento",
    foto: "images/diego.png",
  },
  {
    nome: "Samuel Santos",
    especialidade: "Cortes modernos",
    foto: "images/samuel.png",
  },
  {
    nome: "Rian Lukas",
    especialidade: "Cortes modernos e freestyle",
    foto: "images/lukas.png",
  },
  {
    nome: "Douglas",
    especialidade: "Barba e acabamento",
    foto: "images/douglas.png",
  },
];

const servicos = [
  { nome: "Corte", preco: 25, duracao: 40, img: "images/corte.png" },
  { nome: "Barba", preco: 15, duracao: 20, img: "images/barba.png" },
  { nome: "Pezinho", preco: 10, duracao: 10, img: "images/pezinho.jpeg" },
  { nome: "Luzes", preco: 60, duracao: 30, img: "images/luzes.png" },
  { nome: "Platinado", preco: 80, duracao: 60, img: "images/platinado.png" },
  { nome: "Botox", preco: 50, duracao: 40, img: "images/botox.jpeg" },
  {
    nome: "Barboterapia",
    preco: 40,
    duracao: 30,
    img: "images/barboterapia.jpeg",
  },
  {
    nome: "Pigmentação",
    preco: 30,
    duracao: 25,
    img: "images/pigmentacao.jpeg",
  },
  { nome: "Hidratação", preco: 35, duracao: 30, img: "images/hidratacao.png" },
  {
    nome: "Sobrancelha (máquina e tesoura)",
    preco: 15,
    duracao: 15,
    img: "images/sobrancelha.jpeg",
  },
  { nome: "Freestyle", preco: 20, duracao: 20, img: "images/freestyle.png" },
  {
    nome: "Depilação (orelha e nariz)",
    preco: 15,
    duracao: 15,
    img: "images/depilacao.jpeg",
  },
  {
    nome: "Limpeza facial",
    preco: 25,
    duracao: 30,
    img: "images/limpeza.jpeg",
  },
];

const combos = [
  {
    nome: "Corte + Barba",
    preco: 40,
    duracao: 60,
    img: "images/corte+barba.png",
  },
  {
    nome: "Corte + Luzes",
    preco: 75,
    duracao: 70,
    img: "images/corte+luzes.png",
  },
  {
    nome: "Corte + Platinado",
    preco: 95,
    duracao: 90,
    img: "images/corte+platinado.png",
  },
  {
    nome: "Corte + Sobrancelha",
    preco: 35,
    duracao: 55,
    img: "images/corte+sobrancelha.png",
  },
];

const produtos = [
  { nome: "Pomada", preco: 25, img: "images/pomada.png" },
  { nome: "Shampoo", preco: 30, img: "images/shampoo.png" },
  { nome: "Óleo para barba", preco: 20, img: "images/oleo.gif" },
];

const horarios = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];

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
const listaBarbeirosSelecionavel = document.getElementById(
  "listaBarbeirosSelecionavel",
);
const listaServicos = document.getElementById("listaServicos");
const listaCombos = document.getElementById("listaCombos");
const loading = document.getElementById("loading");

// Seleciona os blocos pais para esconder/mostrar (Certifique-se de ter os IDs no HTML)
const blocoServicos =
  document.getElementById("bloco-servicos") ||
  (listaServicos ? listaServicos.parentElement : null);
const blocoCombos =
  document.getElementById("bloco-combos") ||
  (listaCombos ? listaCombos.parentElement : null);

// ================= CONFIG =================
inputData.min = new Date().toISOString().split("T")[0];

// ================= ABAS =================
function trocarAba(nome, el) {
  document
    .querySelectorAll(".aba")
    .forEach((aba) => aba.classList.remove("ativa"));
  document
    .querySelectorAll(".tabs button")
    .forEach((btn) => btn.classList.remove("active"));

  const abaAlvo = document.getElementById(nome);
  if (abaAlvo) abaAlvo.classList.add("ativa");
  if (el) el.classList.add("active");

  // SELEÇÃO DOS ELEMENTOS EXTRAS
  const localizacao = document.querySelector(".localizacao");
  const redesSociais = document.querySelector(".redes-sociais");
  const btnWhatsapp = document.querySelector(".cta-whatsapp"); // Seleciona o botão fixo do Zap

  // LÓGICA DE VISIBILIDADE
  if (nome === "painel") {
    if (localizacao) localizacao.style.display = "none";
    if (redesSociais) redesSociais.style.display = "none";
    if (btnWhatsapp) btnWhatsapp.style.display = "none"; // Esconde no painel
  } else {
    if (localizacao) localizacao.style.display = "block";
    if (redesSociais) redesSociais.style.display = "block";
    if (btnWhatsapp) btnWhatsapp.style.display = "block"; // Mostra nas outras abas
  }
}

// ================= ADMIN =================
const senhaAdmin = "1234";

function acessarPainel() {
  const senha = prompt("Digite a senha do painel:");

  if (senha === senhaAdmin) {
    trocarAba("painel");
    document.getElementById("btnPainel").style.display = "block"; // Mostra o botão após logar
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
    if (cliques === 5) {
      acessarPainel();
      cliques = 0;
    }
    setTimeout(() => {
      cliques = 0;
    }, 2000);
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
  if (selectServico.value) {
    const s = servicos.find((s) => s.nome === selectServico.value);
    return s ? s.duracao : 30;
  }
  if (selectCombo.value) {
    const c = combos.find((c) => c.nome === selectCombo.value);
    return c ? c.duracao : 30;
  }
  return 30;
}

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

function formatarTelefone(valorInput) {
  let tel = valorInput.replace(/\D/g, "").slice(0, 11);
  if (tel.length > 10) tel = tel.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  else if (tel.length > 6)
    tel = tel.replace(/(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
  else if (tel.length > 2) tel = tel.replace(/(\d{2})(\d+)/, "($1) $2");
  else if (tel.length > 0) tel = tel.replace(/(\d*)/, "($1");
  return tel;
}

function limparSelecao(container) {
  if (!container) return;
  container
    .querySelectorAll(".item-selecao")
    .forEach((el) => el.classList.remove("selecionado"));
}

function atualizarValorSelecionado() {
  const s = servicos.find((s) => s.nome === selectServico.value);
  const c = combos.find((c) => c.nome === selectCombo.value);
  const item = s || c; // Pega o que estiver selecionado

  if (item) {
    valor.innerHTML = `
      <span class="destaque-verdinho">R$ ${item.preco}</span> 
      <br> 
      <small class="destaque-verde">
        <i class="fa-solid fa-clock"></i> ${item.duracao} min de serviço
      </small>
    `;
  } else {
    valor.innerHTML = "Escolha um serviço para ver o valor";
  }
}

function resetarFluxoAgendamento() {
  // Limpa os valores lógicos
  selectBarbeiro.value = "";
  selectServico.value = "";
  selectCombo.value = "";
  inputNome.value = "";
  inputTelefone.value = "";
  valor.innerHTML = "Escolha um serviço para ver o valor";

  // Limpa o grid visual de horários e o input de hora
  const grid = document.getElementById("gridHorarios");
  if (grid) grid.innerHTML = "";
  const inputHora = document.getElementById("hora");
  if (inputHora) inputHora.value = "";

  // Remove as classes de 'selecionado' de todos os cards
  limparSelecao(listaBarbeirosSelecionavel);
  limparSelecao(listaServicos);
  limparSelecao(listaCombos);

  // Remove os resumos de "Selecionado: ..." e expande os blocos novamente
  document.querySelectorAll(".bloco-minimizado").forEach((bloco) => {
    bloco.classList.remove("bloco-minimizado");
    const resumo = bloco.querySelector(".resumo-selecao");
    if (resumo) resumo.remove();
  });

  // Esconde as seções de serviço/combo (reinicia o fluxo)
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
  resumo.innerHTML = `<i class="fa-solid fa-check"></i> Selecionado: <strong>${textoResumo}</strong> <span style="float:right; font-size:10px; text-decoration:underline; cursor:pointer;">Alterar</span>`;

  resumo.onclick = () => {
    bloco.classList.remove("bloco-minimizado");
    resumo.remove();
    // Se passarmos uma função para quando alterar, ela é executada aqui
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
    card.innerHTML = `<img src="${b.foto}" alt="${b.nome}" class="item-selecao-img"><span>${b.nome}</span><small>${b.especialidade}</small>`;
    card.addEventListener("click", () => {
      limparSelecao(listaBarbeirosSelecionavel);
      card.classList.add("selecionado");
      selectBarbeiro.value = b.nome;

      // Minimiza o barbeiro
      minimizarSecao("bloco-barbeiro", b.nome);

      // Garante que Serviços e Combos apareçam para ele escolher
      if (blocoServicos) blocoServicos.style.display = "block";
      if (blocoCombos) blocoCombos.style.display = "block";

      selectServico.value = "";
      selectCombo.value = "";
      valor.textContent = "";
      limparSelecao(listaServicos);
      limparSelecao(listaCombos);
      atualizarHorarios();
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
    card.innerHTML = `<img src="${s.img}" alt="${s.nome}" class="item-selecao-img"><span>${s.nome}</span><small>R$ ${s.preco}</small>`;
    card.addEventListener("click", () => {
      limparSelecao(listaServicos);
      limparSelecao(listaCombos);
      card.classList.add("selecionado");
      selectServico.value = s.nome;
      selectCombo.value = "";
      atualizarValorSelecionado();
      atualizarHorarios();

      // MÁGICA: Minimiza os serviços e esconde os combos
      minimizarSecao("bloco-servicos", s.nome, () => {
        // Se clicar em 'Alterar', os combos voltam a aparecer
        if (blocoCombos) blocoCombos.style.display = "block";
      });
      if (blocoCombos) blocoCombos.style.display = "none";
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
    card.innerHTML = `<img src="${c.img}" alt="${c.nome}" class="item-selecao-img"><span>${c.nome}</span><small>R$ ${c.preco}</small>`;
    card.addEventListener("click", () => {
      limparSelecao(listaCombos);
      limparSelecao(listaServicos);
      card.classList.add("selecionado");
      selectCombo.value = c.nome;
      selectServico.value = "";
      atualizarValorSelecionado();
      atualizarHorarios();

      // MÁGICA: Minimiza os combos e esconde os serviços
      minimizarSecao("bloco-combos", c.nome, () => {
        // Se clicar em 'Alterar', os serviços voltam a aparecer
        if (blocoServicos) blocoServicos.style.display = "block";
      });
      if (blocoServicos) blocoServicos.style.display = "none";
    });
    listaCombos.appendChild(card);
  });
}

function renderizarProdutos() {
  if (!listaProdutos) return;
  listaProdutos.innerHTML = "";

  produtos.forEach((p) => {
    const card = document.createElement("div");
    card.className = "item-selecao"; // Usa o mesmo estilo dos outros

    // Verifica se o produto já está no carrinho para manter a classe 'selecionado' ao trocar de aba
    if (carrinho.some((item) => item.nome === p.nome)) {
      card.classList.add("selecionado");
    }

    card.innerHTML = `
      <img src="${p.img}" alt="${p.nome}" class="item-selecao-img">
      <span>${p.nome}</span>
      <small>R$ ${p.preco}</small>
    `;

    card.addEventListener("click", () => {
      alternarNoCarrinho(p, card);
    });

    listaProdutos.appendChild(card);
  });
}

function alternarNoCarrinho(produto, elemento) {
  const index = carrinho.findIndex((item) => item.nome === produto.nome);

  if (index > -1) {
    // Se já está no carrinho, remove
    carrinho.splice(index, 1);
    elemento.classList.remove("selecionado");
  } else {
    // Se não está, adiciona
    carrinho.push(produto);
    elemento.classList.add("selecionado");
  }

  atualizarInterfaceCarrinho();
}

function atualizarInterfaceCarrinho() {
  const barra = document.getElementById("barraCarrinho");
  const totalTxt = document.getElementById("totalCarrinho");

  const total = carrinho.reduce((sum, item) => sum + item.preco, 0);

  if (carrinho.length > 0) {
    barra.style.display = "block";
    totalTxt.innerText = `R$ ${total}`;
  } else {
    barra.style.display = "none";
  }
}

function finalizarPedidoCarrinho() {
  // Se o carrinho estiver vazio, não faz nada
  if (carrinho.length === 0) return;

  // Monta a lista de produtos um embaixo do outro
  const itens = carrinho.map((p) => `- ${p.nome} (R$ ${p.preco})`).join("\n");

  // Calcula o total
  const total = carrinho.reduce((sum, item) => sum + item.preco, 0);

  // Monta a mensagem e envia para o WhatsApp
  const num = "5575981080660";
  const msg = `*Novo Pedido - JR Barbearia*\n\nQuero os seguintes produtos:\n${itens}\n\n*Total: R$ ${total}*`;

  window.location.href = `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
}
function renderizarBarbeiros() {
  if (!listaBarbeiros) return;
  listaBarbeiros.innerHTML = "";
  barbeiros.forEach((b) => {
    listaBarbeiros.innerHTML += `<div class="barbeiro-card"><img src="${b.foto}" class="barbeiro-img"><div class="barbeiro-info"><h3>${b.nome}</h3><p>${b.especialidade}</p></div></div>`;
  });
}

// ================= HORÁRIOS =================
async function atualizarHorarios() {
  const dataSel = inputData.value;
  const barbSel = selectBarbeiro.value;
  const grid = document.getElementById("gridHorarios");
  const inputHiddenHora = document.getElementById("hora");

  if (!dataSel || !barbSel) return;

  // ANIMAÇÃO DE CARREGANDO COM ÍCONE GIRATÓRIO
  grid.innerHTML = `
    <div class="loading-horarios">
      <i class="fa-solid fa-circle-notch fa-spin"></i>
      <span>Buscando horários disponíveis...</span>
    </div>
  `;

  if (ehDomingo(dataSel)) {
    grid.innerHTML = `<div class="chip-horario indisponivel" style="grid-column: span 3; width: 100%;">Não atendemos aos domingos</div>`;
    return;
  }

  try {
    const res = await fetch(
      `${API_URL}/horarios?data=${dataSel}&barbeiro=${encodeURIComponent(barbSel)}`,
    );
    const ocupados = await res.json();

    grid.innerHTML = ""; // Limpa a animação
    const hoje = new Date().toISOString().split("T")[0];
    const duracaoSel = obterDuracaoSelecionada();

    horarios.forEach((h) => {
      const conflita = ocupados.some((o) =>
        horariosConflitam(h, duracaoSel, o.hora.slice(0, 5), o.duracao || 30),
      );

      const jaPassou = dataSel === hoje && horarioJaPassou(dataSel, h);

      const chip = document.createElement("div");
      chip.classList.add("chip-horario");
      chip.innerText = h;

      if (conflita || jaPassou) {
        chip.classList.add("indisponivel");
      } else {
        chip.addEventListener("click", () => {
          document
            .querySelectorAll(".chip-horario")
            .forEach((c) => c.classList.remove("ativo"));
          chip.classList.add("ativo");
          inputHiddenHora.value = h;
        });
      }
      grid.appendChild(chip);
    });
  } catch (err) {
    grid.innerHTML =
      "<p style='grid-column: 1/-1; text-align:center;'>Erro ao carregar horários.</p>";
  }
}

inputData.addEventListener("change", atualizarHorarios);
inputTelefone.addEventListener("input", (e) => {
  e.target.value = formatarTelefone(e.target.value);
});

// ================= AGENDAR =================
// ================= AGENDAR =================
formAgendamento.addEventListener("submit", async (e) => {
  e.preventDefault();
  const selecionado = selectServico.value || selectCombo.value;

  if (
    !selectBarbeiro.value ||
    !selecionado ||
    !inputData.value ||
    !document.getElementById("hora").value
  ) {
    alert("Preencha todos os campos!");
    return;
  }

  const agendamento = {
    barbeiro: selectBarbeiro.value,
    servico: selecionado,
    data: inputData.value,
    hora: document.getElementById("hora").value,
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

    if (!res.ok) throw new Error("Erro na API");

    alert("Agendamento realizado com sucesso!");

    const querEnviarWhats = confirm("Deseja enviar o comprovante para o WhatsApp?");

    if (querEnviarWhats) {
      const msg = `Olá, agendamento na JR Barbearia:\n\nBarbeiro: ${agendamento.barbeiro}\nServiço: ${agendamento.servico}\nData: ${agendamento.data}\nHorário: ${agendamento.hora}\n\nNome: ${agendamento.nome}`;
      window.open(`https://wa.me/5575981080660?text=${encodeURIComponent(msg)}`, "_blank");
    }

    formAgendamento.reset();
    resetarFluxoAgendamento();

  } catch (err) {
    alert("Não foi possível concluir o agendamento.");
  }
});

// ================= PAINEL =================
async function carregarAgendamentos() {
  try {
    const res = await fetch(`${API_URL}/agendamentos`);
    const dados = await res.json();

    // 1. Pega a data de hoje no formato YYYY-MM-DD
    const hoje = new Date().toISOString().split("T")[0];

    // 2. Filtra apenas os agendamentos de hoje
    const agendamentosDeHoje = dados.filter((a) => a.data === hoje);

    // 3. Calcula o valor total somando o preço de cada serviço/combo de hoje
    const faturamentoHoje = agendamentosDeHoje.reduce((total, a) => {
      // Procura o preço no array de serviços ou de combos
      const item =
        servicos.find((s) => s.nome === a.servico) ||
        combos.find((c) => c.nome === a.servico);
      return total + (item ? item.preco : 0);
    }, 0);

    // 4. Atualiza o texto no topo do painel
    const elementoResumo = document.getElementById("resumoPainel");
    if (elementoResumo) {
      elementoResumo.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>📅 Hoje: <strong>${agendamentosDeHoje.length}</strong> cortes</span>
          <span>💰 Total: <strong style="color: #2ecc71;">R$ ${faturamentoHoje}</strong></span>
        </div>
      `;
    }

    // 5. Renderiza a lista de cards (o código que já tínhamos)
    listaAdmin.innerHTML = "";
    if (dados.length === 0) {
      listaAdmin.innerHTML =
        "<p style='text-align:center; opacity:0.5;'>Nenhum agendamento encontrado.</p>";
      return;
    }

    // Ordenar para mostrar os mais próximos primeiro
    dados.sort(
      (a, b) => a.data.localeCompare(b.data) || a.hora.localeCompare(b.hora),
    );

    dados.forEach((a) => {
      // Pega apenas os primeiros 10 caracteres (YYYY-MM-DD) antes de formatar
      const dataApenas = a.data.split("T")[0];
      const dataFormatada = dataApenas
        .split("-")
        .reverse()
        .slice(0, 2)
        .join("/");
      const li = document.createElement("li");
      li.className = "admin-card visible";

      li.innerHTML = `
        <div class="admin-info">
          <h4>${a.nome}</h4>
          <div class="admin-detalhes">
            <strong>✂️ Serviço:</strong> ${a.servico}<br>
            <strong>📅 Data:</strong> ${dataFormatada} às ${a.hora.slice(0, 5)}h<br>
            <strong>💈 Barbeiro:</strong> ${a.barbeiro}<br>
            <strong>📞 Tel:</strong> ${a.telefone}
          </div>
          <button class="btn-deletar" onclick="deletar(${a.id})">
            <i class="fa-solid fa-trash"></i> Excluir
          </button>
        </div>
        <div style="clear: both;"></div>
      `;
      listaAdmin.appendChild(li);
    });
  } catch (err) {
    console.error("Erro ao carregar painel:", err);
    listaAdmin.innerHTML = "<p>Erro ao carregar dados.</p>";
  }
}

// ================= LOAD =================
window.addEventListener("load", () => {
  renderizarProdutos();
  renderizarBarbeiros();
  renderizarBarbeirosSelecionaveis();
  renderizarServicosSelecionaveis();
  renderizarCombosSelecionaveis();
  resetarFluxoAgendamento();

  if (loading) {
    setTimeout(() => {
      loading.style.opacity = "0";
      setTimeout(() => {
        loading.style.display = "none";
      }, 400);
    }, 800);
  }
});

// Faz os elementos aparecerem conforme o usuário rola a página
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.1 },
);

// Aplica aos cards e seções
document
  .querySelectorAll(".card, .barbeiro-card, .item-selecao")
  .forEach((el) => {
    el.classList.add("fade-up");
    observer.observe(el);
});
