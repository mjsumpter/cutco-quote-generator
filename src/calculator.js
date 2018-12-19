let inputs, totalHtml, freeHtml, freeBtns, giftsHtml, generateQuoteButton;
freeBtns = document.querySelectorAll('.freebtn');
generateQuoteButton = document.querySelector('#generateBtn');
generateQuoteButton.addEventListener("click", generateQuote);
generatePageListeners();
document.body.addEventListener("change", generatePageListeners);

// append free row if clicked
for (let i = 0; i < freeBtns.length; i++) {
    freeBtns[i].addEventListener("click", (e) => {
        let productRow = e.target.parentElement.parentElement;
        let freeRow = document.createElement('tr');
        freeRow.innerHTML = `
                <th><input type="checkbox" name="${productRow.children[0].firstElementChild.name}"></th>
                <th><input type="number" name="quantity" min="0" class="free"></th>
                <td>${productRow.children[2].innerHTML}</td>
                <td><input type="radio" id="classic" name="color1" value="classic">
                <label for="classic">Classic</label>
                
                <input type="radio" id="white" name="color2" value="white">
                <label for="white">White</label>
                
                <input type="radio" id="red" name="color3" value="red">
                <label for="red">Red</label></td>
                <td>0</td>
                <td>20</td>
            `;
        freeRow.classList = `${productRow.classList.value}`;
        freeRow.id = `${productRow.id}`;
        productRow.insertAdjacentElement('afterend', freeRow);
    })
}

function generatePageListeners() {
    inputs = document.querySelectorAll('input[type=number]');
    totalHtml = document.querySelector('#totalCount');
    freeHtml = document.querySelector('#suggestedGifts');
    giftsHtml = document.querySelector('#giftCount');
    finalHtml = document.querySelector('#finalCount');


    // check box when value of product is over 1
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener("input", (e) => {
            if (e.target.value > 0) {
                var checkbox = e.target.parentElement.previousElementSibling.firstChild;
                checkbox.checked = true;
            }
            let totalOrdered = 0, giftsAdded = 0;
            inputs.forEach((input) => {
                if (input.classList.value !== "free") {
                    totalOrdered += Number(input.value);
                }
                else {
                    giftsAdded += Number(input.value);
                }
            });

            let finalNum = totalOrdered + giftsAdded;
            totalHtml.innerHTML = totalOrdered;
            freeHtml.innerHTML = freeGiftSuggestion(totalOrdered);
            giftsHtml.innerHTML = giftsAdded;
            finalHtml.innerHTML = finalNum;
        })
    }
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



function generateQuote() {

    // var selectedItems = receiveItems();
    // var itemObjects = parseSelectedItems(selectedItems);
    let email = generateEmail(parseSelectedItems(receiveItems()));
    // generate order
    // add quote to html
}

function receiveItems() {
    var checked = document.querySelectorAll('input[type=checkbox]:checked');
    var checkedItems = [];
    checked.forEach((item) => {
        checkedItems.push(item.parentElement.parentElement);
    });
    return checkedItems;
}

function parseSelectedItems(selectedItems) {
    var products = [];

    function extractColorSelection(product) {
        for (let i = 0; i < product.children[3].children.length; i += 2) {
            if (product.children[3].children[i].checked)
                return product.children[3].children[i].value;
        }
        return "";
    }

    function extractFreeOption(product) {
        if (product.children[1].children[0].classList.value === "free")
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
            fullPrice: Number(product.children[5].innerText),
            free: extractFreeOption(product)
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
        products: [],
        shipping: 62,
        totalItems: 0,
        freeItems: 0,
        giftWrap: giftWrapSelection.checked,
        total: 0
    };
    productArray.forEach((product) => {
        order.products.push(product);
        if (product.free) {
            order.freeItems += product.quantity;
        }
        else {
            order.itemsOrdered += product.quantity;
        }
        order.total += Number(product.quantity * product.fullPrice);
    });
    order.totalItems = order.freeItems + order.itemsOrdered;

    const header = `<h3>Quote #1 - ${order.itemsOrdered} Gifts w/ ${order.freeItems} additional at Quantity Discount - SAVINGS: ???</h3>`;
    quote += header;

    order.products.forEach((product) => {
        let productEntry = "";
        if (product.free) {
            productEntry = `<p>${product.quantity} - ${product.color.toUpperCase()} ${product.name} @ Quantity Discount <span class="productTotal">$${product.quantity * product.fullPrice}</span></p>`;
        }
        else {
            productEntry = `<p>${product.quantity} - ${product.color.toUpperCase()} ${product.name} <span class="productTotal">$${product.quantity * product.fullPrice}</span></p>`;
        }

        quote += productEntry;
    });
    // ADD FREE INCLUDED GIFTS!
    if (order.giftWrap) {
        order.total += order.totalItems * 5;
        quote += `<p>${order.totalItems} - Gift Wraps<span class="productTotal">$${5 * order.totalItems}</span></p>`;
    }

    quote += `<p>FLAT RATE SHIPPING<span class="productTotal">$${order.shipping}</span></p>`;
    quote += `<p>The Total is $${(order.total + order.shipping).toFixed(2)} + local tax paid over 5 months interest free for a monthly payment of $${((order.total + order.shipping) / 5).toFixed(2)} + local tax. With this quote your cost per gift would be <strong>$${Math.ceil(order.total / order.totalItems)}</strong>!</p>`;
    quote += "</div>";

    document.body.innerHTML += quote;
}
