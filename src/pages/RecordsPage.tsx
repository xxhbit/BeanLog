import { useState, useMemo } from 'react'
import { useBrewLogs, deleteBrewLog } from '../db/hooks'
import type { BrewLog } from '../types'
import LogCard from '../components/LogCard'
import LogDetailPage from './LogDetailPage'

interface RecordsPageProps {
  onEdit: (id: number) => void
}

function matchesSearch(log: BrewLog, query: string): boolean {
  const q = query.toLowerCase()
  return [
    log.roaster,
    log.variety,
    log.origin,
    log.process,
    log.method,
    log.brewTechnique,
    log.roastLevel,
    ...(log.flavorTags ?? []),
  ].some((field) => field && field.toLowerCase().includes(q))
}

export default function RecordsPage({ onEdit }: RecordsPageProps) {
  const logs = useBrewLogs()
  const [viewId, setViewId] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const viewLog = logs.find((l) => l.id === viewId)

  const filtered = useMemo(() => {
    if (!search.trim()) return logs
    return logs.filter((log) => matchesSearch(log, search.trim()))
  }, [logs, search])

  if (viewLog) {
    return (
      <LogDetailPage
        log={viewLog}
        onBack={() => setViewId(null)}
        onEdit={() => {
          setViewId(null)
          onEdit(viewLog.id!)
        }}
        onDelete={async () => {
          await deleteBrewLog(viewLog.id!)
          setViewId(null)
        }}
      />
    )
  }

  return (
    <div className="flex-1 overflow-auto pb-24 scroll-container">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100">咖啡记录</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">
          共 {logs.length} 条记录
        </p>
      </div>

      {logs.length > 0 && (
        <div className="px-4 pb-2">
          <div className="relative">
            <svg viewBox="0 0 20 20" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 dark:text-stone-500 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8.5" cy="8.5" r="5.5" />
              <path d="M13 13l4 4" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索豆名、产地、烘焙商、处理法..."
              className="w-full pl-9 pr-8 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:ring-2 focus:ring-coffee-500 focus:border-transparent outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-stone-200 dark:bg-stone-600 flex items-center justify-center"
              >
                <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-stone-500 dark:text-stone-300" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                  <path d="M3 3l6 6M9 3l-6 6" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-20 text-stone-400 dark:text-stone-500">
          <svg viewBox="0 0 24 24" className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <p className="text-sm">还没有记录</p>
          <p className="text-xs mt-1">点击下方「记一杯」开始</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-16 text-stone-400 dark:text-stone-500">
          <p className="text-sm">未找到匹配的记录</p>
        </div>
      ) : (
        <div className="px-4 space-y-2">
          {search.trim() && (
            <p className="text-xs text-stone-400 dark:text-stone-500 px-1">找到 {filtered.length} 条结果</p>
          )}
          {filtered.map((log) => (
            <LogCard
              key={log.id}
              log={log}
              onClick={() => setViewId(log.id!)}
              onEdit={() => onEdit(log.id!)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
