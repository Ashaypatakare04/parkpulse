import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useParkingContext } from '../context/ParkingContext';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Car, User, Clock, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function VehicleEntry() {
  const { slots, parkVehicle } = useParkingContext();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    ownerName: '',
    slotNumber: '',
  });

  const availableSlots = slots.filter(s => s.status === 'available');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.vehicleNumber || !formData.ownerName || !formData.slotNumber) {
      toast.error('Please fill in all fields');
      return;
    }

    const vehicle = {
      vehicleNumber: formData.vehicleNumber.toUpperCase(),
      ownerName: formData.ownerName,
      entryTime: new Date(),
      slotNumber: formData.slotNumber,
    };

    const success = parkVehicle(vehicle);
    
    if (success) {
      toast.success('Vehicle parked successfully!', {
        description: `Slot ${formData.slotNumber} assigned to ${formData.vehicleNumber}`,
      });
      setFormData({ vehicleNumber: '', ownerName: '', slotNumber: '' });
      setTimeout(() => navigate('/parking-slots'), 1500);
    } else {
      // Check if vehicle is already parked
      const alreadyParked = slots.some(s => s.status === 'occupied' && s.vehicle?.vehicleNumber === vehicle.vehicleNumber);
      toast.error('Failed to park vehicle', {
        description: alreadyParked 
          ? `Vehicle ${vehicle.vehicleNumber} is already parked in the system`
          : 'The selected slot may no longer be available',
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            Book Parking Slot
          </h1>
          <p className="text-lg text-slate-600">
            Enter vehicle details to reserve a parking slot
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form */}
          <Card className="lg:col-span-2 p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Vehicle Number */}
              <div className="space-y-2">
                <Label htmlFor="vehicleNumber" className="flex items-center gap-2">
                  <Car className="size-4" />
                  Vehicle Number
                </Label>
                <Input
                  id="vehicleNumber"
                  type="text"
                  placeholder="e.g., MH-12-AB-1234"
                  value={formData.vehicleNumber}
                  onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
                  className="text-lg"
                  required
                />
                <p className="text-sm text-slate-500">
                  Enter your vehicle registration number
                </p>
              </div>

              {/* Owner Name */}
              <div className="space-y-2">
                <Label htmlFor="ownerName" className="flex items-center gap-2">
                  <User className="size-4" />
                  Owner Name
                </Label>
                <Input
                  id="ownerName"
                  type="text"
                  placeholder="e.g., Rahul Sharma"
                  value={formData.ownerName}
                  onChange={(e) => handleInputChange('ownerName', e.target.value)}
                  className="text-lg"
                  required
                />
                <p className="text-sm text-slate-500">
                  Enter the vehicle owner's full name
                </p>
              </div>

              {/* Entry Time (Auto-filled) */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="size-4" />
                  Entry Time
                </Label>
                <Input
                  type="text"
                  value={new Date().toLocaleString()}
                  disabled
                  className="text-lg bg-slate-100"
                />
                <p className="text-sm text-slate-500">
                  Current date and time (auto-filled)
                </p>
              </div>

              {/* Slot Number */}
              <div className="space-y-2">
                <Label htmlFor="slotNumber" className="flex items-center gap-2">
                  <MapPin className="size-4" />
                  Parking Slot
                </Label>
                <Select value={formData.slotNumber} onValueChange={(value) => handleInputChange('slotNumber', value)}>
                  <SelectTrigger className="text-lg">
                    <SelectValue placeholder="Select an available slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slot) => (
                        <SelectItem key={slot.id} value={slot.slotNumber}>
                          {slot.slotNumber}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No slots available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <p className="text-sm text-slate-500">
                  {availableSlots.length} slot(s) available
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                disabled={availableSlots.length === 0}
              >
                <Car className="size-5 mr-2" />
                Park Vehicle
              </Button>
            </form>
          </Card>

          {/* Info Sidebar */}
          <div className="space-y-6">
            {/* Available Slots Card */}
            <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-green-200 p-2 rounded-lg">
                  <CheckCircle2 className="size-5 text-green-700" />
                </div>
                <div>
                  <div className="text-sm text-green-700">Available Slots</div>
                  <div className="text-2xl font-bold text-green-900">
                    {availableSlots.length}
                  </div>
                </div>
              </div>
              <p className="text-sm text-green-700">
                Real-time slot availability
              </p>
            </Card>

            {/* Pricing Info */}
            <Card className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Parking Rates</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">First hour</span>
                  <span className="font-semibold">₹10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Additional hours</span>
                  <span className="font-semibold">₹5/hour</span>
                </div>
                <div className="pt-3 border-t border-slate-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="size-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-slate-600">
                      Payment is collected at exit. Rates are calculated based on parking duration.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Instructions */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-slate-900 mb-3">Instructions</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Enter accurate vehicle details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Select an available parking slot</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Proceed to the assigned slot</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Exit through the vehicle exit page</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
