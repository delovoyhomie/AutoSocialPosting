let postBtn = document.getElementById("POST");
postBtn.addEventListener("click", makePost);

let photoDelBtn = document.getElementsByClassName("photo-remove")[0];
photoDelBtn.addEventListener("click", clearPhoto);

function makePost(){
    let MESSAGE = document.getElementsByName("msg")[0].value;
    let paths = [];
    for (let i = 0; i < document.getElementsByName("pict[]")[0].files.length; ++i){
        let photoPath = document.getElementsByName("pict[]")[0].files[i].name;
        photoPath = photoPath.substr(photoPath.lastIndexOf("\\")+1, photoPath.length);
        paths.push({"type": "photo",
            "media": photoPath});
    }
    fetch("http://localhost:3000?upload=0",{
        mode: "no-cors",
        method: "POST",
        body: JSON.stringify({
            "name": MESSAGE, 
            "photoPath": paths//,
        })
    })
    .then(success => {
        console.log("Success");
    }, error => {
        console.log("Error");
    });
}

function clearPhoto(){
    document.getElementsByName("pict[]")[0].value = "";
}
