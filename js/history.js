//顯示會員帳號和nav bar功能
(()=>{
    let member = JSON.parse(localStorage.getItem('user'));
  let memberAcc = document.querySelector(".f-member_btn");
    let navBar = document.getElementById("navbarToggleExternalContent");
    let str = "";
    let navStr = "";
    if(member === null){
        window.location = "index.html"
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
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch("http://localhost:3000/orders", requestOptions)
    .then(response => response.json())
    .then(jsonData =>{
      let data = jsonData;
        history(data)
        signOut(data)
    })
    .catch(error => console.log('error', error));
//會員登出
function signOut(data){
  let out = document.querySelector(".dropdown-item").addEventListener("click",()=>{
    localStorage.removeItem("user");
    window.location.reload("index.html");
  })
}
//渲染購買歷史
function history(data){
  fetch("http://localhost:3000/products", requestOptions)
    .then(response => response.json())
    .then(jsonData =>{
      let hiscon = document.querySelector(".hiscon");
      let user = JSON.parse(localStorage.getItem('user'));
      let str = "";
      for(let i=0;i<data.length;i++){
        if(data[i].userid===user.id){
          let itemStr = "";
          let date = data[i].ordertime
          let total = data[i].purchase
          // console.log(total)
          let year = new Date(date).getFullYear()
          let xx = new Date(date).toString()
          let commid = data[i].id
          let weekDay;
          let time;
          let n =0;
          for(let z=0;z<xx.length;z++){
            weekDay = xx[4]+xx[5]+xx[6]+"."+xx[8]+xx[9]
            time = xx[16]+xx[17]+xx[18]+xx[19]+xx[20]
          }
          let totalAmount = total.forEach(function(item){
            n+=item.num*item.amount
          })
          for(let x=0;x<total.length;x++){
            for(let y=0;y<jsonData.length;y++){
              if(total[x].productid===jsonData[y].id.toString()){
                itemStr +=`
                <li class="d-flex justify-content-around">
                  <p>${jsonData[y].name}</p>
                  <p>${total[x].num}顆</p>
                  <p>$${jsonData[y].price}</p>
                </li>`
              }
            }
          }
          str += `
          <div class="col-md-6">
            <ul class="black_dot col-md-12 w-100 p-0 d-flex justify-content-end f-history-record" 
            role="button" data-toggle="collapse" href="#multiCollapseExample${i}" role="button" aria-expanded="false" aria-controls="multiCollapseExample${i}">
              <li class="col-md-4 justify-content-content mt-3 mb-3">
                <span class="row h5">${year}</br>${weekDay}</span>
                <span class="row h6">時間 ${time}</span>
              </li>
              <li class="col-md-4 align-self-center h3 total_price">$${n}</li>
              <li class="col-md-3 p-0 d-flex align-self-center justify-content-end">
                <button type="button" class="btn btn-link order" data-id="${commid}">重下訂單</button>
              </li>
            </ul>
            <div class="collapse multi-collapse" id="multiCollapseExample${i}">
              <ul class="card card-body record-content">${itemStr}</ul>
            </div>
          </div>`
        }
      }
      hiscon.innerHTML += str;
      orderBtn(data)
    })
    .catch(error => console.log('error', error));
}

//重下訂單btn
function orderBtn(data){
  let btn = document.querySelectorAll(".order");
  btn.forEach(item => {
    item.addEventListener("click", function (e) {
      for(let i=0;i<data.length;i++){
        if(e.path[0].dataset.id===data[i].id.toString()){
          console.log(data[i])
          let date = new Date();
          let xx = new Date();
          let exTime = new Date(xx.setDate(xx.getDate()+7));
          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
    
          var raw = JSON.stringify({
            "ordertime":`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`,
            "purchase":data[i].purchase,
            "userid":data[i].userid,
            "ordername":data[i].ordername,
            "orderphone":data[i].orderphone,
            "orderaddress":data[i].orderaddress,
            "exporttime":`${exTime.getFullYear()}/${exTime.getMonth() + 1}/${exTime.getDate()} ${date.getHours()}:${date.getMinutes()}`
          });
          console.log(raw)
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
      }
    }, false);
  })
}