// 獲得產品名稱和單價功能
async function getProduct() {
    const response = await fetch("http://localhost:3000/products");
    const jsondata = await response.json();
    return jsondata;
}

// 獲得會員資訊功能
async function getMember() {
    const response = await fetch("http://localhost:3000/members");
    const jsondata = await response.json();
    return jsondata;
}

const id = localStorage.getItem('orderDetailId');
let url = `http://localhost:3000/orders/${id}`;

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
}).then(async (data) => {

    // 獲得產品名稱和單價功能 + 獲得會員資訊功能
    let getProductData = await getProduct();
    let getMemberData = await getMember();

    // (a)取得資料 - 渲染網頁
    let orderdetailRow = document.querySelector(".js-orderdetail");
    orderdetailRow.innerHTML = "";

    let str = "";
    let id = data.id;
    let userId = data.userid;
    let ordertime = data.ordertime;
    // 出貨時間為訂單日期的 7 天後
    let exporttime = dateChange(ordertime);
    // 依照 userid 篩選會員資訊
    let personFilterData = getMemberData.filter(item => {
        return item.id === parseInt(userId);
    })

    let username = personFilterData[0].name;
    let userphone = personFilterData[0].phone;
    let useraddress = personFilterData[0].address;
    let ordername = data.ordername;
    let orderphone = data.orderphone;
    let orderaddress = data.orderaddress;

    str = `
        <div class="col-md-4 mr-3">
        <div class="d-flex flex-row m-3">
            <div class="p-2 bd-highlight text-dark font-weight-bold">訂單編號</div>
            <div class="p-2 bd-highlight">${id}</div>
        </div>
        <div class="d-flex flex-row m-3">
            <div class="p-2 bd-highlight text-dark font-weight-bold">訂單日期</div>
            <div class="p-2 bd-highlight">${ordertime}</div>
        </div>
        <div class="d-flex flex-row m-3">
            <div class="p-2 bd-highlight text-dark font-weight-bold">出貨方式</div>
            <div class="p-2 bd-highlight">貨到付款</div>
        </div>
        <div class="d-flex flex-row m-3">
            <div class="p-2 bd-highlight text-dark font-weight-bold">出貨日期</div>
            <div class="p-2 bd-highlight">${exporttime}</div>
        </div>
    </div>
    <div class="col-md-7">
        <div class="row flex-column">
            <div class="col-md-12 b-border-ziggurat rounded mb-1">
                <div class="d-flex flex-row m-3">
                    <div class="p-2 bd-highlight text-dark font-weight-bold">會員</div>
                    <div class="p-2 bd-highlight">${username}</div>
                    <div class="p-2 bd-highlight">${userphone}</div>
                </div>
                <div class="d-flex flex-row m-3">
                    <div class="p-2 bd-highlight text-dark font-weight-bold">地址</div>
                    <div class="p-2 bd-highlight">${useraddress}</div>
                </div>
            </div>
            <div class="col-md-12 b-border-ziggurat rounded">
                <div class="d-flex flex-row m-3">
                    <div class="p-2 bd-highlight text-dark font-weight-bold">收貨者</div>
                    <div class="p-2 bd-highlight">${ordername}</div>
                    <div class="p-2 bd-highlight">${orderphone}</div>
                </div>
                <div class="d-flex flex-row m-3">
                    <div class="p-2 bd-highlight text-dark font-weight-bold">收貨者地址</div>
                    <div class="p-2 bd-highlight">${orderaddress}</div>
                </div>
            </div>
        </div>
    </div>`

    orderdetailRow.innerHTML = str;

    // (b)取得資料 - 渲染網頁
    // 獲得產品名稱和單價功能
    let dataArr = [];

    data.purchase.forEach((item) => {
        let obj = {};
        obj.cost = 0;
        obj.num = Number(item.num);
        switch (Number(item.productid)) {
            case 1:
                obj.productname = getProductData[0].name;
                obj.cost = (Number(item.num) * getProductData[0].price);
                obj.tax = obj.cost + Math.round(obj.cost * 0.05);
                break;
            case 2:
                obj.productname = getProductData[1].name;
                obj.cost = (Number(item.num) * getProductData[1].price);
                obj.tax = obj.cost + Math.round(obj.cost * 0.05);
                break;
            case 3:
                obj.productname = getProductData[2].name;
                obj.cost = (Number(item.num) * getProductData[2].price);
                obj.tax = obj.cost + Math.round(obj.cost * 0.05);
                break;
            case 4:
                obj.productname = getProductData[3].name;
                obj.cost = (Number(item.num) * getProductData[3].price);
                obj.tax = obj.cost + Math.round(obj.cost * 0.05);
                break;
            case 5:
                obj.productname = getProductData[4].name;
                obj.cost = (Number(item.num) * getProductData[4].price);
                obj.tax = obj.cost + Math.round(obj.cost * 0.05);
                break;
            case 6:
                obj.productname = getProductData[5].name;
                obj.cost = (Number(item.num) * getProductData[5].price);
                obj.tax = obj.cost + Math.round(obj.cost * 0.05);
                break;
            default:
                console.log('出現錯誤');
        }
        dataArr.push(obj);
    })

    // 渲染網頁
    let orderdetailTbody = document.querySelector(".js-orderdetail-tbody");
    orderdetailTbody.innerHTML = "";
    let orderdetailTfoot = document.querySelector(".js-orderdetail-tfoot");
    orderdetailTfoot.innerHTML = "";
    let taxTotal = 0;

    for (let i = 0; i < dataArr.length; i++) {

        let productname = dataArr[i].productname;
        let productnum = dataArr[i].num;
        let cost = dataArr[i].cost;
        let tax = dataArr[i].tax;
        taxTotal += tax;

        let strTwo = document.createElement("tr");
        strTwo.innerHTML = `
            <td>${productname}</td>
            <td>${productnum}</td>
            <td>${cost}</td>
            <td>${tax}</td>`;
        orderdetailTbody.appendChild(strTwo);
    }

    let strThree = "";
    strThree = `
    <td colspan="3" class="b-text-falcon font-weight-bold">消費總金額(含稅 5%)</td>
    <td class="b-text-falcon font-weight-bold">＄${taxTotal}</td>`
    orderdetailTfoot.innerHTML = strThree;


    // (c)事件監聽 - 輸出 PDF
    document.body.addEventListener("click", (e) => {

        if (e.target.className == "fas fa-file-download") {
            outputPdf();
        } else {
            console.log("不是印出按鈕");
        }

        if (e.target.className == "fas fa-print") {
            orderPrint();
        } else {
            console.log("不是下載按鈕");
        }

    }, false);

}).catch((err) => {
    console.log('錯誤:', err);
})

// 出貨時間為訂單日期的 7 天後
function dateChange(ordertime) {
    let changeDate = new Date(ordertime);
    let dt, year, month, date, hour, minutes;
    // 轉換日期格式 (Y-m-d) + 日期加上 7 天
    year = changeDate.getFullYear();
    month = changeDate.getMonth() + 1;
    month = (month < 10) ? `0${month}` : month;
    date = changeDate.getDate() + 7;
    hour = changeDate.getHours();
    minutes = changeDate.getMinutes();
    minutes = (minutes < 10) ? `0${minutes}` : minutes;
    dt = year + "/" + month + "/" + date + " " + hour + ":" + minutes;
    return dt;
}

// 輸出 PDF
function outputPdf() {
    // l:橫向、p：縱向、預設 A4
    let doc = new jsPDF('l', 'pt', 'a3');
    // let doc = new jsPDF('p', 'mm', [290, 210]);
    html2canvas(document.body, {
        onrendered: function (canvas) {
            var image = canvas.toDataURL("image/png");
            doc.addImage(image, 'JPEG', 10, 50);
            doc.save('orderdetail.pdf');
        }
    });
}

// 開啟列印視窗
function orderPrint() {
    let text = document;
    print(text);
}



