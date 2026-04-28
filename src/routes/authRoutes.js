import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = express.Router();
router.post('/register',(req,res)=>{
const {username,password} = req.body;
 
const hashedPassword = bcrypt.hashSync(password,10);
try{
  const insertUser = db.prepare(`INSERT INTO users(username,password) VALUES(?,?)`);
  const result = insertUser.run(username,hashedPassword)  ;

  const defaultToDo = `Hello ${username}, welcome to your to-do list! Here are some default tasks to get you started:
1. Create your first to-do item.
2. Set a reminder for an important task.
3. Explore the features of the app.
4. Customize your to-do list settings.

Feel free to add, edit, and delete tasks as you go along. Happy organizing!`;

const insertToDo = db.prepare(`INSERT INTO todos(user_id,task) VALUES(?,?)`);
insertToDo.run(result.lastInsertRowid,defaultToDo);

const token = jwt.sign({id: result.lastInsertRowid},process.env.JWT_SECRET,{expiresIn:'24h'});
res.json({token});
}catch{
    console.log(err.message);
    res.sendStatus(503);
}

})
router.post('/login',(req,res)=>{
const {username,password} = req.body;
try {
    const getUser = db.prepare(`SELECT * FROM users WHERE username = ?`);
    const user = getUser.get(username);
    if(!user){
        return res.status(404).send({message:'User not found'});
    }
} catch (error) {
    console.log(error.message);
    res.sendStatus(503);
}





})




export default router;