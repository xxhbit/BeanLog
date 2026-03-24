import { useState } from 'react'
import BottomNav from './components/BottomNav'
import RecordsPage from './pages/RecordsPage'
import AddLogPage from './pages/AddLogPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  const [tab, setTab] = useState('records')
  const [editId, setEditId] = useState<number | null>(null)

  const handleEdit = (id: number) => {
    setEditId(id)
    setTab('add')
  }

  const handleTabChange = (id: string) => {
    if (id !== 'add') {
      setEditId(null)
    }
    setTab(id)
  }

  const handleSaved = () => {
    setEditId(null)
    setTab('records')
  }

  return (
    <div className="flex flex-col h-full bg-stone-50 dark:bg-stone-950">
      <div className="flex-1 overflow-hidden flex flex-col">
        {tab === 'records' && <RecordsPage onEdit={handleEdit} />}
        {tab === 'add' && <AddLogPage editId={editId} onSaved={handleSaved} onBack={editId ? () => { setEditId(null); setTab('records') } : undefined} />}
        {tab === 'settings' && <SettingsPage />}
      </div>
      <BottomNav active={tab} onChange={handleTabChange} />
    </div>
  )
}
