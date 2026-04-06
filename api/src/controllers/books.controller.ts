import { Request, Response } from 'express';
import { Book, BookStatus } from '../models/book.model';

export const getBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const books = await Book.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Server error while fetching books.' });
  }
};

export const addBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, author, pages, status } = req.body;

    if (!title || !author || !pages) {
      res.status(400).json({ message: 'Title, author, and pages are required.' });
      return;
    }

    if (typeof pages !== 'number' || pages < 1) {
      res.status(400).json({ message: 'Pages must be a number greater than 0.' });
      return;
    }

    const validStatuses: BookStatus[] = ['WANT_TO_READ', 'READING', 'READ'];
    let validatedStatus: BookStatus = 'WANT_TO_READ';
    if (status && validStatuses.includes(status)) {
      validatedStatus = status as BookStatus;
    }

    const existingBook = await Book.findOne({ userId: req.userId, title, author });
    if (existingBook) {
      res.status(409).json({ message: 'You have already added this book to your list.' });
      return;
    }

    const newBook = new Book({
      userId: req.userId,
      title,
      author,
      pages,
      status: validatedStatus,
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ message: 'Server error while adding the book.' });
  }
};

export const updateBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, author, pages, status } = req.body;

    const book = await Book.findOne({ _id: id, userId: req.userId });
    if (!book) {
      res.status(404).json({ message: 'Book not found on your list.' });
      return;
    }

    if (title) book.title = title;
    if (author) book.author = author;
    if (pages) {
      if (typeof pages !== 'number' || pages < 1) {
        res.status(400).json({ message: 'Pages must be a valid number.' });
        return;
      }
      book.pages = pages;
    }
    
    if (status) {
      const validStatuses: BookStatus[] = ['WANT_TO_READ', 'READING', 'READ'];
      if (!validStatuses.includes(status)) {
        res.status(400).json({ message: 'Invalid status.' });
        return;
      }
      book.status = status as BookStatus;
    }

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Server error while updating the book.' });
  }
};

export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const deletedBook = await Book.findOneAndDelete({ _id: id, userId: req.userId });
    if (!deletedBook) {
      res.status(404).json({ message: 'Book not found.' });
      return;
    }

    res.json({ message: 'Book deleted successfully.', id });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Server error while deleting the book.' });
  }
};
