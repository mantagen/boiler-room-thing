const http = require('http')

const router = require('./router')

const HOSTNAME = 'localhost'
const PORT = 3000

const server = http.createServer(router)

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`)
})
