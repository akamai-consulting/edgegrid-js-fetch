/** Class representing  EdgeGrid credentials */
export default class EdgeGridCredentials {

    #client_token: string
    #host: string
    #access_token: string
    #client_secret: string

    /**
     * Create an EdgeGridCredentials object.
     * 
     * @param {string} client_secret - The client secret
     * @param {string} host - The host
     * @param {string} access_token - The access token
     * @param {string} client_token - The client token
     * 
     */
    constructor(client_secret: string, host: string, access_token: string, client_token: string) {
        if (!client_token) {
            throw TypeError('Insufficient Akamai credentials: missing client_token')
        }
        if (!host) {
            throw TypeError('Insufficient Akamai credentials: missing host')
        }
        if (!access_token) {
            throw TypeError('Insufficient Akamai credentials: missing access_token')
        }
        if (!client_secret) {
            throw TypeError('Insufficient Akamai credentials: missing client_secret')
        }

        this.#client_token = client_token;
        this.#host = host;
        this.#access_token = access_token;
        this.#client_secret = client_secret;
    }

    /**
     * Get the client token
     * @returns {string} The client token.
     */
    get clientToken(): string {
        return this.#client_token;
    }

    /**
     * Get the host
     * @returns {string} The host.
     */
    get host(): string {
        return this.#host;
    }

    /**
     * Get the access token
     * @returns {string} The access token.
     */
    get accessToken(): string {
        return this.#access_token;
    }

    /**
     * Get the client secret
     * @returns {string} The client secret.
     */
    get clientSecret(): string {
        return this.#client_secret;
    }

    static #getSection(lines: string[], sectionName: string) {
        const match = /^\s*\[(.*)]/,
            section: string[] = [];

        lines.some(function (line, i) {
            const lineMatch = line.match(match),
                isMatch = lineMatch !== null && lineMatch[1] === sectionName;

            if (isMatch) {
                // go through section until we find a new one
                lines.slice(i + 1, lines.length).some(function (line) {
                    const isMatch = line.match(match) !== null;
                    if (!isMatch) {
                        section.push(line);
                    }
                    return isMatch;
                });
            }
            return isMatch;
        });
        return section;
    }

    static #validatedConfig(config: { [x: string]: string;}): EdgeGridCredentials {
        if (!(config.host && config.access_token &&
            config.client_secret && config.client_token)) {
            let errorMessage = "";
            const tokens =
                ['client_secret', 'host', 'access_token', 'client_token'];
            tokens.forEach(function (token) {
                if (!config[token]) {
                    errorMessage += "\nMissing: " + token;
                }
            });
            throw TypeError(errorMessage)
        }

        return new EdgeGridCredentials(config.client_secret, config.host, config.access_token, config.client_token);
    }

    

    static #buildObj(configs: string[]): EdgeGridCredentials {
        const result: {[key: string]: string;} = {};
        let index,
            key,
            val,
            parsedValue,
            isComment;

        configs.forEach(function (config: string) {
            config = config.trim();
            isComment = config.indexOf(";") === 0;
            index = config.indexOf('=');
            if (index > -1 && !isComment) {
                key = config.substr(0, index);
                if (key.startsWith("max-body")) {
                    key = key.replace('-', '_');
                }
                val = config.substring(index + 1);
                // remove inline comments
                parsedValue = val.replace(/^\s*(['"])((?:\\\1|.)*?)\1\s*(?:;.*)?$/, "$2");
                if (parsedValue === val) {
                    // the value is not contained in matched quotation marks
                    parsedValue = val.replace(/\s*([^;]+)\s*;?.*$/, "$1");
                }
                result[key.trim()] = parsedValue;
            }
        });

        return this.#validatedConfig(result);
    }


    /**
     *
     * @param {ReadableStream} readableStream   A ReadableStream which provides the contents of an edgerc file
     * @param {string} [conf=default]           The name of the configuration section to use
     * @returns {Promise<EdgeGridCredentials>}  A Promise that resolves to an EdgeGridCredentials object 
     *                                          which contains data for selected configuration section
     */
    static async parseEdgercStream (readableStream: ReadableStream, conf='default'): Promise<EdgeGridCredentials> {
        let streamString = '';
        const reader = readableStream.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            streamString += decoder.decode(value, { stream: true });
        }

        const edgerc = streamString.split('\n'),
            confData = this.#getSection(edgerc, conf);
        if (!confData.length) {
            throw new Error('An error occurred parsing the .edgerc file. You probably specified an invalid section name.');
        }

        return this.#buildObj(confData);
    }
}