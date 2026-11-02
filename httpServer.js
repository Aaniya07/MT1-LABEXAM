import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cart = [
  {
    id: 1,
    productName: "Wireless Mouse",
    price: 799,
    quantity: 2,
  },
  {
    id: 2,
    productName: "Keyboard",
    price: 999,
    quantity: 1,
  },
  {
    id: 3,
    productName: "Headphones",
    price: 1499,
    quantity: 1,
  },
];

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (method === "GET" && url === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h1>Welcome to Shopping Cart Management</h1>");
  } else if (method === "GET" && url === "/cart") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(cart));
  } else if (method === "GET" && url === "/about") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(
      "<h1>About</h1><p>Shopping Cart Management Application using Node.js.</p>",
    );
  } else if (method === "GET" && url === "/home") {
    const filePath = path.join(__dirname, "public", "index.html");

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Error reading HTML file.");
        return;
      }

      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(data);
    });
  } else if (method === "POST" && url === "/add-to-cart") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const product = JSON.parse(body);
        const { id, productName, price, quantity } = product;

        if (
          id === undefined ||
          typeof productName !== "string" ||
          productName.trim() === "" ||
          typeof price !== "number" ||
          !Number.isFinite(price) ||
          price < 0 ||
          !Number.isInteger(quantity) ||
          quantity < 1 ||
          cart.some((item) => item.id === id)
        ) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "Invalid product details or duplicate ID",
            }),
          );
          return;
        }

        cart.push({ id, productName, price, quantity });

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Product added successfully",
            product,
          }),
        );
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid JSON request" }));
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("404 - Route Not Found");
  }
});

server.listen(3000, () => {
  console.log("HTTP Server running at http://localhost:3000");
});
