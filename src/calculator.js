let inputs, totalHtml, freeHtml, freeBtns, giftsHtml, generateQuoteButton;
freeBtns = document.querySelectorAll('.freebtn');
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
                <td>0</td>
            `;
        freeRow.classList = `${productRow.classList.value}`;
        freeRow.id = `${productRow.id}`;
        productRow.insertAdjacentElement('afterend', freeRow);
    })
}

function generatePageListeners()
{
    inputs = document.querySelectorAll('input[type=number]');
    totalHtml = document.querySelector('#totalCount');
    freeHtml = document.querySelector('#suggestedGifts');
    giftsHtml = document.querySelector('#giftCount');
    finalHtml = document.querySelector('#finalCount');


    // check box when value of product is over 1
    for(let i = 0; i < inputs.length; i++)
    {
        inputs[i].addEventListener("input", (e) => {
            if(e.target.value > 0) {
                var checkbox = e.target.parentElement.previousElementSibling.firstChild;
                checkbox.checked = true;
            }
            let totalOrdered = 0, giftsAdded = 0;
            inputs.forEach((input) => {
                if(input.classList.value !== "free")
                {
                    totalOrdered += Number(input.value);
                }
                else
                {
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

    

    generateQuoteButton = document.querySelector('button');
    generateQuoteButton.addEventListener("click", generateQuote);
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
    let email = generateEmail( parseSelectedItems( receiveItems() ) );
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
    
    function extractRadioSelection(product)
    {
        for(let i = 0; i < product.children[3].children.length; i += 2)
        {
            if (product.children[3].children[i].checked)
                return product.children[3].children[i].value;
        }
    }

    selectedItems.forEach((product) => {
        var newProduct = {
            name : product.children[2].innerText,
            quantity : Number(product.children[1].children[0].value),
            color: extractRadioSelection(product),
            price : Number(product.children[4].innerText),
            fullPrice : Number(product.children[5].innerText),
        };
        newProduct.total = newProduct.fullPrice * newProduct.quantity;
        products.push(newProduct);
    });
    
    return products;
}

function generateEmail(productArray) {
    const quote = "<div>";
    const order = {
        itemsOrdered: 0,
        products: [],
        numFreeGifts: 0,
        shipping: 62,
        totalItems: 0
    };
    productArray.forEach((product) => {
        order.itemsOrdered += product.quantity;
        order.totalItems += product.quantity;
        order.products.push(product);
    });

    order.numFreeGifts = freeGiftSuggestion(order.itemsOrdered);

    order.totalItems += order.numFreeGifts;

    // const quote = `<div>
    //         <h3>Quote #1 - 25 Gifts w/ 2 additional at Quantity Discount - SAVINGS: $822\n</h3>

    //         <p>25 -  WHITE Petite Culinary Companions                            $4975\n</p>
    //         <p>28 -  Gift Wraps                                                                    $140\n</p>
    //         <p>03 -  P. Culinary Companion Sets @ Quantity Discount      $60\n</p>
    //         <p>01 - FREE 5" Santoku for your home!                                  $0\n</p>
    //         <p>01 - FREE Carving Set for your home!                                $0\n</p>

    //         <p>FLAT RATE SHIPPING                                                        $62\n</p>


    //         <p>The Total is $5237 + local tax paid over 5 months interest free for a monthly payment of $1047.40 + local tax . With this quote your cost per gift would be $185 !\n</p>


    //         <h3>Quote #2 - 15 Gifts w/ 1 additional at Quantity Discount - SAVINGS: $290\n</h3>

    //         <p>15 -  WHITE Petite Culinary Companions                            $2985\n</p>
    //         <p>16 -  Gift Wraps                                                                    $80\n</p>
    //         <p>01 -  P. Culinary Companion Sets @ Quantity Discount      $20\n</p>
    //         <p>01 - FREE 5" Santoku for your home!                                  $0\n</p>

    //         <p>FLAT RATE SHIPPING                                                        $62\n</p>

    //         <p>The Total is $3147 + local tax paid over 5 months interest free for a monthly payment of $629.40 + local tax. With this quote your cost per gift would be $193 .\n</p>


    //         <p>Do you want to save more with Quote #1 or stick to Quote #2?\n</p></div>
    //     `;
    document.body.innerHTML += quote;
}
