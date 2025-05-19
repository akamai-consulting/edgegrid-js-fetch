import {EdgeGrid, EdgeGridCredentials}  from '@akamai-consulting/edgegrid-js-fetch';

const client_secret = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=';
const host = 'akaa-baseurl-xxxxxxxxxxx-xxxxxxxxxxxxx.luna.akamaiapis.net';
const access_token = 'akab-access-token-xxx-xxxxxxxxxxxxxxxx';
const client_token = 'akab-client-token-xxx-xxxxxxxxxxxxxxxx';

const credentials = new EdgeGridCredentials(client_secret, host, access_token, client_token);

// Create EdgeGrid object from config
const eg = new EdgeGrid(credentials);

// Create Signed Request to get list of EdgeWorkers
const request = await eg.signRequest('/edgeworkers/v1/ids');

// Make request using `fetch`
const response = await fetch(request);

// Log response object to console
console.log(response.json());