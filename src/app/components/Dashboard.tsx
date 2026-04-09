import { useParkingContext } from '../context/ParkingContext';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { Car, IndianRupee, TrendingUp, Activity, Clock, MapPin, LogOut } from 'lucide-react';
import { Link } from 'react-router';

export default function Dashboard() {
  const { slots, vehicles, totalRevenue } = useParkingContext();

  const totalSlots = slots.length;
  const occupiedSlots = slots.filter(s => s.status === 'occupied').length;
  const availableSlots = slots.filter(s => s.status === 'available').length;
  const occupancyRate = ((occupiedSlots / totalSlots) * 100).toFixed(1);

  // Mock data for charts
  const weeklyData = [
    { day: 'Mon', occupied: 32, available: 18, revenue: 450 },
    { day: 'Tue', occupied: 28, available: 22, revenue: 380 },
    { day: 'Wed', occupied: 35, available: 15, revenue: 520 },
    { day: 'Thu', occupied: 40, available: 10, revenue: 610 },
    { day: 'Fri', occupied: 45, available: 5, revenue: 720 },
    { day: 'Sat', occupied: 38, available: 12, revenue: 580 },
    { day: 'Sun', occupied: 30, available: 20, revenue: 420 },
  ];

  const slotDistribution = [
    { name: 'Occupied', value: occupiedSlots, color: '#ef4444' },
    { name: 'Available', value: availableSlots, color: '#22c55e' },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 1200 },
    { month: 'Feb', revenue: 1450 },
    { month: 'Mar', revenue: 2350 },
    { month: 'Apr', revenue: 1800 },
    { month: 'May', revenue: 2100 },
    { month: 'Jun', revenue: 2500 },
  ];

  const statsCards = [
    {
      title: 'Total Slots',
      value: totalSlots,
      icon: Car,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Occupied Slots',
      value: occupiedSlots,
      icon: Activity,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
    },
    {
      title: 'Available Slots',
      value: availableSlots,
      icon: MapPin,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Revenue Collected',
      value: `₹${totalRevenue}`,
      icon: IndianRupee,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-lg text-slate-600">
            Overview of parking system performance and analytics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index} className={`p-6 ${stat.bgColor} border-${stat.textColor.split('-')[1]}-200`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="size-6 text-white" />
                </div>
                <TrendingUp className={`size-5 ${stat.textColor}`} />
              </div>
              <div className="space-y-1">
                <p className={`text-sm ${stat.textColor}`}>{stat.title}</p>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Occupancy Chart */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-6">
              Weekly Occupancy Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Bar dataKey="occupied" fill="#ef4444" name="Occupied" radius={[8, 8, 0, 0]} />
                <Bar dataKey="available" fill="#22c55e" name="Available" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Slot Distribution Pie Chart */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-6">
              Current Slot Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={slotDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }: { name: string; value: number; percent: number }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {slotDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="size-4 bg-red-500 rounded"></div>
                <span className="text-sm text-slate-600">Occupied ({occupancyRate}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-4 bg-green-500 rounded"></div>
                <span className="text-sm text-slate-600">Available ({(100 - parseFloat(occupancyRate)).toFixed(1)}%)</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Revenue Chart */}
        <Card className="p-6 mb-8">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">
            Revenue Trend (Last 6 Months)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                name="Revenue (₹)"
                dot={{ fill: '#8b5cf6', r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Active Vehicles Table */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-900">
              Active Vehicles
            </h3>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-sm">
                {vehicles.length} Active
              </Badge>
              <Link to="/vehicle-exit">
                <Button size="sm" variant="outline" className="gap-2">
                  <LogOut className="size-4" />
                  Process Exit
                </Button>
              </Link>
            </div>
          </div>

          {vehicles.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle Number</TableHead>
                    <TableHead>Owner Name</TableHead>
                    <TableHead>Slot Number</TableHead>
                    <TableHead>Entry Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles.map((vehicle, index) => {
                    const duration = Math.floor(
                      (new Date().getTime() - new Date(vehicle.entryTime).getTime()) / (1000 * 60 * 60)
                    );
                    return (
                      <TableRow key={index}>
                        <TableCell className="font-semibold">
                          {vehicle.vehicleNumber}
                        </TableCell>
                        <TableCell>{vehicle.ownerName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{vehicle.slotNumber}</Badge>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {new Date(vehicle.entryTime).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="size-4 text-slate-500" />
                            <span>{duration}h</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive">Parked</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <Car className="size-12 mx-auto mb-3 text-slate-300" />
              <p>No active vehicles at the moment</p>
            </div>
          )}
        </Card>

        {/* Quick Stats Footer */}
        <div className="mt-8 grid sm:grid-cols-3 gap-6">
          <Card className="p-6 text-center bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <div className="text-4xl font-bold mb-2">{occupancyRate}%</div>
            <div className="text-blue-100">Occupancy Rate</div>
          </Card>
          <Card className="p-6 text-center bg-gradient-to-br from-green-600 to-green-700 text-white">
            <div className="text-4xl font-bold mb-2">{vehicles.length}</div>
            <div className="text-green-100">Active Vehicles</div>
          </Card>
          <Card className="p-6 text-center bg-gradient-to-br from-purple-600 to-purple-700 text-white">
            <div className="text-4xl font-bold mb-2">₹{totalRevenue}</div>
            <div className="text-purple-100">Total Revenue Collected</div>
          </Card>
        </div>

        {/* Logout Button */}
        <div className="mt-12">
          <Button variant="destructive" className="w-full">
            <LogOut className="size-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}