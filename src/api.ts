import { generateAuthedRequest } from './auth';
import EdgeGridCredentials from './credentials';
import { isRedirect } from './helpers';

const builtinFetch = fetch;

/** Class representing an EdgeGrid request signer and fetcher. */
export default class EdgeGrid {
    #config

    /**
     * Get the configuration object used for signing requests.
     * @returns {EdgeGridCredentials} The edgerc configuration object.
     */
    get config (): EdgeGridCredentials {
        return this.#config
    }
    
    /**
     * Create an EdgeGridCredentials object.
     * @param {EdgeGridCredentials} credentials - The credentials used for signing requests
     */
    constructor (credentials: EdgeGridCredentials) {
        this.#config = credentials
    }

    /**
     * Builds the request using the properties of the local config Object.
     * Follows the same signature as the WHATWG fetch spec
     *
     * @param {RequestInfo|URL} input - The Request Object or URL. 
     * @param {RequestInit} init - An init object to include options such as heders and body.
     * 
     * @returns Promise which resolves to a signed Request object
     */
    async signRequest (input: RequestInfo | URL, init?: RequestInit): Promise<Request> {
        let requestToSign;
        if (input instanceof Request) {
            const url = new URL(input.url)
            //url.host = this.config.host;
            requestToSign = new Request(url, input)
            requestToSign = new Request(requestToSign, init)
        }
        else {
            const url = new URL(input, 'https://' + this.config.host);
            requestToSign = new Request(url, init)
        }

        let signedRequest = generateAuthedRequest(
            requestToSign,
            this.config.clientToken,
            this.config.clientSecret,
            this.config.accessToken)
        

        return signedRequest;
    }

     /**
     * Signs and fetches the request using the properties of the local config Object.
     * Follows the same signature as the WHATWG fetch spec
     *
     * @param {RequestInfo|URL} input - The Request Object or URL. 
     * @param {RequestInit} init - An init object to include options such as heders and body.
     * 
     * @returns Response object fetched from the EdgeGrid API
     */
     async fetch (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
        let signedRequest = await this.signRequest(input, init)

        // clone request in case we need to use it for a redirect
        let clonedRequest = signedRequest.clone();

        let response = await builtinFetch(signedRequest, {
            redirect: 'manual', // prevent automatic redirect following
        });


        // Check for redirect manually
        const locationHeader = response.headers.get('location')
        if (isRedirect(response.status) && locationHeader) {        
            const headers = clonedRequest.headers;
            headers.delete('authorization');

            const redirectedRequest = new Request(clonedRequest, {headers})
            return this.fetch(locationHeader, redirectedRequest)
        }

        return response;
    }
}

