let listafilme = []; //conjunto de dados
let oQueEstaFazendo = ''; //variável global de controle
let filme = null; //variavel global 
bloquearAtributos(true);
//backend (não interage com o html)
function procurePorChavePrimaria(chave) {
    for (let i = 0; i < listafilme.length; i++) {
        const filme = listafilme[i];
        if (filme.id == chave) {
            filme.posicaoNaLista = i;
            return listafilme[i];
        }
    }
    return null;//não achou
}

// Função para procurar um elemento pela chave primária   -------------------------------------------------------------
function procure() {
    const id = document.getElementById("inputId").value;
    if (isNaN(id) || !Number.isInteger(Number(id))) {
        mostrarAviso("Precisa ser um número inteiro");
        document.getElementById("inputId").focus();
        return;
    }

    if (id) { // se digitou um Id
        filme = procurePorChavePrimaria(id);
        if (filme) { //achou na lista
            mostrarDadosfilme(filme);
            visibilidadeDosBotoes('inline', 'none', 'inline', 'inline', 'none'); // Habilita botões de alterar e excluir
            mostrarAviso("Achou na lista, pode alterar ou excluir");
        } else { //não achou na lista
            limparAtributos();
            visibilidadeDosBotoes('inline', 'inline', 'none', 'none', 'none');
            mostrarAviso("Não achou na lista, pode inserir");
        }
    } else {
        document.getElementById("inputId").focus();
        return;
    }
}

//backend->frontend
function inserir() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline'); //visibilidadeDosBotoes(procure,inserir,alterar,excluir,salvar)
    oQueEstaFazendo = 'inserindo';
    mostrarAviso("INSERINDO - Digite os atributos e clique o botão salvar");
    document.getElementById("inputId").focus();

}

// Função para alterar um elemento da lista
function alterar() {

    // Remove o readonly dos campos
    bloquearAtributos(false);

    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');

    oQueEstaFazendo = 'alterando';
    mostrarAviso("ALTERANDO - Digite os atributos e clique o botão salvar");
}

// Função para excluir um elemento da lista
function excluir() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline'); //visibilidadeDosBotoes(procure,inserir,alterar,excluir,salvar)

    oQueEstaFazendo = 'excluindo';
    mostrarAviso("EXCLUINDO - clique o botão salvar para confirmar a exclusão");
}

function salvar() {
    //gerencia operações inserir, alterar e excluir na lista

    // obter os dados a partir do html

    let id;
    if (filme == null) {
        id = parseInt(document.getElementById("inputId").value);
    } else {
        id = filme.id;
    }

    const nome = document.getElementById("inputNome").value;
    const diretor = document.getElementById("inputdiretor").value;
    const categoria = document.getElementById("inputcategoria").value;
    const duracao = document.getElementById("inputduracao").value;

    //verificar se o que foi digitado pelo USUÁRIO está correto
    if (id && nome && diretor && categoria && duracao) {// se tudo certo 
        switch (oQueEstaFazendo) {
            case 'inserindo':
                filme = new Filme(id, nome, diretor, categoria, duracao);
                listafilme.push(filme);
                mostrarAviso("Inserido na lista");
                break;
            case 'alterando':
                filmeAlterado = new Filme(id, nome, diretor, categoria, duracao);
                listafilme[filme.posicaoNaLista] = filmeAlterado;
                mostrarAviso("Alterado");
                break;
            case 'excluindo':
                let novaLista = [];
                for (let i = 0; i < listafilme.length; i++) {
                    if (filme.posicaoNaLista != i) {
                        novaLista.push(listafilme[i]);
                    }
                }
                listafilme = novaLista;
                mostrarAviso("EXCLUIDO");
                break;
            default:
                // console.error('Ação não reconhecida: ' + oQueEstaFazendo);
                mostrarAviso("Erro aleatório");
        }
        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        listar();
        document.getElementById("inputId").focus();
    } else {
        alert("Erro nos dados digitados");
        return;
    }
}

//backend
function preparaListagem(vetor) {
    let texto = "";
    for (let i = 0; i < vetor.length; i++) {
        const linha = vetor[i];
        texto +=
            linha.id + " - " +
            linha.nome + " - " +
            linha.diretor + " - " +
            linha.categoria + " - " +
            linha.duracao + " <br>";
    }
    return texto;
}

//backend->frontend (interage com html)
function listar() {
    document.getElementById("outputSaida").innerHTML = preparaListagem(listafilme);
}

function cancelarOperacao() {
    limparAtributos();
    bloquearAtributos(true);
    visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
    mostrarAviso("Cancelou a operação de edição");
}

function mostrarAviso(mensagem) {
    //printa a mensagem na divAviso
    document.getElementById("divAviso").innerHTML = mensagem;
}

// Função para mostrar os dados do filme nos campos
function mostrarDadosfilme(filme) {
    document.getElementById("inputId").value = filme.id;
    document.getElementById("inputNome").value = filme.nome;
    document.getElementById("inputdiretor").value = filme.diretor;
    document.getElementById("inputcategoria").value = filme.categoria;
    document.getElementById("inputduracao").value = filme.duracao;

    // Define os campos como readonly
    bloquearAtributos(true);
}

// Função para limpar os dados dos campos
function limparAtributos() {
    document.getElementById("inputNome").value = "";
    document.getElementById("inputdiretor").value = "";
    document.getElementById("inputcategoria").value = "";
     document.getElementById("inputduracao").value = "";

    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    //quando a chave primaria possibilita edicao, tranca (readonly) os outros e vice-versa
    document.getElementById("inputId").readOnly = !soLeitura;
    document.getElementById("inputNome").readOnly = soLeitura;
    document.getElementById("inputdiretor").readOnly = soLeitura;
    document.getElementById("inputcategoria").readOnly = soLeitura;
    document.getElementById("inputduracao").readOnly = soLeitura;
}

// Função para deixar visível ou invisível os botões
function visibilidadeDosBotoes(btProcure, btInserir, btAlterar, btExcluir, btSalvar) {
    //  visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline'); 
    //none significa que o botão ficará invisível (visibilidade == none)
    //inline significa que o botão ficará visível 

    document.getElementById("btProcure").style.display = btProcure;
    document.getElementById("btInserir").style.display = btInserir;
    document.getElementById("btAlterar").style.display = btAlterar;
    document.getElementById("btExcluir").style.display = btExcluir;
    document.getElementById("btSalvar").style.display = btSalvar;
    document.getElementById("btCancelar").style.display = btSalvar; // o cancelar sempre aparece junto com o salvar
    document.getElementById("inputId").focus();
}

function persistirEmLocalPermanente(arquivoDestino, conteudo) {
    /*cria um blob (objeto que representa dados de arquivo) que armazena "[conteudo]" como arquivo de texto,
    criando um arquivo temporário*/
    const blob = new Blob([conteudo], { type: 'text/plain' });
    //cria o elemento "a" (link temporário) usado para adicionar o dowload do arquivo
    const link = document.createElement('a');
    /*cria uma URL temporária que aponta para o blob e
    atribui ela ao href do link para que ele "aponte" para o arquivo gerado (permitindo seu download)*/
    
    link.href = URL.createObjectURL(blob);
    link.download = arquivoDestino;
    link.click();

    URL.revokeObjectURL(link.href);
}

// Função para abrir o seletor de arquivos para upload (para processar o arquivo selecionado)
function abrirArquivoSalvoEmLocalPermanente() {

    const input = document.createElement('input');

    input.type = 'file';
    input.accept = '.csv';

    input.onchange = function (event) {

        const arquivo = event.target.files[0];

        if (arquivo) {
            console.log(arquivo.name);
            converterDeCSVparaListaObjeto(arquivo);
        }
    };

    input.click();
}

function prepararESalvarCSV() {
    let nomeDoArquivoDestino = "./filme.csv";
    let textoCSV = "";
    let fimDeLinha = "\n";

    for (let i = 0; i < listafilme.length; i++) {
        const linha = listafilme[i];

        if (i == listafilme.length - 1) {
            fimDeLinha = "";
        }

        textoCSV += linha.id + ";" +
            linha.nome + ";" +
            linha.diretor + ";" +
            linha.categoria + ";" +
            linha.duracao + fimDeLinha;
    }

    persistirEmLocalPermanente(nomeDoArquivoDestino, textoCSV);
}

// Função para processar o arquivo CSV e transferir os dados para a listafilme
function converterDeCSVparaListaObjeto(arquivo) {

    const leitor = new FileReader();  //objeto que permite ler arquivos locais no navegador 
    leitor.onload = function (e) {
        const conteudo = e.target.result; // Conteúdo do arquivo CSV
        const linhas = conteudo.split('\n'); // Separa o conteúdo por linha
        listafilme = []; // Limpa a lista atual (se necessário)

        for (let i = 0; i < linhas.length; i++) {
            const linha = linhas[i].trim();  //linhas[i] representa cada linha do arquivo CSV
            if (linha) { //verifica se a linha não está vazia
                const dados = linha.split(';'); // Separa os dados por ';'
                if (dados.length === 5) {
                listafilme.push({
                id: dados[0],
                nome: dados[1],
                diretor: dados[2],
                categoria: dados[3],
                duracao: dados[4]
                });
                }
            }
        }
        listar(); //exibe a lista atualizada
    };
    leitor.readAsText(arquivo); // Lê o arquivo como texto
}

