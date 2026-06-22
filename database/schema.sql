CREATE DATABASE IF NOT EXISTS beauty_salon
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE beauty_salon;

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) NOT NULL,
  name VARCHAR(100) NOT NULL,
  psword VARCHAR(255) NOT NULL,
  photo_url VARCHAR(255) DEFAULT '미정',
  store_name VARCHAR(150) DEFAULT NULL,
  introduction TEXT,
  address VARCHAR(255) DEFAULT NULL,
  latitude DECIMAL(10, 7) DEFAULT NULL,
  longitude DECIMAL(10, 7) DEFAULT NULL,
  shop BOOLEAN NOT NULL DEFAULT FALSE,
  sns VARCHAR(255) DEFAULT NULL,
  pay VARCHAR(255) DEFAULT NULL,
  parking VARCHAR(255) DEFAULT NULL,
  photo1 VARCHAR(255) DEFAULT NULL,
  photo2 VARCHAR(255) DEFAULT NULL,
  photo3 VARCHAR(255) DEFAULT NULL,
  photo4 VARCHAR(255) DEFAULT NULL,
  photo5 VARCHAR(255) DEFAULT NULL,
  photo6 VARCHAR(255) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS designer (
  id INT NOT NULL AUTO_INCREMENT,
  store_id VARCHAR(64) NOT NULL,
  designer_name VARCHAR(100) NOT NULL,
  name VARCHAR(100) DEFAULT NULL,
  description TEXT,
  majorFields VARCHAR(255) DEFAULT NULL,
  photoURL VARCHAR(255) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_designer_store (store_id),
  UNIQUE KEY uk_designer_store_name (store_id, designer_name),
  CONSTRAINT fk_designer_store
    FOREIGN KEY (store_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS service (
  id INT NOT NULL AUTO_INCREMENT,
  store_id VARCHAR(64) DEFAULT NULL,
  service_name VARCHAR(150) NOT NULL,
  service_price INT NOT NULL DEFAULT 0,
  needtime INT NOT NULL,
  manager VARCHAR(100) DEFAULT NULL,
  service_description TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_service_store (store_id),
  INDEX idx_service_manager (manager),
  CONSTRAINT fk_service_store
    FOREIGN KEY (store_id) REFERENCES users(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS Holidays (
  `index` INT NOT NULL AUTO_INCREMENT,
  id VARCHAR(64) DEFAULT NULL,
  store_id VARCHAR(64) DEFAULT NULL,
  designer_name VARCHAR(100) DEFAULT NULL,
  holiday_type ENUM('weekly', 'monthly', 'yearly', 'specific-day') NOT NULL,
  day_of_week VARCHAR(20) DEFAULT NULL,
  day_of_month INT DEFAULT NULL,
  month_of_year INT DEFAULT NULL,
  day_of_year INT DEFAULT NULL,
  specific_day DATE DEFAULT NULL,
  reason VARCHAR(255) DEFAULT NULL,
  start_time TIME DEFAULT NULL,
  end_time TIME DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`index`),
  INDEX idx_holidays_owner (id),
  INDEX idx_holidays_store_designer (store_id, designer_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ServiceRequests (
  id INT NOT NULL AUTO_INCREMENT,
  user_id VARCHAR(64) DEFAULT NULL,
  phone VARCHAR(30) DEFAULT NULL,
  request TEXT,
  store_id VARCHAR(64) NOT NULL,
  designer_id INT DEFAULT NULL,
  service_id INT DEFAULT NULL,
  request_time DATETIME DEFAULT NULL,
  status ENUM('pending', 'completed', 'canceled') NOT NULL DEFAULT 'pending',
  start_time TIME DEFAULT NULL,
  time_taken INT DEFAULT NULL,
  service_name VARCHAR(150) DEFAULT NULL,
  price INT DEFAULT NULL,
  reservation_date DATE DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_service_requests_store_status (store_id, status),
  INDEX idx_service_requests_user (user_id),
  INDEX idx_service_requests_date (reservation_date, start_time),
  CONSTRAINT fk_service_requests_store
    FOREIGN KEY (store_id) REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_service_requests_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_service_requests_designer
    FOREIGN KEY (designer_id) REFERENCES designer(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_service_requests_service
    FOREIGN KEY (service_id) REFERENCES service(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS News (
  id INT NOT NULL AUTO_INCREMENT,
  store_id VARCHAR(64) NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  photo_url VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id),
  INDEX idx_news_store (store_id),
  CONSTRAINT fk_news_store
    FOREIGN KEY (store_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS review (
  review_id INT NOT NULL AUTO_INCREMENT,
  reviewer VARCHAR(64) DEFAULT NULL,
  manager_name VARCHAR(100) DEFAULT NULL,
  store_id VARCHAR(64) NOT NULL,
  photo_link VARCHAR(255) DEFAULT NULL,
  review_text TEXT,
  review_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  rating INT NOT NULL DEFAULT 0,
  helpful BOOLEAN NOT NULL DEFAULT FALSE,
  want_to_visit BOOLEAN NOT NULL DEFAULT FALSE,
  cool BOOLEAN NOT NULL DEFAULT FALSE,
  fun BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (review_id),
  INDEX idx_review_store (store_id),
  INDEX idx_review_reviewer (reviewer),
  CONSTRAINT fk_review_store
    FOREIGN KEY (store_id) REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_review_reviewer
    FOREIGN KEY (reviewer) REFERENCES users(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS replies (
  id INT NOT NULL AUTO_INCREMENT,
  texts TEXT NOT NULL,
  store_id VARCHAR(64) NOT NULL,
  review_id INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_replies_store (store_id),
  INDEX idx_replies_review (review_id),
  CONSTRAINT fk_replies_store
    FOREIGN KEY (store_id) REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_replies_review
    FOREIGN KEY (review_id) REFERENCES review(review_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
