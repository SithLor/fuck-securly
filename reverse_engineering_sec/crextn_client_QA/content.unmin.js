var port = chrome.runtime.connect({
    name: "yt"
});

//!0 = true
// !1 = false 
const FALSE = !1;
const TRUE = !0;
delcare const NOT_FOUND_INDEX = -1;

function onWindowLoad() {
    window.onscroll = function() {
        onWindowScroll();
    }, window.youtubeLastCheck = null, sendOptionsRequest();
    //check if the page is embedded TYPE:BOOLEAN
    let isEmbed = document.documentElement.innerHTML.indexOf("ytp-embed") >= 0;
    if (isEmbed) {
        let video_id_from_html = null;
        let channelIdFromHtml = null; 
        //regex to get video id
        let video_id = /\/watch\?v=([a-zA-Z0-9-_]{1,})">/;
        let videoIdMatchResult = document.documentElement.innerHTML.match(video_id);
        2 == videoIdMatchResult.length && (video_id_from_html = videoIdMatchResult[1]);
        let i = /\/channel\/([a-zA-Z0-9-_]{1,})"/;
        2 == (videoIdMatchResult = document.documentElement.innerHTML.match(i)).length && (channelIdFromHtml = videoIdMatchResult[1]);
        let youtubeVideoInfo = {
            channelId: channelIdFromHtml,
            videoId: video_id_from_html,
            category: null,
            embedded: isEmbed
        };
        if (null != youtubeVideoInfo.channelId || null != youtubeVideoInfo.videoId) {
            return sendData(youtubeVideoInfo), TRUE
        }
    }
    if (NOT_FOUND_INDEX == document.documentElement.innerHTML.indexOf('window["ytInitialPlayerResponse"] = null')) {
        sendData(fetchPageInfo(TRUE, document.documentElement.innerHTML));
    }
    if (document.documentElement.innerHTML.indexOf('itemprop="channelId"') > -1) {
        sendData(fetchPageInfo(FALSE));
    }
    var n = document.title.toString();
    let t = document.querySelector("title");
    (new MutationObserver(function(e) {
        e.some(function(e) {
            var t = e.target.textContent.toString();
            if ((t = (t = t.replace(/^\([0-9]{0,}\)\s/, "")).replace(/ +/g, " ")) != n) return n = t, -1 == document.URL.indexOf("results?search_query") && location.reload(), !0;
        });
    }).observe(t, {
        subtree: !0,
        characterData: !0,
        childList: !0
    }), null != document.querySelector("ytd-browse")) && (window.ytdBrowse = document.querySelector("ytd-browse"), window.lastUpdateBrowse = null, new MutationObserver(function(e) {
        e.some(function() {
            if (null == window.lastUpdateBrowse || Math.floor(Date.now() / 1e3) - window.lastUpdateBrowse > 5) {
                return window.lastUpdateBrowse = Math.floor(Date.now() / 1e3), sendData(fetchPageInfo(FALSE)), processActions(window.lastResponse), !0;
            }
        });
    }).observe(ytdBrowse, {
        subtree: !0,
        characterData: !0,
        childList: !0
    }));
}
function fetchPageInfo(e, n = "") {
    if (e) {
        let e = n.indexOf("var ytInitialPlayerResponse = ") + 30, i = n.indexOf("};", e) + 1 - e;
        var t = null, o = null, d = null;
        let l = n.indexOf("ytp-embed") >= 0;
        try {
            let l = JSON.parse(n.substr(e, i));
            t = l.videoDetails.channelId, o = l.videoDetails.videoId, d = l.microformat.playerMicroformatRenderer.category;
        } catch (e) {}
        return {
            channelId: t,
            videoId: o,
            category: d,
            embedded: l
        };
    }
    if (!1 === e && null != document.querySelector("meta[itemprop='channelId']")) {
        return {
            channelId: document.querySelector("meta[itemprop='channelId']").getAttribute("content"),
            videoId: null,
            category: null,
            embedded: n.indexOf("ytp-embed") >= 0
        };
    }
}
function sendData(e) {
    port.postMessage({
        action: "getSourceYoutube",
        channelId: e.channelId,
        videoId: e.videoId,
        category: e.category,
        embedded: e.embedded
    });
}
function sendOptionsRequest() {
    port.postMessage({
        action: "getYoutubeOptions"
    });
}
function processActions(e) {
    window.lastResponse != e && (window.lastResponse = e), e.hideComments && hideComment(), e.hideThumbnails && hideThumbnails(), e.hideSidebar && hideSidebar(), e.hideRecommended && hideRecommended(), void 0 !== e.action && "deny" === e.action && (self.location = e.url);
}
function hideComment() {
    null !== document.querySelector("ytd-comments") && document.querySelector("ytd-comments").remove();
}
function hideThumbnails() {
    [...document.querySelectorAll("ytd-thumbnail")].
    forEach((elements)=>{
            elements.remove();
    }),

    [...document.querySelectorAll("ytd-playlist-thumbnail")].
    forEach((e)=>{
        e.remove();
    });
}
function hideSidebar() {
    null !== document.querySelector("div[id='related']") && document.querySelector("div[id='related']").remove();
}
function hideRecommended() {}
function onWindowScroll() {
    processActions(window.lastResponse);
}
function callWindowLoadWithTimeOut() {
    setTimeout(onWindowLoad, 2000);
}
port.onMessage.addListener(function(e) {
    processActions(e);
}), window.lastResponse = null, window.youtubeLastCheck = null, window.addEventListener ? window.addEventListener("load", callWindowLoadWithTimeOut, !1) : window.attachEvent && window.attachEvent("onload", callWindowLoadWithTimeOut);
