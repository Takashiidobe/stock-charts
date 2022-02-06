let headers = {};

let dateRanges = {
  oneDay: "1d",
  fiveDays: "5d",
  oneMonth: "1mo",
  sixMonths: "6mo",
  oneYear: "1y",
  fiveYears: "5y",
  yearToDay: "ytd",
  max: "max",
};

async function fetchData(name, time) {
  let interval = "1d";
  switch (time) {
    case "1d":
      interval = "5m";
      break;
    case "5d":
      interval = "15m";
      break;
    case "1mo":
      interval = "1d";
      break;
    case "6mo":
      interval = "5d";
      break;
    case "ytd":
      interval = "1h";
      break;
    case "1y":
      interval = "1d";
      break;
    case "5y":
      interval = "1wk";
      break;
    case "max":
      interval = "3mo";
      break;
  }
  console.log(name, time, interval);
  try {
    let str = `https://cors-anywhere.takashiidobe.com/https://query1.finance.yahoo.com/v8/finance/chart/${name}?region=US&lang=en-US&includePrePost=false&interval=${interval}&useYfid=true&range=${time}&corsDomain=finance.yahoo.com&.tsrc=finance`;
    const response = await fetch(str, headers);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function updateChart(name, time) {
  let data = await fetchData(name, dateRanges[time]);
  const dates = data.chart.result[0].timestamp.map((x) =>
    new Date(x * 1000).toLocaleDateString()
  );
  const prices = data.chart.result[0].indicators.quote[0].close;

  console.table(dates);
  console.table(prices);

  document.getElementById("myChart").remove();
  let canvas = document.createElement("canvas");
  canvas.setAttribute("id", "myChart");
  document.body.appendChild(canvas);

  const ctx = document.getElementById("myChart");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: `${name} Price`,
          data: prices,
          borderWidth: 1,
        },
      ],
    },
  });
}

let selectedStock = document.querySelector("#stock");
let selectedTime = document.querySelector("#time");

selectedStock.addEventListener("change", () => {
  if (selectedStock.value) {
    updateChart(selectedStock.value, selectedTime.value);
  }
});
selectedTime.addEventListener("change", () => {
  if (selectedStock.value) {
    updateChart(selectedStock.value, selectedTime.value);
  }
});
