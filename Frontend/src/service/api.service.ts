import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Vehicle } from 'src/model/vehicle';
import { SnackbarComponent } from 'src/app/components/snackbar/snackbar.component';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiUrl = 'http://localhost:5000/vehicle';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private snackbar: SnackbarComponent) { }

  getVehicles (): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(apiUrl)
      .pipe(
        tap(vehicles => vehicles),
        catchError(this.handleError('getVehicle', []))
      );
  }

  getVehicle(id: number): Observable<Vehicle> {
    const url = `${apiUrl}/${id}`;
    return this.http.get<Vehicle>(url).pipe(
      tap(vehicle => vehicle),
      catchError(this.handleError<Vehicle>(`getVehicle id=${id}`))
    );
  }

  addVehicle (vehicle): Observable<any> {
    return this.http.post(apiUrl, vehicle, httpOptions).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap(newVehicle => newVehicle),
      catchError(this.handleError<any>('addVehicle'))
    );
  }

  updateVehicle(id, vehicle): Observable<any> {
    const url = `${apiUrl}/${id}`;
    return this.http.patch(url, vehicle, httpOptions).pipe(
      tap(newVehicle => newVehicle),
      catchError(this.handleError<any>('updateVehicle'))
    );
  }

  deleteVehicle (id): Observable<any> {
    const url = `${apiUrl}/${id}`;

    return this.http.delete(url, httpOptions).pipe(
      tap(vehicle => vehicle),
      catchError(this.handleError('deleteVehicle'))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      this.snackbar.openSnackBar("Houve um erro", "Retry");

      return of(result as T);
    };
  }
}