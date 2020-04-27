// 獲得產品內容功能
let getProductData = async () => {
    const response = await fetch("http://localhost:3000/products");
    const jsondata = await response.json();
    return jsondata;
}

let pd = getProductData();
pd.then( async (jsondata) => {

    // (a-3)取得資料 - 渲染網頁
    // 最新上架商品 依照時間排序
    let pdSort = jsondata.sort(function (a, b) {
        //從大到小
        return b.updatetime > a.updatetime ? 1: -1;
    });
    
    let indexTbody = document.querySelector(".js-index-tbody");
    indexTbody.innerHTML = "";
    let str = "";
    for (let i = 0; i < 3; i++){
        let url = pdSort[i].url[0].img;
        let updatetime = pdSort[i].updatetime;
        let id = pdSort[i].id;
        let name = pdSort[i].name;
        let price = pdSort[i].price;
        str += `
        <tr>
            <td class="align-middle">
                <img src=${url} class="mr-3" width="64px" height="64px" alt="馬卡龍(綠色)">
            </td>
            <td class="align-middle">${updatetime}</td>
            <td class="align-middle">${id}</td>
            <td class="align-middle">${name}</td>
            <td class="align-middle">${price}</td>
        </tr>`
    }
    indexTbody.innerHTML += str;
})

// 獲得會員資訊功能
let getMemberData = async () => {
    const response = await fetch("http://localhost:3000/members");
    const jsondata = await response.json();
    return jsondata;
}

let md = getMemberData();
md.then((jsondata) => {

    // (a-1)取得資料 - 渲染網頁
    let indexColTwo = document.querySelector(".js-index-col-two");
    indexColTwo.innerHTML = "";
    let str = "";
    let mdLen = jsondata.length;
    str = `
    <div class="card b-border-falcon">
        <div class="card-body d-flex align-items-center b-bg-symphony p-3">
                <div class="fas fa-user fa-5x text-secondary ml-3 d-none d-sm-block"></div>
                <div class="text-center w-75">
                    <div class="display-4">${mdLen}</div>
                    <div class="h5">會員人數</div>
                </div>
        </div>
    </div>`
    indexColTwo.innerHTML += str;
})

// 獲得訂單資訊功能
let getOrderData = async () => {
    const response = await fetch("http://localhost:3000/orders");
    const jsondata = await response.json();
    return jsondata;
}

let od = getOrderData();
od.then(async (jsondata) => {

    // (a-1)取得資料 - 渲染網頁
    let indexColOne = document.querySelector(".js-index-col-one");
    indexColOne.innerHTML = "";
    let strOne = "";
    // 獲得營業額
    let money = await getMoney();
    let totalCost = 0;
    for(let i = 0; i< money.length; i++){
        totalCost += money[i].cost;
    }

    strOne = `
    <div class="card b-border-falcon">
        <div class="card-body d-flex align-items-center b-bg-symphony p-3">
            <div class="fas fa-dollar-sign fa-5x text-secondary ml-3 d-none d-sm-block"></div>
            <div class="text-center w-75">
                <div class="display-4">${totalCost}</div>
                <div class="h5">總營業額</div>
            </div>
        </div>
    </div>`
    indexColOne.innerHTML += strOne;

    let indexColThree = document.querySelector(".js-index-col-three");
    indexColThree.innerHTML = "";
    let strTwo = "";
    let odLen = jsondata.length;

    strTwo = `
    <div class="card b-border-falcon">
        <div class="card-body d-flex align-items-center b-bg-symphony p-3">
            <div class="fas fa-file-alt fa-5x text-secondary ml-3 d-none d-sm-block"></div>
            <div class="text-center w-75">
                <div class="display-4">${odLen}</div>
                <div class="h5">訂單數量</div>
            </div>
        </div>
    </div>`
    indexColThree.innerHTML += strTwo;
})

// 獲得營業額
async function getMoney() {
    // 獲得產品內容功能
    let pd = await getProductData();
    // 獲得訂單資訊功能
    let od = await getOrderData();

    // 獲得資訊
    let dataArr = [];
    for (let i = 0; i < od.length; i++) {
        od[i].purchase.forEach((item) => {
            let obj = {};
            obj.cost = 0;
            obj.num = Number(item.num);
            switch (Number(item.productid)) {
                case 1:
                    obj.productname = pd[0].name;
                    obj.cost = (Number(item.num) * pd[0].price);
                    obj.tax = obj.cost + Math.round(obj.cost * 0.05);
                    break;
                case 2:
                    obj.productname = pd[1].name;
                    obj.cost = (Number(item.num) * pd[1].price);
                    obj.tax = obj.cost + Math.round(obj.cost * 0.05);
                    break;
                case 3:
                    obj.productname = pd[2].name;
                    obj.cost = (Number(item.num) * pd[2].price);
                    obj.tax = obj.cost + Math.round(obj.cost * 0.05);
                    break;
                case 4:
                    obj.productname = pd[3].name;
                    obj.cost = (Number(item.num) * pd[3].price);
                    obj.tax = obj.cost + Math.round(obj.cost * 0.05);
                    break;
                case 5:
                    obj.productname = pd[4].name;
                    obj.cost = (Number(item.num) * pd[4].price);
                    obj.tax = obj.cost + Math.round(obj.cost * 0.05);
                    break;
                case 6:
                    obj.productname = pd[5].name;
                    obj.cost = (Number(item.num) * pd[5].price);
                    obj.tax = obj.cost + Math.round(obj.cost * 0.05);
                    break;
                default:
                    console.log('出現錯誤');
            }
            dataArr.push(obj);
        })
    }
    return dataArr;
}

// 最新上架商品 依照時間排序
async function knowTime() {
    // 獲得產品內容功能
    let pd = await getProductData(); 
    // 獲得資訊
    pdSort = pd.sort(function (a, b) {
        //從大到小
        return a.updatetime > b.updatetime ? 1: -1;
    })
    return pdSort;
}

