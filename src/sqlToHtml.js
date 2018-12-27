const render = require('./render');
const sqlite3 = require('sqlite3');
const SqliteToJson = require('sqlite-to-json');

// // for local testing
// const db = '../db/products.db';
// loadDBLocal(db);

function loadDBLocal(path) {
    const exporter = new SqliteToJson({
        client: new sqlite3.Database(path)
    });
    exporter.all((err, all) => {
        render.renderHTMLLocal(all.productList);
    });    
}

// for electron rendering
function loadDB(path, callback) {
    const exporter = new SqliteToJson({
        client: new sqlite3.Database(path)
    });
    exporter.all((err, all) => {
        render.renderHTML(all.productList);
    });
    callback();
}

module.exports.loadDB = loadDB;