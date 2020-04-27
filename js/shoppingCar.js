//顯示會員帳號和nav bar功能
(()=>{
  let member = JSON.parse(localStorage.getItem('user'));
  let memberAcc = document.querySelector(".f-member_btn");
  let navBar = document.getElementById("navbarToggleExternalContent");
  let str = "";
  let navStr = "";
  if(member === null){
    str += `<a class="mr-2" href="shopping cart.html"><i class="fa fa-shopping-cart" aria-hidden="true"></i></a>
    <button type="button" class="btn btn-link" data-toggle="modal" data-target="#exampleModalCenter"><i class="fas fa-user-circle"></i></button>`
    navStr += `
    <div class="p-1">
      <a href="index.html" role="button" class="btn btn-lg btn-block f-collapse-link">首頁</a>
    </div>
    <div class="p-1">
      <a href="shopping cart.html" role="button" class="btn btn-lg btn-block f-collapse-link">購物車</a>
    </div>
    <div class="p-1">
      <a href="#exampleModalCenter" data-toggle="modal" role="button" class="btn btn-lg btn-block f-collapse-link">個人訊息</a>
    </div>
    <div class="p-1">
      <a href="#exampleModalCenter" data-toggle="modal" role="button" class="btn btn-lg btn-block f-collapse-link">歷史紀錄</a>
    </div>
    <div class="p-1">
      <a href="backendIndex.html" data-toggle="modal" role="button" class="btn btn-lg btn-block f-collapse-link">後台登入</a>
    </div>`
  }else if(member !== null){
    str += `<a class="mr-2" href="shopping cart.html"><i class="fa fa-shopping-cart" aria-hidden="true"></i></a>
    <div class="dropdown">
      <a class="btn btn-secondary dropdown-toggle w-100 ml-3 user-acc" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      ${member.email}
      </a>
    
      <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
        <a class="dropdown-item" href="#">登出</a>
      </div>
    </div>`
    navStr +=`
    <div class="p-1">
      <a href="index.html" role="button" class="btn btn-secondary btn-lg btn-block f-collapse-link">首頁</a>
    </div>
    <div class="p-1">
      <a href="shopping cart.html" role="button" class="btn btn-secondary btn-lg btn-block f-collapse-link">購物車</a>
    </div>
    <div class="p-1">
      <a href="personal.html" role="button" class="btn btn-secondary btn-lg btn-block f-collapse-link">個人訊息</a>
    </div>
    <div class="p-1">
      <a href="history.html" role="button" class="btn btn-secondary btn-lg btn-block f-collapse-link">歷史紀錄</a>
    </div>`
  }
  memberAcc.innerHTML = str;
  navBar.innerHTML = navStr;
})();
var requestOptions = {
  method: 'GET',
  redirect: 'follow'
};

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
  let logoinBtn = document.querySelector(".log-btn").addEventListener("click",()=>{
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
      window.location.reload("shopping cart.html");
    }else if(result.indexOf("e")!== -1){
      alert("密碼錯誤")
    }else if(result.indexOf("無")!== -1){
      alert("查無此帳號")
    }
  })
}
//註冊會員
function registered(jsonData){
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
    window.location.reload("shopping cart.html");
  })
}
//渲染頁面
xx()
function xx(){
  let car = JSON.parse(localStorage.getItem('card'));
  let tbody = document.querySelector("tbody")
  let str = "";
  if(car===null&&[]){
    str +=`<tr>
    <th scope="row">1</th>
    <td>無商品</td>
    <td>$0</td>
    <td><input class="f-quantity" type="number" name="quantity"></td>
    <td>$0</td>
    <td><button type="button" class="btn btn-link"></button></td>
  </tr>`
  tbody.innerHTML = str;
  }else if(car!==null){
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    
    fetch("http://localhost:3000/products", requestOptions)
      .then(response => response.json())
      .then(jsonData =>{
        car.forEach( element => {
          jsonData.forEach(function(x) {
            if(element.productid===x.id.toString()){
              str +=`
              <tr>
                <th scope="row"><img src="${x.url[0].img}" alt="" style="width: 5rem;"></th>
                <td>${x.name}</td>
                <td>$${element.amount}</td>
                <td><input class="f-quantity" type="number" name="quantity" value="${element.num}"></td>
                <td>$${element.amount*parseFloat(element.num)}</td>
                <td><button type="button" class="btn btn-link f-deLbtn"><i class="far fa-trash-alt" data-id="${element.productid}"></i></button></td>
              </tr>`
            }
          });
        });
        tbody.innerHTML += str;
        btn()
      })
      .catch(error => console.log('error', error));
  }
};
//delete btn
function btn(){
  let deleteBtn = document.querySelectorAll('.fa-trash-alt');
  deleteBtn.forEach(item => {
    // console.log(item);
    item.addEventListener("click", function (e) {
      let datasetID = e.path[0].dataset.id;
      let car = JSON.parse(localStorage.getItem('card'));
      console.log(car)
      car.forEach(function(item, index){
        if(item.productid===datasetID){
          car.splice(index,1);
          localStorage.setItem('card',JSON.stringify(car));
          window.location = "shopping cart.html"
        }
      });
    }, false);
  })
}
//下訂單
placeAnOrder()
function placeAnOrder(){
  let member = JSON.parse(localStorage.getItem('user'));
  if(member===null){
    let logoin = document.querySelector(".btn-primary");
    logoin.setAttribute("data-toggle","modal");
    logoin.setAttribute("data-target","#exampleModalCenter");
  }else if(member!==null){
    let logoin = document.querySelector(".btn-primary");
    logoin.removeAttribute("data-toggle");
    logoin.removeAttribute("data-target");
    let order = document.querySelector(".btn-primary").addEventListener("click",()=>{
      let date = new Date();
      let xx = new Date();
      let exTime = new Date(xx.setDate(xx.getDate()+7));
      let member = JSON.parse(localStorage.getItem('user'));
      let comm = JSON.parse(localStorage.getItem('card'));
      console.log(comm)
      if(comm===null && []){
        alert("還沒有選擇商品")
      }else if(comm!==[]){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        var raw = JSON.stringify({
          "ordertime":`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`,
          "purchase":comm,
          "userid":member.id,
          "ordername":member.name,
          "orderphone":member.phone,
          "orderaddress":member.address,
          "exporttime":`${exTime.getFullYear()}/${exTime.getMonth() + 1}/${exTime.getDate()} ${date.getHours()}:${date.getMinutes()}`
        });
        
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };
    
        fetch("http://localhost:3000/orders", requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .then(localStorage.removeItem("card"))
          .catch(error => console.log('error', error));
      }
    },false)
  }
};