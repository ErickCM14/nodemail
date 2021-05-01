var nodemailer = require("nodemailer");
var express = require("express");
var bodyParser = require('body-parser')
var cors = require("cors");

const port = process.env.PORT || 3000;
//const { response } = require("express");
var app = express();

// app.use(cors({ origin: '*' }));
app.use(cors());
app.use(bodyParser.json())

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
//     res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
//     next();
// });


let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    post: 587,
    secure: false,
    auth: {
        user: "erickcarranzameza@gmail.com",
        pass: "Carranza140299",
    },
});

app.listen(port, () => {
    console.log("Servidor en => http://localhost:3000");
})


//EJEMPLOS
app.get('/prueba', function (req, res, next) {
    res.send("This is CORS-enabled for all origins!")
})

app.post('/prueba', function (req, res, next) {
    res.send("This is CORS-enabled for all origins! POST")
})

app.post('/pruebaMensaje', function (req, res, next) {
    let mensaje =  req.body
    res.send(mensaje);
})
//----------

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
res.send("Hola");
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