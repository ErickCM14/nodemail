var nodemailer = require("nodemailer");
var express = require("express");
var bodyParser = require('body-parser')
var cors = require("cors");

//const { response } = require("express");
var app = express();

app.use(cors());
app.use(bodyParser.json())

const port = process.env.PORT || 3000;

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "erickcarranzameza@gmail.com",
        pass: "Carranza140299",
    },
});

app.listen(3000, () => {
    console.log("Servidor en => http://localhost:3000");
})

 app.get("/", (req, res) => {
    res.send("<h1 style= 'height:100vh; display:flex; justify-content:center; align-items:center; font-size:100px; '>Mercadology</h1>");
    console.log("Hola Mercadology");
})

//Envia archvio json de backup
app.post("/send-backup", (req, res) => {

    let archivo = req.body;

    sendBackup(archivo, info => {
        console.log("Se envio mensaje backup");
        res.send(info);
    })

})

async function sendBackup(archivo, callback) {
    let body = JSON.stringify(archivo);
    
    let mailOptions = {
        from: '"Mercadology" <erick@mercadology.mx>', // sender address
        to: "erickparacompartir@gmail.com", // list of receivers
        subject: "Backup",//"Hello ✔", // Subject line
        text: "", // plain text body
        html: "<p style='font-size:13px'><strong>Backup quincenal</strong></p>",
        attachments: [{
            filename: "backup.json",
            content: body
        }]
    };

    let info = await transporter.sendMail(mailOptions);

    callback(info);
}





//Envia correo con cuentas  a punto de vencer
app.post("/send-email", (req, res) => {

    let user = req.body;

    let mensaje = "<p style='font-size:15px'><strong>Cuentas que sus servicios estan por vencer:</strong></p>"
    user.forEach(element => {
        mensaje += "<p style='font-size:11px'><strong>" + element.msj + "</strong>" +
            "<br>Cliente: " + element.nomcli + "<br>" +
            "Nombre del dominio: " + element.domcli + "<br>" +
            "Vencimiento Hosting: " + element.hosven + "<br>" +
            "Vencimiento SSL: " + element.venssl + "</p>";
    });

    sendMail(mensaje, info => {
        console.log("Ha sido enviado el correo");
        res.send(info);
    })
});

async function sendMail(mensaje, callback) {

    let mailOptions = {
        from: '"Mercadology" <erick@mercadology.mx>', // sender address
        to: "erickparacompartir@gmail.com", // list of receivers
        subject: "Vencimiento de cuentas",//"Hello ✔", // Subject line
        text: mensaje, // plain text body
        html: mensaje
    };

    let info = await transporter.sendMail(mailOptions);

    callback(info);

}
