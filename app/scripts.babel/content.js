/**
 * @param  {} name
 * @param  {} url
 */
function getParameter(name, url) {
  if (!url) url = location.href;
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(url);
  return results == null ? null : results[1];
}
/**
 * Display a base64 URL inside an iframe in another window.
 */
function debugBase64(base64URL) {
  var win = window.open();
  win.document.write('<iframe src="' + base64URL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
}


/**
 * Difference the htmls and create a popup with the new html
 */
function loadEvent() {

  const CURRENT_URL = window.location.href.replace(/ /g, '');
  let newHTML;

  let parameter = getParameter('updated');

  if (parseInt(parameter) === 1) {
    newHTML = document.getElementsByTagName('html')[0].innerHTML; // Get the current html

    // Get images from the 
    chrome.extension.sendMessage({
      'website': CURRENT_URL,
      'newHTML': JSON.stringify(newHTML)
    }, function (url) {

      if (url === null || url === undefined || url === '') return false;
      var data = "data:text/html," + encodeURIComponent(newHTML);
      debugBase64(data);

    });

  }
}


loadEvent(); // Run the load event on the insert.