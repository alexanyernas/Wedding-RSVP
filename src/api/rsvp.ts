import { supabase } from '@/lib/supabase'
import type { RSVPFormData, RSVPResponse } from '@/types/rsvp'

export async function submitRSVP(data: RSVPFormData): Promise<RSVPResponse> {
  const payload = {
    ...data,
    tiene_vehiculo: data.asistira ? data.tiene_vehiculo : null,
  }

  const { error } = await supabase
    .from('rsvp')
    .insert([payload])

  if (error) {
    throw new Error(error.message)
  }

  return { message: 'RSVP registrado exitosamente' }
}
