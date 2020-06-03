import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-snackbar",
})
export class SnackbarComponent implements OnInit {
  constructor(private snackbar: MatSnackBar) {}

  ngOnInit(): void {}
  openSnackBar(message: string, action: string) {
    this.snackbar.open(message, action, {
      duration: 5000,
      horizontalPosition: "center",
      verticalPosition: "top",
    });
  }
}
