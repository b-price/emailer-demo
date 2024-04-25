const cheerio = require('cheerio');
const nodemailer = require("nodemailer");

const url = "https://www.popvortex.com/music/charts/top-rap-songs.php";

if (process.argv.length === 2) {
    console.error('You did not specify artist(s)!');
    process.exit(1);
}

let artists = process.argv.slice(2);
const $ = await cheerio.fromURL(url);

