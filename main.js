let nodemailer = require("nodemailer");
let {google} = require('googleapis')
let express = require("express");
let bodyParser = require('body-parser')
let cors = require("cors");

//const { response } = require("express");
let app = express();

app.use(cors());
app.use(bodyParser.json())

const port = process.env.PORT || 3000;
const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";

//Mercadology
const CLIENTID = "133471546831-j2u575d5eno3nv664hdd858lnal07vnf.apps.googleusercontent.com";
const CLIENTSECRET = "9n6PJxUyfnuuyGWnhwwNKNKj";
const REFRESH_TOKEN = "1//04xtQZ-joH6dtCgYIARAAGAQSNwF-L9IrSMp-ZlGQop3z0DB5kneoVBR3-dBkVXYRq3PL482774xMww2e0taqLIj7zWUgEg7soCA";
let access_Token = 'ya29.a0AfH6SMAuXut1vjT5TkbGrkijeanZCwT8hf9IYmiHVxI8Qe6a6SNocVWIzo1nuwCKGpwy-HteP677PWHEe0BjOL5TM3Y2TcFDgRWW4RWrfwbT7V3AJhcOC9uACN7we2zghiKMyk4zCE7PKDg8UAUW_H4Kjco6';
const CORREO = 'teamdeveloperss@gmail.com';

const oauth2Client = new  google.auth.OAuth2(
  CLIENTID,
  CLIENTSECRET,
  'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN
  });

access_Token = oauth2Client.getAccessToken();
//   .then(tokens => (accessToken = tokens.credentials.access_token));
console.log(access_Token);


app.listen(port, () => {
    console.log("Servidor en => http://localhost:3000");
})

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        clientId: CLIENTID,
        clientSecret: CLIENTSECRET,
    },
    
});

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
        from: '"Mercadology" <sistemas@mercadology.mx>',
        to: "teamdeveloperss@gmail.com",
        subject: "Backup",
        text: "",
        html: "<h1 style='color:#FFD552; font-size:24px; text-align:center; margin:0;'>Mercadology</h1>"+
        "<p style='font-size:17px; width:100%; text-align:center; color:black;'><strong>Backup quincenal</strong></p>",
        attachments: [{
            filename: "backup.json",
            content: body
        }],
        auth: {
            user: CORREO,
            refreshToken: REFRESH_TOKEN,
            accessToken: access_Token,
        }
    };

    let info = await transporter.sendMail(mailOptions);

    callback(info);
}





//Envia correo con cuentas  a punto de vencer
app.post("/send-email", (req, res) => {

    let user = req.body;

    let mensaje = " <h1 style='color:#FFD552; font-size:24px; text-align:center; margin:0;'>Mercadology</h1>"+
    "<p style='font-size:17px; width:100%; text-align:center; color:black;'><strong>Cuentas que sus servicios estan por vencer</strong></p>"
    user.forEach(element => {
        mensaje += "<p style='font-size:14px; color:black;'><strong>" + element.msj + "</strong></p>" +
            "<ul>" +
            "<li style='font-size:12px; color:black;'><strong>Cliente:</strong> " + element.nomcli + "<br>" +
            "<strong>Nombre del dominio:</strong> " + element.domcli + "<br>" +
            "<strong>Vencimiento Hosting:</strong> " + element.hosven + "<br>" +
            "<strong>Vencimiento SSL:</strong> " + element.venssl + "</li>" +
            "</ul>" ;
    });

    sendMail(mensaje, info => {
        console.log("Ha sido enviado el correo");
        res.send(info);
    })
});

async function sendMail(mensaje, callback) {

    let mailOptions = {
        from: '"Mercadology" <sistemas@mercadology.mx>',
        to: "teamdeveloperss@gmail.com",
        subject: "Vencimiento de cuentas",
        text: mensaje,
        html: mensaje,
        auth: {
            user: CORREO,
            refreshToken: REFRESH_TOKEN,
            accessToken: access_Token,
        }
    }

    let info = await transporter.sendMail(mailOptions);

    callback(info);
}



//Envia correo a los correos de los clientes que sus servicios estan por vences
app.post("/send-clientes", (req, res) => {

    let user = req.body;
    let mensaje;
    user.forEach(element => {
        console.log(element.venssl, element.hosven);
        let venssl = new Date(element.venssl);
        let fechassl = venssl.getDate() + "/" + (venssl.getMonth()+1) + "/" + venssl.getFullYear();
        let hosven = new Date(element.hosven);
        let fechahos = hosven.getDate() + "/" + (hosven.getMonth()+1) + "/" + hosven.getFullYear();
        let domven = new Date(element.domven);
        let fechadom = domven.getDate() + "/" + (domven.getMonth()+1) + "/" + domven.getFullYear();
        console.log(fechassl, fechahos, fechadom);

        mensaje = " <h1 style='color:#FFD552; font-size:24px; text-align:center; margin:0;'>Mercadology</h1>"+
        "<p style='font-size:17px; width:100%; color:black;'><strong>Vencimiento(s) de servicio(s)</strong></p>" +
        "<p style='font-size:12px; color:black;'> Buenos días, " + element.nomcli + ", el motivo de este correo es para recordarle sobre el vencimiento de su(s) servicio(s) esta por llegar" + "</p>" +
        "<p style='font-size:12px; color:black;'><strong>" + element.msj + "</strong></p></br>" +
        "<ul style='font-size:12px; color:black;'>" +
            "<li>" +
            "<strong>Dominio:</strong> " + element.domcli + "<br>" +
            "<strong>Vencimiento Dominio:</strong> " + fechadom + "<br>" +
            "<strong>Vencimiento Hosting:</strong> " + fechahos + "<br>" +
            "<strong>Vencimiento SSL:</strong> " + fechassl + "</li>" +
        "</ul> </br>" +
        "<p style='font-size:12px; color:black;'>Para cualquier duda o sugerencia envie un correo a: jesus.mendez@mercadology.mx o a sistemas@mercadology.mx</p>";

        console.log(element.cuecor);
        sendMailCliente(mensaje, element.cuecor, info => {
            console.log("Ha sido enviado el correo");
            console.log(info);
            res.status(200).json({
                status: 'succes',
                data: req.body,
              })
            
        })

    }    );   
    // console.log(element.cuecor);
  
});

async function sendMailCliente(mensaje, correo, callback) {

    let mailOptions = {
        from: '"Mercadology" <sistemas@mercadology.mx>', // sender address
        to: correo, // list of receivers
        subject: "Vencimiento de servicio",
        text: mensaje,
        html: mensaje,
        auth: {
            user: CORREO,
            refreshToken: REFRESH_TOKEN,
            accessToken: access_Token,
        }
    }

    let info = await transporter.sendMail(mailOptions);

    callback(info);

}
