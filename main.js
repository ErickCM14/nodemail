var nodemailer = require("nodemailer");
const {google} = require('googleapis')
const { OAuth2 } = google.auth ;
var express = require("express");
var bodyParser = require('body-parser')
var cors = require("cors");

const port = process.env.PORT || 3000;
//const { response } = require("express");
var app = express();

// app.use(cors({ origin: '*' }));
app.use(cors());
app.use(bodyParser.json())

let mailOptions;
let info;

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
//     res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
//     next();
// });

const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground';

const { MAILING_SERVICE_CLIENT_ID, MAILING_SERVICE_CLIENT_SECRET, 
    MAILING_SERVICE_REFRESH_TOKEN, SENDER_EMAIL_ADDRESS} = process.env;

const Mailing = {};

const oauth2Client = new OAuth2(
    MAILING_SERVICE_CLIENT_ID, MAILING_SERVICE_CLIENT_SECRET, OAUTH_PLAYGROUND
);


// let transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     post: 587,
//     secure: false,
//     auth: {
//         user: "erickcarranzameza@gmail.com",
//         pass: "Carranza140299",
//     },
// });


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

    let mailOptions = {
        from: 'erickcarranzameza@gmail.com', // sender address
        to: "erickparacompartir@gmail.com", // list of receivers
        subject: "Vencimiento de cuentas",//"Hello ✔", // Subject line
        text: mensaje, // plain text body
        html: mensaje
    };

    let info = smtpTransport.sendMail(mailOptions);

    // Mailing.sendEmail();
    // callback(info);


    res.send(mensaje);
})
//----------Termina lo de practica
//Este es otro de practica pero se quedara como palntiila get principal
 app.get("/", (req, res) => {
    res.send("<h1 style= 'height:100vh; display:flex; justify-content:center; align-items:center; font-size:100px; '>Mercadology</h1>");
    console.log("Hola Mercadology");
})





//Envia archvio json de backup
app.post("/send-backup", (req, res) => {

    let archivo = req.body;
    req.q

    sendBackup(archivo, info => {
        console.log("Se envio mensaje backup");
        res.send(info);
    })

})

async function sendBackup(archivo, callback) {
    let body = JSON.stringify(archivo);
    
    let mailOptions = {
        from: 'erickcarranzameza@gmail.com', // sender address
        to: "erickparacompartir@gmail.com", // list of receivers
        subject: "Backup",//"Hello ✔", // Subject line
        text: "", // plain text body
        html: "<p style='font-size:13px'><strong>Backup quincenal</strong></p>",
        attachments: [{
            filename: "backup.json",
            content: body
        }],
        auth:
        {
            user: 'erickcarranzameza@gmail.com'
        }
    };

    let info = await smtpTransport.sendMail(mailOptions);
    // info = await transporter.sendMail(mailOptions);
    // Mailing.sendEmail(archivo);

    callback(info);
}





//Envia correo con cuentas  a punto de vencer
app.post("/send-email", (req, res) => {
// res.send("Hola");
    let user = req.body;
    console.log(user);
    console.log(user.msj);

    let mensaje = "<p style='font-size:15px'><strong>Cuentas que sus servicios estan por vencer:</strong></p>";
    user.forEach(element => {
        mensaje += "<p style='font-size:11px'><strong>" + element.msj + "</strong>" +
            "<br>Cliente: " + element.nomcli + "<br>" +
            "Nombre del dominio: " + element.domcli + "<br>" +
            "Vencimiento Hosting: " + element.hosven + "<br>" +
            "Vencimiento SSL: " + element.venssl + "</p>";
    });
    console.log(mensaje);

    sendMail(mensaje, info => {
        console.log("Ha sido enviado el correo");
        res.send(info);
    })
});

function sendMail(mensaje, callback) {

    let mailOptions = {
        from: 'erickcarranzameza@gmail.com', // sender address
        to: "erickcarranzameza@gmail.com", // list of receivers
        subject: "Vencimiento de cuentas",//"Hello ✔", // Subject line
        text: mensaje, // plain text body
        html: mensaje,
        // auth:
        // {

        // }
    };
    console.log("Mensaje antes de sendmail");
    let info = smtpTransport.sendMail(mailOptions);

    // Mailing.sendEmail();
    callback(info);
}

/**Enviar correo**/
// Mailing.sendEmail = () => {
    // oauth2Client.setCredentials({
    //     refresh_token: MAILING_SERVICE_REFRESH_TOKEN,
    // });

    // const accessToken = oauth2Client.getAccessToken();
    // console.log(accessToken);

    let smtpTransport = nodemailer.createTransport({
        // service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        // service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: 'erickcarranzameza@gmail.com',
            pass: 'Carranza140299',
            clientId: '987910429607-i6qs3kfss7d9bg1trth4o6rtii014t08.apps.googleusercontent.com',
            clientSecret: 'AaUPKeGCTEOUHrrHiwuHE_1H',
            refreshToken: '1//04JpRimDe8SvVCgYIARAAGAQSNwF-L9Ir3FpsZjAp5znhRSWiqFYgsXFter3And1j9kO94wi468xW-cUwln3kbH0U7dXoDTqCJBo',
            accessToken: 'ya29.a0AfH6SMD9kQr1kO751pmKYBPXR0ZpWl7HLa_H8YBiwO4w5ZtmTBEC1xFH5clSjIBDAZfzAEAUaXlYZA9s39Eq2aCI6fvMpigVpozhzemAV55ZgvGA-sDIrAPxkVATOuir5_EnqraGRqx3_fXfAybdcKjzlet2',
            // expires: 1484314697598,
            // accessToken,
        },
    });

    smtpTransport.set('oauth2_provision_cb', (user, renew, callback)=>{
        // let userTokens;
        let accessToken = user;
        console.log(accessToken, 'aceessstokin');
        console.log(user, 'userrrr');
        console.log(renew, 'hhhhrenew');
        if(!accessToken){
            return callback(new Error('No user'));
        }else{
            console.log('hola');
            return callback(null, accessToken)
        }
    });

// }