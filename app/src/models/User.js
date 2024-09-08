"use strict";

const UserStorage = require("./UserStorage");
class User {
    constructor(body) {
        this.body = body;

    }
    async login() {
        const clinet = this.body;
try{
        const { id, psword } = await UserStorage.getUserInfo(clinet.id);
        

        if (id) {
            if (id == clinet.id && psword == clinet.psword) {
                return { success: true };


            }
            return { success: false, msg: "비밀번호가 틀렸습니다." };
        }
        return { success: false, msg: "존재하지 않는 아이디입니다." };
    }
    catch(err)
    {
        return {success:false,msg:err};
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

