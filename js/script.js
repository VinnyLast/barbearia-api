// ================= DADOS =================
const API_URL = "https://barbearia-api-23on.onrender.com";

const barbeiros = [
  { nome: "Junior Ferreira" },
  { nome: "Diego Alves" },
  { nome: "Samuel Santos" },
  { nome: "Rian Lukas" },
  { nome: "Douglas" }
];

const servicos = [
  { nome: "Corte", preco: 25 },
  { nome: "Barba", preco: 15 },
  { nome: "Pezinho", preco: 10 },
  { nome: "Luzes", preco: 60 },
  { nome: "Platinado", preco: 80 },
  { nome: "Botox", preco: 50 },
  { nome: "Barboterapia", preco: 40 },
  { nome: "Pigmentação", preco: 30 },
  { nome: "Hidratação", preco: 35 },
  { nome: "Sobrancelha (máquina e tesoura)", preco: 15 },
  { nome: "Freestyle", preco: 20 },
  { nome: "Depilação (orelha e nariz)", preco: 15 },
  { nome: "Limpeza facial", preco: 25 }
];

const combos = [
  { nome: "Corte + Barba", preco: 40 },
  { nome: "Corte + Luzes", preco: 75 },
  { nome: "Corte + Platinado", preco: 95 },
  { nome: "Corte + Sobrancelha", preco: 35 }
];

const produtos = [
  { nome: "Pomada", preco: 25, img: "images/pomada.png" },
  { nome: "Shampoo", preco: 30, img: "images/shampoo.png" },
  { nome: "Óleo para barba", preco: 20, img: "images/oleo.gif" }
];

const horarios = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
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
const loading = document.getElementById("loading");

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

function formatarTelefone(valor) {
  let telefone = valor.replace(/\D/g, "").slice(0, 11);

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

// ================= SELECTS =================
barbeiros.forEach((b) => {
  selectBarbeiro.innerHTML += `<option value="${b.nome}">${b.nome}</option>`;
});

servicos.forEach((s) => {
  selectServico.innerHTML += `<option value="${s.nome}">${s.nome} - R$ ${s.preco}</option>`;
});

combos.forEach((c) => {
  selectCombo.innerHTML += `<option value="${c.nome}">${c.nome} - R$ ${c.preco}</option>`;
});

// ================= PRODUTOS =================
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

function comprarProduto(nome, preco) {
  const mensagem = `🛍️ *JR Barbearia*

Quero comprar:

${nome}
💰 R$ ${preco}

Pode separar pra mim?`;

  const numero = "5575988434344";
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

  window.location.href = url;
}

// ================= SERVIÇO / COMBO =================
selectServico.addEventListener("change", () => {
  selectCombo.value = "";
  const servico = servicos.find((s) => s.nome === selectServico.value);
  valor.textContent = servico ? `Valor: R$ ${servico.preco}` : "";
});

selectCombo.addEventListener("change", () => {
  selectServico.value = "";
  const combo = combos.find((c) => c.nome === selectCombo.value);
  valor.textContent = combo ? `Valor: R$ ${combo.preco}` : "";
});

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

    horarios.forEach((h) => {
      const ocupado = ocupados.some((o) => o.hora && o.hora.slice(0, 5) === h);

      if (dataSelecionada === hojeFormatado && horarioJaPassou(dataSelecionada, h)) {
        return;
      }

      if (!ocupado) {
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

selectBarbeiro.addEventListener("change", atualizarHorarios);

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
    telefone: telefoneFormatado
  };

  try {
    const res = await fetch(`${API_URL}/agendar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(agendamento)
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
    valor.textContent = "";
    selectHora.innerHTML = `<option value="">Selecione um horário</option>`;

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
      method: "DELETE"
    });

    carregarAgendamentos();
  } catch (err) {
    console.error("Erro ao deletar:", err);
    alert("Não foi possível excluir o agendamento.");
  }
}

// ================= LOADING =================
window.addEventListener("load", () => {
  if (!loading) return;

  setTimeout(() => {
    loading.style.opacity = "0";
    loading.style.transition = "0.4s";

    setTimeout(() => {
      loading.style.display = "none";
    }, 400);
  }, 800);
});