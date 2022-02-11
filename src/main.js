import { updateChart, dateRanges, replaceState } from "./utils.js";

let params = new URLSearchParams(document.location.search);
let query = params.get("q");
let time = params.get("t");

let selectedStock = document.querySelector("#stock");
let selectedTime = document.querySelector("#time");

if (!query || query == "undefined" || query == "null") {
  params.set("q", "AAPL");
  query = params.get("q");
}

if (!Object.keys(dateRanges).some((k) => k == time)) {
  time = "oneDay";
  params.set("t", "oneDay");
}

selectedStock.value = query;
selectedTime.value = time;

replaceState(params);

selectedStock.addEventListener("change", (event) => {
  params.set("q", event.target.value);

  replaceState(params);
  updateChart(selectedStock.value, selectedTime.value);
});

selectedTime.addEventListener("change", (event) => {
  params.set("t", event.target.value);

  replaceState(params);
  updateChart(selectedStock.value, selectedTime.value);
});

updateChart(selectedStock.value, selectedTime.value);
