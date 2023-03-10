// keep function is authen
import User from "../models/UserModel.js";
import argon2 from "argon2";

// login function
export const Login = async (req, res) =>{
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    });
    if(!user) return res.status(404).json({msg: "ไม่พบผู้ใช้งาน"})
    const match = await argon2.verify(user.password, req.body.password);
    if(!match) return res.status(400).json({msg: "รหัสไม่ถูกต้อง"});
    req.session.userId = user.uuid;
    const uuid = user.uuid;
    const name = user.name;
    const email = user.email;
    const role = user.role;
    res.status(200).json({uuid, name, email, role});
}

// user view detail myself function
export const Me = async (req, res) =>{
    if(!req.session.userId){
        return res.status(401).json({msg: "กรุณาเข้าสู่ระบบบัญชีของคุณ"})
    }
    const user = await User.findOne({
        attributes:['uuid', 'name', 'email', 'role'],
        where:{
            uuid: req.session.userId
        }
    });
    if(!user) return res.status(404).json({msg: "ไม่พบชื่อผู้ใช้"})
    res.status(200).json(user);
}

// logout function
export const Logout = (req,res) =>{
    req.session.destroy((err)=>{
        if(err) return res.status(400).json({msg: "ไม่ได้ออกจากระบบ"})
        res.status(200).json({msg: "คุณได้ออกจากระบบ"})
    });
}