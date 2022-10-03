const http = require('http')
const url = require('url')
const query = require('querystring');

const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
    GET: {
        '/': htmlHandler.getIndex,
        '/style.css': htmlHandler.getCSS,
        '/onloadHandler.js': htmlHandler.getJS,
        '/getUsers': jsonHandler.getUsers,
        notFound: jsonHandler.notFound,
    },
    HEAD: {
        '/getUsers': jsonHandler.getUsersMeta,
        notFound: jsonHandler.notFoundMeta,
    },
    POST: {
        '/addUser': jsonHandler.parseBody,
        notFound: jsonHandler.notFoundMeta,
    },
};

const onRequest = (request, response, handler) => {
    const parsedURL = url.parse(request.url);

    const params = query.parse(parsedURL.query);

    if(urlStruct[request.method][parsedURL.pathname])
    {
        urlStruct[request.method][parsedURL.pathname](request,response,params, handler);
    }
    else
    {
        urlStruct[request.method].notFound(request,response, params);
    }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1:${port}`);