//Basically: https://gist.github.com/ryanflorence/701407

var fs = require('fs');
var http = require('http');
var path = require('path');
var url = require('url');

var port = process.argv[2] || 8888;

http.createServer(function(request, response) {
    var uri = url.parse(request.url).pathname;
    var filename = path.join(__dirname, 'public', uri);

    console.log(filename);
    var stats = fs.stat(filename, function(err, stats) {
        if (err) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            response.write('404 Not Found\n');
            response.end();
            return;
        }


        if (stats.isDirectory())
            filename += '/index.html';

          console.log(filename);

        fs.readFile(filename, 'binary', function(err, file) {
            if (err) {
                response.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                response.write(err + '\n');
                response.end();
                return;
            }

            response.writeHead(200);
            response.write(file, 'binary');
            response.end();
        });
    });
}).listen(parseInt(port, 10));

console.log('Static file server running at\n  => http://localhost:' + port + '/\nCTRL + C to shutdown');