<properties 
	pageTitle="Media Encoder Standard formats and codecs" 
	description="This topic gives an overview of Azure Media Encoder Standard formats and codecs." 
	services="media-services" 
	documentationCenter="" 
	authors="juliako" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/08/2015" 
	ms.author="juliako"/>

#Media Encoder Standard Formats and Codecs


This document contains a list of the most common import and export file formats that you can use with Media Encoder Standard.


[Media Encoder Import Formats ](#import_formats)

[Media Encoder Export Formats](#export_formats)


##<a id="import_formats"></a>Media Encoder Import Formats 

The following section lists the codecs and file format that are supported for import.


##Video codecs:

- MPEG-2
- H.264
- YUV420 uncompressed, or mezzanine
- DNxHD
- VC-1/WMV9
- MPEG-4 Part 2
- JPEG 2000
- Theora

###Audio codecs

- PCM
- AAC (AAC-LC, AAC-HE, and AAC-HEv2)
- WMA9/Pro
- MP3 (MPEG-1 Audio Layer 3)
- FLAC
- Opus
- Vorbis
 
###Formats

File format|File Extensions
---|---
FLV (with H.264 and AAC codecs) |.flv
MP4/ISMV|* .ismv
MPEG2-PS, MPEG2-TS, 3GP|.ts, .ps, .3gp
MXF|.mxf
WMV/ASF|.mwv, .asf
DVR-MS|.dvr-ms 
AVI|.avi
Matroska|.mkv
GXF|.gxf
WAVE/WAV |.wav


##<a id="export_formats"></a>Media Encoder Export Formats

The following table lists the codecs and file formats that are supported for export.


File Format|Video Codec|Audio Codec
---|---|---
MP4 (* .mp4)<br/><br/>(including multi-bitrate MP4 containers) |H.264 (High, Main, and Baseline Profiles)|AAC-LC, HE-AAC v1, HE-AAC v2 
MPEG2-TS |H.264 (High, Main, and Baseline Profiles)|AAC-LC, HE-AAC v1, HE-AAC v2 

##See also

[Encoding On-Demand Content with Azure Media Services](media-services-encode-asset.md)
