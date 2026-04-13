"use client"
import React, { useEffect, useState } from "react"
import { useAppStore } from "@/lib/store"
import { listenToUserActiveBooking } from "@/lib/firebase/api"
import { Booking } from "@/types"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Modal } from "@/components/ui/Modal"
import { CarFront, Receipt, CheckCircle2 } from "lucide-react"
import { LiveMeter } from "../../components/LiveMeter"
import { CheckoutFlow } from "../../components/CheckoutFlow"
import { QRGenerator } from "../../components/QRGenerator"

export default function MyBooking() {
  const { user } = useAppStore()
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [exitResult, setExitResult] = useState<any>(null)

  useEffect(() => {
    if (!user) return
    const unsubscribe = listenToUserActiveBooking(user.id, (booking) => {
      setActiveBooking(booking)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [user])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If exitResult exists, show SUCCESS state with QR Pass
  if (exitResult) {
    return (
      <div className="animate-in fade-in duration-700 max-w-lg mx-auto mt-6 space-y-6">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-500 mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black tracking-tight">Session Ended</h1>
          <p className="text-muted-foreground text-lg">Thank you for using ParkPulse</p>
        </div>

        <QRGenerator 
          bookingId={exitResult.transactionId} 
          validUntil={exitResult.exitPassValidUntil} 
        />

        <Card className="glass overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <div className="px-6 pb-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">₹{(exitResult.fee - exitResult.taxAmount + exitResult.discountAmount).toFixed(2)}</span>
            </div>
            {exitResult.discountAmount > 0 && (
              <div className="flex justify-between text-sm text-green-500">
                <span>Discount Applied</span>
                <span className="font-medium">-₹{exitResult.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">GST (18%)</span>
              <span className="font-medium">₹{exitResult.taxAmount.toFixed(2)}</span>
            </div>
            <div className="pt-3 border-t border-white/10 flex justify-between items-end">
              <span className="text-lg font-bold">Total Paid</span>
              <span className="text-2xl font-black text-primary">₹{exitResult.fee.toFixed(2)}</span>
            </div>
            <div className="p-3 bg-muted/50 rounded-xl text-[10px] text-muted-foreground font-mono truncate">
              TXID: {exitResult.transactionId}
            </div>
          </div>
        </Card>

        <Button className="w-full h-14 rounded-2xl text-lg font-bold" onClick={() => setExitResult(null)}>
          Return to Dashboard
        </Button>
      </div>
    )
  }

  if (!activeBooking) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-md mx-auto">
        <div className="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mb-6">
          <CarFront className="h-12 w-12 text-muted-foreground opacity-30" />
        </div>
        <h2 className="text-3xl font-black tracking-tighter italic">NO ACTIVE SESSION</h2>
        <p className="text-muted-foreground mt-3 mb-8 text-lg">
          Your vehicle is not in our system. Book a slot to start your premium parking journey.
        </p>
        <Button variant="outline" className="rounded-full px-8" onClick={() => window.location.href = '/dashboard/slots'}>
          Find Available Slots
        </Button>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Active Session</h1>
          <p className="text-muted-foreground">Live tracking and session management</p>
        </div>
        <div className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black tracking-widest uppercase animate-pulse border border-primary/20">
          Live Tracking Enabled
        </div>
      </div>
      
      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-2">
          <LiveMeter 
            entryTime={activeBooking.entryTime} 
            baseFee={10} 
            hourlyRate={5} 
          />
        </div>

        <div className="md:col-span-3 space-y-6">
          <Card className="glass-premium overflow-hidden relative border-white/10 shadow-3xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[10px] font-black tracking-[0.2em] text-primary uppercase mb-1">Vehicle Details</div>
                  <CardTitle className="text-5xl font-black tracking-tighter uppercase tabular-nums">
                    {activeBooking.vehicleNumber}
                  </CardTitle>
                  <CardDescription className="text-lg mt-2 font-medium">
                    Secured at <span className="text-foreground font-bold">Slot {activeBooking.slotId}</span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <div className="px-6 pb-6 pt-4 border-t border-white/5 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Entry Timestamp</span>
                  <p className="text-lg font-bold">
                    {activeBooking.entryTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </p>
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Date</span>
                  <p className="text-lg font-bold">
                    {activeBooking.entryTime?.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Status: Occupied</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Monitored by Security 24/7</p>
                  </div>
                </div>
              </div>

              <Button 
                variant="danger" 
                className="w-full h-16 rounded-2xl text-xl font-black uppercase tracking-tighter italic shadow-xl shadow-red-500/10 hover:shadow-red-500/20 active:scale-[0.98] transition-all"
                onClick={() => setIsCheckoutOpen(true)}
              >
                Initiate Exit Sequence
              </Button>
            </div>
          </Card>

          <div className="p-6 rounded-3xl bg-muted/20 border border-white/5 flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-2xl">
              <Receipt className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Digital Receipt Guaranteed</p>
              <p className="text-xs text-muted-foreground">Automated billing with 18% GST compliance.</p>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} title="ParkPulse Checkout">
        <CheckoutFlow 
          booking={activeBooking} 
          onSuccess={(result) => {
            setExitResult(result)
            setIsCheckoutOpen(false)
          }} 
          onCancel={() => setIsCheckoutOpen(false)}
        />
      </Modal>
    </div>
  )
}
