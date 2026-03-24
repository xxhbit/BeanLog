interface MultiChipSelectProps {
  options: string[]
  value: string[]
  onChange: (value: string[]) => void
  label?: string
}

export default function MultiChipSelect({ options, value, onChange, label }: MultiChipSelectProps) {
  const toggle = (opt: string) => {
    if (value.includes(opt)) {
      onChange(value.filter((v) => v !== opt))
    } else {
      onChange([...value, opt])
    }
  }

  return (
    <div>
      {label && <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">{label}</label>}
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const selected = value.includes(opt)
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                selected
                  ? 'bg-coffee-600 text-white shadow-sm dark:bg-coffee-500'
                  : 'bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400'
              }`}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}
