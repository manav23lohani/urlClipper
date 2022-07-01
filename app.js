const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/urlData')
const qr = require('qrcode')
require('dotenv').config()
const app = express()

mongoose.connect(process.env.DB_LINK,{
  useUnifiedTopology:true,
  useNewUrlParser:true
})

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
  res.render('index')
})

app.post('/clipUrl', async (req, res) => {
  const copyurl = await ShortUrl.create({ full: req.body.fullUrl })
  const generatedQR = await qr.toDataURL(copyurl.full)
  res.render('index', {copyurl:copyurl.short, src:generatedQR})
})

app.get('/:clippedUrl', async (req, res) => {
  const clippedUrl = await ShortUrl.findOne({ short: req.params.clippedUrl })
  if (clippedUrl == null) return res.sendStatus(404)
  res.redirect(clippedUrl.full)
})

app.listen(process.env.PORT);