

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

// URL  MockAPi
const apiUrl = 'https://6787ca27c4a42c916108448a.mockapi.io/api/v1/users';  

// sverificar logado
function verificarLogin() {
    const userId = localStorage.getItem('userId'); //  userId do localStorage

    if (userId) {
        
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('previsaoForm').style.display = 'block';

        //  botão  logout
        document.getElementById('logoutBtn').style.display = 'block';

        console.log("Usuário logado:", userId);
    } else {
        // usuario nao logado  formulário de login
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('previsaoForm').style.display = 'none';

        // esconder logout
        document.getElementById('logoutBtn').style.display = 'none';
    }
}



function fazerLogin() {
    const emailInput = document.getElementById('emailInput').value;

    if (emailInput === '') {
        alert('Por favor, insira seu e-mail.');
        return;
    }

    //  MockAPI para buscar o usuário com o e-mail informad
    fetch(apiUrl)
        .then(response => response.json())
        .then(usuarios => {
            const usuario = usuarios.find(user => user.email === emailInput);  

            if (usuario) {
                // Armazena o ID do usuário no localStorage
                localStorage.setItem('userId', usuario.id);

                // Exibe  previsão e oculta  login
                document.getElementById('loginForm').style.display = 'none';
                document.getElementById('previsaoForm').style.display = 'block';

                console.log('Usuário logado:', usuario);
            } else {
                alert('Usuário não encontrado. Verifique seu e-mail.');
            }
        })
        .catch(error => {
            console.error('Erro ao buscar usuário:', error);
        });
}

// quando carrega
window.onload = verificarLogin;



function logout() {
    // Remover userid  localStorage para deslogar o user
    localStorage.removeItem('userId');

    // Exibe novamente o formulário de login
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('previsaoForm').style.display = 'none';
}


// URL para  dados da API 
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
        status: "Não confirmado",  // new
        timestamp: new Date().toISOString(),
    };

    try {
        // Buscar o histórico atual
        const respostaHist = await fetch(`https://6787ca27c4a42c916108448a.mockapi.io/api/v1/historico?userId=${userId}`);
        const historicoAtual = await respostaHist.json();

        // Limitar  historico  2 itens
        if (historicoAtual.length >= 2) {
            // Exclui o item mais antigo
            const itemMaisAntigo = historicoAtual[0];
            await fetch(`https://6787ca27c4a42c916108448a.mockapi.io/api/v1/historico/${itemMaisAntigo.id}`, {
                method: "DELETE",
            });


        }

        // Regista o novo item no histórico
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
        status: novoStatus,  // Atualiza o stats
        timestamp: new Date().toISOString(),  // Atualiza data hora
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
            verHistorico();  //  histórico mudanças
        } else {
            alert("Erro ao atualizar status da previsão.");
        }
    } catch (erro) {
        alert("Erro na atualização do status: " + erro.message);
    }


}






async function encontrarCidade(cidade) {
    document.querySelector(".cidade").innerHTML = "A carregar...";

    try {
        const grdados = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${key}&units=metric&lang=pt_br`)
            .then(response => response.json());
        
        if (grdados.cod === "404") {
            throw new Error("Cidade não encontrada!");
        }

        mudarDados(grdados);

        // Exibe a caixa de previsão apos
        document.querySelector(".caixa-media").style.display = 'block';

        // Recupera o ID user localStorage
        const userId = localStorage.getItem('userId');

        if (userId) {
            await registrarHistorico(userId, cidade, grdados.main.temp, grdados.weather[0].description, grdados.main.humidity);
        }

    } catch (erro) {
        alert("Erro ao buscar dados da cidade: " + erro.message);
        document.querySelector(".cidade").innerHTML = "Cidade não encontrada!";
    }
}


// Função que é chamada quando o botão de lupa e clicado
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



let historicoAberto = false; //  variável

async function verHistorico() {
    const userId = localStorage.getItem('userId'); // userId localStorage

    if (!userId) {
        alert("Usuário não logado.");
        return;
    }

    const listaHistorico = document.getElementById("listaHistorico");
    const confirmarBtn = document.getElementById('confirmarPrevisaoBtn'); // Seleciona o botão
    const historicoBtn = document.querySelector('.btn-historico'); //  botão  alternância

    if (historicoAberto) {
        // Fecha o histórico
        listaHistorico.style.display = "none";
        confirmarBtn.style.display = "none"; // Esconde  Confirmar Previsões
        historicoBtn.textContent = "Ver Histórico"; 
    } else {
        // Abre 
        try {
            // Exibe um indicador carregaar
            listaHistorico.innerHTML = '<li>Carregando histórico...</li>';
            listaHistorico.style.display = "block";

            // Busca o histórico do usuário logado
            const resposta = await fetch(`https://6787ca27c4a42c916108448a.mockapi.io/api/v1/historico?userId=${userId}`);
            const historico = await resposta.json();

            console.log("Histórico carregado:", historico);

            // Exibe os dados do histórico
            listaHistorico.innerHTML = ''; // Limpa o conteúdo anterior

            if (historico.length === 0) {
                listaHistorico.innerHTML = '<li>Nenhum histórico encontrado.</li>';
            } else {
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
                });
            }

            //  botão Confirmar Previsões
            confirmarBtn.style.display = 'block';

            // Altera  texto  botão
            historicoBtn.textContent = "Fechar Histórico";
        } catch (erro) {
            alert("Erro ao buscar o histórico: " + erro.message);
        }
    }

    // Duvida variável saber 
    historicoAberto = !historicoAberto;
}



async function confirmarPrevisao() {
    const userId = localStorage.getItem('userId'); // Obtém o ID do usuário do localStorage

    if (!userId) {
        alert("Usuário não logado.");
        return;
    }

    try {
        // Busca o histórico com o userId correto
        const resposta = await fetch(`https://6787ca27c4a42c916108448a.mockapi.io/api/v1/historico?userId=${userId}`);
        const historico = await resposta.json();

        if (historico.length === 0) {
            alert("Nenhum histórico encontrado para confirmar.");
            return;
        }

        console.log("Histórico para o usuário", userId, historico);

        // Verificar se as cidades do histórico estão corretas
        for (let i = 0; i < Math.min(2, historico.length); i++) {
            const item = historico[i]; // Obtemos cada items
            const cidade = item.cidade;
            const historicoId = item.id;

            console.log("Cidade no histórico:", cidade);

            //   cidade  no histórico e se a previsão precisa de ser atualizada
            const grdados = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${key}&units=metric&lang=pt_br`)
                .then(response => response.json());

            if (grdados.cod === "404") {
                console.warn(`Cidade ${cidade} não encontrada na API OpenWeather.`);
                continue;
            }

            //    enviar para MockAPI
            const dadosAtualizados = {
                temperatura: grdados.main.temp,
                descricaoClima: grdados.weather[0].description,
                umidade: grdados.main.humidity,
                status: 'Confirmado',
                timestamp: new Date().toISOString(),
            };

            // Atualiza na MockAPI
            const respostaPut = await fetch(`https://6787ca27c4a42c916108448a.mockapi.io/api/v1/historico/${historicoId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dadosAtualizados),
            });

            if (respostaPut.ok) {
                console.log(`Previsão de ${cidade} foi confirmada.`);
            } else {
                console.error(`Erro ao atualizar o histórico para ${cidade}`);
            }
        }

        //  mensagem de sucesso e recarrega o histórico
        alert("Previsões confirmadas e atualizadas com sucesso!");
        verHistorico();

    } catch (erro) {
        alert("Erro ao confirmar as previsões: " + erro.message);
    }
}