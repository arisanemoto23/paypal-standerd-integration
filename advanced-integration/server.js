import "dotenv/config";
import express from "express";
import * as paypal from "./paypal-api.js";

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

// render checkout page with client id & unique client token
app.get("/", async (req, res) => {
  const clientId = process.env.CLIENT_ID;
  const customerId = "customer_0723123"; 
  try {
    const clientToken = await paypal.generateClientToken(customerId);
    res.render("checkout", { clientId, clientToken });
    console.log(clientToken);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


//Generate Payment Token
app.get("/vault/payment-tokens?customer_id=customer_0723123", async (req, res) => {
  const customerId = "customer_0723123"; 
  try {
    const PaymentToken = await paypal.generatePaymentToken(customerId);
    res.json(PaymentToken);
    console.log(PaymentToken);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// create order
app.post("/api/orders", async (req, res) => {
  try {
    const order = await paypal.createOrder();
    res.json(order);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


//Get Order
app.get(`/api/orders/:orderID`, async (req, res) => {
  const { orderID } = req.params;
  try {
  const getData = await paypal.getOrder(orderID);
  res.json(getData);
  } catch (err) {
    res.status(500).send(err.message);
  }
});



// capture payment
app.post("/api/orders/:orderID/capture", async (req, res) => {
  const { orderID } = req.params;
  try {
    const getData = await paypal.getOrder(orderID);
    console.log(getData);
    const captureData = await paypal.capturePayment(orderID);
    res.json(captureData);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(8888);



