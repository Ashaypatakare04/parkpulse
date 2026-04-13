import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Timer, Download } from "lucide-react"

interface QRGeneratorProps {
  bookingId: string
  validUntil: Date
}

export const QRGenerator: React.FC<QRGeneratorProps> = ({ bookingId, validUntil }) => {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const diff = validUntil.getTime() - now.getTime()
      if (diff <= 0) {
        setTimeLeft("EXPIRED")
        return
      }
      const mins = Math.floor(diff / 60000)
      const secs = Math.floor((diff % 60000) / 1000)
      setTimeLeft(`${mins}:${secs < 10 ? "0" : ""}${secs}`)
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [validUntil])

  const qrValue = JSON.stringify({
    id: bookingId,
    type: "PARKPULSE_EXIT_PASS",
    expiry: validUntil.toISOString()
  })

  return (
    <div className="flex flex-col items-center gap-6 p-8 rounded-[2rem] bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl">
      <div className="bg-white p-4 rounded-3xl shadow-lg relative group">
        {/* Mock QR Code SVG */}
        <svg width="180" height="180" viewBox="0 0 100 100" className="opacity-90">
          <rect width="100" height="100" fill="white" />
          <path d="M5,5 h20 v20 h-20 z M30,5 h40 v5 h-40 z M75,5 h20 v20 h-20 z M5,30 v40 h5 v-40 z M15,30 h5 v5 h-5 z M25,30 h5 v10 h-5 z M35,30 h60 v5 h-60 z M5,75 h20 v20 h-20 z M30,40 h10 v10 h-10 z M45,40 h50 v50 h-50 z" fill="black" />
          <path d="M10,10 h10 v10 h-10 z M80,10 h10 v10 h-10 z M10,80 h10 v10 h-10 z" fill="black" />
          <rect x="40" y="40" width="20" height="20" fill="white" />
          <rect x="45" y="45" width="10" height="10" fill="#3b82f6" fillOpacity="0.2" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 rounded-3xl">
          <p className="text-[10px] font-black text-black text-center px-4 uppercase leading-tight">
            Digital Signature ID:<br/>{bookingId.slice(0, 8)}...
          </p>
        </div>
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold tracking-tight">Digital Exit Pass</h3>
        <p className="text-sm text-muted-foreground max-w-[200px]">
          Scan this at the physical exit gate to release the barrier.
        </p>
      </div>

      <div className="flex items-center gap-4 w-full">
        <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
          <Timer className="w-4 h-4" />
          <span className="text-sm font-bold tabular-nums">Expires in {timeLeft}</span>
        </div>
        <button 
          className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          onClick={() => window.print()}
        >
          <Download className="w-5 h-5" />
        </button>
      </div>

      <div className="w-full flex justify-between px-2">
        <div className="flex flex-col items-center">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 mb-1" />
          <span className="text-[10px] text-muted-foreground uppercase">Verified</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mb-1" />
          <span className="text-[10px] text-muted-foreground uppercase">Secured</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-1.5 h-1.5 rounded-full bg-primary mb-1" />
          <span className="text-[10px] text-muted-foreground uppercase">Ready</span>
        </div>
      </div>
    </div>
  )
}
