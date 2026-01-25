
export interface UserProfile {
    uid: string;
    email: string;
    fullName: string;
    role: 'tenant' | 'owner' | 'admin' | 'employee';
    phoneNumber?: string;
    createdAt: string;
    photoURL?: string;
}

export interface Property {
    id?: string;
    ownerId: string;
    title: string;
    location: string;
    address: string;
    googleMapLink?: string;
    parking: '1 Car + 1 Bike' | '2 Bikes + 1 Bicycle' | 'Only Bike Parking' | 'No Parking Available';
    type: string[]; // e.g., ['For Students', 'For Families']
    propertyFor: string; // Primary category for quick filtering
    expectedRent: string;
    images: string[];
    status: 'Pending' | 'Verified' | 'Rejected' | 'Occupied';
    roomDetails?: string;
    bathroomDetails?: string;
    kitchenDetails?: string;
    createdAt: string;
    rejectionReason?: string;
    visitorCount?: number;
}
