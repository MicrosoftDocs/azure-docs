<properties 
	pageTitle="Azure Media Encoder formats and codecs" 
	description="This topic gives an overview of Azure Media Encoder formats and codecs." 
	services="media-services" 
	documentationCenter="" 
	authors="juliako,anilmur" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="10/15/2015"  
	ms.author="juliako"/>

#Azure Media Encoder formats and codecs

This document contains a list of the most common input and output file formats and codecs that you can use with Azure Media Encoder.


##Input file formats (containers)
 
File format (file extensions)|Supported
---|---
3GPP, 3GPP2 (.3gp, .3g2, .3gp2)	|Yes
Advanced Systems Format (ASF) (.asf)	|Yes
Advanced Video Coding High Definition (AVCHD) [ MPEG-2 Transport Stream ] (.mts, .m2ts)	|Yes
Audio-Video Interleaved (AVI) (.avi)	|Yes
Digital camcorder MPEG-2 (MOD) (.mod)	|Yes
DVD transport stream (TS) file (.ts)	|Yes
DVD video object (VOB) file (.vob)	|Yes
Expression Encoder Screen Capture Codec file (.xesc)	|Yes
MP4 (.mp4, .m4a, .m4v)/ISMV (.isma, .ismv)	|Yes
MPEG-1 System Stream (.mpeg, .mpg)	|Yes
MPEG-2 video file (.m2v)	|Yes
Windows Media Video (WMV) (.wmv)	|Yes
AC-3 (Dolby Digital) audio(.ac3)|Yes
Audio Interchange File Format (AIFF)(.aiff)|Yes
Broadcast Wave Format(.bwf)|Yes
MP3 (MPEG-1 Audio Layer 3)(.mp3)|Yes
MPEG-4 audio book(.m4b)|Yes
WAVE file(.wav)|Yes
Windows Media Audio(.wma)|Yes
Adobe® Flash® F4V			|No		
MXF/SMPTE 377M				|Limited 
GXF							|No		 
[Microsoft Digital Video Recording(DVR-MS)](https://msdn.microsoft.com/library/windows/desktop/dd692984)|No
Matroska/WebM				|No


Some uncompressed formats are supported. For more information, see [Supported Uncompressed Video Formats](#uncompressed)

##Input video Codecs

Input Video Codecs|Supported
---|--- 
H.264 (Baseline, Main, and High Profiles)			|Yes
AVC 8-bit/10-bit, up to 4:2:2, including AVCIntra	|Only 8bit 4:2:0
Avid DNxHD (in MXF)									|No
DVCPro/DVCProHD (in MXF)							|No
JPEG2000											|No
MPEG-2 (Simple and Main Profile and 4:2:2 Profile)	|Up to 4:2:2 Profile
MPEG-1 (Including MPEG-PS)							|Yes
Windows Media Video/VC-1							|Yes
Canopus HQ/HQX										|Yes
MPEG-4 v2 (Simple Visual Profile and Advanced Simple Profile)	|Yes
[Theora](https://en.wikipedia.org/wiki/Theora)		|No
VC-1 (Simple, Main, and Advanced Profiles)			|Yes
Windows Media Video (Simple, Main, and Advanced Profiles)	|Yes
DV (DVC, DVHD, DVSD, DVSL)							|Yes
Grass Valley HQ/HQX									|Yes
 

##Input audio Codecs

Input Audio Codecs|Supported
---|---
AES (SMPTE 331M and 302M, AES3-2003)		|No
Dolby® E									|No
Dolby® Digital (AC3)						|Yes
Dolby® Digital Plus (E-AC3)					|No
AAC (AAC-LC, HE-AAC v1 with AAC-LC core, and HE-AAC v2 with AAC-LC core; up to 5.1)|Yes
MPEG Layer 2|Yes|Yes|Yes
MP3 (MPEG-1 Audio Layer 3)|Yes
Windows Media Audio 9 (Windows Media Audio Standard, Windows Media Audio Professional, and Windows Media Audio Lossless)	|Yes
WAV/PCM|Yes
[FLAC](https://en.wikipedia.org/wiki/FLAC)|No
[Opus](https://en.wikipedia.org/wiki/Opus_(audio_format) |No
[Vorbis](https://en.wikipedia.org/wiki/Vorbis)|No


##Input image file formats

File Format (file extensions) | Supported
---|---
Bitmap (.bmp) | Yes
GIF, Animated GIF (.gif)| Yes
JPEG (.jpeg, .jpg)| Yes
PNG (.png)| Yes
TIFF (.tif)| Yes
WPF Canvas XAML (.xaml)| Yes


##Output Formats and codecs

The following table lists the codecs and file formats that are supported for export.

File Format|Video Codec|Audio Codec
---|---|---
Windows Media (* .wmv; * .wma)|VC-1 (Advanced, Main, and Simple Profiles)|Windows Media Audio Standard, Windows Media Audio Professional, Windows Media Audio Voice, Windows Media Audio Lossless
MP4 (* .mp4)|H.264 (High, Main, and Baseline Profiles)|AAC-LC, HE-AAC v1, HE-AAC v2, Dolby Digital Plus
Smooth Streaming File Format (PIFF 1.1) (* .ismv; * .isma)|VC-1 (Advanced Profile)<p>H.264 (High, Main, and Baseline Profiles) |Windows Media Audio Standard, Windows Media Audio Professional<p><p>AAC-LC, HE-AAC v1, HE-AAC v2

For additional supported codecs and filters in Media Services, see [Windows DirectShow Filters](https://msdn.microsoft.com/library/windows/desktop/dd375464.aspx).

##<a id="uncompressed"></a>Supported Uncompressed Video Formats 

Azure Media Services provides support for importing uncompressed video data.

This is a partial list of the supported uncompressed formats.

Uncompressed Video Format|Description
---|---
Standard YVU9 format uncompressed data|A planar YUV format. A Y sample at every pixel, a U and V sample at every fourth pixel horizontally on each line; a Y sample on every vertical line, a U and V sample at every fourth vertical line.9 bits per pixel.
YUV 411 format data|A Y sample at every pixel, a U and V sample at every fourth pixel horizontally on each line; every vertical line sampled. Byte ordering (lowest first) is U0, Y0, V0, Y1, U4, Y2, V4, Y3, Y4, Y5, Y6, Y7, where the suffix 0 is the leftmost pixel and increasing numbers are pixels increasing left to right. Each 12-byte block is 8 image pixels.
Y41P format data|A Y sample at every pixel, a U and V sample at every fourth pixel horizontally on each line; every vertical line sampled.Byte ordering (lowest first) is U0, Y0, V0, Y1, U4, Y2, V4, Y3, Y4, Y5, Y6, Y7, where the suffix 0 is the leftmost pixel and increasing numbers are pixels increasing left to right. Each 12-byte block is 8 image pixels.
YUY2 format data|Same as UYVY but with different pixel ordering. Byte ordering (lowest first) is Y0, U0, Y1, V0, Y2, U2, Y3, V2, Y4, U4, Y5, V4, where the suffix 0 is the leftmost pixel and increasing numbers are pixels increasing left to right. Each 4-byte block is 2 image pixels.
YVYU format data|A packed YUV format. Same as UYVY but with different pixel ordering. Byte ordering (lowest first) is Y0, V0, Y1, U0, Y2, V2, Y3, U2, Y4, V4, Y5, U4, where the suffix 0 is the leftmost pixel and increasing numbers are pixels increasing left to right. Each 4-byte block is 2 image pixels.
UYVY format data|A packed YUV format. A Y sample at every pixel, a U and V sample at every second pixel horizontally on each line; every vertical line sampled. Most popular of the various YUV 4:2:2 formats. Byte ordering (lowest first) is U0, Y0, V0, Y1, U2, Y2, V2, Y3, U4, Y4, V4, Y5, where the suffix 0 is the leftmost pixel and increasing numbers are pixels increasing left to right. Each 4-byte block is 2 image pixels.
YUV 211 format data|A packed YUV format. A Y sample at every second pixel, a U and V sample at every fourth pixel horizontally on each line; every vertical line sampled.Byte ordering (lowest first) is Y0, U0, Y2, V0, Y4, U4, Y6, V4, Y8, U8, Y10, V8, where the suffix 0 is the leftmost pixel and increasing numbers are pixels increasing left to right. Each 4-byte block is 4 image pixels.
Cirrus Logic Jr YUV 411 format|Cirrus Logic Jr YUV 411 format with less than 8 bits per Y, U, and V sample. A Y sample at every pixel, a U and V sample at every fourth pixel horizontally on each line; every vertical line sampled.
Indeo-produced YVU9 format|Indeo-produced YVU9 format with additional information about differences from the last frame. 9.5 bits per pixel but reported as 9.


##Media Services learning paths

You can view AMS learning paths here:

- [AMS Live Streaming Workflow](http://azure.microsoft.com/documentation/learning-paths/media-services-streaming-live/)
- [AMS on Demand Streaming Workflow](http://azure.microsoft.com/documentation/learning-paths/media-services-streaming-on-demand/)