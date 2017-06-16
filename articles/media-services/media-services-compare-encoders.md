---
title: Comparison of Azure on demand media encoders | Microsoft Docs
description: This topic compares the encoding capabilities of **Media Encoder Standard** and **Media Encoder Premium Workflow**.
services: media-services
documentationcenter: ''
author: juliako
manager: erikre
editor: ''

ms.assetid: a79437c0-4832-423a-bca8-82632b2c47cc
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/27/2017
ms.author: juliako

---

# Comparison of Azure on demand media encoders

This topic compares the encoding capabilities of **Media Encoder Standard** and **Media Encoder Premium Workflow**.

### <a id="billing"></a>Billing meter used by each encoder
| Media Processor Name | Applicable Pricing | Notes |
| --- | --- | --- |
| **Media Encoder Standard** |ENCODER |Encoding Tasks will be charged based on the total duration, in minutes, of all the media files produced as output, at the rate specified [here][1], under the ENCODER column. |
| **Media Encoder Premium Workflow** |PREMIUM ENCODER |Encoding Tasks will be charged based on the total duration, in minutes, of all the media files produced as output, at the rate specified [here][1], under the PREMIUM ENCODER column. |

### Input Container/File Formats
| Input Container/File Formats | Media Encoder Standard | Media Encoder Premium Workflow |
| --- | --- | --- |
| Adobe® Flash® F4V |Yes |Yes |
| MXF/SMPTE 377M |Yes |Yes |
| GXF |Yes |Yes |
| MPEG-2 Transport Streams |Yes |Yes |
| MPEG-2 Program Streams |Yes |Yes |
| MPEG-4/MP4 |Yes |Yes |
| Windows Media/ASF |Yes |Yes |
| AVI (Uncompressed 8bit/10bit) |Yes |Yes |
| 3GPP/3GPP2 |Yes |No |
| Smooth Streaming File Format (PIFF 1.3) |Yes |No |
| [Microsoft Digital Video Recording(DVR-MS)](https://msdn.microsoft.com/library/windows/desktop/dd692984) |Yes |No |
| Matroska/WebM |Yes |No |
| QuickTime (.mov) |Yes |No |

### Input Video Codecs
| Input Video Codecs | Media Encoder Standard | Media Encoder Premium Workflow |
| --- | --- | --- |
| AVC 8-bit/10-bit, up to 4:2:2, including AVCIntra |8 bit 4:2:0 and 4:2:2 |Yes |
| Avid DNxHD (in MXF) |Yes |Yes |
| DVCPro/DVCProHD (in MXF) |Yes |Yes |
| JPEG2000 |Yes |Yes |
| MPEG-2 (up to 422 Profile and High Level; including variants such as XDCAM, XDCAM HD, XDCAM IMX, CableLabs® and D10) |Up to 422 Profile |Yes |
| MPEG-1 |Yes |Yes |
| Windows Media Video/VC-1 |Yes |Yes |
| Canopus HQ/HQX |No |No |
| MPEG-4 Part 2 |Yes |No |
| [Theora](https://en.wikipedia.org/wiki/Theora) |Yes |No |
| Apple ProRes 422 |Yes |No |
| Apple ProRes 422 LT |Yes |No |
| Apple ProRes 422 HQ |Yes |No |
| Apple ProRes Proxy |Yes |No |
| Apple ProRes 4444 |Yes |No |
| Apple ProRes 4444 XQ |Yes |No |

### Input Audio Codecs
| Input Audio Codecs | Media Encoder Standard | Media Encoder Premium Workflow |
| --- | --- | --- |
| AES (SMPTE 331M and 302M, AES3-2003) |No |Yes |
| Dolby® E |No |Yes |
| Dolby® Digital (AC3) |No |Yes |
| Dolby® Digital Plus (E-AC3) |No |Yes |
| AAC (AAC-LC, AAC-HE, and AAC-HEv2; up to 5.1) |Yes |Yes |
| MPEG Layer 2 |Yes |Yes |
| MP3 (MPEG-1 Audio Layer 3) |Yes |Yes |
| Windows Media Audio |Yes |Yes |
| WAV/PCM |Yes |Yes |
| [FLAC](https://en.wikipedia.org/wiki/FLAC)</a> |Yes |No |
| [Opus](https://en.wikipedia.org/wiki/Opus_\(audio_format\)) |Yes |No |
| [Vorbis](https://en.wikipedia.org/wiki/Vorbis)</a> |Yes |No |

### Output Container/File Formats
| Output Container/File Formats | Media Encoder Standard | Media Encoder Premium Workflow |
| --- | --- | --- |
| Adobe® Flash® F4V |No |Yes |
| MXF (OP1a, XDCAM and AS02) |No |Yes |
| DPP (including AS11) |No |Yes |
| GXF |No |Yes |
| MPEG-4/MP4 |Yes |Yes |
| MPEG-TS |Yes |Yes |
| Windows Media/ASF |No |Yes |
| AVI (Uncompressed 8bit/10bit) |No |Yes |
| Smooth Streaming File Format (PIFF 1.3) |No |Yes |

### Output Video Codecs
| Output Video Codecs | Media Encoder Standard | Media Encoder Premium Workflow |
| --- | --- | --- |
| AVC (H.264; 8-bit; up to High Profile, Level 5.2; 4K Ultra HD; AVC Intra) |Only 8 bit 4:2:0 |Yes |
| Avid DNxHD (in MXF) |No |Yes |
| MPEG-2 (up to 422 Profile and High Level; including variants such as XDCAM, XDCAM HD, XDCAM IMX, CableLabs® and D10) |No |Yes |
| MPEG-1 |No |Yes |
| Windows Media Video/VC-1 |No |Yes |
| JPEG thumbnail creation |Yes |Yes |
| PNG thumbnail creation |Yes |Yes |
| BMP thumbnail creation |Yes |No |

### Output Audio Codecs
| Output Audio Codecs | Media Encoder Standard | Media Encoder Premium Workflow |
| --- | --- | --- |
| AES (SMPTE 331M and 302M, AES3-2003) |No |Yes |
| Dolby® Digital (AC3) |No |Yes |
| Dolby® Digital Plus (E-AC3) up to 7.1 |No |Yes |
| AAC (AAC-LC, AAC-HE, and AAC-HEv2; up to 5.1) |Yes |Yes |
| MPEG Layer 2 |No |Yes |
| MP3 (MPEG-1 Audio Layer 3) |No |Yes |
| Windows Media Audio |No |Yes |

>[!NOTE]
>If you encode to Dolby® Digital (AC3), the output can only be written into an ISO MP4 file.

## Media Services learning paths
[!INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]

## Related articles
* [Perform advanced encoding tasks by customizing Media Encoder Standard presets](media-services-custom-mes-presets-with-dotnet.md)
* [Quotas and Limitations](media-services-quotas-and-limitations.md)

<!--Reference links in article-->
[1]: http://azure.microsoft.com/pricing/details/media-services/
