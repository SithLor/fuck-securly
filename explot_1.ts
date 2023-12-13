let _Date = null


fetch("https://securly.com/parents/api/requestLogin", {
    method: "POST",
    body:{
        token:"g",
        password:"adcd"
    }
}).then(function(response) {
    console.log(response.body);})

$.ajax({
    url:"https://securly.com/parents/api/requestLogin",
    data:{token:"g",password:"adcd"}
}).done(function(html) {
    console.log(html);
})