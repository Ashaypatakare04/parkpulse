export type Role = "admin" | "user";
export type SlotStatus = "available" | "occupied";
export type BookingStatus = "active" | "completed" | "cancelled";

export interface User {
  id: string; // Firebase Auth UID
  name: string;
  email: string;
  role: Role;
  walletBalance?: number; // Added for ParkPulse Wallet
  createdAt: any;
}

export interface ParkingSlot {
  id: string;
  slotNumber: string; // e.g. "A1", "B2"
  status: SlotStatus;
  currentVehicleId: string | null; // vehicleNumber of parked vehicle
  lastUpdated: any;
}

export interface Booking {
  id: string;
  userId: string;
  vehicleNumber: string;
  slotId: string;
  entryTime: any;
  exitTime: any | null;
  status: BookingStatus;
  fee?: number; // Calculated on exit
  couponCode?: string; // Applied coupon
  exitPassValidUntil?: any; // Valid for 15 mins after payment
}

export interface Transaction {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  taxAmount: number;
  discountAmount: number;
  paymentMethod: "card" | "upi" | "wallet";
  status: "success" | "pending" | "failed";
  timestamp: any;
}

export interface LayoutLane {
  id: string;
  name: string;
  slotIds: string[];
  orientation: "horizontal" | "vertical";
}

export interface FacilityLayout {
  id: string;
  name: string;
  lanes: LayoutLane[];
  updatedAt: any;
}
