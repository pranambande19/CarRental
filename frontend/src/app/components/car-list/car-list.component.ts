import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CarService } from '../../services/car.service';
import { Car } from '../../models/car.model';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './car-list.component.html',
  styles: []
})
export class CarListComponent implements OnInit {
  cars: Car[] = [];

  constructor(
    private carService: CarService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCars();
  }

  loadCars() {
    this.carService.getAllCars().subscribe({
      next: (data: Car[]) => {
        this.cars = data;
      },
      error: (error) => {
        console.error('Error fetching cars:', error);
      }
    });
  }

  viewDetails(carId: number) {
    this.router.navigate(['/cars', carId]);
  }
}