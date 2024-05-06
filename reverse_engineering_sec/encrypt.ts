function t(e, t) {
    return e << t | e >>> 32 - t;
}
function n(e) {
    var t, n = "";
    for(t = 7; t >= 0; t--)n += (e >>> 4 * t & 15).toString(16);
    return n;
}
function ENCRYPT(e) {
    var o
    var r
    var i
    var s
    var a
    var c 
    var l
    var d
    var u
    var f = new Array(80)
    var h = 1732584193
    var w = 4023233417
    var g = 2562383102
    var p = 271733878 
    var m = 3285377520
    var v = (e = function(e) {
        e = e.replace(/\r\n/g, "\n");
        for(var t = "", n = 0; n < e.length; n++){
            var o = e.charCodeAt(n);
            o < 128 ? t += String.fromCharCode(o) : o > 127 && o < 2048 ? (t += String.fromCharCode(o >> 6 | 192), t += String.fromCharCode(63 & o | 128)) : (t += String.fromCharCode(o >> 12 | 224), t += String.fromCharCode(o >> 6 & 63 | 128), t += String.fromCharCode(63 & o | 128));
        }
        return t;
    }(e)).length
    var y = new Array;
    for(r = 0; r < v - 3; r += 4)i = e.charCodeAt(r) << 24 | e.charCodeAt(r + 1) << 16 | e.charCodeAt(r + 2) << 8 | e.charCodeAt(r + 3), y.push(i);
    switch(v % 4){
        case 0:
            r = 2147483648;
            break;
        case 1:
            r = e.charCodeAt(v - 1) << 24 | 8388608;
            break;
        case 2:
            r = e.charCodeAt(v - 2) << 24 | e.charCodeAt(v - 1) << 16 | 32768;
            break;
        case 3:
            r = e.charCodeAt(v - 3) << 24 | e.charCodeAt(v - 2) << 16 | e.charCodeAt(v - 1) << 8 | 128;
    }
    for(y.push(r); y.length % 16 != 14;){   
        y.push(0)
    }
    for(y.push(v >>> 29), y.push(v << 3 & 4294967295), o = 0; o < y.length; o += 16){
        for(r = 0; r < 16; r++)f[r] = y[o + r];
        for(r = 16; r <= 79; r++)f[r] = t(f[r - 3] ^ f[r - 8] ^ f[r - 14] ^ f[r - 16], 1);
        for(s = h, a = w, c = g, l = p, d = m, r = 0; r <= 19; r++)u = t(s, 5) + (a & c | ~a & l) + d + f[r] + 1518500249 & 4294967295, d = l, l = c, c = t(a, 30), a = s, s = u;
        for(r = 20; r <= 39; r++)u = t(s, 5) + (a ^ c ^ l) + d + f[r] + 1859775393 & 4294967295, d = l, l = c, c = t(a, 30), a = s, s = u;
        for(r = 40; r <= 59; r++)u = t(s, 5) + (a & c | a & l | c & l) + d + f[r] + 2400959708 & 4294967295, d = l, l = c, c = t(a, 30), a = s, s = u;
        for(r = 60; r <= 79; r++)u = t(s, 5) + (a ^ c ^ l) + d + f[r] + 3395469782 & 4294967295, d = l, l = c, c = t(a, 30), a = s, s = u;
        h = h + s & 4294967295, w = w + a & 4294967295, g = g + c & 4294967295, p = p + l & 4294967295, m = m + d & 4294967295;
    }
    return (u = n(h) + n(w) + n(g) + n(p) + n(m)).toLowerCase();
}