DROP TABLE IF EXISTS categoria, produto;

-- Criação das tabelas

CREATE TABLE categoria(
    id_categoria SERIAL,
    nome_categoria VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_categoria)
);

CREATE TABLE produto(
    id_produto SERIAL,
    nome_produto VARCHAR(100) NOT NULL,
    preco_produto DECIMAL(10,2) NOT NULL,
    id_categoria INTEGER NOT NULL,
    PRIMARY KEY (id_produto),
    CONSTRAINT fk_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES categoria(id_categoria)
);

-- Inserção de Dados

-- Categoria 
INSERT INTO categoria(nome_categoria) VALUES
('Bebidas'),
('Frutas'),
('Higiene'),
('Limpeza'),
('Doces');

-- Produtos
INSERT INTO produto (nome_produto, preco_produto, id_categoria) VALUES

-- BEBIDAS
('Coca-Cola 2L', 11.99, 1),
('Guaraná Antarctica 2L', 9.50, 1),
('Suco de Laranja 1L', 8.90, 1),
('Água Mineral 500ml', 2.50, 1),
('Pepsi 2L', 9.90, 1),
('Fanta Laranja 2L', 9.40, 1),
('Sprite 2L', 9.20, 1),
('Suco de Uva 1L', 8.80, 1),
('Chá Gelado Limão', 6.50, 1),
('Água de Coco 1L', 8.50, 1),
('Energético 250ml', 11.50, 1),
('Fanta Uva 2L', 8.50, 1),

-- FRUTAS 
('Tangerina', 7.49, 2),
('Mexerica', 7.20, 2),
('Bergamota', 8.10, 2),
('Poncã', 8.40, 2),
('Murcott', 9.10, 2),
('Cravo', 7.90, 2),
('Montenegrina', 8.60, 2),
('Clemenules', 9.30, 2),
('Dekopon', 12.90, 2),
('Dancy', 8.70, 2),
('Robson', 10.50, 2),
('Ponko',7.50,2),

-- HIGIENE
('Sabonete', 4.99, 3),
('Shampoo', 15.90, 3),
('Creme Dental', 7.50, 3),
('Condicionador', 16.90, 3),
('Escova de Dentes', 8.50, 3),
('Fio Dental', 6.90, 3),
('Desodorante', 13.50, 3),
('Sabonete Líquido', 12.90, 3),
('Lenço Umedecido', 9.50, 3),
('Enxaguante Bucal', 17.90, 3),
('Papel Higiênico', 22.90, 3),
('Creme de Cabelo', 18.50, 3),

-- LIMPEZA
('Detergente', 2.99, 4),
('Água Sanitária', 5.99, 4),
('Sabão em Pó', 18.90, 4),
('Amaciante', 19.90, 4),
('Desinfetante', 8.90, 4),
('Limpador Multiuso', 10.90, 4),
('Esponja', 3.50, 4),
('Sabão em Barra', 9.90, 4),
('Álcool 70%', 8.50, 4),
('Limpa Vidros', 11.90, 4),
('Lustra Móveis', 13.50, 4),
('Pinho sol', 19.50, 4),

-- DOCES
('Chocolate', 8.99, 5),
('Pipoca Doce', 3.50, 5),
('Paçoca', 2.00, 5),
('Bombom', 2.50, 5),
('Bala', 4.90, 5),
('Pirulito', 1.50, 5),
('Doce de Leite', 10.90, 5),
('Pé de Moleque', 5.50, 5),
('Maria Mole', 4.50, 5),
('Goiabada', 7.90, 5),
('Chocolate Branco', 9.90, 5),
('Kit Kat', 7.50, 5);
