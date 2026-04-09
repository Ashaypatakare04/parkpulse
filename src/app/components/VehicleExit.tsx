import { useState } from 'react';
import { useParkingContext } from '../context/ParkingContext';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Search, Car, User, Clock, MapPin, IndianRupee, LogOut, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function VehicleExit() {
  const { findVehicle, exitVehicle } = useParkingContext();
  const [searchNumber, setSearchNumber] = useState('');
  const [foundVehicle, setFoundVehicle] = useState<any>(null);
  const [exitResult, setExitResult] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchNumber.trim()) {
      toast.error('Please enter a vehicle number');
      return;
    }

    const vehicle = findVehicle(searchNumber.toUpperCase());
    
    if (vehicle) {
      setFoundVehicle(vehicle);
      setExitResult(null);
      toast.success('Vehicle found!');
    } else {
      setFoundVehicle(null);
      setExitResult(null);
      toast.error('Vehicle not found', {
        description: 'Please check the vehicle number and try again',
      });
    }
  };

  const handleExit = () => {
    if (!foundVehicle) return;

    const result = exitVehicle(foundVehicle.vehicleNumber);
    
    if (result.success) {
      setExitResult(result);
      setFoundVehicle(null);
      toast.success('Vehicle exited successfully!', {
        description: `Total fee: ₹${result.fee}`,
      });
    } else {
      toast.error('Failed to process exit');
    }
  };

  const calculateDuration = (entryTime: Date) => {
    const duration = Math.floor((new Date().getTime() - new Date(entryTime).getTime()) / (1000 * 60 * 60));
    return duration;
  };

  const calculateFee = (entryTime: Date) => {
    const duration = calculateDuration(entryTime);
    return Math.max(10, duration * 5);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            Vehicle Exit
          </h1>
          <p className="text-lg text-slate-600">
            Search for your vehicle and complete the exit process
          </p>
        </div>

        <div className="space-y-6">
          {/* Search Form */}
          <Card className="p-6 sm:p-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="searchNumber" className="flex items-center gap-2">
                  <Search className="size-4" />
                  Search Vehicle Number
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="searchNumber"
                    type="text"
                    placeholder="e.g., ABC-1234"
                    value={searchNumber}
                    onChange={(e) => setSearchNumber(e.target.value)}
                    className="text-lg flex-1"
                  />
                  <Button type="submit" size="lg" className="gap-2">
                    <Search className="size-5" />
                    Search
                  </Button>
                </div>
              </div>
            </form>
          </Card>

          {/* Vehicle Found - Details */}
          {foundVehicle && (
            <Card className="p-6 sm:p-8 border-blue-200 bg-blue-50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-slate-900">
                  Vehicle Details
                </h2>
                <Badge variant="default" className="text-sm">
                  Active
                </Badge>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg mt-1">
                      <Car className="size-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Vehicle Number</div>
                      <div className="text-lg font-semibold text-slate-900">
                        {foundVehicle.vehicleNumber}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg mt-1">
                      <User className="size-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Owner Name</div>
                      <div className="text-lg font-semibold text-slate-900">
                        {foundVehicle.ownerName}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg mt-1">
                      <MapPin className="size-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Slot Number</div>
                      <div className="text-lg font-semibold text-slate-900">
                        {foundVehicle.slotNumber}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg mt-1">
                      <Clock className="size-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Entry Time</div>
                      <div className="text-lg font-semibold text-slate-900">
                        {new Date(foundVehicle.entryTime).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Parking Summary */}
              <div className="bg-white rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-slate-900 mb-4">Parking Summary</h3>
                
                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                  <span className="text-slate-600">Parking Duration</span>
                  <span className="font-semibold text-slate-900">
                    {calculateDuration(foundVehicle.entryTime)} hour(s)
                  </span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                  <span className="text-slate-600">Rate</span>
                  <span className="text-slate-900">
                    ₹10 + ₹{calculateDuration(foundVehicle.entryTime) > 0 ? (calculateDuration(foundVehicle.entryTime) * 5) : 0}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-semibold text-slate-900">Total Fee</span>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="size-5 text-green-600" />
                    <span className="text-2xl font-bold text-green-600">
                      ₹{calculateFee(foundVehicle.entryTime)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Exit Button */}
              <Button
                onClick={handleExit}
                size="lg"
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                <LogOut className="size-5 mr-2" />
                Exit Vehicle
              </Button>
            </Card>
          )}

          {/* Exit Success Result */}
          {exitResult && exitResult.success && (
            <Card className="p-6 sm:p-8 border-green-200 bg-green-50">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="bg-green-200 p-4 rounded-full">
                    <LogOut className="size-8 text-green-700" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-green-900">
                  Exit Successful!
                </h2>
                <p className="text-green-700">
                  Thank you for using our parking system
                </p>
                <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Duration</span>
                      <span className="font-semibold">{exitResult.duration} hour(s)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Fee</span>
                      <span className="text-xl font-bold text-green-600">
                        ₹{exitResult.fee}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setSearchNumber('');
                    setExitResult(null);
                  }}
                  variant="outline"
                >
                  Process Another Exit
                </Button>
              </div>
            </Card>
          )}

          {/* Instructions */}
          {!foundVehicle && !exitResult && (
            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">How to Exit</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>1. Enter your vehicle registration number in the search field</li>
                    <li>2. Review your parking details and calculated fee</li>
                    <li>3. Click "Exit Vehicle" to complete the process</li>
                    <li>4. Payment will be collected at the exit gate</li>
                  </ul>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
