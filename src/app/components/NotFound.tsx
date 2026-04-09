import { Link } from 'react-router';
import { Button } from './ui/button';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="text-9xl font-bold text-slate-900">404</div>
          <h1 className="text-3xl font-bold text-slate-900">Page Not Found</h1>
          <p className="text-lg text-slate-600">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button size="lg" className="gap-2">
              <Home className="size-5" />
              Go to Home
            </Button>
          </Link>
          <Link to="/parking-slots">
            <Button size="lg" variant="outline" className="gap-2">
              <Search className="size-5" />
              View Parking Slots
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
