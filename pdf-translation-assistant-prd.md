# Product Requirements Document
## PDF Translation Assistant

### Overview
A lightweight web application that enables users to translate selected text from PDF documents in real-time using configurable AI translation models. Users can highlight any text passage and instantly see translations in a contextual modal.

**Key Privacy Feature**: All PDF processing happens entirely in the browser. PDF files never leave the user's device—only selected text snippets are sent to translation APIs.

---

### Goals
1. **Primary**: Provide frictionless PDF reading experience with instant, contextual translations
2. **Secondary**: Support multiple translation providers (OpenAI, local models, open-source APIs) with zero vendor lock-in
3. **Tertiary**: Create extensible foundation for future features (annotations, multi-language support, history)

### Success Metrics
- Time from text selection to translation display < 2 seconds
- Support for 3+ translation providers at launch
- Zero-config experience for common use cases (default provider ready to use)

---

### User Stories

**Core Flow**
1. User uploads/opens a PDF file
2. User highlights text in the PDF viewer
3. Translation appears in a modal positioned near the selection
4. User can dismiss modal or make a new selection

**Configuration**
1. User can switch between translation providers (OpenAI, Anthropic, local models, etc.)
2. User can configure API keys/endpoints per provider
3. User can select source/target languages
4. User can adjust translation settings (formality, context length)

---

### Functional Requirements

#### PDF Viewer (P0)
- [ ] Render PDF files with high fidelity using 100% client-side processing
- [ ] Process PDFs entirely in browser memory (no server upload)
- [ ] Support text selection across single and multiple lines
- [ ] Handle multi-column layouts correctly
- [ ] Display page numbers and basic navigation (prev/next, jump to page)
- [ ] Support zoom in/out
- [ ] Support file upload (drag-drop + file picker)
- [ ] Handle files up to 200MB smoothly (soft limit based on browser capabilities)

#### Translation Engine (P0)
- [ ] Detect text selection events
- [ ] Extract selected text preserving formatting context
- [ ] Send text to configured translation provider
- [ ] Display loading state during API call
- [ ] Handle errors gracefully (API failures, rate limits, invalid keys)
- [ ] Cache translations to avoid redundant API calls

#### Translation Modal (P0)
- [ ] Position modal adjacent to selected text (smart positioning to avoid viewport edges)
- [ ] Display translated text with clear typography
- [ ] Show source/target languages
- [ ] Include copy-to-clipboard button
- [ ] Dismiss on: outside click, ESC key, or new selection
- [ ] Loading spinner during translation

#### Provider Management (P0)
- [ ] Abstract API interface supporting multiple providers
- [ ] Built-in support for:
  - OpenAI API
  - Anthropic API
  - Local models (Ollama, LM Studio)
  - LibreTranslate (open-source/self-hosted)
- [ ] Provider-agnostic configuration UI
- [ ] Validate API keys before saving
- [ ] Store credentials securely (browser localStorage with encryption option)

#### Settings (P1)
- [ ] Language pair selection (source → target)
- [ ] Auto-detect source language option
- [ ] Default provider selection
- [ ] Translation quality/speed preferences (model selection per provider)
- [ ] Modal appearance customization (size, position preference)

---

### Technical Requirements

#### Tech Stack
- **Frontend**: React 18+ with TypeScript
- **Build Tool**: Vite
- **PDF Rendering**: `react-pdf` (based on PDF.js)
- **State Management**: Zustand or React Context (lightweight, no overkill)
- **Styling**: Tailwind CSS (rapid UI development)
- **HTTP Client**: Axios or Fetch API

#### Architecture

```
src/
├── components/
│   ├── PDFViewer/          # PDF rendering + selection handling
│   ├── TranslationModal/   # Modal UI component
│   ├── Settings/           # Configuration panel
│   └── FileUpload/         # Drag-drop + picker
├── services/
│   ├── translation/
│   │   ├── providers/      # Provider implementations
│   │   │   ├── openai.ts
│   │   │   ├── anthropic.ts
│   │   │   ├── ollama.ts
│   │   │   └── libretranslate.ts
│   │   ├── TranslationService.ts  # Abstract interface
│   │   └── cache.ts        # Translation cache layer
│   └── pdf/
│       └── textExtraction.ts
├── stores/
│   ├── settingsStore.ts
│   └── translationStore.ts
└── types/
    └── index.ts
```

#### Client-Side PDF Processing
- **File Handling**: Uses browser File API to load PDFs directly into memory
- **No Server Upload**: PDF files remain on user's device at all times
- **Rendering**: PDF.js (via react-pdf) renders PDFs entirely client-side
- **Data Transmission**: Only selected text snippets (<1KB typically) sent to translation APIs
- **File Size Support**:
  - **Optimal**: < 50MB (instant rendering, smooth experience)
  - **Supported**: 50-200MB (works well, slight performance degradation)
  - **Large Files**: 200MB+ (functional but may impact browser performance)
  - **Practical Limit**: ~2GB (browser memory constraints)

#### Provider Interface
Each provider implements:
```typescript
interface TranslationProvider {
  name: string;
  translate(text: string, sourceLang: string, targetLang: string): Promise<string>;
  validateConfig(config: ProviderConfig): Promise<boolean>;
  getSupportedLanguages(): Language[];
}
```

---

### Non-Functional Requirements

**Performance**
- PDF rendering for 100-page document < 3 seconds (files < 50MB)
- UI remains responsive during translation (non-blocking)
- Bundle size < 500KB (excluding PDF.js which loads separately)
- Graceful performance degradation for large files:
  - Display loading indicators for files > 100MB
  - Implement lazy page rendering for documents > 500 pages
  - Show file size warnings for files > 200MB

**Accessibility**
- Keyboard navigation support (tab through controls)
- ARIA labels for screen readers
- High contrast mode support

**Security & Privacy**
- **PDF files never uploaded**: All PDF processing happens in-browser using File API + PDF.js
- **No server dependency**: Application can run entirely offline (with local translation models)
- **Minimal data transmission**: Only selected text snippets sent to translation APIs
- API keys stored client-side only (never sent to third-party servers except configured providers)
- Option to use environment variables for keys (avoid hardcoding)
- HTTPS-only API communication
- Clear privacy disclosure: "Your PDF never leaves your device"

**UX**
- Zero-state onboarding (guide user through first PDF + provider setup)
- Clear error messages with actionable solutions
- Optimistic UI updates where possible

---

### Out of Scope (V1)

- OCR for scanned PDFs (text must be selectable)
- PDF editing/annotation persistence
- Multi-user collaboration
- Mobile app (web-responsive is sufficient)
- Browser extension version
- Translation history across sessions
- Dictionary/glossary features
- Audio pronunciation

---

### Open Questions

1. **Default Provider Strategy**: Should we bundle a free/local provider (like LibreTranslate) as default, or require users to configure their own?
   - **Recommendation**: Include Ollama auto-detection + fallback to LibreTranslate public instance with rate limits

2. **File Handling**: Support only uploaded files, or also URL-based PDFs?
   - **Recommendation**: V1 uploads only, V2 add URL support

3. **Language Auto-Detection**: Rely on provider auto-detect or implement client-side detection?
   - **Recommendation**: Use provider auto-detect where available, fallback to `franc` library

4. **Offline Mode**: Should translations work offline with local models?
   - **Recommendation**: Yes, Ollama integration enables this

---

### Implementation Phases

**Phase 1 (MVP)**: Core PDF + Single Provider
- PDF viewer with text selection
- Translation modal
- OpenAI integration only
- Basic settings

**Phase 2**: Multi-Provider Support
- Provider abstraction layer
- Add Anthropic, Ollama, LibreTranslate
- Enhanced settings UI

**Phase 3**: Polish & Performance
- Translation caching
- Keyboard shortcuts
- Accessibility improvements
- Optimized rendering for large PDFs

---

**Estimated Effort**: 2-3 weeks for Phase 1 (single developer)
