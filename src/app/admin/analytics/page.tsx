"use client"
import React, { useEffect, useState, useMemo } from "react"
import { useAppStore } from "@/lib/store"
import { collection, onSnapshot, query, orderBy, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { Booking, Transaction } from "@/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { BarChart3, Clock, TrendingUp, IndianRupee, Activity, Users } from "lucide-react"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts'

export default function AdminAnalytics() {
  const { user } = useAppStore()
  
  const [totalBookings, setTotalBookings] = useState(0)
  const [avgDuration, setAvgDuration] = useState(0)
  const [revenue, setRevenue] = useState(0)
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    if (!user) return

    const loadData = async () => {
      try {
        const trxsShot = await getDocs(collection(db, "transactions"))
        let rev = 0
        trxsShot.forEach(d => { rev += (d.data() as Transaction).amount })
        setRevenue(rev)

        const bkShot = await getDocs(query(collection(db, "bookings"), orderBy("entryTime", "asc")))
        const bks = bkShot.docs.map(t => t.data() as Booking)
        setTotalBookings(bks.length)

        let totalHrs = 0
        let completedCount = 0
        
        const recentDays = 7
        const now = new Date()
        const dataMap: Record<string, { name: string, count: number, revenue: number }> = {}

        // Initialize last 7 days
        for (let i = recentDays - 1; i >= 0; i--) {
          const d = new Date(now)
          d.setDate(d.getDate() - i)
          const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' })
          dataMap[dateStr] = { name: dateStr, count: 0, revenue: 0 }
        }

        bks.forEach(b => {
          const entry = b.entryTime?.toDate?.() || b.entryTime;
          
          if (b.status === "completed" && entry && b.exitTime) {
            const exit = b.exitTime.toDate?.() || b.exitTime;
            const hrs = (exit.getTime() - entry.getTime()) / (1000 * 60 * 60)
            totalHrs += hrs > 0 ? hrs : 1
            completedCount++
          }

          if (entry) {
            const dateStr = entry.toLocaleDateString('en-US', { weekday: 'short' })
            if (dataMap[dateStr]) {
              dataMap[dateStr].count++
            }
          }
        })

        setChartData(Object.values(dataMap))
        setAvgDuration(completedCount > 0 ? (totalHrs / completedCount) : 0)
        setLoading(false)
      } catch (err) {
        console.error(err)
      }
    }
    
    loadData()
  }, [user])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 neon-blue">
            <BarChart3 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight glow-text">Pulse Analytics</h1>
            <p className="text-muted-foreground mt-1 font-medium">Real-time facility intelligence and revenue mapping.</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-xs font-bold flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            LIVE SYSTEM
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-premium border-blue-500/20 group hover:border-blue-500/40 transition-all">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Volume</CardTitle>
            <Activity className="h-5 w-5 text-blue-500 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black tracking-tighter">{totalBookings}</div>
            <p className="text-xs text-blue-500/70 font-bold mt-1">+12% from last week</p>
          </CardContent>
        </Card>

        <Card className="glass-premium border-orange-500/20 group hover:border-orange-500/40 transition-all">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Efficiency</CardTitle>
            <Clock className="h-5 w-5 text-orange-500 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black tracking-tighter">{avgDuration.toFixed(1)}<span className="text-xl text-muted-foreground ml-1 font-semibold">hrs</span></div>
            <p className="text-xs text-orange-500/70 font-bold mt-1">Avg. turnaround time</p>
          </CardContent>
        </Card>

        <Card className="glass-premium border-green-500/20 group hover:border-green-500/40 transition-all">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Revenue</CardTitle>
            <IndianRupee className="h-5 w-5 text-green-500 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black tracking-tighter text-green-500">₹{revenue.toLocaleString()}</div>
            <p className="text-xs text-green-500/70 font-bold mt-1">Gross lifetime volume</p>
          </CardContent>
        </Card>

        <Card className="glass-premium border-purple-500/20 group hover:border-purple-500/40 transition-all">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Growth</CardTitle>
            <Users className="h-5 w-5 text-purple-500 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black tracking-tighter">94%</div>
            <div className="w-full bg-muted rounded-full h-1.5 mt-3">
              <div className="bg-purple-500 h-1.5 rounded-full neon-purple" style={{ width: '94%' }} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-premium border-primary/10 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Activity Distribution</CardTitle>
            <CardDescription>Daily booking frequency over the trailing 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#888', fontSize: 12, fontWeight: 600 }}
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#888', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(20px)'
                  }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="var(--primary)" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-premium border-primary/10 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Peak Intensity</CardTitle>
            <CardDescription>Visualizing relative daily load on the facility.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] pt-4 flex flex-col justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#888', fontSize: 12, fontWeight: 600 }}
                  dy={10} 
                />
                <Tooltip 
                   cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                   contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} animationDuration={1500}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === chartData.length - 1 ? 'var(--primary)' : 'rgba(255,255,255,0.1)'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
