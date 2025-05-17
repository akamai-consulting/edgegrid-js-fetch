import * as helpers from '../src/helpers';


describe('helpers', function () {

    describe('#base64HmacSha256', function () {
        it('returns a base 64 encoded Hmac Sha256 of the message and key it is passed', async function () {
            const hmac = await helpers.base64HmacSha256('message', 'secret');
            expect(hmac).toBe('i19IcCmVwVmMVz2x4hhmqbgl1KeU0WnXBgoDYFeWNgs=');
        });
    });

    describe('#canonicalizeHeaders', function () {
        it('turns the headers into a tab separate string of key/value pairs', function () {
            const canonicalHeaders = helpers.canonicalizeHeaders({
                Foo: 'bar',
                Baz: '  baz\t zoo   '
            });
            expect(canonicalHeaders).toBe('foo:bar\tbaz:baz zoo');
        });
    });

    describe('#dataToSign', function () {
        it('properly formats the request data to sign', async function () {
            expect
            const data = await helpers.dataToSign(new Request('http://example.com/foo'), 'authHeader');
            expect(data).toBe('GET\thttp\texample.com\t/foo\t\t\tauthHeader');
        });
    });

    describe('#signingKey', function () {
        it('returns the proper signing key', async function () {
            const signingKey = await helpers.signingKey('timestamp', 'secret');
            expect(signingKey).toBe('ydMIxJIPPypuUya3KZGJ0qCRwkYcKrFn68Nyvpkf1WY=');
        });
    });

    describe('#isRedirect', function () {
        describe('when it is passed a status code indicating a redirect', function () {
            it('returns true when it is passed a 300', function () {
                expect(helpers.isRedirect(300)).toBe(true);
            });

            it('returns true when it is passed a 301', function () {
                expect(helpers.isRedirect(301)).toBe(true);
            });

            it('returns true when it is passed a 302', function () {
                expect(helpers.isRedirect(302)).toBe(true);
            });

            it('returns true when it is passed a 303', function () {
                expect(helpers.isRedirect(303)).toBe(true);
            });

            it('returns true when it is passed a 307', function () {
                expect(helpers.isRedirect(307)).toBe(true);
            });
        });

        describe('when it is passed a status code that does not indicate a redirect', function () {
            it('returns false when it is passed a 200', function () {
                expect(helpers.isRedirect(200)).toBe(false);
            });
        });
    });
});
