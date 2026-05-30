import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { submitRSVP } from '@/api/rsvp'
import type { RSVPFormData } from '@/types/rsvp'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

const successVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 200 },
  },
}

interface FormErrors {
  nombre?: string
  apellido?: string
  telefono?: string
  asistira?: string
  tiene_vehiculo?: string
}

export function RSVPForm() {
  const [form, setForm] = useState<Partial<RSVPFormData>>({})
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  function handleAsistiraChange(val: string) {
    const asistira = val === 'si'
    setForm((f) => ({
      ...f,
      asistira,
      tiene_vehiculo: asistira ? f.tiene_vehiculo : undefined,
    }))
    if (!asistira) {
      setErrors((e) => ({ ...e, asistira: undefined, tiene_vehiculo: undefined }))
    }
  }

  function validate(): boolean {
    const newErrors: FormErrors = {}

    if (!form.nombre || form.nombre.trim().length < 2)
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres'

    if (!form.apellido || form.apellido.trim().length < 2)
      newErrors.apellido = 'El apellido debe tener al menos 2 caracteres'

    if (!form.telefono || !/^\+?[\d\s\-()]{7,}$/.test(form.telefono.trim()))
      newErrors.telefono = 'Ingresa un número de teléfono válido'

    if (form.asistira === undefined)
      newErrors.asistira = 'Por favor selecciona si asistirás'

    if (form.asistira === true && form.tiene_vehiculo === undefined)
      newErrors.tiene_vehiculo = 'Por favor selecciona una opción'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setServerError(null)

    try {
      await submitRSVP(form as RSVPFormData)
      setSuccess(true)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <motion.div
        variants={successVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center justify-center gap-4 py-12 text-center"
      >
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full text-4xl"
          style={{ background: '#9a8ad820' }}
        >
          💍
        </div>
        <h3 className="text-2xl font-semibold" style={{ color: '#731985' }}>
          ¡Confirmación recibida!
        </h3>
        <p className="text-gray-500 max-w-xs">
          {form.asistira
            ? `¡Nos alegra mucho que puedas acompañarnos, ${form.nombre}!`
            : `Gracias por avisarnos, ${form.nombre}. Te tendremos en nuestros corazones.`}
        </p>
        <div className="mt-2 h-px w-24 opacity-60" style={{ background: '#cb9b25' }} />
      </motion.div>
    )
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-5"
    >
      <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
        <Label htmlFor="nombre" className="font-medium text-sm">Nombre</Label>
        <Input
          id="nombre"
          placeholder="María"
          value={form.nombre ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
          className={`h-12 text-base px-4 ${errors.nombre ? 'border-red-400' : ''}`}
        />
        {errors.nombre && <p className="text-xs text-red-500">{errors.nombre}</p>}
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
        <Label htmlFor="apellido" className="font-medium text-sm">Apellido</Label>
        <Input
          id="apellido"
          placeholder="García"
          value={form.apellido ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, apellido: e.target.value }))}
          className={`h-12 text-base px-4 ${errors.apellido ? 'border-red-400' : ''}`}
        />
        {errors.apellido && <p className="text-xs text-red-500">{errors.apellido}</p>}
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
        <Label htmlFor="telefono" className="font-medium text-sm">Teléfono</Label>
        <Input
          id="telefono"
          type="tel"
          placeholder="0412-000-0000"
          value={form.telefono ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
          className={`h-12 text-base px-4 ${errors.telefono ? 'border-red-400' : ''}`}
        />
        {errors.telefono && <p className="text-xs text-red-500">{errors.telefono}</p>}
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col gap-2">
        <Label className="font-medium text-sm">¿Asistirás?</Label>
        <RadioGroup
          value={form.asistira === undefined ? '' : form.asistira ? 'si' : 'no'}
          onValueChange={handleAsistiraChange}
          className="flex gap-6"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="si" id="asistira-si" />
            <Label htmlFor="asistira-si" className="cursor-pointer font-normal">
              Sí, asistiré
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="no" id="asistira-no" />
            <Label htmlFor="asistira-no" className="cursor-pointer font-normal">
              No podré asistir
            </Label>
          </div>
        </RadioGroup>
        {errors.asistira && <p className="text-xs text-red-500">{errors.asistira}</p>}
      </motion.div>

      <AnimatePresence>
        {form.asistira === true && (
          <motion.div
            key="vehiculo"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
            className="flex flex-col gap-2"
          >
            <Label className="font-medium text-sm">¿Asistirás en vehículo?</Label>
            <RadioGroup
              value={form.tiene_vehiculo === undefined ? '' : form.tiene_vehiculo ? 'si' : 'no'}
              onValueChange={(val: string) =>
                setForm((f) => ({ ...f, tiene_vehiculo: val === 'si' }))
              }
              className="flex gap-6"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="si" id="vehiculo-si" />
                <Label htmlFor="vehiculo-si" className="cursor-pointer font-normal">Sí</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="no" id="vehiculo-no" />
                <Label htmlFor="vehiculo-no" className="cursor-pointer font-normal">No</Label>
              </div>
            </RadioGroup>
            {errors.tiene_vehiculo && <p className="text-xs text-red-500">{errors.tiene_vehiculo}</p>}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {serverError && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            {serverError}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants}>
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 text-base font-semibold text-white"
          style={{ background: loading ? '#9a8ad880' : '#9a8ad8' }}
        >
          {loading ? 'Enviando...' : 'Enviar respuesta'}
        </Button>
      </motion.div>
    </motion.form>
  )
}
