import { useState, useRef, useEffect } from 'react'

interface AutoSuggestInputProps {
  value: string
  onChange: (value: string) => void
  suggestions: string[]
  placeholder?: string
  label?: string
  type?: string
}

export default function AutoSuggestInput({
  value,
  onChange,
  suggestions,
  placeholder,
  label,
  type = 'text',
}: AutoSuggestInputProps) {
  const [open, setOpen] = useState(false)
  const [filtered, setFiltered] = useState<string[]>([])
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!value) {
      setFiltered(suggestions)
    } else {
      setFiltered(suggestions.filter((s) => s.toLowerCase().includes(value.toLowerCase())))
    }
  }, [value, suggestions])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const hasSuggestions = filtered.length > 0

  return (
    <div ref={wrapperRef} className="relative">
      {label && <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">{label}</label>}
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className={`w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-coffee-500 focus:border-transparent outline-none ${hasSuggestions ? 'pr-8' : ''}`}
        />
        {hasSuggestions && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setOpen(!open)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-stone-400 dark:text-stone-500"
          >
            <svg viewBox="0 0 12 12" className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 4l4 4 4-4" />
            </svg>
          </button>
        )}
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute z-50 mt-1 w-full max-h-40 overflow-auto bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg shadow-lg">
          {filtered.map((item) => (
            <button
              key={item}
              type="button"
              className="w-full text-left px-3 py-2.5 text-sm text-stone-700 dark:text-stone-200 hover:bg-coffee-50 dark:hover:bg-stone-700 active:bg-coffee-100 dark:active:bg-stone-600 transition-colors"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onChange(item)
                setOpen(false)
              }}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
