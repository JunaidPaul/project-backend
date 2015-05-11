var winston = require("winston");

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: 'info',
            colorize: true
        }),
        new (winston.transports.File)({
            level: 'debug',
            filename: './log/logfile.log'
        })
    ]
});

module.exports = logger;
