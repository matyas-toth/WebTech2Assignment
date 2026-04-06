import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { BookService, Book, BookStatus } from '../../../core/services/book.service';
import { AuthService } from '../../../core/services/auth.service';
import { BookDialog } from '../book-dialog/book-dialog';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatToolbarModule, MatDialogModule],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css'
})
export class BookList implements OnInit {
  books: Book[] = [];
  bookService = inject(BookService);
  authService = inject(AuthService);
  dialog = inject(MatDialog);

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.bookService.getBooks().subscribe(data => this.books = data);
  }

  openAddBookDialog() {
    const dialogRef = this.dialog.open(BookDialog, { width: '400px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadBooks();
    });
  }

  openEditBookDialog(book: Book) {
    const dialogRef = this.dialog.open(BookDialog, { width: '400px', data: { book } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadBooks();
    });
  }

  deleteBook(book: Book) {
    if (book._id && confirm(`Biztosan törölni szeretnéd a(z) ${book.title} című könyvet?`)) {
      this.bookService.deleteBook(book._id).subscribe(() => this.loadBooks());
    }
  }

  updateStatus(book: Book, status: BookStatus) {
    if (book._id && book.status !== status) {
      this.bookService.updateBook(book._id, { status }).subscribe(() => this.loadBooks());
    }
  }

  logout() {
    this.authService.logout();
  }
}
