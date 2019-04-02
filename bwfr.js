var { read: readBwf } = require('./dist/bwf-wav-file-reader.js');

var [, , filename] = process.argv;

readBwf(filename, function(err, info) {
  if (err) console.log(err, info);
  else console.log(info);
});
