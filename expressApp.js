import express from "express";

const app = express();
const PORT = 4000;

// Middleware to parse JSON
app.use(express.json());

// Initial shopping cart array with at least 3 items
let cartItems = [
  {
    id: 1,
    productName: "Wireless Mouse",
    price: 799,
    quantity: 2,
    category: "Electronics",
  },
  {
    id: 2,
    productName: "Mechanical Keyboard",
    price: 2499,
    quantity: 1,
    category: "Electronics",
  },
  {
    id: 3,
    productName: "USB-C Hub",
    price: 1299,
    quantity: 2,
    category: "Accessories",
  },
];

// 1. GET /cart - Retrieve all cart items
app.get("/cart", (req, res) => {
  res.json(cartItems);
});

// 2. GET /cart/:id - Retrieve a cart item by ID
app.get("/cart/:id", (req, res) => {
  const itemId = parseInt(req.params.id);
  const item = cartItems.find((p) => p.id === itemId);

  if (!item) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(item);
});

// 3. POST /cart - Add a new product to the cart
app.post("/cart", (req, res) => {
  const { id, productName, price, quantity, category } = req.body;

  if (!id || !productName || !price || !quantity) {
    return res
      .status(400)
      .json({ message: "Please provide all required product details" });
  }

  const newProduct = { id, productName, price, quantity, category };
  cartItems.push(newProduct);

  res.status(201).json({
    message: "Product added successfully",
    product: newProduct,
  });
});

// 4. PUT /cart/:id - Update product details
app.put("/cart/:id", (req, res) => {
  const itemId = parseInt(req.params.id);
  const itemIndex = cartItems.findIndex((p) => p.id === itemId);

  if (itemIndex === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  const { productName, price, quantity, category } = req.body;

  cartItems[itemIndex] = {
    id: itemId,
    productName: productName || cartItems[itemIndex].productName,
    price: price !== undefined ? price : cartItems[itemIndex].price,
    quantity: quantity !== undefined ? quantity : cartItems[itemIndex].quantity,
    category: category || cartItems[itemIndex].category,
  };

  res.json({
    message: "Product updated successfully",
    product: cartItems[itemIndex],
  });
});

// 5. DELETE /cart/:id - Remove a product from the cart
app.delete("/cart/:id", (req, res) => {
  const itemId = parseInt(req.params.id);
  const itemIndex = cartItems.findIndex((p) => p.id === itemId);

  if (itemIndex === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  const deletedItem = cartItems.splice(itemIndex, 1);
  res.json({
    message: "Product deleted successfully",
    product: deletedItem[0],
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
