// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Identify": () => (/* binding */ Identify),
  "Init": () => (/* binding */ Init),
  "Login": () => (/* binding */ Login),
  "Logout": () => (/* binding */ Logout)
});

// EXTERNAL MODULE: ./node_modules/js-cookie/src/js.cookie.js
var js_cookie = __webpack_require__(808);
var js_cookie_default = /*#__PURE__*/__webpack_require__.n(js_cookie);
;// CONCATENATED MODULE: ./node_modules/jwt-decode/build/jwt-decode.esm.js
function e(e){this.message=e}e.prototype=new Error,e.prototype.name="InvalidCharacterError";var r="undefined"!=typeof window&&window.atob&&window.atob.bind(window)||function(r){var t=String(r).replace(/=+$/,"");if(t.length%4==1)throw new e("'atob' failed: The string to be decoded is not correctly encoded.");for(var n,o,a=0,i=0,c="";o=t.charAt(i++);~o&&(n=a%4?64*n+o:o,a++%4)?c+=String.fromCharCode(255&n>>(-2*a&6)):0)o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(o);return c};function t(e){var t=e.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw"Illegal base64url string!"}try{return function(e){return decodeURIComponent(r(e).replace(/(.)/g,(function(e,r){var t=r.charCodeAt(0).toString(16).toUpperCase();return t.length<2&&(t="0"+t),"%"+t})))}(t)}catch(e){return r(t)}}function n(e){this.message=e}function o(e,r){if("string"!=typeof e)throw new n("Invalid token specified");var o=!0===(r=r||{}).header?0:1;try{return JSON.parse(t(e.split(".")[o]))}catch(e){throw new n("Invalid token specified: "+e.message)}}n.prototype=new Error,n.prototype.name="InvalidTokenError";/* harmony default export */ const jwt_decode_esm = (o);
//# sourceMappingURL=jwt-decode.esm.js.map

// EXTERNAL MODULE: ./node_modules/jsrsasign/lib/jsrsasign.js
var jsrsasign = __webpack_require__(166);
;// CONCATENATED MODULE: ./microservice/js_src/securlyplatform.js
// @todo verify browser compatibility with older browsers
// @todo Add node unit tests





var Config = null;
//import * as Config from "./securlyplatform.config.js"

// We'll cache the public key here
var PublicKey = null;
var ClientId = null;

// Set the OauthClientId
async function Init(_ClientId, Issuer) {
    ClientId = _ClientId;

    Config = await (await fetch(`${Issuer}/.well-known/openid-configuration`)).json();

    return Config;
}

// Returns a Promise.  If successful that promise will return a json object with authentication
// details from the JWT token.   Otherwise a status string.
async function Identify() {
    var token;

    var use_cache = true;
    var use_securly_transparent = true;

    // Parse Debug Flags
    var q = parseQueryString();
    if (typeof q.sp_no_cache !== "undefined") {
        console.log("Disabling JWT Identity caching...")
        use_cache = false;
    }

    if (typeof q.sp_no_trans !== "undefined") {
        console.log("Disabling Securly Transparent Flow OIDC Extension...")
        use_securly_transparent = false;
    }

    // Always try to Get the token by processing url parameters if they are present
    token = await oidcIdentify();
    if (await verifyToken(token)) {
        cacheToken(token);
        console.log("Securly Token Grant from Code Flow");
        // This removes all parameters on the url, but maybe we should only eliminate our parameters?
        window.history.pushState({}, document.title, window.location.pathname);
        return jwt_decode_esm(token);
    }
    
    // Try to get the token out of the cache
    // @todo once single log out and introspection is written, validate at the introspection endpoint every five minutes
    if (use_cache) {
        token = cacheIdentify();
        if (await verifyToken(token)) {
            console.log("Securly Token Grant from Cache");
            return jwt_decode_esm(token);
        }

        // Bad token in cache
        if (token != null)
            cacheClear();
    }
    
    // Try to get the token from the securly extensions
    if (use_securly_transparent) {
        token = await securlyIdentify();
        if (await verifyToken(token)) {
            console.log("Securly Token Grant from Securly Extensions");
            cacheToken(token);
            return jwt_decode_esm(token);
        }
    }

    throw "No valid token found";
}

// Executes a top level navigation that results in the user being logged in.  
// @param redirect_uri is where the system should return after login, often just 'window.location'
// @param force_auth_mech An optional parameter that can be set to 'google' to skip the securly ui and force google auth
function Login(redirect_uri, force_auth_mech) {
    localStorage.setItem("redirect_uri", redirect_uri)

    // Create and store a random "state" value
    var state = generateRandomString();
    localStorage.setItem("pkce_state", state);

    // Create and store a new PKCE code_verifier (the plaintext random secret)
    var code_verifier = generateRandomString();
    localStorage.setItem("pkce_code_verifier", code_verifier);

    var force_auth_mech_param = ""
    if (typeof force_auth_mech !== undefined) {
        force_auth_mech_param="&force_auth_mech="+force_auth_mech
    }

    // Hash and base64-urlencode the secret to use as the challenge
    pkceChallengeFromVerifier(code_verifier).then((code_challenge) => {
        // Build the authorization URL
        var url = Config.authorization_endpoint 
            + "?response_type=code"
            + "&client_id="+encodeURIComponent(ClientId)
            + "&state="+encodeURIComponent(state)
            + "&scope="+encodeURIComponent("openid email")
            + "&redirect_uri="+encodeURIComponent(redirect_uri)
            + "&code_challenge="+encodeURIComponent(code_challenge)
            + "&code_challenge_method=S256"
            + force_auth_mech_param
            ;

        // Redirect to the authorization server
        window.location = url;        
    });
}

// Returns a Promise.
async function Logout() {
    cacheClear();

    await fetch(`${Config.issuer}/logout`, {
        credentials: 'include'    
    });
}

/**************************************
 * Helper functions below this line
 **************************************/

// Tries to get the token from the cookie
function cacheIdentify() {
    return js_cookie_default().get("securly_token")
}

// Save the token in the cookie
function cacheToken(token) {
    // @todo get cookie lifetime should come from token
    js_cookie_default().set("securly_token", token, {
        expires: 7,
        sameSite: 'Strict',
        secure: 'true'
    });
    return;
}

// Remove the token from the cache
function cacheClear() {
    js_cookie_default().remove("securly_token");
}

// Tries to get a JWT token from the code and state parameters in the url if
// they are present.  Returns a promsie for a JWT token or null
async function oidcIdentify() {
    var q = parseQueryString();
    if (!q.state || !q.code) {
        return Promise.resolve(null) // Not a bug, normal
    }

    var expected_state = localStorage.getItem("pkce_state");
    if ( expected_state != q.state) {
        return Promise.resolve(null);
    }

    try {
        var ret = await fetch(Config.token_endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: form_urlencoded({
                grant_type: "authorization_code",
                code: q.code,
                client_id: ClientId,
                redirect_uri: localStorage.getItem("redirect_uri"),
                code_verifier: localStorage.getItem("pkce_code_verifier")            
            })
        });
        return (await ret.json()).id_token;

    } catch (error) {
        console.log("Error in oidcIdentify():"+error);
        return null;
    }
}

// Uses the Securly Extension to check for an JWT token from our cookie or from
// the central system.   Returns a promise for a JWT token or a string error
async function securlyIdentify() {
    try {
        var ret = await fetch(Config.token_endpoint, {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },        
            body: form_urlencoded({
                grant_type: "securly_transparent",
                client_id: ClientId       
            })        
        });

        return (await ret.json()).id_token;
    } catch (error) {
        return("Logged Out");
    }
}    

async function verifyToken(token) {
    if (token == null)
        return false;

    // @todo Switch to verifying via JWKS and eliminate this non-standard publickey endpoint
    if (PublicKey == null)
        PublicKey = await asyncXmlHttpRequest('GET', Config.issuer+"/publickey");

    try {
        var key = jsrsasign/* KEYUTIL.getKey */.KZ.getKey(PublicKey);
    } catch (error) {
        PublicKey = null;
        throw new Error("Public Key Error");
    }

    // @todo Verify that we're verifying all required JWT fields and double check that this api call is actuallying
    // using verifying the public key and time fields
    try {
        var isValid = jsrsasign/* KJUR.jws.JWS.verifyJWT */.fs.jws.JWS.verifyJWT(token, key, {alg: ['RS256']});
    } catch (error) {
        // I don't know why a verification routine would ever throw an error
        // as opposed to returning false :(
        return false;
    }
    console.log("isValid:"+isValid);
    return isValid;
}

async function asyncXmlHttpRequest(method, url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
}

// Generate a secure random string using the browser crypto functions
function generateRandomString() {
    var array = new Uint32Array(28);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
}

// Calculate the SHA256 hash of the input text. 
// Returns a promise that resolves to an ArrayBuffer
function sha256(plain) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
}

// Base64-urlencodes the input string
function base64urlencode(str) {
    // Convert the ArrayBuffer to string using Uint8 array to convert to what btoa accepts.
    // btoa accepts chars only within ascii 0-255 and base64 encodes them.
    // Then convert the base64 encoded to base64url encoded
    //   (replace + with -, replace / with _, trim trailing =)
    return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Return the base64-urlencoded sha256 hash for the PKCE challenge
function pkceChallengeFromVerifier(v) {
    var myPromise = sha256(v).then((hashed) =>{
        return base64urlencode(hashed);
    });

    return myPromise;
}    

// Parse a query string into an object
function parseQueryString() {
    var string = window.location.search.substring(1)

    if(string == "") { return {}; }

    var segments = string.split("&").map(s => s.split("=") );
    var queryString = {};
    segments.forEach(s => queryString[s[0]] = s[1]);
    return queryString;
}

function form_urlencoded(data) {
    var ret = [];

    for (var key in data) {
        var encoded_key = encodeURIComponent(key);
        var encoded_value = encodeURIComponent(data[key]);
        ret.push(`${encoded_key}=${encoded_value}`);
    }

    ret = ret.join("&");

    return ret;
}
//#sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9TZWN1cmx5UGxhdGZvcm0vLi9ub2RlX21vZHVsZXMvand0LWRlY29kZS9idWlsZC9qd3QtZGVjb2RlLmVzbS5qcz8xMjMyIiwid2VicGFjazovL1NlY3VybHlQbGF0Zm9ybS8uL21pY3Jvc2VydmljZS9qc19zcmMvc2VjdXJseXBsYXRmb3JtLmpzPzEzZjkiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsY0FBYyxlQUFlLCtEQUErRCxxRkFBcUYsa0NBQWtDLGtHQUFrRyx5QkFBeUIsZ0JBQWdCLHNKQUFzSixVQUFVLGNBQWMsNENBQTRDLG1CQUFtQixhQUFhLGVBQWUsTUFBTSxjQUFjLE1BQU0seUNBQXlDLElBQUksbUJBQW1CLDZEQUE2RCxpREFBaUQsbUNBQW1DLElBQUksSUFBSSxTQUFTLGFBQWEsY0FBYyxlQUFlLGdCQUFnQiw2REFBNkQsbUJBQW1CLGFBQWEsSUFBSSxzQ0FBc0MsU0FBUyxvREFBb0QsMkRBQTJELHFEQUFlLENBQUMsRUFBZ0M7QUFDNXNDOzs7OztBQ0RBO0FBQ0E7O0FBRStCO0FBQ0k7QUFDSTs7QUFFdkM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDTztBQUNQOztBQUVBLG1DQUFtQyxPQUFPOztBQUUxQztBQUNBOztBQUVBO0FBQ0E7QUFDTztBQUNQOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQztBQUNuQyxlQUFlLGNBQVU7QUFDekI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGNBQVU7QUFDN0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGNBQVU7QUFDN0I7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhCO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ087QUFDUDs7QUFFQSxtQkFBbUIsY0FBYztBQUNqQztBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVcsdUJBQVc7QUFDdEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSSx1QkFBVztBQUNmO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFJLDBCQUFjO0FBQ2xCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDs7QUFFQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTOztBQUVUO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxDOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrQkFBa0IsdUNBQWM7QUFDaEMsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsMERBQXNCLGNBQWMsZUFBZTtBQUN6RSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsQzs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsc0JBQXNCLFdBQVc7O0FBRWpDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsWUFBWSxHQUFHLGNBQWM7QUFDakQ7O0FBRUE7O0FBRUE7QUFDQSIsImZpbGUiOiI3MjQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBlKGUpe3RoaXMubWVzc2FnZT1lfWUucHJvdG90eXBlPW5ldyBFcnJvcixlLnByb3RvdHlwZS5uYW1lPVwiSW52YWxpZENoYXJhY3RlckVycm9yXCI7dmFyIHI9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdyYmd2luZG93LmF0b2ImJndpbmRvdy5hdG9iLmJpbmQod2luZG93KXx8ZnVuY3Rpb24ocil7dmFyIHQ9U3RyaW5nKHIpLnJlcGxhY2UoLz0rJC8sXCJcIik7aWYodC5sZW5ndGglND09MSl0aHJvdyBuZXcgZShcIidhdG9iJyBmYWlsZWQ6IFRoZSBzdHJpbmcgdG8gYmUgZGVjb2RlZCBpcyBub3QgY29ycmVjdGx5IGVuY29kZWQuXCIpO2Zvcih2YXIgbixvLGE9MCxpPTAsYz1cIlwiO289dC5jaGFyQXQoaSsrKTt+byYmKG49YSU0PzY0Km4rbzpvLGErKyU0KT9jKz1TdHJpbmcuZnJvbUNoYXJDb2RlKDI1NSZuPj4oLTIqYSY2KSk6MClvPVwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz1cIi5pbmRleE9mKG8pO3JldHVybiBjfTtmdW5jdGlvbiB0KGUpe3ZhciB0PWUucmVwbGFjZSgvLS9nLFwiK1wiKS5yZXBsYWNlKC9fL2csXCIvXCIpO3N3aXRjaCh0Lmxlbmd0aCU0KXtjYXNlIDA6YnJlYWs7Y2FzZSAyOnQrPVwiPT1cIjticmVhaztjYXNlIDM6dCs9XCI9XCI7YnJlYWs7ZGVmYXVsdDp0aHJvd1wiSWxsZWdhbCBiYXNlNjR1cmwgc3RyaW5nIVwifXRyeXtyZXR1cm4gZnVuY3Rpb24oZSl7cmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChyKGUpLnJlcGxhY2UoLyguKS9nLChmdW5jdGlvbihlLHIpe3ZhciB0PXIuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikudG9VcHBlckNhc2UoKTtyZXR1cm4gdC5sZW5ndGg8MiYmKHQ9XCIwXCIrdCksXCIlXCIrdH0pKSl9KHQpfWNhdGNoKGUpe3JldHVybiByKHQpfX1mdW5jdGlvbiBuKGUpe3RoaXMubWVzc2FnZT1lfWZ1bmN0aW9uIG8oZSxyKXtpZihcInN0cmluZ1wiIT10eXBlb2YgZSl0aHJvdyBuZXcgbihcIkludmFsaWQgdG9rZW4gc3BlY2lmaWVkXCIpO3ZhciBvPSEwPT09KHI9cnx8e30pLmhlYWRlcj8wOjE7dHJ5e3JldHVybiBKU09OLnBhcnNlKHQoZS5zcGxpdChcIi5cIilbb10pKX1jYXRjaChlKXt0aHJvdyBuZXcgbihcIkludmFsaWQgdG9rZW4gc3BlY2lmaWVkOiBcIitlLm1lc3NhZ2UpfX1uLnByb3RvdHlwZT1uZXcgRXJyb3Isbi5wcm90b3R5cGUubmFtZT1cIkludmFsaWRUb2tlbkVycm9yXCI7ZXhwb3J0IGRlZmF1bHQgbztleHBvcnR7biBhcyBJbnZhbGlkVG9rZW5FcnJvcn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1qd3QtZGVjb2RlLmVzbS5qcy5tYXBcbiIsIi8vIEB0b2RvIHZlcmlmeSBicm93c2VyIGNvbXBhdGliaWxpdHkgd2l0aCBvbGRlciBicm93c2Vyc1xuLy8gQHRvZG8gQWRkIG5vZGUgdW5pdCB0ZXN0c1xuXG5pbXBvcnQgQ29va2llcyBmcm9tIFwianMtY29va2llXCJcbmltcG9ydCBqd3RfZGVjb2RlIGZyb20gXCJqd3QtZGVjb2RlXCJcbmltcG9ydCB7S0pVUiwgS0VZVVRJTH0gZnJvbSBcImpzcnNhc2lnblwiXG5cbnZhciBDb25maWcgPSBudWxsO1xuLy9pbXBvcnQgKiBhcyBDb25maWcgZnJvbSBcIi4vc2VjdXJseXBsYXRmb3JtLmNvbmZpZy5qc1wiXG5cbi8vIFdlJ2xsIGNhY2hlIHRoZSBwdWJsaWMga2V5IGhlcmVcbnZhciBQdWJsaWNLZXkgPSBudWxsO1xudmFyIENsaWVudElkID0gbnVsbDtcblxuLy8gU2V0IHRoZSBPYXV0aENsaWVudElkXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gSW5pdChfQ2xpZW50SWQsIElzc3Vlcikge1xuICAgIENsaWVudElkID0gX0NsaWVudElkO1xuXG4gICAgQ29uZmlnID0gYXdhaXQgKGF3YWl0IGZldGNoKGAke0lzc3Vlcn0vLndlbGwta25vd24vb3BlbmlkLWNvbmZpZ3VyYXRpb25gKSkuanNvbigpO1xuXG4gICAgcmV0dXJuIENvbmZpZztcbn1cblxuLy8gUmV0dXJucyBhIFByb21pc2UuICBJZiBzdWNjZXNzZnVsIHRoYXQgcHJvbWlzZSB3aWxsIHJldHVybiBhIGpzb24gb2JqZWN0IHdpdGggYXV0aGVudGljYXRpb25cbi8vIGRldGFpbHMgZnJvbSB0aGUgSldUIHRva2VuLiAgIE90aGVyd2lzZSBhIHN0YXR1cyBzdHJpbmcuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gSWRlbnRpZnkoKSB7XG4gICAgdmFyIHRva2VuO1xuXG4gICAgdmFyIHVzZV9jYWNoZSA9IHRydWU7XG4gICAgdmFyIHVzZV9zZWN1cmx5X3RyYW5zcGFyZW50ID0gdHJ1ZTtcblxuICAgIC8vIFBhcnNlIERlYnVnIEZsYWdzXG4gICAgdmFyIHEgPSBwYXJzZVF1ZXJ5U3RyaW5nKCk7XG4gICAgaWYgKHR5cGVvZiBxLnNwX25vX2NhY2hlICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRGlzYWJsaW5nIEpXVCBJZGVudGl0eSBjYWNoaW5nLi4uXCIpXG4gICAgICAgIHVzZV9jYWNoZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgcS5zcF9ub190cmFucyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkRpc2FibGluZyBTZWN1cmx5IFRyYW5zcGFyZW50IEZsb3cgT0lEQyBFeHRlbnNpb24uLi5cIilcbiAgICAgICAgdXNlX3NlY3VybHlfdHJhbnNwYXJlbnQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBBbHdheXMgdHJ5IHRvIEdldCB0aGUgdG9rZW4gYnkgcHJvY2Vzc2luZyB1cmwgcGFyYW1ldGVycyBpZiB0aGV5IGFyZSBwcmVzZW50XG4gICAgdG9rZW4gPSBhd2FpdCBvaWRjSWRlbnRpZnkoKTtcbiAgICBpZiAoYXdhaXQgdmVyaWZ5VG9rZW4odG9rZW4pKSB7XG4gICAgICAgIGNhY2hlVG9rZW4odG9rZW4pO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlNlY3VybHkgVG9rZW4gR3JhbnQgZnJvbSBDb2RlIEZsb3dcIik7XG4gICAgICAgIC8vIFRoaXMgcmVtb3ZlcyBhbGwgcGFyYW1ldGVycyBvbiB0aGUgdXJsLCBidXQgbWF5YmUgd2Ugc2hvdWxkIG9ubHkgZWxpbWluYXRlIG91ciBwYXJhbWV0ZXJzP1xuICAgICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoe30sIGRvY3VtZW50LnRpdGxlLCB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUpO1xuICAgICAgICByZXR1cm4gand0X2RlY29kZSh0b2tlbik7XG4gICAgfVxuICAgIFxuICAgIC8vIFRyeSB0byBnZXQgdGhlIHRva2VuIG91dCBvZiB0aGUgY2FjaGVcbiAgICAvLyBAdG9kbyBvbmNlIHNpbmdsZSBsb2cgb3V0IGFuZCBpbnRyb3NwZWN0aW9uIGlzIHdyaXR0ZW4sIHZhbGlkYXRlIGF0IHRoZSBpbnRyb3NwZWN0aW9uIGVuZHBvaW50IGV2ZXJ5IGZpdmUgbWludXRlc1xuICAgIGlmICh1c2VfY2FjaGUpIHtcbiAgICAgICAgdG9rZW4gPSBjYWNoZUlkZW50aWZ5KCk7XG4gICAgICAgIGlmIChhd2FpdCB2ZXJpZnlUb2tlbih0b2tlbikpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2VjdXJseSBUb2tlbiBHcmFudCBmcm9tIENhY2hlXCIpO1xuICAgICAgICAgICAgcmV0dXJuIGp3dF9kZWNvZGUodG9rZW4pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQmFkIHRva2VuIGluIGNhY2hlXG4gICAgICAgIGlmICh0b2tlbiAhPSBudWxsKVxuICAgICAgICAgICAgY2FjaGVDbGVhcigpO1xuICAgIH1cbiAgICBcbiAgICAvLyBUcnkgdG8gZ2V0IHRoZSB0b2tlbiBmcm9tIHRoZSBzZWN1cmx5IGV4dGVuc2lvbnNcbiAgICBpZiAodXNlX3NlY3VybHlfdHJhbnNwYXJlbnQpIHtcbiAgICAgICAgdG9rZW4gPSBhd2FpdCBzZWN1cmx5SWRlbnRpZnkoKTtcbiAgICAgICAgaWYgKGF3YWl0IHZlcmlmeVRva2VuKHRva2VuKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJTZWN1cmx5IFRva2VuIEdyYW50IGZyb20gU2VjdXJseSBFeHRlbnNpb25zXCIpO1xuICAgICAgICAgICAgY2FjaGVUb2tlbih0b2tlbik7XG4gICAgICAgICAgICByZXR1cm4gand0X2RlY29kZSh0b2tlbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aHJvdyBcIk5vIHZhbGlkIHRva2VuIGZvdW5kXCI7XG59XG5cbi8vIEV4ZWN1dGVzIGEgdG9wIGxldmVsIG5hdmlnYXRpb24gdGhhdCByZXN1bHRzIGluIHRoZSB1c2VyIGJlaW5nIGxvZ2dlZCBpbi4gIFxuLy8gQHBhcmFtIHJlZGlyZWN0X3VyaSBpcyB3aGVyZSB0aGUgc3lzdGVtIHNob3VsZCByZXR1cm4gYWZ0ZXIgbG9naW4sIG9mdGVuIGp1c3QgJ3dpbmRvdy5sb2NhdGlvbidcbi8vIEBwYXJhbSBmb3JjZV9hdXRoX21lY2ggQW4gb3B0aW9uYWwgcGFyYW1ldGVyIHRoYXQgY2FuIGJlIHNldCB0byAnZ29vZ2xlJyB0byBza2lwIHRoZSBzZWN1cmx5IHVpIGFuZCBmb3JjZSBnb29nbGUgYXV0aFxuZXhwb3J0IGZ1bmN0aW9uIExvZ2luKHJlZGlyZWN0X3VyaSwgZm9yY2VfYXV0aF9tZWNoKSB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJyZWRpcmVjdF91cmlcIiwgcmVkaXJlY3RfdXJpKVxuXG4gICAgLy8gQ3JlYXRlIGFuZCBzdG9yZSBhIHJhbmRvbSBcInN0YXRlXCIgdmFsdWVcbiAgICB2YXIgc3RhdGUgPSBnZW5lcmF0ZVJhbmRvbVN0cmluZygpO1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicGtjZV9zdGF0ZVwiLCBzdGF0ZSk7XG5cbiAgICAvLyBDcmVhdGUgYW5kIHN0b3JlIGEgbmV3IFBLQ0UgY29kZV92ZXJpZmllciAodGhlIHBsYWludGV4dCByYW5kb20gc2VjcmV0KVxuICAgIHZhciBjb2RlX3ZlcmlmaWVyID0gZ2VuZXJhdGVSYW5kb21TdHJpbmcoKTtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInBrY2VfY29kZV92ZXJpZmllclwiLCBjb2RlX3ZlcmlmaWVyKTtcblxuICAgIHZhciBmb3JjZV9hdXRoX21lY2hfcGFyYW0gPSBcIlwiXG4gICAgaWYgKHR5cGVvZiBmb3JjZV9hdXRoX21lY2ggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBmb3JjZV9hdXRoX21lY2hfcGFyYW09XCImZm9yY2VfYXV0aF9tZWNoPVwiK2ZvcmNlX2F1dGhfbWVjaFxuICAgIH1cblxuICAgIC8vIEhhc2ggYW5kIGJhc2U2NC11cmxlbmNvZGUgdGhlIHNlY3JldCB0byB1c2UgYXMgdGhlIGNoYWxsZW5nZVxuICAgIHBrY2VDaGFsbGVuZ2VGcm9tVmVyaWZpZXIoY29kZV92ZXJpZmllcikudGhlbigoY29kZV9jaGFsbGVuZ2UpID0+IHtcbiAgICAgICAgLy8gQnVpbGQgdGhlIGF1dGhvcml6YXRpb24gVVJMXG4gICAgICAgIHZhciB1cmwgPSBDb25maWcuYXV0aG9yaXphdGlvbl9lbmRwb2ludCBcbiAgICAgICAgICAgICsgXCI/cmVzcG9uc2VfdHlwZT1jb2RlXCJcbiAgICAgICAgICAgICsgXCImY2xpZW50X2lkPVwiK2VuY29kZVVSSUNvbXBvbmVudChDbGllbnRJZClcbiAgICAgICAgICAgICsgXCImc3RhdGU9XCIrZW5jb2RlVVJJQ29tcG9uZW50KHN0YXRlKVxuICAgICAgICAgICAgKyBcIiZzY29wZT1cIitlbmNvZGVVUklDb21wb25lbnQoXCJvcGVuaWQgZW1haWxcIilcbiAgICAgICAgICAgICsgXCImcmVkaXJlY3RfdXJpPVwiK2VuY29kZVVSSUNvbXBvbmVudChyZWRpcmVjdF91cmkpXG4gICAgICAgICAgICArIFwiJmNvZGVfY2hhbGxlbmdlPVwiK2VuY29kZVVSSUNvbXBvbmVudChjb2RlX2NoYWxsZW5nZSlcbiAgICAgICAgICAgICsgXCImY29kZV9jaGFsbGVuZ2VfbWV0aG9kPVMyNTZcIlxuICAgICAgICAgICAgKyBmb3JjZV9hdXRoX21lY2hfcGFyYW1cbiAgICAgICAgICAgIDtcblxuICAgICAgICAvLyBSZWRpcmVjdCB0byB0aGUgYXV0aG9yaXphdGlvbiBzZXJ2ZXJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uID0gdXJsOyAgICAgICAgXG4gICAgfSk7XG59XG5cbi8vIFJldHVybnMgYSBQcm9taXNlLlxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIExvZ291dCgpIHtcbiAgICBjYWNoZUNsZWFyKCk7XG5cbiAgICBhd2FpdCBmZXRjaChgJHtDb25maWcuaXNzdWVyfS9sb2dvdXRgLCB7XG4gICAgICAgIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScgICAgXG4gICAgfSk7XG59XG5cbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogSGVscGVyIGZ1bmN0aW9ucyBiZWxvdyB0aGlzIGxpbmVcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLy8gVHJpZXMgdG8gZ2V0IHRoZSB0b2tlbiBmcm9tIHRoZSBjb29raWVcbmZ1bmN0aW9uIGNhY2hlSWRlbnRpZnkoKSB7XG4gICAgcmV0dXJuIENvb2tpZXMuZ2V0KFwic2VjdXJseV90b2tlblwiKVxufVxuXG4vLyBTYXZlIHRoZSB0b2tlbiBpbiB0aGUgY29va2llXG5mdW5jdGlvbiBjYWNoZVRva2VuKHRva2VuKSB7XG4gICAgLy8gQHRvZG8gZ2V0IGNvb2tpZSBsaWZldGltZSBzaG91bGQgY29tZSBmcm9tIHRva2VuXG4gICAgQ29va2llcy5zZXQoXCJzZWN1cmx5X3Rva2VuXCIsIHRva2VuLCB7XG4gICAgICAgIGV4cGlyZXM6IDcsXG4gICAgICAgIHNhbWVTaXRlOiAnU3RyaWN0JyxcbiAgICAgICAgc2VjdXJlOiAndHJ1ZSdcbiAgICB9KTtcbiAgICByZXR1cm47XG59XG5cbi8vIFJlbW92ZSB0aGUgdG9rZW4gZnJvbSB0aGUgY2FjaGVcbmZ1bmN0aW9uIGNhY2hlQ2xlYXIoKSB7XG4gICAgQ29va2llcy5yZW1vdmUoXCJzZWN1cmx5X3Rva2VuXCIpO1xufVxuXG4vLyBUcmllcyB0byBnZXQgYSBKV1QgdG9rZW4gZnJvbSB0aGUgY29kZSBhbmQgc3RhdGUgcGFyYW1ldGVycyBpbiB0aGUgdXJsIGlmXG4vLyB0aGV5IGFyZSBwcmVzZW50LiAgUmV0dXJucyBhIHByb21zaWUgZm9yIGEgSldUIHRva2VuIG9yIG51bGxcbmFzeW5jIGZ1bmN0aW9uIG9pZGNJZGVudGlmeSgpIHtcbiAgICB2YXIgcSA9IHBhcnNlUXVlcnlTdHJpbmcoKTtcbiAgICBpZiAoIXEuc3RhdGUgfHwgIXEuY29kZSkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpIC8vIE5vdCBhIGJ1Zywgbm9ybWFsXG4gICAgfVxuXG4gICAgdmFyIGV4cGVjdGVkX3N0YXRlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJwa2NlX3N0YXRlXCIpO1xuICAgIGlmICggZXhwZWN0ZWRfc3RhdGUgIT0gcS5zdGF0ZSkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICAgIHZhciByZXQgPSBhd2FpdCBmZXRjaChDb25maWcudG9rZW5fZW5kcG9pbnQsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJvZHk6IGZvcm1fdXJsZW5jb2RlZCh7XG4gICAgICAgICAgICAgICAgZ3JhbnRfdHlwZTogXCJhdXRob3JpemF0aW9uX2NvZGVcIixcbiAgICAgICAgICAgICAgICBjb2RlOiBxLmNvZGUsXG4gICAgICAgICAgICAgICAgY2xpZW50X2lkOiBDbGllbnRJZCxcbiAgICAgICAgICAgICAgICByZWRpcmVjdF91cmk6IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicmVkaXJlY3RfdXJpXCIpLFxuICAgICAgICAgICAgICAgIGNvZGVfdmVyaWZpZXI6IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwicGtjZV9jb2RlX3ZlcmlmaWVyXCIpICAgICAgICAgICAgXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIChhd2FpdCByZXQuanNvbigpKS5pZF90b2tlbjtcblxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgaW4gb2lkY0lkZW50aWZ5KCk6XCIrZXJyb3IpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG59XG5cbi8vIFVzZXMgdGhlIFNlY3VybHkgRXh0ZW5zaW9uIHRvIGNoZWNrIGZvciBhbiBKV1QgdG9rZW4gZnJvbSBvdXIgY29va2llIG9yIGZyb21cbi8vIHRoZSBjZW50cmFsIHN5c3RlbS4gICBSZXR1cm5zIGEgcHJvbWlzZSBmb3IgYSBKV1QgdG9rZW4gb3IgYSBzdHJpbmcgZXJyb3JcbmFzeW5jIGZ1bmN0aW9uIHNlY3VybHlJZGVudGlmeSgpIHtcbiAgICB0cnkge1xuICAgICAgICB2YXIgcmV0ID0gYXdhaXQgZmV0Y2goQ29uZmlnLnRva2VuX2VuZHBvaW50LCB7XG4gICAgICAgICAgICBjcmVkZW50aWFsczogJ2luY2x1ZGUnLFxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG4gICAgICAgICAgICB9LCAgICAgICAgXG4gICAgICAgICAgICBib2R5OiBmb3JtX3VybGVuY29kZWQoe1xuICAgICAgICAgICAgICAgIGdyYW50X3R5cGU6IFwic2VjdXJseV90cmFuc3BhcmVudFwiLFxuICAgICAgICAgICAgICAgIGNsaWVudF9pZDogQ2xpZW50SWQgICAgICAgXG4gICAgICAgICAgICB9KSAgICAgICAgXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiAoYXdhaXQgcmV0Lmpzb24oKSkuaWRfdG9rZW47XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuKFwiTG9nZ2VkIE91dFwiKTtcbiAgICB9XG59ICAgIFxuXG5hc3luYyBmdW5jdGlvbiB2ZXJpZnlUb2tlbih0b2tlbikge1xuICAgIGlmICh0b2tlbiA9PSBudWxsKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAvLyBAdG9kbyBTd2l0Y2ggdG8gdmVyaWZ5aW5nIHZpYSBKV0tTIGFuZCBlbGltaW5hdGUgdGhpcyBub24tc3RhbmRhcmQgcHVibGlja2V5IGVuZHBvaW50XG4gICAgaWYgKFB1YmxpY0tleSA9PSBudWxsKVxuICAgICAgICBQdWJsaWNLZXkgPSBhd2FpdCBhc3luY1htbEh0dHBSZXF1ZXN0KCdHRVQnLCBDb25maWcuaXNzdWVyK1wiL3B1YmxpY2tleVwiKTtcblxuICAgIHRyeSB7XG4gICAgICAgIHZhciBrZXkgPSBLRVlVVElMLmdldEtleShQdWJsaWNLZXkpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIFB1YmxpY0tleSA9IG51bGw7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlB1YmxpYyBLZXkgRXJyb3JcIik7XG4gICAgfVxuXG4gICAgLy8gQHRvZG8gVmVyaWZ5IHRoYXQgd2UncmUgdmVyaWZ5aW5nIGFsbCByZXF1aXJlZCBKV1QgZmllbGRzIGFuZCBkb3VibGUgY2hlY2sgdGhhdCB0aGlzIGFwaSBjYWxsIGlzIGFjdHVhbGx5aW5nXG4gICAgLy8gdXNpbmcgdmVyaWZ5aW5nIHRoZSBwdWJsaWMga2V5IGFuZCB0aW1lIGZpZWxkc1xuICAgIHRyeSB7XG4gICAgICAgIHZhciBpc1ZhbGlkID0gS0pVUi5qd3MuSldTLnZlcmlmeUpXVCh0b2tlbiwga2V5LCB7YWxnOiBbJ1JTMjU2J119KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAvLyBJIGRvbid0IGtub3cgd2h5IGEgdmVyaWZpY2F0aW9uIHJvdXRpbmUgd291bGQgZXZlciB0aHJvdyBhbiBlcnJvclxuICAgICAgICAvLyBhcyBvcHBvc2VkIHRvIHJldHVybmluZyBmYWxzZSA6KFxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKFwiaXNWYWxpZDpcIitpc1ZhbGlkKTtcbiAgICByZXR1cm4gaXNWYWxpZDtcbn1cblxuYXN5bmMgZnVuY3Rpb24gYXN5bmNYbWxIdHRwUmVxdWVzdChtZXRob2QsIHVybCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9wZW4obWV0aG9kLCB1cmwpO1xuICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdHVzID49IDIwMCAmJiB0aGlzLnN0YXR1cyA8IDMwMCkge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoeGhyLnJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiB0aGlzLnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzVGV4dDogeGhyLnN0YXR1c1RleHRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZWplY3Qoe1xuICAgICAgICAgICAgICAgIHN0YXR1czogdGhpcy5zdGF0dXMsXG4gICAgICAgICAgICAgICAgc3RhdHVzVGV4dDogeGhyLnN0YXR1c1RleHRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICB4aHIuc2VuZCgpO1xuICAgIH0pO1xufVxuXG4vLyBHZW5lcmF0ZSBhIHNlY3VyZSByYW5kb20gc3RyaW5nIHVzaW5nIHRoZSBicm93c2VyIGNyeXB0byBmdW5jdGlvbnNcbmZ1bmN0aW9uIGdlbmVyYXRlUmFuZG9tU3RyaW5nKCkge1xuICAgIHZhciBhcnJheSA9IG5ldyBVaW50MzJBcnJheSgyOCk7XG4gICAgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMoYXJyYXkpO1xuICAgIHJldHVybiBBcnJheS5mcm9tKGFycmF5LCBkZWMgPT4gKCcwJyArIGRlYy50b1N0cmluZygxNikpLnN1YnN0cigtMikpLmpvaW4oJycpO1xufVxuXG4vLyBDYWxjdWxhdGUgdGhlIFNIQTI1NiBoYXNoIG9mIHRoZSBpbnB1dCB0ZXh0LiBcbi8vIFJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gYW4gQXJyYXlCdWZmZXJcbmZ1bmN0aW9uIHNoYTI1NihwbGFpbikge1xuICAgIGNvbnN0IGVuY29kZXIgPSBuZXcgVGV4dEVuY29kZXIoKTtcbiAgICBjb25zdCBkYXRhID0gZW5jb2Rlci5lbmNvZGUocGxhaW4pO1xuICAgIHJldHVybiB3aW5kb3cuY3J5cHRvLnN1YnRsZS5kaWdlc3QoJ1NIQS0yNTYnLCBkYXRhKTtcbn1cblxuLy8gQmFzZTY0LXVybGVuY29kZXMgdGhlIGlucHV0IHN0cmluZ1xuZnVuY3Rpb24gYmFzZTY0dXJsZW5jb2RlKHN0cikge1xuICAgIC8vIENvbnZlcnQgdGhlIEFycmF5QnVmZmVyIHRvIHN0cmluZyB1c2luZyBVaW50OCBhcnJheSB0byBjb252ZXJ0IHRvIHdoYXQgYnRvYSBhY2NlcHRzLlxuICAgIC8vIGJ0b2EgYWNjZXB0cyBjaGFycyBvbmx5IHdpdGhpbiBhc2NpaSAwLTI1NSBhbmQgYmFzZTY0IGVuY29kZXMgdGhlbS5cbiAgICAvLyBUaGVuIGNvbnZlcnQgdGhlIGJhc2U2NCBlbmNvZGVkIHRvIGJhc2U2NHVybCBlbmNvZGVkXG4gICAgLy8gICAocmVwbGFjZSArIHdpdGggLSwgcmVwbGFjZSAvIHdpdGggXywgdHJpbSB0cmFpbGluZyA9KVxuICAgIHJldHVybiBidG9hKFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgbmV3IFVpbnQ4QXJyYXkoc3RyKSkpXG4gICAgICAgIC5yZXBsYWNlKC9cXCsvZywgJy0nKS5yZXBsYWNlKC9cXC8vZywgJ18nKS5yZXBsYWNlKC89KyQvLCAnJyk7XG59XG5cbi8vIFJldHVybiB0aGUgYmFzZTY0LXVybGVuY29kZWQgc2hhMjU2IGhhc2ggZm9yIHRoZSBQS0NFIGNoYWxsZW5nZVxuZnVuY3Rpb24gcGtjZUNoYWxsZW5nZUZyb21WZXJpZmllcih2KSB7XG4gICAgdmFyIG15UHJvbWlzZSA9IHNoYTI1Nih2KS50aGVuKChoYXNoZWQpID0+e1xuICAgICAgICByZXR1cm4gYmFzZTY0dXJsZW5jb2RlKGhhc2hlZCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbXlQcm9taXNlO1xufSAgICBcblxuLy8gUGFyc2UgYSBxdWVyeSBzdHJpbmcgaW50byBhbiBvYmplY3RcbmZ1bmN0aW9uIHBhcnNlUXVlcnlTdHJpbmcoKSB7XG4gICAgdmFyIHN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc3Vic3RyaW5nKDEpXG5cbiAgICBpZihzdHJpbmcgPT0gXCJcIikgeyByZXR1cm4ge307IH1cblxuICAgIHZhciBzZWdtZW50cyA9IHN0cmluZy5zcGxpdChcIiZcIikubWFwKHMgPT4gcy5zcGxpdChcIj1cIikgKTtcbiAgICB2YXIgcXVlcnlTdHJpbmcgPSB7fTtcbiAgICBzZWdtZW50cy5mb3JFYWNoKHMgPT4gcXVlcnlTdHJpbmdbc1swXV0gPSBzWzFdKTtcbiAgICByZXR1cm4gcXVlcnlTdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGZvcm1fdXJsZW5jb2RlZChkYXRhKSB7XG4gICAgdmFyIHJldCA9IFtdO1xuXG4gICAgZm9yICh2YXIga2V5IGluIGRhdGEpIHtcbiAgICAgICAgdmFyIGVuY29kZWRfa2V5ID0gZW5jb2RlVVJJQ29tcG9uZW50KGtleSk7XG4gICAgICAgIHZhciBlbmNvZGVkX3ZhbHVlID0gZW5jb2RlVVJJQ29tcG9uZW50KGRhdGFba2V5XSk7XG4gICAgICAgIHJldC5wdXNoKGAke2VuY29kZWRfa2V5fT0ke2VuY29kZWRfdmFsdWV9YCk7XG4gICAgfVxuXG4gICAgcmV0ID0gcmV0LmpvaW4oXCImXCIpO1xuXG4gICAgcmV0dXJuIHJldDtcbn0iXSwic291cmNlUm9vdCI6IiJ9
