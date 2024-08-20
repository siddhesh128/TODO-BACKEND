import express from 'express';
import { verifyToken } from '../middlewares/verifyToken';
import { addTodo, getTodos, updateTodo, deleteTodo, toggleTodoCompletion } from '../controllers/todoController';

const router = express.Router();

// Add Todo
router.post("/todos", verifyToken, addTodo);

// Get Todos
router.get("/todos", verifyToken, getTodos);

// Update Todo
router.put("/todos/:id", verifyToken, updateTodo);

// Delete Todo
router.delete("/todos/:id", verifyToken, deleteTodo);

// Toggle Todo Completion
router.put("/todos/toggle/:id", verifyToken, toggleTodoCompletion);

export default router;
