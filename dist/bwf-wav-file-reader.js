"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
var fs = require("fs");
var supportedAudioFormatCodes = [
    1,
    2,
    3,
    22127,
    65534,
];
var WAV_INAM_CHUNCK_LEN = 64;
var WAV_ISFT_CHUNCK_LEN = 32;
var WAV_IART_CHUNCK_LEN = 24;
var BWF_DESCRIPTION_LEN = 256;
var BWF_ORIGINATOR_LEN = 32;
var BWF_ORIGINATOR_REF_LEN = 32;
var BWF_ORIGINATOR_DAT_LEN = 10;
var BWF_ORIGINATOR_TIM_LEN = 8;
var READS = [
    // Riff Wave Header
    ['chunkId', 'string', 4],
    ['chunkSize', 'int32', 4],
    ['format', 'string', 4],
    // Format Subchunk
    ['subChunkFormatId', 'string', 4],
    ['subChunkFormatSize', 'int32', 4],
    ['audioFormat', 'uint16', 2],
    ['numChannels', 'uint16', 2],
    ['sampleRate', 'int32', 4],
    ['byteRate', 'int32', 4],
    ['blockAlign', 'uint16', 2],
    ['bitsPerSample', 'uint16', 2],
    // format List chunck
    ['subChunkListId', 'string', 4],
    ['subChunkListSize', 'int32', 4],
    // format Info chunck
    ['subChunkInfoId', 'string', 4],
    // format INAM chunck
    ['subChunkInamId', 'string', 4],
    ['subChunkInamSize', 'int32', 4],
    ['subChunkInamData', 'string', WAV_INAM_CHUNCK_LEN],
    // format ISFT chunck
    ['subChunkIsftId', 'string', 4],
    ['subChunkIsftSize', 'int32', 4],
    ['subChunkIsftData', 'string', WAV_ISFT_CHUNCK_LEN],
    // format IART chunck
    ['subChunkIartId', 'string', 4],
    ['subChunkIartSize', 'int32', 4],
    ['subChunkIartData', 'string', WAV_IART_CHUNCK_LEN],
    // // format bext chunck
    ['subChunkBextId', 'string', 4],
    ['subChunkBextSize', 'int32', 4],
    ['Description', 'string', BWF_DESCRIPTION_LEN],
    ['Originator', 'string', BWF_ORIGINATOR_LEN],
    ['OriginatorReference', 'string', BWF_ORIGINATOR_REF_LEN],
    ['OriginationDate', 'string', BWF_ORIGINATOR_DAT_LEN],
    ['OriginationTime', 'string', BWF_ORIGINATOR_TIM_LEN],
    ['TimeReferenceLow', 'uint32', 4],
    ['TimeReferenceHigh', 'uint32', 4],
    ['Version', 'uint16', 2],
    ['UMID', 'string', 64],
    ['LoudnessValue', 'uint16', 2],
    ['LoudnessRange', 'uint16', 2],
    ['MaxTruePeakLevel', 'uint16', 2],
    ['MaxMomentaryLoudness', 'uint16', 2],
    ['MaxShortTermLoudness', 'uint16', 2],
];
var postProcess = function (stats, readResult, cb) {
    var error = false;
    var invalidReasons = [];
    if (readResult.chunkId !== 'RIFF')
        invalidReasons.push('Expected "RIFF" string at 0');
    if (readResult.format !== 'WAVE')
        invalidReasons.push('Expected "WAVE" string at 4');
    if (readResult.subChunkFormatId !== 'fmt ')
        invalidReasons.push('Expected "fmt " string at 8');
    if (readResult.chunkSize + 8 !== stats.size)
        invalidReasons.push('chunkSize does not match file size');
    if (!supportedAudioFormatCodes.includes(readResult.audioFormat))
        invalidReasons.push('Unknown format: ' + readResult.audioFormat);
    if (invalidReasons.length > 0)
        error = true;
    if (error) {
        return cb(new Error(invalidReasons.join(';')), {
            error: true,
            invalidReasons: invalidReasons,
            result: readResult,
            stats: stats
        });
    }
    return cb(null, {
        duration: readResult.chunkSize / (readResult.sampleRate * readResult.numChannels * (readResult.bitsPerSample / 8)),
        result: readResult,
        stats: stats
    });
};
exports.read = function (filename, cb) {
    var stats = fs.statSync(filename);
    var bufferSize = READS.reduce(function (acc, _a) {
        var size = _a[2];
        return acc + size;
    }, 0);
    var buffer = Buffer.alloc(bufferSize);
    fs.open(filename, 'r', function (openErr, fd) {
        if (openErr) {
            console.error(openErr);
            return cb(openErr);
        }
        var readResult = {};
        fs.read(fd, buffer, 0, bufferSize, 0, function (err) {
            if (err) {
                console.error(err);
                return cb(err);
            }
            var i = 0;
            var pointer = 0;
            var readBwf = function () {
                var _a = READS[i], name = _a[0], type = _a[1], value = _a[2];
                i++;
                if (type === 'string') {
                    readResult[name] = buffer.toString('ascii', pointer, pointer + value).replace(/\0/g, '');
                }
                else if (type === 'uint16') {
                    readResult[name] = buffer.readUInt16LE(pointer);
                }
                else if (type === 'int32') {
                    readResult[name] = buffer.readInt32LE(pointer);
                }
                else if (type === 'uint32') {
                    readResult[name] = buffer.readUInt32LE(pointer);
                }
                pointer += value;
                if (i < READS.length) {
                    return readBwf();
                }
                return fs.close(fd, function () { return postProcess(stats, readResult, cb); });
            };
            return readBwf();
        });
    });
};
exports.readSync = function (filename) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                exports.read(filename, function (err, info) {
                    if (err)
                        reject(err);
                    resolve(info);
                });
            })];
    });
}); };
