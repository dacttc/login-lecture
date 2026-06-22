"use strict";
const UserStorage = require("../..//models/UserStorage");
const express = require("express");
const router = express.Router();
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const db = require("../../config/db");
router.use(cookieParser());
const ctrl = require("./home.ctrl")
const axios = require('axios');
const { getAuthCookieOptions, signAuthToken, verifyAuthToken } = require("../../config/auth");
const kakaoMapKey = process.env.KAKAOMAP_KEY;
const redirectUri = process.env.REDIRECTION;

function requireAuth(req, res, next) {
  const token = req.cookies.authToken;
  if (!token) {
    return res.status(401).json({ message: 'No Token' });
  }

  try {
    req.user = verifyAuthToken(token);
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Failed to authenticate token.' });
  }
}

router.get('/login', (req, res) => {
  res.render('home/login', { kakaoMapKey, redirectUri });
});
router.get('/oauth', async (req, res) => {
  const code = req.query.code; // 카카오에서 전달한 인증 코드를 가져옵니다.

  if (!code) {
    return res.status(400).send("카카오 인증 코드가 없습니다.");
  }
  try {
    // REST API 키를 직접 지정
    const clientId = kakaoMapKey; // 여기에 실제 REST API 키를 넣으세요

    // 카카오 API에 액세스 토큰 요청
    const tokenResponse = await axios.post('https://kauth.kakao.com/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: clientId, // 위에서 설정한 REST API 키 사용
        redirect_uri: redirectUri,
        code: code,
      },
      headers: {
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });

    const accessToken = tokenResponse.data.access_token;

    // 액세스 토큰을 이용해 사용자 정보 요청
    const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const kakaoId = userResponse.data.id;

    signAuthToken({ id:kakaoId }, { expiresIn: '30m' }, async (err, token) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to generate token' });
      }
    
      // 쿠키 설정 (30분 유지)
      res.cookie('authToken', token, getAuthCookieOptions(1800000));
    try {

      const [rows] = await db.promise().query('SELECT EXISTS(SELECT 1 FROM users WHERE id = ?) AS `exists`;', [kakaoId]);
      const userExists = rows[0].exists;

      if (!userExists) {
        const client = {
          id: kakaoId,
          name: "aa",
          psword: crypto.randomBytes(32).toString('hex'),
        };
        await UserStorage.save(client);
      }


      res.redirect("/");

    } catch (error) {
      // 로그인 과정에서 에러 발생 시 처리
      return res.status(500).json({ error: 'Login failed' });
    }
  });

  } catch (error) {
    console.error("Eror fetchring Kakao user info:", error);
    res.status(500).send("카카오 로그인 중 오류가 발생했습니다.");
  }
});
router.get('/register', ctrl.output.register);
router.get('/settings', (req, res) => {
  res.render("home/manage")
});
router.get('/logout', (req, res) => {
  res.render("home/detelecookie")
});

// router.use((req, res, next) => {
//   if (req.headers['x-forwarded-proto'] !== 'https') {
//     return res.redirect('https://' + req.headers.host + req.url);
//   }
//   next();
// });

// 환경 변수
router.post('/register', ctrl.process.register);
router.post('/login', ctrl.process.login,);
router.post('/cookiecheck1', ctrl.process.cookiecheck1);
router.post('/reservation', ctrl.process.reservation);
router.post('/:id/cookiecheck2', ctrl.process.cookiecheck2);
router.post('/cookiecheck2', ctrl.process.cookiecheck2);
router.post('/ServiceRequest', ctrl.process.ServiceRequest);
router.post('/:id/ServiceRequest', ctrl.process.ServiceRequest);
router.post('/serviceadd', ctrl.process.serviceadd);
router.get("/", async (req, res) => {
  res.render("home/introduction", { kakaoMapKey });

});



const rootDir = path.join(__dirname, '..', '..'); // 현재 파일 기준으로 상위 두 개 폴더로 이동

// Multer 설정 - 파일을 업로드할 경로 및 파일명 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {


    cb(null, path.join(rootDir, '/uploads'));  // 프로젝트 루트에서 src/uploads 폴더로 저장
  },
  filename: function (req, file, cb) {
 
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));  // 고유 파일명 생성
  }
});

const allowedImageExtensions = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedImageExtensions.has(ext)) {
      return cb(new Error('Only image files are allowed'));
    }
    return cb(null, true);
  },
});

function uploadStoreImage(req, res, next) {
  upload.single('storeMainImage')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    return next();
  });
}

// JSON 파싱 미들웨어
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// 정적 파일 제공 (업로드된 파일을 웹에서 접근 가능하도록 설정)
router.use('/uploads', express.static(path.join(rootDir, '/uploads')));

// 매장 설정 데이터를 처리하는 라우트
router.post('/storeSettingsUpdate', requireAuth, uploadStoreImage, (req, res) => {
  const storeMainImage = req.file ? req.file.filename : null;
  console.log('메인사진 파일명:', storeMainImage);
  res.json({ message: 'Success', data: { storeMainImage } });
});

router.get('/:id/:stylist', async (req, res) => {

  const [is_exist] = await db.promise().query('SELECT CASE WHEN EXISTS (SELECT 1 FROM designer WHERE designer_name = ? AND store_id = ?) THEN 1 ELSE 0 END AS is_exist;', [req.params.stylist, req.params.id]);
  if (is_exist[0].is_exist == 1)
    res.render("home/reservaiton");
  else
    res.render("home/WrongPage");

});
module.exports = router;
