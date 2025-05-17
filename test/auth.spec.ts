import * as auth from '../src/auth';

const access_token = "akab-access-token-xxx-xxxxxxxxxxxxxxxx",
    client_token = "akab-client-token-xxx-xxxxxxxxxxxxxxxx",
    client_secret = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=",
    nonce = "nonce-xx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    timestamp = "20140321T19:34:21+0000";

let test_auth = null;

describe('Signature Generation', function () {
    describe('simple GET', function () {
        it('should return the expected string when the signing request is run.', async function () {
            const expected_header = "EG1-HMAC-SHA256 client_token=akab-client-token-xxx-xxxxxxxxxxxxxxxx;access_token=akab-access-token-xxx-xxxxxxxxxxxxxxxx;timestamp=20140321T19:34:21+0000;nonce=nonce-xx-xxxx-xxxx-xxxx-xxxxxxxxxxxx;signature=tL+y4hxyHxgWVD30X3pWnGKHcPzmrIF+LThiAOhMxYU=";
            const request = new Request("https://akaa-baseurl-xxxxxxxxxxx-xxxxxxxxxxxxx.luna.akamaiapis.net/");
            test_auth = await auth.generateAuthedRequest(request, client_token, client_secret, access_token, nonce, timestamp);
            //assert.strictEqual(test_auth.headers.get('Authorization'), expected_header);
            expect(test_auth.headers.get('Authorization')).toBe(expected_header)
        });
    });
    describe('get with querystring', function () {
        it('should return the expected string when the signing request is run.', async function () {
            const expected_header = "EG1-HMAC-SHA256 client_token=akab-client-token-xxx-xxxxxxxxxxxxxxxx;access_token=akab-access-token-xxx-xxxxxxxxxxxxxxxx;timestamp=20140321T19:34:21+0000;nonce=nonce-xx-xxxx-xxxx-xxxx-xxxxxxxxxxxx;signature=hKDH1UlnQySSHjvIcZpDMbQHihTQ0XyVAKZaApabdeA=";
            const request = new Request("https://akaa-baseurl-xxxxxxxxxxx-xxxxxxxxxxxxx.luna.akamaiapis.net/testapi/v1/t1?p1=1&p2=2");
            test_auth = await auth.generateAuthedRequest(request, client_token, client_secret, access_token, nonce, timestamp);
            //assert.strictEqual(test_auth.headers.get('Authorization'), expected_header);
            expect(test_auth.headers.get('Authorization')).toBe(expected_header)
        });
    });

    describe('Post uses passed-max-body', function() {
        it('should return the expected string when the signing request is run.', async function() {
            const expected_header = "EG1-HMAC-SHA256 client_token=akab-client-token-xxx-xxxxxxxxxxxxxxxx;access_token=akab-access-token-xxx-xxxxxxxxxxxxxxxx;timestamp=20140321T19:34:21+0000;nonce=nonce-xx-xxxx-xxxx-xxxx-xxxxxxxxxxxx;signature=hXm4iCxtpN22m4cbZb4lVLW5rhX8Ca82vCFqXzSTPe4=";
            const data = "datadatadatadatadatadatadatadata";
            const request = new Request("https://akaa-baseurl-xxxxxxxxxxx-xxxxxxxxxxxxx.luna.akamaiapis.net/testapi/v1/t3", {
                "method": "POST",
                "body": data
            });
            test_auth = await auth.generateAuthedRequest(request, client_token, client_secret, access_token, nonce, timestamp);
            //assert.strictEqual(test_auth.headers.get('Authorization'), expected_header);
            expect(test_auth.headers.get('Authorization')).toBe(expected_header)
        });
    });

    describe('POST length of 2KB', function () {
        it('should return the expected string when the signing request is run.', async function () {
            const expected_header = "EG1-HMAC-SHA256 client_token=akab-client-token-xxx-xxxxxxxxxxxxxxxx;access_token=akab-access-token-xxx-xxxxxxxxxxxxxxxx;timestamp=20140321T19:34:21+0000;nonce=nonce-xx-xxxx-xxxx-xxxx-xxxxxxxxxxxx;signature=6Q6PiTipLae6n4GsSIDTCJ54bEbHUBp+4MUXrbQCBoY=";
            const data = "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd";
            const request = new Request("https://akaa-baseurl-xxxxxxxxxxx-xxxxxxxxxxxxx.luna.akamaiapis.net/testapi/v1/t3", {
                "method": "POST",
                "body": data
            });
            test_auth = await auth.generateAuthedRequest(request, client_token, client_secret, access_token, nonce, timestamp);
            //assert.strictEqual(test_auth.headers.get('Authorization'), expected_header);
            expect(test_auth.headers.get('Authorization')).toBe(expected_header)
        });
    });

    describe('POST empty body', function () {
        it('should return the expected string when the signing request is run.', async function () {
            const expected_header = "EG1-HMAC-SHA256 client_token=akab-client-token-xxx-xxxxxxxxxxxxxxxx;access_token=akab-access-token-xxx-xxxxxxxxxxxxxxxx;timestamp=20140321T19:34:21+0000;nonce=nonce-xx-xxxx-xxxx-xxxx-xxxxxxxxxxxx;signature=1gEDxeQGD5GovIkJJGcBaKnZ+VaPtrc4qBUHixjsPCQ=";
            const data = "";
            const request = new Request("https://akaa-baseurl-xxxxxxxxxxx-xxxxxxxxxxxxx.luna.akamaiapis.net/testapi/v1/t6", {
                "method": "POST",
                "body": data
            });
            test_auth = await auth.generateAuthedRequest(request, client_token, client_secret, access_token, nonce, timestamp);
            //assert.strictEqual(test_auth.headers.get('Authorization'), expected_header);
            expect(test_auth.headers.get('Authorization')).toBe(expected_header)
        });
    });

    describe('simple header signing with GET', function () {
        it('should return the expected string when the signing request is run.', async function () {
            const expected_header = "EG1-HMAC-SHA256 client_token=akab-client-token-xxx-xxxxxxxxxxxxxxxx;access_token=akab-access-token-xxx-xxxxxxxxxxxxxxxx;timestamp=20140321T19:34:21+0000;nonce=nonce-xx-xxxx-xxxx-xxxx-xxxxxxxxxxxx;signature=YgMcMzBrimnBmp7wxzjirUsAcC0UK6MVPydEpjKVcHc=";
            const headers = {
                "X-Test1": "test-simple-header"
            };
            const request = new Request("https://akaa-baseurl-xxxxxxxxxxx-xxxxxxxxxxxxx.luna.akamaiapis.net/testapi/v1/t4", {
                "method": "GET",
                "headers": headers
            });
            test_auth = await auth.generateAuthedRequest(request, client_token, client_secret, access_token, nonce, timestamp);
            //assert.strictEqual(test_auth.headers.get('Authorization'), expected_header);
            expect(test_auth.headers.get('Authorization')).toBe(expected_header)
        });
    });

    describe('simple header signing with GET', function () {
        it('should return the expected string when the signing request is run.', async function () {
            const expected_header = "EG1-HMAC-SHA256 client_token=akab-client-token-xxx-xxxxxxxxxxxxxxxx;access_token=akab-access-token-xxx-xxxxxxxxxxxxxxxx;timestamp=20140321T19:34:21+0000;nonce=nonce-xx-xxxx-xxxx-xxxx-xxxxxxxxxxxx;signature=YgMcMzBrimnBmp7wxzjirUsAcC0UK6MVPydEpjKVcHc=";
            const headers = {
                "X-Test1": "test-simple-header"
            };
            const request = new Request("https://akaa-baseurl-xxxxxxxxxxx-xxxxxxxxxxxxx.luna.akamaiapis.net/testapi/v1/t4", {
                "method": "GET",
                "headers": headers
            });
            test_auth = await auth.generateAuthedRequest(request, client_token, client_secret, access_token, nonce, timestamp);
            //assert.strictEqual(test_auth.headers.get('Authorization'), expected_header);
            expect(test_auth.headers.get('Authorization')).toBe(expected_header)
        });
    });

    describe('headers containing spaces', function () {
        it('should return the expected string when the signing request is run.', async function () {
            const expected_header = "EG1-HMAC-SHA256 client_token=akab-client-token-xxx-xxxxxxxxxxxxxxxx;access_token=akab-access-token-xxx-xxxxxxxxxxxxxxxx;timestamp=20140321T19:34:21+0000;nonce=nonce-xx-xxxx-xxxx-xxxx-xxxxxxxxxxxx;signature=YgMcMzBrimnBmp7wxzjirUsAcC0UK6MVPydEpjKVcHc=";
            const headers = {
                "X-Test1": "\"     test-header-with-spaces     \""
            };
            const request = new Request("https://akaa-baseurl-xxxxxxxxxxx-xxxxxxxxxxxxx.luna.akamaiapis.net/testapi/v1/t4", {
                "method": "GET",
                "headers": headers
            });
            test_auth = await auth.generateAuthedRequest(request, client_token, client_secret, access_token, nonce, timestamp);
            //assert.strictEqual(test_auth.headers.get('Authorization'), expected_header);
            expect(test_auth.headers.get('Authorization')).toBe(expected_header)
        });
    });

    describe('headers with leading and interior spaces', function () {
        it('should return the expected string when the signing request is run.', async function () {
            const headers = {
                "X-Test1": "     first-thing      second-thing"
            };
            const expected_header = "EG1-HMAC-SHA256 client_token=akab-client-token-xxx-xxxxxxxxxxxxxxxx;access_token=akab-access-token-xxx-xxxxxxxxxxxxxxxx;timestamp=20140321T19:34:21+0000;nonce=nonce-xx-xxxx-xxxx-xxxx-xxxxxxxxxxxx;signature=YgMcMzBrimnBmp7wxzjirUsAcC0UK6MVPydEpjKVcHc=";
            const request = new Request("https://akaa-baseurl-xxxxxxxxxxx-xxxxxxxxxxxxx.luna.akamaiapis.net/testapi/v1/t4", {
                "method": "GET",
                "headers": headers
            });
            test_auth = await auth.generateAuthedRequest(request, client_token, client_secret, access_token, nonce, timestamp);
            //assert.strictEqual(test_auth.headers.get('Authorization'), expected_header);
            expect(test_auth.headers.get('Authorization')).toBe(expected_header)
        });
    });

    describe('PUT test', function () {
        it('should return the expected string when the signing request is run.', async function () {
            const data = "PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP";
            const expected_header = "EG1-HMAC-SHA256 client_token=akab-client-token-xxx-xxxxxxxxxxxxxxxx;access_token=akab-access-token-xxx-xxxxxxxxxxxxxxxx;timestamp=20140321T19:34:21+0000;nonce=nonce-xx-xxxx-xxxx-xxxx-xxxxxxxxxxxx;signature=GNBWEYSEWOLtu+7dD52da2C39aX/Jchpon3K/AmBqBU=";
            const request = new Request("https://akaa-baseurl-xxxxxxxxxxx-xxxxxxxxxxxxx.luna.akamaiapis.net/testapi/v1/t6",{
                "method": "PUT",
                "body": data
            });
            test_auth = await auth.generateAuthedRequest(request, client_token, client_secret, access_token, nonce, timestamp);
            //assert.strictEqual(test_auth.headers.get('Authorization'), expected_header);
            expect(test_auth.headers.get('Authorization')).toBe(expected_header)
        });
    });

    describe('when not passing a nonce', function () {
        it('a unique nonce should be used for each signed request', async function () {
            const request = new Request("https://akaa-baseurl-xxxxxxxxxxx-xxxxxxxxxxxxx.luna.akamaiapis.net/");
            let firstAuth = await auth.generateAuthedRequest(request, client_token, client_secret, access_token, undefined, timestamp);
            let secondAuth = await auth.generateAuthedRequest(request, client_token, client_secret, access_token, undefined, timestamp);
            //assert.strictEqual(test_auth.headers.get('Authorization'), expected_header);
            expect(firstAuth.headers.get('Authorization')).not.toBe(secondAuth.headers.get('Authorization'));
        });
    });
});
