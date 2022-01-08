const express = require("express");
const api = require("./api");

const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());
app.set("view engine", "ejs");

app.use("/data", async (req, res) => {
  const data = {};

  const mercado = await api.depth(process.env.SYMBOL);

  data.buy = mercado.bids.length ? mercado.bids[0][0] : 0;
  data.sell = mercado.asks.length ? mercado.asks[0][0] : 0;

  const wallet = await api.accountInfo();
  const coins = wallet.balances.filter((b) => symbol.indexOf(b.asset !== -1));

  data.coins = coins;

  const sellPrice = parseFloat(data.sell);
  const walletUSD = parseFloat(
    coins.find((c) => c.asset.endsWith(process.env.COIN))
  );

  if (sellPrice < 1000) {
    const quantity = parseFloat(walletUSD / sellPrice - 0.00001).toFixed(5);
    console.log({ quantity });

    if (quantity > 0) {
      console.log("Tenho grana! Comprando agora...");
      const buyOrder = await api.newOrder(symbol, quantity);
      data.buyOrder = buyOrder;

      if (buyOrder.status === "FILLED") {
        console.log("Posicionando venda futura...");

        const price = parseFloat(
          sellPrice * parseFloat(process.env.PROFITABILITY)
        ).toFixed(8);

        const sellOrder = await api.newOrder(symbol, quantity, sellPrice, "SELL", "LIMIT");
        data.sellOrder = sellOrder;
      }
    }
  }
  res.json(data);
});

app.get("/", (req, res) => {
  
  return res.render("app", {
    lastUpdate: new Date(),
    symbol: process.env.SYMBOL,
    profitability: process.env.PROFITABILITY,
    interval: parseInt(process.env.CRAWLER_INTERVAL),
  });
});

app.listen(port, () => console.log("Server and bot is running"));
