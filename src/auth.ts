import {signRequestWithContentHash, createTimestamp, streamHash  } from './helpers';

/**
 * Create `Authentication` header from request data
 * 
 * @param {Request} request        The request Object.
 * @param {string} clientToken     The client token value from the .edgerc file.
 * @param {string} clientSecret    The client secret value from the .edgerc file. 
 * @param {string} accessToken     The access token value from the .edgerc file.
 * @param {string} [timestamp]     The timestamp with format "yyyyMMddTHH:mm:ss+0000".
 * @param {string} [nonce]         A random string used to detect replayed request messages.
 * 
 * @returns {Promise<string>}
 */
async function createAuthHeader(request: Request, clientToken: string, accessToken: string, clientSecret: string, timestamp: string, nonce: string): Promise<string> {
    const requestClone = request.clone()

    const authHeader = `EG1-HMAC-SHA256 client_token=${clientToken};access_token=${accessToken};timestamp=${timestamp};nonce=${nonce};`

    let hash;

    if (requestClone.method === "POST" && requestClone.body) {
        hash = await streamHash(requestClone.body);
    }

    const signedAuthHeader = authHeader + 'signature=' + await signRequestWithContentHash(requestClone, timestamp, clientSecret, authHeader, hash);
    return signedAuthHeader;
}



/**
 * Generated signed Request object
 * 
 * @param {Request} request        The request Object.
 * @param {string} clientToken     The client token value from the .edgerc file.
 * @param {string} clientSecret    The client secret value from the .edgerc file. 
 * @param {string} accessToken     The access token value from the .edgerc file.
 * @param {string} [nonce]         A random string used to detect replayed request messages.
 * @param {string} [timestamp]     The timestamp with format "yyyyMMddTHH:mm:ss+0000".
 * 
 * @returns {Promise<Request>}     A Request object containing signed Authorization header
 */
export async function generateAuthedRequest(request: Request, clientToken: string, clientSecret: string, accessToken: string, nonce?: string, timestamp?: string) {
    nonce = nonce || crypto.randomUUID();
    timestamp = timestamp || createTimestamp();

    let signedAuthHeader = await createAuthHeader(request, clientToken, accessToken, clientSecret, timestamp, nonce);

    const headers = request.headers;
    headers.append("Authorization", signedAuthHeader);

    return new Request(request, {headers: headers});
}

