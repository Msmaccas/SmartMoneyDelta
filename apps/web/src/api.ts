import axios from 'axios';
import { DivergenceCase } from '@smd/core';

export async function fetchBoard(): Promise<DivergenceCase[]> {
  const res = await axios.get<DivergenceCase[]>('/api/board');
  return res.data;
}

export async function fetchCase(id: string): Promise<DivergenceCase> {
  const res = await axios.get<DivergenceCase>(`/api/case/${encodeURIComponent(id)}`);
  return res.data;
}