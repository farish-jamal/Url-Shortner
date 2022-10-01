const express = require('express')
const app = express()
const mongoose = require('mongoose')
const ShortUrl = require("./models/urlModels");
const port = 3000 || process.env.port;

mongoose.connect("mongodb://localhost/urlShortner");

app.set("view engine", "ejs");
app.use(express.urlencoded({extended: false}))

app.get('/', async(req, res) => {
  const shortUrl = await ShortUrl.find();
  res.render("index", {shortUrl: shortUrl});
})

app.post('/shortUrls', async(req, res) => {
  await ShortUrl.create({full: req.body.fullUrl});
  res.redirect("/");
})

app.get('/:short', async(req, res) => {
   const shortUrl = await ShortUrl.findOne({short : req.params.short});
   if(shortUrl == null) return res.status(404);
   shortUrl.clicks++;
   shortUrl.save();
   res.redirect(shortUrl.full);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})