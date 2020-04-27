// 圖片預覽功能
let itemAddImgTbody = document.querySelector(".js-add-img");
// 儲存預覽圖片網址
let imgArr = [];
document.getElementById("js-add-btn").addEventListener("click", (e) => {

    // 渲染網頁
    let imgUrl = e.path[3].childNodes[1].value;
    // 如果沒有圖片網址 則不寫入
    if (!imgUrl) return;

    let number = new Date().getTime();
    let obj = {};
    obj.number = number;
    obj.img = imgUrl;
    imgArr.push(obj);
    let str = document.createElement("td");
    str.innerHTML = `
        <img src=${imgUrl} class="mr-3 mb-1 js-create-add-url" width="64px" height="64px" data-number=${number}>
        <button type="button" class="btn btn-outline-danger btn-sm js-btn-delete"><i class="fas fa-trash-alt" data-btndelete=${number}> 刪除</i></button>`;
    itemAddImgTbody.appendChild(str);
    e.path[3].childNodes[1].value = "";

}, false);



// 刪除預覽圖片
itemAddImgTbody.addEventListener("click", (e) => {
    console.log(e.target.className)

    if (e.target.className == "fas fa-trash-alt") {

        let deleteId = parseInt(e.target.dataset.btndelete);
        let itemUrl = document.querySelector(`[data-number="${deleteId}"]`).getAttribute("src");

        // 回傳陣列的索引值
        let findIndex = imgArr.findIndex((item) => {
            if (item.img === itemUrl) {
                return item;
            }
        })

        if (findIndex > -1) {
            if (confirm("是否確認刪除圖片 ?")) {
                imgArr.splice(findIndex, 1);
                itemAddImgTbody.innerHTML = "";

                for (let i = 0; i < imgArr.length; i++) {
                    let imgUrl = imgArr[i].img;
                    let number = imgArr[i].number;
                    let str = document.createElement("td");
                    str.innerHTML = `
                  <img src=${imgUrl} class="mr-3 mb-1 js-create-add-url" width="64px" height="64px" data-number=${number}>
                  <button type="button" class="btn btn-outline-danger btn-sm js-btn-delete"><i class="fas fa-trash-alt" data-btndelete=${number}> 刪除</i></button>`;
                    itemAddImgTbody.appendChild(str);
                }
            }

        }

    } else {
        console.log("不是刪除預覽圖片按鈕");
    }

}, false);

// 獲取新增資料
// (a)渲染網頁
let itemAddBtn = document.querySelector(".js-item-add");
itemAddBtn.addEventListener("click", (e) => {

    let name = document.getElementById("products-name").value;
    let price = document.getElementById("products-price").value;
    let introduction = document.getElementById("products-introduction").value;
    let updatetime = document.getElementById("products-updatetime").value.split("T").join(" ");

    if (!name && !price && !updatetime) return;
    // 新增資料庫資料
    fetch(`http://localhost:3000/products`, {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            updatetime: updatetime,
            name: name,
            price: price,
            introduction: introduction,
            url: imgArr
        })
    }).then(() => {
        window.location.replace("backendList.html");
    }).catch((err) => {
        console.log('錯誤:', err);
    })

}, false)


