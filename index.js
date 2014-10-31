(function (module) {
    module.exports = {
        property: function TransformToProperty(header, property) {
            if (!header) {
                throw new Error('Missing header to transform');
            } else if (typeof header !== 'string') {
                throw new Error('Header must be a string');
            }

            if (!property) {
                throw new Error('Missing property to transform header into');
            } else if (typeof property !== 'string') {
                throw new Error('Property must be a string');
            }

            return function HeaderToProperty(req, res, next) {
                var value = req.header(header);
                if (value) {
                    req[property] = value;
                }
                next();
            };
        },
        header: function TransformToHeader(header, destinationHeader) {
            if (!header) {
                throw new Error('Missing header to transform');
            } else if (typeof header !== 'string') {
                throw new Error('Header must be a string');
            }

            if (!destinationHeader) {
                throw new Error('Missing destination header to transform header into');
            } else if (typeof destinationHeader !== 'string') {
                throw new Error('Destination header must be a string');
            }

            // Express stores headers as all lowercase, so let's do the same.
            destinationHeader = destinationHeader.toLowerCase();

            return function HeaderToHeader(req, res, next) {
                var value = req.header(header);
                if (value) {
                    req.headers[destinationHeader] = value;
                }
                next();
            };
        }
    };
}(module));