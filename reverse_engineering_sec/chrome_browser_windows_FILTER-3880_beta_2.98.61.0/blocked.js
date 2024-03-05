function setInfo() {
    try {
    var site = new URLSearchParams(window.location.search).get("site");
    var category =  new URLSearchParams(window.location.search).get("category");
    var categoryElem = document.getElementById("category");
    var siteElem = document.getElementById("site");
    categoryElem.innerHTML = escapeHTML(atob(category));
    siteElem.innerHTML = escapeHTML(atob(site));
    } catch(err) {
        //Do nothing. This is for suppressing javascript errors.
    }
}

const escapeHTML = (str) => {
    // Create a new <p> element
    const p = document.createElement("p");

    // Create a new text node with the input string
    // This ensures that any HTML special characters in the string are not interpreted as HTML
    const textNode = document.createTextNode(str);

    // Append the text node to the <p> element
    p.appendChild(textNode);

    // Return the HTML content of the <p> element
    // This will be the input string, but any HTML special characters will have been converted to their corresponding HTML entities
    return p.innerHTML;
}

 document.addEventListener("DOMContentLoaded", function(event) {
      setInfo();
  });