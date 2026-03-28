// ================= DADOS =================
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
  { nome: "Pomada", preco: 25 },
  { nome: "Shampoo", preco: 30 },
  { nome: "Óleo para barba", preco: 20 }
];

const horarios = [
  "08:00","08:30","09:00","09:30","10:00","10:30",
  "14:00","14:30","15:00","15:30","16:00","16:30","17:00"
];

// ================= ELEMENTOS =================
const selectBarbeiro = document.getElementById("barbeiro");
const selectServico = document.getElementById("servico");
const selectCombo = document.getElementById("combo");
const selectHora = document.getElementById("hora");
const valor = document.getElementById("valor");
const inputData = document.getElementById("data");
const listaProdutos = document.getElementById("listaProdutos");
const listaAdmin = document.getElementById("listaAdmin");

// ================= CONFIG =================
inputData.min = new Date().toISOString().split("T")[0];

// ================= ABAS =================
function trocarAba(nome, el) {
  document.querySelectorAll(".aba").forEach(e => e.classList.remove("ativa"));
  document.querySelectorAll(".tabs button").forEach(e => e.classList.remove("active"));

  document.getElementById(nome).classList.add("ativa");
  if (el) el.classList.add("active");
}

// ================= ADMIN =================
const senhaAdmin = "1234";

function acessarPainel() {
  const senha = prompt("Digite a senha do painel:");

  if (senha === senhaAdmin) {
    const btn = document.getElementById("btnPainel");
    if (btn) btn.style.display = "block";

    trocarAba("painel");
    carregarAgendamentos();
  } else {
    alert("Senha incorreta!");
  }
}

let cliques = 0;

document.querySelector("header").addEventListener("click", () => {
  cliques++;

  if (cliques === 5) {
    acessarPainel();
    cliques = 0;
  }

  setTimeout(() => (cliques = 0), 2000);
});

// ================= SELECTS =================
barbeiros.forEach(b => {
  selectBarbeiro.innerHTML += `<option value="${b.nome}">${b.nome}</option>`;
});

servicos.forEach(s => {
  selectServico.innerHTML += `<option value="${s.nome}">${s.nome} - R$ ${s.preco}</option>`;
});

combos.forEach(c => {
  selectCombo.innerHTML += `<option value="${c.nome}">${c.nome} - R$ ${c.preco}</option>`;
});

// ================= PRODUTOS =================
listaProdutos.innerHTML = "";

produtos.forEach(p => {
  listaProdutos.innerHTML += `
    <li onclick="comprarProduto('${p.nome}', ${p.preco})">
      <div>
        <strong>${p.nome}</strong>
        <small>Produto profissional</small>
      </div>
      <div class="preco">R$ ${p.preco}</div>
    </li>
  `;
});

function comprarProduto(nome, preco) {
  const mensagem = `🛍️ *JR Barbearia*

Quero comprar:

${nome}
💰 R$ ${preco}

Pode separar pra mim?`;

  const numero = "5575988434344";
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

  window.open(url, "_blank");
}

// ================= SERVIÇO / COMBO =================
selectServico.addEventListener("change", () => {
  selectCombo.value = "";
  const servico = servicos.find(s => s.nome === selectServico.value);
  valor.textContent = servico ? `Valor: R$ ${servico.preco}` : "";
});

selectCombo.addEventListener("change", () => {
  selectServico.value = "";
  const combo = combos.find(c => c.nome === selectCombo.value);
  valor.textContent = combo ? `Valor: R$ ${combo.preco}` : "";
});

// ================= HORÁRIOS =================
async function atualizarHorarios() {
  const dataSelecionada = inputData.value;
  const barbeiroSelecionado = selectBarbeiro.value;

  if (!dataSelecionada || !barbeiroSelecionado) return;

  selectHora.innerHTML = `<option value="">Selecione um horário</option>`;

  try {
    const res = await fetch(`https://barbearia-api-23on.onrender.com/horarios?data=${dataSelecionada}&barbeiro=${barbeiroSelecionado}`);
    const ocupados = await res.json();

    horarios.forEach(h => {
      const ocupado = ocupados.some(o => o.hora.slice(0,5) === h);

      if (!ocupado) {
        selectHora.innerHTML += `<option value="${h}">${h}</option>`;
      }
    });

  } catch (err) {
    console.error("Erro ao buscar horários:", err);
  }
}

inputData.addEventListener("change", atualizarHorarios);
selectBarbeiro.addEventListener("change", atualizarHorarios);

// ================= AGENDAR =================
document.getElementById("formAgendamento").addEventListener("submit", async (e) => {
  e.preventDefault();

  const selecionado = selectServico.value || selectCombo.value;

  if (!selecionado) {
    alert("Escolha um serviço ou combo!");
    return;
  }

  const agendamento = {
    barbeiro: selectBarbeiro.value,
    servico: selecionado,
    data: inputData.value,
    hora: selectHora.value,
    nome: document.getElementById("nome").value,
    telefone: document.getElementById("telefone").value
  };

  await fetch("https://barbearia-api-23on.onrender.com/agendar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(agendamento)
  });

  const mensagem = `Olá, gostaria de agendar na JR Barbearia:

Barbeiro: ${agendamento.barbeiro}
Serviço: ${agendamento.servico}
Data: ${agendamento.data}
Horário: ${agendamento.hora}

Nome: ${agendamento.nome}
Telefone: ${agendamento.telefone}`;

  const numero = "5575988434344";
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

  window.open(url, "_blank");

  alert("Agendamento realizado com sucesso!");

  e.target.reset();
  valor.textContent = "";
  selectHora.innerHTML = `<option value="">Selecione um horário</option>`;
});

// ================= PAINEL =================
async function carregarAgendamentos() {
  const res = await fetch("https://barbearia-api-23on.onrender.com/agendamentos");
  const dados = await res.json();

  listaAdmin.innerHTML = "";

  dados.forEach(a => {
    listaAdmin.innerHTML += `
      <li>
        <strong>${a.nome}</strong> - ${a.servico}<br>
        ${a.data} às ${a.hora.slice(0,5)}<br>
        Barbeiro: ${a.barbeiro}<br>
        <button onclick="deletar(${a.id})">Excluir</button>
      </li>
    `;
  });
}

async function deletar(id) {
  await fetch(`https://barbearia-api-23on.onrender.com/agendamentos/${id}`, {
    method: "DELETE"
  });

  carregarAgendamentos();
}