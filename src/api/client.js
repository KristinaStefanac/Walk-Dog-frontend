import { stubApi } from './stubs.js'
import { httpApi } from './http.js'


export const useStubs = String(import.meta.env.VITE_USE_STUBS).toLowerCase() === 'true'

export const api = useStubs ? stubApi : httpApi
