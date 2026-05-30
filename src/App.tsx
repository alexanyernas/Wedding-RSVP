import { motion } from 'framer-motion'
import { InfoPanel } from '@/components/InfoPanel'
import { RSVPForm } from '@/components/RSVPForm'

// Cuando tengas la imagen, reemplaza esta línea por: import headerBg from '@/assets/header-bg.jpg'
const HEADER_BG = null

export default function App() {
  return (
    <div className="min-h-screen" style={{ background: '#ffffff' }}>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative overflow-hidden py-16 text-center"
        style={{
          backgroundImage: HEADER_BG ? `url(${HEADER_BG})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          // Placeholder: se quita cuando haya imagen real
          backgroundColor: '#3d1054',
        }}
      >
        {/* Overlay oscuro sobre la imagen */}
        <div
          className="absolute inset-0"
          style={{
            background: HEADER_BG
              ? 'linear-gradient(135deg, rgba(115,25,133,0.72) 0%, rgba(154,138,216,0.55) 100%)'
              : 'linear-gradient(135deg, rgba(115,25,133,0.5) 0%, rgba(154,138,216,0.35) 100%)',
          }}
        />

        {/* Logo — absoluto en desktop, en flujo en móvil */}
        <div className="hidden lg:block absolute top-5 left-8 z-10">
          <img
            src="/logo.svg"
            alt="Logo de los novios"
            className="h-14 w-auto"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </div>

        <div className="relative z-10 px-4 flex flex-col items-center gap-4">
          {/* Logo centrado solo en móvil y tableta */}
          <img
            src="/logo.svg"
            alt="Logo de los novios"
            className="lg:hidden h-16 w-auto"
            style={{ filter: 'brightness(0) invert(1)' }}
          />

          <p className="text-xs font-medium tracking-[0.3em] uppercase text-white/70">
            Confirmación de Asistencia
          </p>
          <img
            src="/nombres.svg"
            alt="Alejandra y Alexanyer"
            className="h-16 w-auto max-w-[360px] lg:h-24 lg:max-w-lg"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
          <div
            className="h-px w-24 opacity-50"
            style={{ background: '#cb9b25' }}
          />
          <p className="text-sm font-light text-white/80">
            Los esperamos en nuestra boda
          </p>
        </div>
      </motion.header>

      {/* Main layout */}
      <main className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-12 md:grid-cols-2">
          {/* Columna izquierda — Información */}
          <div>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6 text-lg font-semibold"
              style={{ color: '#731985' }}
            >
              Detalles del Evento
            </motion.h2>
            <InfoPanel />
          </div>

          {/* Columna derecha — Formulario */}
          <div>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6 text-lg font-semibold"
              style={{ color: '#731985' }}
            >
              Confirma tu Asistencia
            </motion.h2>
            <div
              className="rounded-2xl border p-6 shadow-sm"
              style={{ borderColor: '#9a8ad830', background: '#ffffff' }}
            >
              <RSVPForm />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-gray-400">
        <span style={{ color: '#cb9b25' }}>🦄</span> Hecho con amor{' '}
        <span style={{ color: '#cb9b25' }}>☕️</span>
      </footer>
    </div>
  )
}
