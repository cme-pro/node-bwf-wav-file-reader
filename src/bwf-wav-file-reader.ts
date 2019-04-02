import * as fs from 'fs';

const supportedAudioFormatCodes = [
  1, // Wav
  2, // Wav
  3, // ?
  22127, // Vorbis ?? (issue #11)
  65534, // Extensible PCM
];

const WAV_INAM_CHUNCK_LEN = 64;
const WAV_ISFT_CHUNCK_LEN = 32;
const WAV_IART_CHUNCK_LEN = 24;

const BWF_DESCRIPTION_LEN = 256;
const BWF_ORIGINATOR_LEN = 32;
const BWF_ORIGINATOR_REF_LEN = 32;
const BWF_ORIGINATOR_DAT_LEN = 10;
const BWF_ORIGINATOR_TIM_LEN = 8;

type InterfaceRead = [string, 'string' | 'int16' | 'int32' | 'uint16' | 'uint32', number];

interface InterfaceResult {
  chunkId?: string;
  chunkSize?: number;
  format?: string;
  subChunkFormatId?: string;
  subChunkFormatSize?: string;
  audioFormat?: number;
  numChannels?: number;
  sampleRate?: number;
  byteRate?: number;
  blockAlign?: number;
  bitsPerSample?: number;
  subChunkListId?: string;
  subChunkListSize?: number;
  subChunkInfoId?: string;
  subChunkInamId?: string;
  subChunkInamSize?: number;
  subChunkInamData?: string;
  subChunkIsftId?: string;
  subChunkIsftSize?: number;
  subChunkIsftData?: string;
  subChunkIartId?: string;
  subChunkIartSize?: number;
  subChunkIartData?: string;
  subChunkBextId?: string;
  subChunkBextSize?: number;
  Description?: string;
  Originator?: string;
  OriginatorReference?: string;
  OriginationDate?: string;
  OriginationTime?: string;
  TimeReferenceLow?: number;
  TimeReferenceHigh?: number;
  Version?: number;
  UMID?: string;
  LoudnessValue?: number;
  LoudnessRange?: number;
  MaxTruePeakLevel?: number;
  MaxMomentaryLoudness?: number;
  MaxShortTermLoudness?: number;
}

interface InterfaceReturn {
  error?: boolean;
  invalidReasons?: string[];
  duration?: number;
  result: InterfaceResult;
  stats: any;
}

const READS: InterfaceRead[] = [
  // Riff Wave Header
  ['chunkId', 'string', 4], // 0-3 (4 octets) : Constante «RIFF»  (0x52,0x49,0x46,0x46)
  ['chunkSize', 'int32', 4], // 4-7 (4 octets) : Taille du fichier moins 8 octets
  ['format', 'string', 4], // 8-11 (4 octets) : Format = «WAVE»  (0x57,0x41,0x56,0x45)

  // Format Subchunk
  ['subChunkFormatId', 'string', 4], // 12-15 (4 octets) : Identifiant «fmt »  (0x66,0x6D, 0x74,0x20)
  ['subChunkFormatSize', 'int32', 4], // 16-19 (4 octets) : Nombre d'octets du bloc - 16  (0x10)
  ['audioFormat', 'uint16', 2], // 20-21 (2 octets) : Format du stockage dans le fichier (1: PCM, ...)
  ['numChannels', 'uint16', 2], // 22-23 (2 octets) : Nombre de canaux (de 1 à 6)
  ['sampleRate', 'int32', 4], // 24-27 (4 octets) : Fréquence d'échantillonnage (en hertz)
  ['byteRate', 'int32', 4], // 28-31 (4 octets) : Nombre d'octets à lire par seconde (c.-à-d., Frequence * BytePerBloc).
  ['blockAlign', 'uint16', 2], // 32-33 (2 octets) : Nombre d'octets par bloc d'échantillonnage (tous canaux confondus : NbrCanaux * BitsPerSample/8).
  ['bitsPerSample', 'uint16', 2], // 34-35 (2 octets) : Nombre de bits utilisés pour le codage de chaque échantillon (8, 16, 24)

  // format List chunck
  ['subChunkListId', 'string', 4], // 36-39 (4 octets) : Constante «LIST»
  ['subChunkListSize', 'int32', 4], // 40-43 (4 octets) : Nombre d'octets du bloc
  // format Info chunck
  ['subChunkInfoId', 'string', 4], // 44-47 (4 octets) : Constante «INFO»

  // format INAM chunck
  ['subChunkInamId', 'string', 4], // 48-51 (4 octets) : Constante «INAM»
  ['subChunkInamSize', 'int32', 4], // 52-55 (4 octets) : Nombre d'octets du bloc
  ['subChunkInamData', 'string', WAV_INAM_CHUNCK_LEN], // 56-119 (64 octets) : Session name contained in Inam chunck

  // format ISFT chunck
  ['subChunkIsftId', 'string', 4], // 120-123 (4 octets) : Constante «ISFT»
  ['subChunkIsftSize', 'int32', 4], // 124-127 (4 octets) : Nombre d'octets du bloc
  ['subChunkIsftData', 'string', WAV_ISFT_CHUNCK_LEN], // 128-159 (32 octets) : Device name contained in ISFT chunck

  // format IART chunck
  ['subChunkIartId', 'string', 4],
  ['subChunkIartSize', 'int32', 4],
  ['subChunkIartData', 'string', WAV_IART_CHUNCK_LEN],

  // // format bext chunck
  ['subChunkBextId', 'string', 4],
  ['subChunkBextSize', 'int32', 4],

  ['Description', 'string', BWF_DESCRIPTION_LEN], // 000-255 Description of the sound sequence
  ['Originator', 'string', BWF_ORIGINATOR_LEN], // 256-287 Name of the originator
  ['OriginatorReference', 'string', BWF_ORIGINATOR_REF_LEN], // 288-319 Reference of the originator
  ['OriginationDate', 'string', BWF_ORIGINATOR_DAT_LEN], // 320-329 yyyy:mm:dd
  ['OriginationTime', 'string', BWF_ORIGINATOR_TIM_LEN], // 330-337 hh:mm:ss
  ['TimeReferenceLow', 'uint32', 4], // 342-345 First sample count since midnight LSB
  ['TimeReferenceHigh', 'uint32', 4], // 338-341 First sample count since midnight MSB

  ['Version', 'uint16', 2], // 346-347 Version of the BWF; unsigned binary number
  ['UMID', 'string', 64], // 348-411 Binary byte 0-63 of SMPTE UMID (LSB first)

  ['LoudnessValue', 'uint16', 2], // 412-413 Integrated Loudness Value of the file in LUFS (multiplied by 100)
  ['LoudnessRange', 'uint16', 2], // Loudness Range of the file in LU (multiplied by 100)
  ['MaxTruePeakLevel', 'uint16', 2], // Maximum True Peak Level of the file expressed as dBTP (multiplied by 100)
  ['MaxMomentaryLoudness', 'uint16', 2], // Highest value of the Momentary Loudness Level of the file in LUFS (multiplied by 100)
  ['MaxShortTermLoudness', 'uint16', 2], // Highest value of the Short-Term Loudness Level of the file in LUFS (multiplied by 100)

  // TODO read rest of data based on BWF version -> PR accepted
  // uint8_t Reserved[BWF_RESERVED_FIELD_LEN];// 180 bytes, reserved for future use, set to “NULL”
  // char CodingHistory[64+2];// History coding (JDS set to fixed size, realign on 4 bytes)
];

const postProcess = (stats: any, readResult: InterfaceResult, cb: (err: any, result: InterfaceReturn) => void) => {
  let error = false;
  const invalidReasons = [];

  if (readResult.chunkId !== 'RIFF') invalidReasons.push('Expected "RIFF" string at 0');
  if (readResult.format !== 'WAVE') invalidReasons.push('Expected "WAVE" string at 4');
  if (readResult.subChunkFormatId !== 'fmt ') invalidReasons.push('Expected "fmt " string at 8');
  if (readResult.chunkSize + 8 !== stats.size) invalidReasons.push('chunkSize does not match file size');
  if (!supportedAudioFormatCodes.includes(readResult.audioFormat)) invalidReasons.push('Unknown format: ' + readResult.audioFormat);
  if (invalidReasons.length > 0) error = true;

  if (error) {
    return cb(new Error(invalidReasons.join(';')), {
      error: true,
      invalidReasons,
      result: readResult,
      stats: stats,
    });
  }

  return cb(null, {
    duration: readResult.chunkSize / (readResult.sampleRate * readResult.numChannels * (readResult.bitsPerSample / 8)),
    result: readResult,
    stats: stats,
  });
};

export const read = (filename: string, cb: (err: any, result?: any) => void) => {
  const stats = fs.statSync(filename);
  const bufferSize = READS.reduce((acc, [, , size]) => acc + size, 0);
  const buffer = Buffer.alloc(bufferSize);

  fs.open(filename, 'r', (openErr: any, fd: any) => {
    if (openErr) {
      console.error(openErr);
      return cb(openErr);
    }

    const readResult: InterfaceResult = {};
    fs.read(fd, buffer, 0, bufferSize, 0, (err: any) => {
      if (err) {
        console.error(err);
        return cb(err);
      }

      let i = 0;
      let pointer = 0;

      const readBwf = () => {
        const [name, type, value] = READS[i];
        i++;
        if (type === 'string') {
          readResult[name] = buffer.toString('ascii', pointer, pointer + value).replace(/\0/g, '');
        } else if (type === 'uint16') {
          readResult[name] = buffer.readUInt16LE(pointer);
        } else if (type === 'int32') {
          readResult[name] = buffer.readInt32LE(pointer);
        } else if (type === 'uint32') {
          readResult[name] = buffer.readUInt32LE(pointer);
        }
        pointer += value;

        if (i < READS.length) {
          return readBwf();
        }

        return fs.close(fd, () => postProcess(stats, readResult, cb));
      };

      return readBwf();
    });
  });
};

export const readSync = async (filename: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    read(filename, (err, info) => {
      if (err) reject(err);
      resolve(info);
    });
  });
};
