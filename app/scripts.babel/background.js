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

function init() {
  const backendAPI = `https://intense-plains-75758.herokuapp.com`; // Replace this with your own backend
  // Load the data if needed
  chrome.storage.sync.get('storedData', item => {
    const textarea = item.storedData;

    if (textarea === null || textarea === undefined) {
      return false;
    }

    const txtArray = textarea.split('\n');
    let promises = [];
    for (const URL of txtArray) {
      if (isUrlValid(URL)) {
        let lookupURL = `${backendAPI}/router?url=${URL}`;
        promises.push(sendAjaxRequest(lookupURL));
      }
    }

    Promise.all(promises)
      .then(responseList => {
        for (const response of responseList) {
          let size = parseInt(response.length);
          let websiteURL = response.URL;
          if ((size === null || size === undefined || size === 0) || (websiteURL === null || websiteURL === undefined || websiteURL === '')) {
            return false;
          }
          let lastSize = localStorage.getItem(websiteURL);
          if (lastSize === null || lastSize === undefined) {
            localStorage.setItem(websiteURL, size);
            lastSize = localStorage.getItem('URL');
          }
          if (size !== parseInt(lastSize)) {
            popup(websiteURL);
          }else{
            console.log(websiteURL);
          }
        }
      });
  });

}

function isUrlValid(userInput) {
  const res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  if (res == null)
    return false;
  else
    return true;
}

/**
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

function onClick(title) {
  chrome.notifications.clear(title);
  chrome.tabs.create({
    url: title
  });
}
setInterval(init, 5 * 60 * 1000);