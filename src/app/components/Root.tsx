import { Outlet } from 'react-router';
import Navbar from './Navbar';
import { Toaster } from './ui/sonner';

export default function Root() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}