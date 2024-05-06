const DATA_URL = "data:"

const data_type = {
    text_html = "text/html",
    text_plain = "text/plain"
}

<<<<<<< HEAD
function gen_data_url(type,base){
    if (base ===true ){
=======
const body = document.querySelector("body");
>>>>>>> b156e3d85b5a45f3067777edba95aaba8218b27e

<<<<<<< HEAD
    }
}

//go to data:text/html,%3Ch1%3EHello%2C%20World%21%3C%2Fh1%3E
//does not work?

//https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs#datatexthtml3cscript3ealert2827hi27293b3c2fscript3e
=======
for (let index = 0; index < 1000; index++) {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = "https://securly.com"
    body.appendChild(iframe);
}

//site:amazonaws.com
>>>>>>> b156e3d85b5a45f3067777edba95aaba8218b27e