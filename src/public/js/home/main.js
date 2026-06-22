"use strict";
let selectedService = null;
let login = false;
let own = false;
let id = null;
const fullPath = window.location.pathname;
const lastSlashIndex = fullPath.lastIndexOf("/");
const lastindex = fullPath.substring(lastSlashIndex + 1);
let requestDetails = {
  request: '',
  phone: ''
};
let selectedDate
// cellMatrix 초기화 (예: 7일 x 30분 간격 타임 슬롯)
let cellMatrix = Array(7).fill(null).map(() => Array(20).fill(null)); // 7일 x 20타임 슬롯 (예시)
function formatDateTimeForSQL(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
// 요청 목록을 가져와 cellMatrix에 추가하는 함수
function addRequestsToMatrix() {
  let cellMatrix = Array(7).fill(null).map(() => Array(20).fill(null));

  const req = {
    username: lastPart,
    requestid: 7,
  }


  fetch('ServiceRequest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(req),
  })
    .then(response => response.json())
    .then(result => {
      if (result.message === 'Success') {
        const requests = result.data;

        requests.forEach(requestss => {

          const { reservation_date, start_time, time_taken, service_name, price, phone, request,id } = requestss;

          // reservation_date를 Date 객체로 변환
          const reservationDate = new Date(reservation_date);

          // 날짜와 시간을 이용해 행(row)과 열(col) 
          const { row, col } = parseTimeAndDateToMatrixPosition(start_time, reservationDate);

          console.log(`row: ${row}, col: ${col}`);
          for (let i = row; i < row + time_taken / 30; i++) {
            tempSelectedCells.push({ row: i, col: col, service_name:service_name,phone:phone,request:request,id:id});
          }

          // 선택한 시작 시간 저장

          
          // cellMatrix에 서비스 정보 추가
          if (cellMatrix[row] && cellMatrix[row][col] === null) {
            cellMatrix[row][col] = {
              service: service_name,
              price: price,
              timeTaken: time_taken,
              phone: phone,
              request: request,
              id: id,
            };
          } else {
            console.error(`Cell at row: ${row}, col: ${col} is already occupied or out of bounds.`);
          }
          addSelectionToMatrix();
          colorCells();
        });

        console.log('cellMatrix updated with requests:', cellMatrix);
      } else {
        console.error('Error fetching requests:', result.message);
      }
    })
    .catch(error => {
      console.error('Error fetching requests:', error);
    });
}
function parseTimeAndDateToMatrixPosition(startTime, reservationDate) {
  const today = new Date();  // 오늘 날짜
  const dayDiff = Math.floor((reservationDate - today) / (1000 * 60 * 60 * 24)); // 오늘과 예약일의 날짜 차이 계산

  // 날짜 차이에 따라 열(col) 값을 계산 (열은 날짜를 나타냄)
  const col = dayDiff + 1;

  // startTime은 "HH:MM" 형식으로 들어온다고 가정
  const [hours, minutes] = startTime.split(':').map(Number);  // 시간을 분리하여 숫자로 변환

  // 9시를 기준으로 시간 계산, 9시가 0번째 행, 9시 30분은 1번째 행, 10시는 2번째 행 ...
  const row = (hours - 9) * 2 + Math.floor(minutes / 30);

  return {
    row,  // 시간에 따른 행(row)
    col   // 날짜에 따른 열(col)
  };
}


// 선택된 셀 정보를 저장하는 변수들
let tempSelectedCells = []; // 임시로 선택된 셀의 인덱스들
let selectedTime = '';      // 선택된 시간
let selectedColIndex = -1;  // 선택된 열 인덱스



function addService(name, price, time, description) {
  services.push({ name, price, time, description });
}
let lastPart
window.onload = function () {
 
  const currentUrl = window.location.href;
  

  // URL에서 사용자 이름 추출
  const urlParts = currentUrl.split('/');
  lastPart = urlParts[urlParts.length - 2];

  // 서버로 보낼 데이터
  const req = {
    username: lastPart,
  }

  // Fetch API로 POST 요청 보내기
  fetch('cookiecheck1', {//서비스 목록 가져오기
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(req),
  })
    .then(response => response.json())
    .then(result => { console.log(result.ids);
      id = result.ids;
      own = result.own;
      if (id != null)
        login = true;

      Object.keys(result)
        .filter(key => Number.isInteger(Number(key)))
        .forEach(key => {
          addService(result[key].service_name, result[key].service_price, result[key].needtime, "2");
        });

      generateDateHeaders();
      generateTimeRows();

      let servicesDiv = document.getElementById("services");
      services.forEach(service => {
        let serviceDiv = document.createElement("div");
        serviceDiv.innerHTML = `
          <p>${service.description}</p>
          <h3>${service.name}</h3>
          <p>가격: ${service.price}원</p>
          <p>소요 시간: ${service.time}분</p>
          <button onclick="selectService('${service.name}', ${service.time})">선택</button>
          <hr>
        `;
        servicesDiv.appendChild(serviceDiv);
      });
      addButtons();

      
    })
    .catch(error => {
      console.error('에러 발생:', error);
    });
    if(!own)
      {openServiceModal();}
  addRequestsToMatrix();
};

function formatDateForSQL(date) {
  console.log(date);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}


function ServiceRequest() {//서비스 요청

  const req = {
    username: lastPart,
    request_time: formatDateTimeForSQL(new Date()),
    phone: requestDetails.phone,
    request: requestDetails.request,
    store_id: lastPart,
    status: 'pending',
    start_time: selectedTime,
    time_taken: selectedService.time,
    service_name: selectedService.name,
    price: selectedService.price,
    reservation_date: selectedDate,
    requestid: 1,
  }

  // Fetch API로 POST 요청 보내기
  fetch('ServiceRequest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(req),
  })
    .then(response => response.json())
    .then(result => {
      if (result.message == 'Success') {
        alert('요청이 완료되었습니다.');

        // 요청이 완료된 후에 셀을 `cellMatrix`에 추가하고 색칠합니다.
        addRequestsToMatrix(); console.log(cellMatrix);
      } else {
        alert('오류가 발생했습니다.');
      }
    })
    .catch(error => {
      console.error('에러 발생:', error);
    });
}
function getDateByIndex(startDate, index) {
  // 시작 날짜로부터 인덱스에 해당하는 날짜 계산
  let date = new Date(startDate);
  date.setDate(startDate.getDate() + index);

  // 년, 월, 일을 SQL DATE 형식으로 변환 (YYYY-MM-DD)
  let year = date.getFullYear();
  let month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 +1
  let day = date.getDate().toString().padStart(2, '0');

  // SQL 형식의 문자열로 반환
  return `${year}-${month}-${day}`;
}

function generateDateHeaders() {
  let headers = '';
  let today = new Date();
  let daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  for (let i = 0; i < 8; i++) {
    let date = new Date(today);
    date.setDate(today.getDate() + i);
    let day = date.getDate().toString().padStart(2, '0');
    let dayOfWeek = daysOfWeek[date.getDay()];
    headers += `<th>${day} (${dayOfWeek})</th>`;
  }
  document.getElementById('date-header-row').innerHTML += headers;
}

function openServiceModal() {
  let modal = document.getElementById("serviceModal");
  modal.style.display = "block";
}

function closeRequestModal() {
  let modal = document.getElementById("requestModal");
  if (modal) {
    modal.style.display = "none";
  } else {
    console.error('Request modal not found');
  }
}

function closeServiceModal() {
  document.getElementById("serviceModal").style.display = "none";
}

function selectService(serviceName, time) {
  selectedService = services.find(service => service.name === serviceName);
  document.getElementById("cell-size").value = time / 30;

  // 현재 선택된 서비스 표시
  document.getElementById("current-service").textContent = `현재 선택된 서비스: ${selectedService.name}`;

  closeServiceModal();
}

function openRequestModal() {
  let modal = document.getElementById("requestModal");
  modal.style.display = "block";
}

function initializeMatrix(rows, cols) {
  cellMatrix = Array.from({ length: rows }, () => Array(cols).fill(null));
}

function generateTimeRows() {
  let rows = '';
  for (let hour = 9; hour <= 21; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      let time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      rows += '<tr>';
      rows += `<td>${time}</td>`;  // 시간 정보를 담는 셀
      for (let i = 0; i < 8; i++) {
        rows += `<td class="clickable"></td>`;
      }
      rows += '</tr>';
    }
  }
  document.getElementById('time-rows').innerHTML = rows;

  // cellMatrix 초기화
  let totalRows = document.querySelectorAll('tbody tr').length;
  initializeMatrix(totalRows, 8); // 시간 열 제외한 열 수
  let dateHeaders = [];

  // 날짜 헤더 생성 함수
  function generateDateHeaders() {
    let headers = '';
    let today = new Date();
    let daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    dateHeaders = []; // 날짜 정보를 저장할 배열 초기화

    for (let i = 0; i < 7; i++) {  // 7일 동안의 날짜를 생성
      let date = new Date(today);
      date.setDate(today.getDate() + i);
      let day = date.getDate().toString().padStart(2, '0');
      let dayOfWeek = daysOfWeek[date.getDay()];

      headers += `<th>${day} (${dayOfWeek})</th>`;

      // 날짜와 요일 정보를 저장
      dateHeaders.push({
        date: date,
        dayOfWeek: dayOfWeek,
      });
    }

    document.getElementById('date-header-row').innerHTML += headers;
  }

  // 셀 클릭 이벤트 수정

  function showServiceModals(serviceName, phoneNumber, requestDetails,id) {


    // 모달의 HTML 구조 생성
    const modalHTML = `
        <div id="serviceModals" class="modal">
            <div class="modal-content">
                <span class="close-btn" id="closeModal">&times;</span>
                <h2>서비스 정보</h2>
                <p><strong>서비스 이름:</strong> ${serviceName}</p>
                <p><strong>전화번호:</strong> ${phoneNumber}</p>
                <p><strong>요청사항:</strong> ${requestDetails}</p>
                <button id="rejectButton" class="reject-btn">거부</button>
            </div>
        </div>
    `;

    // 모달을 body에 추가
    document.body.insertAdjacentHTML('beforeend', modalHTML);
 
    // 모달과 버튼 요소 선택
    const modal = document.getElementById('serviceModals');
    const closeModal = document.getElementById('closeModal');
    const rejectButton = document.getElementById('rejectButton');

    // 모달을 보여주기
    modal.style.display = 'block';

    // 모달 닫기 이벤트 (X 버튼 클릭 시)
    closeModal.onclick = function() {
        modal.remove();  // 모달 삭제
    };

    // 모달 외부 클릭 시 모달 닫기
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.remove();  // 모달 삭제
        }
    };

    // 거부 버튼 클릭 이벤트
    rejectButton.onclick = function() {
      
        const req = {
          username: lastPart,
          requestid: 10,
          id: id,
        }
      
      
        fetch('Serviceadd', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(req),
        })
          .then(response => response.json())
          .then(result => {
            if (result.message === 'Success') {
              alert('서비스가 거부되었습니다.');
              

            } else {
              alert(result.message);
              
            }
          })
          .catch(error => {
            alert(error);
          });
        modal.remove();  // 모달 삭제
    };
}

  // 셀 클릭 이벤트 추가
  let cells = document.querySelectorAll('.clickable');
  cells.forEach((cell) => {


    cell.addEventListener('click', function () {
      if (own) {
        let row = this.parentNode; // 클릭된 셀의 행
        let rowIndex = Array.from(row.parentNode.children).indexOf(row); // 행 인덱스
        let colIndex = Array.from(this.parentNode.children).indexOf(this);

        // 시간 열을 제외한 열 인덱스 조정
        colIndex -= 1;
         // 겹치는 선택 확인
         let canSelect = true;

 
         if (canSelect) {
          console.log(cellMatrix[rowIndex][colIndex].id);
          showServiceModals(cellMatrix[rowIndex][colIndex].service,cellMatrix[rowIndex][colIndex].phone,cellMatrix[rowIndex][colIndex].request,cellMatrix[rowIndex][colIndex].id)
           
           return;
         }
      }
      else {
        if (!selectedService) {
          alert('먼저 서비스를 선택해주세요.');
          return;
        }

        let row = this.parentNode; // 클릭된 셀의 행
        let rowIndex = Array.from(row.parentNode.children).indexOf(row); // 행 인덱스
        let colIndex = Array.from(this.parentNode.children).indexOf(this);

        // 시간 열을 제외한 열 인덱스 조정
        colIndex -= 1;

        let cellSize = parseInt(document.getElementById('cell-size').value, 10);

        // 범위 초과 확인
        if (rowIndex + cellSize > cellMatrix.length) {
          alert('선택 범위가 테이블을 초과했습니다.');
          return;
        }

        // 겹치는 선택 확인
        let canSelect = true;
        for (let i = rowIndex; i < rowIndex + cellSize; i++) {
          if (cellMatrix[i][colIndex]) {
            canSelect = false;
            break;
          }
        }

        if (!canSelect) {
          alert('이미 선택된 영역과 겹칩니다.');
          return;
        }

        // 임시로 선택한 셀의 인덱스 저장


        // 선택한 시작 시간 저장
        let timeCell = row.firstChild;
        selectedTime = timeCell.textContent;
        selectedColIndex = colIndex;
        selectedDate = getDateByIndex(new Date(), selectedColIndex)
      
        // 요청 모달 열기
        openRequestModal();
      }
    });

  });
}

function colorCells() {
  let rows = document.querySelectorAll('tbody tr');
  
  for (let i = 0; i < cellMatrix.length; i++) {
    let cells = rows[i].children;
    for (let j = 1; j < cells.length; j++) { 
      if (cellMatrix[i][j - 1]) {
        cells[j].style.border = 'none';  // 경계를 없앰
        cells[j].style.backgroundColor = 'lightblue';  // 배경색 추가
      } else {
        cells[j].style.border = '';  // 원래 경계 복원
        cells[j].style.backgroundColor = '';  // 배경색 원래대로
      }
    }
  }
}


function deleteCookie(name) {
  console.log(document.cookie);
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

function addButtons() {
  let container = document.getElementById('button-container');
  container.innerHTML = ''; // 기존 버튼 제거

  if (!login) {
    let loginButton = document.createElement('button');
    loginButton.textContent = '로그인하러가기';

    const fullPath = window.location.href;
    const lastSlashIndex = fullPath.lastIndexOf("/");
    const result = fullPath.substring(0, lastSlashIndex);
    loginButton.onclick = () => window.location.href = "/login";
    container.appendChild(loginButton);
  } else {
    if (own) {
      let settingsButton = document.createElement('button');
      settingsButton.textContent = '내 페이지 관리';
      settingsButton.onclick = () => { window.location.href = lastPart + "/manage"; }
      container.appendChild(settingsButton);

      let logoutButton = document.createElement('button');
      logoutButton.textContent = '로그아웃';

      // 로그아웃 버튼 클릭 이벤트
      logoutButton.addEventListener('click', function () {
        deleteCookie('authToken');

        alert('로그아웃 되었습니다.');

        const fullPath = window.location.href;
        const lastSlashIndex = fullPath.lastIndexOf("/");
        const result = fullPath.substring(0, lastSlashIndex);
        window.location.href = result;
      });
      container.appendChild(logoutButton);
    } else {
      let myPageButton = document.createElement('button');
      myPageButton.textContent = '내 페이지로 이동';
      myPageButton.onclick = () => {
        if (!window.location.pathname.includes(lastPart)) {
          window.location.href = window.location.pathname + "/" + lastPart + "/reservation";
        } else {
          window.location.href = window.location.pathname + "/reservation";
        }
      }
      container.appendChild(myPageButton);

      let logoutButton = document.createElement('button');
      logoutButton.textContent = '로그아웃';

      // 로그아웃 버튼 클릭 이벤트
      logoutButton.addEventListener('click', function () {
        deleteCookie('authToken');

        alert('로그아웃 되었습니다.');

        const fullPath = window.location.href;
        const lastSlashIndex = fullPath.lastIndexOf("/");
        const result = fullPath.substring(0, lastSlashIndex);
        window.location.href = result;
      });
      container.appendChild(logoutButton);
    }
  }
}

// 요청 모달의 폼 제출 처리
document.getElementById("requestForm").onsubmit = function (event) {
  event.preventDefault(); // 폼 기본 제출 방지
  requestDetails.request = document.getElementById("request").value;
  requestDetails.phone = document.getElementById("phone").value;

  // 요청이 완료된 후에 셀을 추가하고 색칠
  ServiceRequest();

  // 요청 모달 닫기
  closeRequestModal();

  // 폼 초기화
  document.getElementById("requestForm").reset();
};

function addSelectionToMatrix() {

  // 임시로 저장된 선택된 셀들을 cellMatrix에 추가
  tempSelectedCells.forEach(cell => {
    
    cellMatrix[cell.row][cell.col] = {
      service: cell.service_name,
      phone: cell.phone,
      request: cell.request,
      id: cell.id
    };
  });
  // 임시 선택 배열 초기화
  tempSelectedCells = [];
}
