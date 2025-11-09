import db from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class AuthService {
    
    // Registrar nuevo usuario
    async register(userData) {
        const { name, email, password } = userData;
        
        // Verificar si el email ya existe
        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            throw new Error('Email already registered');
        }
        
        // Encriptar password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Crear usuario
        const [result] = await db.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        
        return { id: result.insertId, name, email };
    }
    
    // Login
    async login(email, password) {
        // Buscar usuario
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];
        
        if (!user) {
            throw new Error('Invalid credentials');
        }
        
        // Verificar password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            throw new Error('Invalid credentials');
        }
        
        // Generar JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        };
    }
}

export default new AuthService();