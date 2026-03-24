import { useState, useRef } from 'react'
import { exportToCSV, parseCSV, importFromCSV } from '../utils/csv'
import { useBrewLogs } from '../db/hooks'

export default function SettingsPage() {
  const logs = useBrewLogs()
  const [importing, setImporting] = useState(false)
  const [preview, setPreview] = useState<Record<string, string>[] | null>(null)
  const [toast, setToast] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2000)
  }

  const handleExport = async () => {
    await exportToCSV()
    showToast(`已导出 ${logs.length} 条记录`)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const rows = await parseCSV(file)
      setPreview(rows)
    } catch {
      showToast('文件解析失败')
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleImport = async () => {
    if (!preview) return
    setImporting(true)
    try {
      const count = await importFromCSV(preview)
      showToast(`已导入 ${count} 条记录`)
      setPreview(null)
    } catch {
      showToast('导入失败')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="flex-1 overflow-auto pb-24">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100">设置</h1>
      </div>

      <div className="px-4 space-y-4">
        {/* Data management */}
        <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-100 dark:border-stone-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-stone-100 dark:border-stone-700">
            <h2 className="font-medium text-stone-700 dark:text-stone-200">数据管理</h2>
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">当前共 {logs.length} 条记录</p>
          </div>

          <button
            onClick={handleExport}
            className="w-full flex items-center px-4 py-3 border-b border-stone-50 dark:border-stone-700/50 active:bg-stone-50 dark:active:bg-stone-700/50 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-coffee-600 dark:text-coffee-400 mr-3" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span className="text-sm text-stone-700 dark:text-stone-200">导出为 CSV</span>
          </button>

          <button
            onClick={() => fileRef.current?.click()}
            className="w-full flex items-center px-4 py-3 active:bg-stone-50 dark:active:bg-stone-700/50 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-coffee-600 dark:text-coffee-400 mr-3" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <span className="text-sm text-stone-700 dark:text-stone-200">从 CSV 导入</span>
          </button>
          <input ref={fileRef} type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />
        </div>

        {/* Import Preview */}
        {preview && (
          <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-100 dark:border-stone-700 overflow-hidden">
            <div className="px-4 py-3 border-b border-stone-100 dark:border-stone-700">
              <h2 className="font-medium text-stone-700 dark:text-stone-200">导入预览</h2>
              <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">共 {preview.length} 条记录待导入</p>
            </div>

            <div className="max-h-48 overflow-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-stone-50 dark:bg-stone-700/50">
                    <th className="px-3 py-2 text-left text-stone-500">日期</th>
                    <th className="px-3 py-2 text-left text-stone-500">豆名</th>
                    <th className="px-3 py-2 text-left text-stone-500">方式</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(0, 10).map((row, i) => (
                    <tr key={i} className="border-t border-stone-50 dark:border-stone-700/50">
                      <td className="px-3 py-2 text-stone-600 dark:text-stone-300">{row.date}</td>
                      <td className="px-3 py-2 text-stone-600 dark:text-stone-300">{row.beanName}</td>
                      <td className="px-3 py-2 text-stone-600 dark:text-stone-300">{row.method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {preview.length > 10 && (
                <p className="text-xs text-center text-stone-400 py-2">还有 {preview.length - 10} 条...</p>
              )}
            </div>

            <div className="flex gap-3 p-4">
              <button
                onClick={handleImport}
                disabled={importing}
                className="flex-1 py-2.5 bg-coffee-700 text-white rounded-xl text-sm font-medium disabled:opacity-50 dark:bg-coffee-600"
              >
                {importing ? '导入中...' : '确认导入'}
              </button>
              <button
                onClick={() => setPreview(null)}
                className="flex-1 py-2.5 bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-sm font-medium"
              >
                取消
              </button>
            </div>
          </div>
        )}

        {/* About */}
        <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-100 dark:border-stone-700 p-4">
          <h2 className="font-medium text-stone-700 dark:text-stone-200 mb-2">关于</h2>
          <div className="text-sm text-stone-500 dark:text-stone-400 space-y-1">
            <p>BeanLog v1.0.0</p>
            <p>一个简洁的咖啡记录应用</p>
            <p className="text-xs">数据仅存储在本地浏览器中</p>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-stone-800 text-white px-6 py-2 rounded-full text-sm shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  )
}
