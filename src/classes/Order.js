//Define an order class
class Order {
    constructor(products = []) {
        this.products = products;
        this.total = 0;
    }

    static generateQuote(order)
    {
        const quote = `
            Quote #1 - 25 Gifts w/ 2 additional at Quantity Discount - SAVINGS: $822\n

            25 -  WHITE Petite Culinary Companions                            $4975\n
            28 -  Gift Wraps                                                                    $140\n
            03 -  P. Culinary Companion Sets @ Quantity Discount      $60\n
            01 - FREE 5" Santoku for your home!                                  $0\n
            01 - FREE Carving Set for your home!                                $0\n

            FLAT RATE SHIPPING                                                        $62\n


            The Total is $5237 + local tax paid over 5 months interest free for a monthly payment of $1047.40 + local tax . With this quote your cost per gift would be $185 !\n


            Quote #2 - 15 Gifts w/ 1 additional at Quantity Discount - SAVINGS: $290\n

            15 -  WHITE Petite Culinary Companions                            $2985\n
            16 -  Gift Wraps                                                                    $80\n
            01 -  P. Culinary Companion Sets @ Quantity Discount      $20\n
            01 - FREE 5" Santoku for your home!                                  $0\n

            FLAT RATE SHIPPING                                                        $62\n

            The Total is $3147 + local tax paid over 5 months interest free for a monthly payment of $629.40 + local tax. With this quote your cost per gift would be $193 .\n


            Do you want to save more with Quote #1 or stick to Quote #2?\n
        `;
    }
}

module.exports = Order;