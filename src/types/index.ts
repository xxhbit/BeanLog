export interface BrewLog {
  id?: number
  date: string
  beanName: string
  origin: string
  process: string
  variety: string
  roaster: string
  roastLevel: string
  roastDate: string
  method: string
  brewTechnique: string
  grindSize: string
  dose: number | null
  waterAmount: number | null
  waterTemp: number | null
  brewTime: number | null
  ratio: string
  rating: number
  acidity: number
  sweetness: number
  body: number
  bitterness: number
  aftertaste: number
  flavorTags: string[]
  notes: string
  createdAt: string
  updatedAt: string
}

export type BrewLogInput = Omit<BrewLog, 'id' | 'createdAt' | 'updatedAt'>

export const emptyBrewLog: BrewLogInput = {
  date: new Date().toISOString().slice(0, 10),
  beanName: '',
  origin: '',
  process: '',
  variety: '',
  roaster: '',
  roastLevel: '',
  roastDate: '',
  method: '',
  brewTechnique: '',
  grindSize: 'C40 21',
  dose: 15,
  waterAmount: 240,
  waterTemp: 93,
  brewTime: null,
  ratio: '1:16',
  rating: 0,
  acidity: 3,
  sweetness: 3,
  body: 3,
  bitterness: 3,
  aftertaste: 3,
  flavorTags: [],
  notes: '',
}

export interface CustomTag {
  id?: number
  category: string
  tag: string
}
