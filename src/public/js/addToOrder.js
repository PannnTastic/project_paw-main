const orders = [];
let subTotal = 0;

function addToOrder(item) {
    const existingOrder = orders.find(order => order.name === item.namaProduk);

    if (existingOrder) {
        existingOrder.quantity += 1;
        existingOrder.totalPrice += item.harga;
    } else {
        orders.push({
            id: item.idProduk,
            name: item.namaProduk,
            price: item.harga,
            quantity: 1,
            totalPrice: item.harga
        });
    }

    subTotal += item.harga;
    updateOrderList();
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { addToOrder, orders };
}
