var bodyParser = require('body-parser'); //necessary for sending data in POST requests. It's also required in app.js. In lines 22&23 of app.js, the app uses this bodyparser middleware. 
var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3');
var app = express();

/* GET home page. */
router.get('/', function(req, res, next) {

    let db = new sqlite3.Database('./words.db', sqlite3.OPEN_READWRITE, (err) => { 
        if (err) {
            return console.error(err.message);
        }
    });

    let sql = `SELECT name FROM categories`;//PUT THE QUERY IN BACKTICKS
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }      
        const vis = rows;
        let visual = [];
        for (let i = 0; i < vis.length; i++) {
            visual.push(vis[i].name);
        }      
        res.render('index', { title: 'Express', visual: visual });
    });
    //CLOSE DATABASE CONNECTION
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
    });
});

//RANDOM TEST PAGES==========================================================================================================================================================================
//POST a random  word
router.post('/', function(req, res, next) {
    var submittedWord = req.body.word; //the 'word' here comes from index.ejs: input element's name attribute.
    res.json(`Thanks, your word has been submitted! It was ${submittedWord}.🌹️😎️🦄️`);
    res.end();
});

//GET Starburst. As u can see, I don't have to necessarily put another page's router in a separate file (eg, starburst.js) 
router.get('/starburst', function(req, res, next) {
    res.render('starburst', {starburstTitle: 'STARBURST'});
});
//GET LOLLIPOPS
router.get('/peach/lipgloss', function(req, res, next) {
    res.json('COngrats, here r your souvenirs and lollipops');
});
module.exports = router;
