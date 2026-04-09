import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ParkingProvider } from './context/ParkingContext';

export default function App() {
  return (
    <ParkingProvider>
      <RouterProvider router={router} />
    </ParkingProvider>
  );
}
