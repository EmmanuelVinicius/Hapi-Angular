﻿import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User } from "./../model/user";

const apiUrl = "http://localhost:5000/vehicle";

@Injectable({ providedIn: "root" })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${apiUrl}/users`);
    }
}