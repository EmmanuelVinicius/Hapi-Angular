import { Component, OnInit, ViewChild } from "@angular/core";
import { Vehicle } from "src/model/vehicle";
import { ApiService } from "src/service/api.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-list-vehicle",
  templateUrl: "./list-vehicle.component.html",
  styleUrls: ["./list-vehicle.component.css"],
})
export class ListVehicleComponent implements OnInit {
  displayedColumns: string[] = [
    "placa",
    "chassi",
    "renavam",
    "modelo",
    "marca",
    "ano",
    "acao",
  ];
  dataSource: MatTableDataSource<Vehicle>;
  isLoadingResults = true;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private _api: ApiService) {}

  ngOnInit() {
    this._api.getVehicles().subscribe(
      (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoadingResults = false;
      },
      (err) => {
        this.isLoadingResults = false;
      }
    );
  }
  searchFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
