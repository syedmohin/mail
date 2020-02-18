const nodemail = require('nodemailer');
const exp = require("express");
const cors = require('cors');
const path = require('path');
const bp = require("body-parser");
const hg = require('hogan.js');
const fs = require('fs');
const app = exp();

const PORT = process.env.PORT || 5000;

exp()
    .use(exp.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index'))
    .get('/cool', (req, res) => res.send(cool()))
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))

app.use(cors())
//CORS Middleware
app.use(function (req, res, next) {
//Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    next();
});
app.use(bp.json());
app.use(cors());

function sendMail(details) {

    let template = fs.readFileSync('./index.hjs', 'utf-8');
    let compileTemplate = hg.compile(template);

    let transporter = nodemail.createTransport({
        service: "gmail",
        secure: false,
        port: 25,
        auth: {
            user: 'deccanbesporty@gmail.com',
            pass: 'Java14Angular9'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let HelperOptions = {
        form: `"Deccan Be Sporty" <deccanbesporty@gmail.com>`,
        to: details.me,
        subject: 'Mail from Portfolio',
        text: compileTemplate.render({name: details.name, mail: details.mail, msg: details.msg}),
        html: compileTemplate.render({name: details.name, mail: details.mail, msg: details.msg})
    };

    transporter.sendMail(HelperOptions, (err, info) => {
        if (err) {
            console.log("error");
            console.log(err);
        } else {
            console.log("The message was sent!");
            console.log(info);
        }
    });

}

app.get("/mail", cors(), (req, res) => {
    console.log(req.body);
    console.log(req.body.name);
    console.log(req.body.mail);
    console.log(req.body.me);
    console.log(req.body.msg);
    sendMail(req.body);
    res.json({'resp': "Sent successful"});
});

app.listen(3000, _ => {
    console.log("Server started at port number 3000")
})




