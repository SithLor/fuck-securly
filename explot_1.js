

//$.ajax({
//    url:"https://securly.com/parents/api/requestLogin",
//    data:{token:"g",password:"adcd"}
//}).done(function(html) {
//    console.log(html);
//})

const e = fetch("https://securly.com/parents/api/requestLogin", {
    method: "POST",
    body: JSON.stringify({token:'<?php echo "pwned"?>',password:"adcd"}),
    headers: {
        "Content-Type": "application/json"
    }
}).then(async (res) => {
    console.log(res);
    // Unpack the body stream
    await return res.json();

});
