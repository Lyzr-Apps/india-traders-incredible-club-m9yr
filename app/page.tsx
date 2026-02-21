'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Slider } from '@/components/ui/slider'
import {
  RiDashboardLine,
  RiUserSearchLine,
  RiFileEditLine,
  RiSendPlaneLine,
  RiNotification3Line,
  RiCheckLine,
  RiCloseLine,
  RiLoader4Line,
  RiRefreshLine,
  RiArrowRightLine,
  RiMailLine,
  RiTwitterXLine,
  RiWhatsappLine,
  RiFacebookCircleLine,
  RiInstagramLine,
  RiCheckboxCircleLine,
  RiErrorWarningLine,
  RiFileTextLine,
  RiTimeLine,
  RiUserLine,
  RiHashtag,
  RiExternalLinkLine,
  RiClipboardLine,
  RiDownload2Line,
  RiSearchLine,
  RiLineChartLine,
  RiMenuLine,
  RiEyeLine,
  RiDeleteBinLine,
  RiSettings4Line,
} from 'react-icons/ri'

// --- AGENT IDS ---
const LEAD_BUILDER_AGENT = '6999e718793564beb34c240d'
const CONTENT_CREATOR_AGENT = '6999e7181868c611d8698139'
const DISTRIBUTION_AGENT = '6999e72cc769218e9f83e984'

// --- TYPE INTERFACES ---
interface Lead {
  name: string
  trading_segment: string
  whatsapp: string
  email: string
  facebook_id: string
  instagram_id: string
  platform: string
  location: string
  status?: string
  id?: string
}

interface ContentItem {
  title: string
  content_type: string
  script: string
  description: string
  target_segments: string[]
  key_points: string[]
  call_to_action: string
  hashtags: string[]
  email_subject: string
  social_post: string
  status?: string
  created_at?: string
  id?: string
}

interface DistributionRecipient {
  email: string
  status: string
  name: string
}

interface DistributionResult {
  campaign_name: string
  emails_sent: number
  emails_failed: number
  twitter_posted: boolean
  twitter_post_url: string
  distribution_summary: string
  recipients: DistributionRecipient[]
  channels_used: string[]
}

interface CampaignHistory {
  campaign_name: string
  content_title: string
  leads_targeted: number
  channels: string[]
  date: string
  status: string
  result?: DistributionResult
}

// --- SAMPLE DATA ---
const SAMPLE_LEADS: Lead[] = [
  { name: 'Rajesh Kumar', trading_segment: 'Stock', whatsapp: '+91-9876543210', email: 'rajesh.k@gmail.com', facebook_id: 'rajesh.trader', instagram_id: '@rajesh_stocks', platform: 'Zerodha', location: 'Mumbai', status: 'Approved', id: 's1' },
  { name: 'Priya Sharma', trading_segment: 'Forex', whatsapp: '+91-9871234560', email: 'priya.forex@yahoo.com', facebook_id: 'priya.fx', instagram_id: '@priya_forex', platform: 'IQ Option', location: 'Delhi', status: 'New', id: 's2' },
  { name: 'Vikram Singh', trading_segment: 'Commodity', whatsapp: '+91-8765432109', email: 'vikram.s@hotmail.com', facebook_id: 'vikram.commodity', instagram_id: '@vikram_trader', platform: 'MCX', location: 'Ahmedabad', status: 'Approved', id: 's3' },
  { name: 'Anita Patel', trading_segment: 'Options & Futures', whatsapp: '+91-7654321098', email: 'anita.p@gmail.com', facebook_id: 'anita.options', instagram_id: '@anita_options', platform: 'Upstox', location: 'Bangalore', status: 'New', id: 's4' },
  { name: 'Suresh Reddy', trading_segment: 'Stock', whatsapp: '+91-6543210987', email: 'suresh.r@outlook.com', facebook_id: 'suresh.nifty', instagram_id: '@suresh_nifty', platform: 'Angel One', location: 'Hyderabad', status: 'Approved', id: 's5' },
]

const SAMPLE_CONTENT: ContentItem[] = [
  {
    title: 'Mastering RSI with T4Peace Indicators',
    content_type: 'Tutorial Video Script',
    script: 'In this tutorial, we explore how the T4Peace RSI indicator helps Indian stock traders identify overbought and oversold conditions with precision...',
    description: 'A comprehensive guide to using T4Peace RSI indicators for stock market analysis, targeting NSE and BSE traders.',
    target_segments: ['Stock', 'Options & Futures'],
    key_points: ['Real-time RSI signals', 'Backtested accuracy of 78%', 'Works on NSE and BSE stocks'],
    call_to_action: 'Start your free trial of T4Peace indicators today!',
    hashtags: ['#T4Peace', '#StockTrading', '#RSI', '#IndianStocks'],
    email_subject: 'Unlock RSI Mastery with T4Peace',
    social_post: 'Struggling with entry/exit timing? T4Peace RSI indicator shows 78% accuracy on NSE stocks. Try it free!',
    status: 'Approved',
    created_at: '2025-01-15',
    id: 'sc1',
  },
  {
    title: 'Forex Scalping with T4Peace Signals',
    content_type: 'Educational Post',
    script: 'Forex scalping requires precise entry points. T4Peace signal generator provides real-time alerts for major currency pairs...',
    description: 'Learn how to use T4Peace signals for forex scalping strategies targeting INR pairs.',
    target_segments: ['Forex'],
    key_points: ['15-minute scalping strategy', 'Automated signal alerts', 'Low drawdown approach'],
    call_to_action: 'Join T4Peace Forex community now!',
    hashtags: ['#Forex', '#Scalping', '#T4Peace', '#ForexTrading'],
    email_subject: 'Scalp Forex Like a Pro with T4Peace',
    social_post: 'Forex scalping made easy with T4Peace automated signals. Join 5000+ Indian traders!',
    status: 'Draft',
    created_at: '2025-01-18',
    id: 'sc2',
  },
]

const SAMPLE_CAMPAIGNS: CampaignHistory[] = [
  { campaign_name: 'RSI Mastery Launch', content_title: 'Mastering RSI with T4Peace Indicators', leads_targeted: 45, channels: ['Email', 'Twitter'], date: '2025-01-20', status: 'Sent' },
  { campaign_name: 'Forex Outreach Wave 1', content_title: 'Forex Scalping with T4Peace Signals', leads_targeted: 28, channels: ['Email'], date: '2025-01-22', status: 'Sent' },
]

// --- MARKDOWN RENDERER ---
function formatInline(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  if (parts.length === 1) return text
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold">
        {part}
      </strong>
    ) : (
      part
    )
  )
}

function renderMarkdown(text: string) {
  if (!text) return null
  return (
    <div className="space-y-2">
      {text.split('\n').map((line, i) => {
        if (line.startsWith('### '))
          return (
            <h4 key={i} className="font-semibold text-sm mt-3 mb-1">
              {line.slice(4)}
            </h4>
          )
        if (line.startsWith('## '))
          return (
            <h3 key={i} className="font-semibold text-base mt-3 mb-1">
              {line.slice(3)}
            </h3>
          )
        if (line.startsWith('# '))
          return (
            <h2 key={i} className="font-bold text-lg mt-4 mb-2">
              {line.slice(2)}
            </h2>
          )
        if (line.startsWith('- ') || line.startsWith('* '))
          return (
            <li key={i} className="ml-4 list-disc text-sm">
              {formatInline(line.slice(2))}
            </li>
          )
        if (/^\d+\.\s/.test(line))
          return (
            <li key={i} className="ml-4 list-decimal text-sm">
              {formatInline(line.replace(/^\d+\.\s/, ''))}
            </li>
          )
        if (!line.trim()) return <div key={i} className="h-1" />
        return (
          <p key={i} className="text-sm">
            {formatInline(line)}
          </p>
        )
      })}
    </div>
  )
}

// --- ERROR BOUNDARY ---
class InlineErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: '' }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4 text-sm">{this.state.error}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: '' })}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

// --- HELPER: Unique ID generator ---
let idCounter = 100
function generateId(): string {
  idCounter += 1
  return `gen-${idCounter}`
}

// --- HELPER: Copy to clipboard ---
function copyToClipboard(text: string) {
  try {
    navigator.clipboard.writeText(text)
  } catch {
    // fallback ignored
  }
}

// --- HELPER: Export CSV ---
function exportCSV(leads: Lead[]) {
  const headers = ['Name', 'Trading Segment', 'WhatsApp', 'Email', 'Facebook ID', 'Instagram ID', 'Platform', 'Location', 'Status']
  const rows = leads.map(l => [l.name, l.trading_segment, l.whatsapp, l.email, l.facebook_id, l.instagram_id, l.platform, l.location, l.status || 'New'])
  const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c || ''}"`).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 't4peace_leads.csv'
  a.click()
  URL.revokeObjectURL(url)
}

// --- SEGMENT BADGE COLOR ---
function getSegmentColor(segment: string): string {
  const s = (segment ?? '').toLowerCase()
  if (s.includes('stock')) return 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50'
  if (s.includes('forex')) return 'bg-blue-900/60 text-blue-300 border-blue-700/50'
  if (s.includes('commodity')) return 'bg-amber-900/60 text-amber-300 border-amber-700/50'
  if (s.includes('option') || s.includes('future')) return 'bg-purple-900/60 text-purple-300 border-purple-700/50'
  return 'bg-secondary text-secondary-foreground border-border'
}

function getStatusColor(status: string): string {
  const s = (status ?? '').toLowerCase()
  if (s === 'new') return 'bg-[hsl(160,70%,40%)]/20 text-[hsl(160,70%,55%)] border-[hsl(160,70%,40%)]/40'
  if (s === 'approved') return 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50'
  if (s === 'sent' || s === 'success') return 'bg-blue-900/60 text-blue-300 border-blue-700/50'
  if (s === 'failed') return 'bg-red-900/60 text-red-300 border-red-700/50'
  if (s === 'draft') return 'bg-secondary text-muted-foreground border-border'
  return 'bg-secondary text-secondary-foreground border-border'
}

// --- STAT CARD ---
function StatCard({ icon, label, value, subtitle }: { icon: React.ReactNode; label: string; value: string | number; subtitle?: string }) {
  return (
    <Card className="bg-card border border-border shadow-md">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-muted-foreground text-sm font-sans">{label}</span>
          <div className="w-9 h-9 rounded-lg bg-[hsl(160,70%,40%)]/15 flex items-center justify-center text-[hsl(160,70%,40%)]">
            {icon}
          </div>
        </div>
        <div className="font-serif text-2xl font-bold tracking-tight">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  )
}

// --- AGENT STATUS PANEL ---
function AgentStatusPanel({ activeAgentId }: { activeAgentId: string | null }) {
  const agents = [
    { id: LEAD_BUILDER_AGENT, name: 'Lead Builder', purpose: 'Finds Indian trader leads' },
    { id: CONTENT_CREATOR_AGENT, name: 'Content Creator', purpose: 'Generates T4Peace content' },
    { id: DISTRIBUTION_AGENT, name: 'Distribution', purpose: 'Sends via Email & Twitter' },
  ]

  return (
    <Card className="bg-card border border-border shadow-md">
      <CardHeader className="pb-2 pt-3 px-3">
        <CardTitle className="text-xs font-sans font-semibold flex items-center gap-2">
          <RiSettings4Line className="w-3.5 h-3.5 text-muted-foreground" />
          Agent Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5 px-3 pb-3 pt-0">
        {agents.map((agent) => (
          <div key={agent.id} className={cn("flex items-center gap-2.5 p-1.5 rounded-md transition-all duration-200", activeAgentId === agent.id ? 'bg-[hsl(160,70%,40%)]/10 border border-[hsl(160,70%,40%)]/25' : 'bg-transparent')}>
            <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", activeAgentId === agent.id ? 'bg-[hsl(160,70%,40%)] animate-pulse' : 'bg-muted-foreground/30')} />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold truncate">{agent.name}</p>
              <p className="text-[9px] text-muted-foreground truncate">{agent.purpose}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// --- DASHBOARD SCREEN ---
function DashboardScreen({
  leads,
  contentLibrary,
  campaigns,
  onNavigate,
}: {
  leads: Lead[]
  contentLibrary: ContentItem[]
  campaigns: CampaignHistory[]
  onNavigate: (section: string) => void
}) {
  const recentLeads = leads.slice(0, 5)
  const recentContent = contentLibrary.slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold tracking-tight mb-1">Dashboard</h2>
        <p className="text-sm text-muted-foreground">Overview of your T4Peace marketing pipeline</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<RiUserLine className="w-5 h-5" />} label="Total Leads" value={leads.length} subtitle={`${leads.filter(l => l.status === 'Approved').length} approved`} />
        <StatCard icon={<RiFileTextLine className="w-5 h-5" />} label="Content Pieces" value={contentLibrary.length} subtitle={`${contentLibrary.filter(c => c.status === 'Approved').length} approved`} />
        <StatCard icon={<RiSendPlaneLine className="w-5 h-5" />} label="Campaigns Sent" value={campaigns.length} subtitle="All time" />
        <StatCard icon={<RiTimeLine className="w-5 h-5" />} label="Pending Actions" value={leads.filter(l => l.status === 'New').length + contentLibrary.filter(c => c.status === 'Draft').length} subtitle="Leads + Content to review" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border border-border shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-sans font-semibold">Recent Leads</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-[hsl(160,70%,40%)] hover:text-[hsl(160,70%,50%)]" onClick={() => onNavigate('leads')}>
                View All <RiArrowRightLine className="ml-1 w-3 h-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {recentLeads.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <RiUserSearchLine className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>No leads yet. Generate your first batch.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentLeads.map((lead, idx) => (
                  <div key={lead.id ?? idx} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-[hsl(160,70%,40%)]/15 flex items-center justify-center text-[hsl(160,70%,40%)] text-xs font-bold flex-shrink-0">
                        {(lead.name ?? '?').charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{lead.name ?? 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground truncate">{lead.email ?? 'No email'}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={cn('text-[10px] flex-shrink-0', getSegmentColor(lead.trading_segment))}>{lead.trading_segment ?? 'N/A'}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-sans font-semibold">Recent Content</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-[hsl(160,70%,40%)] hover:text-[hsl(160,70%,50%)]" onClick={() => onNavigate('content')}>
                View All <RiArrowRightLine className="ml-1 w-3 h-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {recentContent.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <RiFileEditLine className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>No content created yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentContent.map((item, idx) => (
                  <div key={item.id ?? idx} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{item.title ?? 'Untitled'}</p>
                      <p className="text-xs text-muted-foreground">{item.content_type ?? 'Content'}</p>
                    </div>
                    <Badge variant="outline" className={cn('text-[10px] flex-shrink-0 ml-2', getStatusColor(item.status ?? 'Draft'))}>{item.status ?? 'Draft'}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border border-border shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-sans font-semibold">Campaign Activity</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {campaigns.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <RiSendPlaneLine className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>No campaigns sent yet. Distribute your first content.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {campaigns.map((campaign, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/20">
                  <div className="w-8 h-8 rounded-full bg-[hsl(160,70%,40%)]/15 flex items-center justify-center text-[hsl(160,70%,40%)] flex-shrink-0 mt-0.5">
                    <RiSendPlaneLine className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{campaign.campaign_name ?? 'Campaign'}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {campaign.content_title ?? 'Content'} -- {campaign.leads_targeted ?? 0} leads targeted
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      {Array.isArray(campaign.channels) && campaign.channels.map((ch, ci) => (
                        <Badge key={ci} variant="outline" className="text-[10px] bg-secondary/50">
                          {ch === 'Email' && <RiMailLine className="w-3 h-3 mr-1" />}
                          {ch === 'Twitter' && <RiTwitterXLine className="w-3 h-3 mr-1" />}
                          {ch}
                        </Badge>
                      ))}
                      <span className="text-[10px] text-muted-foreground ml-auto">{campaign.date ?? ''}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className={cn('text-[10px] flex-shrink-0', getStatusColor(campaign.status ?? 'Sent'))}>{campaign.status ?? 'Sent'}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Button className="bg-[hsl(160,70%,40%)] text-[hsl(160,20%,98%)] hover:bg-[hsl(160,70%,35%)] transition-all duration-200" onClick={() => onNavigate('leads')}>
          <RiUserSearchLine className="mr-2 w-4 h-4" /> Generate Leads
        </Button>
        <Button className="bg-[hsl(160,70%,40%)] text-[hsl(160,20%,98%)] hover:bg-[hsl(160,70%,35%)] transition-all duration-200" onClick={() => onNavigate('content')}>
          <RiFileEditLine className="mr-2 w-4 h-4" /> Create Content
        </Button>
        <Button className="bg-[hsl(160,70%,40%)] text-[hsl(160,20%,98%)] hover:bg-[hsl(160,70%,35%)] transition-all duration-200" onClick={() => onNavigate('distribution')}>
          <RiSendPlaneLine className="mr-2 w-4 h-4" /> Distribute
        </Button>
      </div>
    </div>
  )
}

// --- LEAD BUILDER SCREEN ---
function LeadBuilderScreen({
  leads,
  setLeads,
  setActiveAgentId,
}: {
  leads: Lead[]
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>
  setActiveAgentId: React.Dispatch<React.SetStateAction<string | null>>
}) {
  const [segments, setSegments] = useState<string[]>([])
  const [criteria, setCriteria] = useState('')
  const [count, setCount] = useState([20])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set())
  const [selectAll, setSelectAll] = useState(false)

  const segmentOptions = ['Stock', 'Forex', 'Commodity', 'Options & Futures']

  const toggleSegment = (seg: string) => {
    setSegments(prev => prev.includes(seg) ? prev.filter(s => s !== seg) : [...prev, seg])
  }

  const handleGenerate = useCallback(async () => {
    setLoading(true)
    setError(null)
    setSuccessMsg(null)
    setActiveAgentId(LEAD_BUILDER_AGENT)

    const segmentText = segments.length === 0 ? 'All trading segments (Stock, Forex, Commodity, Options & Futures)' : segments.join(', ')
    const message = `Find ${count[0]} Indian trader leads in the following trading segments: ${segmentText}. ${criteria ? `Additional criteria: ${criteria}.` : ''} Collect their names, WhatsApp numbers, emails, Facebook IDs, Instagram IDs, trading platform, and location.`

    try {
      const result = await callAIAgent(message, LEAD_BUILDER_AGENT)
      setActiveAgentId(null)

      if (result.success) {
        const data = result?.response?.result
        const newLeads = Array.isArray(data?.leads) ? data.leads.map((l: Lead) => ({ ...l, status: 'New', id: generateId() })) : []
        if (newLeads.length > 0) {
          setLeads(prev => [...prev, ...newLeads])
        }
        const summary = data?.summary ?? `Found ${newLeads.length} leads`
        setSuccessMsg(typeof summary === 'string' ? summary : `Found ${newLeads.length} leads`)
      } else {
        setError(result?.error ?? 'Failed to generate leads. Please try again.')
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    }

    setLoading(false)
    setActiveAgentId(null)
  }, [segments, criteria, count, setLeads, setActiveAgentId])

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedLeads(new Set())
    } else {
      const allIds = leads.map(l => l.id ?? '').filter(Boolean)
      setSelectedLeads(new Set(allIds))
    }
    setSelectAll(!selectAll)
  }

  const toggleLeadSelect = (id: string) => {
    setSelectedLeads(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleApproveSelected = () => {
    setLeads(prev => prev.map(l => (l.id && selectedLeads.has(l.id)) ? { ...l, status: 'Approved' } : l))
    setSelectedLeads(new Set())
    setSelectAll(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold tracking-tight mb-1">Lead Builder</h2>
        <p className="text-sm text-muted-foreground">Generate and manage Indian trader leads across all segments</p>
      </div>

      <Card className="bg-card border border-border shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-sans font-semibold">Lead Generation Config</CardTitle>
          <CardDescription className="text-xs">Configure your search criteria and generate leads</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <Label className="text-xs font-medium mb-2.5 block">Trading Segments</Label>
            <div className="flex flex-wrap gap-2">
              {segmentOptions.map(seg => (
                <button
                  key={seg}
                  onClick={() => toggleSegment(seg)}
                  className={cn("px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 cursor-pointer", segments.includes(seg) ? 'bg-[hsl(160,70%,40%)] text-[hsl(160,20%,98%)] border-[hsl(160,70%,40%)]' : 'bg-secondary text-secondary-foreground border-border hover:bg-secondary/80')}
                >
                  {seg}
                </button>
              ))}
              <button
                onClick={() => setSegments(segments.length === segmentOptions.length ? [] : [...segmentOptions])}
                className={cn("px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 cursor-pointer", segments.length === segmentOptions.length ? 'bg-[hsl(160,70%,40%)] text-[hsl(160,20%,98%)] border-[hsl(160,70%,40%)]' : 'bg-secondary text-secondary-foreground border-border hover:bg-secondary/80')}
              >
                All
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="criteria" className="text-xs font-medium mb-2 block">Target Criteria (optional)</Label>
            <Input
              id="criteria"
              placeholder="e.g., Active traders on Zerodha in Mumbai"
              value={criteria}
              onChange={(e) => setCriteria(e.target.value)}
              className="bg-secondary/50 border-border"
            />
          </div>

          <div>
            <Label className="text-xs font-medium mb-2 block">Lead Count: {count[0]}</Label>
            <Slider
              value={count}
              onValueChange={setCount}
              min={5}
              max={50}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>5</span>
              <span>50</span>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-[hsl(160,70%,40%)] text-[hsl(160,20%,98%)] hover:bg-[hsl(160,70%,35%)] transition-all duration-200"
          >
            {loading ? (
              <>
                <RiLoader4Line className="mr-2 w-4 h-4 animate-spin" />
                Searching traders...
              </>
            ) : (
              <>
                <RiSearchLine className="mr-2 w-4 h-4" />
                Generate Leads
              </>
            )}
          </Button>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-900/30 border border-red-700/40 text-red-300 text-sm">
              <RiErrorWarningLine className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{error}</span>
              <Button variant="ghost" size="sm" className="text-red-300 hover:text-red-200 flex-shrink-0" onClick={handleGenerate}>
                <RiRefreshLine className="w-3 h-3 mr-1" /> Retry
              </Button>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-900/30 border border-emerald-700/40 text-emerald-300 text-sm">
              <RiCheckboxCircleLine className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {loading && (
        <Card className="bg-card border border-border shadow-md">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-3 mb-4">
              <RiLoader4Line className="w-5 h-5 animate-spin text-[hsl(160,70%,40%)]" />
              <span className="text-sm font-medium">Searching traders...</span>
            </div>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-2 w-1/2" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="bg-card border border-border shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-sm font-sans font-semibold">
              Lead Database ({leads.length} leads)
            </CardTitle>
            <div className="flex items-center gap-2">
              {selectedLeads.size > 0 && (
                <Button variant="outline" size="sm" className="text-xs border-[hsl(160,70%,40%)]/40 text-[hsl(160,70%,40%)]" onClick={handleApproveSelected}>
                  <RiCheckLine className="w-3 h-3 mr-1" /> Approve Selected ({selectedLeads.size})
                </Button>
              )}
              {leads.length > 0 && (
                <Button variant="outline" size="sm" className="text-xs" onClick={() => exportCSV(leads)}>
                  <RiDownload2Line className="w-3 h-3 mr-1" /> Export CSV
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {leads.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              <RiUserSearchLine className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No leads generated yet</p>
              <p className="text-xs mt-1">Configure your search criteria above and click Generate Leads</p>
            </div>
          ) : (
            <ScrollArea className="w-full">
              <div className="min-w-[900px]">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="w-10">
                        <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
                      </TableHead>
                      <TableHead className="text-xs font-semibold">Name</TableHead>
                      <TableHead className="text-xs font-semibold">Segment</TableHead>
                      <TableHead className="text-xs font-semibold">WhatsApp</TableHead>
                      <TableHead className="text-xs font-semibold">Email</TableHead>
                      <TableHead className="text-xs font-semibold">Facebook</TableHead>
                      <TableHead className="text-xs font-semibold">Instagram</TableHead>
                      <TableHead className="text-xs font-semibold">Status</TableHead>
                      <TableHead className="text-xs font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead, idx) => (
                      <TableRow key={lead.id ?? idx} className="border-border hover:bg-secondary/30">
                        <TableCell>
                          <Checkbox
                            checked={selectedLeads.has(lead.id ?? '')}
                            onCheckedChange={() => toggleLeadSelect(lead.id ?? '')}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[hsl(160,70%,40%)]/15 flex items-center justify-center text-[hsl(160,70%,40%)] text-[10px] font-bold flex-shrink-0">
                              {(lead.name ?? '?').charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{lead.name ?? 'N/A'}</p>
                              <p className="text-[10px] text-muted-foreground">{lead.platform ?? ''} {lead.location ? `- ${lead.location}` : ''}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn('text-[10px]', getSegmentColor(lead.trading_segment))}>{lead.trading_segment ?? 'N/A'}</Badge>
                        </TableCell>
                        <TableCell className="text-xs font-mono">
                          {lead.whatsapp ? (
                            <span className="flex items-center gap-1">
                              <RiWhatsappLine className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                              {lead.whatsapp}
                            </span>
                          ) : <span className="text-muted-foreground">-</span>}
                        </TableCell>
                        <TableCell className="text-xs font-mono">{lead.email || <span className="text-muted-foreground">-</span>}</TableCell>
                        <TableCell className="text-xs">
                          {lead.facebook_id ? (
                            <span className="flex items-center gap-1">
                              <RiFacebookCircleLine className="w-3 h-3 text-blue-400 flex-shrink-0" />
                              <span className="truncate max-w-[80px]">{lead.facebook_id}</span>
                            </span>
                          ) : <span className="text-muted-foreground">-</span>}
                        </TableCell>
                        <TableCell className="text-xs">
                          {lead.instagram_id ? (
                            <span className="flex items-center gap-1">
                              <RiInstagramLine className="w-3 h-3 text-pink-400 flex-shrink-0" />
                              <span className="truncate max-w-[80px]">{lead.instagram_id}</span>
                            </span>
                          ) : <span className="text-muted-foreground">-</span>}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn('text-[10px]', getStatusColor(lead.status ?? 'New'))}>{lead.status ?? 'New'}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-0.5">
                            {lead.status !== 'Approved' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-[hsl(160,70%,40%)] hover:text-[hsl(160,70%,50%)]"
                                onClick={() => setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: 'Approved' } : l))}
                                title="Approve lead"
                              >
                                <RiCheckLine className="w-3.5 h-3.5" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-red-400 hover:text-red-300"
                              onClick={() => setLeads(prev => prev.filter(l => l.id !== lead.id))}
                              title="Delete lead"
                            >
                              <RiDeleteBinLine className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// --- CONTENT STUDIO SCREEN ---
function ContentStudioScreen({
  contentLibrary,
  setContentLibrary,
  setActiveAgentId,
}: {
  contentLibrary: ContentItem[]
  setContentLibrary: React.Dispatch<React.SetStateAction<ContentItem[]>>
  setActiveAgentId: React.Dispatch<React.SetStateAction<string | null>>
}) {
  const [topic, setTopic] = useState('')
  const [indicator, setIndicator] = useState('')
  const [audienceSegments, setAudienceSegments] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewContent, setPreviewContent] = useState<ContentItem | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const indicatorOptions = ['RSI', 'MACD', 'Moving Average', 'Bollinger Bands', 'Fibonacci', 'Volume Profile', 'Supertrend', 'VWAP']
  const segmentOptions = ['Stock', 'Forex', 'Commodity', 'Options & Futures']

  const toggleAudience = (seg: string) => {
    setAudienceSegments(prev => prev.includes(seg) ? prev.filter(s => s !== seg) : [...prev, seg])
  }

  const handleCreate = useCallback(async () => {
    if (!topic.trim()) return
    setLoading(true)
    setError(null)
    setActiveAgentId(CONTENT_CREATOR_AGENT)

    const audText = audienceSegments.length > 0 ? audienceSegments.join(', ') : 'All segments'
    const message = `Create educational T4Peace content about: ${topic}. ${indicator ? `Focus on the ${indicator} indicator.` : ''} Target audience: Indian traders in ${audText} segments. Include a video script, description, key learning points, a call to action, relevant hashtags, email subject line, and a social media post.`

    try {
      const result = await callAIAgent(message, CONTENT_CREATOR_AGENT)
      setActiveAgentId(null)

      if (result.success) {
        const data = result?.response?.result
        const newContent: ContentItem = {
          title: typeof data?.title === 'string' ? data.title : topic,
          content_type: typeof data?.content_type === 'string' ? data.content_type : 'Tutorial',
          script: typeof data?.script === 'string' ? data.script : '',
          description: typeof data?.description === 'string' ? data.description : '',
          target_segments: Array.isArray(data?.target_segments) ? data.target_segments : audienceSegments,
          key_points: Array.isArray(data?.key_points) ? data.key_points : [],
          call_to_action: typeof data?.call_to_action === 'string' ? data.call_to_action : '',
          hashtags: Array.isArray(data?.hashtags) ? data.hashtags : [],
          email_subject: typeof data?.email_subject === 'string' ? data.email_subject : '',
          social_post: typeof data?.social_post === 'string' ? data.social_post : '',
          status: 'Draft',
          created_at: new Date().toISOString().split('T')[0],
          id: generateId(),
        }
        setPreviewContent(newContent)
        setContentLibrary(prev => [newContent, ...prev])
      } else {
        setError(result?.error ?? 'Failed to create content. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    }

    setLoading(false)
    setActiveAgentId(null)
  }, [topic, indicator, audienceSegments, setContentLibrary, setActiveAgentId])

  const handleCopy = (text: string, field: string) => {
    copyToClipboard(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold tracking-tight mb-1">Content Studio</h2>
        <p className="text-sm text-muted-foreground">Create educational T4Peace content for Indian traders</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border border-border shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-sans font-semibold">Create Content</CardTitle>
            <CardDescription className="text-xs">Define your topic and target audience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="topic" className="text-xs font-medium mb-2 block">Topic *</Label>
              <Input
                id="topic"
                placeholder="e.g., How to use RSI for intraday trading"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="bg-secondary/50 border-border"
              />
            </div>

            <div>
              <Label className="text-xs font-medium mb-2 block">Indicator Focus</Label>
              <Select value={indicator} onValueChange={setIndicator}>
                <SelectTrigger className="bg-secondary/50 border-border">
                  <SelectValue placeholder="Select an indicator (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {indicatorOptions.map(ind => (
                    <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-medium mb-2.5 block">Audience Segments</Label>
              <div className="flex flex-wrap gap-2">
                {segmentOptions.map(seg => (
                  <button
                    key={seg}
                    onClick={() => toggleAudience(seg)}
                    className={cn("px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 cursor-pointer", audienceSegments.includes(seg) ? 'bg-[hsl(160,70%,40%)] text-[hsl(160,20%,98%)] border-[hsl(160,70%,40%)]' : 'bg-secondary text-secondary-foreground border-border hover:bg-secondary/80')}
                  >
                    {seg}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleCreate}
              disabled={loading || !topic.trim()}
              className="w-full bg-[hsl(160,70%,40%)] text-[hsl(160,20%,98%)] hover:bg-[hsl(160,70%,35%)] transition-all duration-200"
            >
              {loading ? (
                <>
                  <RiLoader4Line className="mr-2 w-4 h-4 animate-spin" />
                  Generating content...
                </>
              ) : (
                <>
                  <RiFileEditLine className="mr-2 w-4 h-4" />
                  Create Content
                </>
              )}
            </Button>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-900/30 border border-red-700/40 text-red-300 text-sm">
                <RiErrorWarningLine className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-sans font-semibold">Live Preview</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {loading ? (
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-3">
                  <RiLoader4Line className="w-5 h-5 animate-spin text-[hsl(160,70%,40%)]" />
                  <span className="text-sm">Generating content...</span>
                </div>
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : previewContent ? (
              <ScrollArea className="h-[460px]">
                <div className="space-y-4 pr-3">
                  <div>
                    <h3 className="font-serif text-lg font-bold">{previewContent.title ?? 'Untitled'}</h3>
                    <Badge variant="outline" className="text-[10px] mt-1.5 bg-secondary/50">{previewContent.content_type ?? 'Content'}</Badge>
                  </div>

                  {previewContent.description && (
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-1.5">Description</h4>
                      <div className="text-sm">{renderMarkdown(previewContent.description)}</div>
                    </div>
                  )}

                  {previewContent.script && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="text-xs font-semibold text-muted-foreground">Script</h4>
                        <Button variant="ghost" size="sm" className="h-6 text-[10px] text-muted-foreground hover:text-foreground" onClick={() => handleCopy(previewContent.script, 'script')}>
                          {copiedField === 'script' ? <RiCheckLine className="w-3 h-3 mr-1 text-emerald-400" /> : <RiClipboardLine className="w-3 h-3 mr-1" />}
                          {copiedField === 'script' ? 'Copied' : 'Copy'}
                        </Button>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/40 text-sm max-h-40 overflow-y-auto">
                        {renderMarkdown(previewContent.script)}
                      </div>
                    </div>
                  )}

                  {Array.isArray(previewContent.key_points) && previewContent.key_points.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-1.5">Key Points</h4>
                      <ul className="space-y-1.5">
                        {previewContent.key_points.map((kp, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <RiCheckboxCircleLine className="w-3.5 h-3.5 text-[hsl(160,70%,40%)] mt-0.5 flex-shrink-0" />
                            <span>{kp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {previewContent.call_to_action && (
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-1.5">Call to Action</h4>
                      <p className="text-sm p-2.5 rounded-lg bg-[hsl(160,70%,40%)]/10 border border-[hsl(160,70%,40%)]/20 text-[hsl(160,70%,50%)]">{previewContent.call_to_action}</p>
                    </div>
                  )}

                  {previewContent.email_subject && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="text-xs font-semibold text-muted-foreground">Email Subject</h4>
                        <Button variant="ghost" size="sm" className="h-6 text-[10px] text-muted-foreground hover:text-foreground" onClick={() => handleCopy(previewContent.email_subject, 'email_subject')}>
                          {copiedField === 'email_subject' ? <RiCheckLine className="w-3 h-3 mr-1 text-emerald-400" /> : <RiClipboardLine className="w-3 h-3 mr-1" />}
                          {copiedField === 'email_subject' ? 'Copied' : 'Copy'}
                        </Button>
                      </div>
                      <p className="text-sm font-mono p-2.5 rounded-lg bg-secondary/40">{previewContent.email_subject}</p>
                    </div>
                  )}

                  {previewContent.social_post && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="text-xs font-semibold text-muted-foreground">Social Post</h4>
                        <Button variant="ghost" size="sm" className="h-6 text-[10px] text-muted-foreground hover:text-foreground" onClick={() => handleCopy(previewContent.social_post, 'social_post')}>
                          {copiedField === 'social_post' ? <RiCheckLine className="w-3 h-3 mr-1 text-emerald-400" /> : <RiClipboardLine className="w-3 h-3 mr-1" />}
                          {copiedField === 'social_post' ? 'Copied' : 'Copy'}
                        </Button>
                      </div>
                      <p className="text-sm p-2.5 rounded-lg bg-secondary/40">{previewContent.social_post}</p>
                    </div>
                  )}

                  {Array.isArray(previewContent.hashtags) && previewContent.hashtags.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-1.5">Hashtags</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {previewContent.hashtags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-[10px] bg-[hsl(160,70%,40%)]/10 border-[hsl(160,70%,40%)]/30 text-[hsl(160,70%,50%)]">
                            <RiHashtag className="w-2.5 h-2.5 mr-0.5" />
                            {(tag ?? '').replace('#', '')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {Array.isArray(previewContent.target_segments) && previewContent.target_segments.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-1.5">Target Segments</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {previewContent.target_segments.map((seg, i) => (
                          <Badge key={i} variant="outline" className={cn('text-[10px]', getSegmentColor(seg))}>{seg}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-16 text-muted-foreground text-sm">
                <RiEyeLine className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">Content preview will appear here</p>
                <p className="text-xs mt-1">Fill in the form and click Create Content</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border border-border shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-sans font-semibold">Content Library ({contentLibrary.length} items)</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {contentLibrary.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              <RiFileEditLine className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No content in the library</p>
              <p className="text-xs mt-1">Create your first piece of content above</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {contentLibrary.map((item, idx) => (
                <div
                  key={item.id ?? idx}
                  className="p-4 rounded-lg bg-secondary/20 border border-border hover:bg-secondary/40 transition-all duration-200 cursor-pointer"
                  onClick={() => setPreviewContent(item)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold truncate">{item.title ?? 'Untitled'}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.content_type ?? 'Content'}</p>
                    </div>
                    <Badge variant="outline" className={cn('text-[10px] flex-shrink-0', getStatusColor(item.status ?? 'Draft'))}>{item.status ?? 'Draft'}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{item.description ?? ''}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex gap-1">
                      {Array.isArray(item.target_segments) && item.target_segments.slice(0, 2).map((seg, si) => (
                        <Badge key={si} variant="outline" className={cn('text-[9px]', getSegmentColor(seg))}>{seg}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-muted-foreground">{item.created_at ?? ''}</span>
                      {item.status === 'Draft' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-[hsl(160,70%,40%)]"
                          onClick={(e) => {
                            e.stopPropagation()
                            setContentLibrary(prev => prev.map(c => c.id === item.id ? { ...c, status: 'Approved' } : c))
                          }}
                          title="Approve content"
                        >
                          <RiCheckLine className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// --- DISTRIBUTION CENTER SCREEN ---
function DistributionScreen({
  leads,
  contentLibrary,
  campaigns,
  setCampaigns,
  setActiveAgentId,
}: {
  leads: Lead[]
  contentLibrary: ContentItem[]
  campaigns: CampaignHistory[]
  setCampaigns: React.Dispatch<React.SetStateAction<CampaignHistory[]>>
  setActiveAgentId: React.Dispatch<React.SetStateAction<string | null>>
}) {
  const [selectedContentId, setSelectedContentId] = useState('')
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set())
  const [videoUrl, setVideoUrl] = useState('')
  const [customEmailSubject, setCustomEmailSubject] = useState('')
  const [customEmailBody, setCustomEmailBody] = useState('')
  const [customTwitterPost, setCustomTwitterPost] = useState('')
  const [enableEmail, setEnableEmail] = useState(true)
  const [enableTwitter, setEnableTwitter] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [distributionResult, setDistributionResult] = useState<DistributionResult | null>(null)

  const approvedContent = contentLibrary.filter(c => c.status === 'Approved')
  const approvedLeads = leads.filter(l => l.status === 'Approved')

  const selectedContent = approvedContent.find(c => c.id === selectedContentId)

  useEffect(() => {
    if (selectedContent) {
      setCustomEmailSubject(selectedContent.email_subject ?? '')
      setCustomEmailBody(selectedContent.description ?? '')
      setCustomTwitterPost(selectedContent.social_post ?? '')
    }
  }, [selectedContentId])

  const toggleLeadForDistribution = (id: string) => {
    setSelectedLeadIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAllLeads = () => {
    if (selectedLeadIds.size === approvedLeads.length) {
      setSelectedLeadIds(new Set())
    } else {
      setSelectedLeadIds(new Set(approvedLeads.map(l => l.id ?? '').filter(Boolean)))
    }
  }

  const selectedLeadsList = approvedLeads.filter(l => l.id && selectedLeadIds.has(l.id))

  const handleDistribute = useCallback(async () => {
    setShowConfirm(false)
    setLoading(true)
    setError(null)
    setSuccessMsg(null)
    setDistributionResult(null)
    setActiveAgentId(DISTRIBUTION_AGENT)

    const recipientEmails = selectedLeadsList.map(l => l.email).filter(Boolean)

    let message = ''
    if (enableEmail && recipientEmails.length > 0) {
      message += `Send email to ${recipientEmails.join(', ')} with subject "${customEmailSubject}" and body: "${customEmailBody}".`
    }
    if (enableTwitter && customTwitterPost) {
      message += ` Also post this to Twitter: "${customTwitterPost}".`
    }
    if (videoUrl) {
      message += ` Video URL: ${videoUrl}`
    }
    message += ` Campaign name: "${selectedContent?.title ?? 'T4Peace'} Distribution". Content title: "${selectedContent?.title ?? 'T4Peace Content'}".`

    try {
      const result = await callAIAgent(message, DISTRIBUTION_AGENT)
      setActiveAgentId(null)

      if (result.success) {
        const data = result?.response?.result
        const distResult: DistributionResult = {
          campaign_name: typeof data?.campaign_name === 'string' ? data.campaign_name : `${selectedContent?.title ?? 'T4Peace'} Campaign`,
          emails_sent: typeof data?.emails_sent === 'number' ? data.emails_sent : 0,
          emails_failed: typeof data?.emails_failed === 'number' ? data.emails_failed : 0,
          twitter_posted: typeof data?.twitter_posted === 'boolean' ? data.twitter_posted : false,
          twitter_post_url: typeof data?.twitter_post_url === 'string' ? data.twitter_post_url : '',
          distribution_summary: typeof data?.distribution_summary === 'string' ? data.distribution_summary : 'Distribution completed',
          recipients: Array.isArray(data?.recipients) ? data.recipients : [],
          channels_used: Array.isArray(data?.channels_used) ? data.channels_used : [],
        }
        setDistributionResult(distResult)
        setSuccessMsg(distResult.distribution_summary)

        const channelsUsed = distResult.channels_used.length > 0 ? distResult.channels_used : [enableEmail ? 'Email' : '', enableTwitter ? 'Twitter' : ''].filter(Boolean)
        const newCampaign: CampaignHistory = {
          campaign_name: distResult.campaign_name,
          content_title: selectedContent?.title ?? 'Unknown',
          leads_targeted: selectedLeadsList.length,
          channels: channelsUsed,
          date: new Date().toISOString().split('T')[0],
          status: 'Sent',
          result: distResult,
        }
        setCampaigns(prev => [newCampaign, ...prev])
      } else {
        setError(result?.error ?? 'Distribution failed. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    }

    setLoading(false)
    setActiveAgentId(null)
  }, [selectedLeadsList, enableEmail, enableTwitter, customEmailSubject, customEmailBody, customTwitterPost, videoUrl, selectedContent, setCampaigns, setActiveAgentId])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold tracking-tight mb-1">Distribution Center</h2>
        <p className="text-sm text-muted-foreground">Send content to your leads via Email and Twitter</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border border-border shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-sans font-semibold">Select Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            {approvedContent.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-sm">
                <RiFileTextLine className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>No approved content available.</p>
                <p className="text-xs mt-1">Create and approve content in the Content Studio first.</p>
              </div>
            ) : (
              <Select value={selectedContentId} onValueChange={setSelectedContentId}>
                <SelectTrigger className="bg-secondary/50 border-border">
                  <SelectValue placeholder="Choose approved content to distribute" />
                </SelectTrigger>
                <SelectContent>
                  {approvedContent.map((c) => (
                    <SelectItem key={c.id ?? ''} value={c.id ?? ''}>{c.title ?? 'Untitled'}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {selectedContent && (
              <div className="p-3 rounded-lg bg-secondary/30 border border-border">
                <h4 className="text-sm font-semibold">{selectedContent.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{selectedContent.content_type}</p>
                <p className="text-xs mt-2 line-clamp-3">{selectedContent.description}</p>
              </div>
            )}

            <div>
              <Label htmlFor="videoUrl" className="text-xs font-medium mb-2 block">Video URL (optional)</Label>
              <Input
                id="videoUrl"
                placeholder="https://youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="bg-secondary/50 border-border"
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={enableEmail} onCheckedChange={setEnableEmail} />
                <Label className="text-xs flex items-center gap-1.5"><RiMailLine className="w-3.5 h-3.5" /> Email</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={enableTwitter} onCheckedChange={setEnableTwitter} />
                <Label className="text-xs flex items-center gap-1.5"><RiTwitterXLine className="w-3.5 h-3.5" /> Twitter</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-sans font-semibold">Select Leads ({selectedLeadIds.size} selected)</CardTitle>
              {approvedLeads.length > 0 && (
                <Button variant="ghost" size="sm" className="text-xs text-[hsl(160,70%,40%)]" onClick={selectAllLeads}>
                  {selectedLeadIds.size === approvedLeads.length ? 'Deselect All' : 'Select All'}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {approvedLeads.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-sm">
                <RiUserLine className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>No approved leads available.</p>
                <p className="text-xs mt-1">Approve leads in the Lead Builder first.</p>
              </div>
            ) : (
              <ScrollArea className="h-[240px]">
                <div className="space-y-1.5 pr-2">
                  {approvedLeads.map((lead, idx) => (
                    <div
                      key={lead.id ?? idx}
                      className={cn("flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all duration-200", selectedLeadIds.has(lead.id ?? '') ? 'bg-[hsl(160,70%,40%)]/10 border border-[hsl(160,70%,40%)]/25' : 'hover:bg-secondary/40 border border-transparent')}
                      onClick={() => toggleLeadForDistribution(lead.id ?? '')}
                    >
                      <Checkbox checked={selectedLeadIds.has(lead.id ?? '')} onCheckedChange={() => toggleLeadForDistribution(lead.id ?? '')} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{lead.name ?? 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground truncate">{lead.email ?? ''}</p>
                      </div>
                      <Badge variant="outline" className={cn('text-[9px]', getSegmentColor(lead.trading_segment))}>{lead.trading_segment ?? ''}</Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border border-border shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-sans font-semibold">Message Preview</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs defaultValue="email">
            <TabsList className="bg-secondary/50 mb-4">
              <TabsTrigger value="email" className="text-xs">
                <RiMailLine className="w-3 h-3 mr-1.5" /> Email Preview
              </TabsTrigger>
              <TabsTrigger value="twitter" className="text-xs">
                <RiTwitterXLine className="w-3 h-3 mr-1.5" /> Twitter Post
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-3">
              <div>
                <Label htmlFor="emailSubject" className="text-xs font-medium mb-1.5 block">Subject *</Label>
                <Input
                  id="emailSubject"
                  value={customEmailSubject}
                  onChange={(e) => setCustomEmailSubject(e.target.value)}
                  className="bg-secondary/50 border-border"
                  placeholder="Email subject line"
                />
              </div>
              <div>
                <Label htmlFor="emailBody" className="text-xs font-medium mb-1.5 block">Body *</Label>
                <Textarea
                  id="emailBody"
                  value={customEmailBody}
                  onChange={(e) => setCustomEmailBody(e.target.value)}
                  className="bg-secondary/50 border-border min-h-[120px]"
                  placeholder="Email body content"
                  rows={5}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Recipients:</span> {selectedLeadsList.length > 0 ? selectedLeadsList.map(l => l.email).filter(Boolean).join(', ') : 'No leads selected'}
              </div>
            </TabsContent>

            <TabsContent value="twitter" className="space-y-3">
              <div>
                <Label htmlFor="twitterPost" className="text-xs font-medium mb-1.5 block">Post Text</Label>
                <Textarea
                  id="twitterPost"
                  value={customTwitterPost}
                  onChange={(e) => setCustomTwitterPost(e.target.value)}
                  className="bg-secondary/50 border-border"
                  placeholder="Write your Twitter post..."
                  rows={4}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{customTwitterPost.length}/280 characters</span>
                {customTwitterPost.length > 280 && <span className="text-red-400">Exceeds character limit</span>}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="pt-0">
          <Button
            onClick={() => setShowConfirm(true)}
            disabled={loading || (!enableEmail && !enableTwitter) || (enableEmail && selectedLeadIds.size === 0) || !selectedContentId}
            className="w-full bg-[hsl(160,70%,40%)] text-[hsl(160,20%,98%)] hover:bg-[hsl(160,70%,35%)] transition-all duration-200"
          >
            {loading ? (
              <>
                <RiLoader4Line className="mr-2 w-4 h-4 animate-spin" />
                Distributing...
              </>
            ) : (
              <>
                <RiSendPlaneLine className="mr-2 w-4 h-4" />
                Distribute Content
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-900/30 border border-red-700/40 text-red-300 text-sm">
          <RiErrorWarningLine className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1">{error}</span>
          <Button variant="ghost" size="sm" className="text-red-300 hover:text-red-200 flex-shrink-0" onClick={() => setShowConfirm(true)}>
            <RiRefreshLine className="w-3 h-3 mr-1" /> Retry
          </Button>
        </div>
      )}

      {successMsg && !distributionResult && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-900/30 border border-emerald-700/40 text-emerald-300 text-sm">
          <RiCheckboxCircleLine className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {distributionResult && (
        <Card className="bg-card border border-[hsl(160,70%,40%)]/30 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-sans font-semibold text-[hsl(160,70%,40%)]">
              <RiCheckboxCircleLine className="w-4 h-4 inline mr-1.5" />
              Distribution Results - {distributionResult.campaign_name ?? 'Campaign'}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-secondary/30 text-center">
                <p className="text-xl font-bold font-serif">{distributionResult.emails_sent ?? 0}</p>
                <p className="text-[10px] text-muted-foreground">Emails Sent</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30 text-center">
                <p className="text-xl font-bold font-serif text-red-400">{distributionResult.emails_failed ?? 0}</p>
                <p className="text-[10px] text-muted-foreground">Emails Failed</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30 text-center">
                <p className="text-xl font-bold font-serif">{distributionResult.twitter_posted ? 'Yes' : 'No'}</p>
                <p className="text-[10px] text-muted-foreground">Twitter Posted</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30 text-center">
                <p className="text-xl font-bold font-serif">{Array.isArray(distributionResult.channels_used) ? distributionResult.channels_used.length : 0}</p>
                <p className="text-[10px] text-muted-foreground">Channels Used</p>
              </div>
            </div>

            {distributionResult.distribution_summary && (
              <div className="p-3 rounded-lg bg-secondary/20">
                <h4 className="text-xs font-semibold text-muted-foreground mb-1.5">Summary</h4>
                <div className="text-sm">{renderMarkdown(distributionResult.distribution_summary)}</div>
              </div>
            )}

            {distributionResult.twitter_post_url && (
              <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-secondary/20">
                <RiTwitterXLine className="w-4 h-4 text-blue-400" />
                <a href={distributionResult.twitter_post_url} target="_blank" rel="noopener noreferrer" className="text-[hsl(160,70%,40%)] hover:underline flex items-center gap-1">
                  View Twitter Post <RiExternalLinkLine className="w-3 h-3" />
                </a>
              </div>
            )}

            {Array.isArray(distributionResult.recipients) && distributionResult.recipients.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-2">Recipient Status</h4>
                <div className="space-y-1.5">
                  {distributionResult.recipients.map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-secondary/20">
                      <div className="flex items-center gap-2 min-w-0">
                        <RiMailLine className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                        <span className="text-xs font-medium truncate">{r.name ?? 'Unknown'}</span>
                        <span className="text-[10px] text-muted-foreground truncate">{r.email ?? ''}</span>
                      </div>
                      <Badge variant="outline" className={cn('text-[10px] flex-shrink-0', getStatusColor(r.status ?? ''))}>{r.status ?? 'Unknown'}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {Array.isArray(distributionResult.channels_used) && distributionResult.channels_used.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-1.5">Channels Used</h4>
                <div className="flex gap-2">
                  {distributionResult.channels_used.map((ch, i) => (
                    <Badge key={i} variant="outline" className="text-[10px] bg-[hsl(160,70%,40%)]/10 border-[hsl(160,70%,40%)]/30">
                      {(ch ?? '').toLowerCase() === 'email' && <RiMailLine className="w-3 h-3 mr-1" />}
                      {(ch ?? '').toLowerCase() === 'twitter' && <RiTwitterXLine className="w-3 h-3 mr-1" />}
                      {ch}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="bg-card border border-border shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-sans font-semibold">Distribution History ({campaigns.length} campaigns)</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {campaigns.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              <RiSendPlaneLine className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No campaigns sent yet</p>
              <p className="text-xs mt-1">Select content and leads above, then click Distribute</p>
            </div>
          ) : (
            <ScrollArea className="w-full">
              <div className="min-w-[650px]">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-xs font-semibold">Campaign</TableHead>
                      <TableHead className="text-xs font-semibold">Content</TableHead>
                      <TableHead className="text-xs font-semibold">Leads</TableHead>
                      <TableHead className="text-xs font-semibold">Channels</TableHead>
                      <TableHead className="text-xs font-semibold">Date</TableHead>
                      <TableHead className="text-xs font-semibold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((c, idx) => (
                      <TableRow key={idx} className="border-border hover:bg-secondary/30">
                        <TableCell className="text-sm font-medium">{c.campaign_name ?? 'Campaign'}</TableCell>
                        <TableCell className="text-xs max-w-[150px] truncate">{c.content_title ?? ''}</TableCell>
                        <TableCell className="text-xs">{c.leads_targeted ?? 0}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {Array.isArray(c.channels) && c.channels.map((ch, ci) => (
                              <Badge key={ci} variant="outline" className="text-[9px] bg-secondary/50">
                                {ch}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{c.date ?? ''}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn('text-[10px]', getStatusColor(c.status ?? ''))}>{c.status ?? 'Pending'}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-serif">Confirm Distribution</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              You are about to distribute content to your selected leads. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Content:</span>
              <span className="font-medium truncate ml-4 max-w-[200px]">{selectedContent?.title ?? 'None'}</span>
            </div>
            <Separator className="bg-border" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Recipients:</span>
              <span className="font-medium">{selectedLeadIds.size} leads</span>
            </div>
            <Separator className="bg-border" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Channels:</span>
              <div className="flex gap-1.5">
                {enableEmail && <Badge variant="outline" className="text-[10px]"><RiMailLine className="w-3 h-3 mr-1" />Email</Badge>}
                {enableTwitter && <Badge variant="outline" className="text-[10px]"><RiTwitterXLine className="w-3 h-3 mr-1" />Twitter</Badge>}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancel</Button>
            <Button className="bg-[hsl(160,70%,40%)] text-[hsl(160,20%,98%)] hover:bg-[hsl(160,70%,35%)]" onClick={handleDistribute}>
              <RiSendPlaneLine className="mr-2 w-4 h-4" />
              Confirm & Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// --- MAIN PAGE EXPORT ---
export default function Page() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [sampleMode, setSampleMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null)

  const [leads, setLeads] = useState<Lead[]>([])
  const [contentLibrary, setContentLibrary] = useState<ContentItem[]>([])
  const [campaigns, setCampaigns] = useState<CampaignHistory[]>([])

  useEffect(() => {
    if (sampleMode) {
      setLeads(SAMPLE_LEADS)
      setContentLibrary(SAMPLE_CONTENT)
      setCampaigns(SAMPLE_CAMPAIGNS)
    } else {
      setLeads([])
      setContentLibrary([])
      setCampaigns([])
    }
  }, [sampleMode])

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <RiDashboardLine className="w-5 h-5" /> },
    { id: 'leads', label: 'Lead Builder', icon: <RiUserSearchLine className="w-5 h-5" /> },
    { id: 'content', label: 'Content Studio', icon: <RiFileEditLine className="w-5 h-5" /> },
    { id: 'distribution', label: 'Distribution', icon: <RiSendPlaneLine className="w-5 h-5" /> },
  ]

  return (
    <InlineErrorBoundary>
      <div className="min-h-screen bg-background text-foreground flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:flex-shrink-0 bg-card border-r border-border min-h-screen sticky top-0">
          <div className="p-5 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[hsl(160,70%,40%)]/20 flex items-center justify-center">
                <RiLineChartLine className="w-5 h-5 text-[hsl(160,70%,40%)]" />
              </div>
              <div>
                <h1 className="font-serif text-base font-bold tracking-tight leading-none">T4Peace</h1>
                <p className="text-[10px] text-muted-foreground mt-0.5">Trader Hub</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer", activeSection === item.id ? 'bg-[hsl(160,70%,40%)]/15 text-[hsl(160,70%,40%)] border border-[hsl(160,70%,40%)]/25' : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground border border-transparent')}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-3 border-t border-border">
            <AgentStatusPanel activeAgentId={activeAgentId} />
          </div>
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border z-50 flex flex-col">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[hsl(160,70%,40%)]/20 flex items-center justify-center">
                    <RiLineChartLine className="w-5 h-5 text-[hsl(160,70%,40%)]" />
                  </div>
                  <div>
                    <h1 className="font-serif text-base font-bold tracking-tight leading-none">T4Peace</h1>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Trader Hub</p>
                  </div>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-secondary/60 transition-colors">
                  <RiCloseLine className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 p-3 space-y-1">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveSection(item.id); setSidebarOpen(false) }}
                    className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer", activeSection === item.id ? 'bg-[hsl(160,70%,40%)]/15 text-[hsl(160,70%,40%)] border border-[hsl(160,70%,40%)]/25' : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground border border-transparent')}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </nav>
              <div className="p-3 border-t border-border">
                <AgentStatusPanel activeAgentId={activeAgentId} />
              </div>
            </aside>
          </div>
        )}

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-h-screen min-w-0">
          {/* Header */}
          <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-secondary/60 transition-colors">
                <RiMenuLine className="w-5 h-5" />
              </button>
              <div className="lg:hidden flex items-center gap-2">
                <RiLineChartLine className="w-5 h-5 text-[hsl(160,70%,40%)]" />
                <span className="font-serif font-bold text-sm">T4Peace Trader Hub</span>
              </div>
              <h2 className="hidden lg:block font-serif text-lg font-bold tracking-tight">
                {navItems.find(n => n.id === activeSection)?.label ?? 'Dashboard'}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="sampleToggle" className="text-xs text-muted-foreground hidden sm:block cursor-pointer">Sample Data</Label>
                <Switch id="sampleToggle" checked={sampleMode} onCheckedChange={setSampleMode} />
              </div>
              <button className="p-2 rounded-lg hover:bg-secondary/60 transition-colors relative">
                <RiNotification3Line className="w-5 h-5 text-muted-foreground" />
                {(leads.filter(l => l.status === 'New').length > 0) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[hsl(160,70%,40%)]" />
                )}
              </button>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto p-4 sm:p-6 pb-12">
              {activeSection === 'dashboard' && (
                <DashboardScreen
                  leads={leads}
                  contentLibrary={contentLibrary}
                  campaigns={campaigns}
                  onNavigate={setActiveSection}
                />
              )}
              {activeSection === 'leads' && (
                <LeadBuilderScreen
                  leads={leads}
                  setLeads={setLeads}
                  setActiveAgentId={setActiveAgentId}
                />
              )}
              {activeSection === 'content' && (
                <ContentStudioScreen
                  contentLibrary={contentLibrary}
                  setContentLibrary={setContentLibrary}
                  setActiveAgentId={setActiveAgentId}
                />
              )}
              {activeSection === 'distribution' && (
                <DistributionScreen
                  leads={leads}
                  contentLibrary={contentLibrary}
                  campaigns={campaigns}
                  setCampaigns={setCampaigns}
                  setActiveAgentId={setActiveAgentId}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </InlineErrorBoundary>
  )
}
