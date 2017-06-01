var config  = require("../config.json");

/*****************************************************************************\
    Return a set of functions which we can use to log to console
\*****************************************************************************/
module.exports = function() {
    _error = function(message) {
      console.log(config.LogMSG + "ERROR: " + message);
    };
    
    _warn = function(message) {
      console.log(config.LogMSG + "WARNING: " + message);
    };

    _info = function(message) {
      console.log(config.LogMSG + "INFO: " + message);
    };

    _success = function(message) {
      console.log(config.LogMSG + "SUCCESS: " + message);
    };

    return {
        error:    _error,
        warn:     _warn,
        info:     _info,
        success:  _success,
    };
}
