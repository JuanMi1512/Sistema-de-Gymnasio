import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import phase2 from './phase2.js';

const app = express();
const pool = mysql.createPool({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||3306),user:process.env.DB_USER,password:process.env.DB_PASSWORD,database:process.env.DB_NAME,waitForConnections:true,connectionLimit:10});
app.use(helmet()); app.use(cors({origin:process.env.CLIENT_ORIGIN?.split(',')||true,credentials:true})); app.use(express.json({limit:'1mb'})); app.use(rateLimit({windowMs:15*60*1000,max:150}));
const sign = (user) => jwt.sign({sub:user.id,organizationId:user.organization_id,branchId:user.branch_id,role:user.role_code},process.env.JWT_ACCESS_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN||'8h'});
function auth(req,res,next){try{req.user=jwt.verify(req.headers.authorization?.replace('Bearer ','')||'',process.env.JWT_ACCESS_SECRET);next()}catch{return res.status(401).json({error:'No autorizado'})}}
app.get('/api/health',async(req,res)=>{try{await pool.query('SELECT 1');res.json({status:'ok'})}catch{res.status(503).json({status:'database_unavailable'})}});
app.post('/api/auth/login',async(req,res,next)=>{try{const body=z.object({email:z.string().email(),password:z.string().min(1)}).parse(req.body);const [rows]=await pool.query(`SELECT u.*,r.code role_code FROM users u JOIN roles r ON r.id=u.role_id WHERE u.email=? AND u.deleted_at IS NULL LIMIT 1`,[body.email.toLowerCase()]);const user=rows[0];if(!user||user.status!=='active'||!(await bcrypt.compare(body.password,user.password_hash)))return res.status(401).json({error:'Credenciales invÃ¡lidas'});await pool.query('UPDATE users SET last_login_at=NOW(),failed_attempts=0 WHERE id=?',[user.id]);res.json({accessToken:sign(user),user:{id:user.id,name:`${user.first_name} ${user.last_name}`,email:user.email,role:user.role_code,branchId:user.branch_id}})}catch(err){next(err)}});
app.get('/api/me',auth,async(req,res,next)=>{try{const [rows]=await pool.query(`SELECT u.id,u.first_name,u.last_name,u.email,r.code role,b.name branch FROM users u JOIN roles r ON r.id=u.role_id LEFT JOIN branches b ON b.id=u.branch_id WHERE u.id=?`,[req.user.sub]);res.json(rows[0]||null)}catch(err){next(err)}});
app.get('/api/dashboard',auth,async(req,res,next)=>{try{const org=req.user.organizationId;const [branches]=await pool.query('SELECT id,name,capacity FROM branches WHERE organization_id=? AND is_active=1',[org]);const [[metrics]]=await pool.query(`SELECT
 (SELECT COUNT(*) FROM members WHERE organization_id=? AND status='active' AND deleted_at IS NULL) activeMembers,
 (SELECT COUNT(*) FROM members WHERE organization_id=? AND created_at>=CURDATE() AND deleted_at IS NULL) newMembers,
 (SELECT COUNT(*) FROM memberships WHERE organization_id=? AND status='active' AND end_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(),INTERVAL 7 DAY)) expiringMemberships,
 (SELECT COUNT(*) FROM checkins WHERE organization_id=? AND result='allowed' AND checkin_at>=CURDATE()) todayCheckins,
 (SELECT COALESCE(SUM(amount),0) FROM payment_records WHERE organization_id=? AND paid_at>=CURDATE()) dailyIncome`,[org,org,org,org,org]);res.json({organization:'BLUE FIT',branches,metrics})}catch(err){next(err)}});
app.use('/api', phase2(pool,auth));
app.use((err,req,res,next)=>{if(err instanceof z.ZodError)return res.status(400).json({error:'Datos invÃ¡lidos',details:err.flatten()});console.error(err);res.status(500).json({error:'Error interno'})});
app.listen(Number(process.env.PORT||3001),()=>console.log(`BLUE FIT API en http://localhost:${process.env.PORT||3001}`));

