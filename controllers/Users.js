// keep function is user
import User from "../models/UserModel.js";
import argon2 from "argon2";

// get all user function
export const getUsers = async(req, res) =>{
    try {
        const response = await User.findAll({
            attributes:['uuid','name','email','role']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// get one user by id function
export const getUserById = async(req, res) =>{
    try {
        const response = await User.findOne({
            attributes:['uuid','name','email','role'],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// create user function
export const createUser = async(req, res) =>{
    const {name, email, password, confPassword, role} = req.body;
    if(password !== confPassword) return res.status(400).json({msg:"Password and Confirm Password not match"});
    const hashPassword = await argon2.hash(password);
    try{
        await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        });
        res.status(201).json({msg: "Register sucess"});
    }catch (error){
        res.status(400).json({msg: error.message});
    }
}


// update user function
export const updateUser = async(req, res) =>{
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!user) return res.status(404).json({msg: "ไม่พบผู้ใช้งาน"});
    const {name, email, password, confPassword, role} = req.body;
    let hashPassword;
    if(password === "" || password === null){
        hashPassword = user.password
    }else{
        hashPassword = await argon2.hash(password);
    }
    if(password !== confPassword) return res.status(400).json({msg:"Password and Confirm Password not match"});
    try{
        await User.update({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        },{
            where:{
                id: user.id
            }
        });
        res.status(200).json({msg: "User Update"});
    }catch (error){
        res.status(400).json({msg: error.message});
    }
}

// delete user function
export const deleteUser = async(req, res) =>{
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!user) return res.status(404).json({msg: "ไม่พบผู้ใช้งาน"});
    try{
        await User.destroy({
            where:{
                id: user.id
            }
        });
        res.status(200).json({msg: "User Delete"});
    }catch (error){
        res.status(400).json({msg: error.message});
    } 
}