export interface RSVPFormData {
  nombre: string
  apellido: string
  telefono: string
  asistira: boolean
  tiene_vehiculo: boolean | null
}

export interface RSVPResponse {
  message?: string
  error?: string
}
