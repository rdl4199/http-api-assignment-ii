import { dragInit } from "./draggable";

  const handleResponse = async (response, parseResponse) => {
    const content = document.querySelector('#content');

    switch (response.status) {
      case 200:
        content.innerHTML = `<b>Success</b>`;
        break;
      case 201:
        content.innerHTML = `<b>Created</b>`;
        break;
      case 204:
        content.innerHTML = `<b>Updated(No Content)</b>`;
        break;
      case 400:
        content.innerHTML = `<b>Bad Request</b>`;
        break;
      case 404:
        content.innerHTML = `<b>Resource Not Found</b>`;
        break;
      default:
        content.innerHTML = `Error code not implemented by client.`;
        break;
    }

    if (parseResponse) {
      let obj = await response.json();

      let jsonString = JSON.stringify(obj);

      content.innerHTML += `<p>${jsonString}</p>`;

      if (obj.message) {
        content.innerHTML = `<p>${obj.id}</p>`;
        content.innerHTML += `<p>${obj.message}</p>`;
      }
    }
    else if (response.status == 201 || response.status == 204) {
      content.innerHTML += `<p>Metadata recieved</p>`;
    }
    else if (response.status == 400) {
      content.innerHTML = `<b>Bad Request</b>`;
    }
    else {
      content.innerHTML += `<p>Meta Data Received From Head Request</p>`;
    }
  };

  const requestUpdate = async (userForm) => {
    const url = userForm.querySelector('#urlField').value;
    const method = userForm.querySelector('#methodSelect').value;

    let response = await fetch(url, {
      method,
      headers: {
        'Accept': 'application/json'
      },
    });

    handleResponse(response, method === 'get')
  };

  //function to send post data back to our server
  const sendPost = async (nameForm) => {
    //Grab all the info from the form
    const nameAction = nameForm.getAttribute('action');
    const nameMethod = nameForm.getAttribute('method');

    const nameField = nameForm.querySelector('#nameField');
    const ageField = nameForm.querySelector('#ageField');

    //Build a data string in the FORM-URLENCODED format.
    const formData = `name=${nameField.value}&age=${ageField.value}`;

    //Make a fetch request and await a response. Set the method to
    //the one provided by the form (POST). Set the headers. Content-Type
    //is the type of data we are sending. Accept is the data we would like
    //in response. Then add our FORM-URLENCODED string as the body of the request.
    let response = await fetch(nameAction, {
      //nameMethod will be post
      method: nameMethod,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      //body of this json object
      body: formData,
    });

    //Once we have a response, handle it.
    handleResponse(response);
  };

  async function fmJsonFetch() {
    let searchTerm = document.querySelector("#search").value;
    let url = `https://ws.audioscrobbler.com/2.0/?method=album.search&album=Believer&api_key=9c9b7047bdf5b232701d0f2567bfb81a&format=json`
    let contentString = ""
    fetch(url)
      .then(response => {
        if (response.ok) {
          // console.log(response.json());
          return response.json();
        }
      })
      .then(json => {
        console.log(json.results.albummatches.album);

        for (let x = 0; x < json.results.albummatches.album.length; x++) {
          contentString += `<div class="searchResult draggable" draggable="true" style="background-image: url(${json.results.albummatches.album[x].image[3]['#text']}); width: 130px; height: 130px; background-size: contain;
background-repeat: no-repeat;">
                            </div>`;
          console.log(json.results.albummatches.album[x].image[3]['#text'])
        }
        document.querySelector(".searchContent").innerHTML = contentString;
        dragInit()
      })

    console.log("Happens");
  }

  const init = () => {
    //  const userForm = document.querySelector('#userForm');
    //  const nameForm = document.querySelector('#nameForm');

    document.querySelector("#search").onclick = fmJsonFetch

    const getUsers = (e) => {
      e.preventDefault();
      requestUpdate(userForm);
      return false;
    }

    const addUser = (e) => {
      e.preventDefault();
      sendPost(nameForm);
      return false;
    }

    fmJsonFetch("believer")
    dragInit()

    //nameForm.addEventListener('submit', addUser);

    //userForm.addEventListener('submit', getUsers);
  };

  window.onload = init;