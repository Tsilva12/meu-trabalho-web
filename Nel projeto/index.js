// URL da MockAPI com os usuários (substitua com a URL correta do seu projeto MockAPI)
const apiUrl = 'https://6787ca27c4a42c916108448a.mockapi.io/api/v1/users';  

// Função chamada ao clicar no botão de login
function fazerLogin() {
    const emailInput = document.getElementById('emailInput').value;  // Pega o e-mail inserido pelo usuário

    if (emailInput === '') {
        alert('Por favor, insira seu e-mail.');
        return;  // Retorna sem fazer nada se o e-mail estiver vazio
    }

    // Faz a requisição à MockAPI para buscar o usuário com o e-mail informado
    fetch(apiUrl)
        .then(response => response.json())
        .then(usuarios => {
            // Verifica se o e-mail inserido está presente nos usuários da MockAPI
            const usuario = usuarios.find(user => user.email === emailInput);  

            if (usuario) {
                // Usuário encontrado: mostra a tela de previsão e esconde a tela de login
                document.getElementById('loginForm').style.display = 'none';  // Esconde o formulário de login
                document.getElementById('previsaoForm').style.display = 'block';  // Mostra a tela de previsão

                // Exibe o nome do usuário (se necessário)
                console.log('Usuário logado:', usuario);

                // Opcionalmente, armazene informações do usuário para uso posterior
                // localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
            } else {
                // Usuário não encontrado: exibe um alerta de erro
                alert('Usuário não encontrado. Verifique seu e-mail.');
            }
        })
        .catch(error => {
            console.error('Erro ao buscar usuário:', error);
        });
}


const imagensFundo = [
    'url("https://images.unsplash.com/photo-1578589318274-02854f68813e?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
    'url("https://images.unsplash.com/photo-1578589385251-045f05a6faa5?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
    'url("https://images.unsplash.com/photo-1578589302500-3fe6d8ab5395?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
    'url("https://images.unsplash.com/photo-1578589315522-9e5521b9c158?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")'
];

// Função para trocar o fundo a cada 7 segundos
let indiceAtual = Math.floor(Math.random() * imagensFundo.length);  // Escolhe um índice aleatório

function trocarFundo() {
    // Atualiza o fundo da página com a imagem da lista
    document.body.style.backgroundImage = imagensFundo[indiceAtual];
    
    // Incrementa o índice para a próxima imagem, e reinicia se chegar ao fim
    indiceAtual = (indiceAtual + 1) % imagensFundo.length; // Vai voltar ao 0 quando chegar ao final da lista
}

// Chama a função pela primeira vez assim que a página carrega
trocarFundo();

setInterval(trocarFundo, 7000);

const key = "9b78fb032eb6ef2fc85c99bdc4be8260";

// Função para exibir os dados na interface
function mudarDados(grdados) {
    console.log(grdados);

    // Atualiza as informações no HTML
    document.querySelector(".cidade").innerHTML = grdados.name;
    document.querySelector(".tempr").innerHTML = Math.floor(grdados.main.temp) + " °C";
    document.querySelector(".umidade").innerHTML = "Umidade: " + grdados.main.humidity + "%";
    document.querySelector(".img-previsao").src = `https://openweathermap.org/img/wn/${grdados.weather[0].icon}.png`;
    document.querySelector(".texto-previsao").innerHTML = grdados.weather[0].description;
}

// Função para tratar a busca da cidade e obter os dados
async function encontrarCidade(cidade) {
    // Mostra mensagem de carregando
    document.querySelector(".cidade").innerHTML = "A carregar...";

    try {
        const grdados = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${key}&units=metric&lang=pt_br`)
            .then(response => response.json());
        
        if (grdados.cod === "404") {
            throw new Error("Cidade não encontrada!");
        }

        mudarDados(grdados);
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
