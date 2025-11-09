import taskService from '../services/task.service.js';

class TaskController {

    async getAllTasks(req, res) {
        try {
            const tasks = await taskService.getAllTasks(req.userId);
            res.json({
                success: true,
                data: tasks
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching tasks',
                error: error.message
            });
        }
    }

    async getTaskById(req, res) {
        try {
            const task = await taskService.getTaskById(req.params.id, req.userId);
            
            if (!task) {
                return res.status(404).json({
                    success: false,
                    message: 'Task not found'
                });
            }
            
            res.json({
                success: true,
                data: task
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching task',
                error: error.message
            });
        }
    }

    async createTask(req, res) {
        try {
            const { title, description, status } = req.body;
            
            if (!title) {
                return res.status(400).json({
                    success: false,
                    message: 'Title is required'
                });
            }
            
            const newTask = await taskService.createTask(
                { title, description, status },
                req.userId
            );
            
            res.status(201).json({
                success: true,
                data: newTask
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating task',
                error: error.message
            });
        }
    }

    async updateTask(req, res) {
        try {
            const { title, description, status } = req.body;
            
            if (!title) {
                return res.status(400).json({
                    success: false,
                    message: 'Title is required'
                });
            }
            
            const updatedTask = await taskService.updateTask(
                req.params.id,
                { title, description, status },
                req.userId
            );
            
            if (!updatedTask) {
                return res.status(404).json({
                    success: false,
                    message: 'Task not found'
                });
            }
            
            res.json({
                success: true,
                data: updatedTask
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating task',
                error: error.message
            });
        }
    }

    async deleteTask(req, res) {
        try {
            const task = await taskService.getTaskById(req.params.id, req.userId);
            
            if (!task) {
                return res.status(404).json({
                    success: false,
                    message: 'Task not found'
                });
            }

            await taskService.deleteTask(req.params.id, req.userId);
            
            res.json({
                success: true,
                message: 'Task deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting task',
                error: error.message
            });
        }
    }
}

export default new TaskController();