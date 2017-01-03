var PORT = 3000
var http = require('http')
var url = require('url')
var fs = require('fs')
var mine = require('./mine').types
var path = require('path')
var i = 0
var server = http.createServer(function(request, response) {
    var pathname = url.parse(request.url).pathname
    
    // 如果文件名是空就获取index.html
    pathname = pathname == '/' ? 'index.html' : pathname

    var realPath = path.join(__dirname, pathname)

    var ext = path.extname(realPath)

    ext = ext ? ext.slice(1) : 'unknown'

    fs.exists(realPath, function(exists) {

        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            })

            response.write('this request URL ' + pathname + ' was not found on this server.')
            response.end()

        } else {

            fs.readFile(realPath, 'binary', function(err, file) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    })
                    response.end(err)

                } else {
                    var contentType = mine[ext] || 'text/plain'
                    response.writeHead(200, {
                        'Content-Type': contentType
                    });
                    response.write(file, 'binary')
                    response.end()
                }
            })
        }
    })
})
server.listen(PORT)
server.on('connection', function(socket) {
    i ++
    console.log('connection', '链接成功第', i , '次')
})
console.log('Server runing at port: ' + PORT + '.')