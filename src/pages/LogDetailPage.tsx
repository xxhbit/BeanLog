import { useState } from 'react'
import type { BrewLog } from '../types'
import StarRating from '../components/StarRating'
import { FLAVOR_DIMENSION_LABELS } from '../utils/constants'

interface LogDetailPageProps {
  log: BrewLog
  onBack: () => void
  onEdit: () => void
  onDelete: () => void
}

export default function LogDetailPage({ log, onBack, onEdit, onDelete }: LogDetailPageProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  const dateStr = log.date
    ? new Date(log.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
    : ''

  const infoRows: [string, string | number | null][] = [
    ['烘焙商', log.roaster],
    ['产地', log.origin],
    ['处理法', log.process],
    ['品种', log.variety],
    ['烘焙度', log.roastLevel],
    ['烘焙日期', log.roastDate ? new Date(log.roastDate).toLocaleDateString('zh-CN') : null],
    ['冲煮滤杯', log.method],
    ['冲煮方式', log.brewTechnique || null],
    ['研磨度', log.grindSize],
    ['粉量', log.dose != null ? `${log.dose}g` : null],
    ['水量', log.waterAmount != null ? `${log.waterAmount}ml` : null],
    ['水温', log.waterTemp != null ? `${log.waterTemp}°C` : null],
    ['萃取时间', log.brewTime != null ? `${Math.floor(log.brewTime / 60)}分${log.brewTime % 60}秒` : null],
    ['粉水比', log.ratio],
  ]

  const dimensions = Object.entries(FLAVOR_DIMENSION_LABELS) as [string, string][]

  return (
    <div className="flex-1 overflow-auto pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center px-4 py-3">
          <button onClick={onBack} className="mr-3 text-coffee-600 dark:text-coffee-400">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-stone-800 dark:text-stone-100 flex-1 truncate">
            {log.beanName || '未命名咖啡豆'}
          </h1>
          <button onClick={onEdit} className="ml-2 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-coffee-50 dark:bg-coffee-900/30 text-coffee-700 dark:text-coffee-300 text-sm font-medium active:bg-coffee-100 dark:active:bg-coffee-900/50 transition-colors">
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M11.5 1.5l3 3-9 9H2.5v-3l9-9z" />
              <path d="M9.5 3.5l3 3" />
            </svg>
            编辑
          </button>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Date & Rating */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-stone-500 dark:text-stone-400">{dateStr}</span>
          <StarRating value={log.rating} size="sm" readonly />
        </div>

        {/* Info Grid */}
        <div className="bg-white dark:bg-stone-800 rounded-xl p-4 border border-stone-100 dark:border-stone-700">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {infoRows
              .filter(([, v]) => v != null && v !== '')
              .map(([label, value]) => (
                <div key={label}>
                  <span className="text-xs text-stone-400 dark:text-stone-500">{label}</span>
                  <p className="text-sm font-medium text-stone-700 dark:text-stone-200">{value}</p>
                </div>
              ))}
          </div>
        </div>

        {/* Flavor Dimensions */}
        <div className="bg-white dark:bg-stone-800 rounded-xl p-4 border border-stone-100 dark:border-stone-700 space-y-2">
          <h3 className="text-sm font-semibold text-stone-600 dark:text-stone-300 mb-2">风味维度</h3>
          {dimensions.map(([key, label]) => {
            const val = (log[key as keyof BrewLog] as number) ?? 0
            return (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs text-stone-500 dark:text-stone-400 w-14">{label}</span>
                <div className="flex-1 h-2 bg-stone-100 dark:bg-stone-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-coffee-500 rounded-full transition-all"
                    style={{ width: `${(val / 5) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-stone-600 dark:text-stone-300 w-4 text-right">{val}</span>
              </div>
            )
          })}
        </div>

        {/* Flavor Tags */}
        {log.flavorTags && log.flavorTags.length > 0 && (
          <div className="bg-white dark:bg-stone-800 rounded-xl p-4 border border-stone-100 dark:border-stone-700">
            <h3 className="text-sm font-semibold text-stone-600 dark:text-stone-300 mb-2">风味标签</h3>
            <div className="flex flex-wrap gap-1.5">
              {log.flavorTags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 text-xs rounded-full bg-coffee-50 text-coffee-700 dark:bg-coffee-900/30 dark:text-coffee-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {log.notes && (
          <div className="bg-white dark:bg-stone-800 rounded-xl p-4 border border-stone-100 dark:border-stone-700">
            <h3 className="text-sm font-semibold text-stone-600 dark:text-stone-300 mb-2">品鉴笔记</h3>
            <p className="text-sm text-stone-700 dark:text-stone-300 whitespace-pre-wrap">{log.notes}</p>
          </div>
        )}

        {/* Delete */}
        <div className="pt-2">
          {confirmDelete ? (
            <div className="flex gap-3">
              <button
                onClick={onDelete}
                className="flex-1 py-2.5 bg-red-800 dark:bg-red-900 text-white rounded-xl text-sm font-medium active:bg-red-900 transition-colors"
              >
                确认删除
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-2.5 bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-sm font-medium"
              >
                取消
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="w-full py-2.5 text-red-800 dark:text-red-400 text-sm font-medium"
            >
              删除此记录
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
