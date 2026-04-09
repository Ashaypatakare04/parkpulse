import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent successfully!', {
      description: 'We will get back to you within 24 hours.',
    });
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: ['+1 (555) 123-4567', '+1 (555) 765-4321'],
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['support@smartparking.com', 'info@smartparking.com'],
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      icon: MapPin,
      title: 'Address',
      details: ['123 Parking Avenue', 'Smart City, SC 12345'],
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['24/7 Automated System', 'Support: Mon-Fri 9AM-6PM'],
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Have questions or need assistance? We're here to help. Reach out to us anytime.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((info, index) => (
            <Card key={index} className={`p-6 ${info.bgColor}`}>
              <div className={`p-3 rounded-lg ${info.color} w-fit mb-4`}>
                <info.icon className="size-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-3">{info.title}</h3>
              <div className="space-y-1">
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-sm text-slate-600">
                    {detail}
                  </p>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us how we can help you..."
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  rows={5}
                  required
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                <Send className="size-5 mr-2" />
                Send Message
              </Button>
            </form>
          </Card>

          {/* Map / Additional Info */}
          <div className="space-y-6">
            <Card className="p-8 bg-gradient-to-br from-blue-50 to-green-50">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Why Choose Smart Parking?
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="bg-blue-600 rounded-full p-1 mt-0.5">
                    <div className="size-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-slate-700">
                    24/7 automated parking system with real-time updates
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-blue-600 rounded-full p-1 mt-0.5">
                    <div className="size-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-slate-700">
                    Secure parking with CCTV surveillance
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-blue-600 rounded-full p-1 mt-0.5">
                    <div className="size-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-slate-700">
                    Transparent pricing with no hidden charges
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-blue-600 rounded-full p-1 mt-0.5">
                    <div className="size-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-slate-700">
                    Easy-to-use mobile and web dashboard
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-blue-600 rounded-full p-1 mt-0.5">
                    <div className="size-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-slate-700">
                    Dedicated customer support team
                  </span>
                </li>
              </ul>
            </Card>

            <Card className="p-8">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">
                    How do I book a parking slot?
                  </h4>
                  <p className="text-sm text-slate-600">
                    Simply navigate to the "Book Slot" page, enter your vehicle details, and select an available slot.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">
                    What are the parking rates?
                  </h4>
                  <p className="text-sm text-slate-600">
                    ₹10 for the first hour and ₹5 for each additional hour.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">
                    Is the parking facility secure?
                  </h4>
                  <p className="text-sm text-slate-600">
                    Yes, our facility has 24/7 CCTV surveillance and security personnel.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
