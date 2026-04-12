import { useMemo, useState } from 'react'
import ConfirmDeleteModal from '../components/ConfirmDeleteModal'
import LibrarianFormModal from '../components/LibrarianFormModal'
import { useLibrarians } from '../hooks/useLibrarians'

const totalPages = (total, size) => Math.max(1, Math.ceil(total / size))

const LibrarianManagement = ({ onNotify }) => {
  const {
    query,
    data,
    loading,
    setKeyword,
    setPage,
    createLibrarian,
    updateLibrarian,
    deleteLibrarian
  } = useLibrarians()

  const [keywordInput, setKeywordInput] = useState('')
  const [formMode, setFormMode] = useState('create')
  const [formOpen, setFormOpen] = useState(false)
  const [current, setCurrent] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const pageTotal = useMemo(() => totalPages(data.total, data.size), [data.total, data.size])

  const openCreate = () => {
    setFormMode('create')
    setCurrent(null)
    setFormOpen(true)
  }

  const openEdit = (item) => {
    setFormMode('edit')
    setCurrent(item)
    setFormOpen(true)
  }

  const openDelete = (item) => {
    setCurrent(item)
    setDeleteOpen(true)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setKeyword(keywordInput.trim())
  }

  const handleSubmit = async (payload) => {
    try {
      setSubmitting(true)
      if (formMode === 'create') {
        await createLibrarian(payload)
        onNotify('success', 'Librarian created successfully')
      } else {
        await updateLibrarian(current.id, payload)
        onNotify('success', 'Librarian updated successfully')
      }
      setFormOpen(false)
      setCurrent(null)
    } catch (error) {
      onNotify('error', error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!current) return
    try {
      setSubmitting(true)
      await deleteLibrarian(current.id)
      onNotify('success', 'Librarian deleted successfully')
      setDeleteOpen(false)
      setCurrent(null)
    } catch (error) {
      onNotify('error', error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="content">
      <div className="page-header">
        <h2>👔 Librarian Management</h2>
      </div>

      <div className="search-section">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            className="search-input"
            placeholder="Search by name / email / staff ID"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
          />
          <button className="search-btn" type="submit">Search</button>
          <button className="btn-primary" type="button" onClick={openCreate}>+ New Librarian</button>
        </form>
      </div>

      <div className="table-section">
        <h3>Librarian List</h3>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Staff ID</th>
                  <th>Role</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.list.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.staffId || '-'}</td>
                    <td><span className="status-badge info">{item.role}</span></td>
                    <td>{item.createdAt}</td>
                    <td>
                      <button className="btn-sm" onClick={() => openEdit(item)}>Edit</button>
                      <button className="btn-sm danger" onClick={() => openDelete(item)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.list.length === 0 && <div className="no-data">No librarian data</div>}

            <div className="form-actions" style={{ justifyContent: 'space-between', marginTop: 18 }}>
              <span style={{ color: '#718096', fontSize: 13 }}>Total {data.total} records · Page {data.page}/{pageTotal}</span>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  className="btn-secondary"
                  onClick={() => setPage(query.page - 1)}
                  disabled={query.page <= 1}
                >
                  Previous
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setPage(query.page + 1)}
                  disabled={query.page >= pageTotal}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <LibrarianFormModal
        key={`${formMode}-${current?.id || 'new'}-${formOpen ? 'open' : 'closed'}`}
        open={formOpen}
        mode={formMode}
        librarian={current}
        loading={submitting}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDeleteModal
        open={deleteOpen}
        librarian={current}
        loading={submitting}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  )
}

export default LibrarianManagement
