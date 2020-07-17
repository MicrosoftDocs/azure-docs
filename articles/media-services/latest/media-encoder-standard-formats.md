---
title: Standard Encoder formats and codecs - Azure
description: This article contains a list of the most common import and export file formats that you can use with StandardEncoderPreset.
services: media-services
documentationcenter: ''
author: juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/10/2019
ms.author: juliako
ms.reviewer: anilmur

---
# Standard Encoder formats and codecs

This article contains a list of the most common import and export file formats that you can use with [StandardEncoderPreset](https://docs.microsoft.com/rest/api/media/transforms/createorupdate#standardencoderpreset). For information on how to create custom presets using **StandardEncoderPreset**, see [Create a transform with a custom preset](customize-encoder-presets-how-to.md).

## Input container/file formats

| File formats (file extensions) | Supported |
| --- | --- |
| FLV (with H.264 and AAC codecs) (.flv) |Yes |
| MXF    (.mxf) |Yes |
| GXF    (.gxf) |Yes |
| MPEG2-PS, MPEG2-TS, 3GP (.ts, .ps, .3gp, .3gpp, .mpg) |Yes |
| Windows Media Video (WMV)/ASF (.wmv, .asf) |Yes |
| AVI (Uncompressed 8bit/10bit) (.avi) |Yes |
| MP4 (.mp4, .m4a, .m4v)/ISMV (.isma, .ismv) |Yes |
| [Microsoft Digital Video Recording(DVR-MS)](https://msdn.microsoft.com/library/windows/desktop/dd692984) (.dvr-ms) |Yes |
| Matroska/WebM (.mkv) |Yes |
| WAVE/WAV (.wav) |Yes |
| QuickTime (.mov) |Yes |

### Audio formats in input containers

Standard Encoder supports carrying the following audio formats in input containers:

* MXF, GXF, and QuickTime files, which have audio tracks with interleaved stereo or 5.1 samples

or

* MXF, GXF, and QuickTime files where the audio is carried as separate PCM tracks but the channel mapping (to stereo or 5.1) can be deduced from the file metadata

## Input video codecs
| Input video codecs | Supported |
| --- | --- |
| AVC 8-bit/10-bit, up to 4:2:2, including AVCIntra |8 bit 4:2:0 and 4:2:2 |
| Avid DNxHD (in MXF) |Yes |
| DVCPro/DVCProHD (in MXF) |Yes |
| Digital video (DV) (in AVI files) |Yes |
| JPEG 2000 |Yes |
| MPEG-2 (up to 422 Profile and High Level; including variants such as XDCAM, XDCAM HD, XDCAM IMX, CableLabs®, and D10) |Up to 422 Profile |
| MPEG-1 |Yes |
| VC-1/WMV9 |Yes |
| Canopus HQ/HQX |No |
| MPEG-4 Part 2 |Yes |
| [Theora](https://en.wikipedia.org/wiki/Theora) |Yes |
| YUV420 uncompressed, or mezzanine |Yes |
| Apple ProRes 422 |Yes |
| Apple ProRes 422 LT |Yes |
| Apple ProRes 422 HQ |Yes |
| Apple ProRes Proxy |Yes |
| Apple ProRes 4444 |Yes |
| Apple ProRes 4444 XQ |Yes |
| HEVC/H.265| Main Profile|

## Input audio codecs
| Input Audio Codecs | Supported |
| --- | --- |
| AAC (AAC-LC, AAC-HE, and AAC-HEv2; up to 5.1) |Yes |
| MPEG Layer 2 |Yes |
| MP3 (MPEG-1 Audio Layer 3) |Yes |
| Windows Media Audio |Yes |
| WAV/PCM |Yes |
| [FLAC](https://en.wikipedia.org/wiki/FLAC)</a> |Yes |
| [Opus](https://go.microsoft.com/fwlink/?LinkId=822667) |Yes |
| [Vorbis](https://en.wikipedia.org/wiki/Vorbis)</a> |Yes |
| AMR (adaptive multi-rate) |Yes |
| AES (SMPTE 331M and 302M, AES3-2003) |No |
| Dolby® E |No |
| Dolby® Digital (AC3) |No |
| Dolby® Digital Plus (E-AC3) |No |

## Output formats and codecs
The following table lists the codecs and file formats that are supported for export.

| File Format | Video Codec | Audio Codec |
| --- | --- | --- |
| MP4 <br/><br/>(including multi-bitrate MP4 containers) |H.264 (High, Main, and Baseline Profiles) |AAC-LC, HE-AAC v1, HE-AAC v2 |
| MPEG2-TS |H.264 (High, Main, and Baseline Profiles) |AAC-LC, HE-AAC v1, HE-AAC v2 |

## Next steps

[Create a transform with a custom preset](customize-encoder-presets-how-to.md)
