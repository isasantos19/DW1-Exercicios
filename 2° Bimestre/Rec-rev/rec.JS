//server.js

const express = require("express");
const os = require("os");
const cors = require("cors");

const app = express();
const porta = 3000;

app.use(express.json());

app.use(cors({
    origin: "*",
    methods: ["POST"],
    allowedHeaders: ["Content-Type"]
}));

const signos = [
    "Capricórnio",
    "Aquário",
    "Peixes",
    "Áries",
    "Touro",
    "Gêmeos",
    "Câncer",
    "Leão",
    "Virgem",
    "Libra",
    "Escorpião",
    "Sagitário"
];

const diasMudanca = [20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 22];

app.post("/signo", (req, res) => {

    const nome = req.body.nome;
    const dia = Number(req.body.dia);
    const mes = Number(req.body.mes);
    const signo = descobrirSigno(dia, mes);
    const pacoteResposta = {
        nome: nome.toUpperCase(),
        dia: dia,
        mes: mes,
        signo: signo
    };
    console.log(pacoteResposta);
    res.json(pacoteResposta);
});

function obterIP() {

    const interfaces = os.networkInterfaces();
    for (let nomeInterface in interfaces) {
        for (let info of interfaces[nomeInterface]) {
            if (info.family == "IPv4" && !info.internal) {
                return info.address;
            }
        }
    }

    return "localhost";

}

function descobrirSigno(dia, mes){
    let resp = "";

    for(let i = 0; i < diasMudanca.length; i++){

        if(mes == 1){

            if(dia < diasMudanca[i]){
                resp = "Capricórnio";
            }else{
                resp = "Aquário";
            }

        }else if(mes == 2){

            if(dia < diasMudanca[i]){
                resp = "Aquário";
            }else{
                resp = "Peixes";
            }

        }else if(mes == 3){

            if(dia < diasMudanca[i]){
                resp = "Peixes";
            }else{
                resp = "Áries";
            }

        }else if(mes == 4){

            if(dia < diasMudanca[i]){
                resp = "Áries";
            }else{
                resp = "Touro";
            }

        }else if(mes == 5){

            if(dia < diasMudanca[i]){
                resp = "Touro";
            }else{
                resp = "Gêmeos";
            }

        }else if(mes == 6){

            if(dia < diasMudanca[i]){
                resp = "Gêmeos";
            }else{
                resp = "Câncer";
            }

        }else if(mes == 7){

            if(dia < diasMudanca[i]){
                resp = "Câncer";
            }else{
                resp = "Leão";
            }

        }else if(mes == 8){

            if(dia < diasMudanca[i]){
                resp = "Leão";
            }else{
                resp = "Virgem";
            }

        }else if(mes == 9){

            if(dia < diasMudanca[i]){
                resp = "Virgem";
            }else{
                resp = "Libra";
            }

        }else if(mes == 10){

            if(dia < diasMudanca[i]){
                resp = "Libra";
            }else{
                resp = "Escorpião";
            }

        }else if(mes == 11){

            if(dia < diasMudanca[i]){
                resp = "Escorpião";
            }else{
                resp = "Sagitário";
            }

        }else if(mes == 12){

            if(dia < diasMudanca[i]){
                resp = "Sagitário";
            }else{
                resp = "Capricórnio";
            }
        }
    }
    return resp;
}

const ip = obterIP();

app.listen(porta, "0.0.0.0", () => {

    console.log(" SERVIDOR DE SIGNOS DO ZODÍACO ");

    console.log(`Servidor: http://${ip}:${porta}`);

    console.log("Aguardando requisições...");

});