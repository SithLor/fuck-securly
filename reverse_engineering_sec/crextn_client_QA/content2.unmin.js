var port = chrome.runtime.connect({
    name: "gmaps"
}), prevUrl = document.location.href, prevTitle = document.title.toString(), title = document.querySelector("title"), observer = new MutationObserver(function(e) {
    e.some(function(e) {
        var t = e.target.textContent.toString();
        if ((t = (t = t.replace(/^\([0-9]{0,}\)\s/, "")).replace(/ +/g, " ")) != prevTitle) return prevTitle = t, fetchURL(), !0;
    });
});
function sendData(e) {
    e != prevUrl && (prevUrl = document.location.href, port.postMessage({
        action: "MapsURL",
        url: e
    }));
}
async function fetchURL() {
    await sleep(2e3), sendData(document.location.href);
}
function sleep(e) {
    return new Promise((t)=>setTimeout(t, e));
}
observer.observe(title, {
    subtree: !1,
    characterData: !0,
    childList: !0
});
