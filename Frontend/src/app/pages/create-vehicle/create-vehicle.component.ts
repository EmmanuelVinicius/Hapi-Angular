import { Component, OnInit } from "@angular/core";
import { SnackbarComponent } from 'src/app/components/snackbar/snackbar.component';
import { Router } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  NgForm,
  Validators,
} from "@angular/forms";
import { ApiService } from "src/service/api.service";

@Component({
  selector: "app-create-vehicle",
  templateUrl: "./create-vehicle.component.html",
  styleUrls: ["./create-vehicle.component.css"],
  
})
export class CreateVehicleComponent implements OnInit {
  vehicleForm: FormGroup;
  isLoadingResults = false;
  constructor(
    private router: Router,
    private api: ApiService,
    private snackBar: SnackbarComponent,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.vehicleForm = this.formBuilder.group({
      placa: [null, Validators.required],
      chassi: [null, Validators.required],
      renavam: [null, Validators.required],
      marca: [null, Validators.required],
      modelo: [null, Validators.required],
      ano: [null, Validators.required],
    });
  }
  addVehicle(form: NgForm) {
    this.isLoadingResults = true;
    this.api.addVehicle(form).subscribe(
      (res) => {
        const id = res["_id"];
        this.snackBar.openSnackBar(res.message, "Dismiss");
        this.isLoadingResults = false;
        this.router.navigate(["/vehicle", id]);
      },
      (err) => {
        this.isLoadingResults = false;
      }
    );
  }
}
