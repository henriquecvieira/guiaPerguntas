const express = require("express");
const res = require("express/lib/response");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database.js");
const perguntaModel = require("./database/Pergunta");




//database
connection
    .authenticate()
    .then(() => {
        console.log('conexão com o banco de dados realizada com sucesso!')
    }).catch((error) => {
        console.log(error);
    });

//estou dizendo para o express usar o EJS como View Engine
app.set('view engine', 'ejs');
app.use(express.static('./public'))

//BodyParser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Rotas
app.get("/", (req, res)=>{  
    res.render("index")     
})
app.get("/perguntar", (req, res)=>{  
    res.render("perguntar")     
})

app.post("/salvarpergunta", (req, res)=>{  
    let titulo = req.body.titulo
    let descricao = req.body.descricao
    res.send("formulário recebido! título " + titulo + " " + "descrição" + descricao)         
})

app.listen(8080, ()=>{console.log("Back end started at http://localhost:8080!")
})