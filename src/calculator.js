const electron = require('electron');
const {ipcRenderer} = electron;

// product numbers of items that are in a set - receive different pricing patterns
let setItemNums = [3822, 1851, 3852, 3849, 1849, 3836, 1836, 1850, 3829, 3828, 3826, 3827];

// Element variables
let inputs = Array.prototype.slice.call(document.querySelectorAll('input[type=number]'));
let totalHtml = document.querySelector('#totalCount');
let suggestedHtml = document.querySelector('#suggestedGifts');
let discountHtml = document.querySelector('#discountCount');
let freeHtml = document.querySelector('#freeCount');
let finalHtml = document.querySelector('#finalCount');
let boxCheck = Array.prototype.slice.call(document.querySelectorAll('.box'));
let bowCheck = Array.prototype.slice.call(document.querySelectorAll('.bow'));
let engravingCheck = Array.prototype.slice.call(document.querySelectorAll('.engraving'));
let freeBtns = document.querySelectorAll('.freebtn');
let discountBtns = document.querySelectorAll('.discountbtn');
let generateQuoteButton = document.querySelector('#generateBtn');
let rows = document.querySelectorAll("tr");

// Event Listeners
generateQuoteButton.addEventListener("click", generateQuote);
inputs.forEach(input => input.addEventListener("input", inputEvent));
discountBtns.forEach(btn => btn.addEventListener("click", addRow));
freeBtns.forEach(btn => btn.addEventListener("click", addRow));
boxCheck.forEach(btn => btn.addEventListener("change", adjustPrice));
bowCheck.forEach(btn => btn.addEventListener("change", adjustPrice));
engravingCheck.forEach(btn => btn.addEventListener("change", adjustPrice));

// Functions

/************************************************************
 * Add check box listeners
 * */
function addRow(e) {
    let productRow = e.target.parentElement.parentElement;
    let newRow = document.createElement('tr');
    let buttonClicked = e.target.classList.value.replace('btn', "");

    newRow.innerHTML = `
                <th><input type="checkbox" name="${productRow.children[0].firstElementChild.name}" class="selection"></th>
                <th><input type="number" name="quantity" min="0" class="${buttonClicked}"></th>
                <td>${productRow.children[2].innerHTML}</td>
                <td>-</td>
                <td>0</td>
                `;
    if (buttonClicked === "discount")
    {
        let itemNum = Number(e.target.parentElement.parentElement.id);
        let value;
        if (setItemNums.includes(itemNum))
        {
            value = 20;
        }
        else
        {
            value = 16.5;
        }
        newRow.innerHTML += `<td>${productRow.children[5].innerHTML}</td>
                             <td>${value}</td>`;
    }
    else
    {
        newRow.innerHTML += `<td><div><input type="checkbox" class="box" name="box"><label for="box">Box</label></div><div><input type="checkbox" class="bow" name="bow"><label for="bow">Bow</label></div><div><input type="checkbox" class="engraving" name="engraving"><label for="engraving">Engraving</label></div></td>
                             <td>0</td>`;
    }            
    newRow.classList = `${productRow.classList.value}`;
    newRow.id = `${productRow.id}-${buttonClicked}`;
    // push new row elements onto row arrays
    inputs.push(newRow.querySelector('input[type=number]'));
    boxCheck.push(newRow.querySelector('.box'));
    bowCheck.push(newRow.querySelector('.bow'));
    engravingCheck.push(newRow.querySelector('.engraving'));
    // add event selectors to new row elements
    newRow.querySelector('input[type=number]').addEventListener("input", inputEvent);
    newRow.querySelector('.box').addEventListener("change", adjustPrice);
    newRow.querySelector('.bow').addEventListener("change", adjustPrice);
    newRow.querySelector('.engraving').addEventListener("change", adjustPrice);
    //append row to html
    productRow.insertAdjacentElement('afterend', newRow);
}

function inputEvent(e)
{
    if (e.target.value > 0) {
        var checkbox = e.target.parentElement.previousElementSibling.firstChild;
        checkbox.checked = true;
    }
    let totalOrdered = 0, discountAdded = 0, freeAdded = 0;
    inputs.forEach((input) => {
        if (input.classList.value === "discount") {
            discountAdded += Number(input.value);
        }
        else if (input.classList.value === "free"){
            freeAdded += Number(input.value);
        }
        else
        {
            totalOrdered += Number(input.value);
        }
    });

    let finalNum = totalOrdered + discountAdded;
    totalHtml.innerHTML = totalOrdered;
    suggestedHtml.innerHTML = freeGiftSuggestion(totalOrdered);
    discountHtml.innerHTML = discountAdded;
    freeHtml.innerHTML = freeAdded;
    finalHtml.innerHTML = finalNum;
}


function adjustPrice(event) {
    let currentItemNum = Number(event.target.parentElement.parentElement.id);
    let set = setItemNums.includes(currentItemNum);

    let target = event.target.classList.value;
    let value;
    switch (target) {
        case "box":
            if(set)
            {
                value = 0;
            }
            else
            {
                value = 6;
            }
            break;
        case "bow":
            value = 1;
            break;
        case "engraving":
            if(set)
            {
                value = 9.5 * 2;
            }
            else
            {
                value = 9.5;
            }
            break;
    }
    let adjustment = event.srcElement.checked ? value : -1 * value;
    let priceElement = event.target.parentElement.parentElement.children[6];
    let price = Number(priceElement.innerHTML);
    price += adjustment;
    priceElement.innerHTML = price;
}

function freeGiftSuggestion(total) {
    if (total >= 15 && total < 25) {
        return 1;
    }
    else if (total >= 25 && total < 50) {
        return 2;
    }
    else if (total >= 50 && total < 100) {
        return 8;
    }
    else if (total >= 100 && total < 200) {
        return 20;
    }
    else if (total >= 200 && total < 500) {
        return 50;
    }
    else if (total >= 500 && total < 1000) {
        return 175;
    }
    else if (total >= 1000) {
        return 350;
    }
    else
        return 0;
}


function generateQuote(e) {
    e.preventDefault();
    let email = generateEmail(parseSelectedItems(receiveItems()));
    // generate order
    // add quote to html
    ipcRenderer.send('email', email);
}

function receiveItems() {
    let checked = [];
    document.querySelectorAll('.selection').forEach((row) => {
        if (row.checked)
        {
            checked.push(row);
        }
    });
    let checkedItems = [];
    checked.forEach((item) => {
        checkedItems.push(item.parentElement.parentElement);
    });
    return checkedItems;
}

function parseSelectedItems(selectedItems) {
    var products = [];

    function extractColorSelection(product) {
        for (let i = 0; i < product.children[3].children.length; i += 1) {
            if(product.children[3].children[i].children[0].checked) // if color is checked
                return product.children[3].children[i].children[0].value;
        }
        return "";
    }

    function freeOrDiscount(product, condition) {
        if (product.children[1].children[0].classList.value === condition)
            return true;
        else
            return false;
    }

    selectedItems.forEach((product) => {
        var newProduct = {
            name: product.children[2].innerText,
            quantity: Number(product.children[1].children[0].value),
            color: extractColorSelection(product),
            price: Number(product.children[4].innerText),
            fullPrice: Number(product.children[6].innerText),
            free: freeOrDiscount(product, "free"),
            discount: freeOrDiscount(product, "discount")
        };
        newProduct.total = newProduct.fullPrice * newProduct.quantity;
        products.push(newProduct);
    });
    return products;
}

function generateEmail(productArray) {
    let quote = "<div id='quote'>";
    const giftWrapSelection = document.querySelector('#yes');
    const order = {
        itemsOrdered: 0,
        freeItems: 0,
        discountItems: 0,
        totalItems: 0,
        products: [],
        shipping: 62,
        giftWrap: giftWrapSelection.checked,
        total: 0
    };
    productArray.forEach((product) => {
        order.products.push(product);
        if (product.discount) {
            order.discountItems += product.quantity;
        }
        else if (product.free) {
            order.freeItems += product.quantity;
        }
        else {
            order.itemsOrdered += product.quantity;
        }
        order.total += Number(product.quantity * product.fullPrice);
    });
    order.totalItems = order.itemsOrdered + order.discountItems + order.freeItems;

    /* Sort Products in following order: Ordered, Quantity Discount, Free */
    order.products.sort( (a, b) => {
        if(a.discount)
        {
            if(b.free)
                return -1;
            else if (b.discount)
                return 0;
            else 
                return 1;
        }
        else if (a.free)
        {
            if(b.free)
                return 0;
            else
                return 1;
        }
        else
            return -1;
    });

    const header = `<h3>Quote #1 - ${order.itemsOrdered} Gifts w/ ${order.discountItems} additional at Quantity Discount - SAVINGS: ???</h3>`;
    quote += header;

    order.products.forEach((product) => {
        let productEntry = "";
        if (product.discount) {
            productEntry = `<p>${product.quantity} - ${product.color.toUpperCase()} ${product.name} @ Quantity Discount <span class="productTotal">$${(product.quantity * product.fullPrice).toFixed(2)}</span></p>`;
        }
        else if (product.free) {
            productEntry = `<p>FREE ${product.quantity} - ${product.color.toUpperCase()} ${product.name} for your home! <span class="productTotal">$${(product.quantity * product.fullPrice).toFixed(2)}</span></p>`;
        }
        else {
            productEntry = `<p>${product.quantity} - ${product.color.toUpperCase()} ${product.name} <span class="productTotal">$${(product.quantity * product.fullPrice).toFixed(2)}</span></p>`;
        }
        
        quote += productEntry;
    });
    
    if (order.giftWrap) {
        order.total += (order.totalItems - order.freeItems) * 5;
        quote += `<p>${order.totalItems - order.freeItems} - Gift Wraps<span class="productTotal">$${5 * (order.totalItems - order.freeItems)}</span></p>`;
    }

    quote += `<p>FLAT RATE SHIPPING<span class="productTotal">$${order.shipping}</span></p>`;
    quote += `<p>The Total is $${(order.total + order.shipping).toFixed(2)} + local tax paid over 5 months interest free for a monthly payment of $${((order.total + order.shipping) / 5).toFixed(2)} + local tax. With this quote your cost per gift would be <strong>$${Math.ceil(order.total / (order.totalItems - order.freeItems))}</strong>!</p>`;
    quote += "</div>";

    return quote;
    // document.body.innerHTML += quote; for appending html
}
