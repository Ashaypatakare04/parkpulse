"use client"
import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  CreditCard, 
  Smartphone, 
  Wallet, 
  CheckCircle2, 
  ArrowRight, 
  Percent, 
  ShieldCheck,
  Loader2,
  AlertCircle
} from "lucide-react"
import { Booking } from "@/types"
import { processExit, validateCoupon } from "@/lib/firebase/api"
import { Button } from "@/components/ui/Button"

interface CheckoutFlowProps {
  booking: Booking
  onSuccess: (result: any) => void
  onCancel: () => void
}

type Step = "summary" | "payment" | "processing" | "success"

export const CheckoutFlow: React.FC<CheckoutFlowProps> = ({ booking, onSuccess, onCancel }) => {
  const [step, setStep] = useState<Step>("summary")
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "wallet">("card")
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Pricing constants (ideally from DB)
  const baseFee = 10
  const hourlyRate = 5
  
  const diffHrs = Math.ceil((new Date().getTime() - new Date(booking.entryTime).getTime()) / (1000 * 60 * 60))
  const calculatedHours = diffHrs > 0 ? diffHrs : 1
  const subtotal = baseFee + (calculatedHours * hourlyRate)
  const tax = (subtotal - discount) * 0.18
  const total = subtotal - discount + tax

  const handleApplyCoupon = () => {
    const coupon = validateCoupon(couponCode)
    if (coupon) {
      const amount = coupon.type === "percent" ? (subtotal * coupon.value / 100) : coupon.value
      setDiscount(amount)
      setError(null)
    } else {
      setError("Invalid coupon code")
      setDiscount(0)
    }
  }

  const playSuccessSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioCtx.createOscillator()
      const gainNode = audioCtx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioCtx.destination)

      oscillator.type = "sine"
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime) // A5
      oscillator.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.1) // E6
      
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5)

      oscillator.start()
      oscillator.stop(audioCtx.currentTime + 0.5)
    } catch (e) {
      console.warn("Sound playback failed", e)
    }
  }

  const handlePayment = async () => {
    setStep("processing")
    setLoading(true)
    setError(null)
    
    // Simulate network delay for "Secure" feel
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    try {
      const result = await processExit(booking, paymentMethod, couponCode)
      playSuccessSound()
      setStep("success")
      setTimeout(() => onSuccess(result), 2000)
    } catch (err: any) {
      setError(err.message || "Payment failed. Please try again.")
      setStep("payment")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {step === "summary" && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold">Billing Summary</h2>
              <p className="text-muted-foreground">Review your session details</p>
            </div>

            <div className="p-6 rounded-3xl bg-muted/50 border border-border space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Base Fee</span>
                <span>₹{baseFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Duration ({calculatedHours} hrs)</span>
                <span>₹{(calculatedHours * hourlyRate).toFixed(2)}</span>
              </div>
              
              <div className="pt-4 border-t border-border space-y-2">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      placeholder="Coupon Code"
                      className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleApplyCoupon}>Apply</Button>
                </div>
                {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-500 font-mediumTransition">
                    <span>Discount</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">GST (18%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              
              <div className="pt-4 border-t border-border flex justify-between items-end">
                <span className="font-medium">Total Amount Due</span>
                <span className="text-3xl font-bold">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <Button className="w-full h-12 rounded-2xl group" onClick={() => setStep("payment")}>
              Continue to Payment
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        )}

        {step === "payment" && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold">Payment Method</h2>
              <p className="text-muted-foreground">Select how you'd like to pay</p>
            </div>

            <div className="space-y-3">
              {[
                { id: "wallet", name: "ParkPulse Wallet", icon: Wallet, desc: "1-Click Secure Exit" },
                { id: "upi", name: "UPI (GPay / PhonePe)", icon: Smartphone, desc: "Fast & Reliable" },
                { id: "card", name: "Credit / Debit Card", icon: CreditCard, desc: "Visa, Mastercard, RuPay" },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                    paymentMethod === method.id 
                      ? "bg-primary/5 border-primary shadow-lg shadow-primary/5" 
                      : "bg-muted/30 border-border hover:bg-muted/50"
                  }`}
                >
                  <div className={`p-3 rounded-xl ${paymentMethod === method.id ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                    <method.icon className="w-5 h-5" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-bold">{method.name}</p>
                    <p className="text-xs text-muted-foreground">{method.desc}</p>
                  </div>
                  {paymentMethod === method.id && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
              <ShieldCheck className="w-3 h-3 text-green-500" />
              Secure 256-bit SSL Payment
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => setStep("summary")}>Back</Button>
              <Button className="flex-[2]" onClick={handlePayment}>Pay ₹{total.toFixed(2)}</Button>
            </div>
          </motion.div>
        )}

        {step === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 space-y-6"
          >
            <div className="relative">
              <Loader2 className="w-20 h-20 text-primary animate-spin" />
              <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold animate-pulse">Processing Payment...</h2>
              <p className="text-muted-foreground max-w-[250px]">
                Please do not refresh or close this window while we secure your transaction.
              </p>
            </div>
          </motion.div>
        )}

        {step === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 space-y-6"
          >
            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10, stiffness: 100 }}
              >
                <CheckCircle2 className="w-16 h-16 text-green-500" />
              </motion.div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Payment Successful</h2>
              <p className="text-muted-foreground">Your exit pass is being generated.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
