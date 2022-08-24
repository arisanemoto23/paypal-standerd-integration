import fetch from "node-fetch";

// set some important variables
const { CLIENT_ID, APP_SECRET } = process.env;
const base = "https://api-m.sandbox.paypal.com";

// call the create order method
export async function createOrder() {
  const purchaseAmount = "10"; // TODO: pull prices from a database
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      "application_context": {
        "shipping_preference": "SET_PROVIDED_ADDRESS"
      },
      purchase_units: [
        {
          amount: {
            currency_code: "JPY",
            value: purchaseAmount,
          },
          "shipping": { 

            "name": { 

                "full_name": "太郎 青山" 

            }, 

            "address": { 

                "address_line_1": "青山1-2-3", 

                "address_line_2": "ペイパルビル 1001", 

                "admin_area_2": "港区", 

                "admin_area_1": "東京都", 

                "postal_code": "123-4567", 

                "country_code": "JP" 

            } 
        }, 
        },
      ],
    }),
  });

  return handleResponse(response);
}

// list all Payment Token
export async function generatePaymentToken(customerId) {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/vault/payment-tokens?customer_id=${customerId}`;
  const response = await fetch(url, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(response);
}

//Call Get Order
export async function getOrder(orderId) {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderId}`;
  const response = await fetch(url, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(response);
}

// capture payment for an order
export async function capturePayment(orderId) {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderId}/capture`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(response);
}

// generate access token
export async function generateAccessToken() {
  const auth = Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64");
  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: "post",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  const jsonData = await handleResponse(response);
  return jsonData.access_token;
}

// generate client token
export async function generateClientToken(customerID) {
  const accessToken = await generateAccessToken();
  const response = await fetch(`${base}/v1/identity/generate-token`, {
    method: "post",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Accept": "application/json",
      "Accept-Language": "en_US",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "customer_id": "customer_0723123"
    }),
  });
  console.log('response', response.status)
  const jsonData = await handleResponse(response);
  return jsonData.client_token;
}

async function handleResponse(response) {
  if (response.status === 200 || response.status === 201) {
    return response.json();
  }

  const errorMessage = await response.text();
  throw new Error(errorMessage);
}
