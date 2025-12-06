import type { SelectionData } from '../../types'

export function extractSelectedText(): SelectionData | null {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return null

  const text = selection.toString().trim()
  if (!text) return null

  const range = selection.getRangeAt(0)
  const rect = range.getBoundingClientRect()

  return { text, rect }
}

