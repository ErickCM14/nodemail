let nodemailer = require("nodemailer");
let { google } = require('googleapis')
let express = require("express");
let bodyParser = require('body-parser')
let cors = require("cors");

let app = express();

app.use(cors());
app.use(bodyParser.json())

const port = process.env.PORT || 3000;
//Esta mismo link es donde obtengo el refresh token y access token, necesito meter las credenciales de clientid y clientsecret para obtener esos token´s
const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";

//Mercadology
const CLIENTID = "133471546831-j2u575d5eno3nv664hdd858lnal07vnf.apps.googleusercontent.com";
const CLIENTSECRET = "9n6PJxUyfnuuyGWnhwwNKNKj";
const REFRESH_TOKEN = "1//04xtQZ-joH6dtCgYIARAAGAQSNwF-L9IrSMp-ZlGQop3z0DB5kneoVBR3-dBkVXYRq3PL482774xMww2e0taqLIj7zWUgEg7soCA";
let access_Token = 'ya29.a0AfH6SMAuXut1vjT5TkbGrkijeanZCwT8hf9IYmiHVxI8Qe6a6SNocVWIzo1nuwCKGpwy-HteP677PWHEe0BjOL5TM3Y2TcFDgRWW4RWrfwbT7V3AJhcOC9uACN7we2zghiKMyk4zCE7PKDg8UAUW_H4Kjco6';
const CORREO = 'teamdeveloperss@gmail.com';

app.listen(port, () => {
  console.log(`Servidor en => ${port}`);
})

const oauth2Client = new google.auth.OAuth2(
  CLIENTID,
  CLIENTSECRET,
  OAUTH_PLAYGROUND
);

oauth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN
});

access_Token = oauth2Client.getAccessToken();
 // .then(tokens => (accessToken = tokens.credentials.access_token));
console.log(access_Token);


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
    from: 'Mercadology <sistemas@mercadology.mx>',
    to: "teamdeveloperss@gmail.com",
    subject: "Backup",
    text: "",
    html: "<h1 style='color:#FFD552; font-size:24px; text-align:center; margin:0;'>Mercadology</h1>" +
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

  let mensaje = " <h1 style='color:#FFD552; font-size:24px; text-align:center; margin:0;'>Mercadology</h1>" +
    "<p style='font-size:17px; width:100%; text-align:center; color:black;'><strong>Cuentas que sus servicios estan por vencer</strong></p>"
  user.forEach(element => {
    mensaje += "<p style='font-size:14px; color:black;'><strong>" + element.msj + "</strong></p>" +
      "<ul>" +
      "<li style='font-size:12px; color:black;'><strong>Cliente:</strong> " + element.nomcli + "<br>" +
      "<strong>Nombre del dominio:</strong> " + element.domcli + "<br>" +
      "<strong>Vencimiento Hosting:</strong> " + element.hosven + "<br>" +
      "<strong>Vencimiento SSL:</strong> " + element.venssl + "</li>" +
      "</ul>";
  });

  sendMail(mensaje, info => {
    console.log("Ha sido enviado el correo");
    res.send(info);
  })
});

async function sendMail(mensaje, callback) {

  let mailOptions = {    
    from: 'Mercadology <sistemas@mercadology.mx>',
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



//Envia correo a los correos de los clientes que sus servicios estan por vencer
app.post("/send-clientes", (req, res) => {

  let user = req.body;
  let mensaje;
  user.forEach(element => {
    console.log(element.venssl, element.hosven);
    let venssl = new Date(element.venssl);
    let fechassl = venssl.getDate() + "/" + (venssl.getMonth() + 1) + "/" + venssl.getFullYear();
    let hosven = new Date(element.hosven);
    let fechahos = hosven.getDate() + "/" + (hosven.getMonth() + 1) + "/" + hosven.getFullYear();
    let domven = new Date(element.domven);
    let fechadom = domven.getDate() + "/" + (domven.getMonth() + 1) + "/" + domven.getFullYear();
    console.log(fechassl, fechahos, fechadom);

    mensaje = " <h1 style='color:#FFD552; font-size:24px; text-align:center; margin:0;'>Mercadology</h1>" +
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

  });
  // console.log(element.cuecor);

});

async function sendMailCliente(mensaje, correo, callback) {

  let mailOptions = {
    from: 'Mercadology <sistemas@mercadology.mx>', // sender address
    // to: correo, // list of receivers
    to: "teamdeveloperss@gmail.com",
    subject: "Vencimiento de servicio - Mensaje supuesto al cliente",
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


//Envia correo de solicitud de diseño al manager
app.post("/send-solicitud-manager", (req, res) => {
  let solicitud = {};
  solicitud = req.body;

  let mensaje = " <h1 style='color:#FFD552; font-size:24px; text-align:center; margin:0;'>Mercadology</h1>" +
    "<p style='font-size:17px; width:100%; text-align:center; color:black;'><strong>Solicitud de diseño</strong></p>";

  mensaje += "<p style='font-size:14px; color:black;'><strong>" + solicitud['cuenta'] + "</strong> ha enviado una solicitud de" +
    " diseño para ser contestada y agendada, revise la <a href='https://gestion.mercadology.mx'>App Mercadology</a> para responder la solicitud</p>";
  console.log(mensaje);

  sendMailSolicitudManager(mensaje, info => {
    console.log("Ha sido enviado el correo");
    res.send(info);
  })
});

async function sendMailSolicitudManager(mensaje, callback) {

  let mailOptions = {
    from: 'Mercadology <sistemas@mercadology.mx>',
    // to: "aaron@mercadology.mx",
    // to: "teamdeveloperss@gmail.com",
    to:"erick.info.oficial@gmail.com",
    // cc: ['jesus.mendez@mercadology.mx', 'noe@mercadology.mx', 'ximena.aguado@mercadology.mx'],
    subject: "Solicitud de diseño",
    text: ``,
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




//Envia correo al cliente de que su solicitud fue realizada
app.post("/send-cliente-solicitud", (req, res) => {

  let solicitud = req.body;
  let email = solicitud.email;

  let mensaje;
  mensaje = `<table
      style="width: 100%; max-width: 600px; text-align: center; margin: 0 auto; background-color: #fffbf7; color: #025157;">
      <tr>
        <td>
          <a href="https://mercadology.mx/" target="_blank" style="display:block;">
            <img style="width: 300px; margin-top: 15px; margin-bottom: 15px;"
              src="https://mercadology.mx/wp-content/uploads/2020/10/Logo-mercadology-300x43.png" alt="Mercadology" />
          </a>
        </td>
      </tr>
        <!-- Aquí irá el texto de bienvenida y el cta -->
        <td>
          <main class="container">
            <header class="header">
              <h1 style="color: #000000;">Solicitud de diseño enviada</h1>
              <p style="font-size: 18px; padding: 0px 20px 0px 20px; color: #000000;">
                Su solicitud de diseño para ${solicitud['cuenta']} ha sido enviada, en la brevedad nuestro equipo se estará poniendo en contacto
                con usted vía email para estimar una fecha posible de entrega.
              </p>
          </main>
        </td>
      </tr>
      <tr>
        <!-- Aquí irá las características-->
        <td style="
            border-top: 1px solid #999999d1;
            border-bottom: 1px solid #999999d1;
            padding-top: 35px;
            padding-bottom: 35px;
          ">
          <table style="
              text-align: center;
              width: 100%;
              color: #025157;
              font-family: Arial, Helvetica, sans-serif;
            ">
            <tr>
              <td style="width: 100%; margin:0 auto">
                <img style="width: 300px;" src="https://mercadology.mx/wp-content/uploads/2020/10/Recurso-20.png"
                  alt="Equipo" />
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <!-- Aquí irá el pie de página con enlaces a redes sociales -->
        <td style="
          padding-top: 20px;
          padding-bottom: 20px;
          font-family: 'Times New Roman', Times, serif;
          color: #46484c;
          font-size: 16px;
        ">
          <p>Siguenos en nuestras redes:</p>
          <div>
            <a href="https://www.instagram.com/mercadology/" style="display: inline-block; width: 50px; height: 50px;">
              <img style="width: 100%;"
                src="https://mercadology.mx/wp-content/uploads/2021/08/insta.png"
                alt="Instagram"/>
            </a>
            <a href="https://www.facebook.com/mercadology/" style="display: inline-block; width: 50px; height: 50px;">
              <img style="width: 100%;"
                src="https://mercadology.mx/wp-content/uploads/2021/08/fb.png"
                alt="Facebook" />
            </a>
            <a href="https://twitter.com/mercadologymkt?lang=es" style="display: inline-block; width: 50px; height: 50px;">
              <img style="width: 100%;"
                src="https://mercadology.mx/wp-content/uploads/2021/08/twitter.png"
                alt="Twitter" />
            </a>
            <a href="https://www.linkedin.com/authwall?trk=gf&trkInfo=AQHmuwoqJglT_wAAAXRpdNrgrJySyt-8bKCnu3guDrbn8h2jf4_kDWv-ACVjVW8B3RFoJkqjWX4A0V-I-GFIbCeVp4yZRreatbw8MM9eiiFmfu2lGijgMTeSQOyzdVHbW3_wx10=&originalReferer=https://www.google.com/&sessionRedirect=https%3A%2F%2Fmx.linkedin.com%2Fcompany%2Fmercadology" style="display: inline-block; width: 50px; height: 50px;">
              <img style="width: 100%;"
                src="https://mercadology.mx/wp-content/uploads/2021/08/linkedin.png"
                alt="LinkedIn" />
            </a>
          </div>
          <p>
            © 2021 Mercadology. Todos los derechos reservados
          </p>
        </td>
      </tr>
    </table>`;

  sendMailSolicitudCliente(mensaje, email, info => {
    console.log("Ha sido enviado el correo");
    res.send(info);
  })
});

async function sendMailSolicitudCliente(mensaje, email, callback) {

  let mailOptions = {
    from: 'Mercadology <sistemas@mercadology.mx>',
    to: email,
    subject: "Solicitud de diseño",
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


//Respuesta del manager al cliente sobre la solicitud de diseño
app.post("/send-respuesta-cliente", (req, res) => {
  let solicitud = {};
  solicitud = req.body;
  let email = solicitud.email;

  let mensaje = `<table
  style="width: 100%; max-width: 600px; text-align: center; margin: 0 auto; background-color: #fffbf7; color: #025157;">
  <tr>
    <td>
      <a href="https://mercadology.mx/" target="_blank" style="display:block;">
        <img style="width: 300px; margin-top: 15px; margin-bottom: 15px;"
          src="https://mercadology.mx/wp-content/uploads/2020/10/Logo-mercadology-300x43.png" alt="Mercadology" />
      </a>
    </td>
  </tr>
    <!-- Aquí irá el texto de bienvenida y el cta -->
    <td>
      <main class="container">
        <header class="header">
          <h1 style="color: #000000;">Fecha estimada de su solicitud de diseño</h1>
          <p style="font-size: 18px; padding: 0px 20px 0px 20px; color: #000000;">
            Su solicitud de diseño para ${solicitud.cuenta} ha sido programada para entregase el ${solicitud.fechaEntrega}, cualquier
            aclaración o comentario adicional comuniquese contestando este correo.
          </p>
      </main>
    </td>
  </tr>
  <tr>
    <!-- Aquí irá las características -->
    <td style="
        border-top: 1px solid #999999d1;
        border-bottom: 1px solid #999999d1;
        padding-top: 35px;
        padding-bottom: 35px;
      ">
      <table style="
          text-align: center;
          width: 100%;
          color: #025157;
          font-family: Arial, Helvetica, sans-serif;
        ">
        <tr>
          <td style="width: 100%; margin:0 auto">
            <img style="width: 300px;" src="https://mercadology.mx/wp-content/uploads/2020/10/Recurso-20.png"
              alt="Equipo" />
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <!-- Aquí irá el pie de página con enlaces a redes sociales -->
    <td style="
      padding-top: 20px;
      padding-bottom: 20px;
      font-family: 'Times New Roman', Times, serif;
      color: #46484c;
      font-size: 16px;
    ">
      <p>Siguenos en nuestras redes:</p>
      <div>
        <a href="https://www.instagram.com/mercadology/" style="display: inline-block; width: 50px; height: 50px;">
          <img style="width: 100%;"
            src="https://mercadology.mx/wp-content/uploads/2021/08/insta.png"
            alt="Instagram"/>
        </a>
        <a href="https://www.facebook.com/mercadology/" style="display: inline-block; width: 50px; height: 50px;">
          <img style="width: 100%;"
            src="https://mercadology.mx/wp-content/uploads/2021/08/fb.png"
            alt="Facebook" />
        </a>
        <a href="https://twitter.com/mercadologymkt?lang=es" style="display: inline-block; width: 50px; height: 50px;">
          <img style="width: 100%;"
            src="https://mercadology.mx/wp-content/uploads/2021/08/twitter.png"
            alt="Twitter" />
        </a>
        <a href="https://www.linkedin.com/authwall?trk=gf&trkInfo=AQHmuwoqJglT_wAAAXRpdNrgrJySyt-8bKCnu3guDrbn8h2jf4_kDWv-ACVjVW8B3RFoJkqjWX4A0V-I-GFIbCeVp4yZRreatbw8MM9eiiFmfu2lGijgMTeSQOyzdVHbW3_wx10=&originalReferer=https://www.google.com/&sessionRedirect=https%3A%2F%2Fmx.linkedin.com%2Fcompany%2Fmercadology" style="display: inline-block; width: 50px; height: 50px;">
          <img style="width: 100%;"
            src="https://mercadology.mx/wp-content/uploads/2021/08/linkedin.png"
            alt="LinkedIn" />
        </a>
      </div>
      <p>
        © 2021 Mercadology. Todos los derechos reservados
      </p>
    </td>
  </tr>
</table>`;

  sendMailRespuestaCliente(mensaje, email, info => {
    console.log("Ha sido enviado el correo");
    res.send(info);
  })
});

async function sendMailRespuestaCliente(mensaje, email, callback) {

  let mailOptions = {
    from: 'Mercadology <sistemas@mercadology.mx>',
    to: email,
    subject: "Fecha estimada solicitud de diseño",
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