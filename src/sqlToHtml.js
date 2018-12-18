const render = require('./render');
const sqlite3 = require('sqlite3');
const SqliteToJson = require('sqlite-to-json');

// for direct testing
const db = '../db/products.db';

function loadDB(path) {
    const exporter = new SqliteToJson({
        client: new sqlite3.Database(path)
    });
    exporter.all((err, all) => {
        render.renderHTML(all.productList);
    });    
}

module.exports.loadDB = loadDB;