//顯示會員帳號和nav bar功能
(()=>{
    let member = JSON.parse(localStorage.getItem('user'));
    let memberAcc = document.querySelector(".member_acc");
    let navBar = document.getElementById("navbarToggleExternalContent");
    let str = "";
    let navStr = "";
    if(member === null){
        window.location = "index.html"
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
//會員登出
signOut()
function signOut(){
  let out = document.querySelector(".dropdown-item").addEventListener("click",()=>{
    localStorage.removeItem("user");
    window.location.reload("index.html");
  })
  console.log(out)
}
//抓個人資料
userData()
function userData(){
    let user = JSON.parse(localStorage.getItem('user'));
    for(i=0;i<user.name.length;i++){
        let first = document.querySelector(".First_name").setAttribute("placeholder",user.name[0]);
        let last = document.querySelector(".Last_name").setAttribute("placeholder",user.name[1]+user.name[2]);
        let photo = document.getElementById("exampleInputNumber").setAttribute("placeholder",user.phone);
        let email = document.getElementById("exampleInputEmail1").setAttribute("placeholder",user.email);
        let address = document.getElementById("inputAddress").setAttribute("placeholder",user.address);
    }
}
//更新資料
update()
function update(){
    let updBtn = document.querySelector(".upd_btn").addEventListener("click",()=>{
        let userId = JSON.parse(localStorage.getItem('user'));
        let first = document.querySelector(".First_name").value;
        let last = document.querySelector(".Last_name").value;
        let photo = document.getElementById("exampleInputNumber").value;
        let email = document.getElementById("exampleInputEmail1").value;
        let address = document.getElementById("inputAddress").value;
        if(first==="" || last==="" || photo==="" || email==="" || address===""){
            alert("請填寫完整")
        }else{
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({"name":first+last,"email":email,"phone":photo,"address":address});

            var requestOptions = {
                method: 'PATCH',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            
            fetch(`http://localhost:3000/members/${userId.id}`, requestOptions)
              .then(response => response.text())
              .then(result => console.log(result))
              .catch(error => console.log('error', error));
            localStorage.clear("user");
        }
    })
}