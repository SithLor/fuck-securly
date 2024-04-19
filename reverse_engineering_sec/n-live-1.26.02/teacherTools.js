"use strict";
const e = "getChatMessages",
  t = "respondToShareScreen",
  n = "sendMessage",
  a = "teacherMessage",
  o = "clearTabsCloseWarning",
  s = "action",
  l = "announce",
  i = "announceTitle",
  d = "chat",
  c = "forceOpenChat",
  r = "forceCloseChat",
  m = "chatMessages",
  p = "tabsCloseWarning",
  g = "command",
  y = "lock",
  u = "chatMessage",
  h = "date",
  f = "isFromTeacher",
  v = "teacherName",
  M = "text",
  x = "tabCloseWarning",
  w = "delaySeconds",
  E = "chatStatus",
  L = "lockStatus",
  C = "requestShareScreen",
  b = ["kidsa-z.com/main/Login"];
let S = !1,
  B = !1,
  A = 0;
var I = null;
function k(e) {
  -1 !== e.indexOf(y) &&
    ((document.getElementById("blocked_message").innerHTML = ""),
    (document.getElementById("tpScreenLockCover").style.display = "none")),
    -1 !== e.indexOf(l) &&
      -1 !== e.indexOf(p) &&
      ((document.getElementById("tpAnnouncementMessage").innerHTML = ""),
      (document.getElementById("tpAnnouncementCover").style.display = "none"));
}
async function T(e, t) {
  if (null !== document.getElementById(e)) return Promise.resolve();
  let n = await H(t);
  const a = document.createElement("style");
  (a.textContent = n),
    (a.id = e),
    document.getElementsByTagName("head")[0].appendChild(a),
    console.log("CSS " + e + " injected");
}
async function Z(e, t) {
  if (null !== document.getElementById(e)) return Promise.resolve();
  let n = await H(t),
    a = document.createElement("div");
  for (a.innerHTML = n; a.children.length > 0; )
    document.body.appendChild(a.children[0]);
  console.log("HTML " + e + " injected"), (I = new G());
}
function H(e) {
  const t = chrome.runtime.getURL(e);
  return new Promise(function (n, a) {
    const o = new XMLHttpRequest();
    console.log("Load from: " + e),
      o.open("GET", t, !0),
      (o.onreadystatechange = function () {
        o.readyState === XMLHttpRequest.DONE &&
          200 === o.status &&
          n(o.responseText);
      }),
      (o.onerror = function () {
        a("Cannot load file");
      }),
      o.send();
  });
}
function q(e, t) {
  document.getElementById(e).src = chrome.runtime.getURL(t);
}
function O() {
  (document.getElementById("tpMsgTable").style.display = "none"),
    (document.getElementById("tpConfirmTable").style.display = "table"),
    (document.getElementById("tpAnnouncementCover").style.display = "flex"),
    (document.getElementById("tpRequestConfimTitle").innerHTML =
      "Requesting screen sharing"),
    (document.getElementById("tpRequestConfimMessage").innerHTML =
      "Your teacher wants to share your screen<br/>Click OK to continue, or cancel to deny the request"),
    (document.getElementById("tpAgreeButton").innerHTML = "OK"),
    (document.getElementById("tpRejectButton").innerHTML = "Cancel");
}
function z() {
  let e;
  return (
    window.matchMedia &&
      (e = window.matchMedia(
        "only screen and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)"
      )),
    (e && e.matches) || window.devicePixelRatio > 1
  );
}
function P(e) {
  return "All tabs will close in " + e + " seconds";
}
function j() {
  const e = document.getElementById("tpText");
  e.value.trim().length > 0 &&
    (chrome.runtime.sendMessage({ [g]: n, [s]: d, [M]: e.value }),
    W(e.value, !1, "You", new Date().toUTCString()),
    (e.value = ""));
}
function D(e, n) {
  chrome.runtime.sendMessage({
    [s]: t,
    isConfirmed: e,
    deviceId: n.deviceId,
    userId: n.userId,
    lock: n.lock,
  });
}
function V(e) {
  (13 !== e.keyCode && 3 !== e.keyCode) || (e.preventDefault(), j());
}
function R() {
  const t = { [s]: d, [g]: e };
  chrome.runtime.sendMessage(t, (e) => {
    console.log("Response=" + JSON.stringify(e)), X(e[m]), _();
  });
}
function N() {
  return document.getElementById("chatPanel").classList.contains("visible");
}
function _() {
  document.getElementById("chatPanel").classList.remove("toHidden"),
    document.getElementById("chatPanel").classList.toggle("visible", !0),
    document.getElementsByTagName("body")[0].classList.toggle("noOverflow", !0);
}
function U() {
  document.getElementById("chatPanel").classList.toggle("toHidden", !0),
    document.getElementById("chatPanel").classList.toggle("visible", !1),
    document.getElementsByTagName("body")[0].classList.toggle("noOverflow", !1);
}
function W(e, t, n, a) {
  (n && 0 !== n.length) || (n = "Super admin");
  let o =
    '<div class="group"><div class="messageDetails @receiver@"><span class="messageDetails-name">@name@</span><span class="messageTime">@time@</span></div><div class="message @receiver@">@text@</div></div>';
  (o = (o = (o = (o = t
    ? o.replace(/@receiver@/g, "toMe")
    : o.replace(/@receiver@/g, "mine")).replace("@time@", Y(a))).replace(
    "@text@",
    K(J(e))
  )).replace("@name@", n)),
    document.getElementById("tpMessageList").insertAdjacentHTML("beforeend", o),
    F();
}
function J(e) {
  return e
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
function K(e) {
  let t = e;
  return (t = t.replace(
    /((https|http):\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,63}\b([-a-zA-Z0-9()@:%_+.~#?&\/=]*)/g,
    function (e) {
      return '<a href="' + e + '" target="_blank">' + e + "</a>";
    }
  ));
}
function Y(e) {
  const t = new Date(e),
    n =
      0 === t.getHours() ? 0 : t.getHours() % 12 == 0 ? 12 : t.getHours() % 12;
  return (
    (n < 10 ? "0" + n.toString() : n.toString()) +
    ":" +
    (t.getMinutes() < 10
      ? "0" + t.getMinutes().toString()
      : t.getMinutes().toString()) +
    ":" +
    (t.getSeconds() < 10
      ? "0" + t.getSeconds().toString()
      : t.getSeconds().toString()) +
    (t.getHours() - 12 < 0 ? " AM" : " PM")
  );
}
function X(e) {
  console.log("Load messages=" + JSON.stringify(e));
  const t = document.getElementById("tpMessageList");
  for (; t.firstChild; ) t.removeChild(t.firstChild);
  e.forEach((e) => W(e[M], e[f], e[f] ? e[v] : "You", e[h])), F();
}
function F() {
  const e = document.getElementById("tpMessageList");
  e.scrollTop = e.scrollHeight;
}
chrome.runtime.onMessage.addListener(function (e, t, n) {
  for (const e of b) if (-1 !== window.location.href.indexOf(e)) return;
  return (
    console.log("Message: " + JSON.stringify(e)),
    T("tpIcofont", "icofont.css")
      .then(() => T("tpScreenLockCss", "blocking/screenlock.css"))
      .then(() => Z("tpScreenLockCover", "blocking/screenlock.html"))
      .then(() => {
        if (e[g] === L) {
          const t = [l, y, p];
          Object.keys(e).forEach((n) => {
            const a = t.indexOf(n);
            -1 !== a && null !== e[n] && t.splice(a, 1);
          }),
            k(t);
        }
        q(
          "tp_blk_icon",
          z() ? "blocking/exclamation@2x.png" : "blocking/exclamation.png"
        ),
          (document.getElementById("tpCloseBtn").onclick = U);
        const t = e[l];
        if ("string" == typeof t) {
          const n = { timeStyle: "short", hour12: !0 },
            a = new Date().toLocaleTimeString("en-US", n);
          (document.getElementById("tpMsgTable").style.display = "table"),
            (document.getElementById("tpConfirmTable").style.display = "none"),
            (document.getElementById("tpAnnouncementMessage").innerHTML =
              a + ": " + J(t)),
            (document.getElementById("tpPopupTitle").innerHTML =
              e.announceTitle),
            (document.getElementById("tpAnnouncementCover").style.display =
              "flex"),
            (document.getElementById("tpOkButton").onclick = function () {
              console.log("Click OK button"),
                chrome.runtime.sendMessage({ [s]: "teacherMessage" });
            });
        }
        const a = e[y];
        if (
          ("string" == typeof a &&
            ((document.getElementById("tpMsgTable").style.display = "table"),
            (document.getElementById("tpConfirmTable").style.display = "none"),
            (document.getElementById("blocked_message").innerHTML = a),
            (document.getElementById("tpScreenLockCover").style.display =
              "flex")),
          e[g] === E)
        )
          if (e[d]) {
            S ||
              ((B = !0),
              (document.getElementById("tpSendButton").onclick = j),
              (document.getElementById("tpText").onkeyup = V),
              (S = !0));
            const t = e.chatMessage,
              n = !!e.forceCloseChat,
              a = !!e.forceOpenChat;
            n && N()
              ? (console.log("Close chat"), U())
              : N()
              ? t && W(t[M], !0, t[v], t[h])
              : a && R();
          } else (B = !1), U(), hideChatIcon();
        if ("tabCloseWarning" === e[g]) {
          k([l, y]),
            (A = e.delaySeconds),
            (document.getElementById("tpMsgTable").style.display = "table"),
            (document.getElementById("tpConfirmTable").style.display = "none"),
            (document.getElementById("tpAnnouncementMessage").innerHTML = P(A)),
            (document.getElementById("tpAnnouncementCover").style.display =
              "flex");
          const t = setInterval(function () {
            (A -= 1) > 0
              ? (document.getElementById("tpAnnouncementMessage").innerHTML =
                  P(A))
              : clearInterval(t);
          }, 1e3);
          document.getElementById("tpOkButton").onclick = function () {
            clearInterval(t), chrome.runtime.sendMessage({ [s]: o });
          };
        }
        "requestShareScreen" === e[g] &&
          (k([l, y, p]),
          O(),
          (document.getElementById("tpAgreeButton").onclick = function () {
            D(!0, e);
          }),
          (document.getElementById("tpRejectButton").onclick = function () {
            D(!1, e);
          })),
          n({ status: "complete" });
      })
      .catch((e) => {
        console.log("LockScreen file load error: " + e.message),
          n({ status: "error" });
      }),
    !0
  );
}),
  console.log("Teacher tools injected");
class G {
  constructor() {
    this.initiate(), (this.stopClickEvent = !1);
  }
  initiate() {
    document
      .querySelectorAll(
        '[data-meteor-emoji="true"], [data-meteor-emoji-large="true"]'
      )
      .forEach((e) => {
        this.generateElements(e);
      });
  }
  generateElements(e) {
    const t = (t) => {
        var n = e.selectionStart;
        (e.value =
          e.value.substring(0, n) +
          " " +
          t.target.innerHTML +
          e.value.substring(n)),
          (o.style.display = "block");
      },
      n = (e) => {
        (this.stopClickEvent = !0), (o.style.display = "block");
        for (var t = o.querySelectorAll("ul"), n = 1, a = t.length; n < a; n++)
          t[n].style.display = "none";
        var s = o.querySelectorAll(".category div");
        for (n = 0, a = s.length; n < a; n++) s[n].style.background = "none";
        (o.querySelector("." + e.target.id).style.display = "block"),
          (o.querySelector("#" + e.target.id).style.background = "#c2c2c2");
      };
    e.style.width = "100%";
    const a = document.createElement("div");
    (a.style.position = "relative"),
      e.parentNode.replaceChild(a, e),
      a.appendChild(e);
    const o = document.createElement("div");
    (o.tabIndex = 0),
      o.classList.add("tpEmojiPicker"),
      e.hasAttribute("data-meteor-emoji-large")
        ? ((o.style.zIndex = "999"),
          (o.style.display = "block"),
          (o.style.width = "100%"),
          (o.style.marginBottom = "15px"))
        : ((o.style.position = "absolute"),
          (o.style.right = "0px"),
          (o.style.bottom = "80px"),
          (o.style.display = "none"),
          (o.style.width = "400px")),
      (o.style.zIndex = "999"),
      (o.style.overflow = "hidden"),
      (o.style.background = "#fff"),
      (o.style.borderRadius = "5px"),
      (o.style.boxShadow =
        "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)"),
      (o.style.borderRadius = "2px;"),
      (o.style.marginTop = "5px"),
      (o.style.outline = "none");
    const s = document.createElement("div");
    (s.style.position = "absolute"),
      (s.style.top = "20px"),
      (s.style.right = "10px"),
      (s.style.textDecoration = "none"),
      (s.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 12 14"><path fill="#637484" d="M8.9 8.4q-0.3 0.9-1.1 1.5t-1.8 0.6-1.8-0.6-1.1-1.5q-0.1-0.2 0-0.4t0.3-0.2q0.2-0.1 0.4 0t0.2 0.3q0.2 0.6 0.7 1t1.2 0.4 1.2-0.4 0.7-1q0.1-0.2 0.3-0.3t0.4 0 0.3 0.2 0 0.4zM5 5q0 0.4-0.3 0.7t-0.7 0.3-0.7-0.3-0.3-0.7 0.3-0.7 0.7-0.3 0.7 0.3 0.3 0.7zM9 5q0 0.4-0.3 0.7t-0.7 0.3-0.7-0.3-0.3-0.7 0.3-0.7 0.7-0.3 0.7 0.3 0.3 0.7zM11 7q0-1-0.4-1.9t-1.1-1.6-1.6-1.1-1.9-0.4-1.9 0.4-1.6 1.1-1.1 1.6-0.4 1.9 0.4 1.9 1.1 1.6 1.6 1.1 1.9 0.4 1.9-0.4 1.6-1.1 1.1-1.6 0.4-1.9zM12 7q0 1.6-0.8 3t-2.2 2.2-3 0.8-3-0.8-2.2-2.2-0.8-3 0.8-3 2.2-2.2 3-0.8 3 0.8 2.2 2.2 0.8 3z"/></svg>'),
      (s.onclick = () => {
        "none" === o.style.display
          ? (o.style.display = "block")
          : "block" === o.style.display && (o.style.display = "none"),
          o.focus();
      }),
      e.hasAttribute("data-meteor-emoji-large") || a.appendChild(s);
    const l = document.createElement("ul");
    (l.style.padding = "10px 0px"),
      (l.style.margin = "0"),
      (l.style.listStyle = "none"),
      (l.style.textAlign = "left"),
      (l.style.marginLeft = "3%"),
      l.classList.add("faces");
    const i = document.createElement("ul");
    (i.style.padding = "10px 0px"),
      (i.style.margin = "0"),
      (i.style.listStyle = "none"),
      (i.style.textAlign = "left"),
      (i.style.marginLeft = "3%"),
      i.classList.add("animals"),
      (i.style.display = "none");
    const d = document.createElement("ul");
    (d.style.padding = "10px 0px"),
      (d.style.margin = "0"),
      (d.style.listStyle = "none"),
      (d.style.textAlign = "left"),
      (d.style.marginLeft = "3%"),
      d.classList.add("food"),
      (d.style.display = "none");
    const c = document.createElement("ul");
    (c.style.padding = "10px 0px"),
      (c.style.margin = "0"),
      (c.style.listStyle = "none"),
      (c.style.textAlign = "left"),
      (c.style.marginLeft = "3%"),
      c.classList.add("sport"),
      (c.style.display = "none");
    const r = document.createElement("ul");
    (r.style.padding = "10px 0px"),
      (r.style.margin = "0"),
      (r.style.listStyle = "none"),
      (r.style.textAlign = "left"),
      (r.style.marginLeft = "3%"),
      r.classList.add("transport"),
      (r.style.display = "none");
    const m = document.createElement("ul");
    (m.style.padding = "10px 0px"),
      (m.style.margin = "0"),
      (m.style.listStyle = "none"),
      (m.style.textAlign = "left"),
      (m.style.marginLeft = "3%"),
      m.classList.add("objects"),
      (m.style.display = "none");
    const p = document.createElement("ul");
    (p.style.padding = "0px"),
      (p.style.margin = "0"),
      (p.style.display = "table"),
      (p.style.width = "100%"),
      (p.style.background = "#eff0f1"),
      (p.style.listStyle = "none"),
      p.classList.add("category");
    const g = new Array();
    g.push({
      name: "faces",
      svg: '<svg id="faces" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 150 150"><path id="faces" d="M74.34,128.48a53.5,53.5,0,1,1,37.84-15.67,53.16,53.16,0,0,1-37.84,15.67Zm0-97.89a44.4,44.4,0,1,0,31.4,13,44.07,44.07,0,0,0-31.4-13Z"/><path id="faces" d="M74.35,108A33.07,33.07,0,0,1,41.29,75a2.28,2.28,0,0,1,2.27-2.28h0A2.27,2.27,0,0,1,45.83,75a28.52,28.52,0,0,0,57,0,2.27,2.27,0,0,1,4.54,0A33.09,33.09,0,0,1,74.35,108Z"/><path id="faces" d="M58.84,62a6.81,6.81,0,1,0,6.81,6.81A6.81,6.81,0,0,0,58.84,62Z"/><path id="faces" d="M89.87,62a6.81,6.81,0,1,0,6.81,6.81A6.82,6.82,0,0,0,89.87,62Z"/></svg>',
    }),
      g.push({
        name: "animals",
        svg: '<svg id="animals" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 150 150"><path id="animals" d="M59.9,91.75h0c-22.46,0-41.82-19.34-44.09-44A52.1,52.1,0,0,1,16,36.8a4.51,4.51,0,0,1,2.63-3.62,39.79,39.79,0,0,1,12.74-3.37c23.92-2.15,45.35,17.83,47.74,43.86a52.77,52.77,0,0,1-.15,10.93,4.56,4.56,0,0,1-2.64,3.62,39.67,39.67,0,0,1-12.73,3.36c-1.23.11-2.45.17-3.66.17ZM24.76,40.49a41.29,41.29,0,0,0,.09,6.4C26.7,67,42.09,82.66,59.9,82.67h0c.94,0,1.88,0,2.83-.14a30.39,30.39,0,0,0,7.41-1.62,41.14,41.14,0,0,0-.11-6.4C68.09,53.38,51.11,37.08,32.17,38.86a30.78,30.78,0,0,0-7.41,1.63Z"/><path id="animals" d="M36.68,125.64a4.53,4.53,0,0,1-4.33-3.17,53.32,53.32,0,0,1-2.26-11A50.42,50.42,0,0,1,39.51,76.6c7.35-9.91,17.84-16,29.5-17,1.16-.11,2.33-.13,3.47-.13a4.54,4.54,0,0,1,4.33,3.16,51.59,51.59,0,0,1,2.27,11.08,50.39,50.39,0,0,1-9.42,34.8c-7.35,9.91-17.83,16-29.5,17a17.63,17.63,0,0,1-3.48.12ZM69.09,68.69A32.41,32.41,0,0,0,46.8,82a42.57,42.57,0,0,0-6.71,34.38,32.38,32.38,0,0,0,22.28-13.32A41.35,41.35,0,0,0,70,74.51a39.38,39.38,0,0,0-.94-5.82Z"/><path id="animals" d="M90.27,91.75c-1.22,0-2.43-.06-3.66-.17a39.67,39.67,0,0,1-12.73-3.36,4.57,4.57,0,0,1-2.64-3.61,53.38,53.38,0,0,1-.17-10.93c2.41-26,23.7-46.07,47.76-43.87a39.74,39.74,0,0,1,12.73,3.37,4.57,4.57,0,0,1,2.64,3.62,53.35,53.35,0,0,1,.16,10.92c-2.28,24.69-21.65,44-44.09,44ZM80,80.91a30.57,30.57,0,0,0,7.42,1.62c19.07,1.78,35.92-14.53,37.87-35.64a42.55,42.55,0,0,0,.1-6.4A30.86,30.86,0,0,0,118,38.86C99,37.07,82.06,53.38,80.12,74.51a43.91,43.91,0,0,0-.1,6.4Z"/><path id="animals" d="M113.49,125.64h0c-1.16,0-2.3,0-3.46-.12-23.9-2.21-41.36-25.47-38.94-51.85A53.52,53.52,0,0,1,73.34,62.6a4.55,4.55,0,0,1,4.33-3.16c1.16,0,2.34,0,3.51.13,11.64,1.07,22.11,7.12,29.48,17a50.51,50.51,0,0,1,9.42,34.81,53.51,53.51,0,0,1-2.26,11,4.54,4.54,0,0,1-4.33,3.19ZM81.08,68.69a42.53,42.53,0,0,0-1,5.82c-1.94,21.1,11.45,39.71,29.95,41.88A42.38,42.38,0,0,0,103.36,82,32.42,32.42,0,0,0,81.08,68.69Z"/><path id="animals" d="M75.08,45.45a7.83,7.83,0,1,0,7.83,7.83,7.83,7.83,0,0,0-7.83-7.83Z"/><path id="animals" d="M76.29,51.89a2.26,2.26,0,0,1-2.14-3A46,46,0,0,1,92.82,25.34a2.27,2.27,0,1,1,2.4,3.86A41.4,41.4,0,0,0,78.43,50.39a2.28,2.28,0,0,1-2.14,1.5Z"/><path id="animals" d="M73.87,51.89a2.28,2.28,0,0,1-2.14-1.5A41.35,41.35,0,0,0,54.94,29.2a2.27,2.27,0,0,1,2.39-3.86A46,46,0,0,1,76,48.85a2.28,2.28,0,0,1-1.37,2.91,2.31,2.31,0,0,1-.77.13Z"/></svg>',
      }),
      g.push({
        name: "food",
        svg: '<svg id="food" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 150 150"><path id="food" d="M104,20.76h.15c15.83.52,24.08,21.48,24.07,32.56.26,12.42-10.72,23.55-24,24.21a3.53,3.53,0,0,1-.46,0c-13.25-.66-24.23-11.8-24-24.3,0-11,8.26-31.95,24.07-32.47Zm0,47.69c8.25-.54,15.3-7.51,15.14-15,0-8.12-6.22-23.1-15.14-23.57-8.9.46-15.14,15.45-15.14,23.48-.14,7.61,6.9,14.59,15.14,15.13Z"/><path id="food" d="M97.19,69.21h.14a4.53,4.53,0,0,1,4.4,4.68l-1.48,46.92a1.59,1.59,0,0,0,.5,1.06,4.6,4.6,0,0,0,3.25,1.19h0a4.57,4.57,0,0,0,3.26-1.2,1.53,1.53,0,0,0,.49-1l-1.48-46.95a4.54,4.54,0,1,1,9.08-.28l1.47,46.91a10.42,10.42,0,0,1-3,7.65,13.65,13.65,0,0,1-9.81,4h0a13.58,13.58,0,0,1-9.79-4,10.42,10.42,0,0,1-3-7.67l1.48-46.89a4.53,4.53,0,0,1,4.53-4.4Z"/><path id="food" d="M41.84,69.21H42a4.53,4.53,0,0,1,4.4,4.68L44.9,120.81a1.57,1.57,0,0,0,.5,1.06,4.6,4.6,0,0,0,3.25,1.19h0a4.51,4.51,0,0,0,3.24-1.19,1.48,1.48,0,0,0,.5-1L50.93,73.89a4.53,4.53,0,0,1,4.39-4.68A4.4,4.4,0,0,1,60,73.61l1.48,46.91a10.49,10.49,0,0,1-3,7.66,13.57,13.57,0,0,1-9.78,4h0a13.59,13.59,0,0,1-9.78-4,10.48,10.48,0,0,1-3-7.67l1.48-46.9a4.54,4.54,0,0,1,4.54-4.4Z"/><path id="food" d="M28.59,20.76a4.54,4.54,0,0,1,4.54,4.54V51a15.52,15.52,0,0,0,31,0V25.3a4.55,4.55,0,0,1,9.09,0V51a24.61,24.61,0,1,1-49.21,0V25.3a4.54,4.54,0,0,1,4.54-4.54Z"/><path id="food" d="M55.34,20.76a4.54,4.54,0,0,1,4.54,4.54v19a4.54,4.54,0,1,1-9.08,0v-19a4.54,4.54,0,0,1,4.54-4.54Z"/><path id="food" d="M42,20.76a4.54,4.54,0,0,1,4.54,4.54v19a4.54,4.54,0,1,1-9.08,0v-19A4.54,4.54,0,0,1,42,20.76Z"/></svg>',
      }),
      g.push({
        name: "sport",
        svg: '<svg id="sport" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 150 150"><path id="sport" d="M75.35,130.24a53.49,53.49,0,1,1,53.48-53.49,53.55,53.55,0,0,1-53.48,53.49Zm0-97.89a44.41,44.41,0,1,0,44.4,44.4,44.1,44.1,0,0,0-44.4-44.4Z"/><path id="sport" d="M119.24,84.08A51.29,51.29,0,0,1,68,32.86a49.44,49.44,0,0,1,.26-5,2.26,2.26,0,0,1,2-2c1.66-.16,3.34-.25,5-.25a51.26,51.26,0,0,1,51.21,51.21c0,1.71-.09,3.38-.25,5a2.28,2.28,0,0,1-2,2c-1.65.16-3.33.25-5,.25ZM72.64,30.16c-.06.9-.08,1.79-.08,2.7a46.73,46.73,0,0,0,46.68,46.68q1.37,0,2.7-.09c.06-.89.08-1.79.08-2.7A46.72,46.72,0,0,0,75.35,30.08c-.91,0-1.82,0-2.71.08Z"/><path id="sport" d="M75.35,128A51.28,51.28,0,0,1,24.12,76.76c0-1.7.1-3.38.25-5a2.29,2.29,0,0,1,2-2c1.66-.16,3.33-.25,5.05-.25a51.27,51.27,0,0,1,51.21,51.22c0,1.69-.09,3.37-.25,5a2.27,2.27,0,0,1-2,2c-1.66.16-3.32.25-5,.25ZM28.75,74.05c-.05.9-.09,1.8-.09,2.71a46.74,46.74,0,0,0,46.69,46.67c.91,0,1.8,0,2.7-.08,0-.9.08-1.8.08-2.7A46.73,46.73,0,0,0,31.46,74c-.91,0-1.81,0-2.71.08Z"/><polygon id="sport" points="42.69 112.61 39.48 109.4 108 40.88 111.21 44.1 42.69 112.61 42.69 112.61"/></svg>',
      }),
      g.push({
        name: "transport",
        svg: '<svg id="transport" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 150 150"><path id="transport" d="M120.7,116H31a4.55,4.55,0,0,1-4.54-4.55V54.28A31.82,31.82,0,0,1,58.25,22.49h35.2a31.83,31.83,0,0,1,31.8,31.79v57.15A4.55,4.55,0,0,1,120.7,116Zm-85.16-9.09h80.62V54.28A22.74,22.74,0,0,0,93.45,31.57H58.25A22.74,22.74,0,0,0,35.54,54.28v52.61Z"/><path id="transport" d="M49.35,129.23c-8.53,0-13.62-2.77-13.62-7.41V115.6a4.54,4.54,0,1,1,9.08,0v4.06a21.32,21.32,0,0,0,9.09,0V115.6a4.54,4.54,0,0,1,9.08,0v6.22c0,4.64-5.09,7.41-13.63,7.41Z"/><path id="transport" d="M102.34,129.23c-8.53,0-13.62-2.77-13.62-7.41V115.6a4.54,4.54,0,0,1,9.08,0v4.06a21.28,21.28,0,0,0,9.08,0V115.6a4.55,4.55,0,0,1,9.09,0v6.22c0,4.64-5.09,7.41-13.63,7.41Z"/><path id="transport" d="M97.81,44.83H53.9a4.55,4.55,0,1,1,0-9.09H97.81a4.55,4.55,0,0,1,0,9.09Z"/><path id="transport" d="M54.28,84.2A6.8,6.8,0,1,0,61.07,91a6.8,6.8,0,0,0-6.79-6.8Z"/><path id="transport" d="M97.43,84.2a6.8,6.8,0,1,0,6.79,6.8,6.8,6.8,0,0,0-6.79-6.8Z"/><path id="transport" d="M107.08,81H44.63a6.82,6.82,0,0,1-6.82-6.82V54.28a6.82,6.82,0,0,1,6.82-6.81h62.45a6.82,6.82,0,0,1,6.81,6.81V74.15A6.83,6.83,0,0,1,107.08,81ZM44.63,52a2.28,2.28,0,0,0-2.28,2.27V74.15a2.28,2.28,0,0,0,2.28,2.27h62.45a2.27,2.27,0,0,0,2.27-2.27V54.28A2.27,2.27,0,0,0,107.08,52Z"/></svg>',
      }),
      g.push({
        name: "objects",
        svg: '<svg id="objects" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 150 150"><path id="objects" d="M107.78,129a4.55,4.55,0,0,1-2.67-.87l-30-21.79-30,21.79a4.53,4.53,0,0,1-5.34,0,4.58,4.58,0,0,1-1.65-5.08L49.59,87.82,19.6,66a4.54,4.54,0,0,1,2.67-8.22H59.34L70.8,22.55a4.55,4.55,0,0,1,8.64,0L90.89,57.81H128A4.54,4.54,0,0,1,130.63,66l-30,21.79,11.46,35.25a4.55,4.55,0,0,1-4.32,6ZM75.12,96.2a4.53,4.53,0,0,1,2.67.87l21.35,15.51L91,87.49a4.55,4.55,0,0,1,1.65-5.08L114,66.89H87.59a4.54,4.54,0,0,1-4.32-3.13l-8.15-25.1L67,63.76a4.53,4.53,0,0,1-4.32,3.13H36.25L57.61,82.41a4.54,4.54,0,0,1,1.65,5.08l-8.17,25.09L72.45,97.07a4.53,4.53,0,0,1,2.67-.87Z"/></svg>',
      });
    g.map((e) => {
      const t = document.createElement("div");
      (t.style.textDecoration = "none"),
        (t.style.padding = "5px"),
        (t.style.position = "initial"),
        (t.style.fontSize = "24px"),
        (t.style.display = "table-cell"),
        (t.style.textAlign = "center"),
        (t.id = String(e.name)),
        "faces" == String(e.name) && (t.style.background = "#c2c2c2"),
        (t.innerHTML = String(e.svg)),
        (t.onmousedown = n),
        p.appendChild(t);
    }),
      [
        128513, 128514, 128515, 128516, 128517, 128518, 128521, 128522, 128523,
        128524, 128525, 128527, 128530, 128531, 128532, 128534, 128536, 128538,
        128540, 128541, 128542, 128544, 128545, 128546, 128547, 128548, 128549,
        128552, 128553, 128554, 128555, 128557, 128560, 128561, 128562, 128563,
        128565, 128567,
      ].map((e) => {
        const n = document.createElement("div");
        (n.style.textDecoration = "none"),
          (n.style.margin = "5px"),
          (n.style.position = "initial"),
          (n.style.fontSize = "24px"),
          (n.innerHTML = String.fromCodePoint(e)),
          (n.onmousedown = t),
          l.appendChild(n);
      }),
      [
        128012, 128013, 128014, 128017, 128018, 128020, 128023, 128024, 128025,
        128026, 128027, 128028, 128029, 128030, 128031, 128032, 128033, 128034,
        128035, 128036, 128037, 128038, 128039, 128040, 128041, 128043, 128044,
        128045, 128046, 128047, 128048, 128049, 128050, 128051, 128052, 128053,
        128054, 128055, 128056, 128057, 128058, 128059, 128060,
      ].map((e) => {
        const n = document.createElement("div");
        (n.style.textDecoration = "none"),
          (n.style.margin = "5px"),
          (n.style.position = "initial"),
          (n.style.fontSize = "24px"),
          (n.innerHTML = String.fromCodePoint(e)),
          (n.onmousedown = t),
          i.appendChild(n);
      }),
      [
        127813, 127814, 127815, 127816, 127817, 127818, 127820, 127821, 127822,
        127823, 127825, 127826, 127827, 127828, 127829, 127830, 127831, 127832,
        127836, 127837, 127838, 127839, 127840, 127841, 127842, 127843, 127844,
        127846, 127848, 127849, 127850, 127851, 127852, 127853, 127856, 127858,
        127859, 127860, 127863, 127864, 127867,
      ].map((e) => {
        const n = document.createElement("div");
        (n.style.textDecoration = "none"),
          (n.style.margin = "5px"),
          (n.style.position = "initial"),
          (n.style.fontSize = "24px"),
          (n.innerHTML = String.fromCodePoint(e)),
          (n.onmousedown = t),
          d.appendChild(n);
      }),
      [
        127921, 127923, 127934, 127935, 127936, 127937, 127938, 127939, 127940,
        127942, 127944, 127946, 128675, 128692, 128693, 9917, 9918, 9978,
        127907, 127919, 9971,
      ].map((e) => {
        const n = document.createElement("div");
        (n.style.textDecoration = "none"),
          (n.style.margin = "5px"),
          (n.style.position = "initial"),
          (n.style.fontSize = "24px"),
          (n.innerHTML = String.fromCodePoint(e)),
          (n.onmousedown = t),
          c.appendChild(n);
      }),
      [
        128641, 128642, 128646, 128648, 128650, 128653, 128654, 128656, 128660,
        128662, 128664, 128667, 128668, 128669, 128670, 128671, 128672, 128673,
        128640, 128643, 128644, 128645, 128647, 128649, 128652, 128657, 128658,
        128659, 128661, 128663, 128665, 128666, 128674, 128676, 128690,
      ].map((e) => {
        const n = document.createElement("div");
        (n.style.textDecoration = "none"),
          (n.style.margin = "5px"),
          (n.style.position = "initial"),
          (n.style.fontSize = "24px"),
          (n.innerHTML = String.fromCodePoint(e)),
          (n.onmousedown = t),
          r.appendChild(n);
      }),
      [
        127890, 127880, 127881, 127887, 127891, 127905, 127906, 127908, 127909,
        127911, 127912, 127915, 127916, 127918, 127919, 127926, 127927, 127928,
        127929, 127930, 127931, 127932, 127968, 127973, 127978, 128147, 128148,
        128149, 128150, 128151, 128152, 128187, 128186, 128197, 128213, 128247,
      ].map((e) => {
        const n = document.createElement("li");
        (n.style.display = "inline-block"), (n.style.margin = "5px");
        const a = document.createElement("div");
        (a.style.textDecoration = "none"),
          (a.style.margin = "5px"),
          (a.style.position = "initial"),
          (a.style.fontSize = "24px"),
          (a.innerHTML = String.fromCodePoint(e)),
          (a.onmousedown = t),
          m.appendChild(a);
      }),
      o.appendChild(p),
      o.appendChild(l),
      o.appendChild(i),
      o.appendChild(d),
      o.appendChild(c),
      o.appendChild(r),
      o.appendChild(m),
      a.appendChild(o),
      window.addEventListener("click", function (t) {
        if (!e.hasAttribute("data-meteor-emoji-large")) {
          if (I.stopClickEvent) return void (I.stopClickEvent = !1);
          "block" === o.style.display &&
            (o.contains(t.target) ||
              s.contains(t.target) ||
              (o.style.display = "none"));
        }
      });
  }
}
