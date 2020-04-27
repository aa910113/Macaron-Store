// 連接資料

let url = "http://localhost:3000/manager";

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

    // 登入(利用 Object.prototype.toString.call() 查詢資料型態)
    let btn = document.querySelector(".js-login-btn");
    btn.addEventListener("click", () => {
        let email = document.getElementById("inputEmail").value;
        let password = parseInt(document.getElementById("inputPassword").value);
        let message = [];

        if (data[0].email === email && data[0].password === password) {
            message.push("登入成功");

            Swal.fire({
                type: 'success',
                title: '登入成功'
            })

            //轉跳到其他頁面
            window.location.replace("backendIndex.html");
        }


        if (email.length === 0 && isNaN(password)) {
            message.push("欄位不可空白");

            Swal.fire({
                type: 'error',
                title: '喔喔...',
                text: '您必須填寫所有欄位!'
            })
        } else if (data[0].email !== email && data[0].password !== password) {
            message.push("查無此帳號");

            Swal.fire({
                type: 'error',
                title: '喔喔...',
                text: '查無此帳號!'
            })
        } else if (data[0].email !== email && data[0].password === password) {
            message.push("查無此帳號");

            Swal.fire({
                type: 'error',
                title: '喔喔...',
                text: '查無此帳號!'
            })
        } else if (data[0].email === email && data[0].password !== password) {
            message.push("密碼輸入錯誤");

            Swal.fire({
                type: 'error',
                title: '喔喔...',
                text: '密碼輸入錯誤!'
            })
        }


    }, false);


}).catch((err) => {
    console.log('錯誤:', err);
})



