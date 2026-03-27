import SHA256 from 'crypto-js/sha256';

export interface BlockData {
  company: string;
  ngo: string;
  amount: number;
  project_id: string;
  invoice_hash: string;
  type: 'deposit' | 'invoice';
  status: 'Verified' | 'Pending' | 'Flagged';
  sector?: string;
}

export interface Block {
  index: number;
  timestamp: string;
  data: BlockData;
  previous_hash: string;
  current_hash: string;
}

const STORAGE_KEY = 'vikas_track_blockchain';

function hashBlock(index: number, timestamp: string, data: BlockData, previous_hash: string): string {
  return SHA256(index + timestamp + JSON.stringify(data) + previous_hash).toString();
}

function createGenesisBlock(): Block {
  const timestamp = new Date('2026-01-01T00:00:00Z').toISOString();
  const data: BlockData = {
    company: 'SYSTEM',
    ngo: 'GENESIS',
    amount: 0,
    project_id: 'GEN-000',
    invoice_hash: '0',
    type: 'deposit',
    status: 'Verified',
    sector: 'System',
  };
  const hash = hashBlock(0, timestamp, data, '0');
  return { index: 0, timestamp, data, previous_hash: '0', current_hash: hash };
}

export function getChain(): Block[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch { /* fall through */ }
  }
  const genesis = [createGenesisBlock()];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(genesis));
  return genesis;
}

function saveChain(chain: Block[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chain));
}

export function addBlock(data: BlockData): Block {
  const chain = getChain();
  const prev = chain[chain.length - 1];
  const index = prev.index + 1;
  const timestamp = new Date().toISOString();
  const current_hash = hashBlock(index, timestamp, data, prev.current_hash);
  const block: Block = { index, timestamp, data, previous_hash: prev.current_hash, current_hash };
  chain.push(block);
  saveChain(chain);
  return block;
}

export function getStats() {
  const chain = getChain().filter(b => b.index > 0);
  const totalFunds = chain.reduce((s, b) => s + b.data.amount, 0);
  const companies = new Set(chain.map(b => b.data.company));
  const ngos = new Set(chain.map(b => b.data.ngo));
  const verified = chain.filter(b => b.data.status === 'Verified').length;
  return {
    totalBlocks: chain.length,
    totalFunds,
    totalCompanies: companies.size,
    totalNGOs: ngos.size,
    verifiedCount: verified,
    pendingCount: chain.filter(b => b.data.status === 'Pending').length,
    flaggedCount: chain.filter(b => b.data.status === 'Flagged').length,
  };
}

export async function hashFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const wordArray = SHA256(arrayBufferToWordArray(buffer));
  return wordArray.toString();
}

function arrayBufferToWordArray(ab: ArrayBuffer) {
  const i8a = new Uint8Array(ab);
  const a: number[] = [];
  for (let i = 0; i < i8a.length; i += 4) {
    a.push((i8a[i] << 24) | (i8a[i + 1] << 16) | (i8a[i + 2] << 8) | i8a[i + 3]);
  }
  return { words: a, sigBytes: i8a.length } as any;
}

// Seed mock data if chain only has genesis
export function seedMockData() {
  const chain = getChain();
  if (chain.length > 1) return;
  const mocks: BlockData[] = [
    { company: 'Mahindra & Mahindra', ngo: 'Nashik Seva Foundation', amount: 500000, project_id: 'PRJ-001', invoice_hash: '', type: 'deposit', status: 'Verified', sector: 'Education' },
    { company: 'Mahindra & Mahindra', ngo: 'Nashik Seva Foundation', amount: 500000, project_id: 'PRJ-001', invoice_hash: 'a3f2b8...c9d1e7', type: 'invoice', status: 'Verified', sector: 'Education' },
    { company: 'Crompton Greaves', ngo: 'Green Earth Nashik', amount: 300000, project_id: 'PRJ-002', invoice_hash: '', type: 'deposit', status: 'Verified', sector: 'Environment' },
    { company: 'Crompton Greaves', ngo: 'Green Earth Nashik', amount: 300000, project_id: 'PRJ-002', invoice_hash: 'b7e4d2...f8a3c1', type: 'invoice', status: 'Pending', sector: 'Environment' },
    { company: 'Kirloskar Oil Engines', ngo: 'Swasthya Health Trust', amount: 750000, project_id: 'PRJ-003', invoice_hash: '', type: 'deposit', status: 'Verified', sector: 'Healthcare' },
    { company: 'Kirloskar Oil Engines', ngo: 'Swasthya Health Trust', amount: 750000, project_id: 'PRJ-003', invoice_hash: 'c1d9f3...e5b2a8', type: 'invoice', status: 'Verified', sector: 'Healthcare' },
    { company: 'Samsonite South Asia', ngo: 'Nashik Digital Literacy', amount: 200000, project_id: 'PRJ-004', invoice_hash: '', type: 'deposit', status: 'Verified', sector: 'Digital Literacy' },
    { company: 'Atlas Copco India', ngo: 'Rural Water Mission', amount: 450000, project_id: 'PRJ-005', invoice_hash: '', type: 'deposit', status: 'Verified', sector: 'Water & Sanitation' },
    { company: 'Atlas Copco India', ngo: 'Rural Water Mission', amount: 450000, project_id: 'PRJ-005', invoice_hash: 'd4f7a1...b9c6e3', type: 'invoice', status: 'Flagged', sector: 'Water & Sanitation' },
    { company: 'Glaxosmithkline', ngo: 'Swasthya Health Trust', amount: 600000, project_id: 'PRJ-006', invoice_hash: '', type: 'deposit', status: 'Verified', sector: 'Healthcare' },
  ];
  mocks.forEach(d => addBlock(d));
}
