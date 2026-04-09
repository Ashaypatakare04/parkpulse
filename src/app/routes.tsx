import { createBrowserRouter } from "react-router";
import Root from "./components/Root";
import LandingPage from "./components/LandingPage";
import ParkingSlots from "./components/ParkingSlots";
import VehicleEntry from "./components/VehicleEntry";
import VehicleExit from "./components/VehicleExit";
import Dashboard from "./components/Dashboard";
import Contact from "./components/Contact";
import NotFound from "./components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: LandingPage },
      { path: "parking-slots", Component: ParkingSlots },
      { path: "book-slot", Component: VehicleEntry },
      { path: "vehicle-exit", Component: VehicleExit },
      { path: "dashboard", Component: Dashboard },
      { path: "contact", Component: Contact },
      { path: "*", Component: NotFound },
    ],
  },
]);
