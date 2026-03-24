interface ChipSelectProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  label?: string
}

export default function ChipSelect({ options, value, onChange, label }: ChipSelectProps) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">{label}</label>}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(value === opt ? '' : opt)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              value === opt
                ? 'bg-coffee-600 text-white shadow-sm dark:bg-coffee-500'
                : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
