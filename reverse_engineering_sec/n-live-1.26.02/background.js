const e = "https://deviceconsole.securly.com",
  t = chrome.runtime.getManifest().version,
  o = "/chrome/handle",
  n = "/chrome/fire",
  s = 200,
  r = 412,
  i = "chrome_app_list",
  a = "authenticate",
  c = "get_org_url",
  l = "chrome_hand_raised",
  d = "chrome_idle_status_change",
  u = "chrome_login",
  h = "chrome_lost_mode_on",
  m = "chrome_send_message",
  g = "chrome_call",
  f = "chrome_windows_agent_info",
  p = "chrome_auth_confirm",
  w = "chrome_change_device_name",
  v = "chrome_change_server_url",
  b = "chrome_device_not_found",
  y = "chrome_get_location",
  k = "chrome_login_confirmation",
  C = "chrome_update_logging",
  S = "chrome_enable_lost_mode",
  I = "chrome_upgrade",
  T = "chrome_blocklist",
  E = "chrome_chat_message",
  _ = "chrome_session",
  L = "chrome_session_update",
  A = "chrome_clear_raised_hand",
  U = "chrome_close_app",
  R = "chrome_close_tab",
  N = "chrome_focus_tab",
  M = "chrome_get_tabs",
  q = "chrome_lock_screen",
  x = "chrome_open_site",
  O = "chrome_get_screenshot",
  D = "chrome_screen_share",
  H = "chrome_site_lock",
  P = "chrome_teacher_message",
  W = "chrome_teacher_screen_share",
  B = "chrome_unlock",
  F = "chrome_windows_agent_upgrade",
  J = "device not found",
  z = "cannot update extension",
  j = "disconnected port",
  V = "blocklist",
  G = "lostModeType",
  X = "isChromeBook",
  Q = "customBlocklist",
  Y = "customBlocklistName",
  $ = "deviceName",
  Z = "allowContactAdmin",
  K = "allowCaptureScreen",
  ee = "notificationInterval",
  te = "orgName",
  oe = "screenBlockMessage",
  ne = "serverUrl",
  se = "udid",
  re = "updateCheckDate",
  ie = "visitedUrls",
  ae = "whitelist",
  ce = "block",
  le = "none",
  de = "repeatLogin",
  ue = "restartPolling",
  he = "restartForUpgrade",
  me = "sendUrls",
  ge = "ping",
  fe = "showWarning",
  pe = "windowsAgentConnect",
  we = "X-TabPilot-RegCode",
  ve = 8e4,
  be = -1,
  ye = "session_start",
  ke = "screen_sharing",
  Ce = "Class session is active",
  Se = "update_available",
  Ie = "throttled",
  Te = {},
  Ee = [
    "accounts.google.com",
    "accounts.youtube.com",
    "canvaslms.com",
    "instructure.com/login",
  ],
  _e = ["classroom.google.com", "docs.google.com", "assignments.google.com"];
var Le = null,
  Ae = null,
  Ue = null;
const Re = !1,
  Ne = !0,
  Me = "com.securly.classroom.windows.agent",
  qe = "com.securly.classroom_native_host",
  xe = "win_not_allowed";
function Oe(e) {
  return new Promise((t, o) => {
    chrome.tabs.query(e, function (e) {
      chrome.runtime.lastError &&
        console.log(
          "Cannot get chrome tabs: " + chrome.runtime.lastError.message
        ),
        t(e);
    });
  });
}
function De() {
  return new Promise((e) => {
    chrome.windows.getAll({ populate: !0 }, (t) => {
      e(t);
    });
  });
}
async function He(e) {
  return new Promise((t, o) => {
    chrome.windows.get(e, (e) => {
      chrome.runtime.lastError ? o(chrome.runtime.lastError.message) : t(e);
    });
  });
}
function Pe() {
  return new Promise((e) => {
    chrome.windows.getLastFocused(null, function (t) {
      e(t);
    });
  });
}
function We(e) {
  return new Promise((t) => {
    const o = { focused: !0, state: "normal", type: "normal" };
    e && (o.url = e),
      chrome.windows.create(o, (e) => {
        t(e);
      });
  });
}
async function Be(e) {
  const t = { focused: !0, state: "fullscreen" };
  try {
    await Fe(e, t);
  } catch (e) {
    console.log(
      "Error while update to fullscreen: " + chrome.runtime.lastError.message
    );
  }
}
async function Fe(e, t) {
  return new Promise((o, n) => {
    chrome.windows.update(e, t, function (e) {
      chrome.runtime.lastError ? n(chrome.runtime.lastError.message) : o();
    });
  });
}
async function Je(e) {
  return new Promise((t, o) => {
    chrome.tabs.get(e, function (e) {
      chrome.runtime.lastError && o(chrome.runtime.lastError.message), t(e);
    });
  });
}
function ze(e) {
  return new Promise((t, o) => {
    chrome.tabs.create(e, function (e) {
      chrome.runtime.lastError ? o(chrome.runtime.lastError.message) : t(e);
    });
  });
}
function je(e) {
  return new Promise((t, o) => {
    chrome.tabs.remove(e, function () {
      chrome.runtime.lastError &&
        console.log("Error closing tab: " + chrome.runtime.lastError.message),
        t();
    });
  });
}
async function Ve(e) {
  const t = await Je(e);
  if (t)
    try {
      const o = await He(t.windowId);
      await Fe(o.id, { focused: !0 }), await ot(e, { active: !0 });
    } catch (e) {
      console.log("Error focusing tab: " + e);
    }
  else console.log("Not found tab with id=" + e);
}
function Ge() {
  return new Promise((e, t) => {
    chrome.tabs.captureVisibleTab(function (o) {
      chrome.runtime.lastError && t(chrome.runtime.lastError.message),
        void 0 === o && t("No screenshot captured"),
        e(o);
    });
  });
}
async function Xe() {
  return new Promise((e) => {
    chrome.storage.local.get(null, function (t) {
      chrome.runtime.lastError &&
        (console.log(
          "Error loading config from storage: " +
            chrome.runtime.lastError.message
        ),
        e(new at({}))),
        e(new at(t));
    });
  });
}
async function Qe() {
  return new Promise((e) => {
    chrome.storage.local.get(ie, (t) => {
      chrome.runtime.lastError
        ? (console.log("Failed to load urls from local storage"), e())
        : e(t[ie]);
    });
  });
}
async function Ye() {
  return "function" == typeof getSubstitutedEmail
    ? Promise.resolve(getSubstitutedEmail())
    : Ne && chrome.identity
    ? new Promise((e) => {
        const t = function (e) {
          return e && e.trim().length > 0 ? e : null;
        };
        chrome.declarativeNetRequest
          ? chrome.identity.getProfileUserInfo(
              { accountStatus: "ANY" },
              function (o) {
                e(t(o.email));
              }
            )
          : chrome.identity.getProfileUserInfo(function (o) {
              e(t(o.email));
            });
      })
    : Promise.resolve(null);
}
async function $e() {
  return new Promise((e, t) => {
    chrome.enterprise && chrome.enterprise.deviceAttributes
      ? chrome.enterprise.deviceAttributes.getDirectoryDeviceId(function (t) {
          console.log("Start with requested directory device ID=" + t), e(t);
        })
      : e(null);
  });
}
function Ze() {
  return new Promise((e) => {
    chrome.alarms.clearAll((t) => {
      t
        ? console.log("All alarms cleared")
        : (console.log("Alarms not cleared"),
          chrome.runtime.lastError &&
            console.log(
              "Alarms clear error: " + chrome.runtime.lastError.message
            )),
        e();
    });
  });
}
async function Ke(e, t) {
  try {
    await et(e, t);
  } catch (o) {
    const n = "Could not establish connection. Receiving end does not exist";
    if (-1 === o.indexOf(n)) throw o;
    await tt(e), await et(e, t);
  }
}
function et(e, t) {
  return new Promise((o, n) => {
    chrome.tabs.sendMessage(e, t, async function (e) {
      chrome.runtime.lastError ? n(chrome.runtime.lastError.message) : o();
    });
  });
}
function tt(e) {
  return new Promise((t, o) => {
    chrome.tabs.executeScript(
      e,
      { file: "teacherTools.js", allFrames: !1, runAt: "document_start" },
      function (e) {
        chrome.runtime.lastError
          ? (console.log("Failed to inject scripts"),
            o(chrome.runtime.lastError.message))
          : t();
      }
    );
  });
}
function ot(e, t) {
  return "number" != typeof e
    ? Promise.resolve()
    : new Promise((o, n) => {
        chrome.tabs.update(e, t, function () {
          chrome.runtime.lastError ? n(chrome.runtime.lastError.message) : o();
        });
      });
}
function nt() {
  return new Promise((e, t) => {
    chrome.windows.create(
      {
        state: "fullscreen",
        type: "popup",
        focused: !0,
        url: "blocking/block.html",
      },
      function (o) {
        chrome.runtime.lastError
          ? t(chrome.runtime.lastError.message)
          : e(o.id);
      }
    );
  });
}
function rt(e) {
  return new Promise((t, o) => {
    chrome.windows.remove(e, function () {
      chrome.runtime.lastError ? o(chrome.runtime.lastError.message) : t();
    });
  });
}
async function it() {
  return new Promise((e) => {
    navigator.geolocation.getCurrentPosition(
      (t) => {
        const o = t.coords,
          n = {
            latitude: o.latitude,
            longitude: o.longitude,
            accuracy: o.accuracy,
          };
        console.log(
          "Lat: " + o.latitude.toFixed(4) + " Lon: " + o.longitude.toFixed(4)
        ),
          e(n);
      },
      (t) => {
        console.log("Error: " + t.code + " " + t.message);
        const o = { error: t.message };
        e(o);
      },
      { maximumAge: 6e5, timeout: 2e4 }
    );
  });
}
class at {
  constructor(t) {
    (this.items = t),
      (this._defaultBlockMessage = "Your device is blocked"),
      (this.directoryDeviceId = null),
      (this._pingCount = 0),
      (this.isLoggedIn = !1),
      (this.announce = null),
      (this.sessionId = null),
      (this.studentId = null),
      (this.studentName = null),
      (this.canRaiseHand = !1),
      (this.isHandRaised = !1),
      (this.tabListenersAdded = !1),
      (this.chatMessages = []),
      (this.hasUnreadChatMessages = !1),
      (this.forceOpenChat = !1),
      (this.canStartChat = !1),
      (this.playChatAlert = !1),
      (this.closeTabsTimeout = null),
      (this.lockedToCourseWorkResources = !1),
      (this.canvasAssignmentIds = []),
      (this.maxOpenTabs = 0),
      (this.activeTab = null),
      (this.userEmail = null),
      (this.teacherId = null),
      (this.teacherName = null),
      (this.conferenceUrl = null),
      (this.conferenceTabId = null),
      (this.blockWindowId = 0),
      (this.maximizeFocusedWindow = !1),
      (this.loginErrorReason = null),
      (this.shareScreenHandler = null),
      (this.capturedScreen = null),
      t[ne] || (this.items[ne] = e),
      t[oe] || (this.items[oe] = this._defaultBlockMessage),
      t[G] || (this.items[G] = Re ? ce : le),
      t[ee] || (this.items[ee] = 0),
      t[K] || (this.items[K] = !1),
      t[Z] || (this.items[Z] = !1),
      t[X] || (this.items[X] = !1),
      t[re] ||
        (this.items[re] = new Date("01 Jan 1970 00:00:00 GMT").getTime());
  }
  get serverUrl() {
    return this.items[ne];
  }
  saveServerUrl(e) {
    return this.store(ne, e);
  }
  get blocklist() {
    return this.items[V];
  }
  saveBlocklist(e) {
    return this.store(V, e).then(() => this.store(ae, null));
  }
  get customBlocklist() {
    return this.items[Q];
  }
  get customBlocklistName() {
    return this.items[Y];
  }
  saveCustomBlocklist(e, t) {
    return this.store(Q, e).then(() => this.store(Y, t));
  }
  get blockedModeType() {
    return this.items[G];
  }
  saveBlockedModeType(e) {
    return this.store(G, e);
  }
  get blockedText() {
    return this.items[oe] ? this.items[oe] : this._defaultBlockMessage;
  }
  get deviceName() {
    return this.items[$];
  }
  saveDeviceName(e) {
    return this.store($, e);
  }
  get deviceUdid() {
    return this.items[se];
  }
  saveDeviceUdid(e) {
    return this.store(se, e);
  }
  get isChromeBook() {
    return this.items[X];
  }
  saveIsChromeBook(e) {
    return this.store(X, e);
  }
  get isChatActive() {
    return this.chatMessages.length > 0;
  }
  get isClassSessionActive() {
    return null != this.sessionId;
  }
  get isContactAdminAllowed() {
    return this.items[Z];
  }
  get isScreenLocked() {
    return this.items[G] === ce;
  }
  get isScreenCaptureAllowed() {
    return this.items[K];
  }
  get isSiteLocked() {
    return !!this.items[ae];
  }
  get notificationInterval() {
    return this.items[ee];
  }
  get orgName() {
    return this.items[te];
  }
  get pingCount() {
    return this._pingCount++;
  }
  get updateCheckDate() {
    return new Date(parseInt(this.items[re]));
  }
  async saveUpdateCheckDate(e) {
    return this.store(re, e.getTime());
  }
  get whitelist() {
    return this.items[ae];
  }
  async saveWhitelist(e) {
    return this.store(ae, e);
  }
  async clearWhitelist() {
    return (this.lockedToCourseWorkResources = !1), this.store(ae, null);
  }
  async saveBlockedInfo(e, t, o, n, s) {
    let r = {};
    e
      ? ((r[oe] = e), (this.items[oe] = e))
      : ((r[oe] = this._defaultBlockMessage),
        (this.items[oe] = this._defaultBlockMessage)),
      t && ((r[G] = t), (this.items[G] = t));
    let i = "Stored screen block modeType: " + t + ", message: " + e;
    return (
      void 0 !== n &&
        ((r[K] = n), (this.items[K] = n), (i += ", capture screen: " + n)),
      void 0 !== s &&
        ((r[Z] = s), (this.items[Z] = s), (i += ", allow contact admin: " + s)),
      (i += ", notification interval: "),
      void 0 !== n && o !== be && ((r[ee] = o), (this.items[ee] = o), (i += o)),
      console.log(i),
      this.bulkStore(r)
    );
  }
  async saveDeviceInfo(e, t, o, n, s, r, i) {
    let a = {};
    return (
      (a[te] = e),
      (this.items[te] = e),
      (a[$] = t),
      (this.items[$] = t),
      (a[G] = o),
      (this.items[G] = o),
      (a[oe] = n),
      (this.items[oe] = n),
      (a[ee] = s),
      (this.items[ee] = s),
      (a[Z] = r),
      (this.items[Z] = r),
      (a[K] = i),
      (this.items[K] = i),
      this.bulkStore(a)
    );
  }
  store(e, t) {
    return t
      ? ((this.items[e] = t),
        new Promise((o) => {
          chrome.storage.local.set({ [e]: t }, function () {
            chrome.runtime.lastError
              ? console.log(
                  "Failed to save object " +
                    JSON.stringify(t) +
                    " for key '" +
                    e +
                    "'. Error is: " +
                    chrome.runtime.lastError.message
                )
              : console.log("Stored " + JSON.stringify(t) + " for key: " + e),
              o();
          });
        }))
      : (delete this.items[e],
        new Promise((t) => {
          chrome.storage.local.remove([e], function () {
            chrome.runtime.lastError
              ? console.log(
                  "Failed to remove key '" +
                    e +
                    "'. Error is: " +
                    chrome.runtime.lastError.message
                )
              : console.log("Key '" + e + "' removed"),
              t();
          });
        }));
  }
  bulkStore(e) {
    return new Promise((t) => {
      chrome.storage.local.set(e, function () {
        chrome.runtime.lastError
          ? console.log(
              "Failed to bulk save '" +
                JSON.stringify(e) +
                "'. Error is: " +
                chrome.runtime.lastError.message
            )
          : console.log("Items " + JSON.stringify(e) + " saved"),
          t();
      });
    });
  }
  bulkDelete(e) {
    return new Promise((t) => {
      chrome.storage.local.remove(e, function () {
        chrome.runtime.lastError
          ? console.log(
              "Failed to remove keys " +
                e +
                " Error is: " +
                chrome.runtime.lastError.message
            )
          : console.log("Keys " + e + " removed"),
          t();
      });
    });
  }
}
const st = async function () {
  if (
    (chrome.alarms.clearAll(),
    "function" == typeof so && so(),
    Ne
      ? ((Ae = new Mt()).noActiveClassIcon(), (Le = await Xe()))
      : (Le = new at({})),
    (Ue = new lt(Le.serverUrl)),
    (Le.userEmail = await Ye()),
    Re &&
      (requestBlockScreen(
        Le.blockedText,
        Le.blockedModeType,
        Le.notificationInterval,
        Le.isScreenCaptureAllowed,
        Le.isContactAdminAllowed
      ),
      updateVersion()),
    Ne)
  ) {
    const e = await Qe();
    console.log("INIT URL STORAGE WITH URLS=" + JSON.stringify(e)),
      (To = new Nt(e));
  }
  await ct(), await vt();
};
async function ct() {
  const directoryDeviceId = await $e();
  directoryDeviceId
    ? ((Le.directoryDeviceId = directoryDeviceId),
      await Le.saveIsChromeBook(!0))
    : "function" == typeof substituteDeviceId && substituteDeviceId();
}
const stp = function () {
  console.log("Stopping the app"), chrome.alarms.clearAll();
};
chrome.runtime.onSuspend.addListener(function () {
  console.log("App suspended");
});
class lt {
  constructor(e) {
    (this.url = e),
      console.log("Router initialized for " + this.url),
      (this.queue = []),
      (this.isSending = !1);
  }
  static getAck(e) {
    if (e) {
      if (e.requestType === b) throw J;
      return { seq: e.seq, response: e.requestType };
    }
    return {};
  }
  updateUrl(e) {
    (this.url = e), console.log("Router url updated=" + this.url);
  }
  async sendCommand(e) {
    return (
      Object.assign(e, { version: t, udid: Le.deviceUdid, command: "ack" }),
      this.queue.push(e),
      await this.processQueue()
    );
  }
  cleanSent() {
    this.queue = this.queue.filter((e) => !e.sent);
  }
  cleanQueue() {
    this.queue.splice(0, this.queue.length);
  }
  async processQueue() {
    let e = !1;
    if (this.isSending) return !0;
    this.cleanSent(), (this.isSending = !0);
    try {
      for (const e of this.queue)
        console.log("Sending command=" + JSON.stringify(e)),
          await this.send(e, n),
          console.info("Command " + JSON.stringify(e) + " sent successfully"),
          (e.sent = !0);
      e = !0;
    } catch (t) {
      console.log(
        "Failed to send command: " + JSON.stringify(command) + ".  Error=" + t
      ),
        (e = !1);
    } finally {
      (this.isSending = !1), this.cleanSent();
    }
    return e;
  }
  async readCommands(e) {
    return (
      Object.assign(e, { version: t, udid: Le.deviceUdid, command: "ack" }),
      this.queue.length > 0 && (await this.processQueue()),
      console.log("Sending ack=" + JSON.stringify(e)),
      await this.send(e, o)
    );
  }
  async send(e, t) {
    return new Promise((o, n) => {
      const i = new XMLHttpRequest();
      (i.timeout = ve),
        i.upload.addEventListener("error", function (e) {
          n("XHR: Error in request upload");
        }),
        (i.ontimeout = function () {
          n("XHR: Request timeout");
        }),
        i.open("POST", this.url + t),
        i.setRequestHeader(we, e.udid),
        i.setRequestHeader("Content-Type", "application/json; charset=UTF-8"),
        (i.onreadystatechange = async function () {
          if (this.readyState === XMLHttpRequest.DONE)
            switch (this.status) {
              case s:
                if (this.responseText && this.responseText.length > 0)
                  try {
                    const e = JSON.parse(this.responseText);
                    o(e);
                  } catch (e) {
                    let t =
                      this.responseText.length > 200
                        ? this.responseText.substr(0, 200) + "..."
                        : this.responseText;
                    n("XHR: Received incorrect response=" + t);
                  }
                else o();
                break;
              case 0:
                n("Status 0");
                break;
              case r:
                o({ requestType: I });
                break;
              default:
                n("XHR: Server responded with http status=" + this.status);
            }
        }),
        i.send(JSON.stringify(e));
    });
  }
}
async function dt(e) {
  const t = Te[e.requestType];
  if (void 0 !== t) return t(e);
  console.log("Got unknown message: " + e.requestType);
}
async function ut(e) {
  if (!e) return Promise.resolve();
  console.log("Process server commands: " + JSON.stringify(e));
  let t = e.commands;
  return t && t.length > 0
    ? t.reduce((e, t) => e.then(dt(t)), Promise.resolve())
    : dt(e);
}
async function ht(e) {
  let t = e.commands;
  return t && t.length > 0
    ? { responses: t.map((e) => lt.getAck(e)) }
    : e.requestType
    ? { responses: [lt.getAck(e)] }
    : { responses: [] };
}
async function mt() {
  console.log("Long polling started"),
    Ne && chrome.alarms.create(me, { periodInMinutes: 1 });
  let e = 0,
    t = null,
    o = !0;
  for (; o; )
    try {
      t || (t = lt.getAck());
      const n = await Ue.readCommands(t);
      n
        ? ((t = await ht(n).catch(() => {
            o = !1;
          })),
          ut(n).catch((e) => {
            Ut(e, z) || Ut(e, J)
              ? (o = !1)
              : console.log(
                  "Failed to process action for one of responses:" +
                    n +
                    " error: " +
                    e
                );
          }))
        : (t = null);
    } catch (t) {
      Le.isLoggedIn
        ? ((e += 1) >= 3 &&
            (chrome.alarms.create(ue, { delayInMinutes: 1 }),
            console.log("Schedule server polling restart due to error=" + t),
            (o = !1)),
          console.log("Error #" + e + " while polling=" + t))
        : (chrome.alarms.create(de, { delayInMinutes: 1 }),
          console.log("Not logged in. Repeat login in 1 minute. Error: " + t),
          (o = !1));
    }
  console.log("Long polling stopped"), chrome.alarms.clear(me);
}
function gt(e) {
  switch ((console.log("Fired alarm " + e.name), e.name)) {
    case fe:
      Le.isScreenLocked ||
        requestBlockScreen(
          Le.blockedText,
          Le.blockedModeType,
          be,
          Le.isScreenCaptureAllowed,
          Le.isContactAdminAllowed
        );
      break;
    case de:
      vt();
      break;
    case ge:
      void 0 !== pn && ft();
      break;
    case me:
      pt();
      break;
    case he:
      chrome.runtime.reload();
      break;
    case ue:
      chrome.alarms.clear(ue), mt();
      break;
    case pe:
      chrome.alarms.clear(pe), qo.connect(Ft), qo.isConnected && qo.handshake();
      break;
    default:
      console.log("Cannot process alarm");
  }
}
function ft() {
  const e = new XMLHttpRequest(),
    t = "Ping " + Le.pingCount,
    o = Le.serverUrl + "/agent/chrome/debug";
  e.open("POST", o),
    e.setRequestHeader(we, Le.deviceUdid),
    e.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  const n = {
    udid: Le.deviceUdid,
    logString: t,
    logNum: pn.logCount,
    logSource: "extension",
  };
  e.send(JSON.stringify(n)), (pn.logCount += 1);
}
async function pt() {
  if (!To.hasUrls()) return;
  if (pt.isSending) return;
  pt.isSending = !0;
  const e = Le.sessionId;
  if (e) {
    const t = await Oe({ active: !0, lastFocusedWindow: !0 });
    let o,
      n = 0;
    if (t.length > 0) {
      const e = t[0];
      void 0 !== e.id && e.id !== chrome.tabs.TAB_ID_NONE && (n = e.id);
      const s = e.url;
      void 0 !== s && (o = Co(s));
    }
    n > 0 && o && To.saveUrl(e, new Rt(o, t[0].title));
  }
  const t = { udid: Le.deviceUdid, urls: To.getUrls(), timestamp: Date.now() };
  try {
    await wt(t), console.log("Urls sent successfully"), To.purge();
  } catch (e) {
    console.log("Error while sending urls: " + e);
  } finally {
    pt.isSending = !1;
  }
}
async function wt(e) {
  return new Promise((t, o) => {
    const n = new XMLHttpRequest(),
      s = "Failed to send urls to the server: ";
    (n.timeout = ve),
      n.upload.addEventListener("error", function (e) {
        o(s);
      }),
      (n.ontimeout = function () {
        o(s + "Request timeout");
      }),
      (n.onreadystatechange = function () {
        this.readyState === XMLHttpRequest.DONE &&
          (200 === this.status
            ? t()
            : (0 === this.status || this.status >= 400) &&
              o("Failed to send urls to the server: " + this.status));
      });
    const r = Le.serverUrl + "/agent/chrome/url";
    n.open("POST", r),
      n.setRequestHeader(we, Le.deviceUdid),
      n.setRequestHeader("Content-Type", "application/json; charset=UTF-8"),
      n.send(JSON.stringify(e));
  });
}
async function vt(e) {
  console.log("Initiate login at " + new Date()), await Ze(), Ue.cleanQueue();
  try {
    if ((await ut(await kt()), await ut(await Ct()), !Le.isChromeBook)) {
      if (await wo())
        return void console.log("Windows agent is present. Terminating login");
    }
    if (!(await St()))
      return (
        console.log("Failed to login. Repeat in 1 minute"),
        void chrome.alarms.create(de, { periodInMinutes: 1 })
      );
    Ne &&
      (chrome.browserAction.onClicked.removeListener(vt),
      chrome.runtime.onMessage.removeListener(lo)),
      void 0 !== pn && (pn.logCount = 0),
      (Le.pingCount = 0),
      (Le.loginErrorReason = null),
      mt();
  } catch (t) {
    Ut(t, J)
      ? (console.log("Failed to authenticate: " + t),
        console.log("Logout and login again to connect"),
        e && Le.loginErrorReason && Le.loginErrorReason !== xe && (await yt()))
      : Ut(t, z)
      ? (console.log(t), on())
      : (console.log("Failed to login: " + t),
        chrome.alarms.create(de, { periodInMinutes: 1 }));
  }
}
function bt() {
  vt(!0);
}
async function yt() {
  const e = chrome.runtime.getURL("notfound.html");
  try {
    await ze({ url: e });
  } catch (e) {
    console.log("Cannot open not found page due to error: " + e);
  }
}
function kt() {
  const n = Le.serverUrl === e,
    s = Le.directoryDeviceId;
  if (
    (console.log(
      "Request server url=" +
        n +
        " config.serverUrl=" +
        Le.serverUrl +
        " udid=" +
        s
    ),
    !n)
  )
    return Promise.resolve();
  const r = {
    command: c,
    udid: s,
    kiosk: Re,
    userEmail: Re ? "kiosk" : Le.userEmail,
    version: t,
    userAgent: navigator.userAgent,
  };
  return console.log("Get org url message=" + JSON.stringify(r)), Ue.send(r, o);
}
async function Ct() {
  if (Le.deviceUdid) return Promise.resolve();
  const e = {
    command: a,
    userEmail: Le.userEmail,
    kiosk: Re,
    version: t,
    userAgent: navigator.userAgent,
  };
  return (
    Le.directoryDeviceId ? (e.udid = Le.directoryDeviceId) : (e.byod = !0),
    console.log("Send AUTHENTICATE=" + JSON.stringify(e)),
    Ue.send(e, o)
  );
}
function St() {
  const e = void 0 !== Le.whitelist,
    t = navigator.userAgent,
    o = {
      response: u,
      kiosk: Re,
      userEmail: Re ? "kiosk" : Le.userEmail,
      isClassSessionActive: Le.isClassSessionActive,
      isScreenLocked: Le.isScreenLocked,
      isWebLocked: e,
      userAgent: t,
    };
  return Ue.sendCommand(o);
}
function It(e, t) {
  Ue.sendCommand({ response: i, appList: e, userId: t });
}
function sm(e) {
  const t = { response: m, text: e };
  Ue.sendCommand(t);
}
async function Tt(e, t) {
  const o = void 0 !== t.maxWidth ? t.maxWidth : 0,
    n = void 0 !== t.maxHeight ? t.maxHeight : 0,
    s = await Lt(e, o, n);
  let r = _t(t.url);
  void 0 !== t.tabUrl && (r += "&tabUrl=" + encodeURIComponent(t.tabUrl)),
    void 0 !== t.tabTitle &&
      (r += "&tabTitle=" + encodeURIComponent(t.tabTitle)),
    Et(r, s);
}
async function Et(e, t) {
  return new Promise((o) => {
    let n = new XMLHttpRequest();
    (n.timeout = ve),
      n.upload.addEventListener("error", function (t) {
        console.log("Failed to upload screenshot to url=" + e);
      }),
      (n.ontimeout = function () {
        console.log("Timeout while uploading screenshot to url=" + e);
      }),
      n.open("POST", e),
      n.setRequestHeader(we, Le.deviceUdid),
      n.setRequestHeader("Content-Type", "image/jpg"),
      (n.onreadystatechange = function () {
        this.readyState === XMLHttpRequest.DONE &&
          (this.status >= 200 && this.status < 400
            ? console.log("Screenshot send complete to url=" + e)
            : console.log(
                "Status=" +
                  this.status +
                  ". Failed to upload screenshot to url=" +
                  e
              ),
          o(204 !== this.status));
      }),
      n.send(t);
  });
}
function _t(e) {
  let t = Le.serverUrl + e;
  return (
    -1 !== t.indexOf("uid=")
      ? (t += "&udid=" + Le.deviceUdid)
      : (t += "?udid=" + Le.deviceUdid),
    Le.userEmail && (t += "&userEmail=" + encodeURIComponent(Le.userEmail)),
    t
  );
}
function Lt(e, t, o) {
  return new Promise((n, s) => {
    if (0 === t && 0 === o) console.log("Image will not be resized"), n(e);
    else {
      let s = document.createElement("img");
      (s.onload = function (r) {
        const i = s.width,
          a = s.height,
          c = Math.min(t / i, 1),
          l = Math.min(o / a, 1);
        let d;
        1 === (d = 0 !== c && 0 !== l ? (c < l ? c : l) : 0 !== c ? c : l) &&
          (console.log("Image will not be resized"), n(e)),
          n(At(s, d));
      }),
        (s.src = e);
    }
  })
    .then((e) => fetch(e))
    .then((e) => e.blob());
}
function At(e, t) {
  const o = Math.ceil(Math.log(1 / t) / Math.log(2));
  let n = document.createElement("canvas"),
    s = n.getContext("2d");
  (s.imageSmoothingEnabled = !0), (s.imageSmoothingQuality = "high");
  let r = { width: e.width, height: e.height };
  for (let i = 1; i <= o; i++) {
    const o = t + (1 - t) / (2 * i),
      a = Math.floor(e.width * o),
      c = Math.floor(e.height * o);
    1 === i
      ? ((n.width = a), (n.height = c), s.drawImage(e, 0, 0, a, c))
      : s.drawImage(n, 0, 0, r.width, r.height, 0, 0, a, c),
      (r = { width: a, height: c });
  }
  let i = document.createElement("canvas");
  (i.width = Math.floor(e.width * t)), (i.height = Math.floor(e.height * t));
  let a = i.getContext("2d");
  return (
    (a.imageSmoothingEnabled = !0),
    (a.imageSmoothingQuality = "high"),
    a.drawImage(n, 0, 0, r.width, r.height, 0, 0, i.width, i.height),
    i.toDataURL("image/jpeg")
  );
}
function Ut(e, t) {
  return "string" == typeof e && e.toLowerCase().includes(t);
}
chrome.alarms.onAlarm.addListener(gt);
class Rt {
  constructor(e, t, o) {
    (this.domain = e),
      (this.tabTitle = t),
      (this.isBlocked = !!o),
      (this.timestamp = Date.now());
  }
}
class Nt {
  constructor(e) {
    (this.urls = "object" == typeof e ? e : {}), (this.lastVisitedUrl = null);
  }
  saveUrl(e, t) {
    e || (e = "blocked");
    let o = this.urls[e];
    if ((o || ((o = []), (this.urls[e] = o)), !this.isLast(t)))
      if (
        ((this.lastVisitedUrl = t),
        t.domain.length < 1e3 && (!t.tabTitle || t.tabTitle.length < 255))
      )
        o.push(t);
      else {
        const e = new Rt(
          t.domain.substr(0, 1e3),
          t.tabTitle ? t.tabTitle.substr(0, 255) : null,
          t.isBlocked
        );
        o.push(e);
      }
    chrome.storage.local.set({ [ie]: this.urls }, () => {
      chrome.runtime.lastError &&
        console.log(
          "Failed to save urls to local storage. Error is: " +
            chrome.runtime.lastError.message
        );
    });
  }
  isLast(e) {
    return (
      this.lastVisitedUrl instanceof Rt &&
      this.lastVisitedUrl.domain === e.domain
    );
  }
  hasUrls() {
    return Object.keys(this.urls).length > 0;
  }
  getUrls() {
    return this.urls;
  }
  purge() {
    (this.urls = {}),
      (this.lastVisitedUrl = null),
      chrome.storage.local.remove(ie, () => {
        chrome.runtime.lastError
          ? console.log(
              "Failed to clear urls from local storage: " +
                chrome.runtime.lastError.message
            )
          : Qe().then((e) => {
              void 0 !== e
                ? console.log("Failed to clear urls from local storage")
                : console.log("Urls cleared from local storage");
            });
      });
  }
}
chrome.runtime.onUpdateAvailable.addListener(function (e) {
  Ne &&
    (console.log(
      "Extension update available, will reload. Current version=" + t
    ),
    chrome.runtime.reload());
});
class Mt {
  constructor() {
    (this.active = !1), (this.sharesScreen = !1);
  }
  isActive() {
    return this.active;
  }
  activeClassIcon() {
    chrome.browserAction.setIcon({ path: "logo16.png" }, function () {
      Ae.active = !0;
    });
  }
  noActiveClassIcon() {
    chrome.browserAction.setIcon({ path: "logo16mono.png" }, function () {
      Ae.active = !1;
    });
  }
  raiseHandIcon() {
    chrome.browserAction.setIcon({ path: "hand.png" });
  }
  shareScreenIcon() {
    chrome.browserAction.setIcon({ path: "logo16share.png" }, function () {
      Ae.sharesScreen = !0;
    });
  }
  noShareScreenIcon() {
    let e = this.active ? "logo16.png" : "logo16mono.png";
    chrome.browserAction.setIcon({ path: e }, function () {
      Ae.sharesScreen = !1;
    });
  }
  clearRaiseHandIcon() {
    this.sharesScreen
      ? this.shareScreenIcon()
      : this.active
      ? this.activeClassIcon()
      : this.noActiveClassIcon();
  }
  static markNotAuthorized() {
    chrome.browserAction.setBadgeText({ text: "!" }),
      chrome.browserAction.setBadgeBackgroundColor({ color: "#F00" });
  }
  static clearBadge() {
    chrome.browserAction.setBadgeText({ text: "" });
  }
}
function qt() {
  const e = Le.isClassSessionActive;
  !Le.tabListenersAdded && e
    ? (chrome.tabs.onActivated.addListener(jt),
      chrome.tabs.onCreated.addListener(Vt),
      chrome.tabs.onUpdated.addListener(Gt),
      (Le.tabListenersAdded = !0))
    : Le.tabListenersAdded &&
      !e &&
      (chrome.tabs.onActivated.removeListener(jt),
      chrome.tabs.onCreated.removeListener(Vt),
      chrome.tabs.onUpdated.removeListener(Gt),
      (Le.tabListenersAdded = !1));
}
function xt(e) {
  e > 0
    ? (chrome.idle.setDetectionInterval(60 * e),
      chrome.idle.onStateChanged.addListener(Ot))
    : chrome.idle.onStateChanged.removeListener(Ot);
}
function Ot(e) {
  const t = { response: d, isIdle: "active" !== e };
  Ue.sendCommand(t);
}
async function Dt(e) {
  const t = Le.isSiteLocked,
    o = Le.isScreenLocked,
    n = await Oe({});
  for (const s of n)
    if (!t || void 0 === s.url || !Yt(s.url))
      try {
        await Xt(s, "onApply", e), await ot(s.id, { muted: o });
      } catch (e) {
        console.log("Error updating lock status: " + e);
      }
}
function Ht() {
  if (Le.isClassSessionActive) {
    const e =
        (Le.isScreenLocked || Le.maximizeFocusedWindow) &&
        !chrome.windows.onFocusChanged.hasListener(Pt),
      t =
        Le.maximizeFocusedWindow &&
        !chrome.windows.onBoundsChanged.hasListener(Bt),
      o = Le.isScreenLocked && !chrome.windows.onRemoved.hasListener(Wt);
    e && chrome.windows.onFocusChanged.addListener(Pt),
      t &&
        (chrome.windows.onBoundsChanged.addListener(Bt),
        chrome.windows.onCreated.addListener(Bt)),
      o && chrome.windows.onRemoved.addListener(Wt);
  } else
    chrome.windows.onFocusChanged.removeListener(Pt),
      chrome.windows.onRemoved.removeListener(Wt),
      chrome.windows.onBoundsChanged.removeListener(Bt),
      chrome.windows.onCreated.removeListener(Bt);
}
async function Pt(e) {
  if (
    !Le.maximizeFocusedWindow ||
    Le.isScreenLocked ||
    "number" != typeof e ||
    e === chrome.windows.WINDOW_ID_NONE ||
    e === Le.blockWindowId
  ) {
    if (Le.isScreenLocked && Le.isChromeBook) {
      if (!Le.blockWindowId) {
        const e = await Pe();
        if (!e) return;
        Le.blockWindowId = e.id;
      }
      (void 0 !== e &&
        ("number" != typeof e ||
          (e !== chrome.windows.WINDOW_ID_NONE && e === Le.blockWindowId))) ||
        (await Be(Le.blockWindowId));
    }
  } else await Fe(e, { state: "maximized" });
}
async function Wt(e) {
  Le.isScreenLocked &&
    Le.blockWindowId === e &&
    setTimeout(async () => {
      try {
        (Le.blockWindowId = await nt()), await Be(Le.blockWindowId);
      } catch (e) {
        console.log("Cannot make window fullscreen: " + e);
      }
    }, 1e3);
}
async function Bt(e) {
  if ("normal" === e.type && e.id !== Le.blockWindowId)
    try {
      await Fe(e.id, { state: "maximized" });
    } catch (e) {
      console.log("Cannot maximize window: " + e);
    }
}
function Ft(e) {
  const t = e.action;
  switch (t) {
    case Eo:
      const o = { response: U, app: e.app, userId: e.userId, isClosed: !0 };
      e.isClosed || ((o.isClosed = !1), (o.error = e.error)), Ue.sendCommand(o);
      break;
    case Lo:
      void 0 !== pn && qo.updateLogging(pn.logEnabled);
      const n = e.version;
      console.log("Native agent communication established. Version=" + n),
        Ue.sendCommand({ response: f, agentVersion: n }),
        so(Ce, n);
      break;
    case _o:
      It(e.appList, e.userId);
      break;
    default:
      console.log("Native agent sent unknown command=" + t);
  }
}
async function Jt(e) {
  const t = await Oe({});
  for (const o of t)
    try {
      await Qt(o, "onApply", e);
    } catch (e) {
      console.log(
        "Catched update chat state error for tab=" +
          o.id +
          " '" +
          o.url +
          "': " +
          e
      );
    }
}
async function zt(e) {
  if (Le.maxOpenTabs > 0) {
    if ((await Oe({})).length > Le.maxOpenTabs) {
      if (void 0 === e.id)
        return console.log("Cannot close tab, no tab.id"), Promise.resolve(!1);
      je(e.id);
    }
  }
  return Promise.resolve(!0);
}
function jt(e) {
  const t = e.tabId;
  if (null != Le.activeTabId) {
    if (Le.activeTabId !== t && Le.isChatActive) {
      const e = { command: "chatStatus", chat: !0, forceCloseChat: !0 };
      if (
        (Ke(Le.activeTabId, e)
          .then(() => {
            console.log(
              "Command to close chat in tabId=" +
                Le.activeTabId +
                " sent. New active tabId=" +
                t
            ),
              (Le.activeTabId = t);
          })
          .catch((e) => {
            console.log(
              "Error=" +
                e +
                ". Command to close chat in tabId=" +
                Le.activeTabId +
                " NOT sent. New active tabId=" +
                t
            );
          }),
        Le.hasUnreadChatMessages && Le.forceOpenChat)
      ) {
        Ke(t, { command: "chatStatus", chat: !0, forceOpenChat: !0 })
          .then(() => {
            console.log("Command to open chat in tabId=" + t + " sent.");
          })
          .catch((e) => {
            console.log(
              "Error= " +
                e +
                ". Command to open chat in tabId=" +
                t +
                " NOT sent."
            );
          });
      }
    }
  } else Le.activeTabId = t;
}
async function Vt(e) {
  if (
    !(
      (null !== Le.conferenceUrl && "loading" === e.status) ||
      (e.url && Le.conferenceUrl === e.url)
    )
  )
    if (await zt(e)) {
      if (Le.isChatActive) return Qt(e, "onCreate");
    } else
      console.log("Catched on tab create listener error: Tabs limit exceeded");
}
async function Gt(e, t, o) {
  if ("complete" === t.status) {
    if (
      null !== Le.conferenceUrl &&
      (void 0 === o.url || Le.conferenceUrl === o.url)
    )
      return;
    const e = await zt(o);
    try {
      e && Le.isChatActive && (await Qt(o, "onUpdate")),
        e && Le.isScreenLocked && (await Xt(o, "onUpdate"));
    } catch (e) {
      console.log("Catched on tab update listener error: " + JSON.stringify(e));
    }
  }
}
async function Xt(e, t, o) {
  if (void 0 === e.status || void 0 === e.url) return Promise.resolve();
  if ("number" == typeof e.id) {
    if (
      !So(
        e.url,
        ["https?:\\/\\/chrome\\.google\\.com\\/webstore\\/?.*?"],
        !1
      ) &&
      (Le.isScreenLocked || Le.isSiteLocked || null !== Le.announce)
    )
      return je(e.id), Promise.resolve();
    const n = (null !== Le.closeTabsTimeout && !o) || null,
      s = {
        command: "lockStatus",
        announce: Le.announce,
        announceTitle:
          "Announcement from" +
          (Le.teacherName ? ": " + Le.teacherName : " your teacher"),
        lock: Le.isSiteLocked
          ? "This site is not available during site lock"
          : Le.isScreenLocked
          ? Le.blockedText
          : null,
        tabsCloseWarning: n,
        messageType: t,
      };
    try {
      await Ke(e.id, s);
    } catch (t) {
      -1 !== t.indexOf("chrome://")
        ? je(e.id)
        : console.log(
            "Lock not sent to tab '" +
              e.id +
              " {status:" +
              e.status +
              ", discarded:" +
              e.discarded +
              "} " +
              e.title +
              "'. Error: " +
              t
          );
    }
  }
}
async function Qt(e, t, o) {
  return void 0 === e.status || void 0 === e.url
    ? Promise.resolve()
    : new Promise(async (n, s) => {
        if ("number" == typeof e.id) {
          const r = { command: "chatStatus", messageType: t };
          Le.isChatActive
            ? ((r.chat = !0),
              o
                ? (r.chatMessage = o)
                : Le.hasUnreadChatMessages &&
                  (r.chatMessage = Le.chatMessages[Le.chatMessages.length - 1]),
              r.chatMessage &&
                e.highlighted &&
                Le.forceOpenChat &&
                (r.forceOpenChat = !0))
            : (r.chat = !1),
            console.log(
              "Send chat status message=" +
                JSON.stringify(r) +
                " tabId=" +
                e.id +
                " '" +
                e.url +
                "'"
            );
          try {
            await Ke(e.id, r), n();
          } catch (e) {
            s("Failed to send chat status:" + e);
          }
        }
      });
}
function Yt(e) {
  return !!Le.whitelist && So(e, Le.whitelist, !0);
}
function $t(e) {
  let t = Promise.resolve();
  return (
    e.forEach((e) => {
      t = t.then(() => ze({ url: e, active: !0 }));
    }),
    t.catch((e) => {
      console.log("Error while open sites: " + e);
    }),
    t
  );
}
async function Zt(e, t) {
  if (!e || 0 === e.length) return Promise.resolve();
  const o = e.map((e) => e.id);
  return t && (await ze({})), je(o);
}
async function Kt(e) {
  let t = await Oe({});
  const o = { command: "tabCloseWarning", delaySeconds: e };
  for (const e of t) {
    if (void 0 === e.status || void 0 === e.url) return;
    if ("number" == typeof e.id)
      try {
        await Ke(e.id, o);
      } catch (e) {
        console.log("Error while apply tabs close warning: " + e);
      }
  }
}
async function eo(e, t, o = !1) {
  try {
    let n;
    if ((await Dt(), t && (n = await Oe({})), !o)) {
      const t = await De();
      t && 0 !== t.length ? await $t(e) : await We(e);
    }
    t && (await Zt(n, o));
  } catch (e) {
    console.log("Error while site lock: " + JSON.stringify(e));
  }
}
function to(e) {
  const t = /\/courses\/\d+\/assignments\/(\d+)/,
    o = [];
  for (const n of e) {
    const e = n.match(t);
    e && e.length > 1 && o.push(e[1]);
  }
  return o;
}
async function oo() {
  const e = Le.serverUrl + "/chrome/screenshare*",
    t = await Oe({ url: e });
  for (const e of t) e.id && (await je(e.id));
}
function no(e, t) {
  Ae || (Ae = new Mt()),
    e ? (Ae.activeClassIcon(), so(Ce)) : (Ae.noActiveClassIcon(), so());
}
function so(e, o) {
  const n = {};
  if (void 0 !== e) {
    let s = e + "\n";
    void 0 !== o && (s += "Windows agent " + o + "\n"), (n.title = s + t);
  } else n.title = t;
  chrome.browserAction.setTitle(n);
}
function ro(e) {
  const t = e ? "popup.html" : "";
  chrome.browserAction.setPopup({ popup: t }, () => {
    console.log("Popup set to " + (e ? t : "none"));
  });
}
function io() {
  const e = ao(!0);
  (Le.announce = null),
    (Le.teacherId = null),
    qt(),
    Dt().then(Ue.sendCommand(e));
}
function ao(e) {
  return { response: P, isConfirmed: e, teacherId: Le.teacherId };
}
function co(e) {
  e
    ? (chrome.runtime.onMessage.addListener(lo),
      console.log("MESSAGE LISTENER ADDED"))
    : (chrome.runtime.onMessage.removeListener(lo),
      console.log("MESSAGE LISTENER REMOVED"));
}
function lo(e, t, o) {
  switch (
    (console.log(
      "Got message from tab=" +
        JSON.stringify(t.tab) +
        " Message=" +
        JSON.stringify(e)
    ),
    e.action)
  ) {
    case "popup":
      return mo(e, t, o);
    case "notfound":
      go(e, t, o);
      break;
    case "teacherMessage":
      io();
      break;
    case "clearTabsCloseWarning":
      qt(), Dt(!0), console.log("Tabs close warning cleared by student"), o();
      break;
    case "respondToShareScreen":
      uo(e);
      break;
    case "chat":
      return fo(e, t, o);
    case "resizeLocked":
      Pt();
      break;
    case "getLockText":
      Le.isScreenLocked ? o(Le.blockedText) : o(null);
      break;
    case "call":
      o({ token: Le.conferenceToken, studentName: Le.studentName });
      break;
    default:
      console.log(
        "Received incorrect message in pageMessageListener=" + JSON.stringify(e)
      );
  }
}
function uo(e) {
  Dt();
  const t = e.isConfirmed,
    o = { response: D, userId: e.userId, lock: e.lock, isConfirmed: t };
  if ((Ue.sendCommand(o), t)) {
    const t = e.deviceId,
      o = Le.serverUrl + "/agent/sharescreen/upload?did=" + t;
    (Le.shareScreenHandler = setInterval(ho, 4e3, o, 1024)),
      Ae.shareScreenIcon();
  }
}
async function ho(e, t) {
  let o = !1;
  if ((qo.isConnected && (o = qo.requestScreenshot(e, t, t)), o))
    console.log("Screenshot requested from native agent");
  else {
    try {
      Le.capturedScreen = await Ge();
    } catch (e) {
      return void console.log("Cannot capture visible tab: " + e);
    }
    Et(e, await Lt(Le.capturedScreen, t, t)) || Fo();
  }
}
function mo(e, t, o) {
  let n = !1;
  switch (e.popup) {
    case "hello":
      return (
        Oe({ currentWindow: !0, active: !0 })
          .then((e) => {
            if (e && e.length > 0) {
              const t = e[0].url;
              t &&
                !t.toLowerCase().includes("newtab") &&
                (n = Le.canStartChat || Le.isChatActive);
            }
          })
          .catch((e) => {
            console.log("Error responding to popup=" + e);
          })
          .finally(() => {
            o({
              raiseHandEnabled: Le.canRaiseHand,
              isHandRaised: Le.isHandRaised,
              isSharingScreen: null !== Le.shareScreenHandler,
              canStartChat: n,
            });
          }),
        !0
      );
    case "handRaiseClick":
      (Le.isHandRaised = !Le.isHandRaised),
        o({ raiseHandEnabled: Le.canRaiseHand, isHandRaised: Le.isHandRaised }),
        Le.isHandRaised ? Ae.raiseHandIcon() : Ae.clearRaiseHandIcon(),
        Ue.sendCommand({ response: l, isHandRaised: Le.isHandRaised });
      break;
    case "startChatClick":
      o(),
        Oe({ currentWindow: !0, active: !0 }).then((e) => {
          if (e && e.length > 0) {
            const t = { command: "chatStatus", chat: !0, forceOpenChat: !0 };
            Ke(e[0].id, t), console.log("Sent message to tabId=" + e[0].id);
          } else console.log("Cannot open chat from popup - no active tab");
        });
  }
}
function go(e, t, o) {
  o({ reason: Le.loginErrorReason });
}
function fo(e, t, o) {
  switch (e.command) {
    case "getChatMessages":
      (Le.hasUnreadChatMessages = !1), o({ chatMessages: Le.chatMessages });
      break;
    case "sendMessage":
      o();
      const t = { sessionId: Le.sessionId, text: e.text, response: E },
        n = { date: new Date().toUTCString(), isFromTeacher: !1, text: e.text };
      Le.chatMessages.push(n),
        Ue.sendCommand(t).catch((e) => {
          console.log("Chat message send failed: " + JSON.stringify(e));
        });
      break;
    default:
      o({ chat: Le.isChatActive, unread: Le.hasUnreadChatMessages });
  }
}
function po(e, t, o) {
  chrome.notifications.clear(e, function (n) {
    chrome.notifications.create(e, {
      title: t,
      iconUrl: "logo48.png",
      type: "basic",
      message: o,
    });
  });
}
async function wo() {
  return new Promise((e) => {
    chrome.runtime.sendNativeMessage(qe, { action: Lo }, (t) => {
      chrome.runtime.lastError &&
        (console.log(
          "Error sending handshake to Windows agent V2: " +
            chrome.runtime.lastError.message
        ),
        e(!1)),
        e(t && "string" == typeof t.version);
    });
  });
}
function vo(e) {
  if (!Le) return { cancel: !1 };
  const t = e.url;
  if (bo(t)) return { cancel: !1 };
  let o = !0,
    n = chrome.runtime.getURL("blocking/block.html");
  if (!Le.whitelist || (Le.lockedToCourseWorkResources && Io(e))) {
    if (Le.blocklist || Le.customBlocklist) {
      const e = !Le.blocklist || So(t, Le.blocklist, !1),
        s = !Le.customBlocklist || So(t, Le.customBlocklist, !1);
      (o = e && s) || To.saveUrl(Le.sessionId, new Rt(t, null, !0)),
        e
          ? s || (n += "?t=" + btoa(encodeURIComponent(Le.customBlocklistName)))
          : (n += "?t=o");
    }
  } else (o = So(t, Le.whitelist, !0)), (n += "?t=w");
  return o ? { cancel: !1 } : { redirectUrl: n };
}
function bo(t) {
  if (-1 !== t.indexOf("chrome-extension://" + chrome.runtime.id)) return !0;
  if (-1 !== t.indexOf("/_/chrome/newtab")) return !0;
  const o = t.match("^(.*[a-zA-Z]:\\/\\/)?([^\\/\\n]*)(\\/.*)?$");
  if (o && o.length > 1) {
    const o = t.match("^(.*[a-zA-Z]:\\/\\/)?([^\\/\\n]*)(\\/.*)?$")[2],
      n = [
        e.replace("https://", ""),
        "deviceconsole.securly.com",
        "techpilotlabs.com",
      ];
    for (const e of n) if (o.match(e)) return !0;
  }
  return !1;
}
function yo(e) {
  if (!Le || !Le.lockedToCourseWorkResources) return { cancel: !1 };
  if (302 === e.statusCode) {
    const t = e.responseHeaders.find(
      (e) => "location" === e.name.toLowerCase()
    );
    t &&
      So(e.url, Le.whitelist, !0) &&
      !Le.whitelist.some((e) => t.value === e) &&
      (Le.whitelist.push(t.value), Le.saveWhitelist(Le.whitelist));
  }
  return { cancel: !1 };
}
function ko(e) {
  const t = Le.sessionId;
  if (!t) return;
  const o = Co(e.url);
  (o && -1 !== o.indexOf("chrome-extension")) ||
    (o &&
      (-1 !== e.tabId
        ? setTimeout(() => {
            Je(e.tabId)
              .then((e) => {
                To.saveUrl(t, new Rt(o, e.title));
              })
              .catch((e) => {
                console.log("Cannot save visited url: " + e);
              });
          }, 5e3)
        : To.saveUrl(t, new Rt(o, null))));
}
function Co(e) {
  return e.match(
    /^([a-zA-Z]*:\/\/)?([wW]{3}[0-9]?\.)?([^\/\?]*)(\/|\?)?.*$/
  )[3];
}
function So(e, t, o) {
  if (Le.lockedToCourseWorkResources)
    for (const t of Le.canvasAssignmentIds)
      if (e.includes("assignment_id=" + t)) return o;
  e.includes("youtube.com") || (e = e.split("?")[0]);
  for (const n of t) if (e.match(n)) return o;
  return !o;
}
function Io(e) {
  const t = e.url ? Co(e.url) : null;
  for (const e of Ee) if (t && t.includes(e)) return !0;
  if ("string" == typeof e.initiator) {
    const t = e.initiator;
    for (const e of _e) if (t.includes(e)) return !0;
  }
  return !1;
}
var To = null;
chrome.webRequest.onBeforeRequest.addListener(
  vo,
  { urls: ["<all_urls>"], types: ["main_frame"] },
  ["blocking"]
),
  chrome.webRequest.onHeadersReceived.addListener(
    yo,
    { urls: ["<all_urls>"], types: ["main_frame"] },
    ["blocking", "responseHeaders"]
  ),
  console.log("Extension log here");
const Eo = "closeApp",
  _o = "apps",
  Lo = "handshake",
  Ao = "logging",
  Uo = "screenshot",
  Ro = "shutdown",
  No = "upgrade";
class Mo {
  constructor() {
    (this.onDisconnectListener = this.onDisconnectListener.bind(this)),
      (this.onMessageListener = this.onMessageListener.bind(this));
  }
  connect(e) {
    (this.listener = e),
      (this.port = chrome.runtime.connectNative(Me)),
      this.port.onMessage.addListener(this.onMessageListener),
      this.port.onDisconnect.addListener(this.onDisconnectListener);
  }
  onMessageListener(e) {
    console.log("Native agent sent a message=" + JSON.stringify(e)),
      this.listener(e);
  }
  onDisconnectListener() {
    chrome.runtime.lastError &&
      console.log(
        "Native agent disconnected due to error=" +
          JSON.stringify(chrome.runtime.lastError)
      ),
      (this.port = null),
      (this.listener = null);
  }
  get isConnected() {
    return null != this.port;
  }
  sendMessage(e) {
    if (this.port)
      try {
        this.port.postMessage(e),
          console.log("Native agent received a message=" + JSON.stringify(e));
      } catch (e) {
        Ut(e.message, j)
          ? (this.port = null)
          : console.log("Native agent message sent error=" + e.message);
      }
    return null != this.port;
  }
  closeApp(e, t) {
    return this.sendMessage({ action: Eo, app: e, userId: t });
  }
  handshake() {
    return this.sendMessage({
      action: Lo,
      udid: Le.deviceUdid,
      server: Le.serverUrl,
    });
  }
  requestScreenshot(e, t, o) {
    const n = { url: e, action: Uo };
    return t && (n.maxWidth = t), o && (n.maxHeight = o), this.sendMessage(n);
  }
  updateLogging(e) {
    return this.sendMessage({ action: Ao, isActive: e });
  }
  requestAppList(e) {
    return this.sendMessage({ action: _o, userId: e });
  }
  shutdown() {
    return this.sendMessage({ action: Ro });
  }
  requestUpgrade(e, t, o) {
    const n = { action: No, version: e, url: t, sha: o };
    return this.sendMessage(n);
  }
}
var qo = new Mo();
async function xo(e) {
  const t = e.app,
    o = e.userId;
  qo.isConnected && qo.closeApp(t, o)
    ? console.log("'" + t + "' app close requested from native agent")
    : (console.log("Cannot close '" + t + "' app, native agent not connected"),
      Ue.sendCommand({
        response: e.requestType,
        app: t,
        isClosed: !1,
        error: "Native agent is not connected",
      }));
}
async function Oo(e) {
  const t = e.tabId,
    o = e.requestType,
    n = e.userId;
  je(t).then(() => {
    Ue.sendCommand({ response: o, tabId: t, userId: n, isClosed: !0 });
  });
}
async function Do(e) {
  const t = e.tabId;
  await Ve(t),
    Ue.sendCommand({ response: e.requestType, tabId: t, userId: e.userId });
}
async function Ho(e) {
  Le.chatMessages.push(e.chatMessage), (Le.hasUnreadChatMessages = !0), qt();
  try {
    if ((await Jt(e.chatMessage), Le.playChatAlert)) {
      const e = new Audio("https://deviceconsole.securly.com/sound/chat.wav");
      await e.play();
    }
  } catch (e) {
    console.log("Failed to update chat status on incoming message");
  }
}
async function Po(e) {
  const t = e.sessionId ? e.sessionId : null,
    o = !!t,
    n = !!e.showNotifications,
    s = !!e.maximizeFocused,
    r = !!e.premium;
  if (((Le.maximizeFocusedWindow = s), o && Le.sessionId === t))
    console.log("Same session. Continue");
  else if (o || null !== Le.sessionId) {
    if (
      (o || (await pt()),
      o && r
        ? (qo.connect(Ft), qo.isConnected && qo.handshake())
        : qo.isConnected && qo.shutdown(),
      Le.shareScreenHandler && Fo(),
      oo(),
      await Bo(t, e, qo.isConnected),
      (Le.conferenceUrl = null),
      n &&
        (o
          ? po(
              ye,
              "Class session is active",
              "Your device could be monitored and remotely managed by a teacher"
            )
          : po(
              ye,
              "No active class session",
              "Your device is not monitored and cannot be remotely managed by a teacher"
            )),
      o && (await Jo(t)),
      s)
    ) {
      const e = await Pe();
      if (e)
        try {
          await Fe(e.id, { state: "maximized" });
        } catch (e) {
          console.log("Cannot maximize window: " + e);
        }
    }
    Ht();
  } else console.log("Session already had been finished. Continue");
}
async function Wo(e) {
  (Le.canRaiseHand = !!e.allowHandRaise),
    (Le.isHandRaised = !1),
    (Le.canStartChat = !!e.canStartChat),
    (Le.playChatAlert = !!e.playChatAlertToStudent);
}
async function Bo(e, t, o) {
  const n = !!e;
  n
    ? chrome.webRequest.onCompleted.hasListener(ko) ||
      chrome.webRequest.onCompleted.addListener(ko, {
        urls: ["<all_urls>"],
        types: ["main_frame"],
      })
    : chrome.webRequest.onCompleted.removeListener(ko),
    null != Le.closeTabsTimeout &&
      (clearTimeout(Le.closeTabsTimeout), (Le.closeTabsTimeout = null)),
    (Le.sessionId = e);
  const s = !!t.allowHandRaise,
    r = !!t.closeTabs,
    i = parseInt(t.closeTabsWaitSeconds),
    a =
      "number" == typeof parseInt(t.maxOpenTabs) ? parseInt(t.maxOpenTabs) : 0,
    c = t.chatMessages,
    l = !!t.forceOpenChat,
    d = !!t.canStartChat,
    u = !!t.playChatAlertToStudent,
    h = !!t.premium,
    m = t.idleTimeout;
  (Le.canRaiseHand = s),
    (Le.isHandRaised = !1),
    (Le.announce = null),
    (Le.hasUnreadChatMessages = !1),
    (Le.chatMessages = c || []),
    (Le.forceOpenChat = l),
    (Le.canStartChat = d),
    (Le.playChatAlert = u),
    (Le.maxOpenTabs = a),
    no(n, o),
    ro(h && n),
    qt(),
    co(n),
    xt(m),
    await Jt(),
    await Dt(),
    r &&
      ("number" == typeof i && i > 0
        ? (await Kt(i),
          (Le.closeTabsTimeout = setTimeout(async function () {
            console.log("Close tabs on session start after timeout"),
              await Zt(await Oe({}), !Le.isChromeBook),
              (Le.closeTabsTimeout = null);
          }, 1e3 * i)))
        : (console.log("Close tabs on session start"),
          await Zt(await Oe({}), !Le.isChromeBook)));
}
function Fo() {
  clearInterval(Le.shareScreenHandler),
    (Le.capturedScreen = null),
    (Le.shareScreenHandler = null),
    Ae.noShareScreenIcon(),
    po(
      ke,
      "Screen sharing ended",
      "Your teacher has stopped sharing your screen"
    );
}
async function Jo(e) {
  const t = function (e, t) {
      if (!e || !e[0] || !e[0].url) return;
      const o = e[0],
        n = Co(o.url);
      (n && -1 !== n.indexOf("chrome-extension")) ||
        To.saveUrl(t, new Rt(n, o.title));
    },
    o = await Oe({ lastFocusedWindow: !0, active: !0 });
  if (o.length > 0) t(o, e);
  else {
    t(await Oe({ active: !0 }), e);
  }
}
async function zo() {
  (Le.isHandRaised = !1), Ae.clearRaiseHandIcon();
}
async function jo(e) {
  const t = e.url,
    o = e.lockToSession;
  if (!t && null !== Le.conferenceUrl)
    return (
      await Le.clearWhitelist(),
      qt(),
      await Dt(),
      void (Le.conferenceUrl = null)
    );
  Le.conferenceUrl !== t && (Le.conferenceUrl = t);
  try {
    const e = await ze({ url: t });
    if (((Le.conferenceTabId = e.id), o)) {
      const e = [Vo(t)];
      await Le.saveBlockedInfo(null, le),
        await Le.saveWhitelist(e),
        qt(),
        await Dt();
    }
  } catch (e) {
    console.log("Cannot open tab for conference. Error=" + e);
  }
}
function Vo(e) {
  return e.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");
}
async function Go(e) {
  let t = !1;
  if (qo.isConnected) {
    qo.requestAppList(e.userId) &&
      (console.log("App list requested from native agent"), (t = !0));
  }
  let o = null;
  const n = await Oe({ lastFocusedWindow: !0, active: !0 });
  n.length > 0 && (o = n[0]);
  const s = await Oe({});
  console.log("Got " + s.length + " tabs");
  let r = [],
    i = -1;
  s.forEach(function (e, t) {
    const n = { id: e.id, url: e.url, title: e.title };
    null != o && e.id === o.id && (i = t), r.push(n);
  }),
    -1 !== i && r.splice(0, 0, r.splice(i, 1)[0]),
    Ue.sendCommand({
      isAppListRequested: t,
      response: e.requestType,
      tabs: r,
      userId: e.userId,
    });
}
async function Xo(e) {
  console.log("Lock screen requested and confirmed"),
    await Le.clearWhitelist(),
    await Le.saveBlockedInfo(e.screenBlockMessage, ce),
    qt(),
    Ht();
  try {
    (Le.blockWindowId = await nt()), await Be(Le.blockWindowId);
  } catch (e) {
    console.log("Cannot create lock window: " + e);
  }
  await Dt();
}
async function Qo() {
  if (
    (console.log("Unlock requested and confirmed"),
    await Le.saveBlockedInfo(null, le),
    await Le.clearWhitelist(),
    (Le.canvasAssignmentIds = []),
    qt(),
    Ht(),
    0 !== Le.blockWindowId)
  )
    try {
      await rt(Le.blockWindowId);
    } catch (e) {
      console.log("Error while closing block window: " + e);
    }
  await Dt();
}
async function Yo(e) {
  (Le.announce = e.teacherMessage),
    (Le.teacherName = e.teacherName),
    (Le.teacherId = e.teacherId),
    qt(),
    await Dt(),
    Ue.sendCommand(ao(!1));
}
async function $o(e) {
  console.log("Got blocklist");
  let t = null,
    o = null,
    n = null;
  e.blocklist && (t = e.blocklist),
    e.customBlocklist && ((o = e.customBlocklist), (n = e.customBlocklistName)),
    await Le.saveBlocklist(t),
    await Le.saveCustomBlocklist(o, n);
}
async function Zo(e) {
  console.log("Got open site command");
  const t = e.urls,
    o = await De();
  o && 0 !== o.length ? await $t(t) : await We(t);
}
async function Ko(e) {
  if (e.deviceId) {
    console.log("Got screen share request"), qt();
    const t = {
        command: "requestShareScreen",
        userId: e.userId,
        deviceId: e.deviceId,
        lock: e.lock,
      },
      o = await Oe({});
    for (const e of o)
      if ("number" == typeof e.id)
        try {
          await Ke(e.id, t);
        } catch (e) {
          console.log("Error while requesting screen share: " + e);
        }
  } else Fo();
}
async function en(e) {
  console.log("Got site lock command"),
    await Le.saveBlockedInfo(null, le),
    await Le.saveWhitelist(e.whitelistPatterns),
    (Le.lockedToCourseWorkResources = !!e.courseWorkResources),
    Le.lockedToCourseWorkResources && (Le.canvasAssignmentIds = to(e.urls)),
    qt(),
    await eo(e.urls, e.closeTabs, e.notOpenTabs);
}
async function tn() {
  return new Promise(async (e, o) => {
    if (
      (console.log("Needs update check. Current version=" + t),
      Le.updateCheckDate.getTime() < new Date().getTime())
    ) {
      console.log("Checking for extension update");
      const e = new Date();
      e.setTime(e.getTime() + 36e5),
        await Le.saveUpdateCheckDate(e),
        chrome.runtime.requestUpdateCheck(async (e) => {
          if (e === Se)
            return (
              console.log("Extension update available, will reload"),
              void chrome.runtime.reload()
            );
          if (e === Ie) {
            const e = new Date();
            e.setTime(e.getTime() + 144e5), await Le.saveUpdateCheckDate(e);
          }
          on(), o(z + ". Status=" + e);
        });
    } else on(), o(z + ". Next check date is " + Le.updateCheckDate);
  });
}
function on() {
  chrome.alarms.create(he, { delayInMinutes: 5 }),
    console.log("Schedule app restart in 5 minutes");
}
async function nn(e) {
  qo.requestUpgrade(e.version, e.url, e.sha) &&
    chrome.alarms.create(pe, { delayInMinutes: 2 });
}
const sn = async function (e) {
  it()
    .then((t) => {
      const o = { response: e.requestType };
      Ue.sendCommand(Object.assign(o, t));
    })
    .catch((e) => {
      console.log("Failed to get location: " + e);
    });
};
async function rn(e) {
  const t = e.udid;
  console.log("DeviceUdid set to: " + t),
    Re || Mt.clearBadge(),
    await Le.saveDeviceUdid(t);
}
async function an(e) {
  throw (
    ("function" == typeof updateContactAdminButtonVisibility
      ? updateContactAdminButtonVisibility(!1)
      : Mt.markNotAuthorized(),
    (Le.loginErrorReason = e.reason),
    await Le.saveDeviceUdid(null),
    Ne &&
      (chrome.runtime.onMessage.addListener(lo),
      console.log("MESSAGE LISTENER ADDED"),
      chrome.browserAction.onClicked.addListener(bt)),
    await Ze(),
    J)
  );
}
async function cn(e) {
  "function" == typeof updateDeviceInfo &&
    updateDeviceInfo(Le.deviceUdid, e.deviceName),
    await Le.saveDeviceName(e.deviceName);
}
async function ln(e) {
  await Le.saveServerUrl(e.serverUrl), Ue.updateUrl(e.serverUrl);
}
async function dn(e) {
  const t = e.shouldSendLogs;
  if (
    (void 0 !== pn && (pn.logEnabled = t),
    t
      ? chrome.alarms.create(ge, { periodInMinutes: 5 })
      : chrome.alarms.clear(ge),
    void 0 !== qo && qo.isConnected)
  ) {
    qo.updateLogging(t) && console.log("Native agent logging updated");
  }
  console.log("Logging updated to " + t + " at " + new Date());
}
async function un(e) {
  if (
    (Ne && ((Le.studentId = e.studentId), (Le.studentName = e.studentName)), Re)
  ) {
    const t = e[te],
      o = e[$],
      n = e[G],
      s = e[oe],
      r = e[ee],
      i = e[Z],
      a = e[K];
    await Le.saveDeviceInfo(t, o, n, s, r, i, a),
      updateOrgAndScreen(),
      updateContactAdminButtonVisibility(!0 === Le.isContactAdminAllowed),
      updateDeviceInfo(Le.deviceUdid, o);
  }
  (Le.isLoggedIn = !0),
    console.log(
      "Complete login routine. Screen " +
        (Le.isScreenLocked
          ? "is locked with text '" + Le.blockedText + "'"
          : " is not locked")
    );
}
async function hn(e) {
  const t = { seq: e.seq, response: h, modeType: e.modeType };
  return (
    Re &&
      (console.log("Enable lost mode requested and confirmed"),
      requestBlockScreen(e[oe], e[G], e[ee], e[K], e.allowContactAdmin),
      updateDeviceInfo(Le.deviceUdid, Le.deviceName),
      updateSyncDate(),
      await Le.saveBlockedInfo(e[oe], e[G], e[ee], e[K], e[Z])),
    t
  );
}
async function mn(e) {
  let t = !1;
  if (qo.isConnected) {
    const o = _t(e.url);
    t = qo.requestScreenshot(o, e.maxWidth, e.maxHeight);
  }
  t ? console.log("Screenshot requested from native agent") : gn(e);
}
async function gn(e) {
  console.log("Screenshot requested");
  const t = await Oe({ currentWindow: !0, active: !0 });
  if (t.length > 0) {
    const o = t[0].url,
      n = t[0].title;
    try {
      const t = null !== Le.capturedScreen ? Le.capturedScreen : await Ge();
      void 0 !== o && (e.tabUrl = o),
        void 0 !== n && (e.tabTitle = n),
        Tt(t, e);
    } catch (e) {
      console.log("Error capture visible tab: " + e);
    }
  } else console.log("No tabs found to capture");
}
(Te.chrome_auth_confirm = rn),
  (Te[w] = cn),
  (Te.chrome_change_server_url = ln),
  (Te[b] = an),
  (Te[y] = sn),
  (Te[C] = dn),
  (Te.chrome_login_confirmation = un),
  (Te[O] = mn),
  (Te.chrome_blocklist = $o),
  (Te[E] = Ho),
  (Te.chrome_session = Po),
  (Te.chrome_session_update = Wo),
  (Te.chrome_clear_raised_hand = zo),
  (Te[U] = xo),
  (Te.chrome_close_tab = Oo),
  (Te.chrome_focus_tab = Do),
  (Te.chrome_get_tabs = Go),
  (Te.chrome_lock_screen = Xo),
  (Te.chrome_open_site = Zo),
  (Te[D] = Ko),
  (Te.chrome_site_lock = en),
  (Te[P] = Yo),
  (Te.chrome_unlock = Qo),
  (Te[I] = tn),
  (Te.chrome_teacher_screen_share = jo),
  (Te.chrome_windows_agent_upgrade = nn),
  st();
const fn = console.log;
function pn(e) {
  if (("function" == typeof fn && fn.apply(this, arguments), pn.logEnabled)) {
    const t = "/agent/chrome/debug",
      o = new XMLHttpRequest();
    if (
      ((o.timeout = ve),
      (o.ontimeout = function () {
        fn.apply(null, ["Timeout while sending logs to the server"]);
      }),
      Le)
    ) {
      const n = Le.deviceUdid ? Le.deviceUdid : Le.directoryDeviceId,
        s = Le.serverUrl + t;
      o.open("POST", s),
        o.setRequestHeader(we, n),
        o.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
      const r = {
        udid: n,
        logNum: pn.logCount,
        logString: e,
        logSource: "extension",
      };
      (pn.logCount += 1), o.send(JSON.stringify(r));
    }
  }
}
(console.log = pn), (pn.logEnabled = !0), (pn.logCount = 0);
