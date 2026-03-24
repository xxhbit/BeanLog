import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '.'
import type { BrewLog, BrewLogInput } from '../types'

export function useBrewLogs() {
  const logs = useLiveQuery(
    () => db.brewLogs.orderBy('date').reverse().toArray(),
    []
  )
  return logs ?? []
}

export function useBrewLog(id: number | undefined) {
  return useLiveQuery(
    () => (id != null ? db.brewLogs.get(id) : undefined),
    [id]
  )
}

export function useRecentValues(field: keyof BrewLog, limit = 20) {
  return useLiveQuery(async () => {
    const logs = await db.brewLogs.orderBy('createdAt').reverse().limit(200).toArray()
    const seen = new Set<string>()
    const results: string[] = []
    for (const log of logs) {
      const val = String(log[field] ?? '').trim()
      if (val && !seen.has(val)) {
        seen.add(val)
        results.push(val)
        if (results.length >= limit) break
      }
    }
    return results
  }, [field, limit]) ?? []
}

export function useLastLogForBean(beanName: string) {
  return useLiveQuery(async () => {
    if (!beanName) return undefined
    const logs = await db.brewLogs
      .orderBy('createdAt')
      .reverse()
      .filter((l) => l.beanName === beanName)
      .limit(1)
      .toArray()
    return logs[0]
  }, [beanName])
}

export function useCustomTags(category: string) {
  return useLiveQuery(
    () => db.customTags.where('category').equals(category).toArray(),
    [category]
  ) ?? []
}

const HIDDEN_PREFIX = 'hidden_'

export function useHiddenDefaults(category: string) {
  return useLiveQuery(
    () => db.customTags.where('category').equals(HIDDEN_PREFIX + category).toArray(),
    [category]
  ) ?? []
}

export async function addCustomTag(category: string, tag: string) {
  const existing = await db.customTags
    .where({ category, tag })
    .first()
  if (!existing) {
    await db.customTags.add({ category, tag })
  }
  const hidden = await db.customTags
    .where({ category: HIDDEN_PREFIX + category, tag })
    .first()
  if (hidden?.id != null) {
    await db.customTags.delete(hidden.id)
  }
}

export async function removeCustomTag(id: number) {
  return db.customTags.delete(id)
}

export async function hideDefaultTag(category: string, tag: string) {
  const existing = await db.customTags
    .where({ category: HIDDEN_PREFIX + category, tag })
    .first()
  if (!existing) {
    await db.customTags.add({ category: HIDDEN_PREFIX + category, tag })
  }
}

export async function addBrewLog(input: BrewLogInput): Promise<number> {
  const now = new Date().toISOString()
  return db.brewLogs.add({
    ...input,
    createdAt: now,
    updatedAt: now,
  } as BrewLog)
}

export async function updateBrewLog(id: number, input: Partial<BrewLogInput>) {
  return db.brewLogs.update(id, {
    ...input,
    updatedAt: new Date().toISOString(),
  })
}

export async function deleteBrewLog(id: number) {
  return db.brewLogs.delete(id)
}

export async function getAllBrewLogs(): Promise<BrewLog[]> {
  return db.brewLogs.orderBy('date').reverse().toArray()
}

export async function bulkAddBrewLogs(logs: BrewLog[]) {
  return db.brewLogs.bulkAdd(logs)
}
