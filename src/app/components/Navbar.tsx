import { Link, useLocation } from 'react-router';
import { Car, Home, LayoutGrid, LogIn, LayoutDashboard, Phone, LogOut } from 'lucide-react';
import { Button } from './ui/button';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 p-2 rounded-lg">
              <Car className="size-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-slate-900">Smart Parking</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link to="/">
              <Button 
                variant={isActive('/') ? 'default' : 'ghost'}
                className="gap-2"
              >
                <Home className="size-4" />
                Home
              </Button>
            </Link>
            <Link to="/parking-slots">
              <Button 
                variant={isActive('/parking-slots') ? 'default' : 'ghost'}
                className="gap-2"
              >
                <LayoutGrid className="size-4" />
                Parking Slots
              </Button>
            </Link>
            <Link to="/book-slot">
              <Button 
                variant={isActive('/book-slot') ? 'default' : 'ghost'}
                className="gap-2"
              >
                <LogIn className="size-4" />
                Book Slot
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button 
                variant={isActive('/dashboard') ? 'default' : 'ghost'}
                className="gap-2"
              >
                <LayoutDashboard className="size-4" />
                Dashboard
              </Button>
            </Link>
            <Link to="/contact">
              <Button 
                variant={isActive('/contact') ? 'default' : 'ghost'}
                className="gap-2"
              >
                <Phone className="size-4" />
                Contact
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/book-slot">
              <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                Book Parking
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden px-4 pb-3 space-y-1">
        <Link to="/">
          <Button 
            variant={isActive('/') ? 'default' : 'ghost'}
            className="w-full justify-start gap-2"
          >
            <Home className="size-4" />
            Home
          </Button>
        </Link>
        <Link to="/parking-slots">
          <Button 
            variant={isActive('/parking-slots') ? 'default' : 'ghost'}
            className="w-full justify-start gap-2"
          >
            <LayoutGrid className="size-4" />
            Parking Slots
          </Button>
        </Link>
        <Link to="/book-slot">
          <Button 
            variant={isActive('/book-slot') ? 'default' : 'ghost'}
            className="w-full justify-start gap-2"
          >
            <LogIn className="size-4" />
            Book Slot
          </Button>
        </Link>
        <Link to="/dashboard">
          <Button 
            variant={isActive('/dashboard') ? 'default' : 'ghost'}
            className="w-full justify-start gap-2"
          >
            <LayoutDashboard className="size-4" />
            Dashboard
          </Button>
        </Link>
        <Link to="/contact">
          <Button 
            variant={isActive('/contact') ? 'default' : 'ghost'}
            className="w-full justify-start gap-2"
          >
            <Phone className="size-4" />
            Contact
          </Button>
        </Link>
      </div>
    </nav>
  );
}