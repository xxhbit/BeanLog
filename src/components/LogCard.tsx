import type { BrewLog } from '../types'
import StarRating from './StarRating'

interface LogCardProps {
  log: BrewLog
  onClick: () => void
  onEdit: () => void
}

export default function LogCard({ log, onClick, onEdit }: LogCardProps) {
  const dateStr = log.date
    ? new Date(log.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
    : ''

  const brewInfo = [log.method, log.brewTechnique].filter(Boolean).join(' · ')

  return (
    <div className="bg-white dark:bg-stone-800 rounded-xl p-4 shadow-sm border border-stone-100 dark:border-stone-700">
      <button
        onClick={onClick}
        className="w-full text-left active:opacity-80 transition-opacity"
      >
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-stone-800 dark:text-stone-100 truncate">
              {[log.roaster, log.variety].filter(Boolean).join(' · ') || '未命名咖啡豆'}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-stone-500 dark:text-stone-400">
              {dateStr && <span>{dateStr}</span>}
              {brewInfo && (
                <>
                  <span className="text-stone-300 dark:text-stone-600">·</span>
                  <span>{brewInfo}</span>
                </>
              )}
              {log.origin && (
                <>
                  <span className="text-stone-300 dark:text-stone-600">·</span>
                  <span>{log.origin}</span>
                </>
              )}
            </div>
            {log.flavorTags && log.flavorTags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {log.flavorTags.slice(0, 4).map((tag) => (
                  <span key={tag} className="px-1.5 py-0.5 text-[10px] rounded-full bg-coffee-50 text-coffee-700 dark:bg-coffee-900/30 dark:text-coffee-300">
                    {tag}
                  </span>
                ))}
                {log.flavorTags.length > 4 && (
                  <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-stone-100 text-stone-400 dark:bg-stone-700">
                    +{log.flavorTags.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="ml-3 flex-shrink-0">
            <StarRating value={log.rating} size="sm" readonly />
          </div>
        </div>
      </button>
      <div className="flex items-center justify-end mt-2 pt-2 border-t border-stone-50 dark:border-stone-700/50">
        <button
          onClick={onEdit}
          className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium text-coffee-600 dark:text-coffee-400 active:bg-coffee-50 dark:active:bg-stone-700 transition-colors"
        >
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M11.5 1.5l3 3-9 9H2.5v-3l9-9z" />
            <path d="M9.5 3.5l3 3" />
          </svg>
          编辑
        </button>
      </div>
    </div>
  )
}
