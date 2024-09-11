"use strict";
function changeText(a) {
  document.getElementById("myText").innerHTML = a;
}
window.onload = function () {
  const currentUrl = window.location.href;
    
    // URL을 파싱하여 마지막 JSON 파일 경로를 추출합니다.
    const urlParts = currentUrl.split('/');
    const lastPart = urlParts[urlParts.length - 1];

  // 서버로 보낼 데이터
  const req = {

    username : lastPart,
    

  }

  // Fetch API로 POST 요청 보내기
  fetch('cookiecheck', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },

    credentials: 'include',
    body: JSON.stringify(req),
  })
    .then(response => response.json())
    .then(result => {

      changeText(result.ids);
      console.log(result.body);


      Object.keys(result)
        .filter(key => Number.isInteger(Number(key)))
        .forEach(key => {
          console.log(`Key: ${key}`, result[key]);
          // 필요한 경우 내부 객체의 속성에 접근할 수 있습니다.
          // console.log(data[key].service_name);
        });

    })
    .catch(error => {
      console.error('에러 발생:', error);
    });
};
