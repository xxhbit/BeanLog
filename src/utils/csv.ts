import Papa from 'papaparse'
import type { BrewLog } from '../types'
import { getAllBrewLogs, bulkAddBrewLogs } from '../db/hooks'

const TAG_SEPARATOR = ';'

export async function exportToCSV(): Promise<void> {
  const logs = await getAllBrewLogs()

  const rows = logs.map((log) => ({
    ...log,
    flavorTags: Array.isArray(log.flavorTags) ? log.flavorTags.join(TAG_SEPARATOR) : log.flavorTags,
  }))

  const csv = Papa.unparse(rows)
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `beanlog_export_${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function parseCSV(file: File): Promise<Record<string, string>[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => resolve(result.data as Record<string, string>[]),
      error: (err: Error) => reject(err),
    })
  })
}

export async function importFromCSV(rows: Record<string, string>[]): Promise<number> {
  const now = new Date().toISOString()

  const logs: BrewLog[] = rows.map((row) => ({
    date: row.date || now.slice(0, 10),
    beanName: row.beanName || '',
    origin: row.origin || '',
    process: row.process || '',
    variety: row.variety || '',
    roaster: row.roaster || '',
    roastLevel: row.roastLevel || '',
    roastDate: row.roastDate || '',
    method: row.method || '',
    brewTechnique: row.brewTechnique || '',
    grindSize: row.grindSize || '',
    dose: row.dose ? Number(row.dose) : null,
    waterAmount: row.waterAmount ? Number(row.waterAmount) : null,
    waterTemp: row.waterTemp ? Number(row.waterTemp) : null,
    brewTime: row.brewTime ? Number(row.brewTime) : null,
    ratio: row.ratio || '',
    rating: Number(row.rating) || 0,
    acidity: Number(row.acidity) || 3,
    sweetness: Number(row.sweetness) || 3,
    body: Number(row.body) || 3,
    bitterness: Number(row.bitterness) || 3,
    aftertaste: Number(row.aftertaste) || 3,
    flavorTags: row.flavorTags ? row.flavorTags.split(TAG_SEPARATOR).map((t) => t.trim()).filter(Boolean) : [],
    notes: row.notes || '',
    createdAt: row.createdAt || now,
    updatedAt: row.updatedAt || now,
  }))

  await bulkAddBrewLogs(logs)
  return logs.length
}
