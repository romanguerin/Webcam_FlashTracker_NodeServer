const http = require('http');
//const util = require('util');
const fs = require('fs');

http.createServer(function (req, res) {

    if (req.method === 'POST') {
        console.log("POST");
        var body = '';
        req.on('data', function (data) {
            body += data;
            console.log("Partial body: " + body);

            //write fs
            fs.writeFile('json/myfile.json', data, err => {
                if (err) {
                    console.log('Error writing file', err)
                } else {
                    console.log('Successfully wrote file')
                }
            });

        });
        req.on('end', function () {
            console.log("Body: " + body);
        });
        res.writeHead(200, {'Content-Type': 'text/plain','Access-Control-Allow-Origin': '*'});
        res.end('callback(\'{\"msg\": \"OK\"}\')');
    }
    else {
        console.log("GET");
        res.writeHead(200, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'});
        res.end('callback(\'{\"msg\": \"OK\"}\')');
    }

}).listen(8090);
console.log('Server running on port 8090');