// Traz o Express para o projeto.
// É ele que vai criar o nosso servidor.
const express = require("express");

// Traz o Pool.
// Ele serve para fazer a conexão com o banco de dados.
const { Pool } = require("pg");

// Lê o arquivo .env.
// É nele que estão guardadas as informações do banco.
require("dotenv").config();

// Cria o servidor.
const app = express();

// Escolhe em qual porta o servidor vai ficar "escutando"
// as requisições do navegador.
const porta = process.env.PORT || 3001;

// Informa como conectar ao banco de dados.
const pool = new Pool({

    // Endereço do banco
    host: process.env.DB_HOST,

    // Porta do banco
    port: process.env.DB_PORT,

    // Nome do banco de dados
    database: process.env.DB_NAME,

    // Usuário do banco
    user: process.env.DB_USER,

    // Senha do banco
    password: process.env.DB_PASSWORD
});

// Tenta fazer a conexão com o banco.
pool.connect() 

// Se conseguir conectar
.then(()=>{
    console.log("Banco conectado com sucesso!");
})
// Se acontecer algum erro
.catch((erro)=>{
    console.log("ERRO AO CONECTAR");
    console.log(erro);
});

// Permite receber dados em JSON
app.use(express.json());

// Configura quem pode conversar com o servidor.
app.use((req,res,next)=>{

    // Permite que qualquer página acesse o servidor.
    res.header("Access-Control-Allow-Origin","*");

    // Diz quais tipos de requisição o servidor aceita.
    res.header("Access-Control-Allow-Methods","GET, POST");

    // Permite enviar informações em JSON.
    res.header("Access-Control-Allow-Headers","Content-Type");

    // Depois de fazer essa configuração,
    // continua a execução do programa.
    next();
});

///////////////////////////////////////////////////

// Quando alguém acessar a rota "/produtos"
app.get("/produtos", async(req,res)=>{

    try{
        // Busca todos os produtos do banco.
        const consulta = "SELECT * FROM produto ORDER BY nome_produto";

        // Executa a consulta.
        const resultado = await pool.query(consulta);

        // Envia o resultado para o navegador.
        res.json(resultado.rows);
    }

    catch(erro){
        // Mostra o erro no terminal.
        console.log(erro);

        // Envia uma mensagem de erro.
        res.status(500).json({
            mensagem:"Erro ao consultar produtos."
        });
    }
});

/////////////////////////////////////////////////////////////

// Quando alguém acessar a rota "/categorias"
app.get("/categorias", async(req,res)=>{

    try{

        // Busca todas as categorias do banco.
        const consulta = "SELECT * FROM categoria ORDER BY nome_categoria";

        // Executa a consulta.
        const resultado = await pool.query(consulta);

        // Envia o resultado para o navegador.
        res.json(resultado.rows);
    }

    catch(erro){

        // Mostra o erro no terminal.
        console.log(erro);

        // Envia uma mensagem de erro.
        res.status(500).json({
            mensagem:"Erro ao consultar categorias."
        });
    }
});

////////////////////////////////////////////////////////

// Quando alguém acessar a rota "/produtos-categoria"
app.get("/produtos-categoria", async(req,res)=>{ 

    try{

        // Junta as tabelas produto e categoria.
        const consulta =
        "SELECT produto.nome_produto, " +
        "produto.preco_produto, " +
        "categoria.nome_categoria " +
        "FROM produto " +
        "INNER JOIN categoria " +
        "ON produto.id_categoria = categoria.id_categoria " +
        "ORDER BY categoria.nome_categoria, produto.nome_produto";

        // Executa a consulta.
        const resultado = await pool.query(consulta);

        // Envia o resultado para o navegador.
        res.json(resultado.rows);
    }

    catch(erro){

        // Mostra o erro no terminal.
        console.log(erro);

        // Envia uma mensagem de erro.
        res.status(500).json({
            mensagem:"Erro ao consultar produtos por categoria."
        });
    }
});

////////////////////////////////////////////////////

// Quando o navegador enviar uma pesquisa de produto.
app.post("/pesquisarProduto", async(req,res)=>{

    try{

        // Recebe o nome digitado pelo usuário.
        const nome = req.body.nome;

        console.log("--------------------------------");
        console.log("Nome recebido:");
        console.log(nome);

        // Procura o produto pelo nome.
        const consulta =
        "SELECT produto.nome_produto, " +
        "produto.preco_produto, " +
        "categoria.nome_categoria " +
        "FROM produto " +
        "INNER JOIN categoria " +
        "ON produto.id_categoria = categoria.id_categoria " +
        "WHERE produto.nome_produto ILIKE '%" + nome + "%'";

        console.log("--------------------------------");
        console.log("Consulta SQL:");
        console.log(consulta);

        // Executa a consulta.
        const resultado = await pool.query(consulta);

        console.log("--------------------------------");
        console.log("Resultado da consulta:");
        console.log(resultado.rows);

        // Envia o resultado para o navegador.
        res.json(resultado.rows);
    }

    catch(erro){

        // Mostra o erro no terminal.
        console.log("--------------------------------");
        console.log("ERRO AO PESQUISAR PRODUTO");
        console.log(erro);

        // Envia uma mensagem de erro.
        res.status(500).json({
            mensagem:"Erro ao pesquisar produto."
        });
    }
});

//////////////////////////////////////////////////////////

// Quando o navegador enviar a categoria e a faixa de preço.
app.post("/pesquisarCategoria", async(req,res)=>{

    try{
        // Recebe a categoria e a faixa escolhidas.
        const categoria = req.body.categoria;
        const faixa = req.body.faixa;

        // Começa a montar a consulta.
        let consulta =
        "SELECT produto.nome_produto, " +
        "produto.preco_produto, " +
        "categoria.nome_categoria " +
        "FROM produto " +
        "INNER JOIN categoria " +
        "ON produto.id_categoria = categoria.id_categoria " +
        "WHERE categoria.id_categoria = " + categoria;

        // Se escolher a primeira faixa.
        if(faixa == "1"){
            consulta = consulta + " AND produto.preco_produto <= 10";
        }

        // Se escolher a segunda faixa.
        if(faixa == "2"){
            consulta = consulta + " AND produto.preco_produto > 10" + " AND produto.preco_produto <= 20";
        }

        // Se escolher a terceira faixa.
        if(faixa == "3"){
            consulta = consulta + " AND produto.preco_produto > 20";
        }

        // Coloca os produtos em ordem alfabética.
        consulta = consulta + " ORDER BY produto.nome_produto";

        // Executa a consulta.
        const resultado = await pool.query(consulta);

        // Envia o resultado para o navegador.
        res.json(resultado.rows);
    }

    catch(erro){

        // Mostra o erro no terminal.
        console.log(erro);

        // Envia uma mensagem de erro.
        res.status(500).json({
            mensagem:"Erro ao pesquisar categoria."
        });
    }
});

//////////////////////////////////////////////////////

// Liga o servidor.
app.listen(porta, ()=>{

    console.log("Servidor iniciado.");
    // Mostra o endereço do servidor.
    console.log("http://localhost:" + porta);
});