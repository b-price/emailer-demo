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
        const $ = cheerio.load(response.data);
        let songs = [];

        $('.title-artist').each(function (i, element){
            if (artists.some(artist =>  $(this).text().includes(artist))) {
                let artist = $(this).find('.artist');
                let title = $(this).find('.title');
                songs.push([artist.text(), title.text()]);
            }
        });

        if (songs.length > 0) {
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: creds["sender.email"],
                    pass: creds["sender.password"]
                }
            });

            let songsHTML = ``;
            let songsText = ``;
            songs.forEach(song => {
                songsHTML += `<p><b>${song[0]} </b><em>${song[1]}</em></p>`;
                songsText += `${song[0]} - ${song[1]} \n`;
            });
            artists.forEach(artist => {
                if (!songsText.includes(artist)){
                    artists = artists.filter(allArtist => {
                        return allArtist !== artist
                    });
                }
            });

            if (artists.length > 1){
                artists[artists.length - 1] = `and ${artists[artists.length - 1]}`;
            }

            let mailOptions = {
                from: creds["sender.email"],
                to: creds.to,
                subject: 'Your artists are: ' + artists.join(', '),
                text: songsText,
                html: songsHTML
            }

            transporter.sendMail(mailOptions)
                .then(console.log('Email sent!'))
                .catch(err => console.log(err));

        } else {
            console.log('Artist(s) not on chart!')
        }
})
    .catch((error) => {
        console.error('Error fetching data: ', error);
    })




