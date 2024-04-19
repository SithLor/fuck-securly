//eg input textboxe


const body = document.querySelector("body");

for (let index = 0; index < 1000; index++) {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = "https://securly.com"
    body.appendChild(iframe);
}

//site:amazonaws.com