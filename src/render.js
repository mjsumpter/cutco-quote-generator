/*
 * renderHTML.js renders the index.html file loaded with the product catalogue.
 *
 * Product data is loaded from a .csv file (format to be standardized at later date)
 * */

const fs = require('fs');

// renders index.html for local testing
function renderHTMLLocal(productsArray) {
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

// renders index.html for electron refresh
function renderHTML(productsArray) {
    const outFileName = "./index.html";
    const htmlStream = fs.createWriteStream(outFileName);
    htmlStream.once('open', function (fd) {
        let html = "";
        html += fs.readFileSync("./views/header.html", "utf8");
        html += fs.readFileSync("./views/table.html", "utf8");
        html += generateTable(productsArray);
        html += fs.readFileSync("./views/footer.html", "utf8");
        htmlStream.end(html);
    });
}


// When provided with json containing product information, generates table contents
function generateTable(productsArray) {
    let table = "";
    productsArray.sort((a, b) => {
        return b.priceFull - a.priceFull;
    });
    for (let i = 0; i < productsArray.length; i++)
    {
        let product = productsArray[i];
        let colors = [product.color1, product.color2, product.color3];
        
        /* UPDATE TO READ TEMPLATE FROM FILE */
        table += `<tr class="product-row" id="${product.itemNum}">
                    <th><input type="checkbox" name="${product.itemNum}" class="selection"></th>
                    <th><input type="number" name="quantity" min="0"></th>
                    <td>${product.description}</td>
                    <td>${colors.map((key) => {
                        if (key)
                        {
                            return `<input type="radio" id="${key ? key : '-'}" name="color${i} " value="${key ? key : '-'}">
                                <label for="${key ? key : '-'}" >${key ? key.charAt(0).toUpperCase() + key.slice(1) : '-'}</label >`
                        }
                    }).join('')}</td>
                    
                    <td>${product.price ? product.price : '-'}</td>
                    <td><input type="checkbox" class="box" name="box" checked><label for="box">Box</label><input type="checkbox" class="bow" name="bow" checked><label for="bow">Bow</label><input type="checkbox" class="engraving" name="engraving" checked><label for="engraving">Engraving</label></td>
                    <td>${product.priceFull}</td>
                    <td><button class="discountbtn">+</button></td>
                    <td><button class="freebtn">+</button></td>
                  </tr>
                    `
    }
    return table;
}

module.exports.renderHTML = renderHTML;
module.exports.renderHTMLLocal = renderHTMLLocal;