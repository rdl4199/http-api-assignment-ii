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

  //Check if eiter is not initialized
  if (!body.name || !body.age) {
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
  users[body.name].age = body.age;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};
const parseBody = (request, response, handler = addUser) => {
  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    handler(request, response, bodyParams);
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
