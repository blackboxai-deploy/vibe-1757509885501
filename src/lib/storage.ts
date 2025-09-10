import { ArxivPaper } from '@/types/paper';
import { promises as fs } from 'fs';
import path from 'path';

const STORAGE_DIR = path.join(process.cwd(), 'data', 'papers');

export async function ensureStorageDir(): Promise<void> {
  try {
    await fs.access(STORAGE_DIR);
  } catch {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
  }
}

export async function storePaper(paper: ArxivPaper): Promise<string> {
  await ensureStorageDir();
  
  const filename = `${paper.id}.json`;
  const filepath = path.join(STORAGE_DIR, filename);
  
  try {
    await fs.writeFile(filepath, JSON.stringify(paper, null, 2), 'utf8');
    return paper.id;
  } catch (error) {
    console.error('Error storing paper:', error);
    throw new Error('Failed to store paper');
  }
}

export async function getPaper(paperId: string): Promise<ArxivPaper | null> {
  await ensureStorageDir();
  
  const filename = `${paperId}.json`;
  const filepath = path.join(STORAGE_DIR, filename);
  
  try {
    const content = await fs.readFile(filepath, 'utf8');
    return JSON.parse(content) as ArxivPaper;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    console.error('Error reading paper:', error);
    throw new Error('Failed to read paper');
  }
}

export async function listPapers(): Promise<string[]> {
  await ensureStorageDir();
  
  try {
    const files = await fs.readdir(STORAGE_DIR);
    return files
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
  } catch (error) {
    console.error('Error listing papers:', error);
    return [];
  }
}