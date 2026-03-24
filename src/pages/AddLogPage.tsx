import { useState, useEffect, useCallback } from 'react'
import type { BrewLogInput } from '../types'
import { emptyBrewLog } from '../types'
import { addBrewLog, updateBrewLog, useBrewLog, useRecentValues, useLastLogForBean } from '../db/hooks'
import FormSection from '../components/FormSection'
import AutoSuggestInput from '../components/AutoSuggestInput'
import ChipSelect from '../components/ChipSelect'
import EditableChipSelect from '../components/EditableChipSelect'
import EditableMultiChipSelect from '../components/EditableMultiChipSelect'
import SliderField from '../components/SliderField'
import StarRating from '../components/StarRating'
import {
  DEFAULT_PROCESS_OPTIONS,
  ROAST_LEVEL_OPTIONS,
  DEFAULT_BREW_DRIPPER_OPTIONS,
  DEFAULT_BREW_TECHNIQUE_OPTIONS,
  VARIETY_OPTIONS,
  ORIGIN_OPTIONS,
  DEFAULT_FLAVOR_TAGS,
  FLAVOR_DIMENSION_LABELS,
} from '../utils/constants'

interface AddLogPageProps {
  editId?: number | null
  onSaved?: () => void
  onBack?: () => void
}

export default function AddLogPage({ editId, onSaved, onBack }: AddLogPageProps) {
  const [form, setForm] = useState<BrewLogInput>({ ...emptyBrewLog })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  const existing = useBrewLog(editId ?? undefined)
  const lastLog = useLastLogForBean(form.beanName)

  const recentBeanNames = useRecentValues('beanName')
  const recentOrigins = useRecentValues('origin')
  const recentRoasters = useRecentValues('roaster')
  const recentVarieties = useRecentValues('variety')

  useEffect(() => {
    if (editId && existing) {
      const { id: _, createdAt: _c, updatedAt: _u, ...rest } = existing
      setForm({ ...emptyBrewLog, ...rest })
    }
  }, [editId, existing])

  const applySmartDefaults = useCallback(() => {
    if (!editId && lastLog) {
      setForm((prev) => ({
        ...prev,
        method: prev.method || lastLog.method,
        brewTechnique: prev.brewTechnique || lastLog.brewTechnique || '',
        grindSize: prev.grindSize || lastLog.grindSize,
        dose: prev.dose ?? lastLog.dose,
        waterAmount: prev.waterAmount ?? lastLog.waterAmount,
        waterTemp: prev.waterTemp ?? lastLog.waterTemp,
        origin: prev.origin || lastLog.origin,
        process: prev.process || lastLog.process,
        variety: prev.variety || lastLog.variety,
        roaster: prev.roaster || lastLog.roaster,
        roastLevel: prev.roastLevel || lastLog.roastLevel,
      }))
    }
  }, [editId, lastLog])

  useEffect(() => {
    applySmartDefaults()
  }, [applySmartDefaults])

  const set = <K extends keyof BrewLogInput>(key: K, value: BrewLogInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    if (saving) return
    setSaving(true)
    try {
      if (editId) {
        await updateBrewLog(editId, form)
      } else {
        await addBrewLog(form)
      }
      setToast(editId ? '已更新' : '已保存')
      setTimeout(() => setToast(''), 1500)
      if (!editId) {
        setForm({ ...emptyBrewLog, date: new Date().toISOString().slice(0, 10) })
      }
      onSaved?.()
    } finally {
      setSaving(false)
    }
  }

  const beanIcon = (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M6 18.7c-1.5-1.6-2.4-4-2.4-6.7C3.6 7.4 7.3 3.6 12 3.6S20.4 7.4 20.4 12c0 2.7-.9 5.1-2.4 6.7" opacity="0.3"/>
      <path d="M12 2C6.48 2 2 6.48 2 12c0 3.05 1.36 5.78 3.5 7.62C7.02 20.5 9.39 21.3 12 21.3s4.98-.8 6.5-1.68C20.64 17.78 22 15.05 22 12c0-5.52-4.48-10-10-10zm0 2c4.42 0 8 3.58 8 8 0 1.95-.7 3.73-1.86 5.12C16.88 15.8 14.58 15 12 15s-4.88.8-6.14 2.12A7.96 7.96 0 014 12c0-4.42 3.58-8 8-8z"/>
      <ellipse cx="9" cy="11" rx="2.5" ry="4" transform="rotate(-20 9 11)" fill="currentColor" opacity="0.6"/>
      <ellipse cx="15" cy="11" rx="2.5" ry="4" transform="rotate(20 15 11)" fill="currentColor" opacity="0.6"/>
    </svg>
  )
  const roastIcon = (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 23c-1.1 0-1.99-.89-1.99-1.99h3.98C13.99 22.11 13.1 23 12 23zm1-17.83V3.01c0-.55-.45-1-1-1s-1 .45-1 1V5.17c-3.36.49-6 3.39-6 6.91 0 1.49.47 2.87 1.26 4.01l-.88.88c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l.88-.88A6.92 6.92 0 0012 19.08a6.92 6.92 0 004.33-1.58l.88.88c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-.88-.88A6.93 6.93 0 0019 12.08c0-3.52-2.64-6.42-6-6.91zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" opacity="0.9"/>
      <path d="M10 9.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5S12.33 8 11.5 8 10 8.67 10 9.5z"/>
    </svg>
  )
  const brewIcon = (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4h14l-4.5 13h-5L5 4z" fill="currentColor" opacity="0.12"/>
      <path d="M5 4h14l-4.5 13h-5L5 4z"/>
      <line x1="12" y1="17" x2="12" y2="20"/>
      <line x1="9" y1="20" x2="15" y2="20"/>
      <path d="M8 2v2M12 1.5v2.5M16 2v2" strokeWidth={1.3} opacity="0.4"/>
    </svg>
  )
  const flavorIcon = (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 2C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2 12.5v2.5h-4v-2.5l-.7-.5C7.82 12.6 7 10.9 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.9-.82 3.6-2.3 4.5l-.7.5z" opacity="0.85"/>
      <circle cx="12" cy="9" r="2" opacity="0.5"/>
      <path d="M10 20h4M11 22h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </svg>
  )

  return (
    <div className="flex-1 overflow-auto pb-24 scroll-container">
      <div className="px-4 pt-4 pb-2 flex items-center gap-2">
        {onBack && (
          <button onClick={onBack} className="text-coffee-600 dark:text-coffee-400 -ml-1">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100">
          {editId ? '编辑记录' : '记一杯'}
        </h1>
      </div>

      <div className="px-4 space-y-3 min-w-0 overflow-hidden">
        {/* Date */}
        <div className="min-w-0">
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">日期</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => set('date', e.target.value)}
            className="w-full max-w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-coffee-500 outline-none box-border"
          />
        </div>

        {/* Bean Info -- roaster first, then beanName */}
        <FormSection title="咖啡豆信息" icon={beanIcon} defaultOpen={true}>
          <AutoSuggestInput label="烘焙商" value={form.roaster} onChange={(v) => set('roaster', v)} suggestions={recentRoasters} />
          <AutoSuggestInput label="豆名" value={form.beanName} onChange={(v) => set('beanName', v)} suggestions={recentBeanNames} />
          <AutoSuggestInput label="产地" value={form.origin} onChange={(v) => set('origin', v)} suggestions={[...new Set([...recentOrigins, ...ORIGIN_OPTIONS])]} />
          <EditableChipSelect label="处理法" category="process" defaultOptions={DEFAULT_PROCESS_OPTIONS} value={form.process} onChange={(v) => set('process', v)} />
          <AutoSuggestInput label="品种" value={form.variety} onChange={(v) => set('variety', v)} suggestions={[...new Set([...recentVarieties, ...VARIETY_OPTIONS])]} />
        </FormSection>

        {/* Roast Info */}
        <FormSection title="烘焙信息" icon={roastIcon} defaultOpen={true}>
          <ChipSelect label="烘焙度" options={ROAST_LEVEL_OPTIONS} value={form.roastLevel} onChange={(v) => set('roastLevel', v)} />
          <div className="min-w-0">
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">烘焙日期</label>
            <input
              type="date"
              value={form.roastDate}
              onChange={(e) => set('roastDate', e.target.value)}
              className="w-full max-w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-coffee-500 outline-none box-border"
            />
          </div>
        </FormSection>

        {/* Brew Params */}
        <FormSection title="冲煮参数" icon={brewIcon} defaultOpen={true}>
          <EditableChipSelect label="冲煮滤杯" category="brewDripper" defaultOptions={DEFAULT_BREW_DRIPPER_OPTIONS} value={form.method} onChange={(v) => set('method', v)} />
          <EditableChipSelect label="冲煮方式" category="brewTechnique" defaultOptions={DEFAULT_BREW_TECHNIQUE_OPTIONS} value={form.brewTechnique} onChange={(v) => set('brewTechnique', v)} />
          <AutoSuggestInput label="研磨度" value={form.grindSize} onChange={(v) => set('grindSize', v)} suggestions={[]} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">粉量 (g)</label>
              <input
                type="number"
                inputMode="decimal"
                value={form.dose ?? ''}
                onChange={(e) => set('dose', e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-coffee-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">水量 (ml)</label>
              <input
                type="number"
                inputMode="decimal"
                value={form.waterAmount ?? ''}
                onChange={(e) => set('waterAmount', e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-coffee-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">水温 (°C)</label>
              <input
                type="number"
                inputMode="decimal"
                value={form.waterTemp ?? ''}
                onChange={(e) => set('waterTemp', e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-coffee-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">萃取时间</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={form.brewTime != null ? Math.floor(form.brewTime / 60) : ''}
                  onChange={(e) => {
                    const min = e.target.value ? Number(e.target.value) : 0
                    const sec = form.brewTime != null ? form.brewTime % 60 : 0
                    const total = min * 60 + sec
                    set('brewTime', total || null)
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-coffee-500 outline-none"
                />
                <span className="text-sm text-stone-500 dark:text-stone-400 shrink-0">分</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={59}
                  value={form.brewTime != null ? form.brewTime % 60 : ''}
                  onChange={(e) => {
                    const sec = e.target.value ? Math.min(Number(e.target.value), 59) : 0
                    const min = form.brewTime != null ? Math.floor(form.brewTime / 60) : 0
                    const total = min * 60 + sec
                    set('brewTime', total || null)
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-coffee-500 outline-none"
                />
                <span className="text-sm text-stone-500 dark:text-stone-400 shrink-0">秒</span>
              </div>
            </div>
          </div>
          <AutoSuggestInput label="粉水比" value={form.ratio} onChange={(v) => set('ratio', v)} suggestions={['1:15', '1:16', '1:16.7', '1:17', '1:18']} />
        </FormSection>

        {/* Flavor */}
        <FormSection title="风味感知" icon={flavorIcon} defaultOpen={true}>
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">综合评分</label>
            <StarRating value={form.rating} onChange={(v) => set('rating', v)} size="lg" />
          </div>

          {(Object.keys(FLAVOR_DIMENSION_LABELS) as Array<keyof typeof FLAVOR_DIMENSION_LABELS>).map((key) => (
            <SliderField
              key={key}
              label={FLAVOR_DIMENSION_LABELS[key]}
              value={form[key as keyof BrewLogInput] as number}
              onChange={(v) => set(key as keyof BrewLogInput, v as never)}
            />
          ))}

          <EditableMultiChipSelect label="风味标签" category="flavorTags" defaultOptions={DEFAULT_FLAVOR_TAGS} value={form.flavorTags} onChange={(v) => set('flavorTags', v)} />

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">品鉴笔记</label>
            <textarea
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="记录你的品鉴感受..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-coffee-500 outline-none resize-none"
            />
          </div>
        </FormSection>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-coffee-700 text-white rounded-xl font-semibold text-base shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 dark:bg-coffee-600"
        >
          {saving ? '保存中...' : editId ? '更新记录' : '保存记录'}
        </button>
      </div>

      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-stone-800 text-white px-6 py-2 rounded-full text-sm shadow-lg z-50 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  )
}
