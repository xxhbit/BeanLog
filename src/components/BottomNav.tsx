interface Tab {
  id: string
  label: string
  icon: React.ReactNode
}

const tabs: Tab[] = [
  {
    id: 'records',
    label: '记录',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h10M4 18h7" />
        <circle cx="18" cy="16" r="3" strokeWidth={1.5} />
      </svg>
    ),
  },
  {
    id: 'add',
    label: '记一杯',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M5 10h10v1c0 4-2.5 7-5 7s-5-3-5-7v-1z" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15 12h1.5c1.38 0 2.5 1.12 2.5 2.5S17.88 17 16.5 17H15" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 7V5M10 7V4M12 7V5" strokeLinecap="round" opacity="0.5"/>
        <path d="M5 21h10" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'settings',
    label: '设置',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
]

interface BottomNavProps {
  active: string
  onChange: (id: string) => void
}

export default function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="fixed left-0 right-0 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-700 flex z-50"
      style={{ bottom: 0, paddingBottom: 'var(--safe-bottom)' }}>
      {tabs.map((tab) => {
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex-1 flex flex-col items-center py-2 transition-colors min-h-[56px] ${
              isActive
                ? 'text-coffee-700 dark:text-coffee-300'
                : 'text-stone-400 dark:text-stone-500'
            }`}
          >
            {tab.id === 'add' ? (
              <span className={`w-10 h-10 rounded-full flex items-center justify-center -mt-4 shadow-lg ${
                isActive ? 'bg-coffee-700 text-white' : 'bg-coffee-500 text-white'
              }`}>
                {tab.icon}
              </span>
            ) : (
              tab.icon
            )}
            <span className="text-xs mt-0.5">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
