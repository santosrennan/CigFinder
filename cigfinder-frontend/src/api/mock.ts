import placesData from '../fixtures/places.json';
import type { Place, CheckInDTO, StockDTO } from '../types';

// Usando structuredClone para evitar mutações fora de controle
const places = structuredClone(placesData) as Place[];

export async function fetchPlaces(): Promise<Place[]> {
  // imita latência de rede
  return new Promise((res) => setTimeout(() => res(structuredClone(places)), 300));
}

export async function sendCheckIn(dto: CheckInDTO) {
  console.info('mock check-in', dto);
  // Aqui poderíamos mutar open_status ou retornar sucesso
  return { success: true };
}

export async function sendStock(dto: StockDTO) {
  console.info('mock stock', dto);
  return { success: true };
} 