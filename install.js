(function () {
	"use strict";
	var path = require('path'), fs = require('fs'), os = require('os'), child_process = require('child_process');
	var args = ['rebuild'], debug = false, complete = false, unexpected = true;
	process.on('exit', function (code) {
		if (!complete && unexpected) {
			console.error('[hash-me]: Unexpected early termination. Installation failed.');
			if (code === 0) {
				process.removeAllListeners('exit');
				process.exit(1);
			}
		}
	});
	process.on('uncaughtException', function (err) {
		console.error('[hash-me]: Uncaught exception: ' + err.name + ': ' + err.message + os.EOL + err.stack);
		process.exit(1);
	});
	var ensureDirectory = function (dir, cb) {
		var mkdirp = require('mkdirp');
		mkdirp(dir, function (err) {
			if (err) {
				console.error('[hash-me]: Unable to create natives destination directory: ' + dir);
				unexpected = false;
				process.exit(3);
			}
			cb();
		});
	};
	var copyFile = function(src, dest, cb) {
		var rs = fs.createReadStream(src), ws = fs.createWriteStream(dest);
		console.log('[hash-me]: Copy from "' + path.relative(__dirname, src) + '" to "' + path.relative(__dirname, dest) + '".');
		rs.on('end', cb).on('error', function(err) {
			console.error('[hash-me]: Unable to copy from "' + path.relative(__dirname, src) + '" to "' + path.relative(__dirname, dest) + '": ' + err.message);
			process.exit(4);
		}).pipe(ws);
	};
	var libgyp = require.resolve('node-gyp');
	if (!libgyp) {
		console.error('[hash-me]: Unable to locate node-gyp library.');
		unexpected = false;
		process.exit(2);
	}
	var gyp = path.join(path.dirname(libgyp), '..', 'bin', 'node-gyp.js');
	if (process.config.target_defaults.default_configuration === 'Debug') {
		args.push('--debug');
		debug = true;
	}
	console.log('[hash-me]: Attempting to build the natives...');
	var gyp_action = function() {
		var gyp_process = child_process.fork(gyp, args, {
			'cwd': __dirname,
			'env': process.env,
			'silent': false
		});
		gyp_process.on('exit', function (code, signal) {
			if (signal) {
				console.error('[hash-me]: Build incomplete due to signal: ' + signal + '.');
				unexpected = false;
				process.exit(1);
			} else {
				if (code !== 0) {
					console.error('[hash-me]: Received code ' + code + ' from gyp process.');
					unexpected = false;
					process.exit(code);
				} else {
					var sourcePath = path.join(__dirname, 'build', debug ? 'Debug' : 'Release', 'native.node');
					var targetPath = path.join(__dirname, 'lib', 'native.node');
					ensureDirectory(path.dirname(targetPath), function () {
						copyFile(sourcePath, targetPath, function() {
							fs.unlink(path.join(__dirname, 'src', 'ObjectHash.cxx') , function () {
								//Error from unlink ignored.
								console.log('[hash-me]: Natives installed successfully.');
								unexpected = false;
								complete = true;
								process.exit(0);
							});
						});
					});
				}
			}
		});
	};
	var currentVersion = process.versions.v8.split('.');
	//Check if 3.20 or later
	if(currentVersion[0] > 3 || (currentVersion[0] == 3 && currentVersion[1] >= 20)) {
		return copyFile(path.join(__dirname, 'src', 'ObjectHash-3.20.cxx'), path.join(__dirname, 'src', 'ObjectHash.cxx'), gyp_action);
	} else {
		return copyFile(path.join(__dirname, 'src', 'ObjectHash-legacy.cxx'), path.join(__dirname, 'src', 'ObjectHash.cxx'), gyp_action);
	}
})();