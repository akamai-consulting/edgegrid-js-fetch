export const MAX_BODY = 131072;

function twoDigitNumberPad(number: number) {
    return String(number).padStart(2, '0');
}


/**
 * Create timestamp with format "yyyyMMddTHH:mm:ss+0000"
 *
 * @returns {string} Timestamp in format "yyyyMMddTHH:mm:ss+0000"
 */

export function createTimestamp(): string {
    const date = new Date(Date.now());

    return date.getUTCFullYear() +
        twoDigitNumberPad(date.getUTCMonth() + 1) +
        twoDigitNumberPad(date.getUTCDate()) +
        'T' +
        twoDigitNumberPad(date.getUTCHours()) + ':' +
        twoDigitNumberPad(date.getUTCMinutes()) +
        ':' +
        twoDigitNumberPad(date.getUTCSeconds()) +
        '+0000';
}


/**
 * Converts a stream into a Uint8Array
 *
 * @param {ReadableStream} stream A stream to read
 * @returns {Promise<Uint8Array>} Timestamp in format "yyyyMMddTHH:mm:ss+0000"
 */
async function readableStreamToUint8Array(stream: ReadableStream): Promise<Uint8Array> {
    const reader = stream.getReader();
    const chunks = [];
    let totalLength = 0;
  
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
  
      chunks.push(value);
      totalLength += value.length;
    }
  
    // Concatenate chunks into one Uint8Array
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }
  
    return result;
  }
  
/**
 * Returns the hash of the contents of a stream
 *
 * @param {ReadableStream} stream A stream to read
 * @returns {Promise<string>} hash of contents of stream
 */
export async function streamHash(stream: ReadableStream): Promise<string> {
    const arr = await readableStreamToUint8Array(stream);
    if (arr.length == 0) {
        return '';
    }

    const hashBuffer = await crypto.subtle.digest('SHA-256', arr);

    // Convert hash (ArrayBuffer) to base64 string
    return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
}

/**
 * Returns data to be signed for a request
 * @param {Request} request       The request Object to sign.
 * @param {String} authHeader     The authorization header.
 * @param {String} [contentHash]  The hash of the body content to include in the signature.
 * 
 * @returns {Promise<String>}     A Promise resolving to a string containing the data to be signed
 * 
 */
export async function dataToSign(request: Request, authHeader: string, contentHash?: string): Promise<string> {

    const parsedUrl = new URL(request.url),
        dataToSign = [
            request.method.toUpperCase(),
            parsedUrl.protocol.replace(":", ""),
            parsedUrl.host,
            parsedUrl.pathname + parsedUrl.search,
            //TODO, add support for signed headers
            canonicalizeHeaders({}),
            contentHash,
            authHeader
        ];

    const dataToSignStr = dataToSign.join('\t').toString();

    return dataToSignStr;
}

const REDIRECT_CODES = [
    300, 301, 302, 303, 307
];

/**
 * Determines if the http status code represents a redirect
 * 
 * @param {number} statusCode    The status codefrom an HTTP request
 * 
 * @returns {boolean}     `true` if the status code represents a redirect.  Else `false`
 * 
 */
export function isRedirect (statusCode: number): boolean {
    return REDIRECT_CODES.includes(statusCode);
}

/**
 * Returns an HMAC signature, using SHA256 hash algorigthm
 * @param {string} data   The data to be signed
 * @param {string} key    The key used to sign data
 * 
 * @returns {Promise<string>}      The signature
 * 
 */
export async function base64HmacSha256(data: string, key: string): Promise<string> {
    const encoder = new TextEncoder();

    // Encode key and data as Uint8Array
    const keyData = encoder.encode(key);
    const message = encoder.encode(data);

    // Import the key
    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: { name: 'SHA-256' } },
        false,
        ['sign']
    );

    // Sign the message
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, message);

    // Convert signature (ArrayBuffer) to base64
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

/**
 * Creates a String containing a tab delimited set of headers.
 * @param  {Object} headers Object containing the headers to add to the set.
 * @returns {String}         String containing a tab delimited set of headers.
 */
export function canonicalizeHeaders(headers: { [x: string]: string; }): string {
    const formattedHeaders = [];
    let key;

    for (key in headers) {
        formattedHeaders.push(key.toLowerCase() + ':' + headers[key].trim().replace(/\s+/g, ' '));
    }

    return formattedHeaders.join('\t');
}


/**
 * Creates a String containing a tab delimited set of headers.
 * @param  {string} timestamp    Timestamp in format "yyyyMMddTHH:mm:ss+0000"
 * @param  {string} clientSecret Client secret
 * 
 * @returns {Promise<string>}    Promise resolving to the signing key
 */
export async function signingKey(timestamp:  string, clientSecret: string): Promise<string> {
    const key = await base64HmacSha256(timestamp, clientSecret);

    return key;
}
/**
 *
 * @param {Object} request       The request Object.
 * @param {string} timestamp     The timestamp with format "yyyyMMddTHH:mm:ss+0000".
 * @param {string} clientSecret  The client secret value from the .edgerc file.
 * @param {string} authHeader    The authorization header.
 * @param {String} [contentHash] The hash of the body content to include in the signature.
 * 
 * @returns {Promise<string>}    A Promise resolving to a string represented the requests signature
 */

export async function signRequestWithContentHash(request: Request, timestamp: string, clientSecret: string, authHeader: string, contentHash?: string): Promise<string> {
    return await base64HmacSha256(await dataToSign(request, authHeader, contentHash), await signingKey(timestamp, clientSecret));
}
