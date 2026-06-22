window.onload = function () {
    const currentUrl = window.location.href;

    // URL에서 사용자 이름 추출
    const urlParts = currentUrl.split('/');
    lastPart = urlParts[urlParts.length - 1];

    // 서버로 보낼 데이터
    const req = {
        username: lastPart,
    }

    // Fetch API로 POST 요청 보내기
    fetch('get_data', {//서비스 목록 가져오기
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(req),
    })
        .then(response => response.json())
        .then(result => {
            const gallery = document.getElementById('gallery');

            // Define new image links

            const newImageLinks = [
                results.photo1,
                results.photo2,
                results.photo3,
                results.photo4,
                results.photo5,
                results.photo6,
              ];
            // Select all images inside the gallery
            const images = gallery.getElementsByTagName('img');
            document.getElementById('shopname').textContent = results.store_name;
            document.getElementById('introduction').textContent = results.introduction;
            // Loop through each image and update the src attribute
            for (let i = 0; i < images.length; i++) {
                images[i].src = newImageLinks[i];
            }
            // Select the header element
            const header = document.querySelector('header');

            // Define the new background image URL


            // Change the background-image property of the header
            header.style.backgroundImage = `url('${result.photo_url}')`;
            
        })
        .catch(error => {
            console.error('에러 발생:', error);
        });

};