// Endereço onde o servidor está sendo executado
const enderecoServidor = "localhost";
// Porta usada pelo servidor para receber as requisições
const porta = "3001";


// Função responsável por consultar todos os produtos cadastrados no banco de dados
async function listarprodutos(){

    try{
        // Envia uma requisição GET para a rota "/produtos" do servidor
        const resposta = await fetch("http://" + enderecoServidor + ":" + porta + "/produtos");
        // Converte a resposta para JSON
        const dados = await resposta.json();

        let respostaHTML = "";

        // Percorre todos os produtos recebidos e monta o que será exibido
        for(let i = 0; i < dados.length; i++){

            respostaHTML = respostaHTML +
            "Produto: " + dados[i].nome_produto +
            "<br>" +
            "Preço: R$ " + dados[i].preco_produto +
            "<br><br>";
        }

        // Exibe o resultado dentro de resp1
        document.getElementById("resp1").innerHTML = "<h3>Produtos</h3><br>" + respostaHTML;

    }

    catch(erro){

        // Exibe o erro no console para facilitar a identificação do problema
        console.log(erro);

        // Mensagem que apareçe ao usuário caso ocorra algum erro
        document.getElementById("resp1").innerHTML = "Erro ao consultar os produtos.";
    }
}


// Função responsável por consultar todas as categorias cadastradas
async function listarcategorias(){

    try{
        // Envia uma requisição GET para buscar as categorias
        const resposta = await fetch("http://" + enderecoServidor + ":" + porta + "/categorias");
        // Converte a resposta para JSON
        const dados = await resposta.json();

        let respostaHTML = "";

        // Percorre todas as categorias recebidas
        for(let i = 0; i < dados.length; i++){
            respostaHTML = respostaHTML + dados[i].nome_categoria +"<br>";
        }

        // Exibe as categorias na página
        document.getElementById("resp1").innerHTML = "<h3>Categorias</h3>" + respostaHTML;

    }

    catch(erro){
        console.log(erro);
        document.getElementById("resp1").innerHTML = "Erro ao consultar as categorias.";
    }
}


// Consulta todos os produtos e suas categorias
async function listarprodutosecategorias(){

    try{
        // Envia uma requisição GET ao servidor
        const resposta = await fetch("http://" + enderecoServidor + ":" + porta + "/produtos-categoria");
        // Converte a resposta para JSON
        const dados = await resposta.json();
        let respostaHTML = "";

        // Variável utilizada para saber quando a categoria muda
        let categoriaAtual = "";

        // Percorre todos os registros recebidos
        for(let i = 0; i < dados.length; i++){
            // Sempre que a categoria mudar, imprime um novo título
            if(categoriaAtual != dados[i].nome_categoria){
                categoriaAtual = dados[i].nome_categoria;
                respostaHTML = respostaHTML + "<h3>" + categoriaAtual + "</h3>";
            }

            respostaHTML = respostaHTML + dados[i].nome_produto + " - R$ " + dados[i].preco_produto + "<br>";
        }

        // Exibe o resultado na página
        document.getElementById("resp1").innerHTML = respostaHTML;

    }

    catch(erro){
        console.log(erro);
        document.getElementById("resp1").innerHTML = "Erro ao consultar os produtos por categoria.";
    }
}


// Pesquisa um produto específico utilizando o método POST
async function pesquisarProduto(){

    try{
        // Pega o nome digitado pelo usuário
        const nome = document.getElementById("nomeProduto").value;

        // Verifica se o campo foi preenchido
        if(nome == ""){
            document.getElementById("resp2").innerHTML = "Digite o nome de um produto.";
            return;
        }

        // Envia o nome do produto ao servidor utilizando uma requisição POST
        const resposta = await fetch( "http://" + enderecoServidor + ":" + porta + "/pesquisarProduto",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                // Converte o objeto JavaScript para JSON antes do envio
                body:JSON.stringify({
                    nome:nome
                })
            }
        );

        // Converte a resposta para JSON
        const dados = await resposta.json();
        let respostaHTML = "";

        // Caso nenhum produto seja encontrado
        if(dados.length == 0){
            respostaHTML = "Nenhum produto foi encontrado com esse nome.";
        }
        else{
            // Exibe as informações do produto encontrado
            respostaHTML = "Categoria: " + dados[0].nome_categoria + "<br>" + "Produto: " + dados[0].nome_produto +
            "<br>" + "Preço: R$ " + dados[0].preco_produto;
        }

        // Exibe o resultado da pesquisa
        document.getElementById("resp2").innerHTML = "<h3>Resultado da Pesquisa</h3><br>" + respostaHTML;
    }

    catch(erro){
        console.log(erro);
        document.getElementById("resp2").innerHTML = "Erro ao pesquisar o produto.";
    }
}


// Pesquisa produtos utilizando categoria e faixa de preço
async function pesquisarCategoria(){

    try{
        // Pega os valores selecionados nos menus suspensos
        const categoria = document.getElementById("categoria").value;
        const faixa = document.getElementById("preco").value;

        // Envia os filtros ao servidor através do método POST
        const resposta = await fetch("http://" + enderecoServidor + ":" + porta + "/pesquisarCategoria",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    categoria:categoria,
                    faixa:faixa
                })
            }
        );

        // Converte a resposta para JSON
        const dados = await resposta.json();
        let respostaHTML = "";

        // Caso nenhum produto seja encontrado
        if(dados.length == 0){
            respostaHTML = "Nenhum produto encontrado.";
        }

        else{

            // Percorre todos os produtos encontrados e monta a resposta
            for(let i = 0; i < dados.length; i++){
                respostaHTML = respostaHTML + "Produto: " + dados[i].nome_produto +
                "<br>" + "Categoria: " + dados[i].nome_categoria + "<br>" + "Preço: R$ " + dados[i].preco_produto +
                "<br><br>";
            }

        }

        // Exibe os produtos encontrados
        document.getElementById("resp3").innerHTML = "<h3>Resultado da Pesquisa</h3><br>" + respostaHTML;
    }

    catch(erro){
        console.log(erro);
        document.getElementById("resp3").innerHTML =
        "Erro ao pesquisar os produtos.";
    }
}