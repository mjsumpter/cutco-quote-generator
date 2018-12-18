//Define product class
class Product {
    constructor(itemNum, description, color, includedProducts, box = false, engraving = false, bow = false, points) {
        this.itemNum = itemNum;
        this.description = description;
        this.color = color;
        this.includedProducts = includedProducts;
        this.box = box;
        this.engraving = engraving;
        this.bow = bow;
        this.points = points;
    }
}

module.exports = Product;