var port = chrome.runtime.connect({
    name: "proxyDetection"
});
let triggeredIdentification = !1, proxyConfig = void 0;
async function onWindowLoad() {
    port.postMessage({
        action: "identifyProxy"
    });
}
function IdentifyProxy(t) {
    t.featureFlag && !document.location.origin.includes("securly.com") && (executeScriptWithInterval(()=>findProxy(document, t), 7, 3e3), executeScriptWithInterval(()=>identifyProxyByContent(document, t), 5, 2e3));
}
function findProxy(t, e) {
    const n = e.proxyData;
    for (const e of n){
        let n = !0;
        for (const o of e.targetElements){
            const e = t.querySelector(o.target);
            let r;
            if (!e) {
                n = !1;
                break;
            }
            if (!(r = o.content ? o && o.substringMatch ? e.textContent && e.textContent.includes(o.content) : e.textContent === o.content : !!e)) {
                n = !1;
                break;
            }
        }
        if (n) return e;
    }
}
port.onMessage.addListener(function(t) {
    proxyConfig = t.proxyConfig, triggeredIdentification || (triggeredIdentification = !0, IdentifyProxy(t.proxyConfig));
});
const identifyProxyByContent = (t, e)=>{
    if (!e.targetSiteContent.targetElements) return;
    const n = e.targetSiteContent.targetElements, o = scanDocumentForProxy(n, t);
    return o || void 0;
}, scanDocumentForProxy = (t, e)=>{
    if (t && e) for (const n of t){
        let t = !0;
        for (const o of n.rules){
            const n = e.querySelector(o.targetElement);
            if (!n || n && o.value && n[o.keyName] !== o.value) {
                t = !1;
                break;
            }
        }
        if (t && !document.location.origin.includes(n.domainName)) return foundProxyContent = n, n;
    }
}, executeScriptWithInterval = (t, e, n)=>{
    let o = 0, r = void 0;
    const i = setInterval(()=>{
        if (r) return clearInterval(i), void chrome.runtime.sendMessage({
            type: "proxyIdentified",
            proxyUrl: document.location.origin,
            ...r
        }, function(t) {});
        o >= e ? clearInterval(i) : (o++, r = t());
    }, n);
};
window.addEventListener ? window.addEventListener("load", onWindowLoad, !1) : window.attachEvent && window.attachEvent("onload", onWindowLoad);
