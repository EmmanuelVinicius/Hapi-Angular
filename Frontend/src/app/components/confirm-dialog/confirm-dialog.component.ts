import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-confirm-dialog",
  templateUrl: "./confirm-dialog.component.html",
})
export class ConfirmDialogComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  onCancel(): void {
    this.dialog.closeAll();
  }
}
