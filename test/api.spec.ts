import { createReadableStreamFromTestFile, getTextContentsOfReadableStream } from './utils';

//import * as assert from 'assert';
import nock from 'nock';
import Api from '../src/api';

import EdgercCredentials from '../src/credentials';
import EdgeGrid from '../src/api';


describe('Api', function () {
    let api: EdgeGrid;
    beforeEach(function () {
        api = new Api(new EdgercCredentials(
            'clientSecret',
            'base.com',
            'accessToken',
            'clientToken'
            ));
    });

    describe('.config', function () {
        it('reports the client token', function () {
            expect(api.config.clientToken).toBe('clientToken')
        });

        it('reports the client secret', function () {
            expect(api.config.clientSecret).toBe('clientSecret')
        });

        it('reports the access token', function () {
            expect(api.config.accessToken).toBe('accessToken')
        });

        it('reports the API host', function () {
            expect(api.config.host).toBe('base.com')
        });

        describe('when it is instantiated from a parsed edgerc stream', function () {
            beforeEach(async function () {
                api = new Api(await EdgercCredentials.parseEdgercStream(createReadableStreamFromTestFile('test_edgerc'), 'section'));
            });

            it('reports the client token from the edgerc associated with the specified section', function () {
                expect(api.config.clientToken).toBe('sectionClientToken')
            });

            it('reports the client secret from the edgerc associated with the specified section', function () {
                expect(api.config.clientSecret).toBe('sectionClientSecret');
            });

            it('reports the access token from the edgerc associated with the specified section', function () {
                expect(api.config.accessToken).toBe('sectionAccessToken')
            });

            it('reports the API host from the edgerc associated with the specified section', function () {
                expect(api.config.host).toBe('sectionexample.luna.akamaiapis.net')
            });

            describe('when it is instantiated with an object with custom `max_body` value', function () {
                beforeEach(async function () {
                    api = new Api(await EdgercCredentials.parseEdgercStream(createReadableStreamFromTestFile('test_edgerc'), 'custom:max_body'));
                });

                it('reports the client token from the edgerc associated with the specified section with custom `max_body`', function () {
                    expect(api.config.clientToken).toBe('sectionClientToken');
                });

                it('reports the client secret from the edgerc associated with the specified section with custom `max_body`', function () {
                    expect(api.config.clientSecret).toBe('sectionClientSecret');
                });

                it('reports the access token from the edgerc associated with the specified section with custom `max_body`', function () {
                    expect(api.config.accessToken).toBe('sectionAccessToken');
                });

                it('reports the API host from the edgerc associated with the specified section with custom `max_body`', function () {
                    expect(api.config.host).toBe('sectionexample.luna.akamaiapis.net');
                });
            });

            describe('when it is instantiated with an object without specified `max_body` value', function () {
                beforeEach(async function () {
                    api = new Api(await EdgercCredentials.parseEdgercStream(createReadableStreamFromTestFile('test_edgerc'), 'no-max-body'));
                });

                it('reports the client token from the edgerc associated with the specified section without specified `max_body`', function () {
                    expect(api.config.clientToken).toBe('sectionClientToken')
                });

                it('reports the client secret from the edgerc associated with the specified section without specified `max_body`', function () {
                    expect(api.config.clientSecret).toBe('sectionClientSecret');
                });

                it('reports the access token from the edgerc associated with the specified section without specified `max_body`', function () {
                    expect(api.config.accessToken).toBe('sectionAccessToken');
                });

                it('reports the API host from the edgerc associated with the specified section without specified `max_body`', function () {
                    expect(api.config.host).toBe('sectionexample.luna.akamaiapis.net');
                });
            });

            describe('when it is instantiated with an object that does not specify a section', function () {
                beforeEach(async function () {
                    api = new Api(await EdgercCredentials.parseEdgercStream(createReadableStreamFromTestFile('test_edgerc')));
                });

                it('reports the client token from the edgerc associated with the default section', function () {
                    expect(api.config.clientToken).toBe('clientToken');
                });

                it('reports the client secret from the edgerc associated with the default section', function () {
                    expect(api.config.clientSecret).toBe('clientSecret');
                });

                it('reports the access token from the edgerc associated with the default section', function () {
                    expect(api.config.accessToken).toBe('accessToken');
                });

                it('reports the API host from the edgerc associated with the default section', function () {
                    expect(api.config.host).toBe('example.luna.akamaiapis.net');
                });
            });
/*
            describe('when it is instantiated with an object that specifies an inadequate path', function () {
                it('throws the appropriate error', async function () {
                    await assert.rejects(
                        async function () {
                            let api = new Api();

                            await api.init({
                                path: ''
                            });
                        },
                        /Either path to '.edgerc' or environment variables with edgerc configuration has to be provided./
                    );
                });
            });*/
        });
    });
/*
    describe('when it is not instantiated with valid credentials', function () {
        it('throws the appropriate error', async function () {
            await assert.rejects(
                async function () {
                    return new Api();
                },
                /Insufficient Akamai credentials/
            );
        });
    });
    */

    describe('#signRequest', function () {
        describe('when only a path is passed', function () {
            let request: Request;
            beforeEach(async function () {
                request = await api.signRequest('/foo');
            });

            it('adds an Authorization header to the request it is passed', function () {
                expect(typeof request.headers.get('Authorization')).toBe('string');
            });

            it('does not add Content-Type header', function () {
                expect(request.headers.get('Content-Type')).toBeNull();
            });

            it('does not add Accept header', function () {
                expect(request.headers.get('Accept')).toBeNull();
            });

            it('ensures a default GET method', function () {
                expect(request.method).toBe('GET');
            });

            it('does not have a body', function () {
                expect(request.body).toBeNull();
            });

            it('ensures a url is properly declared', function () {
                expect(request.url).toBe('https://base.com/foo');
            });

            it('ensures no User-Agent is added when AkamaiCLI env variables not set', function () {
                expect(request.headers.has('User-Agent')).toBe(false);
            });
        });

        describe('when a Request object is passed', function () {
            let request: Request;
            beforeEach(async function () {
                request = await api.signRequest(new Request('https://base.com/foo'));
            });

            it('adds an Authorization header to the request it is passed', function () {
                expect(typeof request.headers.get('Authorization')).toBe('string');
            });

            it('does not add Content-Type header', function () {
                expect(request.headers.get('Content-Type')).toBeNull();
            });

            it('does not add Accept header', function () {
                expect(request.headers.get('Accept')).toBeNull();
            });

            it('ensures a default GET method', function () {
                expect(request.method).toBe('GET');
            });

            it('does not have a body', function () {
                expect(request.body).toBeNull();
            });

            it('ensures a url is properly declared', function () {
                expect(request.url).toBe('https://base.com/foo');
            });

            it('ensures no User-Agent is added when AkamaiCLI env variables not set', function () {
                expect(request.headers.has('User-Agent')).toBe(false);
            });
        });

        describe('when more specific request options are passed', function () {
            let request: Request;
            beforeEach(async function () {
                request = await api.signRequest('/foo', {
                    method: 'POST',
                    body: JSON.stringify({
                        foo: 'bar'
                    }),
                    headers: {
                        'User-Agent': 'testUserAgent',
                        'Accept': 'text/html',
                        'Content-Type': 'text/example'
                    }
                });
            });

            it('adds an Authorization header to the request it is passed', function () {
                expect(typeof request.headers.get('Authorization')).toBe('string');
            });

            it('ensures Content-Type is preserved', function () {
                expect(request.headers.get('Content-Type')).toBe('text/example');
            });

            it('uses the specified POST method', function () {
                expect(request.method).toBe('POST');
            });

            it('uses the specified body parsed as a JSON string', async function () {
                expect(request.body).toBeTruthy()
                if (request.body) {
                    expect(await getTextContentsOfReadableStream(request.body)).toBe('{"foo":"bar"}');
                }
            });
            
            it('ensures provided User-Agent header is preserved', function () {
                expect(request.headers.get('User-Agent')).toBe('testUserAgent');
            });

            it('ensures provided Accept header is preserved', function () {
                expect(request.headers.get('Accept')).toBe('text/html');
            });
        });

        describe("when gzip response format is expected", function () {
            let request: Request;
            beforeEach(async function () {
                request = await api.signRequest('/foo', {
                    body: 'someBody',
                    method: 'POST',
                    headers: {
                        'Accept': `application/gzip`,
                        'Content-Type': `application/gzip`
                    }
                });
            });

            it('adds an Authorization header to the request it is passed', function () {
                expect(typeof request.headers.get('Authorization')).toBe('string');
            });

            it('ensures a POST method', function () {
                expect(request.method).toBe('POST');
            });

            it('ensures the specified body is not modified', async function () {
                expect(request.body).toBeTruthy()
                if (request.body) {
                    expect(await getTextContentsOfReadableStream(request.body)).toBe('someBody');
                }
            });
        });

        describe("when UInt8Array is passed as the request body", function () {
            let request: Request;
            beforeEach(async function () {
                request = await api.signRequest('/foo', {
                    body: new Uint8Array([115, 111, 109, 101, 66, 111, 100, 121]), //ASCII representation of 'someBody'
                    method: 'POST',
                    headers: {
                        'Accept': `application/gzip`,
                        'Content-Type': `application/gzip`
                    }
                });
            });

            it('adds an Authorization header to the request it is passed', function () {
                expect(typeof request.headers.get('Authorization')).toBe('string');
            });

            it('ensures a POST method', function () {
                expect(request.method).toBe('POST');
            });

            it('ensures the specified body is not modified', async function () {
                expect(request.body).toBeTruthy()
                if (request.body) {
                    expect(await getTextContentsOfReadableStream(request.body)).toBe('someBody');
                }
            });
        });
    });


    describe('#fetch', function () {
        describe('when authentication is done with a simple options object specifying only a path', function () {
            beforeEach(function () {
                nock('https://base.com')
                    .get('/foo')
                    .reply(200, '{"foo":"bar"}');
            });

            it('sends the HTTP GET request created by #fetch', async function () {
                const resp = await api.fetch('/foo');

                expect(await resp.text()).toBe('{"foo":"bar"}');
            });
        });

        describe('when authentication is done with a more complex options object specifying only a path', function () {
            beforeEach(function () {
                nock('https://base.com')
                    .post('/foo')
                    .reply(200, '{"foo":"bar"}');
            });

            it('sends the HTTP created by #auth', async function () {
                const resp = await api.fetch('/foo', {
                    method: 'POST'
                });
                expect(await resp.text()).toBe('{"foo":"bar"}')
            });
        });

        describe('when the initial request redirects', function () {
            it('correctly follows the redirect and re-signs the request', async function () {
                let firstAuth: string;
                nock('https://base.com')
                    .get('/foo')
                    .reply(function () {
                        firstAuth = this.req.headers["authorization"];
                        return [
                            302,
                            '',
                            {'location': 'https://base.com/bar'}
                        ];
                    })
                    .get('/bar')
                    .reply(function () {
                        expect(this.req.headers['authorization']).not.toBe(firstAuth);
                        return [
                            200,
                            {someKey: 'value'}
                        ];
                    });
                const resp = await api.fetch('/foo');
                const bodyJson = await resp.json();
                expect(bodyJson.someKey).toBe('value');
            });
        });

        describe('when the initial request is a POST with a body and redirects', function () {
            it('correctly follows the redirect and re-signs the request', async function () {
                let firstAuth: string;
                nock('https://base.com')
                    .post('/foo')
                    .reply(function () {
                        firstAuth = this.req.headers["authorization"];
                        return [
                            302,
                            '',
                            {'location': 'https://base.com/bar'}
                        ];
                    })
                    .post('/bar')
                    .reply(function () {
                        expect(this.req.headers['authorization']).not.toBe(firstAuth);
                        return [
                            200,
                            {someKey: 'value'}
                        ];
                    });
                const resp = await api.fetch('/foo', {method: "POST", body: "abc123"});
                const bodyJson = await resp.json();
                expect(bodyJson.someKey).toBe('value');                
            });
        });

        describe('when the initial request fails', function () {
            it('the promise is correctly rejected', async function () {
                nock('https://base.com')
                    .get('/foo')
                    .replyWithError('something awful happened');

                const response = api.fetch('/foo');

                await expect(response).rejects.toThrow(/something awful happened/);
            });
        });
    });
});
