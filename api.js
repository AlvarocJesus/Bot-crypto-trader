const axios = require("axios");
const queryString = require("querystring");
const crypto = require("crypto");

async function publicCall(path, data, method = "GET") {
  try {
    const qs = data ? `?${queryString.stringify(data)}` : "";

    const result = await axios({
      method,
      url: `${process.env.API_URL}${path}${qs}`,
    });

    return result.data;
  } catch (err) {
    console.log(err);
  }
}

async function privateCall(path, data = {}, method = "GET") {
  try {
    const timestamp = Date.now();
    const signature = crypto
      .createHmac("sha256", process.env.SECRET_KEY)
      .update(`${queryString.stringify({ ...data, timestamp })}`)
      .digest("hex");

    const newData = { ...data, timestamp, signature };

    const qs = data ? `?${queryString.stringify(newData)}` : "";

    const result = await axios({
      method,
      url: `${process.env.API_URL}${path}${qs}`,
      headers: { "X-MBX-APIKEY": process.env.API_KEY },
    });

    return result.data;
  } catch (err) {
    console.log(err);
  }
}

async function time() {
  return publicCall("/v3/time");
}

async function depth(symbol = "BTCBRL", limit = 5) {
  return publicCall("/v3/depth", { symbol, limit });
}

async function exchangeInfo() {
  return publicCall("/v3/exchangeInfo");
}

async function accountInfo() {
  return privateCall("/v3/account");
}

async function newOrder(
  symbol,
  quantity,
  price,
  side = "BUY",
  type = "MARKET"
) {
  const data = { symbol, side, type, quantity };

  if (price) data.price = price;
  if (type === "LIMIT") data.timeInForce = "GTC";

  return privateCall("/v3/order", data, "POST");
}

module.exports = { time, depth, exchangeInfo, accountInfo, newOrder };
