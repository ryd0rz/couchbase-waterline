var connections = {};
var couchbase = require("couchbase");
var ottoman = require("ottoman");

var Connection = module.exports = function Connection(config, cb) {
  var self = this;

  // Hold the config object
  this.config = config || {};

  // Build Database connection
  this._buildConnection(function(err, db) {
    if(err) return cb(err);
    if(!db) return cb(new Error('no db object'));

    // Store the DB object
    self.ottoman = db;

    // Return the connection
    cb(null, self);
  });
};

Connection.prototype._buildConnection = function _buildConnection(cb) {

  var host = this.config.host;
  var bucketPassword = this.config.bucketPassword;
  var username = this.config.username;
  var password = this.config.password;

  var cluster = new couchbase.Cluster('couchbase://' + host);
  cluster.authenticate(username, password);
  ottoman.bucket = cluster.openBucket(this.config.bucket, bucketPassword, function(err){
    if (err) {
      console.error('Error Connecting CouchBase: %j', err);
      cb(err);
    }
    else {
      cb(null, ottoman);
    }
  });

}
