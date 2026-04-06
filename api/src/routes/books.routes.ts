import { Router } from 'express';
import { getBooks, addBook, updateBook, deleteBook } from '../controllers/books.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Protect all routes with authentication middleware
router.use(authenticate);

router.get('/', getBooks);
router.post('/', addBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

export default router;
