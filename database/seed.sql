USE beauty_salon;

SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM replies;
DELETE FROM review;
DELETE FROM News;
DELETE FROM ServiceRequests;
DELETE FROM Holidays;
DELETE FROM service;
DELETE FROM designer;
DELETE FROM users;

ALTER TABLE replies AUTO_INCREMENT = 1;
ALTER TABLE review AUTO_INCREMENT = 1;
ALTER TABLE News AUTO_INCREMENT = 1;
ALTER TABLE ServiceRequests AUTO_INCREMENT = 1;
ALTER TABLE Holidays AUTO_INCREMENT = 1;
ALTER TABLE service AUTO_INCREMENT = 1;
ALTER TABLE designer AUTO_INCREMENT = 1;

SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO users (
  id,
  name,
  psword,
  photo_url,
  store_name,
  introduction,
  address,
  latitude,
  longitude,
  shop,
  sns,
  pay,
  parking,
  photo1,
  photo2,
  photo3,
  photo4,
  photo5,
  photo6
) VALUES
(
  'demo_salon',
  'Demo Manager',
  '$2a$10$uf8cOgwT9/Cslo5/WKocfeT64XorAigwBuW4hdUYLwEatNb9ojUcu',
  '/uploads/backpic2.jpg',
  '온헤어 강남점',
  '예약부터 디자이너 관리까지 한 번에 운영하는 데모 헤어샵입니다.',
  '서울특별시 강남구 테헤란로 123',
  37.498095,
  127.027610,
  TRUE,
  'https://instagram.com/onhair-demo',
  '카드, 현금, 제로페이',
  '건물 지하 주차 1시간 지원',
  '/uploads/hair1.jpg',
  '/uploads/hair2.jpg',
  '/uploads/hair3.jpg',
  '/uploads/hair4.jpg',
  '/uploads/hair5.jpg',
  '/uploads/hair6.jpg'
),
(
  'demo_customer',
  'Demo Customer',
  '$2a$10$uf8cOgwT9/Cslo5/WKocfeT64XorAigwBuW4hdUYLwEatNb9ojUcu',
  '/uploads/hair1.jpg',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  FALSE,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
);

INSERT INTO designer (
  store_id,
  designer_name,
  name,
  description,
  majorFields,
  photoURL
) VALUES
('demo_salon', '수아', '수아 디자이너', '레이어드컷과 빌드펌 상담을 전문으로 합니다.', '레이어드컷,빌드펌,긴머리펌', '/uploads/hair2.jpg'),
('demo_salon', '민준', '민준 디자이너', '남성 커트와 다운펌 예약 만족도가 높습니다.', '남자커트,다운펌,애즈펌', '/uploads/hair3.jpg');

INSERT INTO service (
  store_id,
  service_name,
  service_price,
  needtime,
  manager,
  service_description
) VALUES
('demo_salon', '여성 커트', 30000, 30, '수아', '얼굴형에 맞춘 기본 커트'),
('demo_salon', '레이어드펌', 120000, 120, '수아', '긴머리 볼륨감 중심의 펌'),
('demo_salon', '남성 커트', 25000, 30, '민준', '깔끔한 남성 기본 커트'),
('demo_salon', '다운펌', 70000, 60, '민준', '옆머리 볼륨 정리 다운펌');

INSERT INTO Holidays (
  id,
  store_id,
  designer_name,
  holiday_type,
  day_of_week,
  specific_day,
  reason,
  start_time,
  end_time
) VALUES
('demo_salon', 'demo_salon', '수아', 'weekly', 'Monday', NULL, '정기 휴무', '09:00:00', '21:00:00'),
('demo_salon', 'demo_salon', '민준', 'specific-day', NULL, DATE_ADD(CURRENT_DATE, INTERVAL 7 DAY), '교육 일정', '13:00:00', '18:00:00');

INSERT INTO ServiceRequests (
  user_id,
  phone,
  request,
  store_id,
  designer_id,
  service_id,
  request_time,
  status,
  start_time,
  time_taken,
  service_name,
  price,
  reservation_date
) VALUES
('demo_customer', '010-1234-5678', '앞머리는 자연스럽게 정리하고 싶어요.', 'demo_salon', 1, 1, NOW(), 'pending', '10:30:00', 30, '여성 커트', 30000, DATE_ADD(CURRENT_DATE, INTERVAL 1 DAY)),
('demo_customer', '010-2345-6789', '펌 상담 후 진행하고 싶습니다.', 'demo_salon', 1, 2, NOW(), 'pending', '14:00:00', 120, '레이어드펌', 120000, DATE_ADD(CURRENT_DATE, INTERVAL 2 DAY)),
('demo_customer', '010-3456-7890', '방문 전 주차 가능 여부 확인 부탁드립니다.', 'demo_salon', 2, 4, NOW(), 'completed', '16:00:00', 60, '다운펌', 70000, DATE_SUB(CURRENT_DATE, INTERVAL 2 DAY));

INSERT INTO News (
  store_id,
  title,
  content,
  created_at,
  photo_url
) VALUES
('demo_salon', '6월 신규 고객 이벤트', '첫 방문 고객에게 커트 10% 할인을 제공합니다.', NOW(), '/uploads/news.png'),
('demo_salon', '여름 헤어 케어 안내', '염색/펌 시술 후 홈케어 팁을 안내드립니다.', NOW(), '/uploads/info.png');

INSERT INTO review (
  reviewer,
  manager_name,
  store_id,
  photo_link,
  review_text,
  review_date,
  rating,
  helpful,
  want_to_visit,
  cool,
  fun
) VALUES
('demo_customer', '수아', 'demo_salon', NULL, '상담이 꼼꼼했고 예약 시간도 정확해서 좋았습니다.', NOW(), 5, TRUE, TRUE, TRUE, FALSE),
('demo_customer', '민준', 'demo_salon', NULL, '남성 커트가 깔끔하고 관리 방법도 알려주셨어요.', NOW(), 4, TRUE, FALSE, TRUE, FALSE);

INSERT INTO replies (
  texts,
  store_id,
  review_id
) VALUES
('소중한 리뷰 감사합니다. 다음 방문에도 만족하실 수 있도록 준비하겠습니다.', 'demo_salon', 1),
('방문해주셔서 감사합니다. 알려드린 스타일링 방법도 꼭 활용해보세요.', 'demo_salon', 2);
