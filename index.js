const http = require('http');
//const util = require('util');
const fs = require('fs');

const empty = '';
fs.writeFile('json/myfile.json', empty, err => {
    if (err) {
        console.log('Error writing file', err)
    } else {
        console.log('Empty file')
    }
});

http.createServer(function (req, res) {

    if (req.method === 'POST') {
        console.log("POST");
        req.on('data', function (data) {
            console.log("json value:" + data );

            //write fs
            fs.writeFile('json/myfile.json', data, err => {
                if (err) {
                    console.log('Error writing file', err)
                } else {
                    console.log('Successfully wrote file')
                }
            });

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
