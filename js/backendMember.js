// 連接資料

let url = "http://localhost:3000/members?_page=1&_limit=3&_sort=id&_order=desc";

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

    // 渲染網頁
    let backendMemberCard = document.querySelector(".js-member-card");
    backendMemberCard.innerHTML = "";

    for (let i = 0; i < jsonData.length; i++) {
        let imgUrl = jsonData[i].url;
        let signuptime = jsonData[i].signuptime;
        let id = jsonData[i].id;
        let name = jsonData[i].name;
        let email = jsonData[i].email;
        let phone = jsonData[i].phone;
        let address = jsonData[i].address;

        let divStr = document.createElement("div");
        divStr.classList.add("col-md-4");
        divStr.classList.add("mb-4");
        divStr.innerHTML = `
          <div class="card text-center b-border-falcon box-shadow">
            <div class="position-relative rounded-circle overflow-hidden mx-auto custom-circle-image mt-3">
              <img src="${imgUrl}" class="w-100 h-100">
            </div>
            <div class="card-body">
                <h5 class="card-title">會員編號 ${id}</h5>
                <p class="card-text">姓名 ${name}</p>
                <p class="card-text">電子信箱 ${email}</p>
            </div>
            <div class="card-footer border-top-0 bg-white">
                <div class="btn-group btn-group-sm">
                    <a href="#" class="btn btn-outline-secondary js-btn-put b-text-lemonade"><i class="fas fa-edit" data-btnput=${id}> 修改</i></a>
                    <a href="#" class="btn btn-outline-secondary js-btn-delete b-text-pastel-pink"><i class="fas fa-trash-alt" data-btndelete=${id}> 刪除</i></a>
                    <a href="#" class="btn btn-outline-secondary js-btn-more b-text-ziggurat dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown"><i class="fas fa-book-open" data-btndetail=${id}> 更多</i></a>

                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <div class="p-3">
                            <h6 class="b-text-ziggurat"><i class="fas fa-exclamation-circle"> 會員資訊</i></h6>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item">註冊時間 ${signuptime}</li>
                                <li class="list-group-item">聯絡方式 ${phone}</li>
                                <li class="list-group-item">地址 ${address}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
          </div>`;
        backendMemberCard.appendChild(divStr);

    }

}).then(async () => {

    let backendMemberCard = document.querySelector(".js-member-card");

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
            let res = await fetch(`http://localhost:3000/members?_page=${page}&_limit=3&_sort=id&_order=desc`, {
                method: "GET",
                headers: {
                    "content-type": "application/json"
                }
            })
            let resJson = await res.json();

            backendMemberCard.innerHTML = "";

            for (let i = 0; i < jsonData.length; i++) {
                let imgUrl = jsonData[i].url;
                let signuptime = jsonData[i].signuptime;
                let id = jsonData[i].id;
                let name = jsonData[i].name;
                let email = jsonData[i].email;
                let phone = jsonData[i].phone;
                let address = jsonData[i].address;
        
                let divStr = document.createElement("div");
                divStr.classList.add("col-md-4");
                divStr.classList.add("mb-4");
                divStr.innerHTML = `
                  <div class="card text-center b-border-falcon box-shadow">
                    <div class="position-relative rounded-circle overflow-hidden mx-auto custom-circle-image mt-3">
                      <img src="${imgUrl}" class="w-100 h-100">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">會員編號 ${id}</h5>
                        <p class="card-text">姓名 ${name}</p>
                        <p class="card-text">電子信箱 ${email}</p>
                    </div>
                    <div class="card-footer border-top-0 bg-white">
                        <div class="btn-group btn-group-sm">
                            <a href="#" class="btn btn-outline-secondary js-btn-put b-text-lemonade"><i class="fas fa-edit" data-btnput=${id}> 修改</i></a>
                            <a href="#" class="btn btn-outline-secondary js-btn-delete b-text-pastel-pink"><i class="fas fa-trash-alt" data-btndelete=${id}> 刪除</i></a>
                            <a href="#" class="btn btn-outline-secondary js-btn-more b-text-ziggurat dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown"><i class="fas fa-book-open" data-btndetail=${id}> 更多</i></a>
        
                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <div class="p-3">
                                    <h6 class="b-text-ziggurat"><i class="fas fa-exclamation-circle"> 會員資訊</i></h6>
                                    <ul class="list-group list-group-flush">
                                        <li class="list-group-item">註冊時間 ${signuptime}</li>
                                        <li class="list-group-item">聯絡方式 ${phone}</li>
                                        <li class="list-group-item">地址 ${address}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>`;
                backendMemberCard.appendChild(divStr);
            }

        }, false);
    })

    // 事件監聽
    backendMemberCard.addEventListener("click", (e) => {
        // console.log(e)
        // 刪除資料
        if (e.target.className == "fas fa-trash-alt") {
            let deleteId = parseInt(e.target.dataset.btndelete);
            let content = e.path[5].firstElementChild.childNodes[3].childNodes[1].textContent;
            if (confirm(`是否確認刪除 ${content} ?`)) {
                deleteBtns(deleteId);
            }
        } else {
            console.log("不是刪除按鈕");
        }

        // 修改資料
        if (e.target.className == "fas fa-edit") {
            let putId = parseInt(e.target.dataset.btnput);
            // 存取至 localStorage
            localStorage.setItem('memberPutId', putId);
            window.location.replace("backendPerson.html");
        } else {
            console.log("不是修改按鈕");
        }

    }, false);

}).catch((err) => {
    console.log('錯誤:', err);
})

// 分頁功能 - 長按鈕
async function paginationBtns() {
    let alldata = await fetch("http://localhost:3000/members", {
        method: "GET",
        mode: "cors",
        redirect: "follow",
        headers: new Headers({
            // headers 加入 json 格式
            "Content-Type": "application/json"
        })
    })
    let alldataJson = await alldata.json();
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
    await fetch(`http://localhost:3000/members/${deleteId}`, {
        method: "DELETE"
    }).then(() => {
        window.location.replace("backendMember.html");
    })
}