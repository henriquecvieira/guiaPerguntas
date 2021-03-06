const express = require("express");
const res = require("express/lib/response");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database.js");
const Pergunta = require("./database/Pergunta"); //Pergunta é a variavel represantante da tabela no código
const Resposta = require("./database/Resposta");




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
app.get("/",(req, res) => {  
    Pergunta.findAll({raw: true, order:[
        ['id', 'DESC'] //desc = decrescente || asc = ascendente
    ]}).then(perguntas => {        
        res.render("index",{ 
            perguntas: perguntas
        });
    })
        
})
app.get("/perguntar.ejs", (req, res)=>{  
    res.render("perguntar");     
})

app.post("/salvarpergunta", (req, res)=> {  
    var titulo = req.body.titulo
    var descricao = req.body.descricao

    Pergunta.create({
         titulo: titulo,
         descricao: descricao,
    }).then(() => {
        res.redirect("/")
    });

})

app.get("/pergunta/:id",(req, res) => {
    var id = req.params.id
    Pergunta.findOne({
        where: {id: id}
}).then(pergunta =>{
    if(pergunta != undefined){ //pergunta localizada
        Resposta.findAll({raw: true,           
            where:{perguntaId: pergunta.id},
            order:[
                ["id", "DESC"]
            ],    

        }).then(respostas => {
            if(Resposta != ''){}
            res.render("pergunta",{
                pergunta: pergunta,
                respostas: respostas
        })        
        });
    }else{ // caso a pergunta não seja encontrada
        res.redirect("/");
    }
});
});

app.post("/responder", (req, res) =>{
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/"+perguntaId);
    });
})

app.listen(8080, ()=>{console.log("Back end started at http://localhost:8080!");})