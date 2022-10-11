const { Console } = require('console');
const query = require('querystring');
const users = {};

const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  response.writeHead(status, headers);
  response.end();
};

const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };
  return respondJSON(request, response, 200, responseJSON);
};

const getUsersMeta = (request, response) => 
{
    respondJSONMeta(request, response, 200);
}

const notFound = (request, response) => {
    const responseJSON = {
        message : 'The page you are looking for was not found.',
        id: 'notFound',
    }

    respondJSON(request, response, 404, responseJSON)
}

const notFoundMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

const addUser = (request, response, body) => {
  const responseJSON = {
    message: 'Fill Out All Required Fields.',
  };

  console.log("ADDUSERHAPPEND");
  console.log(body)
  //Check if eiter is not initialized
  if (!body.name || !body.albums) {
    responseJSON.id = 'missingParameters';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 204;

  //Create user
  if (!users[body.name]) {
    responseCode = 201;
    users[body.name] = {};
  }
  //change values
  users[body.name].name = body.name;
  users[body.name].albums = body.albums;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};
const parseBody = (request, response, handler = addUser) => {
    // The request will come in in pieces. We will store those pieces in this
    // body array.
    const body = [];
  
    // The body reassembly process is event driven, much like when we are streaming
    // media like videos, etc. We will set up a few event handlers. This first one
    // is for if there is an error. If there is, write it to the console and send
    // back a 400-Bad Request error to the client.
    request.on('error', (err) => {
      console.dir(err);
      response.statusCode = 400;
      response.end();
    });
  
    // The second possible event is the "data" event. This gets fired when we
    // get a piece (or "chunk") of the body. Each time we do, we will put it in
    // the array. We will always recieve these chunks in the correct order.
    request.on('data', (chunk) => {
      body.push(chunk);
    });
  
    // The final event is when the request is finished sending and we have recieved
    // all of the information. When the request "ends", we can proceed. Turn the body
    // array into a single entity using Buffer.concat, then turn that into a string.
    // With that string, we can use the querystring library to turn it into an object
    // stored in bodyParams. We can do this because we know that the client sends
    // us data in X-WWW-FORM-URLENCODED format. If it was in JSON we could use JSON.parse.
    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);
  
      // Once we have the bodyParams object, we will call the handler function. We then
      // proceed much like we would with a GET request.
      //Handler isnt handling so I self inserted addUSer god help
      addUser(request, response, bodyParams);
    });
  };

// set public modules
module.exports = {
  getUsers,
  getUsersMeta,
  notFound,
  notFoundMeta,
  addUser,
  parseBody,
};
