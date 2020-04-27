// 連接資料

let url = "http://localhost:3000/products?_page=1&_limit=3&_sort=id&_order=desc";

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
  let backendListTbody = document.querySelector(".js-list-tbody");
  backendListTbody.innerHTML = "";

  for (let i = 0; i < jsonData.length; i++) {
    let imgUrl = jsonData[i].url[0].img;
    let updatetime = jsonData[i].updatetime;
    let id = jsonData[i].id;
    let name = jsonData[i].name;
    let price = jsonData[i].price;

    let str = document.createElement("tr");
    str.innerHTML = `
        <td class="align-middle">
          <img src="${imgUrl}" class="mr-3" width="64px" height="64px">
        </td>
        <td class="align-middle">${updatetime}</td>
        <td class="align-middle">${id}</td>
        <td class="align-middle">${name}</td>
        <td class="align-middle">${price}</td>
        <td class="align-middle text-center">
          <button type="button" class="btn btn-outline-warning btn-sm js-btn-put"><i class="fas fa-edit" data-btnput=${id}> 修改</i></button>
        </td>
        <td class="align-middle text-center">
          <button type="button" class="btn btn-outline-danger btn-sm js-btn-delete"><i class="fas fa-trash-alt" data-btndelete=${id}> 刪除</i></button>
        </td>`;
    backendListTbody.appendChild(str);
  }

}).then(async () => {

  let backendListTbody = document.querySelector(".js-list-tbody");

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
      // console.log(e);

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
      let res = await fetch(`http://localhost:3000/products?_page=${page}&_limit=3&_sort=id&_order=desc`, {
        method: "GET",
        headers: {
          "content-type": "application/json"
        }
      })
      let resJson = await res.json();

      backendListTbody.innerHTML = "";

      for (let i = 0; i < resJson.length; i++) {
        let imgUrl = resJson[i].url[0].img;
        let updatetime = resJson[i].updatetime;
        let id = resJson[i].id;
        let name = resJson[i].name;
        let price = resJson[i].price;

        let str = document.createElement("tr");
        str.innerHTML = `
                <td class="align-middle">
                  <img src="${imgUrl}" class="mr-3" width="64px" height="64px">
                </td>
                <td class="align-middle">${updatetime}</td>
                <td class="align-middle">${id}</td>
                <td class="align-middle">${name}</td>
                <td class="align-middle">${price}</td>
                <td class="align-middle text-center">
                  <button type="button" class="btn btn-outline-warning btn-sm js-btn-put"><i class="fas fa-edit" data-btnput=${id}> 修改</i></button>
                </td>
                <td class="align-middle text-center">
                  <button type="button" class="btn btn-outline-danger btn-sm js-btn-delete"><i class="fas fa-trash-alt" data-btndelete=${id}> 刪除</i></button>
                </td>`;
        backendListTbody.appendChild(str);
      }

    }, false);
  })

  // 事件監聽
  backendListTbody.addEventListener("click", (e) => {

    // 刪除資料
      if (e.target.className == "fas fa-trash-alt") {
      let deleteId = parseInt(e.target.dataset.btndelete);
      let content = e.path[3].childNodes[7].textContent;
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
      localStorage.setItem('listPutId', putId);
      window.location.replace("backendItemModify.html");
    } else {
      console.log("不是修改按鈕");
    }

  }, false);

}).catch((err) => {
  console.log('錯誤:', err);
})

// 分頁功能 - 長按鈕
async function paginationBtns() {
  let alldata = await fetch("http://localhost:3000/products", {
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
  await fetch(`http://localhost:3000/products/${deleteId}`, {
    method: "DELETE"
  }).then(() => {
    window.location.replace("backendList.html");
  })
}

// 查詢功能
(function (document) {
  'use strict';

  // 建立 tableFilter
  var tableFilter = (function (Arr) {

    var _input;

    // 資料輸入事件處理函數
    function _onInputEvent(e) {
      _input = e.target;
      var tables = document.getElementsByClassName(_input.getAttribute('data-table'));
      Arr.forEach.call(tables, function (table) {
        Arr.forEach.call(table.tBodies, function (tbody) {
          Arr.forEach.call(tbody.rows, _filter);
        });
      });
    }

    // 資料篩選函數，顯示包含關鍵字的列，其餘隱藏
    function _filter(row) {
      var text = row.textContent.toLowerCase(), val = _input.value.toLowerCase();
      row.style.display = text.indexOf(val) === -1 ? 'none' : 'table-row';
    }

    return {
      // 初始化函數
      init: function () {
        var inputs = document.getElementsByClassName('js-search');
        Arr.forEach.call(inputs, function (input) {
          input.oninput = _onInputEvent;
        });
      }
    };
  })(Array.prototype);

  // 網頁載入完成後，啟動 tableFilter
  document.addEventListener('readystatechange', function () {
    if (document.readyState === 'complete') {
      tableFilter.init();
    }
  });

})(document);

