import express from 'express';
import { createProduct, getProducts, updateProduct, deleteProduct } from '../controllers/productController';
import { protect } from '../middlewares/authMiddleware';
import { authorizeRoles } from '../middlewares/roleMiddleware';

const router = express.Router();

router.post('/', protect, authorizeRoles('admin'), createProduct);
router.get('/', protect, authorizeRoles('admin', 'manager','staff'), getProducts);
router.put('/:id', protect, authorizeRoles('admin', 'manager'), updateProduct);
router.delete('/:id', protect, authorizeRoles('admin'), deleteProduct);

export default router;
