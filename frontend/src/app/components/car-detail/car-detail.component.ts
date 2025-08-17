import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CarService } from '../../services/car.service';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { Car } from '../../models/car.model';

@Component({
  selector: 'app-car-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './car-detail.component.html',
  styles: []
})
export class CarDetailComponent implements OnInit {
  car: Car | null = null;
  loading = true;
  bookingForm!: FormGroup;
  bookingLoading = false;
  bookingError = '';
  bookingSuccess = '';
  totalAmount = 0;
  totalDays = 0;
  minDate: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carService: CarService,
    public authService: AuthService,
    private apiService: ApiService,
    private fb: FormBuilder
  ) {
    // Set minimum date to today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit() {
    this.initBookingForm();
    this.loadCarDetails();
  }

  initBookingForm() {
    this.bookingForm = this.fb.group({
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]]
    });

    // Calculate total amount when dates change
    this.bookingForm.valueChanges.subscribe(() => {
      this.calculateTotal();
    });
  }

  loadCarDetails() {
    const carId = this.route.snapshot.params['id'];
    this.carService.getCarById(carId).subscribe({
      next: (car: Car) => {
        this.car = car;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading car details:', error);
        this.loading = false;
      }
    });
  }

  calculateTotal() {
    const startDate = this.bookingForm.get('start_date')?.value;
    const endDate = this.bookingForm.get('end_date')?.value;

    if (startDate && endDate && this.car) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end > start) {
        this.totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
        this.totalAmount = this.totalDays * this.car.price_per_day;
      } else {
        this.totalDays = 0;
        this.totalAmount = 0;
      }
    }
  }

  onBooking() {
    if (this.bookingForm.valid && this.car) {
      this.bookingLoading = true;
      this.bookingError = '';
      this.bookingSuccess = '';

      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        this.bookingError = 'Please login to make a booking';
        this.bookingLoading = false;
        return;
      }

      const bookingData = {
        user_id: currentUser.id,
        car_id: this.car.id,
        start_date: this.bookingForm.get('start_date')?.value,
        end_date: this.bookingForm.get('end_date')?.value,
        total_amount: this.totalAmount
      };

      this.apiService.post('bookings', bookingData).subscribe({
        next: (response) => {
          this.bookingLoading = false;
          this.bookingSuccess = 'Booking successful! You will receive a confirmation email shortly.';
          this.bookingForm.reset();
        },
        error: (error) => {
          this.bookingLoading = false;
          this.bookingError = error.error?.message || 'Booking failed. Please try again.';
        }
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.bookingForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}