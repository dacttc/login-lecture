"use strict";


const id = document.querySelector("#id"),
    name = document.querySelector("#name"),
    psword = document.querySelector("#psword"),
    confirmPsword = document.querySelector("#confirm-psword"),
    registerBtn = document.querySelector("#button");
registerBtn.addEventListener("click", register);

function redirectToRegister() {
    location.href = "/login";
}
function register(event) {
    event.preventDefault();
    if(!id.value) return alert("아이디를 입력해주십시오.")
    if(psword.value!==confirmPsword.value)
        return alert("비밀번호가 일치하지 않습니다.")
    const req = {

        id: id.value,
        name: name.value,
        psword: psword.value,
       
    }
        ;


    fetch("/register",

        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req),
        })
        .then((res) => res.json())
        .then((res) => {  

            
            if (res.success) {
                alert("회원가입을 축하합니다!");
                location.href = "/login";
            }
            else {
                alert(res.msg);
            }

        }).catch( console.error("회원가입 중 에러 발생") );
}
