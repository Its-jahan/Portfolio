import { useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'review-comments'

function loadComments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveComments(comments) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comments))
  } catch {
    // storage unavailable — comments just won't persist across reloads
  }
}

export default function CommentOverlay() {
  const [active, setActive] = useState(false)
  const [comments, setComments] = useState(() => loadComments())
  const [draft, setDraft] = useState(null) // { xPercent, pageY, text }
  const [panelOpen, setPanelOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const draftRef = useRef(null)

  useEffect(() => {
    saveComments(comments)
  }, [comments])

  useEffect(() => {
    if (!active) return

    const handleClick = (e) => {
      if (e.target.closest('[data-comment-ui]')) return
      const xPercent = (e.pageX / document.documentElement.scrollWidth) * 100
      const pageY = e.pageY
      setDraft({ xPercent, pageY, text: '' })
    }

    window.addEventListener('click', handleClick, true)
    return () => window.removeEventListener('click', handleClick, true)
  }, [active])

  useEffect(() => {
    if (draft && draftRef.current) {
      draftRef.current.focus()
    }
  }, [draft])

  const submitDraft = () => {
    if (!draft || !draft.text.trim()) {
      setDraft(null)
      return
    }
    setComments((prev) => [...prev, { id: Date.now(), xPercent: draft.xPercent, pageY: draft.pageY, text: draft.text.trim() }])
    setDraft(null)
  }

  const deleteComment = (id) => {
    setComments((prev) => prev.filter((c) => c.id !== id))
  }

  const clearAll = () => {
    if (comments.length === 0) return
    if (window.confirm('Delete all comments?')) setComments([])
  }

  const copyAll = async () => {
    const text = comments
      .map((c, i) => `${i + 1}. (${Math.round(c.xPercent)}% across, ${Math.round(c.pageY)}px down) ${c.text}`)
      .join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard unavailable — user can still read/select the text in the panel
    }
  }

  return (
    <div data-comment-ui>
      {/* Pins */}
      {comments.map((c, i) => (
        <div
          key={c.id}
          className="absolute z-[9998] flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-lg ring-2 ring-white"
          style={{ left: `${c.xPercent}%`, top: `${c.pageY}px` }}
          title={c.text}
        >
          {i + 1}
        </div>
      ))}

      {/* Draft pin + input */}
      {draft && (
        <div
          className="absolute z-[9999] flex -translate-x-1/2 -translate-y-1/2 flex-col gap-2 rounded-lg border border-red-300 bg-white p-2 shadow-xl"
          style={{ left: `${draft.xPercent}%`, top: `${draft.pageY}px` }}
        >
          <textarea
            ref={draftRef}
            value={draft.text}
            onChange={(e) => setDraft({ ...draft, text: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                submitDraft()
              }
              if (e.key === 'Escape') setDraft(null)
            }}
            placeholder="What's wrong here?"
            className="w-56 resize-none rounded border border-gray-300 p-1.5 text-sm text-black outline-none focus:border-red-400"
            rows={2}
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setDraft(null)}
              className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submitDraft}
              className="rounded bg-red-500 px-2 py-1 text-xs font-medium text-white hover:bg-red-600"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Toggle + panel controls, fixed to viewport */}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end gap-2">
        {panelOpen && (
          <div className="max-h-[60vh] w-80 overflow-y-auto rounded-xl border border-gray-200 bg-white p-3 shadow-2xl">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-black">Comments ({comments.length})</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={copyAll}
                  disabled={comments.length === 0}
                  className="rounded bg-gray-100 px-2 py-1 text-xs text-black hover:bg-gray-200 disabled:opacity-40"
                >
                  {copied ? 'Copied!' : 'Copy all'}
                </button>
                <button
                  type="button"
                  onClick={clearAll}
                  disabled={comments.length === 0}
                  className="rounded bg-gray-100 px-2 py-1 text-xs text-black hover:bg-gray-200 disabled:opacity-40"
                >
                  Clear
                </button>
              </div>
            </div>
            {comments.length === 0 ? (
              <p className="py-4 text-center text-xs text-gray-400">
                Turn on comment mode and click anywhere on the page to leave a note.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {comments.map((c, i) => (
                  <li key={c.id} className="flex items-start gap-2 rounded border border-gray-100 p-2 text-xs">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-red-500 font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-gray-700">{c.text}</span>
                    <button
                      type="button"
                      onClick={() => deleteComment(c.id)}
                      className="shrink-0 text-gray-400 hover:text-red-500"
                      aria-label="Delete comment"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPanelOpen((v) => !v)}
            className="rounded-full bg-black px-3 py-2 text-xs font-medium text-white shadow-lg hover:bg-gray-800"
          >
            {panelOpen ? 'Hide' : 'Show'} list{comments.length > 0 ? ` (${comments.length})` : ''}
          </button>
          <button
            type="button"
            onClick={() => setActive((v) => !v)}
            className={`rounded-full px-3 py-2 text-xs font-medium shadow-lg ${
              active ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            {active ? '● Commenting: ON' : 'Comment mode'}
          </button>
        </div>
      </div>
    </div>
  )
}
