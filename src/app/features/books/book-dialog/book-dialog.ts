import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { BookService, Book } from '../../../core/services/book.service';

@Component({
  selector: 'app-book-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatInputModule, MatButtonModule, MatSelectModule],
  templateUrl: './book-dialog.html',
  styleUrl: './book-dialog.css'
})
export class BookDialog {
  bookForm: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    public dialogRef: MatDialogRef<BookDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { book?: Book }
  ) {
    this.isEditMode = !!data?.book;
    
    this.bookForm = this.fb.group({
      title: [data?.book?.title || '', Validators.required],
      author: [data?.book?.author || '', Validators.required],
      pages: [data?.book?.pages || '', [Validators.required, Validators.min(1)]],
      status: [data?.book?.status || 'WANT_TO_READ', Validators.required]
    });
  }

  onSubmit() {
    if (this.bookForm.valid) {
      const bookData = this.bookForm.value;
      
      if (this.isEditMode && this.data.book?._id) {
        this.bookService.updateBook(this.data.book._id, bookData).subscribe({
          next: (res) => this.dialogRef.close(res),
          error: (err) => alert(err.error?.message || 'Hiba történt a könyv frissítésekor.')
        });
      } else {
        this.bookService.addBook(bookData).subscribe({
          next: (res) => this.dialogRef.close(res),
          error: (err) => alert(err.error?.message || 'Hiba történt. Lehet, hogy már hozzáadtad ezt a könyvet.')
        });
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
