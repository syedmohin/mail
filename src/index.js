const nodemail = require('nodemailer');
const exp = require("express");
const cors = require('cors');
const path = require('path');
const bp = require("body-parser");
const hg = require('hogan.js');
const fs = require('fs');
const app = exp();

const PORT = process.env.PORT || 5000;

exp().use(exp.static('public'))

app.listen(process.env.PORT || 8080, () => console.log(`Listening on ${PORT}`))

//CORS Middleware
app.use((req, res, next) => {
//Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", "GET,HEAD,PATCH,POST,PUT,DELETE");
        return res.status(200).json({});
    }
    next();
});
app.use(bp.json());

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

app.get("/mail", (req, res) => {
    console.log(req.body);
    console.log(req.body.name);
    console.log(req.body.mail);
    console.log(req.body.me);
    console.log(req.body.msg);
    sendMail(req.body);
    res.json({'resp': "Sent successful"});
});

// app.listen(3000, _ => {
//     console.log("Server started at port number 3000")
// })




