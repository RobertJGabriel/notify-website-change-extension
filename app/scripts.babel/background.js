/**
 * Helper to send an AJAX request.
 * @param  {} url
 * @param  {} callback
 */
function sendAjaxRequest(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      callback(xhr.responseText);
    }
  };
  xhr.open('GET', url, true);
  xhr.send();
}

/**
 * Server procedure for content script.
 * Receives a request containing two parameters:
 * method:
 *    'lookup' for a Dictionary lookup.
 *    'audio' to look up the URL of a given Wikimedia audio file.
 * @param  {} request
 * @param  {} sender
 * @param  {} callback
 */
function init() {

  // Load the data if needed
  chrome.storage.sync.get('storedData', item => {
    const textarea = item.storedData;

    if (textarea === null || textarea === undefined) {
      return false;
    }

    const txtArray = textarea.split('\n');

    for (const URL of txtArray) {
      if (isUrlValid(URL)) {
        let lookupURL = `https://intense-plains-75758.herokuapp.com/router?url=${URL}`;
        sendAjaxRequest(lookupURL, resp => {
          let lastMod = resp.message;
          popup(URL);
        });
      }
    }
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
    title: title,
    message: `${title} has been updated`,
    iconUrl: chrome.runtime.getURL('images/icon-128.png'),
    requireInteraction: true
  };

  let id;



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
setInterval(init, 5 * 60 * 100);