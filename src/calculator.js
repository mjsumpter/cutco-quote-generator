var inputs = document.querySelectorAll('input[type=number]');

for(let i = 0; i < inputs.length; i++)
{
    inputs[i].addEventListener("input", (e) => {
        if(e.target.value > 0) {
            var checkbox = e.target.parentElement.previousElementSibling.firstChild;
            checkbox.checked = true;
        }
    })
}

var generateQuoteButton = document.querySelector('button');
generateQuoteButton.addEventListener("click", generateQuote);

function generateQuote() {
    var selectedItems = receiveItems();
    var itemObjects = parseSelectedItems(selectedItems);
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
    
    selectedItems.forEach((product) => {
        var newProduct = {
            name : product.children[2].innerText,
            quantity : product.children[1].children[0].value,
            price : product.children[3].innerText,
            fullPrice : product.children[4].innerText,
        }
        products.push(newProduct);
    });
    
    return products;
}
