class Filme {
    constructor(id, nome, diretor, categoria, duracao, posicaoNaLista) {
        this.id = id;
        this.nome = nome;
        this.diretor = diretor;
        this.categoria = categoria;
        this.duracao = duracao;

        this.posicaoNaLista = posicaoNaLista; //atributo para facilitar a alteração e exclusão 
    }
}