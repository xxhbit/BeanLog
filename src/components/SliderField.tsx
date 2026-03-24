interface SliderFieldProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  labels?: string[]
}

export default function SliderField({ label, value, onChange, min = 1, max = 5, labels }: SliderFieldProps) {
  const defaultLabels = ['很弱', '偏弱', '适中', '偏强', '很强']
  const displayLabels = labels ?? defaultLabels

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-stone-700 dark:text-stone-300">{label}</span>
        <span className="text-sm text-coffee-600 dark:text-coffee-400 font-medium">
          {displayLabels[value - min] ?? value}
        </span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`flex-1 h-8 rounded-md text-xs font-medium transition-all ${
              v <= value
                ? 'bg-coffee-500 text-white dark:bg-coffee-600'
                : 'bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-500'
            }`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  )
}
