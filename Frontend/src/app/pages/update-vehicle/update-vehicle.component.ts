import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  NgForm,
  Validators,
} from "@angular/forms";
import { ApiService } from "src/service/api.service";
import { SnackbarComponent } from "src/app/components/snackbar/snackbar.component";
@Component({
  selector: "app-update-vehicle",
  templateUrl: "./update-vehicle.component.html",
  styleUrls: ["./update-vehicle.component.css"],
})
export class UpdateVehicleComponent implements OnInit {
  _id: String = "";
  vehicleForm: FormGroup;
  placa: String = "";
  chassi: String = "";
  renavam: String = "";
  marca: String = "";
  modelo: String = "";
  ano: String = "";
  isLoadingResults = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
    private snackBar: SnackbarComponent,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.getVehicle(this.route.snapshot.params["id"]);
    this.vehicleForm = this.formBuilder.group({
      placa: [null, Validators.required],
      chassi: [null, Validators.required],
      renavam: [null, Validators.required],
      marca: [null, Validators.required],
      modelo: [null, Validators.required],
      ano: [null, Validators.required],
    });
  }

  getVehicle(id) {
    this.api.getVehicle(id).subscribe((data) => {
      this._id = data._id;
      this.vehicleForm.setValue({
        placa: data.placa,
        chassi: data.chassi,
        renavam: data.renavam,
        marca: data.marca,
        modelo: data.modelo,
        ano: data.ano,
      });
    });
  }

  updateVehicle(form: NgForm) {
    this.isLoadingResults = true;
    this.api.updateVehicle(this._id, form).subscribe(
      (res) => {
        this.isLoadingResults = false;
        this.snackBar.openSnackBar(res.message, "Dismiss");
        this.router.navigate(["/vehicle/" + this._id]);
      },
      (err) => {
        this.snackBar.openSnackBar("Os dados estão iguais", "Dismiss");

        this.isLoadingResults = false;
      }
    );
  }
}
