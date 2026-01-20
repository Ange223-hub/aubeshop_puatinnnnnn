
export enum UserRole {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
  DELIVERY = 'DELIVERY',
  ADMIN = 'ADMIN'
}

export enum PaymentMethod {
  ORANGE_MONEY = 'ORANGE_MONEY',
  MOOV_MONEY = 'MOOV_MONEY'
}

export enum DeliveryType {
  PICKUP = 'PICKUP',
  DELIVERY = 'DELIVERY'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  phoneNumber?: string;
  studentIdCard?: string;
  avatar?: string;
  schedule?: any;
  locationAddress?: string;
  preferredZone?: string;
  activityCount: number; // Pour la reconnaissance IA
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  stock: number;
  allowPreOrder?: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  deliveryId?: string;
  productId: string;
  productPrice: number;
  deliveryFee: number;
  platformSaleFee: number;
  platformDeliveryFee: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  deliveryType: DeliveryType;
  transactionId?: string;
  deliveryLocation: { lat: number; lng: number; address: string; distanceKm: number };
  driverLocation?: { lat: number; lng: number };
  preOrderTime?: string;
  createdAt: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  ACCEPTED = 'ACCEPTED',
  PICKED_UP = 'PICKED_UP',
  DELIVERING = 'DELIVERING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}
