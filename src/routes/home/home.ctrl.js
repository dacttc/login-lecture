"use strict";
const express = require('express');
const db = require("../../config/db");
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const User = require("../../models/User");
const UserStorage = require("../../models/UserStorage");
const { getAuthCookieOptions, signAuthToken, verifyAuthToken } = require("../../config/auth");
const { runLegacyClientQuery } = require("../../utils/legacyClientQuery");


const output = {


  login: (req, res) => {
    res.render("home/login")
  }
  ,
  register: (req, res) => {
    res.render("home/register")
  },
  main: (req, res) => {


    res.render("home/index")


  }

};




const process = {
  reservation: async (req, res) => {

    //  console.log(req.cookies.authToken);

    try {
      const storeId = req.body.Storeid || req.body.store_id || req.body.username || req.params.id;
      const designerName = req.body.designer_name || req.body.designerName || req.params.stylist;
      let id = null;
      const token = req.cookies.authToken;

      // JWT 검증
      if (token) {
        try {
          const decoded = verifyAuthToken(token);
          id = decoded.id;

        } catch (err) {
          console.error('JWT 검증 오류:', err);
          id = null;
        }
      }


      // 데이터베이스 쿼리 실행
      const [designer] = await db.promise().query('SELECT * FROM designer WHERE store_id = ?  AND designer_name = ? ;', [storeId, designerName]);
      const [Holidays] = await db.promise().query('SELECT * FROM Holidays WHERE store_id = ? AND designer_name = ? ;', [storeId, designerName]);
      const [service] = await db.promise().query('SELECT * FROM service WHERE store_id = ? AND manager = ? ;', [storeId, designerName]);
 
      // const [designer] = await db.promise().query('SELECT * FROM designer WHERE store_id = ?;', [req.body.Storeid]);
      // const [review] = await db.promise().query('SELECT * FROM review WHERE store_id = ?;', [req.body.Storeid]);

      // 결과 반환
      return res.json({
        id: id,
       // replies :replies,
        designer: designer,
        Holidays: Holidays,
        service: service,
      });

    } catch (err) {
      console.error('에러 발생:', err);
      return res.status(500).json({ error: '서버 에러가 발생했습니다.' });
    }
    ;

  },
  cookiecheck1: async (req, res) => {

     
    try {
      const storeId = req.body.Storeid || req.body.store_id || req.body.username || req.params.id;
      let id = null;
      const token = req.cookies.authToken;
      let count = 0;
      // JWT 검증
      if (token) {
        try {
          const decoded = verifyAuthToken(token);
          id = decoded.id;
          const [countRows] = await db.promise().query('SELECT COUNT(*) AS pending_count FROM ServiceRequests WHERE store_id = ? AND status = "pending";', [storeId]);
          count = countRows[0].pending_count;
        } catch (err) {
          console.error('JWT 검증 오류:', err);
          id = null;
        }
      }
    
    
      // 데이터베이스 쿼리 실행

      const [users] = await db.promise().query('SELECT * FROM users WHERE id = ?;', [storeId]);
      const [News] = await db.promise().query('SELECT * FROM News WHERE store_id = ? ORDER BY id DESC;', [storeId]);
      const [service] = await db.promise().query('SELECT * FROM service WHERE store_id = ?;', [storeId]);
      const [designer] = await db.promise().query('SELECT * FROM designer WHERE store_id = ?;', [storeId]);
      const [review] = await db.promise().query('SELECT * FROM review WHERE store_id = ? ORDER BY review_id DESC;', [storeId]);
      const [replies] = await db.promise().query('SELECT * FROM replies WHERE store_id = ? ;', [storeId]);
      // 결과 반환
      return res.json({
        id: id,
        ids: id,
        own: id !== null && String(id) === String(storeId),
  
        users: users,
        News: News,
        service: service,
        designer: designer,
        replies:replies,
        review: review,
        count: count,
      });

    } catch (err) {
      console.error('에러 발생:', err);
      return res.status(500).json({ error: '서버 에러가 발생했습니다.' });
    }
    ;

  },
  serviceadd: (req, res) => {
    const token = req.cookies.authToken; // 클라이언트가 보낸 쿠키에서 토큰을 가져옴
    if (!token) {
      return res.json({
        message: 'No Token',
      });
    }
    
    // JWT 검증
    verifyAuthToken(token, (err, decoded) => {
      if (err) {
        return res.status(401).json({ success: false, message: 'Failed to authenticate token.' });
      }
      
      if (decoded.id != req.body.username) {
        return res.json({
          message: 'Verify Fail',
        });
      }
      

      // 토큰이 유효하면, 요청 처리 시작
      const requestid = req.body.requestid; // 클라이언트로부터 전달받은 requestid

      if (req.body.requestid != 0) {
        switch (requestid) {
          case 1: // 기존 처리 유지
            db.query(
              "SELECT * FROM ServiceRequests WHERE store_id = ?;",
              [req.body.username],
              (err, results) => {
                if (err) {
                  console.error('쿼리 실행 오류:', err.stack);
                  return res.json({ message: 'Database Error' });
                }

                return res.json({
                  message: 'Success',
                  data: results,
                });
              }
            );
            break;

          case 2: // 새로운 서비스 추가 요청 처리
            {
              // 클라이언트로부터 데이터 추출
              const { serviceName, servicePrice, needTime, manager, service_description } = req.body;


              // 필수 필드 확인
              if (!serviceName || !servicePrice || !needTime || !service_description) {
                return res.status(400).json({ success: false, message: '필수 필드가 누락되었습니다.' });
              }

              // 데이터베이스에 삽입
              const insertQuery = `
              INSERT INTO service (store_id, service_name, service_price, needtime, manager, service_description)
              VALUES (?, ?, ?, ?, ?, ?);
            `;

              db.query(
                insertQuery,
                [decoded.id, serviceName, servicePrice, needTime, manager || decoded.id, service_description || null],
                (err, result) => {
                  if (err) {
                    console.error('데이터 삽입 오류:', err.stack);
                    return res.json({ message: 'Database Error' });
                  }

                  return res.json({
                    message: 'Success',
                    data: {
                      id: result.insertId,
                      serviceName,
                      servicePrice,
                      needTime,
                      manager,
                    },
                  });
                }
              );
            }
            break;
          case 3:
            {
              // 휴무일 추가 처리
              const { holidayData } = req.body;

              // 필요한 변수들 추출
              const holidayType = holidayData.holidayType;
              const holidayReason = holidayData.holidayReason;
              const startTime = holidayData.startTime;
              const endTime = holidayData.endTime;
              const userId = decoded.id; // JWT 토큰에서 추출한 사용자 ID

              // 각 휴무일 유형에 따라 필요한 필드값들을 변수에 저장
              let dayOfWeek = null;
              let dayOfMonth = null;
              let monthOfYear = null;
              let dayOfYear = null;
              let specificDay = null;

              if (holidayType === 'weekly') {
                dayOfWeek = holidayData.dayOfWeek;
              } else if (holidayType === 'monthly') {
                dayOfMonth = parseInt(holidayData.dayOfMonth, 10);
              } else if (holidayType === 'yearly') {
                monthOfYear = parseInt(holidayData.monthOfYear, 10);
                dayOfYear = parseInt(holidayData.dayOfYear, 10);
              } else if (holidayType === 'specific-day') {
                specificDay = holidayData.specificDay;
              }

              // 입력 데이터 검증 (앞서 작성한 코드 사용)

              // 데이터베이스에 삽입할 쿼리 및 값 설정
              const insertQuery = `
                  INSERT INTO Holidays (
                      holiday_type, 
                      day_of_week, 
                      day_of_month, 
                      month_of_year, 
                      day_of_year, 
                      specific_day, 
                      reason, 
                      start_time, 
                      end_time, 
                      id
                  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
              `;

              const insertValues = [
                holidayType,
                dayOfWeek,
                dayOfMonth,
                monthOfYear,
                dayOfYear,
                specificDay,
                holidayReason,
                startTime,
                endTime,
                userId
              ];

              // 데이터베이스에 삽입
              db.query(insertQuery, insertValues, (err, result) => {
                if (err) {
                  console.error('데이터 삽입 오류:', err.stack);
                  return res.status(500).json({ success: false, message: '데이터베이스 오류가 발생했습니다.' });
                }

                return res.json({
                  message: 'Success',
                  data: {
                    id: result.insertId,
                    ...holidayData
                  },
                });
              });
            }
            break;

          case 4: // 기존 처리 유지

            db.query(
              'UPDATE ServiceRequests SET status = "completed" WHERE id = ? AND store_id = ?;',
              [req.body.id, decoded.id],
              (err, results) => {
                if (err) {
                  console.error('쿼리 실행 오류:', err.stack);
                  return res.json({ message: 'Database Error' });
                }

                return res.json({
                  message: 'Success',
                  data: results,
                });
              }
            );
            break;
          case 5: // 기존 처리 유지

            db.query(
              'UPDATE ServiceRequests SET status = "canceled" WHERE id = ? AND store_id = ?;',
              [req.body.id, decoded.id],
              (err, results) => {
                if (err) {
                  console.error('쿼리 실행 오류:', err.stack);
                  return res.json({ message: 'Database Error' });
                }

                return res.json({
                  message: 'Success',
                  data: results,
                });
              }
            );
            break;
          case 6: // 기존 처리 유지

            db.query(
              'DELETE FROM Holidays WHERE `index` = ? AND id = ?',
              [req.body.holidayId, decoded.id],
              (err, results) => {
                if (err) {
                  console.error('쿼리 실행 오류:', err.stack);
                  return res.json({ message: 'Database Error' });
                }

                return res.json({
                  message: 'Success',
                  data: results,
                });
              }
            );
            break;

          case 8:
            // 서비스 수정 요청 처리
            const { id, name, duration, price, manager } = req.body;

            // 입력값 검증
            if (!id || !name || !duration || !price) {
              return res.json({ message: 'Invalid Input' });
            }

            // 매니저 정보가 없을 경우 NULL로 설정
            const managerValue = manager ? manager : null;

            db.query(
              'UPDATE service SET service_name = ?, service_price = ?, needtime = ?, manager = ? WHERE id = ? AND store_id = ?',
              [name, price, duration, managerValue || decoded.id, id, decoded.id],
              (err, results) => {
                if (err) {
                  console.error('쿼리 실행 오류:', err.stack);
                  return res.json({ message: 'Database Error' });
                }

                return res.json({
                  message: 'Success',
                  data: results,
                });
              }
            );
            break;
          case 9:
            // 서비스 삭제 요청 처리
            const serviceIdToDelete = req.body.id;

            // 입력값 검증
            if (!serviceIdToDelete) {
              return res.json({ message: 'Invalid Input' });
            }

            db.query(
              'DELETE FROM service WHERE id = ? AND store_id = ?',
              [serviceIdToDelete, decoded.id],
              (err, results) => {
                if (err) {
                  console.error('쿼리 실행 오류:', err.stack);
                  return res.json({ message: 'Database Error' });
                }

                return res.json({
                  message: 'Success',
                  data: results,
                });
              }
            );
            break;
          case 10:
            // 서비스 삭제 요청 처리


            // 입력값 검증


            db.query(
              'DELETE FROM ServiceRequests WHERE id = ? AND store_id = ?',
              [req.body.id, decoded.id],
              (err, results) => {
                if (err) {
                  console.error('쿼리 실행 오류:', err.stack);
                  return res.json({ message: 'Database Error' });
                }

                return res.json({
                  message: 'Success',
                  data: results,
                });
              }
            );
            break;
          case 11:
            // 서비스 삭제 요청 처리


            const { stylistId, stylistName, stylistDescription, pristylistMajorFieldsce, stylistPhoto } = req.body;


            db.query(
              'UPDATE service SET service_name = ?, service_price = ?, needtime = ?, manager = ? WHERE id = ?',
              [name, price, duration, managerValue, id],
              (err, results) => {
                if (err) {
                  console.error('쿼리 실행 오류:', err.stack);
                  return res.json({ message: 'Database Error' });
                }

                return res.json({
                  message: 'Success',
                  data: results,
                });
              }
            );
            break;
            case 55: // Legacy client SQL endpoint
              return runLegacyClientQuery(db, req, res, { allowWrites: true });
          default:
            return res.status(400).json({ success: false, message: '잘못된 requestid입니다.' });
        }
      } else {
        return res.status(400).json({ success: false, message: 'requestid가 누락되었습니다.' });
      }
    });
  },

  cookiecheck2: (req, res) => {

    //  console.log(req.cookies.authToken);
    //homeController.home(req, res);
    const token = req.cookies.authToken; // 클라이언트가 보낸 쿠키에서 토큰을 가져옴

    if (!token) {
      return res.json({
        message: 'Fail', success: false,

      });
    }



    // JWT 검증
    verifyAuthToken(token, (err, decoded) => {
      if (err) {
        return res.status(401).json({ success: false, message: 'Failed to authenticate token.' });
      }

      let jsonsave;
      // 토큰이 유효하면, 디코딩된 사용자 정보를 요청 객체에 저장
      const requestUser = req.body.username || req.params.id;
      if (requestUser && String(decoded.id) !== String(requestUser)) {
        return res.status(403).json({ success: false, message: 'Verify Fail' });
      }

      const requestid = Number(req.body.requestid); // 클라이언트로부터 전달받은 requestid
      if (requestid === 0) {
        return res.json({ message: 'Success' });
      }

      if (req.body.requestid != 0) {
        switch (requestid) {
          case 1://들어온 요청
            db.query('SELECT * FROM ServiceRequests WHERE store_id = ?AND status = "pending";'
              , [req.body.username]
              , (err, results) => {
                if (err) {
                  console.error('쿼리 실행 오류:', err.stack);
                  return;
                }


                jsonsave = results;
                return res.json({
                  message: 'Success', ...jsonsave

                });
              });
            break;

          case 2://서비스 관리
            db.query("SELECT * FROM service WHERE manager = ?;"
              , [req.body.username]
              , (err, results) => {
                if (err) {
                  console.error('쿼리 실행 오류:', err.stack);
                  return;
                }


                jsonsave = results;
                return res.json({
                  message: 'Success', ...jsonsave

                });
              });
            break;

          case 3://휴무일

            db.query("SELECT * FROM Holidays WHERE id = ?;"
              , [req.body.username]
              , (err, results) => {
                if (err) {
                  console.error('쿼리 실행 오류:', err.stack);
                  return;
                }


                jsonsave = results;
                return res.json({
                  message: 'Success', ...jsonsave

                });
              });
            break;
          case 4: // 스타일리스트 정보 가져오기
            db.query("SELECT * FROM designer WHERE store_id = ?",
              [req.body.username],
              (err, results) => {
                if (err) {
                  console.error('쿼리 실행 오류:', err.stack);
                  return res.json({ message: 'Database error' });
                }

                const jsonsave = results;
                return res.json({
                  message: 'Success', ...jsonsave
                });
              });
            break;
          case 5: // Legacy client SQL endpoint
            return runLegacyClientQuery(db, req, res);
          default:

            console.log(`알 수 없는 요청 ID: ${requestid}`);
            res.status(400).json({ error: '유효하지 않은 요청 ID입니다.' });
            break;
        }
      }



    });

  },
  login: async (req, res) => {
    try {
      const user = new User(req.body);
      const response = await user.login();

      if (!response.success) {
        return res.status(200).json(response);
      }

      signAuthToken({ id: req.body.id }, { expiresIn: '30m' }, (err, token) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to generate token' });
        }

        // 쿠키 설정
        res.cookie('authToken', token, getAuthCookieOptions(3600000));

        // JWT 설정 후 응답 전송
        return res.status(200).json(response);
      });
    } catch (error) {
      // 로그인 과정에서 에러 발생 시 처리
      return res.status(500).json({ error: 'Login failed' });
    }
  },
  ServiceRequest: async (req, res) => {

   
    const reqb = req.body;
    if (req.body.requestid != 0) {
      switch (req.body.requestid) {
        case 1:
          const query = "INSERT INTO ServiceRequests (phone, request, store_id, request_time, status, start_time, time_taken, service_name,price,reservation_date) VALUES(?,?,?,?,?,?,?,?,?,?);";

          db.query(query, [
            reqb.phone,
            reqb.request,
            reqb.store_id,
            reqb.request_time,
            'pending',
            reqb.start_time,
            reqb.time_taken,
            reqb.service_name,
            reqb.price,
            reqb.reservation_date], (err) => {
              if (err) {
                console.error('쿼리 실행 오류:', err.stack);
                return res.json({
                  message: 'Fail',

                });
              }


              return res.json({
                message: 'Success',

              });


            });
          break;
        case 5: // Legacy client SQL endpoint
          return runLegacyClientQuery(db, req, res);
        case 7: // 기존 처리 유지

          db.query('SELECT * FROM ServiceRequests WHERE status = "completed" AND store_id=?', [req.body.username], (err, results) => {
            if (err) {
              console.error('쿼리 실행 오류:', err.stack);
              return res.json({ message: 'Database Error', error: err });
            }

            return res.json({

              message: 'Success',
              data: results
            });
          });
          break;
        default:
          return res.status(400).json({ success: false, message: '잘못된 requestid입니다.' });
      }
    } else {
      return res.status(400).json({ success: false, message: 'requestid가 누락되었습니다.' });
    }

  },
  register: async (req, res) => {
    const user = new User(req.body);
    const response = await user.register();
    return res.json(response);
  },

  getdata: async (req, res) => {

    db.query('SELECT * FROM ServiceRequests WHERE status = "completed" AND store_id=?', [req.body.username], (err, results) => {
      if (err) {
        console.error('쿼리 실행 오류:', err.stack);
        return res.json({ message: 'Database Error', error: err });
      }

      return res.json({

        message: 'Success',
        result: results[0],
      });
    }); return res.json({
      message: 'Success',

    });
  },

};

module.exports =
{
  output, process,
};
