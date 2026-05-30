import { supabase } from '@/lib/supabase'
import type { RSVPFormData, RSVPResponse } from '@/types/rsvp'

export async function submitRSVP(data: RSVPFormData): Promise<RSVPResponse> {
  const { error } = await supabase
    .from('rsvp')
    .insert([data])

  if (error) {
    throw new Error(error.message)
  }

  return { message: 'RSVP registrado exitosamente' }
}
