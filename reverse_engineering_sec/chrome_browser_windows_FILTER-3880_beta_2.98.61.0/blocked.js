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
    const p = document.createElement("p");
    p.appendChild(document.createTextNode(str));
    return p.innerHTML;
  }

 document.addEventListener("DOMContentLoaded", function(event) {
      setInfo();
  });