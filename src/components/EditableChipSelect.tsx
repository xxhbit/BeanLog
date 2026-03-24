import { useState } from 'react'
import { useCustomTags, useHiddenDefaults, addCustomTag, removeCustomTag, hideDefaultTag } from '../db/hooks'

interface EditableChipSelectProps {
  category: string
  defaultOptions: string[]
  value: string
  onChange: (value: string) => void
  label?: string
}

export default function EditableChipSelect({ category, defaultOptions, value, onChange, label }: EditableChipSelectProps) {
  const customTags = useCustomTags(category)
  const hiddenDefaults = useHiddenDefaults(category)
  const [editing, setEditing] = useState(false)
  const [newTag, setNewTag] = useState('')

  const hiddenSet = new Set(hiddenDefaults.map((t) => t.tag))
  const customValues = customTags.map((t) => t.tag)
  const visibleDefaults = defaultOptions.filter((t) => !hiddenSet.has(t))
  const allOptions = [...visibleDefaults, ...customValues.filter((t) => !defaultOptions.includes(t))]

  const handleAdd = async () => {
    const trimmed = newTag.trim()
    if (trimmed && !allOptions.includes(trimmed)) {
      await addCustomTag(category, trimmed)
      setNewTag('')
    }
  }

  const handleRemove = async (tag: string) => {
    const isCustom = customValues.includes(tag) && !defaultOptions.includes(tag)
    if (isCustom) {
      const found = customTags.find((t) => t.tag === tag)
      if (found?.id != null) {
        await removeCustomTag(found.id)
      }
    } else {
      await hideDefaultTag(category, tag)
    }
    if (value === tag) onChange('')
  }

  return (
    <div>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-medium text-stone-700 dark:text-stone-300">{label}</label>
          <button
            type="button"
            onClick={() => setEditing(!editing)}
            className="text-sm text-coffee-500 dark:text-coffee-400"
          >
            {editing ? '完成' : '编辑'}
          </button>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {allOptions.map((opt) => (
          <div key={opt} className="relative group">
            <button
              type="button"
              onClick={() => !editing && onChange(value === opt ? '' : opt)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                value === opt
                  ? 'bg-coffee-600 text-white shadow-sm dark:bg-coffee-500'
                  : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
              }`}
            >
              {opt}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => handleRemove(opt)}
                className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-stone-200 dark:bg-stone-600 rounded-full flex items-center justify-center"
              >
                <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-stone-500 dark:text-stone-300" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                  <path d="M3 3l6 6M9 3l-6 6" />
                </svg>
              </button>
            )}
          </div>
        ))}
        {editing && (
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
              placeholder="新增..."
              className="w-20 px-2 py-1.5 rounded-full border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-700 text-sm text-stone-700 dark:text-stone-200 outline-none focus:ring-1 focus:ring-coffee-500"
            />
            <button
              type="button"
              onClick={handleAdd}
              className="w-7 h-7 rounded-full bg-coffee-500 text-white flex items-center justify-center"
            >
              <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                <path d="M6 1v10M1 6h10" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
