import Dexie, { type Table } from 'dexie'
import type { BrewLog, CustomTag } from '../types'

export class BeanLogDB extends Dexie {
  brewLogs!: Table<BrewLog, number>
  customTags!: Table<CustomTag, number>

  constructor() {
    super('BeanLogDB')

    this.version(1).stores({
      brewLogs: '++id, date, beanName, origin, roaster, method, createdAt',
    })

    this.version(2).stores({
      brewLogs: '++id, date, beanName, origin, roaster, method, createdAt',
      customTags: '++id, category, tag',
    }).upgrade(tx => {
      return tx.table('brewLogs').toCollection().modify(log => {
        if (log.brewTechnique === undefined) {
          log.brewTechnique = ''
        }
      })
    })
  }
}

export const db = new BeanLogDB()
