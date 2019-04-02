# BWF and WAV File Reader for Node.JS

A lightweight module that parses WAV or BWF information data from a wav file into a Javascript Object. Basically retrieves file and header meta data information from a WAV or BWF file.

## Used for:

- Determining the validity of a .wav or .bwf file
- Detecting the bit depth / bit rate / bits per sample of a .wav or .bwf file
- Detecting the Sample Rate of a .wav or .bwf file
- Detecting the number of channels in a .wav or .bwf file
- Retrieving the file information, including file size, created date etc

## Node usage

```
npm install node-bwf-wav-file-reader --save
```

Sync:

```javascript
const { read: readBwf } = require('node-bwf-wav-file-reader');

readBwf('./test/audio.bwf', function(err, info) {
  if (err) console.error(err, info);
  else console.log(info);
});
```

or async

```javascript
const { readSync: readSyncBwf } = require('node-bwf-wav-file-reader');

(async () => {
  const info = await readSyncBwf();
  console.log(info);
})();
```

### Result

```
{ duration: 27.391986111111112,
  result:
   { chunkId: 'RIFF',
     chunkSize: 15777784,
     format: 'WAVE',
     subChunkFormatId: 'fmt ',
     subChunkFormatSize: 16,
     audioFormat: 1,
     numChannels: 2,
     sampleRate: 96000,
     byteRate: 576000,
     blockAlign: 6,
     bitsPerSample: 24,
     subChunkListId: 'LIST',
     subChunkListSize: 148,
     subChunkInfoId: 'INFO',
     subChunkInamId: 'INAM',
     subChunkInamSize: 64,
     subChunkInamData: 'mySession',
     subChunkIsftId: 'ISFT',
     subChunkIsftSize: 32,
     subChunkIsftData: 'myDevice',
     subChunkIartId: 'IART',
     subChunkIartSize: 24,
     subChunkIartData: '0000CC089DC40A2',
     subChunkBextId: 'bext',
     subChunkBextSize: 668,
     Description: 'mySession|0000CC089DC40A24|400',
     Originator: 'myDevice',
     OriginatorReference: 'CNCMECC089DC40A24155730911358306',
     OriginationDate: '2019-03-22',
     OriginationTime: '15:57:30',
     TimeReferenceLow: 3281795072,
     TimeReferenceHigh: 0,
     Version: 2,
     UMID: '',
     LoudnessValue: 0,
     LoudnessRange: 0,
     MaxTruePeakLevel: 0,
     MaxMomentaryLoudness: 0,
     MaxShortTermLoudness: 0 },
  stats:
   Stats {
     dev: 16777220,
     mode: 33188,
     nlink: 1,
     uid: 501,
     gid: 20,
     rdev: 0,
     blksize: 4096,
     ino: 8644128473,
     size: 15777792,
     blocks: 30816,
     atimeMs: 1554189495295.2056,
     mtimeMs: 1553863606437.2336,
     ctimeMs: 1554189504022.6528,
     birthtimeMs: 1553863606313.1821,
     atime: 2019-04-02T07:18:15.295Z,
     mtime: 2019-03-29T12:46:46.437Z,
     ctime: 2019-04-02T07:18:24.023Z,
     birthtime: 2019-03-29T12:46:46.313Z } }
```

Duration is in seconds. Stats comes from Node raw fs.statSync() result.

### Errors

if `err` is not null, the WAV file is valid.

```
{ error: true,
  invalid_reasons:
   [ 'Expected "RIFF" string at 0',
     'Expected "WAVE" string at 4',
     'Expected "fmt " string at 8',
     'Unknwon format: 25711',
     'chunk_size does not match file size' ] }
```

## Command line usage

From the command line you can run:

```
node bwfr.js ./test/audio.bwf
```

### TODO

- need to support different version of BWF to display correctly the coding history

### Thanks

- @rackfx for his work on the [Node WAV File Info](https://github.com/rackfx/Node-WAV-File-Info)

### Contribute

- reach me :-)
- Or submit a PR
