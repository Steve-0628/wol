import { NextResponse } from 'next/server';
import wol from 'wake_on_lan';

export async function POST(req: Request): Promise<NextResponse> {
  const { mac } = await req.json();
  wol.wake(mac);
  return NextResponse.json({ message: 'Hello WoL!' });
}

