let postBtn = document.getElementById("POST");
postBtn.addEventListener("click", makePost);

let photoDelBtn = document.getElementsByClassName("photo-remove")[0];
photoDelBtn.addEventListener("click", clearPhoto);

let loadLabel = document.getElementsByClassName("loadL")[0];
loadLabel.innerHTML = 'Загрузить фото : 0';
document.getElementsByName("pict[]")[0].addEventListener("change", ()=>{
    loadLabel.innerHTML = 'Загрузить фото : ' + document.getElementsByName("pict[]")[0].files.length;
});

function makePost(){
    let MESSAGE = document.getElementsByName("msg")[0].value;
    let paths = [];
    for (let i = 0; i < document.getElementsByName("pict[]")[0].files.length; ++i){
        let photoPath = document.getElementsByName("pict[]")[0].files[i].name;
        photoPath = photoPath.substr(photoPath.lastIndexOf("\\")+1, photoPath.length);
        paths.push({"type": "photo",
            "media": photoPath});
    }
    let tg = document.getElementsByName("tg")[0].checked;
    let vk = document.getElementsByName("vk")[0].checked;
    let ok = document.getElementsByName("ok")[0].checked;
    console.log(tg);
    console.log(vk);
    fetch("http://localhost:3000?upload=0",{
        mode: "no-cors",
        method: "POST",
        body: JSON.stringify({
            "name": MESSAGE, 
            "photoPath": paths,
            "vk": vk, 
            "tg": tg,
            "ok": ok
        })
    })
    .then(success => {
        console.log("Success");
    }, error => {
        console.log("Error");
    });
}

function clearPhoto(){
    loadLabel.innerHTML = 'Загрузить фото : 0';
    document.getElementsByName("pict[]")[0].value = "";
}