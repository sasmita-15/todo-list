import {
  addTodo,
  loginUser,
  logoutUser,
  registerUser,
  removeTodo,
  todos,
  updateTodo,
} from "../controllers/user.controller.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: All fields are required
 *       409:
 *         description: Username already exists
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Username is required
 *       404:
 *         description: User does not exist
 *       401:
 *         description: Invalid password
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /users/add-todo:
 *   post:
 *     summary: Add a new todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               todo:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               workImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Todo added successfully
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Error while creating todo
 */
router.post(
  "/add-todo",
  upload.single("workImage"),
  verifyJWT,
  addTodo
);

/**
 * @swagger
 * /users/update-todo:
 *   post:
 *     summary: Update an existing todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               todo:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Error while updating todo
 */
router.post("/update-todo", verifyJWT, updateTodo);

/**
 * @swagger
 * /users/delete-todo:
 *   post:
 *     summary: Delete a todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Todo deleted successfully
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Error while deleting todo
 */
router.post("/delete-todo", verifyJWT, removeTodo);

/**
 * @swagger
 * /users/todos:
 *   get:
 *     summary: Get all todos for a user
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Todos fetched successfully
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Error while fetching todos
 */
router.get("/todos", verifyJWT, todos);

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Not authenticated
 */
router.post("/logout", verifyJWT, logoutUser);

export default router;
