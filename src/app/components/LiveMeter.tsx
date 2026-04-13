"use client"
import React, { useEffect, useState } from "react"
import { Clock, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

interface LiveMeterProps {
  entryTime: Date
  baseFee: number
  hourlyRate: number
}

export const LiveMeter: React.FC<LiveMeterProps> = ({ entryTime, baseFee, hourlyRate }) => {
  const [elapsed, setElapsed] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [currentFee, setCurrentFee] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const diffMs = now.getTime() - entryTime.getTime()
      
      const totalSeconds = Math.floor(diffMs / 1000)
      const hours = Math.floor(totalSeconds / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60
      
      setElapsed({ hours, minutes, seconds })
      
      const billingHours = Math.ceil(diffMs / (1000 * 60 * 60))
      const fee = baseFee + (billingHours > 0 ? billingHours : 1) * hourlyRate
      setCurrentFee(fee)
      
      // Progress in the current hour
      const progressInHour = (minutes * 60 + seconds) / 3600 * 100
      setProgress(progressInHour)
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [entryTime, baseFee, hourlyRate])

  return (
    <div className="flex flex-col items-center gap-6 p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden relative group">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* SVG Circular Progress */}
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            className="text-white/5"
          />
          <motion.circle
            cx="80"
            cy="80"
            r="70"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray="440"
            initial={{ strokeDashoffset: 440 }}
            animate={{ strokeDashoffset: 440 - (440 * progress) / 100 }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
            className="text-primary"
            strokeLinecap="round"
          />
        </svg>
        
        <div className="absolute flex flex-col items-center">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Amount Due</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-muted-foreground">₹</span>
            <span className="text-4xl font-bold tracking-tighter tabular-nums">
              {currentFee.toFixed(0)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="flex flex-col p-3 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Duration</span>
          </div>
          <span className="text-lg font-semibold tabular-nums leading-none">
            {elapsed.hours}h {elapsed.minutes}m {elapsed.seconds}s
          </span>
        </div>
        
        <div className="flex flex-col p-3 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 text-primary mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Pricing</span>
          </div>
          <span className="text-lg font-semibold leading-none">
            ₹{hourlyRate}/hr
          </span>
        </div>
      </div>
      
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-[10px] text-muted-foreground text-center">
        Next billing jump in {59 - elapsed.minutes}m {59 - elapsed.seconds}s
      </p>
    </div>
  )
}
