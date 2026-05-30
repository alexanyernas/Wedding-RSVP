import { motion } from 'framer-motion'

const CALENDAR_URL =
  'https://calendar.google.com/calendar/render?action=TEMPLATE' +
  '&text=Boda%3A+Alejandra+y+Alexanyer' +
  '&dates=20261010T190000%2F20261010T230000' +
  '&location=Parroquia+San+Antonio+de+Padua%2C+San+Antonio+de+Los+Altos'

const sections = [
  {
    icon: '📍',
    title: 'Ubicación de la Iglesia',
    content: 'Parroquia San Antonio de Padua',
    action: { label: 'Ubicación', url: 'https://maps.app.goo.gl/YRVqTELPNGVQjxAA8' },
  },
  {
    icon: '🕐',
    title: 'Hora de la Ceremonia',
    content: '7:00 p.m.',
    action: { label: 'Agendar', url: CALENDAR_URL },
  },
  {
    icon: '🎉',
    title: 'Recepción',
    content: 'Quinta Pedregal, San Antonio de Los Altos',
    action: { label: 'Ubicación', url: 'https://maps.app.goo.gl/xsQDaL9aiBvTy85d7' },
  },
  {
    icon: '📞',
    title: 'Contacto',
    content: '0412-028-3147',
    action: { label: 'WhatsApp', url: 'https://wa.me/584120283147' },
  },
]

const containerVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: 'easeOut' as const, staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

export function InfoPanel() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6"
    >
      <motion.div variants={itemVariants}>
        <p className="text-sm font-medium tracking-widest uppercase" style={{ color: '#cb9b25' }}>
          10 de Octubre de 2026
        </p>
        <div
          className="mt-3 h-px w-full opacity-30"
          style={{ background: 'linear-gradient(to right, #cb9b25, transparent)' }}
        />
      </motion.div>

      {sections.map((section) => (
        <motion.div
          key={section.title}
          variants={itemVariants}
          className="flex items-center gap-4 rounded-xl border p-4"
          style={{ borderColor: '#9a8ad840', background: '#9a8ad808' }}
        >
          <span className="text-2xl shrink-0">{section.icon}</span>
          <div className="flex-1">
            <h3 className="font-semibold text-sm" style={{ color: '#731985' }}>
              {section.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{section.content}</p>
          </div>
          <a
            href={section.action.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-lg border border-[#cb9b25] text-[#cb9b25] px-3 py-1.5 text-xs font-medium transition-colors hover:bg-[#cb9b25] hover:text-white"
          >
            {section.action.label}
          </a>
        </motion.div>
      ))}
    </motion.div>
  )
}
