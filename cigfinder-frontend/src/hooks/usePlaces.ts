import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPlaces, sendCheckIn } from '../api/mock';
import type { CheckInDTO } from '../types';

export function usePlaces() {
  return useQuery({ queryKey: ['places'], queryFn: fetchPlaces });
}

export function useCheckIn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CheckInDTO) => sendCheckIn(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['places'] }),
  });
} 