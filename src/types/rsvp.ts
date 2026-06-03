export interface Invitado {
  id: string
  grupo: string
  nombre_completo: string
}

export interface RSVPEntry {
  grupo: string
  nombre_completo: string
  asistira: boolean
  tiene_vehiculo: boolean | null
}

export interface RSVPResponse {
  message?: string
  error?: string
}
