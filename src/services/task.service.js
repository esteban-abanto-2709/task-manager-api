import db from '../config/database.js';

class TaskService {
    
    // Obtener tareas del usuario
    async getAllTasks(userId) {
        const [rows] = await db.query(
            'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        return rows;
    }

    // Obtener tarea por ID (solo si pertenece al usuario)
    async getTaskById(id, userId) {
        const [rows] = await db.query(
            'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return rows[0];
    }

    // Crear tarea
    async createTask(taskData, userId) {
        const { title, description, status = 'pending' } = taskData;
        
        const [result] = await db.query(
            'INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)',
            [title, description, status, userId]
        );
        
        return this.getTaskById(result.insertId, userId);
    }

    // Actualizar tarea
    async updateTask(id, taskData, userId) {
        const { title, description, status } = taskData;
        
        await db.query(
            'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?',
            [title, description, status, id, userId]
        );
        
        return this.getTaskById(id, userId);
    }

    // Eliminar tarea
    async deleteTask(id, userId) {
        await db.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
        return { message: 'Task deleted successfully' };
    }
}

export default new TaskService();