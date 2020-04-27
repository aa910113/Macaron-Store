const id = localStorage.getItem('memberPutId');
let url = `http://localhost:3000/members/${id}`;

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

  // (a)渲染網頁 - 修改文字內容
  let personForm = document.querySelector(".js-member-form");
  personForm.innerHTML = "";

  let str = "";
  let name = data.name;
  let url = data.url;
  let password = data.password;
  let email = data.email;
  let phone = data.phone;
  let address = data.address;

  str = `
    <div class="form-group">
      <label for="members-name">會員姓名</label>
      <input type="text" class="form-control" id="members-name" placeholder="請輸入會員姓名" value=${name}>
    </div>

    <div class="form-group">
      <label for="members-url">會員圖片</label>
      <div class="input-group">
        <input type="text" class="form-control" id="members-url" placeholder="請輸入會員圖片的網址" value=${url}>
        <div class="input-group-append">
            <button class="btn btn-outline-info js-btn-preview" type="button"><i class="fas fa-image"> 圖片預覽</i></button>
        </div>
      </div>
    </div>

    <div class="form-group">
      <label for="members-password">會員密碼</label>
      <input type="text" class="form-control" id="members-password" placeholder="請輸入會員密碼" value=${password}>
    </div>

    <div class="form-group">
      <label for="members-email">會員帳號</label>
      <input type="text" class="form-control" id="members-email" placeholder="請輸入會員帳號/電子信箱" value=${email}>
    </div>

    <div class="form-group">
      <label for="members-phone">會員電話</label>
      <input type="tel" class="form-control" id="members-phone" placeholder="請輸入會員電話" value=${phone}>
    </div>

    <div class="form-group">
      <label for="members-address">會員地址</label>
      <input type="text" class="form-control" id="members-address" placeholder="請輸入會員地址" value=${address}>
    </div>

<div class="text-right mb-3">
    <button type="button" class="btn btn-outline-warning js-btn-send"><i class="fas fa-paper-plane"> 更新資料</i></button>
</div>`

  personForm.innerHTML = str;

  // (b) 圖片預覽
  document.querySelector(".js-btn-preview").addEventListener("click", (e) => {
    document.querySelector(".js-img").src = e.path[3].childNodes[1].value;
  }, false);

  // (c)事件監聽 - 送出內容
  personForm.addEventListener("click", (e) => {

    if (e.target.className == "fas fa-paper-plane") {
      let modifyName = document.getElementById("members-name").value;
      let modifyUrl = document.getElementById("members-url").value;
      let modifyPassword = document.getElementById("members-password").value;
      let modifyEmail = document.getElementById("members-email").value;
      let modifyPhone = document.getElementById("members-phone").value;
      let modifyAddress = document.getElementById("members-address").value;

      // 修改資料庫資料
      fetch(`http://localhost:3000/members/${id}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          name: modifyName,
          password: modifyPassword,
          email: modifyEmail,
          phone: modifyPhone,
          address: modifyAddress,
          url: modifyUrl
        })
      }).then(() => {
        window.location.replace("backendMember.html");
      }).catch((err) => {
        console.log('錯誤:', err);
      })

    } else {
      console.log("不是送出按鈕");
    }

  }, false);

  // (d)獲得個人購買紀錄
  getPurchase();

}).catch((err) => {
  console.log('錯誤:', err);
})

// 獲得產品名稱和單價功能
async function getProduct() {
  const response = await fetch("http://localhost:3000/products");
  const jsondata = await response.json();
  return jsondata;
}

// 獲得個人購買紀錄
async function getPurchase() {
  const response = await fetch("http://localhost:3000/orders");
  const jsondata = await response.json();

  // 依照 userid 篩選顯示購買紀錄
  let filterdata = jsondata.filter(item => {
    return item.userid === parseInt(id);
  })

  // 獲得產品名稱和單價功能
  let getProductData = await getProduct();

  // 由產品編號替換成產品名稱
  for (let i = 0; i < filterdata.length; i++) {
    filterdata[i].purchase.forEach((item) => {
      if (Number(item.productid) === 1) {
        item.ordertime = filterdata[i].ordertime;
        item.productname = getProductData[0].name;
        item.price = getProductData[0].price;
      } else if (Number(item.productid) === 2) {
        item.ordertime = filterdata[i].ordertime;
        item.productname = getProductData[1].name;
        item.price = getProductData[1].price;
      } else if (Number(item.productid) === 3) {
        item.ordertime = filterdata[i].ordertime;
        item.productname = getProductData[2].name;
        item.price = getProductData[2].price;
      } else if (Number(item.productid) === 4) {
        item.ordertime = filterdata[i].ordertime;
        item.productname = getProductData[3].name;
        item.price = getProductData[3].price;
      } else if (Number(item.productid) === 5) {
        item.ordertime = filterdata[i].ordertime;
        item.productname = getProductData[4].name;
        item.price = getProductData[4].price;
      } else if (Number(item.productid) === 6) {
        item.ordertime = filterdata[i].ordertime;
        item.productname = getProductData[5].name;
        item.price = getProductData[5].price;
      }
    })
  }

  // 渲染網頁
  let backendPersonTbody = document.querySelector(".js-person-tbody");
  backendPersonTbody.innerHTML = "";

  for (let i = 0; i < filterdata.length; i++) {
    filterdata[i].purchase.forEach((item) => {
      let ordertime = item.ordertime;
      let productname = item.productname;
      let num = item.num;
      let cost = (num * item.price);

      let str = document.createElement("tr");
      str.innerHTML = `
      <td class="align-middle">${ordertime}</td>
      <td class="align-middle">${productname}</td>
      <td class="align-middle text-center">${num}</td>
      <td class="align-middle text-center">${cost}</td>`
      backendPersonTbody.appendChild(str);
    })

  }
}



