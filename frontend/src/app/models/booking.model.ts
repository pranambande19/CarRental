export interface Booking {
  id?: number;
  user_id: number;
  car_id: number;
  start_date: string;
  end_date: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  booking_date?: string;
}