# EdgeGrid for Node.js

![Build Status](https://github.com/akamai/AkamaiOPEN-edgegrid-node/actions/workflows/test.yml/badge.svg)

This library implements an Authentication handler for the Akamai EdgeGrid Authentication scheme in JavaScript for environments supporting the [WHATWG Fetch Standard](https://fetch.spec.whatwg.org/)

## Install

`npm install --save @akamai-consulting/edgegrid-js-fetch`

## Authentication

You can obtain the authentication credentials through an API client. Requests to the API are marked with a timestamp and a signature and are executed immediately.

1. [Create authentication credentials](https://techdocs.akamai.com/developer/docs/set-up-authentication-credentials).

2. Place your credentials in an EdgeGrid file `~/.edgerc`, in the `[default]` section.

    ```
    [default]
    client_secret = C113nt53KR3TN6N90yVuAgICxIRwsObLi0E67/N8eRN=
    host = akab-h05tnam3wl42son7nktnlnnx-kbob3i3v.luna.akamaiapis.net
    access_token = akab-acc35t0k3nodujqunph3w7hzp7-gtm6ij
    client_token = akab-c113ntt0k3n4qtari252bfxxbsl-yvsdj
    ```

3. Use your local `.edgerc` by creating a stream providing contents of your edgerc file.

    ```javascript
    import {EdgeGridCredentials, EdgeGrid}  from '@akamai-consulting/edgegrid-js-fetch';

    const config = await EdgeGridCredentials.parseEdgercStream(
      Readable.toWeb(fs.createReadStream(
        path.join(os.homedir(), '.edgerc')
      ))
    );
    ```

    Alternatively, you can hard code your credentials by passing the credential values to the `EdgeGridCredentials()` constructor.

    ```javascript
    import {EdgeGridCredentials, EdgeGrid}  from '@akamai-consulting/edgegrid-js-fetch';

    const clientToken = "akab-c113ntt0k3n4qtari252bfxxbsl-yvsdj",
          host = "akab-h05tnam3wl42son7nktnlnnx-kbob3i3v.luna.akamaiapis.net";
          accessToken = "akab-acc35t0k3nodujqunph3w7hzp7-gtm6ij",
          clientSecret = "C113nt53KR3TN6N90yVuAgICxIRwsObLi0E67/N8eRN=",
        

    const config = new EdgeGridCredentials(client_token, host, access_token, client_secret);
    ```

## Use

The `EdgeGrid` class can be used to create a signed `Request` object

```javascript
// Create EdgeGrid object from config
const eg = new EdgeGrid(config);

// Create Signed Request to get list of EdgeWorkers
const request = await eg.signRequest('/edgeworkers/v1/ids');

// Make request using the standard `fetch`
const response = await fetch(request);
```

The `EdgeGrid` class can also be used to directly perform a fetch, with the same options as the standard `fetch`

```javascript
// Create EdgeGrid object from config
const eg = new EdgeGrid(config);

// Sign and fetch in a single step
const response = await eg.fetch('/edgeworkers/v1/ids');
```


## Reporting issues

To report an issue or make a suggestion, create a new [GitHub issue](https://github.com/akamai-consulting/edgegrid-js-fetch/issues).

## License

Copyright 2025 Akamai Technologies, Inc. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use these files except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.