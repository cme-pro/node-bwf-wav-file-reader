const { readSync: readSyncBwf, read: readBwf } = require('./bwf-wav-file-reader');

const FILE_PATH = './test/audio.bwf';
const DURATION = 27.391986111111112;
const RESULT = {
  chunkId: 'RIFF',
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
  MaxShortTermLoudness: 0,
};
const RESULT_KEYS = Object.keys(RESULT);

test('read bwf file with async', async () => {
  const info = await readSyncBwf(FILE_PATH);

  expect(info.duration).toBe(DURATION);

  for (var i = 0; i < RESULT_KEYS.length; i++) {
    const key = RESULT_KEYS[i];
    const val = RESULT[key];
    expect(info.result[key]).toBe(RESULT[key]);
  }
});

test('read bwf file with cb', async done => {
  readBwf('./test/audio.bwf', function(err, info) {
    expect(info.duration).toBe(DURATION);

    for (var i = 0; i < RESULT_KEYS.length; i++) {
      const key = RESULT_KEYS[i];
      const val = RESULT[key];
      expect(info.result[key]).toBe(RESULT[key]);
    }
    done();
  });
});
