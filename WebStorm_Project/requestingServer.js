var express = require('express');
var http = require('http');

var portNumber = 3000;
var app = express();

app.get('/proxy', function(request, response){
    console.log('Request: ' + request.query.urlToFetch);
    performProxyCall(request.query.urlToFetch, response);
});


function performProxyCall(url, response){
    http.get(url, function(responseFromOtherDomain) {
        var contentType = responseFromOtherDomain.headers['content-type'];
        response.writeHead(200, {'Content-Type': contentType});
        responseFromOtherDomain
            .on("data", function(responseBody) {
            response.write(responseBody);
            })
            .on("end", function() {
                response.end();
            })
    });
}

app.use(express.static(__dirname)); //serve static content

app.listen(portNumber);
console.log('Requester with proxy is listening on port '+ portNumber);