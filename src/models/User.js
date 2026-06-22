"use strict";
const bcrypt = require('bcryptjs');

const UserStorage = require("./UserStorage");
class User {
    constructor(body) {
        this.body = body;

    }
    
async login() {
    const client = this.body;
    try {
        const userInfo = await UserStorage.getUserInfo(client.id);
        if (!userInfo) {
            return { success: false, msg: "존재하지 않는 아이디입니다." };
        }

        const { id, psword } = userInfo;

        if (id) {
            const isMatch = await bcrypt.compare(client.psword, psword);

            if (id === client.id && isMatch) {
                return { success: true };
            }
            return { success: false, msg: "비밀번호가 틀렸습니다." };
        }
        return { success: false, msg: "존재하지 않는 아이디입니다." };
    } catch (err) {
        return { success: false, msg: err };
    }
}
    async register() {
        const clinet = this.body;
        try {
            const response = await UserStorage.save(clinet);

            return response;
        }
        catch (err) {
            return { success: false, msg: err };
        }
    }
}

module.exports = User;
