import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronsUpDownIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { getInvitados, isGrupoRegistrado, submitRSVP } from '@/api/rsvp'
import type { Invitado, RSVPEntry } from '@/types/rsvp'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

const successVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 200 } },
}

type Asistencia = 'si' | 'no' | null

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return (parts[0][0] ?? '').toUpperCase()
  return ((parts[0][0] ?? '') + (parts[parts.length - 1][0] ?? '')).toUpperCase()
}

function gridColsClass(count: number): string {
  if (count === 1) return 'max-w-xs'
  if (count === 2) return 'grid grid-cols-1 sm:grid-cols-2 gap-3'
  if (count === 3) return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'
  return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'
}

export function RSVPForm() {
  const [invitados, setInvitados] = useState<Invitado[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const [listError, setListError] = useState<string | null>(null)

  const [selectedGrupo, setSelectedGrupo] = useState<string>('')
  const [grupoOpen, setGrupoOpen] = useState(false)
  const [grupoYaRegistrado, setGrupoYaRegistrado] = useState(false)
  const [checkingGrupo, setCheckingGrupo] = useState(false)

  const [asistencias, setAsistencias] = useState<Record<string, Asistencia>>({})
  const [tieneVehiculo, setTieneVehiculo] = useState<boolean | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {
    getInvitados()
      .then((data) => setInvitados(data))
      .catch((err) => setListError(err instanceof Error ? err.message : 'Error cargando lista'))
      .finally(() => setLoadingList(false))
  }, [])

  const grupos = useMemo(() => {
    const set = new Set(invitados.map((i) => i.grupo))
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'es'))
  }, [invitados])

  const personasDelGrupo = useMemo(
    () => invitados.filter((i) => i.grupo === selectedGrupo),
    [invitados, selectedGrupo],
  )

  useEffect(() => {
    setAsistencias({})
    setTieneVehiculo(null)
    setValidationError(null)
    setServerError(null)
    setGrupoYaRegistrado(false)

    if (!selectedGrupo) return

    setCheckingGrupo(true)
    isGrupoRegistrado(selectedGrupo)
      .then((registrado) => setGrupoYaRegistrado(registrado))
      .catch(() => {})
      .finally(() => setCheckingGrupo(false))
  }, [selectedGrupo])

  const cantidadAsistiendo = useMemo(
    () => Object.values(asistencias).filter((v) => v === 'si').length,
    [asistencias],
  )
  const algunoAsiste = cantidadAsistiendo > 0
  const esIndividual = personasDelGrupo.length === 1
  const vehiculoSingular = cantidadAsistiendo === 1

  function setAsistencia(id: string, value: Asistencia) {
    setAsistencias((a) => ({ ...a, [id]: value }))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setValidationError(null)
    setServerError(null)

    if (!selectedGrupo) {
      setValidationError('Selecciona tu invitación')
      return
    }

    const faltaResponder = personasDelGrupo.some((p) => !asistencias[p.id])
    if (faltaResponder) {
      setValidationError(
        esIndividual ? 'Por favor indica si asistirás' : 'Por favor responde por cada persona',
      )
      return
    }

    if (algunoAsiste && tieneVehiculo === null) {
      setValidationError(
        vehiculoSingular ? 'Indica si vendrás en vehículo' : 'Indica si vendrán en vehículo',
      )
      return
    }

    const entries: RSVPEntry[] = personasDelGrupo.map((p) => {
      const asiste = asistencias[p.id] === 'si'
      return {
        grupo: selectedGrupo,
        nombre_completo: p.nombre_completo,
        asistira: asiste,
        tiene_vehiculo: asiste ? tieneVehiculo : null,
      }
    })

    setSubmitting(true)
    submitRSVP(entries)
      .then(() => setSuccess(true))
      .catch((err) => setServerError(err instanceof Error ? err.message : 'Error inesperado'))
      .finally(() => setSubmitting(false))
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
        <p className="text-gray-500 max-w-md">
          {algunoAsiste
            ? vehiculoSingular
              ? '¡Nos alegra mucho que puedas acompañarnos!'
              : '¡Nos alegra mucho que puedan acompañarnos!'
            : esIndividual
              ? 'Gracias por avisarnos. Te tendremos en nuestros corazones.'
              : 'Gracias por avisarnos. Los tendremos en nuestros corazones.'}
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
      className="flex flex-col gap-6"
    >
      {/* Selector de grupo con autocompletado */}
      <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
        <Label htmlFor="grupo" className="font-medium text-sm">
          Selecciona tu invitación
        </Label>
        <Popover open={grupoOpen} onOpenChange={setGrupoOpen}>
          <PopoverTrigger
            render={
              <button
                type="button"
                id="grupo"
                disabled={loadingList}
                aria-expanded={grupoOpen}
                className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-transparent px-4 text-left text-sm outline-none focus:ring-2 focus:ring-[#9a8ad8] disabled:opacity-50"
              >
                <span className={selectedGrupo ? '' : 'text-muted-foreground'}>
                  {loadingList
                    ? 'Cargando…'
                    : selectedGrupo || '— Elige tu nombre o grupo —'}
                </span>
                <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
              </button>
            }
          />
          <PopoverContent
            align="start"
            side="bottom"
            collisionAvoidance={{ side: 'none' }}
            initialFocus={false}
            className="w-[var(--anchor-width)] min-w-[280px] p-0"
          >
            <Command>
              <CommandInput placeholder="Buscar invitación…" />
              <CommandList>
                <CommandEmpty>No se encontró ninguna invitación.</CommandEmpty>
                <CommandGroup>
                  {grupos.map((g) => (
                    <CommandItem
                      key={g}
                      value={g}
                      data-checked={selectedGrupo === g ? 'true' : 'false'}
                      onSelect={(val) => {
                        setSelectedGrupo(val)
                        setGrupoOpen(false)
                      }}
                    >
                      {g}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {listError && <p className="text-xs text-red-500">{listError}</p>}
      </motion.div>

      {/* Estado del grupo / personas */}
      <AnimatePresence mode="wait">
        {selectedGrupo && checkingGrupo && (
          <motion.p
            key="checking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-gray-500"
          >
            Verificando…
          </motion.p>
        )}

        {selectedGrupo && !checkingGrupo && grupoYaRegistrado && (
          <motion.div
            key="ya-registrado"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800"
          >
            Esta invitación ya fue confirmada. Si necesitas modificar algo, contáctanos por WhatsApp.
          </motion.div>
        )}

        {selectedGrupo && !checkingGrupo && !grupoYaRegistrado && (
          <motion.div
            key="personas"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-3">
              <Label className="font-medium text-sm">
                {esIndividual ? '¿Podrás acompañarnos?' : '¿Quiénes podrán acompañarnos?'}
              </Label>
              <div className={gridColsClass(personasDelGrupo.length)}>
                {personasDelGrupo.map((p) => {
                  const valor = asistencias[p.id]
                  const isSi = valor === 'si'
                  const isNo = valor === 'no'
                  return (
                    <div
                      key={p.id}
                      className="flex flex-col items-center gap-3 rounded-xl border p-4 text-center transition-colors"
                      style={{
                        borderColor: valor ? '#9a8ad860' : '#9a8ad825',
                        background: valor ? '#9a8ad810' : '#ffffff',
                      }}
                    >
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold"
                        style={{ background: '#9a8ad820', color: '#731985' }}
                      >
                        {getInitials(p.nombre_completo)}
                      </div>
                      <p className="text-sm font-medium leading-tight text-gray-700 min-h-[2.5rem] flex items-center">
                        {p.nombre_completo}
                      </p>
                      <div className="flex w-full gap-2">
                        <button
                          type="button"
                          onClick={() => setAsistencia(p.id, 'si')}
                          aria-pressed={isSi}
                          className={cn(
                            'flex-1 rounded-md py-2 text-sm font-medium transition-colors',
                            isSi
                              ? 'text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                          )}
                          style={isSi ? { background: '#9a8ad8' } : undefined}
                        >
                          Sí
                        </button>
                        <button
                          type="button"
                          onClick={() => setAsistencia(p.id, 'no')}
                          aria-pressed={isNo}
                          className={cn(
                            'flex-1 rounded-md py-2 text-sm font-medium transition-colors',
                            isNo
                              ? 'bg-gray-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                          )}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <AnimatePresence>
              {algunoAsiste && (
                <motion.div
                  key="vehiculo"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.35, ease: 'easeOut' as const },
                  }}
                  exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                  className="flex flex-col gap-2"
                >
                  <Label className="font-medium text-sm">
                    {vehiculoSingular ? '¿Vendrás en vehículo?' : '¿Vendrán en vehículo?'}
                  </Label>
                  <div className="flex gap-2 max-w-xs">
                    <button
                      type="button"
                      onClick={() => setTieneVehiculo(true)}
                      aria-pressed={tieneVehiculo === true}
                      className={cn(
                        'flex-1 rounded-md py-2.5 text-sm font-medium transition-colors',
                        tieneVehiculo === true
                          ? 'text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                      )}
                      style={tieneVehiculo === true ? { background: '#9a8ad8' } : undefined}
                    >
                      Sí
                    </button>
                    <button
                      type="button"
                      onClick={() => setTieneVehiculo(false)}
                      aria-pressed={tieneVehiculo === false}
                      className={cn(
                        'flex-1 rounded-md py-2.5 text-sm font-medium transition-colors',
                        tieneVehiculo === false
                          ? 'bg-gray-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                      )}
                    >
                      No
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {validationError && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-red-500"
                >
                  {validationError}
                </motion.p>
              )}
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

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-12 text-base font-semibold text-white"
              style={{ background: submitting ? '#9a8ad880' : '#9a8ad8' }}
            >
              {submitting ? 'Enviando…' : 'Enviar respuesta'}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  )
}
