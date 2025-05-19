import { createReadableStreamFromTestFile } from './utils';

import * as assert from 'assert';
import EdgeGridCredentials from '../src/credentials';

describe('edgerc', function () {
    describe('the parsed edgerc file it returns', function () {
        describe('when it is not passed a second argument indicating config section', function () {
            let config: EdgeGridCredentials
            beforeEach(async function () {
                config = await EdgeGridCredentials.parseEdgercStream(createReadableStreamFromTestFile('test_edgerc'));
            });

            it('reports the default host', function () {
                expect(config.host).toBe('example.luna.akamaiapis.net')
            });

            it('reports the default client_token', function () {
                expect(config.clientToken).toBe('clientToken')
            });

            it('reports the default client_secret', function () {
                expect(config.clientSecret).toBe('clientSecret')
            });

            it('reports the default access_token', function () {
                expect(config.accessToken).toBe('accessToken')
            });
        });

        describe('when it is passed a second argument indicating config section', function () {
            let config: EdgeGridCredentials
            beforeEach(async function () {
                config = await EdgeGridCredentials.parseEdgercStream(createReadableStreamFromTestFile('test_edgerc'), 'section');
            });

            it('reports the host associated with the section', function () {
                expect(config.host).toBe('sectionexample.luna.akamaiapis.net');
            });

            it('reports the client_token associated with the section', function () {
                expect(config.clientToken).toBe('sectionClientToken');
            });

            it('reports the client_secret associated with the section', function () {
                expect(config.clientSecret).toBe('sectionClientSecret');
            });

            it('reports the access_token associated with the section', function () {
                expect(config.accessToken).toBe('sectionAccessToken');
            });
        });

        describe('when it is passed a second argument indicating config section without specified max_body', function () {
            let config: EdgeGridCredentials

            beforeEach(async function () {
                config = await EdgeGridCredentials.parseEdgercStream(createReadableStreamFromTestFile('test_edgerc'), 'no-max-body');
            });

            it('reports the host associated with the section', function () {
                expect(config.host).toBe('sectionexample.luna.akamaiapis.net');
            });

            it('reports the client_token associated with the section', function () {
                expect(config.clientToken).toBe('sectionClientToken');
            });

            it('reports the client_secret associated with the section', function () {
                expect(config.clientSecret).toBe('sectionClientSecret');
            });

            it('reports the access_token associated with the section', function () {
                expect(config.accessToken).toBe('sectionAccessToken');
            });
        });

        describe('when it is passed a second argument indicating config section with custom `max_body` value', function () {
            let config:EdgeGridCredentials

            beforeEach(async function () {
                config = await EdgeGridCredentials.parseEdgercStream(createReadableStreamFromTestFile('test_edgerc'), 'custom:max_body');
            });

            it('reports the host associated with the section', function () {
                expect(config.host).toBe('sectionexample.luna.akamaiapis.net');
            });

            it('reports the client_token associated with the section', function () {
                expect(config.clientToken).toBe('sectionClientToken');
            });

            it('reports the client_secret associated with the section', function () {
                expect(config.clientSecret).toBe('sectionClientSecret');
            });

            it('reports the access_token associated with the section', function () {
                expect(config.accessToken).toBe('sectionAccessToken');
            });
        });

        describe('when the section contains a host with the "https://" protocal specified', function () {
            let config:EdgeGridCredentials;
            beforeEach(async function () {
                config = await EdgeGridCredentials.parseEdgercStream(createReadableStreamFromTestFile('test_edgerc'), 'https');
            });

            it('reports a host with a valid URI string', function () {
                expect(config.host).toBe('https://example.luna.akamaiapis.net');
            });
        });

        describe('when the section passed does not exist', function () {
            it('throws the proper error', async function () {
                const config = EdgeGridCredentials.parseEdgercStream(createReadableStreamFromTestFile('test_edgerc'), 'blah');
                await expect(config).rejects.toThrow(/An error occurred parsing the .edgerc file. You probably specified an invalid section name./)
            });
        });

        describe('when the section has comments', function () {
            let config:EdgeGridCredentials;

            beforeEach(async function () {
                config = await EdgeGridCredentials.parseEdgercStream(createReadableStreamFromTestFile('test_edgerc'), 'comment-test');
            });

            it('parses a value with a semicolon properly', function () {
                expect(config.clientSecret).toBe("client;secret");
            });
        });
    });

    describe('when parsing an edgerc file with missing credentials', function () {
        it('throws an error when missing client token', async function () {
            let config = EdgeGridCredentials.parseEdgercStream(createReadableStreamFromTestFile('test_edgerc'), 'missing-client-token')
            await expect(config).rejects.toThrow("Missing: client_token");
        });

        it('throws an error when missing host', async function () {
            let config = EdgeGridCredentials.parseEdgercStream(createReadableStreamFromTestFile('test_edgerc'), 'missing-host')
            await expect(config).rejects.toThrow("Missing: host");
        });

        it('throws an error when missing access token', async function () {
            let config = EdgeGridCredentials.parseEdgercStream(createReadableStreamFromTestFile('test_edgerc'), 'missing-access-token')
            await expect(config).rejects.toThrow("Missing: access_token");
        });

        it('throws an error when missing client secret', async function () {
            let config = EdgeGridCredentials.parseEdgercStream(createReadableStreamFromTestFile('test_edgerc'), 'missing-client-secret')
            await expect(config).rejects.toThrow("Missing: client_secret");
        });
    });

    describe('when the edgerc constructor has missing credentials', function () {
        it('throws an error when missing clientToken', function () {
            expect(()=>new EdgeGridCredentials(
                'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=',
                'akaa-baseurl-xxxxxxxxxxx-xxxxxxxxxxxxx.luna.akamaiapis.net',
                'akab-access-token-xxx-xxxxxxxxxxxxxxxx',
                '',
            )).toThrow("Insufficient Akamai credentials: missing client_token");
        });

        it('throws an error when missing host', function () {
            expect(()=>new EdgeGridCredentials(
                'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=',
                '',
                'akab-access-token-xxx-xxxxxxxxxxxxxxxx',
                'akab-client-token-xxx-xxxxxxxxxxxxxxxx'
            )).toThrow("Insufficient Akamai credentials: missing host");
        });

        it('throws an error when missing access token', function () {
            expect(()=>new EdgeGridCredentials(
                'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=',
                'akaa-baseurl-xxxxxxxxxxx-xxxxxxxxxxxxx.luna.akamaiapis.net',
                '',
                'akab-client-token-xxx-xxxxxxxxxxxxxxxx'
            )).toThrow("Insufficient Akamai credentials: missing access_token");
        });

        it('throws an error when missing client secret', function () {

       
            expect(()=>new EdgeGridCredentials(
                '',
                'akaa-baseurl-xxxxxxxxxxx-xxxxxxxxxxxxx.luna.akamaiapis.net',
                'akab-access-token-xxx-xxxxxxxxxxxxxxxx',
                'akab-client-token-xxx-xxxxxxxxxxxxxxxx'
            )).toThrow("Insufficient Akamai credentials: missing client_secret");
        });
    });
});
