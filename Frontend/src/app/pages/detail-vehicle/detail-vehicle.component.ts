import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiService } from "src/service/api.service";
import { Vehicle } from "src/model/vehicle";
import { ConfirmDialogComponent } from "./../../components/confirm-dialog/confirm-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { SnackbarComponent } from "./../../components/snackbar/snackbar.component";

@Component({
  selector: "app-detail-vehicle",
  templateUrl: "./detail-vehicle.component.html",
  styleUrls: ["./detail-vehicle.component.css"],
})
export class DetailVehicleComponent implements OnInit {
  vehicle: Vehicle = {
    _id: "",
    placa: "",
    chassi: "",
    modelo: "",
    marca: "",
    renavam: null,
    ano: null,
  };
  isLoadingResults = true;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
    private dialog: MatDialog,
    private snackBar: SnackbarComponent
  ) {}

  ngOnInit() {
    this.getVehicle(this.route.snapshot.params["id"]);
  }

  getVehicle(id) {
    this.api.getVehicle(id).subscribe((data) => {
      this.vehicle = data;
      this.isLoadingResults = false;
    });
  }

  deleteVehicle(id) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoadingResults = true;
        this.api.deleteVehicle(id).subscribe(
          (res) => {
            this.snackBar.openSnackBar(res.message, "Dismiss")
            this.isLoadingResults = false;
            this.router.navigate(["/vehicles"]);
          },
          (err) => {
            this.isLoadingResults = false;
          }
        );
      }
    });
  }
}
