# transform-header

[![NPM version](https://badge.fury.io/js/transform-header.svg)](http://badge.fury.io/js/transform-header)
[![Build Status](https://travis-ci.org/DavidTPate/transform-header.svg?branch=master)](https://travis-ci.org/DavidTPate/transform-header)
[![Code Climate](https://codeclimate.com/github/DavidTPate/transform-header/badges/gpa.svg)](https://codeclimate.com/github/DavidTPate/transform-header)
[![Test Coverage](https://codeclimate.com/github/DavidTPate/transform-header/badges/coverage.svg)](https://codeclimate.com/github/DavidTPate/transform-header)

Express Middleware for Transform a Header to either a Request Property or another Header.

## Install

### NPM
```bash
$ npm install transform-header
```

## Node.js
```js
var express    = require('express');
var requestType = require('transform-header');

var app = express();

app.use(transformHeader.property('X-HTTP-Method-Override', 'method'));
app.use(transformHeader.header('X-Accept', 'Accept'));

```

## License

  [MIT](LICENSE)