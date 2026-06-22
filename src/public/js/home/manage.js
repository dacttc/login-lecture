const urlParams = new URLSearchParams(window.location.search);
const redirectUrl = urlParams.get('redirectUrl') || '/default-page';  // 기본값 설정
let holidays = [];
let services = [

];
let requests = [

];
// DOM 요소 선택
const addServiceForm = document.getElementById("addServiceForm");

// 폼의 submit 이벤트에 이벤트 리스너 추가
document.getElementById('addHolidayForm').addEventListener('submit', handleAddHolidayFormSubmit);

function handleAddHolidayFormSubmit(event) {
    event.preventDefault(); // 기본 폼 제출 동작 방지

    // 휴무일 유형 가져오기
    const holidayType = document.getElementById('holidayType').value;

    // 공통 입력 값 가져오기
    const holidayReason = document.getElementById('holidayReason').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;

    let holidayData = {
        holidayType: holidayType,
        holidayReason: holidayReason,
        startTime: startTime,
        endTime: endTime
    };

    // 각 휴무일 유형에 따라 필요한 필드값들을 변수에 저장하고 holidayData에 추가
    if (holidayType === 'weekly') {
        const dayOfWeek = document.getElementById('dayOfWeek').value;
        holidayData.dayOfWeek = dayOfWeek;
    } else if (holidayType === 'monthly') {
        const dayOfMonth = document.getElementById('dayOfMonth').value;
        holidayData.dayOfMonth = dayOfMonth;
    } else if (holidayType === 'yearly') {
        const monthOfYear = document.getElementById('monthOfYear').value;
        const dayOfYear = document.getElementById('dayOfYear').value;
        holidayData.monthOfYear = monthOfYear;
        holidayData.dayOfYear = dayOfYear;
    } else if (holidayType === 'specific-day') {
        const specificDay = document.getElementById('specificDay').value;
        holidayData.specificDay = specificDay;
    }

    // 요청 데이터 객체 생성
    const req = {
        username: lastPart,
        requestid: 3, // 휴무일 추가 요청
        holidayData: holidayData
    };

    fetch('serviceadd', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(req),
    })
        .then(response => response.json())
        .then(result => {
            // 응답 처리
            if (result.message === 'Success') {
                alert('서비스가 성공적으로 추가되었습니다.');
                // 필요한 경우 폼 초기화 또는 모달 닫기
                showPanel("holidays");
                document.getElementById('addHolidayForm').reset();
                closeAddHolidayModal();
            } else {
                alert('서비스 추가 중 오류가 발생했습니다: ' + result.message);
            }
        })
        .catch(error => {
            console.error('에러 발생:', error);
            alert('서비스 추가 중 에러가 발생했습니다.');
        });
    // 여기서부터는 필요한 로직 수행 (예: 서버로 데이터 전송)
}

// 휴무일 옵션을 토글하는 함수 (기존에 이미 작성되어 있을 수 있음)
function toggleHolidayOptions() {
    const holidayType = document.getElementById('holidayType').value;

    // 모든 옵션 숨기기
    document.getElementById('weekly-options').style.display = 'none';
    document.getElementById('monthly-options').style.display = 'none';
    document.getElementById('yearly-options').style.display = 'none';
    document.getElementById('specific-day-options').style.display = 'none';

    // 선택된 유형에 따라 해당 옵션 표시
    if (holidayType === 'weekly') {
        document.getElementById('weekly-options').style.display = 'block';
    } else if (holidayType === 'monthly') {
        document.getElementById('monthly-options').style.display = 'block';
    } else if (holidayType === 'yearly') {
        document.getElementById('yearly-options').style.display = 'block';
    } else if (holidayType === 'specific-day') {
        document.getElementById('specific-day-options').style.display = 'block';
    }
}
// 필요한 변수들을 가져옵니다.


document.getElementById('storeSettingsForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const storeName = document.getElementById('storeName').value;
    const storeDescription = document.getElementById('storeDescription').value;
    const storeMainImage = document.getElementById('storeMainImage').files[0];

    // 파일 업로드를 처리하기 위해 FormData 객체 사용
    const formData = new FormData();
    formData.append('storeMainImage', storeMainImage);

    // 서버로 POST 요청 보내기
    fetch('storeSettingsUpdate', {
        method: 'POST',
        credentials: 'include',
        body: formData, // FormData를 통해 파일과 데이터를 함께 전송
    })
        .then(response => response.json())
        .then(result => {
            if (result.message === 'Success') {
                alert('매장 정보가 성공적으로 저장되었습니다.');
                // 설정 패널 닫기
                document.getElementById('storeSettingsForm').reset();
                document.getElementById('storeSettingsPanel').style.display = 'none';
            } else {
                alert('매장 정보 저장 중 오류가 발생했습니다: ' + result.message);
            }
        })
        .catch(error => {
            console.error('에러 발생:', error);
            alert('매장 정보 저장 중 에러가 발생했습니다.');
        });
});
// 서비스 추가 함수
function addService(event) {

    const addName = document.getElementById('addName').value;
    const addDuration = document.getElementById('addDuration').value;
    const addPrice = document.getElementById('addPrice').value;
    const service_description = document.getElementById('service_description').value;
    const manager = lastPart; // 필요한 경우 실제 매니저 이름으로 대체

    const req = {
        username: lastPart,
        requestid: 2, // 서비스 추가 요청
        serviceName: addName,
        servicePrice: addPrice,
        needTime: addDuration,
        service_description:service_description,
        manager: manager, // 매니저 정보가 없으면 제거하거나 null로 설정
    };

    fetch('serviceadd', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(req),
    })
        .then(response => response.json())
        .then(result => {
            // 응답 처리
            if (result.message === 'Success') {
                alert('서비스가 성공적으로 추가되었습니다.');
                // 필요한 경우 폼 초기화 또는 모달 닫기
                showPanel("services");
                document.getElementById('addServiceForm').reset();
                closeAddServiceModal();
            } else {
                alert('서비스 추가 중 오류가 발생했습니다: ' + result.message);
            }
        })
        .catch(error => {
            console.error('에러 발생:', error);
            alert('서비스 추가 중 에러가 발생했습니다.');
        });
}

// 폼 제출 이벤트 리스너 추가
addServiceForm.addEventListener("submit", addService);

// 폼 요소 선택
const editServiceForm = document.getElementById('editServiceForm');

// 폼 제출 이벤트 리스너 추가
editServiceForm.addEventListener('submit', editService);


function renderServices() {
    const serviceList = document.getElementById('serviceList');
    serviceList.innerHTML = '';
    services.forEach((service, index) => {
        const serviceBlock = document.createElement('div');
        serviceBlock.classList.add('service-block');
        serviceBlock.innerHTML = `
        <div class="service-card">
                <h3>${service.name}</h3>
                <p class="service-price">₩ ${service.price}</p>
                <p class="service-duration">소요 시간:  ${service.duration}</p>
                <p class="service-description">${service.service_description}</p>
                <div class="service-actions">
                    <button onclick="openEditServiceModal(${service.index})">수정</button>
                    <button onclick="deleteService(${service.index})">삭제</button>
                </div>
            </div>
          
        `;
        serviceList.appendChild(serviceBlock);
    });
}
function deleteService(serviceId) {
    // 삭제 확인
    if (!confirm('정말 이 서비스를 삭제하시겠습니까?')) {
        return;
    }

    const req = {
        id: serviceId,
        username: lastPart, // 필요에 따라 추가 정보 포함
        requestid: 9, // 서비스 삭제 요청
    };

    fetch('serviceadd', {
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
                alert('서비스가 성공적으로 삭제되었습니다.');

                // 로컬 데이터에서 해당 서비스 제거
                services = services.filter(service => service.index !== serviceId);

                // UI 업데이트
                renderServices();
            } else {
                alert('서비스 삭제 중 오류가 발생했습니다: ' + result.message);
            }
        })
        .catch(error => {
            console.error('에러 발생:', error);
            alert('서비스 삭제 중 에러가 발생했습니다.');
        });
}

function closeEditServiceModal() {
    document.getElementById('editServiceModal').style.display = 'none';
}
function openEditServiceModal(serviceId) {
    // 수정할 서비스를 찾습니다.
    const service = services.find(serv => serv.index === serviceId);

    if (!service) {
        alert('해당 서비스가 존재하지 않습니다.');
        return;
    }

    // 입력 필드에 기존 서비스 데이터 채우기
    document.getElementById('editServiceId').value = serviceId;
    document.getElementById('editName').value = service.name;
    document.getElementById('editDuration').value = parseInt(service.duration);
    document.getElementById('editPrice').value = service.price;

    // 모달 열기
    document.getElementById('editServiceModal').style.display = 'block';
}

function editService(event) {
    event.preventDefault();

    const serviceId = document.getElementById('editServiceId').value;

    const service = services.find(serv => serv.index == serviceId);

    if (!service) {
        alert('해당 서비스가 존재하지 않습니다.');
        return;
    }

    // 수정된 정보 가져오기
    const updatedName = document.getElementById('editName').value;
    const updatedDuration = document.getElementById('editDuration').value;
    const updatedPrice = document.getElementById('editPrice').value;
    const service_description = document.getElementById('service_description').value;
    // 요청 데이터 객체 생성
    const req = {
        id: serviceId,
        name: updatedName,
        duration: updatedDuration,
        price: updatedPrice,
        username: lastPart,
        service_description: service_description,
        requestid: 8, // 서비스 수정 요청
    };

    fetch('serviceadd', {
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
                alert('서비스가 성공적으로 수정되었습니다.');

                // 로컬 데이터 업데이트
                service.name = updatedName;
                service.duration = `${updatedDuration}분`;
                service.price = updatedPrice;
                service.service_description = service_description;
                // UI 업데이트
                renderServices();

                // 폼 초기화 및 모달 닫기
                document.getElementById('editServiceForm').reset();
                closeEditServiceModal();
            } else {
                alert('서비스 수정 중 오류가 발생했습니다: ' + result.message);
            }
        })
        .catch(error => {
            console.error('에러 발생:', error);
            alert('서비스 수정 중 에러가 발생했습니다.');
        });
}


function openAddServiceModal() {
    document.getElementById('addServiceModal').style.display = 'block';
}

function closeAddServiceModal() {
    document.getElementById('addServiceModal').style.display = 'none';
}

function openAddHolidayModal() {
    document.getElementById('addHolidayModal').style.display = 'block';
}

function closeAddHolidayModal() {
    document.getElementById('addHolidayModal').style.display = 'none';
}

document.getElementById('addServiceForm').onsubmit = function (event) {
    event.preventDefault();
    const name = document.getElementById('addName').value;
    const duration = parseInt(document.getElementById('addDuration').value, 10);
    const price = document.getElementById('addPrice').value;
    if (duration % 30 !== 0) {
        alert("소요 시간은 30분 단위로 입력해야 합니다.");
        return;
    }

    closeAddServiceModal();
};

function renderRequestList() {
    const requestList = document.getElementById('requestList');
    requestList.innerHTML = '';
    requests.forEach(request => {
        if (request.status === 'pending') {
            const requestBlock = document.createElement('div');
            requestBlock.classList.add('service-block');
            requestBlock.innerHTML = `
                <div>
                    <p><strong>전화번호:</strong> ${request.phone}</p>
                    <p><strong>요청 사항:</strong> ${request.request}</p>
                    <p><strong>서비스:</strong> ${request.service_name} (${request.price}원)</p>
                </div>
                <div class="icons">
                    <button onclick="acceptRequest(${request.id})" style="background-color:#28a745;color:#fff;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;">수락</button>
                    <button onclick="rejectRequest(${request.id})" style="background-color:#dc3545;color:#fff;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;margin-left:5px;">거절</button>
                </div>
            `;
            requestList.appendChild(requestBlock);
        }
    });
}

function acceptRequest(requestId) {
    const request = requests.find(req => req.id === requestId);


    const req = {
        id: request.id, // 서비스 추가 요청
        requestid: 4,
        username: lastPart,

    };

    fetch('serviceadd', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(req),
    })
        .then(response => response.json())
        .then(result => {
            // 응답 처리
            if (result.message === 'Success') {
                alert('서비스가 성공적으로 반영되었습니다.');
                // 필요한 경우 폼 초기화 또는 모달 닫기
                showPanel("request-list");
                document.getElementById('addServiceForm').reset();
                closeAddServiceModal();
            } else {
                alert('서비스 반영 중 오류가 발생했습니다: ' + result.message);
            }
        })
        .catch(error => {
            console.error('에러 발생:', error);
            alert('서비스 반영 중 에러가 발생했습니다.');
        });
}

function rejectRequest(requestId) {
    const request = requests.find(req => req.id === requestId);
    const req = {
        id: request.id, // 서비스 추가 요청
        requestid: 5,
        username: lastPart,

    };

    fetch('serviceadd', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(req),
    })
        .then(response => response.json())
        .then(result => {
            // 응답 처리
            if (result.message === 'Success') {
                alert('서비스가 성공적으로 반영되었습니다.');
                // 필요한 경우 폼 초기화 또는 모달 닫기
                showPanel("request-list");
                document.getElementById('addServiceForm').reset();
                closeAddServiceModal();
            } else {
                alert('서비스 반영 중 오류가 발생했습니다: ' + result.message);
            }
        })
        .catch(error => {
            console.error('에러 발생:', error);
            alert('서비스 반영 중 에러가 발생했습니다.');
        });

}

function updateRequestCount() {
    const requestCount = requests.filter(req => req.status === 'pending').length;
    document.getElementById('request-count').textContent = requestCount;
}

function toggleHolidayOptions() {
    const selectedType = document.getElementById('holidayType').value;
    document.querySelectorAll('.holiday-options').forEach(option => option.style.display = 'none');
    if (selectedType === 'weekly') {
        document.getElementById('weekly-options').style.display = 'block';
    } else if (selectedType === 'monthly') {
        document.getElementById('monthly-options').style.display = 'block';
    } else if (selectedType === 'yearly') {
        document.getElementById('yearly-options').style.display = 'block';
    } else if (selectedType === 'specific-day') {
        document.getElementById('specific-day-options').style.display = 'block';
    }
}
function renderHolidays() {
    const holidayList = document.getElementById('holidayList');
    holidayList.innerHTML = '';
    holidays.forEach((holiday, index) => {
        const holidayBlock = document.createElement('div');
        holidayBlock.classList.add('holiday-block');
        holidayBlock.innerHTML = `
            <p><strong>유형:</strong> ${holiday.type}</p>
            <p><strong>사유:</strong> ${holiday.reason}</p>
            <p><strong>시작 시간:</strong> ${holiday.startTime}</p>
            <p><strong>종료 시간:</strong> ${holiday.endTime}</p>
            <button onclick="deleteHoliday(${holiday.index})">삭제</button>
        `;
        holidayList.appendChild(holidayBlock);
    });
}
function deleteHoliday(holidayId) {
    // 휴무일 ID 검증
    if (!holidayId || isNaN(parseInt(holidayId, 10))) {
        alert('유효한 휴무일 ID가 필요합니다.');
        return;
    }

    // 사용자 확인
    if (!confirm('정말 이 휴무일을 삭제하시겠습니까?')) {
        return;
    }

    const req = {
        username: lastPart,
        requestid: 6, // 휴무일 삭제 요청
        holidayId: holidayId,
    };

    fetch('serviceadd', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(req),
    })
        .then(response => response.json())
        .then(result => {
            showPanel("holidays");
            if (result.message === 'Success') {
                alert('휴무일이 성공적으로 삭제되었습니다.');
                // 휴무일 목록 갱신

            } else {
                alert('휴무일 삭제 중 오류가 발생했습니다: ' + result.message);
            }
        })
        .catch(error => {
            console.error('에러 발생:', error);
            alert('휴무일 삭제 중 에러가 발생했습니다.');
        });
}
// 스타일리스트 데이터 저장을 위한 배열
let stylists = [];

// 모달 열기 및 닫기 함수
function openAddStylistModal() {
    document.getElementById('addStylistModal').style.display = 'block';
}

function closeAddStylistModal() {
    document.getElementById('addStylistModal').style.display = 'none';
}
function addStylist(event) {
    event.preventDefault();

    const stylistName = document.getElementById('stylistName').value;
    const stylistDescription = document.getElementById('stylistDescription').value;
    const stylistMajorFields = document.getElementById('stylistMajorFields').value;
    const stylistPhotoFile = document.getElementById('stylistPhoto').files[0];

    // 사진 업로드를 위해 FormData 사용
    const formData = new FormData();
    formData.append('username', lastPart);
    formData.append('requestid', 10); // 스타일리스트 추가 요청 ID
    formData.append('stylistName', stylistName);
    formData.append('stylistDescription', stylistDescription);
    formData.append('stylistMajorFields', stylistMajorFields); // 메이저 분야 추가
    formData.append('stylistPhoto', stylistPhotoFile);

    fetch('serviceadd', {
        method: 'POST',
        credentials: 'include',
        body: formData,
    })
        .then(response => response.json())
        .then(result => {
            if (result.message === 'Success') {
                alert('스타일리스트가 성공적으로 추가되었습니다.');
                // 리스트 갱신
                showPanel('stylists');
                document.getElementById('addStylistForm').reset();
                closeAddStylistModal();
            } else {
                alert('스타일리스트 추가 중 오류가 발생했습니다: ' + result.message);
            }
        })
        .catch(error => {
            console.error('에러 발생:', error);
            alert('스타일리스트 추가 중 에러가 발생했습니다.');
        });
}
function editStylist(event) {
    event.preventDefault();

    const stylistId = document.getElementById('editStylistId').value;
    const stylistName = document.getElementById('editStylistName').value;
    const stylistDescription = document.getElementById('editStylistDescription').value;
    const stylistMajorFields = document.getElementById('editStylistMajorFields').value;
    const stylistPhotoInput = document.getElementById('editStylistPhoto');
    const stylistPhotoFile = stylistPhotoInput.files[0];

    const formData = new FormData();
    formData.append('username', lastPart);
    formData.append('requestid', 11); // 스타일리스트 수정 요청 ID
    formData.append('stylistId', stylistId);
    formData.append('stylistName', stylistName);
    formData.append('stylistDescription', stylistDescription);
    formData.append('stylistMajorFields', stylistMajorFields); // 메이저 분야 추가
    if (stylistPhotoFile) {
        formData.append('stylistPhoto', stylistPhotoFile);
    }

    fetch('serviceadd', {
        method: 'POST',
        credentials: 'include',
        body: formData,
    })
        .then(response => response.json())
        .then(result => {
            if (result.message === 'Success') {
                alert('스타일리스트가 성공적으로 수정되었습니다.');
                // 리스트 갱신
                showPanel('stylists');
                document.getElementById('editStylistForm').reset();
                closeEditStylistModal();
            } else {
                alert('스타일리스트 수정 중 오류가 발생했습니다: ' + result.message);
            }
        })
        .catch(error => {
            console.error('에러 발생:', error);
            alert('스타일리스트 수정 중 에러가 발생했습니다.');
        });
}

function openEditStylistModal(stylistId) {
    const stylist = stylists.find(s => s.id === stylistId);
    if (stylist) {
        document.getElementById('editStylistId').value = stylist.id;
        document.getElementById('editStylistName').value = stylist.name;
        document.getElementById('editStylistDescription').value = stylist.description;
        // 사진은 별도 처리 필요
        document.getElementById('editStylistModal').style.display = 'block';
    }
}

function closeEditStylistModal() {
    document.getElementById('editStylistModal').style.display = 'none';
}

// 스타일리스트 추가 처리
document.getElementById('addStylistForm').addEventListener('submit', function(event) {
    event.preventDefault();

    addStylist();
});

// 스타일리스트 수정 처리
document.getElementById('editStylistForm').addEventListener('submit', function(event) {
    event.preventDefault();
    editStylist();
});

// 스타일리스트 삭제 처리
function deleteStylist(stylistId) {
    if (confirm('정말로 삭제하시겠습니까?')) {
        stylists = stylists.filter(s => s.id !== stylistId);
        renderStylistList();
    }
}

// 스타일리스트 리스트 렌더링
function renderStylistList() {
    const stylistList = document.getElementById('stylistList');
    stylistList.innerHTML = '';

    stylists.forEach(stylist => {
        const card = document.createElement('div');
        card.className = 'stylist-card';

        card.innerHTML = `
            <img src="${stylist.photo}" alt="${stylist.name}">
            <h3>${stylist.name}</h3>
            <p>${stylist.description}</p>
            <div class="stylist-actions">
                <button onclick="openEditStylistModal('${stylist.id}')">수정</button>
                <button onclick="deleteStylist('${stylist.id}')">삭제</button>
            </div>
        `;

        stylistList.appendChild(card);
    });
}
function renderStylists() {
    const stylistList = document.getElementById('stylistList');
    stylistList.innerHTML = '';
    stylists.forEach(stylist => {
        const card = document.createElement('div');
        card.className = 'stylist-card';

        // 메이저 분야를 쉼표로 분리하고 공백 제거
        const majorFieldsArray = stylist.majorFields.split(',').map(field => field.trim());
        const majorFieldsHTML = majorFieldsArray.map(field => `<span class="major-field">${field}</span>`).join(' ');

        card.innerHTML = `
            <img src="${stylist.photo}" alt="${stylist.name}">
            <h3>${stylist.name}</h3>
            <div class="major-fields">
                ${majorFieldsHTML}
            </div>
            <p>${stylist.description}</p>
            <div class="stylist-actions">
                <button onclick="openEditStylistModal(${stylist.id})">수정</button>
                <button onclick="deleteStylist(${stylist.id})">삭제</button>
            </div>
        `;
        stylistList.appendChild(card);
    });
}

// 고유 ID 생성 함수
function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function showPanel(panelId) {
    // 모든 패널을 숨기고 선택된 패널만 표시
    document.querySelectorAll('.content-panel').forEach(panel => panel.style.display = 'none');
    document.getElementById(panelId).style.display = 'block';

    // 모든 사이드바 링크의 'active' 클래스 제거하고, 클릭된 링크에 'active' 클래스 추가
    document.querySelectorAll('.sidebar ul li a').forEach(link => link.classList.remove('active'));
    document.querySelector(`.sidebar ul li a[onclick="showPanel('${panelId}');"]`).classList.add('active');





    switch (panelId) {
        case 'services':
            // 서비스 관리 패널이 선택되었을 때의 동작
            panelindex = 2;

            break;

        case 'request-list':
            // 예약 요청 관리 패널이 선택되었을 때의 동작
            panelindex = 1;
            break;

        case 'holidays':
            panelindex = 3;
            break;
        default:
            panelindex = 1;
            break;

    }
    const req = {

        username: lastPart,
        requestid: panelindex,

    }

    fetch('cookiecheck2', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },

        credentials: 'include',
        body: JSON.stringify(req),
    })
        .then(response => response.json())
        .then(result => {


            if (result.message != 'Success') {

                alert(result.message);
                window.location.href = '/';



            }
            else {

                switch (panelId) {
                    case 'services':
                        // 서비스 관리 패널이 선택되었을 때의 동작
                        panelindex = 2;
                        services = [];

                        Object.keys(result)
                            .filter(key => Number.isInteger(Number(key)))
                            .forEach(key => {
                                services.push({ index: result[key].id, name: result[key].service_name, duration: `${result[key].needtime}분`, price: result[key].service_price, service_description: result[key].service_description });

                            });

                        renderServices();
                        break;

                    case 'request-list':
                        // 예약 요청 관리 패널이 선택되었을 때의 동작
                        panelindex = 1;
                        requests = [];

                        Object.keys(result)
                            .filter(key => Number.isInteger(Number(key)))
                            .forEach(key => {
                                requests.push({
                                    id: result[key].id, phone: result[key].phone,
                                    request: result[key].request, status: result[key].status, service_name: result[key].service_name, price: result[key].price
                                });

                            });
                        renderRequestList();
                        updateRequestCount();

                        break;

                    case 'holidays':
                        panelindex = 3;
                        holidays = [];

                        Object.keys(result)
                            .filter(key => Number.isInteger(Number(key)))
                            .forEach(key => {
                                holidays.push({
                                    index: result[key].index, type: result[key].holiday_type, reason: result[key].reason,
                                    startTime: result[key].start_time, endTime: result[key].end_time
                                });

                            });
                        renderHolidays();


                        break;
                        case 'stylists':
                            panelindex = 4; // 스타일리스트 관리 패널 요청 ID
                            const req = {
                                store_id: lastPart,
                                requestid: panelindex,
                                designer_name:designer_name,
                            };
                        
                            fetch('cookiecheck2', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                credentials: 'include',
                                body: JSON.stringify(req),
                            })
                                .then(response => response.json())
                                .then(result => {
                                    if (result.message !== 'Success') {
                                        alert(result.message);
                                        window.location.href = '/';
                                    } else {
                                        stylists = [];
                                        Object.keys(result)
                                            .filter(key => Number.isInteger(Number(key)))
                                            .forEach(key => {
                                                stylists.push({
                                                    id: result[key].id,
                                                    name: result[key].name,
                                                    description: result[key].description,
                                                    majorFields: result[key].majorFields, // 메이저 분야 추가
                                                    photo: result[key].photoURL,
                                                });
                                            });
                                        renderStylists();
                                    }
                                })
                                .catch(error => {
                                    console.error('에러 발생:', error);
                                });
                            break;
                        

                }

            }


        })
        .catch(error => {
            console.error('에러 발생:', error);
        });

}
let lastPart;
window.onload = function () {
    if (redirectUrl!="/default-page")
        showPanel(redirectUrl);
   
    const currentUrl = window.location.href;

    // URL을 파싱하여 마지막 JSON 파일 경로를 추출합니다.
    const urlParts = currentUrl.split('/');
    lastPart = urlParts[urlParts.length - 2];

    // 서버로 보낼 데이터
    const req = {

        username: lastPart,
        requestid: 0,

    }

    // Fetch API로 POST 요청 보내기
    fetch('cookiecheck2', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },

        credentials: 'include',
        body: JSON.stringify(req),
    })
        .then(response => response.json())
        .then(result => {


            if (result.message) {
                alert("허용되지 않은 접근입니다.");
                window.location.href = '/';
            }


        })
        .catch(error => {
            console.error('에러 발생:', error);
        });
    renderRequestList();
    updateRequestCount();
};
