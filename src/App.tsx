import { motion } from 'framer-motion'
import { InfoPanel } from '@/components/InfoPanel'
import { RSVPForm } from '@/components/RSVPForm'

import headerBg from '@/assets/header-bg.webp'
import dressCodeImg from '@/assets/dress-code.webp'
const HEADER_BG = headerBg

export default function App() {
  return (
    <div className="min-h-screen" style={{ background: '#ffffff' }}>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative overflow-hidden py-16 lg:py-28 text-center"
        style={{ backgroundColor: '#3d1054' }}
      >
        {HEADER_BG && (
          <>
            {/* Mobile / tablet: carrusel infinito (2 copias lado a lado) */}
            <div className="absolute inset-0 overflow-hidden lg:hidden">
              <div className="flex h-full header-img-strip" style={{ width: 'max-content' }}>
                <img src={HEADER_BG} alt="" style={{ height: '100%', width: 'auto', flexShrink: 0 }} />
                <img src={HEADER_BG} alt="" style={{ height: '100%', width: 'auto', flexShrink: 0 }} />
              </div>
            </div>

            {/* Desktop: imagen estática */}
            <div
              className="absolute inset-0 hidden lg:block"
              style={{
                backgroundImage: `url(${HEADER_BG})`,
                backgroundSize: 'cover',
                backgroundPosition: 'top center',
              }}
            />
          </>
        )}

        {/* Overlay morado oscuro */}
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(115,25,133,0.88)' }}
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

          {/* Columna derecha — Código de vestimenta */}
          <div className="overflow-hidden rounded-2xl lg:-mt-10">
            <img
              src={dressCodeImg}
              alt="Código de vestimenta"
              className="block h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Fila inferior — Formulario */}
        <div className="mt-12">
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
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-gray-400">
        <span style={{ color: '#cb9b25' }}>🦄</span> Hecho con amor{' '}
        <span style={{ color: '#cb9b25' }}>☕️</span>
      </footer>
    </div>
  )
}
