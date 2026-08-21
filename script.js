import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Cole aqui os valores em Supabase > Project Settings > API.
// A anon key pode estar no frontend. NUNCA coloques a service_role key aqui.
const SUPABASE_URL = "https://iytzujwqwnkasonrsjal.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_WLFKJTmbTnxy64XklofjbA_FtYHi5or";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const questions = [
  {
    question: "Quando ouves uma música pop com um refrão poderoso, o que fazes?",
    answers: [
      { text: "Continuo normalmente.", points: 0 },
      { text: "Canto baixinho.", points: 1 },
      { text: "Canto alto com voz mais aguda.", points: 2 },
      { text: "Faço uma performance completa.", points: 3 }
    ]
  },
  {
    question: "Qual destas atividades parece mais divertida?",
    answers: [
      { text: "Ver futebol.", points: 0 },
      { text: "Ir ao cinema.", points: 1 },
      { text: "Ir ter com a namorada.", points: 1 },
      { text: "Festa com música pop e muito glitter.", points: 3 }
    ]
  },
  {
    question: "Encontras glitter na tua roupa. Qual é a tua reação?",
    answers: [
      { text: "Tento tirar imediatamente.", points: 0 },
      { text: "Não me importo.", points: 1 },
      { text: "Até ficou bonito.", points: 2 },
      { text: "Onde arranjo mais?", points: 3 }
    ]
  },
  {
    question: "Como seria a tua entrada numa festa?",
    answers: [
      { text: "Entro discretamente.", points: 0 },
      { text: "Cumprimento toda a gente.", points: 1 },
      { text: "Faço double leg na primeira pessoa que vejo.", points: 0 },
      { text: "Faço uma entrada digna de uma estrela.", points: 3 }
    ]
  },
  {
    question: "Escolhe um acessório:",
    answers: [
      { text: "Nada.", points: 0 },
      { text: "Relógio.", points: 1 },
      { text: "Óculos estilosos.", points: 2 },
      { text: "Pulseira.", points: 3 }
    ]
  },
  {
    question: "Qual destas frases combina mais contigo?",
    answers: [
      { text: "Gosto de coisas simples.", points: 0 },
      { text: "Gosto de me vestir bem.", points: 1 },
      { text: "A estética é importante.", points: 2 },
      { text: "Gosto de falar anasalado com a perna cruzada.", points: 3 }
    ]
  },
  {
    question: "O teu amigo diz: 'Vamos tirar fotos'. Tu:",
    answers: [
      { text: "Prefiro não aparecer.", points: 0 },
      { text: "Faço uma foto normal.", points: 1 },
      { text: "Faço várias poses.", points: 2 },
      { text: "Tenho 47 poses preparadas.", points: 3 }
    ]
  },
  {
    question: "Como escolhes uma música para uma viagem?",
    answers: [
      { text: "Escolho algo aleatório.", points: 0 },
      { text: "Escolho os meus favoritos.", points: 1 },
      { text: "Faço uma playlist.", points: 2 },
      { text: "Tenho uma playlist temática com 6 horas.", points: 3 }
    ]
  },
  {
    question: "Qual é a tua relação com drama?",
    answers: [
      { text: "Evito drama.", points: 0 },
      { text: "Às vezes acompanho.", points: 1 },
      { text: "Gosto de um bom drama.", points: 2 },
      { text: "Preciso de drama para viver.", points: 3 }
    ]
  },
  {
    question: "Última pergunta: No sexo eu:",
    answers: [
      { text: "Sou ativo.", points: 1 },
      { text: "Sou passivo.", points: 2 },
      { text: "Gosto de um fio terra", points: 3 },
      { text: "Gosto de acessórios! ✨", points: 2 }
    ]
  }
];
const $ = (id) => document.getElementById(id);
const screens = {
  start: $("start-screen"),
  quiz: $("quiz-screen"),
  result: $("result-screen")
};

let currentQuestion = 0;
let selectedAnswer = null;
let answers = [];

function showOnly(screen) {
  Object.values(screens).forEach((item) => item.classList.add("hidden"));
  screens[screen].classList.remove("hidden");
}

function showQuestion() {
  const questionData = questions[currentQuestion];
  const text = questionData.question;
  const options = questionData.answers;

  selectedAnswer = null;
  $("question").textContent = text;
  $("question-number").textContent = `Pergunta ${currentQuestion + 1} de ${questions.length}`;
  $("progress-bar").style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  $("next-button").disabled = true;
  $("next-button").textContent = currentQuestion === questions.length - 1 ? "Ver resultado ✅" : "Guardar 💾";

  $("answers").replaceChildren(
    ...options.map((option, index) => {
      const button = document.createElement("button");
      button.className = "answer-button";
      button.textContent = option.text;

      button.addEventListener("click", () => {
        document.querySelectorAll(".answer-button").forEach((item) => item.classList.remove("selected"));
        button.classList.add("selected");
        selectedAnswer = index;
        $("next-button").disabled = false;
      });

      return button;
    })
  );
}

function getResult(percentage) {
  if (percentage <= 20) return ["🌱 Nível: Iniciante", "O teu nível arco-íris está bastante tranquilo. Mas este resultado é só uma brincadeira — sê tu mesmo! 😎"];
  if (percentage <= 40) return ["🌈 Nível: Curioso", "Já existem algumas cores no teu radar! O arco-íris começa a aparecer. 🏳️‍🌈"];
  if (percentage <= 60) return ["✨ Nível: Colorido", "Definitivamente tens alguma energia arco-íris! Nada mau. 😌🌈"];
  if (percentage <= 80) return ["💅 Nível: Muito Colorido", "O glitter já faz parte da tua vida. O arco-íris reconhece-te. 💅🏳️‍🌈"];
  return ["👑 Nível: Ícone LGBT", "O arco-íris acabou de pedir um autógrafo. És oficialmente uma lenda deste quiz! 👑🏳️‍🌈✨"];
}

async function saveResponse(totalPoints, percentage) {
  const status = $("save-status");
  status.className = "save-status";
  status.textContent = "A guardar a tua resposta…";

  if (SUPABASE_URL.startsWith("COLOCA_") || SUPABASE_ANON_KEY.startsWith("COLOCA_")) {
    status.classList.add("error");
    status.textContent = "Resultado calculado. Falta configurar o Supabase para o guardar.";
    return;
  }

  const payload = {
    participant_name: $("participant-name").value.trim() || null,
    answers,
    total_points: totalPoints,
    percentage
  };

  const { error } = await supabase.from("quiz_responses").insert(payload);

  if (error) {
    console.error(error);
    status.classList.add("error");
    status.textContent = "Não foi possível guardar a resposta. Tenta novamente mais tarde.";
    return;
  }

  status.textContent = "Resposta guardada com sucesso! 🌈";
}

function finishQuiz() {
  const totalPoints = answers.reduce((sum, answer) => sum + answer.points, 0);
  const percentage = Math.round((totalPoints / (questions.length * 3)) * 100);
  const [title, text] = getResult(percentage);

  $("score").textContent = `${percentage}%`;
  $("result-title").textContent = title;
  $("result-text").textContent = text;
  showOnly("result");
  saveResponse(totalPoints, percentage);
}

$("start-button").addEventListener("click", () => {
  showOnly("quiz");
  showQuestion();
});

$("next-button").addEventListener("click", () => {
  if (selectedAnswer === null) return;

  const questionData = questions[currentQuestion];
  const selectedOption = questionData.answers[selectedAnswer];

  answers.push({
    question_number: currentQuestion + 1,
    question: questionData.question,
    selected_answer: selectedOption.text,
    points: selectedOption.points
  });

  currentQuestion += 1;
  if (currentQuestion === questions.length) {
    finishQuiz();
  } else {
    showQuestion();
  }
});

$("restart-button").addEventListener("click", () => {
  currentQuestion = 0;
  selectedAnswer = null;
  answers = [];
  $("participant-name").value = "";
  $("save-status").textContent = "";
  showOnly("start");
});
