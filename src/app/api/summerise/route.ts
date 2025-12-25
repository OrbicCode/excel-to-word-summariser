import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { Paragraph, Document, Packer } from 'docx';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const dataString = JSON.stringify(data);

    const chatCompletion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: `You are a construction job spec analyser and summeriser. 
                  You will receive a JSON string of data that has come from a converted excel sheet.
                  You will read and analyse the data then create a 3 paragraph summary of the job spec.
                  
                  JSON Format: { summary: 'YOUR SUMMARY' }
                  YOUR SUMMARY be a all on string formatted so that it can be copy and pasted into a word document.`,
        },
        {
          role: 'user',
          content: `JOB SPEC JSON STRING: ${dataString}`,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const aiResponse = chatCompletion.choices[0].message.content;

    if (!aiResponse) {
      return NextResponse.json({ error: 'No AI response' });
    }

    const { summary } = JSON.parse(aiResponse);

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [new Paragraph({ text: summary })],
        },
      ],
    });

    const docBuffer = await Packer.toBuffer(doc);

    return new NextResponse(new Uint8Array(docBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename=job-spec-summary.docx`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
