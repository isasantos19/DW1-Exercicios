const URL_API = 'http://localhost:3001';

let oQueEstaFazendo = '';
let filme = null;

bloquearAtributos(true);

// ============================================================
// BUSCAR FILME POR ID
// ============================================================

async function procurePorChavePrimaria(chave) {

    try {

        const resposta = await fetch(`${URL_API}/filme/${chave}`);

        const data = await resposta.json();

        if (data.sucesso) {
            return data.filme;
        }

        return null;

    } catch (erro) {

        console.error('Erro na consulta:', erro);

        return null;
    }
}

// ============================================================
// PROCURAR
// ============================================================

async function procure() {

    const id_filme = document.getElementById("inputId_filme").value;

    if (
        id_filme === "" ||
        isNaN(id_filme) ||
        !Number.isInteger(Number(id_filme))
    ) {

        mostrarAviso("Precisa ser um número inteiro");

        document.getElementById("inputId_filme").focus();

        return;
    }

    filme = await procurePorChavePrimaria(id_filme);

    if (filme) {

        mostrarDadosfilme(filme);

        visibilidadeDosBotoes(
            'inline',
            'none',
            'inline',
            'inline',
            'none'
        );

        mostrarAviso("Achou no banco, pode alterar ou excluir");

    } else {

        limparAtributos();

        document.getElementById("inputId_filme").value = id_filme;

        visibilidadeDosBotoes(
            'inline',
            'inline',
            'none',
            'none',
            'none'
        );

        mostrarAviso("Não achou no banco, pode inserir");
    }
}

// ============================================================
// INSERIR
// ============================================================

function inserir() {

    bloquearAtributos(false);

    visibilidadeDosBotoes(
        'none',
        'none',
        'none',
        'none',
        'inline'
    );

    oQueEstaFazendo = 'inserindo';

    mostrarAviso(
        "INSERINDO - Digite os atributos e clique em salvar"
    );

    document.getElementById("inputnome").focus();
}

// ============================================================
// ALTERAR
// ============================================================

function alterar() {

    bloquearAtributos(false);

    visibilidadeDosBotoes(
        'none',
        'none',
        'none',
        'none',
        'inline'
    );

    oQueEstaFazendo = 'alterando';

    mostrarAviso(
        "ALTERANDO - Digite os atributos e clique em salvar"
    );
}

// ============================================================
// EXCLUIR
// ============================================================

function excluir() {

    bloquearAtributos(true);

    visibilidadeDosBotoes(
        'none',
        'none',
        'none',
        'none',
        'inline'
    );

    oQueEstaFazendo = 'excluindo';

    mostrarAviso(
        "EXCLUINDO - Clique em salvar para confirmar a exclusão"
    );
}

// ============================================================
// SALVAR
// ============================================================

async function salvar() {

    const id_filme = filme
        ? filme.id_filme
        : parseInt(
            document.getElementById("inputId_filme").value
        );

    const nome =
        document.getElementById("inputnome").value;

    const diretor =
        document.getElementById("inputdiretor").value;

    const categoria =
        parseInt(
            document.getElementById("inputcategoria").value
        );

    const duracao =
        parseInt(
            document.getElementById("inputduracao").value
        );

    if (
        !id_filme ||
        !nome ||
        !diretor ||
        !categoria ||
        !duracao
    ) {

        alert("Erro nos dados digitados");

        return;
    }

    const dadosfilme = {
        id_filme,
        nome,
        diretor,
        categoria,
        duracao
    };

    try {

        // INSERIR
        if (oQueEstaFazendo === 'inserindo') {

            await fetch(`${URL_API}/filme`, {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(dadosfilme)
            });

            mostrarAviso(
                "Inserido no Banco de Dados com sucesso!"
            );
        }

        // ALTERAR
        else if (oQueEstaFazendo === 'alterando') {

            await fetch(`${URL_API}/filme/${id_filme}`, {

                method: 'PUT',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(dadosfilme)
            });

            mostrarAviso(
                "Alterado no Banco de Dados com sucesso!"
            );
        }

        // EXCLUIR
        else if (oQueEstaFazendo === 'excluindo') {

            await fetch(`${URL_API}/filme/${id_filme}`, {

                method: 'DELETE'
            });

            mostrarAviso(
                "Excluído do Banco de Dados!"
            );
        }

        visibilidadeDosBotoes(
            'inline',
            'none',
            'none',
            'none',
            'none'
        );

        limparAtributos();

        document.getElementById(
            "inputId_filme"
        ).value = "";

        listar();

    } catch (erro) {

        console.error(erro);

        mostrarAviso(
            "Erro ao efetuar operação no servidor."
        );
    }
}

// ============================================================
// LISTAR
// ============================================================

async function listar() {

    try {

        const resposta =
            await fetch(`${URL_API}/filmes`);

        const data =
            await resposta.json();

        if (data.sucesso) {

            document.getElementById(
                "outputSaida"
            ).innerHTML =
                preparaListagem(data.filmes);

        } else {

            document.getElementById(
                "outputSaida"
            ).innerHTML =
                "Erro ao carregar dados.";
        }

    } catch (erro) {

        console.error(erro);

        document.getElementById(
            "outputSaida"
        ).innerHTML =
            "Servidor offline.";
    }
}

// ============================================================
// PREPARAR LISTAGEM
// ============================================================

function preparaListagem(vetor) {

    let texto = "";

    for (let i = 0; i < vetor.length; i++) {

        const linha = vetor[i];

        texto += `
            ${linha.id_filme} -
            ${linha.nome_filme} -
            ${linha.diretor_filme} -
            ${linha.categoria_filme} -
            ${linha.duracao_filme} minutos
            <br>
        `;
    }

    return texto || "Nenhum filme cadastrado.";
}

// ============================================================
// CANCELAR
// ============================================================

function cancelarOperacao() {

    limparAtributos();

    bloquearAtributos(true);

    visibilidadeDosBotoes(
        'inline',
        'none',
        'none',
        'none',
        'none'
    );

    mostrarAviso("Cancelou a operação");
}

// ============================================================
// MOSTRAR AVISO
// ============================================================

function mostrarAviso(mensagem) {

    document.getElementById(
        "divAviso"
    ).innerHTML = mensagem;
}

// ============================================================
// MOSTRAR DADOS DO FILME
// ============================================================

function mostrarDadosfilme(filme) {

    document.getElementById(
        "inputId_filme"
    ).value = filme.id_filme;

    document.getElementById(
        "inputnome"
    ).value = filme.nome_filme;

    document.getElementById(
        "inputdiretor"
    ).value = filme.diretor_filme;

    document.getElementById(
        "inputcategoria"
    ).value = filme.categoria_filme;

    document.getElementById(
        "inputduracao"
    ).value = filme.duracao_filme;

    bloquearAtributos(true);
}

// ============================================================
// LIMPAR ATRIBUTOS
// ============================================================

function limparAtributos() {

    filme = null;

    document.getElementById(
        "inputnome"
    ).value = "";

    document.getElementById(
        "inputdiretor"
    ).value = "";

    document.getElementById(
        "inputcategoria"
    ).value = "";

    document.getElementById(
        "inputduracao"
    ).value = "";

    bloquearAtributos(true);
}

// ============================================================
// BLOQUEAR / DESBLOQUEAR CAMPOS
// ============================================================

function bloquearAtributos(soLeitura) {

    document.getElementById(
        "inputId_filme"
    ).readOnly = !soLeitura;

    document.getElementById(
        "inputnome"
    ).readOnly = soLeitura;

    document.getElementById(
        "inputdiretor"
    ).readOnly = soLeitura;

    document.getElementById(
        "inputcategoria"
    ).readOnly = soLeitura;

    document.getElementById(
        "inputduracao"
    ).readOnly = soLeitura;
}

// ============================================================
// VISIBILIDADE DOS BOTÕES
// ============================================================

function visibilidadeDosBotoes(
    btProcure,
    btInserir,
    btAlterar,
    btExcluir,
    btSalvar
) {

    document.getElementById(
        "btProcure"
    ).style.display = btProcure;

    document.getElementById(
        "btInserir"
    ).style.display = btInserir;

    document.getElementById(
        "btAlterar"
    ).style.display = btAlterar;

    document.getElementById(
        "btExcluir"
    ).style.display = btExcluir;

    document.getElementById(
        "btSalvar"
    ).style.display = btSalvar;

    document.getElementById(
        "btCancelar"
    ).style.display = btSalvar;

    document.getElementById(
        "inputId_filme"
    ).focus();
}