import { useEffect, useMemo, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import classNames from 'classnames'
import { extractSelectedText } from '../../services/pdf/textExtraction'
import type { SelectionData } from '../../types'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

interface PDFViewerProps {
  file: File | null
  onSelection: (selection: SelectionData) => void
}

export function PDFViewer({ file, onSelection }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState(1.1)
  const [rotate, setRotate] = useState(0)
  const [pageWidth, setPageWidth] = useState<number | null>(null)
  const [continuous, setContinuous] = useState(false)
  const [showTextLayer, setShowTextLayer] = useState(true)
  const [lastSelection, setLastSelection] = useState<SelectionData | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const fileUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])

  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl)
    }
  }, [fileUrl])

  const handleMouseUp = () => {
    const selection = extractSelectedText()
    if (selection) {
      setLastSelection(selection)
      onSelection(selection)
    }
  }

  if (!file) {
    return (
      <div className="h-full rounded-xl border border-slate-800/60 bg-panel flex items-center justify-center text-slate-400">
        Load a PDF to begin
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 text-sm text-slate-300">
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 rounded-lg bg-slate-800 text-slate-100 disabled:opacity-40"
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            disabled={pageNumber <= 1}
          >
            Prev
          </button>
          <button
            className="px-3 py-1 rounded-lg bg-slate-800 text-slate-100 disabled:opacity-40"
            onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
            disabled={pageNumber >= numPages}
          >
            Next
          </button>
          <span className="text-slate-400">Page</span>
          <input
            type="number"
            className="w-16 rounded-md bg-slate-900 border border-slate-800 px-2 py-1 text-slate-100"
            value={pageNumber}
            min={1}
            max={numPages || 1}
            onChange={(e) => {
              const next = Number(e.target.value)
              if (Number.isFinite(next)) setPageNumber(Math.min(Math.max(1, next), numPages || 1))
            }}
          />
          <span className="text-slate-500">/ {numPages || '?'}</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            className="px-3 py-1 rounded-lg bg-slate-800 text-slate-100"
            onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
            title="Zoom out"
          >
            -
          </button>
          <span className="text-slate-300">{Math.round(scale * 100)}%</span>
          <button
            className="px-3 py-1 rounded-lg bg-slate-800 text-slate-100"
            onClick={() => setScale((s) => Math.min(2.5, s + 0.1))}
            title="Zoom in"
          >
            +
          </button>
          <button
            className="px-3 py-1 rounded-lg bg-slate-800 text-slate-100"
            onClick={() => setScale(1)}
            title="Reset zoom"
          >
            100%
          </button>
          <button
            className="px-3 py-1 rounded-lg bg-slate-800 text-slate-100"
            onClick={() => {
              const containerWidth = containerRef.current?.clientWidth ?? 0
              if (containerWidth && pageWidth) {
                const gutter = 32
                const nextScale = Math.max(0.5, Math.min(3, (containerWidth - gutter) / pageWidth))
                setScale(nextScale)
              }
            }}
            title="Fit to width"
          >
            Fit width
          </button>
          <button
            className="px-3 py-1 rounded-lg bg-slate-800 text-slate-100"
            onClick={() => setScale(1.25)}
            title="Zoom 125%"
          >
            125%
          </button>
          <button
            className="px-3 py-1 rounded-lg bg-slate-800 text-slate-100"
            onClick={() => setScale(1.5)}
            title="Zoom 150%"
          >
            150%
          </button>
          <button
            className="px-3 py-1 rounded-lg bg-slate-800 text-slate-100"
            onClick={() => setRotate((r) => (r + 90) % 360)}
            title="Rotate 90°"
          >
            ⟳
          </button>
          <button
            className={classNames(
              'px-3 py-1 rounded-lg border',
              continuous
                ? 'border-accent text-accent bg-accent/10'
                : 'border-slate-800 text-slate-200 bg-slate-900',
            )}
            onClick={() => setContinuous((v) => !v)}
            title="Toggle continuous scroll"
          >
            {continuous ? 'Continuous' : 'Single page'}
          </button>
          <button
            className={classNames(
              'px-3 py-1 rounded-lg border',
              showTextLayer
                ? 'border-slate-800 text-slate-200 bg-slate-900'
                : 'border-accent text-accent bg-accent/10',
            )}
            onClick={() => setShowTextLayer((v) => !v)}
            title="Toggle text layer"
          >
            {showTextLayer ? 'Hide text layer' : 'Show text layer'}
          </button>
          <button
            className="px-3 py-1 rounded-lg bg-slate-800 text-slate-100 disabled:opacity-50"
            onClick={() => lastSelection?.text && navigator.clipboard.writeText(lastSelection.text)}
            disabled={!lastSelection}
            title="Copy last selection"
          >
            Copy selection
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="overflow-auto rounded-xl border border-slate-800/60 bg-panel max-h-[75vh] p-4"
        onMouseUp={handleMouseUp}
      >
        <Document
          file={fileUrl}
          onLoadSuccess={({ numPages: pages }) => setNumPages(pages)}
          loading={<Loader />}
          error={<div className="text-red-400 text-sm">Failed to load PDF</div>}
        >
          {continuous ? (
            Array.from({ length: numPages }, (_, idx) => (
              <div key={idx} className="mb-6 last:mb-0 flex justify-center">
                <Page
                  pageNumber={idx + 1}
                  scale={scale}
                  rotate={rotate}
                  renderTextLayer={showTextLayer}
                  renderAnnotationLayer
                  onLoadSuccess={(page) => setPageWidth(page.originalWidth || page.width)}
                  className={classNames('shadow-lg rounded-lg bg-white')}
                />
              </div>
            ))
          ) : (
            <Page
              pageNumber={pageNumber}
              scale={scale}
              rotate={rotate}
              renderTextLayer={showTextLayer}
              renderAnnotationLayer
              onLoadSuccess={(page) => setPageWidth(page.originalWidth || page.width)}
              className={classNames('shadow-lg rounded-lg bg-white', 'mx-auto')}
            />
          )}
        </Document>
      </div>
    </div>
  )
}

function Loader() {
  return (
    <div className="flex items-center justify-center py-12 text-slate-400 text-sm">
      Loading PDF...
    </div>
  )
}

