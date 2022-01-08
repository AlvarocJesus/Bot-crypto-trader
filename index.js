const api = require("./api");
const symbol = process.env.SYMBOL;

setInterval(async () => {
  let sell = 0;
  let buy = 0;
  let coins = 0;

  const result = await api.depth(symbol);

  if (result.bids && result.bids.length) {
    console.log(`Highest Buy: ${result.bids[0][0]}`);
    buy = parseFloat(result.bids[0][0]);
  }

  if (result.asks && result.asks.length) {
    console.log(`Lowest Sell: ${result.asks[0][0]}`);
    sell = parseFloat(result.asks[0][0]);
  }

  if (sell && sell < 700) {
    console.log("hora de comprar");

    const account = await api.accountInfo();
    coins = account.balances.filter((b) => symbol.indexOf(b.asset) !== -1);
    console.log('POSICAO DA CARTEIRA');
    console.log(coins);

    console.log("Verificando se tenho grana...");
    const walletCoin = parseFloat(
      coins.find((c) => c.asset === process.env.COIN).free
    );
    /* parseFloat(
      coins.find((c) => c.asset === process.env.COIN).free
    ); */

    const quantity = parseFloat(walletCoin / sell - 0.00001).toFixed(5);
    console.log({ quantity });

    if (quantity > 0) {
      console.log("Tenho grana! Comprando agora...");
      const buyOrder = await api.newOrder(symbol, quantity);
      console.log(`orderId: ${buyOrder.orderId}`);
      console.log(`status: ${buyOrder.status}`);

      if (buyOrder.status === "FILLED") {
        console.log("Posicionando venda futura...");

        const price = parseFloat(
          sell * parseFloat(process.env.PROFITABILITY)
        ).toFixed(8);

        const sellOrder = await api.newOrder(symbol, 1, price, "SELL", "LIMIT");
        console.log(`orderId: ${sellOrder.orderId}`);
        console.log(`status: ${sellOrder.status}`);
      }
    }
  } else if (buy && buy > 1000) {
    console.log("hora de vender");
    console.log(coins);
  } else {
    console.log("esperando mercado se mexer");
    console.log(coins);
  }

  // console.log(await api.exchangeInfo())
}, process.env.CRAWLER_INTERVAL);
