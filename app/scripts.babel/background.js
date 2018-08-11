/**
 * Helper to send an AJAX request.
 * @param  {} url
 * @param  {} callback
 */
function sendAjaxRequest(url, callback) {
  var promiseObj = new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.send();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log('xhr done successfully');
          var resp = xhr.responseText;
          var respJson = JSON.parse(resp);
          resolve(respJson);
        } else {
          reject(xhr.status);
          console.log('xhr failed');
        }
      } else {
        console.log('xhr processing going on');
      }
    }
    console.log('request sent succesfully');
  });
  return promiseObj;
}
/**
 */
function init() {
  const backendAPI = `https://intense-plains-75758.herokuapp.com`; // Replace this with your own backend
  // Load the data if needed
  chrome.storage.sync.get('storedData', item => {
    const textarea = item.storedData;

    // If the text area is empty
    if (textarea === null || textarea === undefined || textarea.trim() === '') {
      return false;
    }
    const txtArray = textarea.split('\n');
    let promises = [];
    for (const URL of txtArray) {
      if (isUrlValid(URL)) {
        let lookupURL = `${backendAPI}/router?url=${URL}?updated=1`;
        promises.push(sendAjaxRequest(lookupURL));
      }
    }

    processData(promises);

  });

}

/**
 * @param  {} promises
 */
function processData(promises) {
  Promise.all(promises)
    .then(responseList => {
      for (const response of responseList) {
        let size = parseInt(response.length);
        let oldHTML = response.html;
        let websiteURL = `${response.URL}`.replace(/ /g, '');

        // Check we get all the json assets needed
        if ((size === null || size === undefined || size === 0) || (websiteURL === null || websiteURL === undefined || websiteURL === '')) {
          return false;
        }

        // Check the localstorage item if its there
        let lastSize = localStorage.getItem(websiteURL);

        // If there is not data stored in the localstorage
        if (lastSize === null || lastSize === undefined) {

          // Create an object
          const object = {
            'size': size,
            'url': websiteURL,
            'oldHTML': oldHTML
          };

          // Store it in the localstorage
          localStorage.setItem(websiteURL, JSON.stringify(object));
        }

        //Get the localstoage.
        lastSize = localStorage.getItem(websiteURL);
        lastSize = JSON.parse(lastSize).size; // Parse the data

        // If the data is different
        if (size !== parseInt(lastSize)) {

          // Update with new information.
          const object = {
            'size': size,
            'url': websiteURL,
            'oldHTML': oldHTML
          }
          localStorage.setItem(websiteURL, JSON.stringify(object));
          popup(websiteURL);
        }
      }
    });
}


/**
 * @param  {} userInput
 */
function isUrlValid(userInput) {
  const res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  if (res == null)
    return false;
  else
    return true;
}

/**
 * Create the popup
 * @param  {} title
 */
function popup(title) {

  const opt = {
    type: 'basic',
    title: 'New Update',
    message: `${title} has been updated`,
    iconUrl: chrome.runtime.getURL('images/icon-128.png'),
    requireInteraction: true
  };
  chrome.notifications.create(title, opt);
}

// create a on Click listener for notifications
chrome.notifications.onClicked.addListener(onClick);

/**
 * @param  {} function(request
 * @param  {} sender
 * @param  {} sendResponse
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.website !== null || request.website !== undefined) {
    if (request.newHTML !== null || request.newHTML !== undefined) {

      // Get original Html
      let object = JSON.parse(localStorage.getItem(request.website));
      let originalHTML = object.oldHTML;


      let differentHTML = htmldiff(originalHTML.replace(/\\n/g, '').replace(/\\t/g, ''), request.newHTML.replace(/\\n/g, '').replace(/\\t/g, '')); // Diff HTML strings
    

      sendResponse(differentHTML);
    }
  }

});

/**
 * @param  {} title
 */
function onClick(url) {
  chrome.notifications.clear(url);
  chrome.tabs.create({
    url: url
  });
}

/**
 * @param  {} init
 * @param  {} 5*60*100
 */
setInterval(init, 5 * 60 * 100);