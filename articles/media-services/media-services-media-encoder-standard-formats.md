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

<table border="1">
<tr><th>File format</th><th>File Extensions</th></tr>
<tr><td>FLV (with H.264 and AAC codecs) </td><td>.flv</td></tr>
<tr><td>MP4/ISMV</td><td>*.ismv</td></tr>
<tr><td>MPEG2-PS, MPEG2-TS, 3GP</td><td>.ts, .ps, .3gp</td></tr>
<tr><td>MXF</td><td>.mxf</td></tr>
<tr><td>WMV/ASF</td><td>.mwv, .asf</td></tr>
<tr><td>DVR-MS</td><td>.dvr-ms </td></tr>
<tr><td>AVI</td><td>.avi</td></tr>
<tr><td>Matroska</td><td>.mkv</td></tr>
<tr><td>GXF</td><td>.gxf</td></tr>
<tr><td>WAVE/WAV </td><td>.wav</td></tr>
</table>

##<a id="export_formats"></a>Media Encoder Export Formats

The following table lists the codecs and file formats that are supported for export.


<table border="1">
<tr><th>File Format</th><th>Video Codec</th><th>Audio Codec</th></tr>
<tr><td>MP4 (*.mp4)<br/><br/>(including multi-bitrate MP4 containers) </td><td>H.264 (High, Main, and Baseline Profiles)</td><td>AAC-LC, HE-AAC v1, HE-AAC v2 </td></tr>
<tr><td>MPEG2-TS </td><td>H.264 (High, Main, and Baseline Profiles)</td><td>AAC-LC, HE-AAC v1, HE-AAC v2 </td></tr>
</table>

##See also

[Encoding On-Demand Content with Azure Media Services](media-services-encode-asset.md)
