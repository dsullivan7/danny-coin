import express from 'express'
import bodyParser from 'body-parser'
import bluebird from 'bluebird'

import routes from './routes'

// set bluebird as the default promise librar
global.Promise = bluebird

// Set up the express app
const app = express()

// Parse incoming requests data
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(routes)

// Default Route
app.get('*', (req, res) => res.status(200).send({
  message: 'Danny Coin Server',
}))

module.exports = app
