import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, create1, deleteCategory, getCategories, updateCategory } from '../controllers/category.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create)
// router.get('/create/:name', create1)
router.get('/getcategories', getCategories)
router.delete('/deletecategory/:categoryId/:userId', verifyToken, deleteCategory)
router.put('/updatecategory/:categoryId/:userId', verifyToken, updateCategory)


export default router;