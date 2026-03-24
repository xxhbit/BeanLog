import { useState } from 'react'

interface FormSectionProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
}

export default function FormSection({ title, icon, children, defaultOpen = true }: FormSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-100 dark:border-stone-700">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-2 px-4 py-3 text-left ${open ? '' : 'rounded-b-xl'} rounded-t-xl`}
      >
        <span className="text-coffee-600 dark:text-coffee-400">{icon}</span>
        <span className="font-medium text-stone-800 dark:text-stone-200 flex-1">{title}</span>
        <svg
          className={`w-5 h-5 text-stone-400 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="px-4 pb-4 space-y-3 relative">{children}</div>}
    </div>
  )
}
