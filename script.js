// JavaScript - Lógica Interativa do Quiz

// !!! IMPORTANTE: EDITE AS RESPOSTAS CORRETAS AQUI !!!
const respostasCorretas = {
    1: "Quinto ano",
    2: "Julieta",
    3: "24/07/2021",
    4: "Niterói"
};

// Função para normalizar strings (remove acentos, espaços e deixa minúscula)
// Isso torna a comparação flexível (ex: "Niterói" é igual a "niteroi")
const normalizar = (str) => {
    if (typeof str !== 'string') return '';
    return str.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function verificarResposta(numPergunta) {
    const respostaInput = document.getElementById(`a${numPergunta}`);
    const respostaUsuario = respostaInput.value;
    const erroEl = document.getElementById(`error${numPergunta}`);

    // Verifica se o campo está vazio (exceto para a pergunta 5)
    if (!respostaUsuario && numPergunta !== 5) {
        erroEl.textContent = "Por favor, digite uma resposta.";
        erroEl.classList.add('visible');
        return;
    }

    const respostaCorreta = respostasCorretas[numPergunta];
    // A pergunta 5 é livre, então sempre é considerada correta
    const eCorreta = numPergunta === 5 || normalizar(respostaUsuario) === normalizar(respostaCorreta);

    if (eCorreta) {
        erroEl.classList.remove('visible'); // Esconde mensagem de erro
        transicaoProximaPergunta(numPergunta);
    } else {
        erroEl.textContent = "Resposta errada. Tente de novo! 😉";
        erroEl.classList.add('visible');
        animarErro(respostaInput); // Animação de "tremor" no campo
    }
}

function transicaoProximaPergunta(numAtual) {
    const container = document.getElementById('quiz-container');
    const atualEl = document.getElementById(`q${numAtual}`);
    const proximoNum = numAtual + 1;
    // Define o próximo elemento: a próxima pergunta ou a tela final
    const proximoEl = (proximoNum <= 5) ? document.getElementById(`q${proximoNum}`) : document.getElementById('final-screen');

    // Inicia o fade-out da pergunta atual
    atualEl.classList.add('hidden');
    
    // Espera a animação de fade-out terminar
    setTimeout(() => {
        atualEl.style.display = 'none'; // Esconde de fato o elemento do layout
        if (proximoEl) {
            proximoEl.style.display = 'block'; // Mostra o próximo
            // Força um pequeno reflow para a animação de fade-in funcionar corretamente
            requestAnimationFrame(() => {
                proximoEl.classList.remove('hidden');
            });
        }
    }, 600); // O tempo deve ser igual ao da transição do CSS
}

function recomecar() {
    const telaFinal = document.getElementById('final-screen');
    telaFinal.classList.add('hidden');

    // Limpa todos os campos de input e mensagens de erro
    for (let i = 1; i <= 5; i++) {
        document.getElementById(`a${i}`).value = '';
        const erroEl = document.getElementById(`error${i}`);
        if (erroEl) erroEl.classList.remove('visible');
    }

    setTimeout(() => {
        telaFinal.style.display = 'none';

        // Garante que todas as perguntas (exceto a primeira) estejam escondidas
        for (let i = 2; i <= 5; i++) {
            const qEl = document.getElementById(`q${i}`);
            qEl.style.display = 'none';
            qEl.classList.add('hidden');
        }

        // Mostra a primeira pergunta novamente
        const primeiraPergunta = document.getElementById('q1');
        primeiraPergunta.style.display = 'block';
         requestAnimationFrame(() => {
            primeiraPergunta.classList.remove('hidden');
        });
    }, 600);
}

// Animação de "tremor" para feedback de erro
function animarErro(elemento) {
    elemento.style.animation = 'shake 0.5s';
    // Remove a animação para que possa ser reativada
    setTimeout(() => {
        elemento.style.animation = '';
    }, 500);
}

// Adiciona evento 'Enter' para avançar nas perguntas
for (let i = 1; i <= 5; i++) {
    document.getElementById(`a${i}`).addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            // Impede a submissão de formulário padrão e aciona o clique do botão
            e.preventDefault();
            document.querySelector(`#q${i} button`).click();
        }
    });
}