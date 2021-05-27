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
// // const CLIENTID = '407408718192.apps.googleusercontent.com'
// const CLIENTID = "987910429607-i6qs3kfss7d9bg1trth4o6rtii014t08.apps.googleusercontent.com";
// const CLIENTSECRET = "AaUPKeGCTEOUHrrHiwuHE_1H";
// // const REFRESH_TOKEN = '1%2F%2F04nQC-Eam8m6nCgYIARAAGAQSNwF-L9IreTekJeGxMfIJslASfkHD5GYYah52eaJMjiHtWVvSkJgsn4Evq2b3K9F-vwNd_Z-ypis';
// const REFRESH_TOKEN = "1//040-0HMj4Y3o0CgYIARAAGAQSNwF-L9IrlR7k2H_9UHtd0-GJc53IsjKKeR18q4MFJnxIbTcikOkz6Lg-eEUrJ7FanHgHSbWpTec";
// let access_Token = 'ya29.a0AfH6SMD2juoYFHKWvABh7UPr9X7L7SO9YWi0Jsix9ZLNepL7gmabKzrsyRswtFNLzmId0mpht_th5wQeRM4CNtYiIA1CjBKNu9oug3ky_DiiB6klFMuYSSWk1FRxZFsA5H2vz5DU_1WtoVrDMaZf5LPe-8UT';

//Mercadology
const CLIENTID = "133471546831-j2u575d5eno3nv664hdd858lnal07vnf.apps.googleusercontent.com";
const CLIENTSECRET = "9n6PJxUyfnuuyGWnhwwNKNKj";
// const REFRESH_TOKEN = '1%2F%2F04nQC-Eam8m6nCgYIARAAGAQSNwF-L9IreTekJeGxMfIJslASfkHD5GYYah52eaJMjiHtWVvSkJgsn4Evq2b3K9F-vwNd_Z-ypis';
const REFRESH_TOKEN = "1//04CVr32_rQYjoCgYIARAAGAQSNwF-L9IreXPVWZenZkdzYES-hC-Bwrgyo1-jQqw_oTeH8-jOFpM5nnZVJxjcNifBNQiCsWtoQsc";
let access_Token = 'ya29.a0AfH6SMCUQHX2lcYdMXlRGTjJ9iqISN3Ap5oQ8ScCuKcjSDy3ViFh-DF8_mObAewCxoYlb7cYtSWd-zuUqLYw4hnrWvaXoY4I3LBmvpx18FzWvkGMH5YCfi0SUfrwM8-f3aMDiJ-1_S7aPccuRBRimLocPza5';

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
        from: '"Mercadology" <teamdeveloperss@gmail.com>',
        to: "erickparacompartir@gmail.com",
        subject: "Backup",
        text: "",
        html: "<h1 style='color:#FFD552; font-size:24px; text-align:center; margin:0;'>Mercadology</h1>"+
        "<p style='font-size:17px; width:100%; text-align:center; color:black;'><strong>Backup quincenal</strong></p>",
        attachments: [{
            filename: "backup.json",
            content: body
        }],
        auth: {
            user: "teamdeveloperss@gmail.com",
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
        from: '"Mercadology" <teamdeveloperss@gmail.com>',
        to: "erickparacompartir@gmail.com",
        subject: "Vencimiento de cuentas",
        text: mensaje,
        html: mensaje,
        auth: {
            user: "teamdeveloperss@gmail.com",
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
        "<p style='font-size:12px; color:black;'>Para cualquier duda o sugerencia envie un correo a: jesus.mendez@mercadology.mx</p>";

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
        from: '"Mercadology" <erick@mercadology.mx>', // sender address
        to: correo, // list of receivers
        subject: "Vencimiento de servicio",
        text: mensaje,
        html: mensaje,
        auth: {
            user: "teamdeveloperss@gmail.com",
            refreshToken: REFRESH_TOKEN,
            accessToken: access_Token,
        }
    }

    let info = await transporter.sendMail(mailOptions);

    callback(info);

}
