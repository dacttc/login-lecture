"use strict";

const id = document.querySelector("#id"),
    psword = document.querySelector("#psword"),
    loginBtn = document.querySelector("#button");
const urlParams = new URLSearchParams(window.location.search);
const redirectUrl = urlParams.get('redirectUrl') || '/default-page';  // 기본값 설정
loginBtn.addEventListener("click", login);

function login(event) {
    event.preventDefault(); // 기본 폼 제출 동작을 막아줌

    const req = {
        id: id.value,
        psword: psword.value,
    };

    fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
        credentials: 'include', // 쿠키를 포함하여 요청 보내기
    })
        .then((res) => res.json())
        .then((res) => {
            if (res.success) {
                if (redirectUrl!="/default-page")
                    window.location.href = redirectUrl;
                else
                    location.href = "/" ;
            } else {
                alert(res.msg);
            }
        })
        .catch((error) => {
            console.error("Error:", error); // 오류 메시지를 콘솔에 출력하여 디버깅
        });
}
