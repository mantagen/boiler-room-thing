const fs = require('fs')
const mime = require('mime-types')

const PUBLIC_FOLDER_NAME = 'assets'
const PUBLIC_FOLDER_PATH = './public'

const publicAsset = (filename, cb) => {
  fs.readFile(PUBLIC_FOLDER_PATH + '/' + filename, cb)
}

const splitUrl = url => url.split('/')

const assetFilenameFromUrl = url => splitUrl(url).length === 3 && splitUrl(url)[1] === PUBLIC_FOLDER_NAME && splitUrl(url)[2]

const views = {
  index: fs.readFileSync('./views/index.html'),
  notFound: fs.readFileSync('./views/404.html')
}

const routes = {
  get: {
    '/': (req, res) => {
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/html')
      res.end(views.index)
    },
    '/favourites': (req, res) => {
      const { favouriteSets } = require('./data-source')
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(favouriteSets))
    }
  }
}

const notFoundHandler = (req, res) => {
  res.statusCode = 404
  res.setHeader('Content-Type', 'text/html')
  res.end(views.notFound)
}

const publicAssetHandler = (req, res) => {
  const filename = assetFilenameFromUrl(req.url)
  publicAsset(filename, (err, file) => {
    if (err) {
      return notFoundHandler(req, res)
    } else {
      const type = mime.lookup(filename)
      res.statusCode = 200
      res.setHeader('Content-Type', type)
      res.end(file)
    }
  })
}

const router = (req, res) => {
  const method = req.method.toLowerCase()
  const url = req.url.toLowerCase()

  if (routes[method] && routes[method][url]) {
    return routes[method][url](req, res)
  } else if (method === 'get' && assetFilenameFromUrl(url)) {
    return publicAssetHandler(req, res)
  } else {
    return notFoundHandler(req, res)
  }
}

module.exports = router
