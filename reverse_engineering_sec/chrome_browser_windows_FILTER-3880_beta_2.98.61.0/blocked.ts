function setInfo() {
    try {
        var site = new URLSearchParams(window.location.search).get("site");
        var category = new URLSearchParams(window.location.search).get("category");
        var categoryElem = document.getElementById("category");
        var siteElem = document.getElementById("site");
        categoryElem.innerHTML = escapeHTML(atob(category));
        siteElem.innerHTML = escapeHTML(atob(site));
    } catch (err) {}
}
const escapeHTML = (str)=>{
    const p = document.createElement("p");
    const textNode = document.createTextNode(str);
    p.appendChild(textNode);
    return p.innerHTML;
};
document.addEventListener("DOMContentLoaded", function(event) {
    setInfo();
});
