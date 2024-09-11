"use strict";


const id= document.querySelector("#id"),
 psword= document.querySelector("#psword"),
 loginBtn= document.querySelector("#button");

loginBtn.addEventListener("click",login);


function login() {


    const req = {

        id: id.value,
        psword: psword.value
    }
        ;
    
    fetch("/login",

        {   
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req),
            credentials: 'include' // 쿠키를 포함하여 요청 보내기
        })
        .then((res)=>res.json())
        .then((res)=>{

            if(res.success){

               location.href="../"+id.value;
            }
            else
            {
                alert(res.msg);
            }

        }).catch(console.error("로그인 중 에러 발생"));
    
}
