/*
 * renderHTML.js renders the index.html file loaded with the product catalogue.
 *
 * Product data is loaded from a .csv file (format to be standardized at later date)
 * */

const fs = require('fs');

// renders index.html
function renderHTML(productsArray) {
    const outFileName = "../index.html";
    const htmlStream = fs.createWriteStream(outFileName);
    htmlStream.once('open', function (fd) {
        let html = "";
        html += fs.readFileSync("../views/header.html", "utf8");
        html += fs.readFileSync("../views/table.html", "utf8");
        html += generateTable(productsArray);
        html += fs.readFileSync("../views/footer.html", "utf8");
        htmlStream.end(html);
    });
}


// When provided with json containing product information, generates table contents
function generateTable(productsArray) {
    let table = "";

    for (let i = 0; i < productsArray.length; i++)
    {
        let product = productsArray[i];
        /* UPDATE TO READ TEMPLATE FROM FILE */
        table += `<tr class="product-row" id="${product.itemNum}">
                        <th><input type="checkbox" name="${product.itemNum}"></th>
                        <th><input type="number" name="quantity" min="0"></th>
                        <td>${product.description}</td>
                        <td>$${product.price}</td>
                        <td>$${product.priceFull}</td>
                    </tr>
                    `
    }
    return table;
}

module.exports.renderHTML = renderHTML;