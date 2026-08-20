const express = require('express');
const os = require('os');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Configuração do pool de conexão com PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

// Middleware para receber JSON
app.use(express.json());

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

// ============================================================
// 1. LISTAR TODOS OS FILMES
// ============================================================

app.get('/filmes', async (req, res) => {
    try {
        const query = `
            SELECT 
                id_filme,
                nome_filme,
                diretor_filme,
                categoria_filme,
                duracao_filme
            FROM public.filme
            ORDER BY id_filme
        `;

        const result = await pool.query(query);

        res.json({
            sucesso: true,
            filmes: result.rows
        });

    } catch (error) {
        console.error('Erro ao listar filmes:', error);

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno do servidor'
        });
    }
});

// ============================================================
// 2. BUSCAR FILME POR ID
// ============================================================

app.get('/filme/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
            SELECT 
                id_filme,
                nome_filme,
                diretor_filme,
                categoria_filme,
                duracao_filme
            FROM public.filme
            WHERE id_filme = $1
        `;

        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Filme não encontrado com este ID'
            });
        }

        res.json({
            sucesso: true,
            filme: result.rows[0]
        });

    } catch (error) {
        console.error('Erro ao buscar filme:', error);

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno do servidor'
        });
    }
});

// ============================================================
// 3. INSERIR FILME
// ============================================================

app.post('/filme', async (req, res) => {
    try {
        const {
            id_filme,
            nome,
            diretor,
            categoria,
            duracao
        } = req.body;

        const query = `
            INSERT INTO public.filme
            (id_filme, nome_filme, diretor_filme, categoria_filme, duracao_filme)
            VALUES ($1, $2, $3, $4, $5)
        `;

        await pool.query(query, [
            id_filme,
            nome,
            diretor,
            categoria,
            duracao
        ]);

        res.json({
            sucesso: true,
            mensagem: 'Filme inserido com sucesso!'
        });

    } catch (error) {
        console.error('Erro ao inserir filme:', error);

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao inserir filme'
        });
    }
});

// ============================================================
// 4. ALTERAR FILME
// ============================================================

app.put('/filme/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const {
            nome,
            diretor,
            categoria,
            duracao
        } = req.body;

        const query = `
            UPDATE public.filme
            SET 
                nome_filme = $1,
                diretor_filme = $2,
                categoria_filme = $3,
                duracao_filme = $4
            WHERE id_filme = $5
        `;

        await pool.query(query, [
            nome,
            diretor,
            categoria,
            duracao,
            id
        ]);

        res.json({
            sucesso: true,
            mensagem: 'Filme atualizado com sucesso!'
        });

    } catch (error) {
        console.error('Erro ao atualizar filme:', error);

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao atualizar filme'
        });
    }
});

// ============================================================
// 5. EXCLUIR FILME
// ============================================================

app.delete('/filme/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
            DELETE FROM public.filme
            WHERE id_filme = $1
        `;

        await pool.query(query, [id]);

        res.json({
            sucesso: true,
            mensagem: 'Filme excluído com sucesso!'
        });

    } catch (error) {
        console.error('Erro ao excluir filme:', error);

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao excluir filme'
        });
    }
});

// ============================================================
// SERVIDOR
// ============================================================

const obterIP = () => {
    const interfaces = os.networkInterfaces();

    for (let nomeInterface in interfaces) {
        for (let info of interfaces[nomeInterface]) {

            if (info.family === 'IPv4' && !info.internal) {
                return info.address;
            }
        }
    }

    return 'localhost';
};

const ip = obterIP();

app.listen(port, '0.0.0.0', () => {

    console.log(`Servidor rodando em http://${ip}:${port}`);

    console.log(`Rotas disponíveis:`);
    console.log(`  GET    http://${ip}:${port}/filmes`);
    console.log(`  GET    http://${ip}:${port}/filme/:id`);
    console.log(`  POST   http://${ip}:${port}/filme`);
    console.log(`  PUT    http://${ip}:${port}/filme/:id`);
    console.log(`  DELETE http://${ip}:${port}/filme/:id`);
});