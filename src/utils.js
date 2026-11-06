export let dateRanges = {
  oneDay: "1d",
  fiveDays: "5d",
  oneMonth: "1mo",
  threeMonths: "3mo",
  sixMonths: "6mo",
  oneYear: "1y",
  twoYears: "2y",
  fiveYears: "5y",
  tenYears: "10y",
  yearToDay: "ytd",
  max: "max",
};

export async function updateChart(name, time) {
  let data = await fetchData(name, dateRanges[time]);
  const dates = data.chart.result[0].timestamp.map((x) =>
    dateRanges[time] == "1d"
      ? new Date(x * 1000).toLocaleTimeString()
      : new Date(x * 1000).toLocaleDateString()
  );
  const prices = data.chart.result[0].indicators.quote[0].close;

  let dataTable = {};
  for (let i = 0; i < dates.length; i++) {
    dataTable[dates[i]] = prices[i];
  }

  console.table(dataTable);

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

export function replaceState(params) {
  if (window.history.replaceState) {
    const url =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      "?" +
      params.toString();

    window.history.replaceState(
      {
        path: url,
      },
      "",
      url
    );
  }
}

export async function fetchData(name, time) {
  try {
    const params = new URLSearchParams({ symbol: name, range: time });
    const response = await fetch(`/.netlify/functions/chart?${params}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to load chart data");
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
