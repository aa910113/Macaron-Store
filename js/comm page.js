//顯示會員帳號和nav bar功能
(()=>{
    let member = JSON.parse(localStorage.getItem('user'));
    let memberAcc = document.querySelector(".member_acc");
    let navBar = document.getElementById("navbarToggleExternalContent");
    let str = "";
    let navStr = "";
    if(member === null){
      str += `<a class="mr-2" href="shopping cart.html"><i class="fa fa-shopping-cart" aria-hidden="true"></i></a>
      <button type="button" class="btn btn-link" data-toggle="modal" data-target="#exampleModalCenter"><i class="fas fa-user-circle">登入</i></button>`
      navStr += `
      <div class="bg-dark p-1">
        <a href="index.html" role="button" class="btn btn-secondary btn-lg btn-block">首頁</a>
      </div>
      <div class="bg-dark p-1">
        <a href="shopping cart.html" role="button" class="btn btn-secondary btn-lg btn-block">購物車</a>
      </div>
      <div class="bg-dark p-1">
        <a href="#exampleModalCenter" data-toggle="modal" role="button" class="btn btn-secondary btn-lg btn-block">個人訊息</a>
      </div>
      <div class="bg-dark p-1">
        <a href="#exampleModalCenter" data-toggle="modal" role="button" class="btn btn-secondary btn-lg btn-block">歷史紀錄</a>
      </div>`
    }else if(member !== null){
      str += `<a class="mr-2" href="shopping cart.html"><i class="fa fa-shopping-cart" aria-hidden="true"></i></a>
      <div class="dropdown">
      <a class="btn btn-secondary dropdown-toggle w-100 ml-3" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      ${member.email}
      </a>
    
      <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
        <a class="dropdown-item" href="#">登出</a>
      </div>
    </div>`
      navStr +=`
      <div class="bg-dark p-1">
        <a href="index.html" role="button" class="btn btn-secondary btn-lg btn-block">首頁</a>
      </div>
      <div class="bg-dark p-1">
        <a href="shopping cart.html" role="button" class="btn btn-secondary btn-lg btn-block">購物車</a>
      </div>
      <div class="bg-dark p-1">
        <a href="personal.html" role="button" class="btn btn-secondary btn-lg btn-block">個人訊息</a>
      </div>
      <div class="bg-dark p-1">
        <a href="history.html" role="button" class="btn btn-secondary btn-lg btn-block">歷史紀錄</a>
      </div>`
    }
    memberAcc.innerHTML = str;
    navBar.innerHTML = navStr;
  })();
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  fetch("http://localhost:3000/products", requestOptions)
  .then(response => response.json())
  .then(jsonData =>{
    comm(jsonData)
    car(jsonData)
  })
  .catch(error => console.log('error', error));

  fetch("http://localhost:3000/members", requestOptions)
    .then(response => response.json())
    .then(jsonData =>{
      logoin(jsonData)
      registered(jsonData)
      signOut(jsonData)
    })
    .catch(error => console.log('error', error));
//登入判斷
function logoin(jsonData){
  let logoinBtn = document.querySelector(".btn-primary").addEventListener("click",()=>{
    let  userEmail = document.getElementById("exampleInputEmail1").value;
    let  userPwd = document.getElementById("exampleInputPassword1").value;
    let filterUser = [];
    for(let i=0; i<jsonData.length; i++){
      if(userEmail == "" || userPwd == ""){
        alert("請填入Email或密碼");
        return false
      }else{
        if(jsonData[i].email!==userEmail && jsonData[i].password.toString() !== userPwd){
          filterUser.push("無")
        }
        if(jsonData[i].email!==userEmail && jsonData[i].password.toString() === userPwd){
          filterUser.push("無")
        }
        if(jsonData[i].email===userEmail && jsonData[i].password.toString() !== userPwd){
          filterUser.push("e")
        }
        if(jsonData[i].email===userEmail && jsonData[i].password.toString() === userPwd){
          filterUser.push("成功")
          var xString = JSON.stringify(jsonData[i]);
          // console.log(xString)
        }
      }
    }
    let result = filterUser.filter((Element,index,arr)=>{
      return arr.indexOf(Element) === index;
    })
    // console.log(result)
    if(result.indexOf("成功")!== -1){
      localStorage.setItem('user',xString)
      window.location = "index.html"
    }else if(result.indexOf("e")!== -1){
      alert("密碼錯誤")
    }else if(result.indexOf("無")!== -1){
      alert("查無此帳號")
    }
  })
}
//註冊會員
function registered(jsonData){
  let xx = document.querySelector(".registered_btn")
  console.log(xx)
  let registeredBtn = document.querySelector(".registered_btn").addEventListener("click",()=>{
    let userEmail = document.getElementById("exampleInputEmail2").value;
    let userPwd = document.getElementById("exampleInputPassword3").value;
    let userPwdAgain = document.getElementById("exampleInputPassword4").value;
    let userNameFirst = document.querySelector(".firstName").value;
    let userNameLast = document.querySelector(".lastName").value;
    let userPhone = document.getElementById("exampleInputNumber").value;
    let userAddress = document.getElementById("inputAddress").value;
    let userFoundTime = `${new Date().getFullYear()}/${new Date().getMonth() +1}/${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
    console.log(userFoundTime)
    let filterUser = [];
    for(i=0;i<jsonData.length;i++){
      if(userEmail===""){
        filterUser.push("請輸入Email")
      }else if(userPwd===""){
        filterUser.push("請輸入密碼")
      }else if(userPwd!==userPwdAgain){
        filterUser.push("密碼不相同")
      }else if(userNameFirst===""||userNameLast===""){
        filterUser.push("請輸入姓名")
      }else if(userPhone===""){
        filterUser.push("請填入手機號碼")
      }else if(userPhone.length<10){
        filterUser.push("請輸入正確手機號")
      }else if(userAddress===""){
        filterUser.push("請填入地址")
      }else if(userEmail===jsonData[i].email){
        filterUser.push("Email已被註冊過")
      }else if(userPhone===jsonData[i].phone){
        filterUser.push("電話已被使用")
      }
    }
    let repeat = filterUser.filter((Element,index,arr)=>{
      return arr.indexOf(Element) === index;
    });
    if(repeat.indexOf("請輸入Email")!== -1){
      alert("請輸入Email")
    }else if(repeat.indexOf("請輸入密碼")!== -1 ){
      alert("請輸入密碼");
    }else if(repeat.indexOf("密碼不相同")!== -1 ){
      alert("密碼不相同");
    }else if(repeat.indexOf("請輸入姓名")!== -1 ){
      alert("請輸入姓名");
    }else if(repeat.indexOf("請填入手機號碼")!== -1 ){
      alert("請填入手機號碼");
    }else if(repeat.indexOf("請填入地址")!== -1 ){
      alert("請填入地址");
    }else if(repeat.indexOf("Email已被註冊過")!== -1 ){
      alert("Email已被註冊過");
    }else if(repeat.indexOf("電話已被使用")!== -1 ){
      alert("電話已被使用");
    }else{
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({"signuptime":userFoundTime,"name":userNameFirst+userNameLast,"password":userPwd,"email":userEmail,"phone":userPhone,"address":userAddress,"url":""});
      localStorage.setItem('user',raw)

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch("http://localhost:3000/members", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    }
  })
}
//會員登出
function signOut(jsonData){
    let out = document.querySelector(".dropdown-item").addEventListener("click",()=>{
      localStorage.removeItem("user");
      window.location.reload("index.html");
    })
    console.log(out)
}
//渲染
function comm(jsonData){
  let commInformation = document.querySelector(".single_page_information");
  let commId = JSON.parse(localStorage.getItem('commId')).id;
  let photoCarousel = document.querySelector(".carousel-inner")
  let str = "";
  let photoStr = "";
  // console.log(photoCarousel)
  for(let i=0;i<jsonData.length;i++){
    if(jsonData[i].id.toString()===commId){
      str +=`
      <div class="col-sm">
        <h1>${jsonData[i].name}</h1>
      </div>
      <div class="col-sm">
        <p>${jsonData[i].introduction}</p>
      </div>
      <div class="col-sm">
        <span class="d-flex flex-row-reverse">$${jsonData[i].price}</span>
      </div>
      <div class="col-sm">
        <input class="xx" type="number" name="quantity" min="0">
        <button type="button" class="btn btn-outline-secondary">加入購物車</button>
      </div>
      <div class="col-sm">
        <a href="index.html" class="btn btn-outline-dark" role="button" aria-pressed="true">回上一頁</a>
      </div>`
      for(x=0;x<jsonData[i].url.length;x++){
        photoStr +=`
        <div class="carousel-item">
          <img src="${jsonData[i].url[x].img}" class="d-block w-100" alt="...">
        </div>`
        }
        photoCarousel.innerHTML = photoStr;
        let photo = document.querySelector(".carousel-item")
        photo.className += " active";
    }
    commInformation.innerHTML = str;
  }
}
//加入購物車
const card = JSON.parse(localStorage.getItem('card')) || []
function xxx(){
  localStorage.setItem('card', JSON.stringify(card))
}
function car(jsonData){
  let carBtn = document.querySelector(".btn-outline-secondary").addEventListener("click",()=>{
    let quantity = document.querySelector(".xx").value;
    let commId = JSON.parse(localStorage.getItem('commId')).id;
    let amount;
    for(x=0;x<jsonData.length;x++){
      if(jsonData[x].id.toString()===commId){
        amount = jsonData[x].price
      }
    }
    if(quantity===""||quantity==="0"){
      alert("請填入數量")
    }else if(quantity!==""||quantity!=="0"){
      if(card===[]){
        card.push({"productid":commId,"num":quantity,"amount":amount})
        xxx()
      }else if(card!==[]){
        card.push({"productid":commId,"num":quantity,"amount":amount})
        xxx()
      }
    }
  })

}