import * as fs from 'fs';
import * as path from 'path';
import { NextResponse } from 'next/server';

export async function POST(req: Request): Promise<NextResponse> {
  const { url, body } = await req.json();
  console.log(url);
  const parsedUrl = new URL(url);
  console.log(parsedUrl);
  const dirPath = path.join(parsedUrl.host, parsedUrl.port, ...parsedUrl.pathname.split('/'), parsedUrl.search, parsedUrl.hash);
  console.log(dirPath);
  fs.mkdirSync(path.join('index', dirPath), { recursive: true });
  fs.writeFileSync(path.join('index', dirPath, 'index.html'), body);
  return NextResponse.json({ message: 'Hello WebSave!' });
}

