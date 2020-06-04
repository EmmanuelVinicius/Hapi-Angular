import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CreateVehicleComponent } from "./pages/create-vehicle/create-vehicle.component";
import { ListVehicleComponent } from "./pages/list-vehicle/list-vehicle.component";
import { UpdateVehicleComponent } from "./pages/update-vehicle/update-vehicle.component";
import { DetailVehicleComponent } from "./pages/detail-vehicle/detail-vehicle.component";
import { AuthGuard } from 'src/helpers/auth.guard';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: "create",
    component: CreateVehicleComponent,
    data: { title: "Adicionar Veículo" },
    canActivate: [AuthGuard] 
  },
  {
    path: "vehicles",
    component: ListVehicleComponent,
    data: { title: "Lista de Veículos" },
    canActivate: [AuthGuard] 
  },
  {
    path: "update/:id",
    component: UpdateVehicleComponent,
    data: { title: "Editar do Veículo" },
    canActivate: [AuthGuard] 
  },
  {
    path: "vehicle/:id",
    component: DetailVehicleComponent,
    data: { title: "Detalhee dos Veículos" },
    canActivate: [AuthGuard] 
  },
  { path: "*", redirectTo: "vehicles" },
  { path: "", redirectTo: "vehicles", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
