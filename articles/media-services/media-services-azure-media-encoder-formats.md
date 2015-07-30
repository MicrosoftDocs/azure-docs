<properties 
	pageTitle="Azure Media Encoder formats and codecs" 
	description="This topic gives an overview of Azure Media Encoder formats and codecs." 
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
	ms.date="06/29/2015" 
	ms.author="juliako"/>

#Azure Media Encoder formats and codecs

Encoders compress digital media using codecs. Encoders typically have various settings that allow you to specify properties of the media generated for example, the codecs used, file format, resolution, and bitrate. File formats are containers that hold the compressed video as well as information about what codecs were used to compress the video. 

Codecs have two components: one to compress digital media files for transmission and the other to decompress digital media files for playback. There are audio codecs that compress and decompress audio and video codecs that compress and decompress video. Codecs can use lossless or lossy compression. Lossless codecs preserve all of the information when compression occurs. When the file is decompressed, the result is a file that is identical to the input media, making lossless codecs well suited to archiving and storage. Lossy codecs lose some of the information when encoding and produce smaller files (than the original) at the cost of video quality and are well suited to streaming over the internet. The two main codecs used by the Azure Media Encoder to encode are H.264 and VC-1. Other codecs may be available in our partner ecosystem of encoders.

It is important to understand the difference between codecs and file formats. Codecs are the software that implements the compression/decompression algorithms whereas file formats are containers that hold the compressed video. For more information, see [Encoding versus Packaging](http://blog-ndrouin.azurewebsites.net/streaming-media-terminology-explained/).

This document contains a list of the most common import and export file formats that you can use with Azure Media Encoder.


[Azure Media Encoder Import Formats ](#import_formats)

[Azure Media Encoder Export Formats](#export_formats)


##<a id="import_formats"></a>Azure Media Encoder Import Formats 

The following section lists the codecs and file format that are supported for import.

###Video Codecs

- H.264 (Baseline, Main, and High Profiles)
- MPEG-1 (Including MPEG-PS)
- MPEG-2 (Simple and Main Profile and 4:2:2 Profile)
- MPEG-4 v2 (Simple Visual Profile and Advanced Simple Profile)
- VC-1 (Simple, Main, and Advanced Profiles)
- Windows Media Video (Simple, Main, and Advanced Profiles)
- DV (DVC, DVHD, DVSD, DVSL)
- Grass Valley HQ/HQX
 
###Audio Codecs

- AC-3 (Dolby Digital audio)
- AAC (AAC-LC, HE-AAC v1 with AAC-LC core, and HE-AAC v2 with AAC-LC core)
- MP3
- Windows Media Audio 9 (Windows Media Audio Standard, Windows Media Audio Professional, and Windows Media Audio Lossless)

###Video File Formats
 
File format|File Extensions
---|---
3GPP, 3GPP2|.3gp, .3g2, .3gp2
Advanced Systems Format (ASF)|.asf
Advanced Video Coding High Definition (AVCHD) [MPEG-2 Transport Stream]|.mts, .m2ts
Audio-Video Interleaved (AVI)|.avi
Digital camcorder MPEG-2 (MOD)|.mod
DVD transport stream (TS) file|.ts
DVD video object (VOB) file|.vob
Expression Encoder Screen Capture Codec file|.xesc
MP4|.mp4
MPEG-1 System Stream|.mpeg, .mpg
MPEG-2 video file|.m2v
Smooth Streaming File Format (PIFF 1.3)|.ismv
Windows Media Video (WMV)|.wmv


Some uncompressed formats are supported. For more information, see [Supported Uncompressed Video Formats](#uncompressed)

###Audio File Formats

File Format|File Extensions
---|---
AC-3 (Dolby Digital) audio|.ac3
Audio Interchange File Format (AIFF)|.aiff
Broadcast Wave Format|.bwf
MP3 (MPEG-1 Audio Layer 3)|.mp3
MP4 audio|.m4A
MPEG-4 audio book|.m4b
WAVE file|.wav
Windows Media Audio|.wma

###Image File Formats

File Format|File Extensions
---|---
Bitmap|.bmp
GIF, Animated GIF|.gif
JPEG|.jpeg, .jpg
PNG|.png
TIFF|.tif
WPF Canvas XAML|.xaml


##<a id="export_formats"></a>Azure Media Encoder Export Formats

The following table lists the codecs and file formats that are supported for export.


File Format|Video Codec|Audio Codec
---|---
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
