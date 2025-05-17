import { createReadStream } from 'fs';
import { resolve } from 'path';
import { Readable } from 'stream';

export function createReadableStreamFromTestFile(filename: string):ReadableStream {
    return Readable.toWeb(createReadStream(resolve(__dirname, filename))) as ReadableStream;
}


export async function getTextContentsOfReadableStream(stream: ReadableStream): Promise<string> {
    const textStream = stream.pipeThrough(new TextDecoderStream());
    const reader = textStream.getReader();
    let text = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      text += value
    }
    return text
}