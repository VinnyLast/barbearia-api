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
  { nome: "Corte", preco: 25, duracao: 40, img: "images/servico-corte.jpg" },
  { nome: "Barba", preco: 15, duracao: 20, img: "images/servico-barba.jpg" },
  { nome: "Pezinho", preco: 10, duracao: 10, img: "images/servico-pezinho.jpg" },
  { nome: "Luzes", preco: 60, duracao: 30, img: "images/servico-luzes.jpg" },
  { nome: "Platinado", preco: 80, duracao: 60, img: "images/servico-platinado.jpg" },
  { nome: "Botox", preco: 50, duracao: 40, img: "images/servico-botox.jpg" },
  { nome: "Barboterapia", preco: 40, duracao: 30, img: "images/servico-barboterapia.jpg" },
  { nome: "Pigmentação", preco: 30, duracao: 25, img: "images/servico-pigmentacao.jpg" },
  { nome: "Hidratação", preco: 35, duracao: 30, img: "images/servico-hidratacao.jpg" },
  { nome: "Sobrancelha (máquina e tesoura)", preco: 15, duracao: 15, img: "images/servico-sobrancelha.jpg" },
  { nome: "Freestyle", preco: 20, duracao: 20, img: "images/servico-freestyle.jpg" },
  { nome: "Depilação (orelha e nariz)", preco: 15, duracao: 15, img: "images/servico-depilacao.jpg" },
  { nome: "Limpeza facial", preco: 25, duracao: 30, img: "images/servico-limpeza.jpg" },
];

const combos = [
  { nome: "Corte + Barba", preco: 40, duracao: 60, img: "images/combo-corte-barba.jpg" },
  { nome: "Corte + Luzes", preco: 75, duracao: 70, img: "images/combo-corte-luzes.jpg" },
  { nome: "Corte + Platinado", preco: 95, duracao: 90, img: "images/combo-corte-platinado.jpg" },
  { nome: "Corte + Sobrancelha", preco: 35, duracao: 55, img: "images/combo-corte-sobrancelha.jpg" },
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
const listaBarbeirosSelecionavel = document.getElementById("listaBarbeirosSelecionavel");
const listaServicos = document.getElementById("listaServicos");
const listaCombos = document.getElementById("listaCombos");
const loading = document.getElementById("loading");

const blocoServicos = listaServicos ? listaServicos.parentElement : null;
const blocoCombos = listaCombos ? listaCombos.parentElement : null;

// ================= CONFIG =================
inputData.min = new Date().toISOString().split("T")[0];

// ================= ABAS =================
function trocarAba(nome, el) {
  document.querySelectorAll(".aba").forEach((aba) => aba.classList.remove("ativa"));
  document.querySelectorAll(".tabs button").forEach((btn) => btn.classList.remove("active"));

  document.getElementById(nome).classList.add("ativa");
  if (el) el.classList.add("active");
}

// ================= ADMIN =================
const senhaAdmin = "1234";

function acessarPainel() {
  const senha = prompt("Digite a senha do painel:");

  if (senha === senhaAdmin) {
    trocarAba("painel");
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
    const servico = servicos.find((s) => s.nome === selectServico.value);
    return servico ? servico.duracao : 30;
  }

  if (selectCombo.value) {
    const combo = combos.find((c) => c.nome === selectCombo.value);
    return combo ? combo.duracao : 30;
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
  let telefone = valorInput.replace(/\D/g, "").slice(0, 11);

  if (telefone.length > 10) {
    telefone = telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (telefone.length > 6) {
    telefone = telefone.replace(/(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
  } else if (telefone.length > 2) {
    telefone = telefone.replace(/(\d{2})(\d+)/, "($1) $2");
  } else if (telefone.length > 0) {
    telefone = telefone.replace(/(\d*)/, "($1");
  }

  return telefone;
}

function limparSelecao(container) {
  if (!container) return;
  container.querySelectorAll(".item-selecao").forEach((el) => {
    el.classList.remove("selecionado");
  });
}

function atualizarValorSelecionado() {
  const servico = servicos.find((s) => s.nome === selectServico.value);
  const combo = combos.find((c) => c.nome === selectCombo.value);

  if (servico) {
    valor.textContent = `Valor: R$ ${servico.preco} • Duração: ${servico.duracao} min`;
    return;
  }

  if (combo) {
    valor.textContent = `Valor: R$ ${combo.preco} • Duração: ${combo.duracao} min`;
    return;
  }

  valor.textContent = "";
}

function resetarFluxoAgendamento() {
  selectBarbeiro.value = "";
  selectServico.value = "";
  selectCombo.value = "";
  valor.textContent = "";
  selectHora.innerHTML = `<option value="">Selecione um horário</option>`;

  limparSelecao(listaBarbeirosSelecionavel);
  limparSelecao(listaServicos);
  limparSelecao(listaCombos);

  if (blocoServicos) blocoServicos.style.display = "none";
  if (blocoCombos) blocoCombos.style.display = "none";
}

// ================= AGENDAMENTO VISUAL =================
function renderizarBarbeirosSelecionaveis() {
  if (!listaBarbeirosSelecionavel) return;

  listaBarbeirosSelecionavel.innerHTML = "";

  barbeiros.forEach((b) => {
    const card = document.createElement("div");
    card.className = "item-selecao";
    card.innerHTML = `
      <img src="${b.foto}" alt="${b.nome}" class="item-selecao-img">
      <span>${b.nome}</span>
      <small>${b.especialidade}</small>
    `;

    card.addEventListener("click", () => {
      limparSelecao(listaBarbeirosSelecionavel);
      card.classList.add("selecionado");

      selectBarbeiro.value = b.nome;

      if (blocoServicos) blocoServicos.style.display = "block";
      if (blocoCombos) blocoCombos.style.display = "none";

      selectServico.value = "";
      selectCombo.value = "";
      valor.textContent = "";
      limparSelecao(listaServicos);
      limparSelecao(listaCombos);
      selectHora.innerHTML = `<option value="">Selecione um horário</option>`;

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
    card.innerHTML = `
      <img src="${s.img}" alt="${s.nome}" class="item-selecao-img">
      <span>${s.nome}</span>
      <small>R$ ${s.preco}</small>
    `;

    card.addEventListener("click", () => {
      limparSelecao(listaServicos);
      limparSelecao(listaCombos);

      card.classList.add("selecionado");
      selectServico.value = s.nome;
      selectCombo.value = "";

      atualizarValorSelecionado();

      if (blocoCombos) blocoCombos.style.display = "block";

      atualizarHorarios();
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
    card.innerHTML = `
      <img src="${c.img}" alt="${c.nome}" class="item-selecao-img">
      <span>${c.nome}</span>
      <small>R$ ${c.preco}</small>
    `;

    card.addEventListener("click", () => {
      limparSelecao(listaCombos);
      limparSelecao(listaServicos);

      card.classList.add("selecionado");
      selectCombo.value = c.nome;
      selectServico.value = "";

      atualizarValorSelecionado();
      atualizarHorarios();
    });

    listaCombos.appendChild(card);
  });
}

// ================= PRODUTOS =================
function renderizarProdutos() {
  if (!listaProdutos) return;

  listaProdutos.innerHTML = "";

  produtos.forEach((p) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div class="produto-info">
        <img src="${p.img}" class="produto-img" alt="${p.nome}">
        <div>
          <span>${p.nome}</span><br>
          <small>Produto profissional</small>
        </div>
      </div>
      <div class="preco">R$ ${p.preco}</div>
    `;

    li.addEventListener("click", () => comprarProduto(p.nome, p.preco));
    listaProdutos.appendChild(li);
  });
}

function comprarProduto(nome, preco) {
  const mensagem = `🛍️ *JR Barbearia*

Quero comprar:

${nome}
💰 R$ ${preco}

Pode separar pra mim?`;

  const numero = "5575981080660";
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
  window.location.href = url;
}

// ================= ABA SOBRE =================
function renderizarBarbeiros() {
  if (!listaBarbeiros) return;

  listaBarbeiros.innerHTML = "";

  barbeiros.forEach((b) => {
    listaBarbeiros.innerHTML += `
      <div class="barbeiro-card">
        <img src="${b.foto}" class="barbeiro-img" alt="${b.nome}">
        <div class="barbeiro-info">
          <h3>${b.nome}</h3>
          <p>${b.especialidade}</p>
        </div>
      </div>
    `;
  });
}

// ================= HORÁRIOS =================
async function atualizarHorarios() {
  const dataSelecionada = inputData.value;
  const barbeiroSelecionado = selectBarbeiro.value;

  if (!dataSelecionada || !barbeiroSelecionado) return;

  if (ehDomingo(dataSelecionada)) {
    alert("Não atendemos aos domingos.");
    inputData.value = "";
    selectHora.innerHTML = `<option value="">Selecione um horário</option>`;
    return;
  }

  selectHora.innerHTML = `<option value="">Selecione um horário</option>`;

  try {
    const res = await fetch(
      `${API_URL}/horarios?data=${dataSelecionada}&barbeiro=${encodeURIComponent(barbeiroSelecionado)}`
    );

    if (!res.ok) {
      throw new Error("Erro ao carregar horários.");
    }

    const ocupados = await res.json();
    const hojeFormatado = new Date().toISOString().split("T")[0];
    const duracaoSelecionada = obterDuracaoSelecionada() || 30;

    horarios.forEach((h) => {
      const conflita = ocupados.some((o) => {
        const horaBanco = o.hora && o.hora.slice(0, 5);
        const duracaoBanco = o.duracao || 30;

        if (!horaBanco) return false;

        return horariosConflitam(h, duracaoSelecionada, horaBanco, duracaoBanco);
      });

      if (dataSelecionada === hojeFormatado && horarioJaPassou(dataSelecionada, h)) {
        return;
      }

      if (!conflita) {
        selectHora.innerHTML += `<option value="${h}">${h}</option>`;
      }
    });
  } catch (err) {
    console.error("Erro ao buscar horários:", err);
    alert("Não foi possível carregar os horários.");
  }
}

inputData.addEventListener("change", () => {
  const dataSelecionada = inputData.value;

  if (!dataSelecionada) return;

  if (ehDomingo(dataSelecionada)) {
    alert("Não atendemos aos domingos.");
    inputData.value = "";
    selectHora.innerHTML = `<option value="">Selecione um horário</option>`;
    return;
  }

  atualizarHorarios();
});

// ================= TELEFONE =================
inputTelefone.addEventListener("input", (e) => {
  e.target.value = formatarTelefone(e.target.value);
});

// ================= AGENDAR =================
formAgendamento.addEventListener("submit", async (e) => {
  e.preventDefault();

  const telefoneFormatado = inputTelefone.value;
  const telefoneLimpo = telefoneFormatado.replace(/\D/g, "");
  const selecionado = selectServico.value || selectCombo.value;
  const dataSelecionada = inputData.value;
  const horaSelecionada = selectHora.value;

  if (!selectBarbeiro.value) {
    alert("Escolha um barbeiro!");
    return;
  }

  if (!selecionado) {
    alert("Escolha um serviço ou combo!");
    return;
  }

  if (!dataSelecionada) {
    alert("Escolha uma data!");
    return;
  }

  if (ehDomingo(dataSelecionada)) {
    alert("Não atendemos aos domingos.");
    return;
  }

  if (!horaSelecionada) {
    alert("Escolha um horário!");
    return;
  }

  if (horarioJaPassou(dataSelecionada, horaSelecionada)) {
    const hojeFormatado = new Date().toISOString().split("T")[0];
    if (dataSelecionada === hojeFormatado) {
      alert("Esse horário já passou. Escolha outro.");
      atualizarHorarios();
      return;
    }
  }

  if (inputNome.value.trim().length < 2) {
    alert("Digite um nome válido!");
    return;
  }

  if (telefoneFormatado.length < 15 || telefoneLimpo.length !== 11) {
    alert("Digite um telefone válido!");
    return;
  }

  const agendamento = {
    barbeiro: selectBarbeiro.value,
    servico: selecionado,
    data: dataSelecionada,
    hora: horaSelecionada,
    nome: inputNome.value.trim(),
    telefone: telefoneFormatado,
    duracao: obterDuracaoSelecionada(),
  };

  try {
    const res = await fetch(`${API_URL}/agendar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(agendamento),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.erro || "Erro ao agendar.");
      return;
    }

    const mensagem = `Olá, gostaria de agendar na JR Barbearia:

Barbeiro: ${agendamento.barbeiro}
Serviço: ${agendamento.servico}
Data: ${agendamento.data}
Horário: ${agendamento.hora}

Nome: ${agendamento.nome}
Telefone: ${agendamento.telefone}`;

    const numero = "5575981080660";
    const mensagemCodificada = encodeURIComponent(mensagem);
    const urlApp = `whatsapp://send?phone=${numero}&text=${mensagemCodificada}`;
    const urlWeb = `https://wa.me/${numero}?text=${mensagemCodificada}`;

    alert("Agendamento realizado com sucesso!");

    formAgendamento.reset();
    resetarFluxoAgendamento();

    window.location.href = urlApp;

    setTimeout(() => {
      window.location.href = urlWeb;
    }, 1200);
  } catch (err) {
    console.error("Erro ao agendar:", err);
    alert("Não foi possível concluir o agendamento.");
  }
});

// ================= PAINEL =================
async function carregarAgendamentos() {
  try {
    const res = await fetch(`${API_URL}/agendamentos`);

    if (!res.ok) {
      throw new Error("Erro ao carregar agendamentos.");
    }

    const dados = await res.json();
    listaAdmin.innerHTML = "";

    dados.forEach((a) => {
      listaAdmin.innerHTML += `
        <li>
          <strong>${a.nome}</strong> - ${a.servico}<br>
          ${a.data} às ${a.hora.slice(0, 5)}<br>
          Barbeiro: ${a.barbeiro}<br>
          <button onclick="deletar(${a.id})">Excluir</button>
        </li>
      `;
    });
  } catch (err) {
    console.error("Erro ao carregar agendamentos:", err);
    listaAdmin.innerHTML = `<li>Erro ao carregar agendamentos.</li>`;
  }
}

async function deletar(id) {
  try {
    await fetch(`${API_URL}/agendamentos/${id}`, {
      method: "DELETE",
    });

    carregarAgendamentos();
  } catch (err) {
    console.error("Erro ao deletar:", err);
    alert("Não foi possível excluir o agendamento.");
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

  if (!loading) return;

  setTimeout(() => {
    loading.style.opacity = "0";
    loading.style.transition = "0.4s";

    setTimeout(() => {
      loading.style.display = "none";
    }, 400);
  }, 800);
});