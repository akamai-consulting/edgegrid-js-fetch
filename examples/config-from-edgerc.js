import {EdgeGrid, EdgeGridCredentials}  from '@akamai-consulting/edgegrid-js-fetch';

// Get path of ~/.edgerc file
const edgercPath = path.join(os.homedir(), '.edgerc');

// Create ReadableStream to provide contents of edgerc file
const edgercStream = Readable.toWeb(fs.createReadStream(edgercPath));

// Parse edgerc file and get [default] section
const credentials = await EdgeGridCredentials.parseEdgercStream(edgercStream);

// Create EdgeGrid object from config
const eg = new EdgeGrid(credentials);

// Create Signed Request to get list of EdgeWorkers
const request = await eg.signRequest('/edgeworkers/v1/ids');

// Make request using `fetch`
const response = await fetch(request);

// Log response object to console
console.log(response.json());