const api = require("./api");
const symbol = process.env.SYMBOL;

setInterval(async () => {
  let sell;
  let buy;
  let account;
  let coins;
  const result = await api.depth(symbol);

  if (result.bids && result.bids.length) {
    console.log(`Highest Buy: ${result.bids[0][0]}`);
    buy = parseInt(result.bids[0][0]);
  }

  if (result.asks && result.asks.length) {
    console.log(`Lowest Sell: ${result.asks[0][0]}`);
    sell = parseInt(result.asks[0][0]);
  }

  if (sell < 700) {
    console.log("hora de comprar");
    account = await api.accountInfo();
    coins = account.balances.filter((b) => symbol.indexOf(b.asset) !== -1);
    console.log("Posicao da carteira:" + coins);
    console.log(coins);
  } else if (buy > 1000) {
    console.log("hora de vender");
    account = await api.accountInfo();
    coins = account.balances.filter((b) => symbol.indexOf(b.asset) !== -1);
    console.log("Posicao da carteira:" + coins);
    console.log(coins);
  } else {
    console.log("esperando mercado se mexer");
    account = await api.accountInfo();
    coins = account.balances.filter((b) => symbol.indexOf(b.asset) !== -1);
    console.log("Posicao da carteira:" + coins);
    console.log(coins);
  }

  // console.log(await api.exchangeInfo())
}, process.env.CRAWLER_INTERVAL);
