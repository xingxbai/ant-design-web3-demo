import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

function getPages(dir: string, rootDir: string): any[] {
  const files = fs.readdirSync(dir);
  let pages: any[] = [];

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!file.startsWith('_') && file !== 'api') {
        pages = pages.concat(getPages(filePath, rootDir));
      }
    } else if (
      file.endsWith('.tsx') && 
      !file.startsWith('_') && 
      file !== 'index.tsx'
    ) {
      const relativePath = path.relative(rootDir, filePath);
      pages.push({
        name: relativePath.replace('.tsx', '').replace(/\\/g, '/'),
        path: `/${relativePath.replace('.tsx', '').replace(/\\/g, '/')}`,
      });
    }
  });

  return pages;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const pagesDirectory = path.join(process.cwd(), 'pages');
  const pages = getPages(pagesDirectory, pagesDirectory);
  res.status(200).json({ pages });
}