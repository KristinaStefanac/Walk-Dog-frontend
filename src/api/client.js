import { stubApi } from './stubs.js'

export const useStubs = String(import.meta.env.VITE_USE_STUBS).toLowerCase() === 'true'

export const api = stubApi