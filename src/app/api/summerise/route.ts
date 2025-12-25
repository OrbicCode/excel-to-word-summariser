import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  console.log(formData);
  return NextResponse.json({ message: 'hello', formData: formData });
}
