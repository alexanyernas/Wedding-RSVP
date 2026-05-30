import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { nombre, apellido, telefono, asistira } = req.body

  if (!nombre || !apellido || !telefono || asistira === undefined) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' })
  }

  const { error } = await supabase
    .from('rsvp')
    .insert([{ nombre, apellido, telefono, asistira }])

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  return res.status(201).json({ message: 'RSVP registrado exitosamente' })
}
