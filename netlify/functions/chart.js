const YAHOO_BASE_URL = "https://query1.finance.yahoo.com/v8/finance/chart";
const RANGES = new Set([
  "1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y", "10y", "ytd", "max",
]);
const INTERVALS = {
  "1d": "5m",
  "5d": "15m",
  "1mo": "1d",
  "3mo": "1d",
  "6mo": "5d",
  ytd: "1h",
  "1y": "5d",
  "2y": "5d",
  "5y": "3mo",
  "10y": "3mo",
  max: "3mo",
};

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  const symbol = (event.queryStringParameters?.symbol || "").trim().toUpperCase();
  const range = event.queryStringParameters?.range || "";
  if (!/^[A-Z0-9^.-]{1,20}$/.test(symbol)) {
    return jsonResponse(400, { error: "Invalid or missing symbol" });
  }
  if (!RANGES.has(range)) {
    return jsonResponse(400, { error: "Invalid or missing range" });
  }

  const url = new URL(`${YAHOO_BASE_URL}/${encodeURIComponent(symbol)}`);
  url.search = new URLSearchParams({
    region: "US",
    lang: "en-US",
    includePrePost: "false",
    interval: INTERVALS[range],
    useYfid: "true",
    range,
  });

  try {
    const response = await fetch(url, {
      headers: { "user-agent": "Mozilla/5.0" },
    });
    const body = await response.text();
    if (!response.ok) {
      return jsonResponse(502, { error: "Quote provider request failed" });
    }
    return jsonResponse(200, JSON.parse(body));
  } catch {
    return jsonResponse(502, { error: "Quote provider request failed" });
  }
};

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
    body: JSON.stringify(body),
  };
}
