"use strict";
function e(e) {
  if (
    (chrome.runtime.lastError &&
      console.log(
        "Error while sending message=" + chrome.runtime.lastError.message
      ),
    !e)
  )
    return void window.close();
  const s = e.raiseHandEnabled,
    d = e.isHandRaised,
    o = e.canStartChat,
    c = e.isSharingScreen;
  console.log(
    "Hand Raise " +
      (s ? "allowed" : "not allowed") +
      ". Hand " +
      (d ? "is raised" : "isn't raised") +
      " Student " +
      (o ? "can" : "cannot") +
      " start a chat"
  ),
    t(s),
    void 0 !== o && n(o),
    a(!0 === s && d),
    i(c);
}
function t(e) {
  e
    ? (document
        .getElementById("handRaiseButtonContainer")
        .setAttribute("class", "btn-container"),
      (document.getElementById("handRaiseAlert").style.display = "none"))
    : (document
        .getElementById("handRaiseButtonContainer")
        .setAttribute("class", "btn-container disabled"),
      (document.getElementById("handRaiseAlert").style.display = "block")),
    (document.getElementById("tpRaiseHandButton").innerHTML = "Raise hand");
}
function n(e) {
  e
    ? document
        .getElementById("chatButtonContainer")
        .setAttribute("class", "btn-container")
    : document
        .getElementById("chatButtonContainer")
        .setAttribute("class", "btn-container disabled");
}
function a(e) {
  if (e)
    document.getElementById("tpRaiseHandButton").innerHTML =
      "Cancel hand raise";
  else {
    let e = "btn-container";
    document
      .getElementById("handRaiseButtonContainer")
      .className.split(" ")
      .indexOf("disabled") >= 0 && (e += " disabled"),
      document
        .getElementById("handRaiseButtonContainer")
        .setAttribute("class", e),
      (document.getElementById("tpRaiseHandButton").innerHTML = "Raise hand");
  }
}
function i(e) {
  document.getElementById("screenShareStatus").style.display = e
    ? "block"
    : "none";
}
window.addEventListener("load", function () {
  const t = document.getElementById("handRaiseButtonContainer").childNodes[1];
  t.addEventListener("click", function () {
    t.parentElement.className.split(" ").indexOf("disabled") >= 0 ||
      chrome.runtime.sendMessage(
        { action: "popup", popup: "handRaiseClick" },
        e
      );
  });
  const n = document.getElementById("chatButtonContainer").childNodes[1];
  n.addEventListener("click", function () {
    n.parentElement.className.split(" ").indexOf("disabled") >= 0 ||
      chrome.runtime.sendMessage(
        { action: "popup", popup: "startChatClick" },
        e
      );
  }),
    chrome.runtime.sendMessage({ action: "popup", popup: "hello" }, e);
});
