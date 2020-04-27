const id = localStorage.getItem('listPutId');
let url = `http://localhost:3000/products/${id}`;

fetch(url, {
    method: "GET",
    mode: "cors",
    redirect: "follow",
    headers: new Headers({
        // headers 加入 json 格式
        "Content-Type": "application/json"
    })
}).then((response) => {
    // 這裡會得到一個 ReadableStream 的物件
    // 可以透過 blob(), json(), text() 轉成可用的資訊
    return response.json();
}).then((jsonData) => {
    let data = jsonData;
    return data;
}).then((data) => {

    // (左邊)圖片編輯 
    // (a)渲染網頁 - 修改圖片
    let itemUrlModifyTbody = document.querySelector(".js-item-url-modify");
    itemUrlModifyTbody.innerHTML = "";

    data.url.forEach((item) => {
        let imgUrl = item.img;
        let number = item.number;

        let str = document.createElement("tr");
        str.innerHTML = `
        <td class="align-middle">
          <img src=${imgUrl} class="mr-3" width="64px" height="64px" data-number=${number}>
        </td>
        <td class="align-middle text-center">
            <button type="button" class="btn btn-outline-danger btn-sm js-btn-delete"><i class="fas fa-trash-alt" data-btndelete=${number}> 刪除</i></button>
        </td>`

        itemUrlModifyTbody.appendChild(str);
    });

    // (b)事件監聽 - 新增商品圖片
    document.querySelector(".js-btn-add").addEventListener("click", () => {
        let addItemUrl = document.getElementById("item-add-url").value;
        let number = new Date().getTime();
        let obj = {};
        obj.number = number;
        obj.img = addItemUrl;
        data.url.push(obj);

        // 修改資料庫資料
        fetch(`http://localhost:3000/products/${id}`, {
            method: "PATCH",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                url: data.url
            })
        }).then(() => {
            window.location.replace("backendItemModify.html");
        }).catch((err) => {
            console.log('錯誤:', err);
        })

    }, false);

    // (c)事件監聽 - 刪除商品圖片
    let itemUrlCardBody = document.querySelector(".js-item-url");
    itemUrlCardBody.addEventListener("click", async (e) => {
        // console.log(e);

        if (e.target.className == "fas fa-trash-alt") {

            let deleteId = parseInt(e.target.dataset.btndelete);
            let itemUrl = document.querySelector(`[data-number="${deleteId}"]`).getAttribute("src");
            // 回傳陣列的索引值
            let findIndex = data.url.findIndex((item) => {
                if (item.img === itemUrl) {
                    return item;
                }
            })

            if (findIndex > -1) {
                if (confirm("是否確認刪除圖片 ?")) {
                    data.url.splice(findIndex, 1);
                }
            }

            // 修改資料庫資料
            fetch(`http://localhost:3000/products/${id}`, {
                method: "PATCH",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    url: data.url
                })
            }).then(() => {
                window.location.replace("backendItemModify.html");
            }).catch((err) => {
                console.log('錯誤:', err);
            })


        } else {
            console.log("不是刪除按鈕");
        }

    }, false);

    // (右邊)文字編輯
    // (a)渲染網頁 - 修改文字內容
    let itemForm = document.querySelector(".js-item-form");
    itemForm.innerHTML = "";

    let str = "";
    let name = data.name;
    let price = data.price;
    let introduction = data.introduction;

    str = `
    <div class="form-group">
      <label for="products-name">商品名稱</label>
      <input type="text" class="form-control" id="products-name" placeholder="請輸入商品名稱" value=${name}>
    </div>

    <div class="form-group">
      <label for="products-price">商品價格</label>
      <input type="number" class="form-control" id="products-price" placeholder="請輸入商品價格" value=${price}>
    </div>

    <div class="form-group">
      <label for="products-introduction">商品介紹</label>
      <textarea class="form-control" id="products-introduction" rows="3">${introduction}</textarea>
    </div>

    <div class="text-right">
      <button type="button" class="btn btn-outline-warning js-btn-send"><i class="fas fa-paper-plane"> 確認送出</i></button>
    </div>`

    itemForm.innerHTML = str;

    // (b)事件監聽 - 送出內容
    itemForm.addEventListener("click", (e) => {

        if (e.target.className == "fas fa-paper-plane") {
            let modifyName = document.getElementById("products-name").value;
            let modifyPrice = document.getElementById("products-price").value;
            let modifyIntroduction = document.getElementById("products-introduction").value;

            // 修改資料庫資料
            fetch(`http://localhost:3000/products/${id}`, {
                method: "PATCH",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    name: modifyName,
                    price: modifyPrice,
                    introduction: modifyIntroduction
                })
            }).then(() => {
                window.location.replace("backendList.html");
            }).catch((err) => {
                console.log('錯誤:', err);
            })

        } else {
            console.log("不是送出按鈕");
        }

    }, false);


}).catch((err) => {
    console.log('錯誤:', err);
})