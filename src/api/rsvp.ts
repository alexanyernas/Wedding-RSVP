import { supabase } from '@/lib/supabase'
import type { Invitado, RSVPEntry, RSVPResponse } from '@/types/rsvp'

export async function getInvitados(): Promise<Invitado[]> {
  const { data, error } = await supabase
    .from('invitados')
    .select('id, grupo, nombre_completo')
    .order('grupo', { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function isGrupoRegistrado(grupo: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('rsvp')
    .select('id')
    .eq('grupo', grupo)
    .limit(1)

  if (error) throw new Error(error.message)
  return (data?.length ?? 0) > 0
}

export async function submitRSVP(entries: RSVPEntry[]): Promise<RSVPResponse> {
  if (entries.length === 0) {
    throw new Error('No hay personas para registrar')
  }

  const grupo = entries[0].grupo

  if (await isGrupoRegistrado(grupo)) {
    throw new Error('Este grupo ya confirmó su asistencia. Si necesitas modificar algo, contáctanos por WhatsApp.')
  }

  const { error } = await supabase.from('rsvp').insert(entries)

  if (error) throw new Error(error.message)

  return { message: 'RSVP registrado exitosamente' }
}
