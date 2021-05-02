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

//access_token": "ya29.a0AfH6SMADTFzYITPNNSiTKpBQgnuiV5qqdX6OVcamnOPWQ-wAVERlE5OWZSOK_8i6IcA-xFE4hmU5B78SE-RZj_MR9x-NnnIkZIZj480P0Dtl1jCwtn6769XqmVpELn2gfBOIRGUmW5iSkiAVxu3A8fL9jYYB
// "access_token": "ya29.a0AfH6SMC95UjfSp2IQ24A0si6IwxYobFZwQ9yynb9-FZaF0HNoJinKkRrtqiiSHv-RUVR9awUyKidzdkdQFkuXeVrPCZLuvum0EGFuENK-e52i-8_K4rGTLLcfBJZXv8VlHF6Nyn89HqAWniOI03dNyr7IJq1"
//  "access_token": "ya29.a0AfH6SMD3T_jV92fhx2Z207nlgeAR-i3WFIzLdXDWbSm0LQiT7pcCgxW7NvXAyDBJVMXx_tX0YWhYSLdNYftJ0G9dfsP12c7k-EiCeMw_gA-u7xtR83FcsjAYyOSoCL4r0Ts_srW7exyKlcAWiAY5ijVG5kmP",
// ya29.a0AfH6SMAP7gxQrJBvUe3gMrDVQ9P5qPEmTUzYU-VZQ5gs7Lg23KDHTFqAYnJ2jzpksu7AVe4AIoU1HgsWjHn9qvf2k23X1I7RlB4YgNGbstcgNXsa_QN54lSzLfNvWuo6gumhgfI7QqQ9IRNZAU4mlDd7OIng
const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";
// const CLIENTID = '407408718192.apps.googleusercontent.com'
const CLIENTID = "987910429607-i6qs3kfss7d9bg1trth4o6rtii014t08.apps.googleusercontent.com";
const CLIENTSECRET = "AaUPKeGCTEOUHrrHiwuHE_1H";
// const REFRESH_TOKEN = '1%2F%2F04nQC-Eam8m6nCgYIARAAGAQSNwF-L9IreTekJeGxMfIJslASfkHD5GYYah52eaJMjiHtWVvSkJgsn4Evq2b3K9F-vwNd_Z-ypis';
const REFRESH_TOKEN = "1//040-0HMj4Y3o0CgYIARAAGAQSNwF-L9IrlR7k2H_9UHtd0-GJc53IsjKKeR18q4MFJnxIbTcikOkz6Lg-eEUrJ7FanHgHSbWpTec";
let access_Token = 'ya29.a0AfH6SMD2juoYFHKWvABh7UPr9X7L7SO9YWi0Jsix9ZLNepL7gmabKzrsyRswtFNLzmId0mpht_th5wQeRM4CNtYiIA1CjBKNu9oug3ky_DiiB6klFMuYSSWk1FRxZFsA5H2vz5DU_1WtoVrDMaZf5LPe-8UT';

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
        from: '"Mercadology" <erick@mercadology.mx>', // sender address
        to: "erickparacompartir@gmail.com", // list of receivers
        subject: "Backup",//"Hello ✔", // Subject line
        text: "", // plain text body
        html: "<p style='font-size:13px'><strong>Backup quincenal</strong></p>",
        attachments: [{
            filename: "backup.json",
            content: body
        }],
        auth: {
            user: "erickcarranzameza@gmail.com",
            // pass: "Carranza140299",
            refreshToken: REFRESH_TOKEN,
            accessToken: access_Token,
            expires: 1484314697598,
            // accessUrl: OAUTH_PLAYGROUND
        }
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
        html: mensaje,
        auth: {
            user: "erickcarranzameza@gmail.com",
            // pass: "Carranza140299",
            refreshToken: REFRESH_TOKEN,
            accessToken: access_Token,
            expires: 1484314697598,
            // accessUrl: OAUTH_PLAYGROUND
        }
    }

    let info = await transporter.sendMail(mailOptions);

    callback(info);

}
