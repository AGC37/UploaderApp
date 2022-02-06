const PROXY_CONFIG = [
  {
    context: [
      "/weatherforecast",
      "/upload",
      "/api",
    ],
    target: "https://localhost:7254",
    secure: false
  }
]

module.exports = PROXY_CONFIG;
