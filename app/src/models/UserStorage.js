"use strict"

const db = require("../config/db");
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
            console.log(data[0]);
            resolve(data[0]);
            });
            });


    }


    static async save(userInfo) {
        return new Promise((resolve, reject) => {
            const query="INSERT INTO users(id,name,psword) VALUES(?,?,?);";
        
            db.query(query, [userInfo.id,userInfo.name,userInfo.psword], (err) =>{
            if (err) reject(`${err}`);

            resolve({success:true});
            });
            });

    }
}
module.exports = UserStorage;