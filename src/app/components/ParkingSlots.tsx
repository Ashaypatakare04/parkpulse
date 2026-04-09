import { useParkingContext } from '../context/ParkingContext';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Car, Search } from 'lucide-react';
import { useState } from 'react';

export default function ParkingSlots() {
  const { slots } = useParkingContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSlots = slots.filter(slot => 
    slot.slotNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableCount = slots.filter(s => s.status === 'available').length;
  const occupiedCount = slots.filter(s => s.status === 'occupied').length;

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            Parking Slots
          </h1>
          <p className="text-lg text-slate-600">
            View real-time availability of all parking slots
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Slots</p>
                <p className="text-3xl font-bold text-slate-900">{slots.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Car className="size-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 mb-1">Available</p>
                <p className="text-3xl font-bold text-green-900">{availableCount}</p>
              </div>
              <div className="bg-green-200 p-3 rounded-lg">
                <Car className="size-6 text-green-700" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 mb-1">Occupied</p>
                <p className="text-3xl font-bold text-red-900">{occupiedCount}</p>
              </div>
              <div className="bg-red-200 p-3 rounded-lg">
                <Car className="size-6 text-red-700" />
              </div>
            </div>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by slot number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Slots Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredSlots.map((slot) => (
            <Card
              key={slot.id}
              className={`p-4 transition-all cursor-pointer hover:shadow-lg ${
                slot.status === 'available'
                  ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-300 hover:border-green-400'
                  : 'bg-gradient-to-br from-red-50 to-red-100 border-red-300 hover:border-red-400'
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div
                  className={`p-3 rounded-lg ${
                    slot.status === 'available' ? 'bg-green-200' : 'bg-red-200'
                  }`}
                >
                  <Car
                    className={`size-6 ${
                      slot.status === 'available' ? 'text-green-700' : 'text-red-700'
                    }`}
                  />
                </div>
                
                <div className="text-center space-y-2 w-full">
                  <div className="font-bold text-slate-900">{slot.slotNumber}</div>
                  <Badge
                    variant={slot.status === 'available' ? 'default' : 'destructive'}
                    className="w-full justify-center"
                  >
                    {slot.status === 'available' ? 'Available' : 'Occupied'}
                  </Badge>
                  
                  {slot.vehicle && (
                    <div className="text-xs text-slate-600 pt-1 border-t border-slate-300">
                      <div className="truncate">{slot.vehicle.vehicleNumber}</div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredSlots.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600">No slots found matching your search.</p>
          </div>
        )}

        {/* Legend */}
        <div className="mt-12 flex items-center justify-center gap-8">
          <div className="flex items-center gap-2">
            <div className="size-4 bg-green-400 rounded"></div>
            <span className="text-sm text-slate-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-4 bg-red-400 rounded"></div>
            <span className="text-sm text-slate-600">Occupied</span>
          </div>
        </div>
      </div>
    </div>
  );
}
