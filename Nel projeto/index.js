

const imagensFundo = [
    'url("https://images.unsplash.com/photo-1578589318274-02854f68813e?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
    'url("https://images.unsplash.com/photo-1578589385251-045f05a6faa5?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
    'url("https://images.unsplash.com/photo-1578589302500-3fe6d8ab5395?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
    'url("https://images.unsplash.com/photo-1578589315522-9e5521b9c158?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")'
];

// Função para trocar o fundo a cada 7 segundos
let indiceAtual = Math.floor(Math.random() * imagensFundo.length);  // Escolhe um índice aleatório

function trocarFundo() {
    document.body.style.backgroundImage = imagensFundo[indiceAtual];
    indiceAtual = (indiceAtual + 1) % imagensFundo.length; // Vai voltar ao 0 quando chegar ao final da lista
}

trocarFundo();
setInterval(trocarFundo, 7000);

// URL da MockAPI com os usuários
const apiUrl = 'https://6787ca27c4a42c916108448a.mockapi.io/api/v1/users';  

// Função chamada ao clicar no botão de login
function fazerLogin() {
    const emailInput = document.getElementById('emailInput').value;

    if (emailInput === '') {
        alert('Por favor, insira seu e-mail.');
        return;
    }

    // Faz a requisição à MockAPI para buscar o usuário com o e-mail informado
    fetch(apiUrl)
        .then(response => response.json())
        .then(usuarios => {
            const usuario = usuarios.find(user => user.email === emailInput);  

            if (usuario) {
                document.getElementById('loginForm').style.display = 'none';
                document.getElementById('previsaoForm').style.display = 'block';

                // Salva o ID do usuário no localStorage
                localStorage.setItem('userId', usuario.id);

                console.log('Usuário logado:', usuario);
            } else {
                alert('Usuário não encontrado. Verifique seu e-mail.');
            }
        })
        .catch(error => {
            console.error('Erro ao buscar usuário:', error);
        });
}

// URL para obter dados da API de previsão do tempo
const key = "9b78fb032eb6ef2fc85c99bdc4be8260";

// Função para exibir os dados na interface
function mudarDados(grdados) {
    console.log(grdados);

    document.querySelector(".cidade").innerHTML = grdados.name;
    document.querySelector(".tempr").innerHTML = Math.floor(grdados.main.temp) + " °C";
    document.querySelector(".umidade").innerHTML = "Umidade: " + grdados.main.humidity + "%";
    document.querySelector(".img-previsao").src = `https://openweathermap.org/img/wn/${grdados.weather[0].icon}.png`;
    document.querySelector(".texto-previsao").innerHTML = grdados.weather[0].description;
}

async function registrarHistorico(userId, cidade, temperatura, descricaoClima, umidade) {
    const historico = {
        userId,                
        cidade,                
        temperatura,           
        descricaoClima,        
        umidade,               
        status: "Não confirmado",  // Novo campo status
        timestamp: new Date().toISOString(),
    };

    try {
        // Busca o histórico atual do usuário
        const respostaHist = await fetch(`https://6787ca27c4a42c916108448a.mockapi.io/api/v1/historico?userId=${userId}`);
        const historicoAtual = await respostaHist.json();

        // Limita o histórico a 2 itens
        if (historicoAtual.length >= 2) {
            // Exclui o item mais antigo (o primeiro na lista)
            const itemMaisAntigo = historicoAtual[0];
            await fetch(`https://6787ca27c4a42c916108448a.mockapi.io/api/v1/historico/${itemMaisAntigo.id}`, {
                method: "DELETE",
            });
        }

        // Registra o novo item no histórico
        const resposta = await fetch("https://6787ca27c4a42c916108448a.mockapi.io/api/v1/historico", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(historico),
        });

        if (resposta.ok) {
            console.log("Histórico registrado com sucesso!");
        } else {
            console.error("Erro ao registrar histórico:", resposta.statusText);
        }
    } catch (erro) {
        console.error("Erro na conexão:", erro);
    }
}

async function atualizarStatusHistorico(historicoId, novoStatus) {
    const dadosAtualizados = {
        status: novoStatus,  // Atualiza o status da previsão
        timestamp: new Date().toISOString(),  // Atualiza a data e hora
    };

    try {
        const respostaPut = await fetch(`https://6787ca27c4a42c916108448a.mockapi.io/api/v1/historico/${historicoId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dadosAtualizados),
        });

        if (respostaPut.ok) {
            alert("Status da previsão atualizado com sucesso!");
            verHistorico();  // Recarrega o histórico para refletir as mudanças
        } else {
            alert("Erro ao atualizar status da previsão.");
        }
    } catch (erro) {
        alert("Erro na atualização do status: " + erro.message);
    }
}




// Função para  a busca da cidade e obter os dados
async function encontrarCidade(cidade) {
    document.querySelector(".cidade").innerHTML = "A carregar...";

    try {
        const grdados = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${key}&units=metric&lang=pt_br`)
            .then(response => response.json());
        
        if (grdados.cod === "404") {
            throw new Error("Cidade não encontrada!");
        }

        mudarDados(grdados);

        // Recupera o ID do usuário armazenado no localStorage
        const userId = localStorage.getItem('userId');

        if (userId) {
            await registrarHistorico(userId, cidade, grdados.main.temp, grdados.weather[0].description, grdados.main.humidity);
        }

    } catch (erro) {
        alert("Erro ao buscar dados da cidade: " + erro.message);
        document.querySelector(".cidade").innerHTML = "Cidade não encontrada!";
    }
}

// Função que é chamada quando o botão de busca é clicado
function clicarNoBotao() {
    const input = document.querySelector(".input-cidade").value.trim();

    if (input === "") {
        alert("Por favor, insira o nome de uma cidade.");
        return;
    }

    encontrarCidade(input);

    // Limpa o campo de input após a busca
    document.querySelector(".input-cidade").value = "";
}

async function verHistorico() {
    const userId = localStorage.getItem('userId');  // Obtém o userId do localStorage

    if (!userId) {
        alert("Usuário não logado.");
        return;
    }

    try {
        // Busca o histórico para o usuário logado
        const resposta = await fetch(`https://6787ca27c4a42c916108448a.mockapi.io/api/v1/historico?userId=${userId}`);
        const historico = await resposta.json();

        console.log("Histórico carregado:", historico);

        // Exibe os dados do histórico
        const listaHistorico = document.getElementById("listaHistorico");
        listaHistorico.innerHTML = ''; // Limpa a lista antes de exibir os dados

        if (historico.length === 0) {
            listaHistorico.innerHTML = '<li>Nenhum histórico encontrado.</li>';
        } else {
            let encontrouNaoConfirmado = false;

            // Exibe as últimas 2 pesquisas
            historico.slice(-2).forEach(item => {
                const listaItem = document.createElement('li');
                listaItem.innerHTML = ` 
                    <strong>Cidade:</strong> ${item.cidade} <br>
                    <strong>Temperatura:</strong> ${item.temperatura} °C <br>
                    <strong>Clima:</strong> ${item.descricaoClima} <br>
                    <strong>Umidade:</strong> ${item.umidade}% <br>
                    <strong>Status:</strong> ${item.status} <br>
                    <strong>Data:</strong> ${new Date(item.timestamp).toLocaleString()} <br>
                    <hr>
                `;
                listaHistorico.appendChild(listaItem);

                // Verifica se há previsões não confirmadas
                if (item.status === "Não confirmado") {
                    encontrouNaoConfirmado = true;
                }
            });

            // Sempre exibe o botão "Confirmar Previsões" se houver previsões
            const confirmarBtn = document.getElementById('confirmarPrevisaoBtn');
            confirmarBtn.style.display = 'block'; // Exibe o botão independentemente de confirmações
        }
    } catch (erro) {
        alert("Erro ao buscar o histórico: " + erro.message);
    }
}

async function confirmarPrevisao() {
    const userId = localStorage.getItem('userId');

    if (!userId) {
        alert("Usuário não logado.");
        return;
    }

    try {
        // Busca o histórico para o usuário logado
        const resposta = await fetch(`https://6787ca27c4a42c916108448a.mockapi.io/api/v1/historico?userId=${userId}`);
        const historico = await resposta.json();

        // Atualiza as previsões das últimas 2 cidades no histórico
        for (let i = 0; i < Math.min(2, historico.length); i++) {
            const cidade = historico[i].cidade;
            const historicoId = historico[i].id;

            // Busca os dados da previsão atualizada para a cidade
            const grdados = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${key}&units=metric&lang=pt_br`)
                .then(response => response.json());

            if (grdados.cod === "404") {
                throw new Error("Cidade não encontrada!");
            }

            // Atualiza os dados da previsão com as novas informações
            const dadosAtualizados = {
                temperatura: grdados.main.temp,
                descricaoClima: grdados.weather[0].description,
                umidade: grdados.main.humidity,
                status: 'Confirmado',
                timestamp: new Date().toISOString(),
            };

            // Atualiza o histórico do usuário com o novo status e dados
            const respostaPut = await fetch(`https://6787ca27c4a42c916108448a.mockapi.io/api/v1/historico/${historicoId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dadosAtualizados),
            });

            if (!respostaPut.ok) {
                throw new Error("Erro ao atualizar a previsão.");
            }
        }

        alert("Previsões confirmadas e dados atualizados com sucesso!");
        verHistorico();  // Recarrega o histórico para refletir as mudanças

    } catch (erro) {
        alert("Erro ao confirmar as previsões: " + erro.message);
    }
}
