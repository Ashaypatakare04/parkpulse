import React, { createContext, useContext, useState } from 'react';

export interface ParkingSlot {
  id: number;
  slotNumber: string;
  status: 'available' | 'occupied';
  vehicle?: Vehicle;
}

export interface Vehicle {
  vehicleNumber: string;
  ownerName: string;
  entryTime: Date;
  slotNumber: string;
}

interface ParkingContextType {
  slots: ParkingSlot[];
  vehicles: Vehicle[];
  parkVehicle: (vehicle: Vehicle) => boolean;
  exitVehicle: (vehicleNumber: string) => { success: boolean; duration?: number; fee?: number };
  findVehicle: (vehicleNumber: string) => Vehicle | undefined;
  totalRevenue: number;
}

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

// Initialize slots
const initializeData = () => {
  const slots: ParkingSlot[] = [];
  for (let i = 1; i <= 50; i++) {
    slots.push({
      id: i,
      slotNumber: `A${i.toString().padStart(3, '0')}`,
      status: 'available',
    });
  }
  
  const demoVehicles = [
    { vehicleNumber: 'ABC-1234', ownerName: 'John Smith', slotNumber: 'A001' },
    { vehicleNumber: 'XYZ-5678', ownerName: 'Sarah Johnson', slotNumber: 'A005' },
    { vehicleNumber: 'DEF-9012', ownerName: 'Mike Davis', slotNumber: 'A010' },
    { vehicleNumber: 'GHI-3456', ownerName: 'Emily Brown', slotNumber: 'A015' },
    { vehicleNumber: 'JKL-7890', ownerName: 'David Wilson', slotNumber: 'A020' },
  ];
  
  demoVehicles.forEach(demo => {
    const slot = slots.find(s => s.slotNumber === demo.slotNumber);
    if (slot) {
      slot.status = 'occupied';
      slot.vehicle = {
        ...demo,
        entryTime: new Date(Date.now() - Math.random() * 3600000 * 5),
      };
    }
  });

  const vehicles = slots
    .filter(s => s.status === 'occupied' && s.vehicle)
    .map(s => s.vehicle!);

  return { slots, vehicles };
};

export const ParkingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState(initializeData);
  const [totalRevenue, setTotalRevenue] = useState(2350); // Initial mock revenue in ₹

  const slots = data.slots;
  const vehicles = data.vehicles;

  const parkVehicle = (vehicle: Vehicle): boolean => {
    // Check if vehicle is already parked
    if (vehicles.some(v => v.vehicleNumber === vehicle.vehicleNumber)) {
      return false;
    }

    // Check if slot is available
    const slot = slots.find(s => s.slotNumber === vehicle.slotNumber && s.status === 'available');
    if (!slot) return false;

    // Update state
    setData(prev => {
      const newSlots = prev.slots.map(s => 
        s.slotNumber === vehicle.slotNumber 
          ? { ...s, status: 'occupied' as const, vehicle }
          : s
      );
      return {
        slots: newSlots,
        vehicles: [...prev.vehicles, vehicle]
      };
    });

    return true;
  };

  const exitVehicle = (vehicleNumber: string) => {
    const vehicle = vehicles.find(v => v.vehicleNumber === vehicleNumber);
    if (!vehicle) return { success: false };

    // Calculate duration and fee
    const duration = Math.floor((new Date().getTime() - new Date(vehicle.entryTime).getTime()) / (1000 * 60 * 60));
    const fee = Math.max(10, duration * 5); // ₹10 minimum, ₹5 per hour

    // Update state
    setData(prev => {
      const newSlots = prev.slots.map(s => 
        s.slotNumber === vehicle.slotNumber 
          ? { ...s, status: 'available' as const, vehicle: undefined }
          : s
      );
      const newVehicles = prev.vehicles.filter(v => v.vehicleNumber !== vehicleNumber);
      return {
        slots: newSlots,
        vehicles: newVehicles
      };
    });

    // Update revenue
    setTotalRevenue(prev => prev + fee);

    return { success: true, duration, fee };
  };

  const findVehicle = (vehicleNumber: string) => {
    return vehicles.find(v => v.vehicleNumber === vehicleNumber);
  };

  return (
    <ParkingContext.Provider value={{ 
      slots, 
      vehicles, 
      parkVehicle, 
      exitVehicle, 
      findVehicle,
      totalRevenue 
    }}>
      {children}
    </ParkingContext.Provider>
  );
};

export const useParkingContext = () => {
  const context = useContext(ParkingContext);
  if (!context) {
    throw new Error('useParkingContext must be used within ParkingProvider');
  }
  return context;
};