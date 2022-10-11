const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);
const onHandler = fs.readFileSync(`${__dirname}/../src/onloadHandler.js`);
const draggable = fs.readFileSync(`${__dirname}/../src/draggable.js`);

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

const getOnload = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/javascript' });
  response.write(onHandler);
  response.end();
};

const getDraggable = (reuqest, response) => {
  response.writeHead(200, { 'Content-Type' : 'application/javascript'});
  response.write(draggable);
  response.end();
}
module.exports = {
  getIndex,
  getCSS,
  getOnload,
  getDraggable,
};