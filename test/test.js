(function (express, should, lib, supertest) {
    describe('Header to Property Negative Tests', function () {
        it('shouldn\'t be able to not provide a header to transform', function() {
            (function() {
                lib.property();
            }).should.throw('Missing header to transform');
        });
        it('shouldn\'t be able to provide a header to transform that isn\'t a string', function() {
            (function() {
                lib.property({});
            }).should.throw('Header must be a string');
        });
        it('shouldn\'t be able to not provide a property', function() {
            (function() {
                lib.property('header');
            }).should.throw('Missing property to transform header into');
        });
        it('shouldn\'t be able to provide a property to that isn\'t a string', function() {
            (function() {
                lib.property('header', {});
            }).should.throw('Property must be a string');
        });
    });

    describe('Header to Header Negative Tests', function () {
        it('shouldn\'t be able to not provide a header to transform', function() {
            (function() {
                lib.header();
            }).should.throw('Missing header to transform');
        });
        it('shouldn\'t be able to provide a header to transform that isn\'t a string', function() {
            (function() {
                lib.header({});
            }).should.throw('Header must be a string');
        });
        it('shouldn\'t be able to not provide a property', function() {
            (function() {
                lib.header('header');
            }).should.throw('Missing destination header to transform header into');
        });
        it('shouldn\'t be able to provide a property to that isn\'t a string', function() {
            (function() {
                lib.header('header', {});
            }).should.throw('Destination header must be a string');
        });
    });

    describe('Transform Header to Property', function () {
        var app;
        before(function () {
            app = express();

            app.use(lib.property('X-HTTP-Method-Override', 'method'));

            app.get('/', function (req, res) {
                res.status(200).send('Get');
            });

            app.post('/', function (req, res) {
                res.status(200).send('Post');
            });

            app.put('/', function (req, res) {
                res.status(200).send('Put');
            });

            app.delete('/', function (req, res) {
                res.status(200).send('Delete');
            });

            app.use(function (req, res, next) {
                res.status(500).end();
            });
        });

        it('should be able to POST without an override to method', function (done) {
            supertest(app).post('/').expect(200, 'Post', done);
        });

        it('should be able to POST with an override to PUT', function (done) {
            supertest(app).post('/').set('X-HTTP-Method-Override', 'PUT').expect(200, 'Put', done);
        });

        it('should be able to GET with an override to PUT', function (done) {
            supertest(app).get('/').set('X-HTTP-Method-Override', 'PUT').expect(200, 'Put', done);
        });

        it('should be able to PUT with an override to POST', function (done) {
            supertest(app).put('/').set('X-HTTP-Method-Override', 'POST').expect(200, 'Post', done);
        });

        it('should be able to DELETE with an override to POST', function (done) {
            supertest(app).delete('/').set('X-HTTP-Method-Override', 'PUT').expect(200, 'Put', done);
        });
    });

    describe('Transform Header to Header', function () {
        var app;
        before(function () {
            app = express();

            app.use(lib.header('X-Accept', 'Accept'));

            app.get('/', function (req, res) {
                res.format(
                    {
                        json: function () {
                            res.status(200).send({status: 'Get Success!'});
                        },
                        default: function () {
                            res.status(418).end();
                        }
                    }
                );
            });

            app.post('/', function (req, res) {
                res.format(
                    {
                        default: function () {
                            res.status(418).end();
                        },
                        json: function () {
                            res.status(200).send({status: 'Post Success!'});
                        }
                    }
                );
            });

            app.put('/', function (req, res) {
                res.format(
                    {
                        default: function () {
                            res.status(418).end();
                        },
                        json: function () {
                            res.status(200).send({status: 'Put Success!'});
                        }
                    }
                );
            });

            app.use(function (req, res, next) {
                res.status(500).end();
            });
        });

        it('should be able to GET without an override to Accept', function (done) {
            supertest(app).get('/').set('Accept', 'text/html').expect(418, done);
        });

        it('should be able to GET with an override to Accept Json', function (done) {
            supertest(app).get('/').set('X-Accept', 'application/json').expect(200, {status: 'Get Success!'}, done);
        });

        it('should be able to GET with an override to Accept HTML', function (done) {
            supertest(app).get('/').set('X-Accept', 'text/html').expect(418, done);
        });

        it('should be able to POST with an override to Accept Json', function (done) {
            supertest(app).post('/').set('X-Accept', 'application/json').expect(200, {status: 'Post Success!'}, done);
        });

        it('should be able to POST with an override to Accept XML', function (done) {
            supertest(app).post('/').set('X-Accept', 'application/xml').expect(418, done);
        });

        it('should be able to PUT with an override to Accept Json', function (done) {
            supertest(app).put('/').set('X-Accept', 'application/json').expect(200, {status: 'Put Success!'}, done);
        });

        it('should be able to PUT with an override to Accept text/*', function (done) {
            supertest(app).put('/').set('X-Accept', 'text/*').expect(418, done);
        });
    });
}(require('express'), require('should'), require('../'), require('supertest')));