const express = require("express");
const app = express();
const port = 3000;
const { engine } = require("express-handlebars");
const urls = require("./public/jsons/url.json");

app.use(express.static("public"));
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/shorten", (req, res) => {
  // 取得 input 值
  const inputValue = req.query.url;
  // 檢查 input 值是否空白
  if (inputValue && inputValue.length > 0) {
    const shortUrl = "fakeShortUrl";
    res.render("short", { shortUrl });
  }
});

app.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`);
});
