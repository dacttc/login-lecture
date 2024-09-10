"use strict";
function changeText(a) {
    document.getElementById("myText").innerHTML = a;
  }
  window.onload = function() {
    // 서버로 보낼 데이터
    const data = { name: '홍길동', age: 25 };

    // Fetch API로 POST 요청 보내기
    fetch('cookiecheck', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(result => {

      changeText(result.id)
    })
    .catch(error => {
      console.error('에러 발생:', error);
    });
  };
