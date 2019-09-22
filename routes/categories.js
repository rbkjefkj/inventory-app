//All routes for categories stuffed in one module (this file) because it was getting messy
var sqlite3 = require('sqlite3');
var bodyParser = require('body-parser');
var express = require('express'); //imports the Express application object
var router = express.Router();    //uses that Express application object to get a router object
                                  //the next methods will be adding routes to th router object, and finally we'll export the router object
//HOME PAGE ROUTE: router.get('/')
//ABOUT PAGE ROUTE: router.get('/about')

//GET category page=========================================================================================================================================================================
router.get('/:category', function(req, res) {
    let db = new sqlite3.Database('./words.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            return console.error(err.message);
        }
    });
    let seagull = '"' + req.params.category + '"';
    let pureseagull = req.params.category;
    let sql = `SELECT items.name, items.description FROM categories JOIN items ON categories.name = items.category WHERE items.category = ${seagull} UNION
               SELECT name, description FROM categories WHERE name = ${seagull}`; //We choose all items w their descriptions and one category w its description.
    db.all(sql, [], (err, rows) => { //query results by default get ordered by alphabet.
        if (err) { throw err; }      
        let itemsarr = [];
        let catname = rows.name;
        let catdesc = rows.description;       
        for (let i = 0; i < rows.length; i++){
            if (Object.values(rows[i])[0] == pureseagull) {
                catname = rows[i].name;
                catdesc = rows[i].description;
                rows.splice(i, 1);
                break;            
            }        
        }   
        for (let i = 0; i < rows.length; i++) {
            itemsarr.push(rows[i].name);
        }
        res.render('categories', { name: catname, description: catdesc, itemsarr: itemsarr });
    });
    db.close();
});

//DELETE a category=========================================================================================================================================================================
router.get('/delete/:category', function(req, res) {
    let db = new sqlite3.Database('./words.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) { return console.error(err.message); }
    });
    let deleteThis = '"' + req.params.category + '"';
    
    db.run(`DELETE FROM categories WHERE name = ${deleteThis}`, function(err) {    //HOW TO USE ? INSTEAD OF : FOR VARIABLES
        if (err) {
            return console.error(err.message);
        }
    });

    db.close();   
    res.redirect('../../');
});-


//EDIT a category==========================================================================================================================================================================
router.post('/edit/:category', function(req, res) {
    let db = new sqlite3.Database('./words.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            return console.error(err.message);
        }
    });
    let editThis = '"' + req.params.category + '"';
    let newname = '"' + req.body.catname + '"';
    let purenewname = req.body.catname; 
    let newdesc = '"' + req.body.desc + '"';
    let sql= `UPDATE categories SET name = ${newname}, description= ${newdesc} WHERE name = ${editThis}`;
    db.run(sql, function(err, rows) {
        if (err) { return console.error(err.message); }
        console.log(`${editThis} category successfully updated.`);
    });
    db.close();
    res.redirect(`/categories/${purenewname}`); 
});

//CREATE a category========================================================================================================================================================================
router.post('/create', function(req, res) {    
    let catname = '"' + req.body.name + '"';
    let catdesc = '"' + req.body.desc + '"';   
    let catnamewopedinjas = req.body.name;
    let db = new sqlite3.Database('./words.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            return console.error(err.message);
        }
    });

    let sql = `INSERT INTO categories VALUES (NULL, ${catname}, ${catdesc})`;
    db.run(sql, function(err){
            if (err) {
                return console.log(err.message);
            }
        }); 
    db.close();
    res.redirect('../');
});

module.exports = router;
