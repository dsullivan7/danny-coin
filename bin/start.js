import http from 'http'
import app from '../src/app'

const port = 8000

app.set('port', port)

const server = http.createServer(app)
server.listen(port)

console.log('Danny Coin server has started')
