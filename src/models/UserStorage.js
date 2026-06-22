"use strict"
const bcrypt = require('bcryptjs');


const db = require("../config/db");
async function hashPassword(password) {
    const saltRounds = 10; // 보안 강도: 높을수록 해킹이 어려워지지만 처리 속도는 느려집니다.
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }
  
class UserStorage {

    static #getUserinfo(data, id) {

        const users = (JSON.parse(data)); const idx = users.id.indexOf(id);

        const userInfo = Object.keys(users).reduce((newUsers, info) => {

            newUsers[info] = users[info][idx];
            return newUsers;

        }, {});

        return userInfo;

    }
    static #getUsers(data, isALL, fields) {
        const users = JSON.parse(data);
        if (isALL) return users;

        const newUsers = fields.reduce((newUsers, field) => {

            if (users.hasOwnProperty(field)) {
                newUsers[field] = users[field];

            }
            return newUsers;


        }, {})

        return newUsers;

    }

  
    static getUserInfo(id) {
        return new Promise((resolve, reject) => {
            const query="SELECT * FROM users WHERE id = ?;";
            db.query(query, [id], (err, data) =>{
            if (err) reject(`${err}`);
            resolve(data[0]);
            });
            });


    }


    static async save(userInfo) {
        return new Promise(async (resolve, reject) => {
            const query = `
                INSERT INTO users
                (id, name, psword, photo_url, store_name, introduction, photo1, photo2, photo3, photo4, photo5, photo6) 
                VALUES (?, ?, ?, '미정', '/uploads/pexels-thgusstavo-1813272.jpg', '안녕하세요', '/uploads/hair1.jpg', '/uploads/hair2.jpg', '/uploads/hair3.jpg', '/uploads/hair4.jpg', '/uploads/hair5.jpg', '/uploads/hair6.jpg');
            `;
    
            try {
                const hashedPassword = await hashPassword(userInfo.psword); // 비동기 함수 호출
                db.query(query, [userInfo.id, userInfo.name, hashedPassword], (err) => {
                    if (err) {
                        reject(`SQL Error: ${err}`);
                    } else {
                        resolve({ success: true });
                    }
                });
            } catch (error) {
                reject(`Hashing Error: ${error}`);
            }
        });
    }
    

    

}

module.exports = UserStorage;
