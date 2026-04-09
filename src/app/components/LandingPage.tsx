import { Link } from 'react-router';
import { Car, Clock, Shield, Zap, ArrowRight, CheckCircle2, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

export default function LandingPage() {
  const features = [
    {
      icon: Clock,
      title: '24/7 Access',
      description: 'Park your vehicle anytime with our smart automated system',
    },
    {
      icon: Shield,
      title: 'Secure Parking',
      description: 'CCTV surveillance and security for complete peace of mind',
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Live slot availability and instant booking confirmation',
    },
    {
      icon: Car,
      title: 'Easy Management',
      description: 'Streamlined vehicle entry and exit process',
    },
  ];

  const benefits = [
    'Automated parking slot allocation',
    'Transparent pricing with no hidden fees',
    'Digital payment integration',
    'Mobile-friendly dashboard',
    'Instant vehicle tracking',
    'Monthly reports and analytics',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 py-20 lg:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm">
                <Zap className="size-4" />
                Smart Parking Solution
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Smart Car Parking System
              </h1>
              
              <p className="text-lg text-slate-600 max-w-xl">
                Revolutionize your parking experience with our intelligent management system. 
                Find, book, and manage parking slots effortlessly with real-time availability.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/book-slot">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg gap-2"
                  >
                    Book Parking
                    <ArrowRight className="size-5" />
                  </Button>
                </Link>
                <Link to="/parking-slots">
                  <Button size="lg" variant="outline" className="text-lg">
                    View Available Slots
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-slate-900">50+</div>
                  <div className="text-sm text-slate-600">Parking Slots</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">24/7</div>
                  <div className="text-sm text-slate-600">Available</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">100%</div>
                  <div className="text-sm text-slate-600">Secure</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1758304480989-38ce585ea04d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBwYXJraW5nJTIwbG90JTIwYWVyaWFsJTIwdmlld3xlbnwxfHx8fDE3NzM1NTgzNjN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Modern parking lot aerial view"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <CheckCircle2 className="size-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Real-time Tracking</div>
                    <div className="text-sm text-slate-600">Monitor your vehicle 24/7</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Why Choose Our System?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Experience the future of parking with our cutting-edge features designed for convenience and security
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-br from-blue-100 to-green-100 p-3 rounded-lg w-fit mb-4">
                  <feature.icon className="size-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Everything You Need for Effortless Parking
              </h2>
              <p className="text-lg text-slate-600">
                Our comprehensive parking management system provides all the tools you need 
                to manage your parking efficiently and securely.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>
              <Link to="/dashboard">
                <Button size="lg" className="mt-4">
                  View Dashboard
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1772256761611-6adbee864260?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMHBhcmtpbmclMjB0ZWNobm9sb2d5JTIwaWxsdXN0cmF0aW9ufGVufDF8fHx8MTc3MzU1OTA0OXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Smart parking technology"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of satisfied customers using our smart parking system
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book-slot">
              <Button size="lg" variant="secondary" className="text-lg">
                Book Your Slot Now
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="text-lg bg-white/10 text-white border-white hover:bg-white/20">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}