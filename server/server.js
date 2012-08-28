var require = __meteor_bootstrap__.require;
var childProcess = require('child_process');

Meteor.methods({
  fork: function () {
	childProcess.fork('slave.js');
  }
});
