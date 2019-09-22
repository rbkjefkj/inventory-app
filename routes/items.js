//All routes for items stuffed in one module (this file) because it was getting messy and broken(?)
var sqlite3 = require('sqlite3');
var bodyParser = require('body-parser');
var express = require('express'); //imports the Express application object
var router = express.Router();    //uses that Express application object to get a router object
                                  //the next methods will be adding routes to th router object, and finally we'll export the router object
//HOME PAGE ROUTE: router.get('/')
//ABOUT PAGE ROUTE: router.get('/about')

//CREATE A NEW ITEM
router.post('/create', (req, res) => {
    
    let newitemname = '"' + req.body.newitemname + '"';
    let newitemdesc = '"' + req.body.newitemdesc + '"';
    let newitemcat = '"' + req.body.itemcategory + '"';
    let pureitemcat = req.body.itemcategory;
    let newitemprice = req.body.newitemprice;
    let newitemsinstock = req.body.newitemsinstock;  

    let db = new sqlite3.Database('./words.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            return console.error(err.message);
        }
    });
    let sql = `INSERT INTO items VALUES (${newitemname},${newitemdesc},${newitemcat},${newitemprice},${newitemsinstock})`;
    db.run(sql, function(err){
            if (err) {
                return console.log(err.message);
            }
        }); 
    db.close();
    res.redirect(`../categories/${pureitemcat}`);
})

//DELETE AN ITEM
router.post('/delete/:item', (req, res) => {
    console.log('WE ARE INSIDE THE DELETE ITEM FUNCTION!');
    let db = new sqlite3.Database('./words.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            return console.error(err.message);
        }
    });
    let deleteThis = '"' + req.params.item + '"';
    let returnTo = req.body.Gladison;    

    db.run(`DELETE FROM items WHERE name = ` + deleteThis, function(err) {    ///////HOW TO USE ? INSTEAD OF : FOR VARIABLES
        if (err) {
            return console.error(err.message);
        } console.log(`Successfuly deleted item with the name of ${deleteThis}`);
    });
    db.close();   
    console.log(`returnTo variable value is ${returnTo}.`);
    res.redirect(`../../categories/${returnTo}`);
});

//GET AN ITEM'S PAGE
router.get('/:item', function(req, res){
    let db = new sqlite3.Database('./words.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) { return console.error(err.message); }
    });
    let seagull = '"' + req.params.item + '"';
    let pureseagull = req.params.item;
    let sql = `SELECT name, description, price, stock FROM items WHERE name = ${seagull}`;
    db.get(sql, [], (err, rows) => {
        let name = pureseagull;
        let description = rows.description;
        let price = rows.price;
        let stock = rows.stock;  
        res.render('items', { name: name, description: description, price: price, stock: stock });
    });
    db.close();
});

//EDIT AN ITEM
router.post('/edit/:item', function(req, res) {
    let db = new sqlite3.Database('./words.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            return console.error(err.message);
        }
    });
    let editThis = '"' + req.params.item + '"';
    let newname = '"' + req.body.itemname + '"';
    let purenewname = req.body.itemname; 
    let newdesc = '"' + req.body.desc + '"';
    let newprice = req.body.newitemprice;
    let newstock = req.body.newitemsinstock;
    let sql= `UPDATE items SET name = ${newname}, description = ${newdesc}, price = ${newprice}, stock = ${newstock} WHERE name = ${editThis}`;
    db.run(sql, function(err, rows) {
        if (err) { return console.error(err.message); }
        console.log(`${editThis} category successfully updated.`);
    });
    db.close();
    res.redirect(`/items/${purenewname}`); 
});

module.exports = router;
