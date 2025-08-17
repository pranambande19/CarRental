import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Car, Category } from '../models/car.model';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  constructor(private api: ApiService) { }

  getAllCars(): Observable<Car[]> {
    return this.api.get('cars') as Observable<Car[]>;
  }

  getCarById(id: number): Observable<Car> {
    return this.api.get(`cars/${id}`) as Observable<Car>;
  }

  getCategories(): Observable<Category[]> {
    return this.api.get('cars/categories') as Observable<Category[]>;
  }
}