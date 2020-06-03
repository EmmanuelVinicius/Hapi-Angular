import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CreateVehicleComponent } from "./pages/create-vehicle/create-vehicle.component";
import { ListVehicleComponent } from "./pages/list-vehicle/list-vehicle.component";
import { UpdateVehicleComponent } from "./pages/update-vehicle/update-vehicle.component";
import { DetailVehicleComponent } from "./pages/detail-vehicle/detail-vehicle.component";

const routes: Routes = [
  {
    path: "create",
    component: CreateVehicleComponent,
    data: { title: "Adicionar Veículo" },
  },
  {
    path: "vehicles",
    component: ListVehicleComponent,
    data: { title: "Lista de Veículos" },
  },
  {
    path: "update/:id",
    component: UpdateVehicleComponent,
    data: { title: "Editar do Veículo" },
  },
  {
    path: "vehicle/:id",
    component: DetailVehicleComponent,
    data: { title: "Detalhee dos Veículos" },
  },
  { path: "", redirectTo: "vehicles", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
