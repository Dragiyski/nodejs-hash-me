(function () {
	"use strict";
	var path = require('path'), fs = require('fs'), child_process = require('child_process');
	var args = ['rebuild'], debug = false, complete = false, unexpected = true;
	process.on('exit', function (code) {
		if (!complete && unexpected) {
			console.log('Unexpected early termination. Installation failed.');
			if (code === 0) {
				process.removeAllListeners('exit');
				process.exit(1);
			}
		}
	});
	process.on('uncaughtException', function (err) {

	});
	var ensureDirectory = function (dir, cb) {
		var mkdirp = require('mkdirp');
		mkdirp(dir, function (err) {
			if (err) {
				console.error('Unable to create natives destination directory: ' + dir);
				unexpected = false;
				process.exit(3);
			}
			cb();
		});
	};
	var libgyp = require.resolve('node-gyp');
	if (!libgyp) {
		console.error('Unable to locate node-gyp library.');
		unexpected = false;
		process.exit(2);
	}
	var gyp = path.join(path.dirname(libgyp), '..', 'bin', 'node-gyp.js');
	if (process.config.target_defaults.default_configuration === 'Debug') {
		args.push('--debug');
		debug = true;
	}
	console.log('Attempting to build the natives...');
	var gyp_process = child_process.fork(gyp, args, {
		'cwd': __dirname,
		'env': process.env,
		'silent': false
	});
	gyp_process.on('exit', function (code, signal) {
		if (signal) {
			console.error('Build incomplete due to signal: ' + signal + '.');
			unexpected = false;
			process.exit(1);
		} else {
			if (code !== 0) {
				console.error('Received code ' + code + ' from gyp process.');
				unexpected = false;
				process.exit(code);
			} else {
				var sourcePath = path.join(__dirname, 'build', debug ? 'Debug' : 'Release', 'native.node');
				var targetPath = path.join(__dirname, 'lib', 'native.node');
				ensureDirectory(path.dirname(targetPath), function () {
					var rs = fs.createReadStream(sourcePath);
					var ws = fs.createWriteStream(targetPath);
					console.log('Moving from "' + path.relative(__dirname, sourcePath) + '" to "' + path.relative(__dirname, targetPath) + '".');
					rs.on('end', function () {
						console.log('Natives installed successfully.');
						unexpected = false;
						complete = true;
						process.exit(0);
					}).pipe(ws);
				});
			}
		}
	});
})();