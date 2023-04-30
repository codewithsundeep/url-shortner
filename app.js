const express = require("express");
const app = express();
const fs = require("@cyclic.sh/s3fs");
const crypto = require("crypto");
app.set("view engine", "hbs");
app.use(express.json());
app.use(express.static("static"));
function shorts() {
  let short = require("./shorts.json");
  return short.data;
}
function shortAndSave(url) {
  return new Promise((resolve, reject) => {
    // console.log("url is", url);
    let all = shorts();
    let id = crypto.randomBytes(2).toString("hex");
    let obj = {};
    obj[id] = url;
    let ft = all.filter((x) => x[id]);
    // console.log("all is", all);
    if (ft.length < 1) {
      all.push(obj);
      let newjson = {
        data: all,
      };
      //   console.log("new json is", newjson);
      fs.writeFile("./shorts.json", JSON.stringify(newjson), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({ long: url, short: id });
        }
      });
    } else {
      reject("Something went wrong!");
    }
  });
}

app.get("/", (req, res) => {
  res.render("main");
});
app.post("/", (req, res) => {
  shortAndSave(req.body.url)
    .then((dt) => {
      res.send(dt);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});
app.get("/recent", (req, res) => {
  let sort = require("./shorts.json");
  let data = sort.data;
  if (data.length < 11) {
    res.json(JSON.stringify({ data: data }));
  } else {
    let spc = data.slice(data.length - 10);
    res.json(JSON.stringify({ data: spc }));
  }
});
app.get("/*", (req, res) => {
  let short = require("./shorts.json");
  let data = short.data;
  let path = req.path.replace("/", "");
  let ft = data.filter((x) => x[path]);
  if (ft.length < 1) {
    res.redirect("/");
  } else {
    res.redirect(ft[0][path]);
  }
});
app.listen(process.env.PORT || 3000);
