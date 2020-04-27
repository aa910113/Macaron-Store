
// 獲得產品單價功能
async function getProduct() {
    const response = await fetch("http://localhost:3000/products");
    const jsondata = await response.json();
    return jsondata;
}

let url = "http://localhost:3000/orders?_page=1&_limit=3&_sort=id&_order=desc";

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
}).then(async (jsonData) => {

    // 獲得產品名稱和單價功能 + 取得資料
    let getProductData = await getProduct();
    let jsonDataArr = [];

    for (let i = 0; i < jsonData.length; i++) {
        let obj = {};
        obj.cost = 0;
        obj.ordertime = jsonData[i].ordertime;
        obj.id = jsonData[i].id;
        obj.userid = jsonData[i].userid;
        jsonData[i].purchase.forEach((item) => {
            let num = Number(item.num);
            if (Number(item.productid) === 1) {
                item.price = getProductData[0].price;
                item.cost = (num * item.price);
                obj.cost += item.cost;
            } else if (Number(item.productid) === 2) {
                item.price = getProductData[1].price;
                item.cost = (num * item.price);
                obj.cost += item.cost;
            } else if (Number(item.productid) === 3) {
                item.price = getProductData[2].price;
                item.cost = (num * item.price);
                obj.cost += item.cost;
            } else if (Number(item.productid) === 4) {
                item.price = getProductData[3].price;
                item.cost = (num * item.price);
                obj.cost += item.cost;
            } else if (Number(item.productid) === 5) {
                item.price = getProductData[4].price;
                item.cost = (num * item.price);
                obj.cost += item.cost;
            } else if (Number(item.productid) === 6) {
                item.price = getProductData[5].price;
                item.cost = (num * item.price);
                obj.cost += item.cost;
            }
        })
        jsonDataArr.push(obj)
    }

    // 渲染網頁
    let backendOrderTbody = document.querySelector(".js-order-tbody");
    backendOrderTbody.innerHTML = "";
    for (let i = 0; i < jsonDataArr.length; i++) {

        let ordertime = jsonDataArr[i].ordertime;
        let id = jsonDataArr[i].id;
        let userid = jsonDataArr[i].userid;
        let cost = jsonDataArr[i].cost;

        let str = document.createElement("tr");
        str.innerHTML = `
            <td class="align-middle">${ordertime}</td>
            <td class="align-middle">${id}</td>
            <td class="align-middle">${userid}</td>
            <td class="align-middle">${cost}</td>
            <td class="align-middle text-center">
              <button type="button" class="btn btn-outline-info btn-sm js-btn-detail"><i class="fas fa-book-open" data-btndetail=${id}> 預覽</i></button>
            </td>
            <td class="align-middle text-center">
              <button type="button" class="btn btn-outline-warning btn-sm js-btn-put"><i class="fas fa-edit" data-btnput=${id}> 修改</i></button>
            </td>
            <td class="align-middle text-center">
              <button type="button" class="btn btn-outline-danger btn-sm js-btn-delete"><i class="fas fa-trash-alt" data-btndelete=${id}> 刪除</i></button>
            </td>`;
        backendOrderTbody.appendChild(str);
    }

}).then(async () => {

    let backendOrderTbody = document.querySelector(".js-order-tbody");

    // 分頁功能 - 長按鈕
    await paginationBtns();

    // 各按鈕執行渲染各內容的 HTML
    document.querySelectorAll(".js-page-btn").forEach((item, index) => {

        // 判斷目前被選取的按鈕
        // (1) 讓所有未被選取的按鈕 設置為 false
        item.dataset.active = "false";
        // (2) 第一頁的按鈕 設置為 true
        if (index === 1) {
            item.dataset.active = "true";
        }

        item.addEventListener("click", async function (e) {

            // (3) 取得目前 active 是 ture 的按鈕，將它設置為 false
            let selectdBtn = document.querySelector('[data-active="true"]');
            if (selectdBtn) {
                selectdBtn.dataset.active = "false";
            }

            // (4) 判斷目前點擊的頁數
            let page = e.path[0].dataset.page;


            if (e.path[0].textContent === "Previous") {
                page = Number(selectdBtn.dataset.page) - 1;
            }

            if (e.path[0].textContent === "Next") {
                page = Number(selectdBtn.dataset.page) + 1;
            }

            // (5) 被點擊的時候 active 由 false 轉為 ture
            e.path[0].dataset.active = "true";

            // (6) 抓取資料後 重新渲染網頁
            let res = await fetch(`http://localhost:3000/orders?_page=${page}&_limit=3&_sort=id&_order=desc`, {
                method: "GET",
                headers: {
                    "content-type": "application/json"
                }
            })

            // 取得資料
            let resJson = await res.json();
            let getProductData = await getProduct();
            let jsonDataArr = [];

            for (let i = 0; i < resJson.length; i++) {
                let obj = {};
                obj.cost = 0;
                obj.ordertime = resJson[i].ordertime;
                obj.id = resJson[i].id;
                obj.userid = resJson[i].userid;
                resJson[i].purchase.forEach((item) => {
                    let num = Number(item.num);
                    if (Number(item.productid) === 1) {
                        item.price = getProductData[0].price;
                        item.cost = (num * item.price);
                        obj.cost += item.cost;
                    } else if (Number(item.productid) === 2) {
                        item.price = getProductData[1].price;
                        item.cost = (num * item.price);
                        obj.cost += item.cost;
                    } else if (Number(item.productid) === 3) {
                        item.price = getProductData[2].price;
                        item.cost = (num * item.price);
                        obj.cost += item.cost;
                    } else if (Number(item.productid) === 4) {
                        item.price = getProductData[3].price;
                        item.cost = (num * item.price);
                        obj.cost += item.cost;
                    } else if (Number(item.productid) === 5) {
                        item.price = getProductData[4].price;
                        item.cost = (num * item.price);
                        obj.cost += item.cost;
                    } else if (Number(item.productid) === 6) {
                        item.price = getProductData[5].price;
                        item.cost = (num * item.price);
                        obj.cost += item.cost;
                    }
                })
                jsonDataArr.push(obj)
            }

            // 渲染網頁
            backendOrderTbody.innerHTML = "";
            for (let i = 0; i < jsonDataArr.length; i++) {

                let ordertime = jsonDataArr[i].ordertime;
                let id = jsonDataArr[i].id;
                let userid = jsonDataArr[i].userid;
                let cost = jsonDataArr[i].cost;

                let str = document.createElement("tr");
                str.innerHTML = `
                    <td class="align-middle">${ordertime}</td>
                    <td class="align-middle">${id}</td>
                    <td class="align-middle">${userid}</td>
                    <td class="align-middle">${cost}</td>
                    <td class="align-middle text-center">
                      <button type="button" class="btn btn-outline-info btn-sm js-btn-detail"><i class="fas fa-book-open" data-btndetail=${id}> 預覽</i></button>
                    </td>
                    <td class="align-middle text-center">
                      <button type="button" class="btn btn-outline-warning btn-sm js-btn-put"}><i class="fas fa-edit" data-btnput=${id}> 修改</i></button>
                    </td>
                    <td class="align-middle text-center">
                      <button type="button" class="btn btn-outline-danger btn-sm js-btn-delete"><i class="fas fa-trash-alt" data-btndelete=${id}> 刪除</i></button>
                    </td>`;
                backendOrderTbody.appendChild(str);
            }

        }, false);
    })

    // 事件監聽
    backendOrderTbody.addEventListener("click", (e) => {
        // 刪除資料
        if (e.target.className == "fas fa-trash-alt") {
            let deleteId = parseInt(e.target.dataset.btndelete);
            let content = e.path[3].childNodes[3].textContent;
            if (confirm(`是否確認刪除 訂單編號 ${content} ?`)) {
                deleteBtns(deleteId);
            }
        } else {
            console.log("不是刪除按鈕");
        }

        // 修改資料
        if (e.target.className == "fas fa-edit") {
            let putId = parseInt(e.target.dataset.btnput);
            // 存取至 localStorage
            localStorage.setItem('orderPutId', putId);
            window.location.replace("backendOrderdetailModify.html");
        } else {
            console.log("不是修改按鈕");
        }

        // 預覽資料
        if (e.target.className == "fas fa-book-open") {
            let detailId = parseInt(e.target.dataset.btndetail);
            // 存取至 localStorage
            localStorage.setItem('orderDetailId', detailId);
            window.location.replace("backendOrderdetail.html");
        } else {
            console.log("不是預覽按鈕");
        }

    }, false);

}).catch((err) => {
    console.log('錯誤:', err);
})

// 分頁功能 - 長按鈕
async function paginationBtns() {
    let alldata = await fetch("http://localhost:3000/orders", {
        method: "GET",
        mode: "cors",
        redirect: "follow",
        headers: new Headers({
            // headers 加入 json 格式
            "Content-Type": "application/json"
        })
    })
    let alldataJson = await alldata.json();

    // let alldataLen = 0;
    // for (let i = 0; i < alldataJson.length; i++) {
    //     alldataLen += alldataJson[i].purchase.length
    // }

    // 按鈕長幾顆（總筆數/每頁幾筆）
    let btnNumber = Math.ceil(alldataJson.length / 3);

    // 渲染 HTML
    let pagination = document.querySelector(".js-pagination");
    pagination.innerHTML = "";

    let strInnerhtml;
    let str1 = `<li class="page-item"><a class="page-link js-page-btn" href="#" tabindex="-1" aria-disabled="true">Previous</a></li>`
    let str2 = "";
    for (let i = 0; i < btnNumber; i++) {
        str2 += `<li class="page-item"><a class="page-link js-page-btn" href="#" data-page=${i + 1}>${i + 1}</a></li>`
    }
    // 組字串
    strInnerhtml = str1 + str2 + `<li class="page-item"><a class="page-link js-page-btn" href="#">Next</a></li>`;
    pagination.innerHTML += strInnerhtml;
}

// 刪除功能
async function deleteBtns(deleteId) {
    await fetch(`http://localhost:3000/orders/${deleteId}`, {
        method: "DELETE"
    }).then(() => {
        window.location.replace("backendOrder.html");
    })
}