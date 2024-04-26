const cheerio = require('cheerio');
const nodemailer = require("nodemailer");
const axios = require('axios');
const creds = require("./credentials.json");

const url = "https://www.popvortex.com/music/charts/top-rap-songs.php";

if (process.argv.length === 2) {
    console.error('You did not specify artist(s)!');
    process.exit(1);
}
let artists = process.argv.slice(2);

axios.get(url)
    .then((response) => {
    let $ = cheerio.load(response.data);
    let songs = []
    $('.title-artist').each(function (i, element){
        if (artists.some(artist =>  $(this).text().includes(artist))) {
            songs.push($(this).text());
        }
    })
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: creds["sender.email"],
            pass: creds["sender.password"]
        }
    })
        let mailOptions = {
            from: creds["sender.email"],
            to: creds.to,
            subject: 'Your artists are: ' + artists.join(', '),
            text: songs.join('\n'),
            html: ''
        }
        transporter.sendMail(mailOptions)
            .then(console.log('email sent!'))
            .catch(err => console.log(err));

})
    .catch((error) => {
        console.error('Error fetching data: ', error);
    })




