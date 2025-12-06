import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      app: {
        title: 'PDF Translation',
        subtitle: 'Instant, local-first translations',
        privacy: 'PDFs stay in-browser. Only the selected snippet is sent to your chosen provider.',
      },
      upload: {
        drop: 'Drop a PDF or click to upload',
        local: 'Files stay local to your browser',
        button: 'Choose PDF',
      },
      settings: {
        provider: 'Provider',
        switchHint: 'Switch between available backends',
        languages: 'Languages',
        source: 'Source',
        target: 'Target',
        providerSettings: 'Provider Settings',
        credsNote:
          'Credentials stay in localStorage and are never sent anywhere except to the chosen provider.',
        uiLanguage: 'UI language',
      },
      viewer: {
        prev: 'Prev',
        next: 'Next',
        page: 'Page',
        zoomOut: 'Zoom out',
        zoomIn: 'Zoom in',
        resetZoom: 'Reset zoom',
        zoom125: 'Zoom 125%',
        zoom150: 'Zoom 150%',
        rotate: 'Rotate 90°',
        fitWidth: 'Fit width',
        singlePage: 'Single page',
        continuous: 'Continuous',
        toggleTextLayer: 'Toggle text layer',
        showTextLayer: 'Show text layer',
        hideTextLayer: 'Hide text layer',
        copySelection: 'Copy selection',
        loading: 'Loading PDF...',
        loadFailed: 'Failed to load PDF',
        empty: 'Load a PDF to begin',
      },
      translation: {
        title: 'Translation',
        selectPrompt: 'Select text to translate',
        cached: 'cached',
        clear: 'Clear',
        noTranslation: 'No translation yet.',
        copy: 'Copy',
        translating: 'Translating...',
        error: 'Error',
      },
    },
  },
  es: {
    translation: {
      app: {
        title: 'Traducción de PDF',
        subtitle: 'Traducciones instantáneas y locales',
        privacy:
          'Los PDF permanecen en el navegador. Solo se envía el fragmento seleccionado al proveedor elegido.',
      },
      upload: {
        drop: 'Suelta un PDF o haz clic para subirlo',
        local: 'Los archivos permanecen locales en tu navegador',
        button: 'Elegir PDF',
      },
      settings: {
        provider: 'Proveedor',
        switchHint: 'Cambia entre backends disponibles',
        languages: 'Idiomas',
        source: 'Origen',
        target: 'Destino',
        providerSettings: 'Configuración del proveedor',
        credsNote:
          'Las credenciales se guardan en localStorage y solo se envían al proveedor elegido.',
        uiLanguage: 'Idioma de la interfaz',
      },
      viewer: {
        prev: 'Anterior',
        next: 'Siguiente',
        page: 'Página',
        zoomOut: 'Alejar',
        zoomIn: 'Acercar',
        resetZoom: 'Restablecer zoom',
        zoom125: 'Zoom 125%',
        zoom150: 'Zoom 150%',
        rotate: 'Rotar 90°',
        fitWidth: 'Ajustar al ancho',
        singlePage: 'Página única',
        continuous: 'Continuo',
        toggleTextLayer: 'Alternar capa de texto',
        showTextLayer: 'Mostrar capa de texto',
        hideTextLayer: 'Ocultar capa de texto',
        copySelection: 'Copiar selección',
        loading: 'Cargando PDF...',
        loadFailed: 'Error al cargar el PDF',
        empty: 'Carga un PDF para comenzar',
      },
      translation: {
        title: 'Traducción',
        selectPrompt: 'Selecciona texto para traducir',
        cached: 'en caché',
        clear: 'Limpiar',
        noTranslation: 'Aún no hay traducción.',
        copy: 'Copiar',
        translating: 'Traduciendo...',
        error: 'Error',
      },
    },
  },
  fr: {
    translation: {
      app: {
        title: 'Traduction PDF',
        subtitle: 'Traductions instantanées et locales',
        privacy:
          "Les PDF restent dans le navigateur. Seul l'extrait sélectionné est envoyé au fournisseur choisi.",
      },
      upload: {
        drop: 'Déposez un PDF ou cliquez pour importer',
        local: 'Les fichiers restent locaux dans votre navigateur',
        button: 'Choisir un PDF',
      },
      settings: {
        provider: 'Fournisseur',
        switchHint: 'Basculez entre les backends disponibles',
        languages: 'Langues',
        source: 'Source',
        target: 'Cible',
        providerSettings: 'Paramètres du fournisseur',
        credsNote:
          'Les identifiants restent dans le localStorage et ne sont envoyés qu’au fournisseur choisi.',
        uiLanguage: 'Langue de l’interface',
      },
      viewer: {
        prev: 'Précédent',
        next: 'Suivant',
        page: 'Page',
        zoomOut: 'Dézoomer',
        zoomIn: 'Zoomer',
        resetZoom: 'Réinitialiser le zoom',
        zoom125: 'Zoom 125%',
        zoom150: 'Zoom 150%',
        rotate: 'Pivoter 90°',
        fitWidth: 'Adapter à la largeur',
        singlePage: 'Page unique',
        continuous: 'Continu',
        toggleTextLayer: 'Basculer la couche texte',
        showTextLayer: 'Afficher la couche texte',
        hideTextLayer: 'Masquer la couche texte',
        copySelection: 'Copier la sélection',
        loading: 'Chargement du PDF...',
        loadFailed: 'Échec du chargement du PDF',
        empty: 'Chargez un PDF pour commencer',
      },
      translation: {
        title: 'Traduction',
        selectPrompt: 'Sélectionnez du texte à traduire',
        cached: 'en cache',
        clear: 'Effacer',
        noTranslation: 'Pas encore de traduction.',
        copy: 'Copier',
        translating: 'Traduction...',
        error: 'Erreur',
      },
    },
  },
}

void i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n

