const { addToOrder, orders } = require('./src/public/js/addToOrder');

// Mock updateOrderList agar tidak error
global.updateOrderList = jest.fn();

beforeEach(() => {
    orders.length = 0; // Reset orders sebelum setiap test
});

test('should add a new item to orders if it does not exist', () => {
    const item = { idProduk: 1, namaProduk: 'Produk A', harga: 10000 };
    
    addToOrder(item);

    expect(orders).toHaveLength(1);
    expect(orders[0]).toEqual({
        id: 1,
        name: 'Produk A',
        price: 10000,
        quantity: 1,
        totalPrice: 10000
    });
});
