<properties 
	pageTitle="Overview and Comparison of Encoders" 
	description="This topic gives an overview and gives a comparison of Media Services encoders." 
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
	ms.date="08/21/2015"  
	ms.author="juliako"/>

#Overview and Comparison of Encoders

##Overview

Media Services supports the following encoders:

- [Media Encoder Standard](#media_encoder_standard)
- [Azure Media Encoder](#azure_media_encoder)
- [Media Encoder Premium Workflow](#media_encoder_premium_workflow)
	
	**Media Encoder Premium Workflow** is configured using complex workflows. Workflow files could be created using the [Workflow Designer](media-services-workflow-designer.md) tool.

The [following section](#compare_encoders) compares encoding capabilities of supported encoders.

By default each Media Services account can have one active encoding task at a time. You can reserve encoding units that allow you to have multiple encoding tasks running concurrently, one for each encoding reserved unit you purchase. For information about scaling encoding units, see the following **Portal** and **.NET** topics.

[AZURE.INCLUDE [media-services-selector-scale-encoding-units](../../includes/media-services-selector-scale-encoding-units.md)]

##<a id="media_encoder_standard"></a>Media Encoder Standard

[Formats Supported by the Media Encoder Standard](media-services-media-encoder-standard-formats.md)  – Discusses the file and stream formats supported by **Media Encoder Standard**.

**Media Encoder Standard** is configured using one of the encoder presets described [here](http://go.microsoft.com/fwlink/?LinkId=618336) or custom presets that are based on [these](http://go.microsoft.com/fwlink/?LinkId=618336) presets.

For more information, see [this blog](http://azure.microsoft.com/blog/2015/07/16/announcing-the-general-availability-of-media-encoder-standard/).

##<a id="azure_media_encoder"></a>Azure Media Encoder

[Formats Supported by the Media Services Encoder](media-services-azure-media-encoder-formats.md)  – Discusses the file and stream formats supported by **Azure Media Encoder**.

**Azure Media Encoder** is configured using one of the encoder preset strings described [here](https://msdn.microsoft.com/library/azure/dn619392.aspx). You can also get the actual Azure Media Encoder preset files [here](https://github.com/Azure/azure-media-services-samples/tree/master/Encoding%20Presets/VoD/Azure%20Media%20Encoder).

###Example

Encode with **Azure Media Encoder** using **Azure Management Portal**, **.NET**, or **REST API**.
 
[AZURE.INCLUDE [media-services-selector-encode](../../includes/media-services-selector-encode.md)]

####Other related topics

[Dynamic Packaging](https://msdn.microsoft.com/library/azure/jj889436.aspx) – Describes how to encode to adaptive bitrate MP4s and dynamically serve Smooth Streaming, Apple HLS, or MPEG-DASH.

[Controlling Media Service Encoder Output Filenames](https://msdn.microsoft.com/library/azure/dn303341.aspx)– Describes the file naming convention used by Azure Media Encoder and how to modify the output file names.

[Encoding your media with Dolby Digital Plus](media-services-encode-with-dolby-digital-plus.md) – Describes how to encode audio tracks using Dolby Digital Plus encoding.


##<a id="media_encoder_premium_wokrflow"></a>Media Encoder Premium Workflow 

**Note** Media Encoder Premium Workflow media processor discussed in this topic is not available in China. 

[Formats Supported by Media Encoder Premium Workflow](media-services-premium-workflow-encoder-formats.md) – Discusses file formats and codecs supported by **Media Encoder Premium Workflow**.

### Workflow Designer

**Media Encoder Premium Workflow** is configured using complex workflows. Workflow files could be created using the [Workflow Designer](media-services-workflow-designer.md) tool. 

You can get the default workflow files [here](https://github.com/Azure/azure-media-services-samples/tree/master/Encoding%20Presets/VoD/MediaEncoderPremiumWorkfows). The folder also contains the description of these files.

###Example
Encode with **Media Encoder Premium Workflow** using **.NET**. For more information, see [Advanced encoding with Media Encoder Premium Workflow](media-services-encode-with-premium-workflow.md).
 

##<a id="compare_encoders"></a>Compare Encoders

###<a id="billing"></a>Billing meter used by each encoder

Media Processor Name|Applicable Pricing|Notes
---|---|---
**Media Encoder Standard** |ENCODER|Encoding Tasks will be charged according to the size of the output Asset, in GBytes, at the rate specified [here][1], under the ENCODER column.
**Azure Media Encoder** |ENCODER|Encoding Tasks will be charged according to the size of the output Asset, in GBytes, at the rate specified [here][1], under the ENCODER column.
**Media Encoder Premium Workflow** |PREMIUM ENCODER|Encoding Tasks will be charged according to the size of the output Asset, in GBytes, at the rate specified [here][1], under the PREMIUM ENCODER column.


This section compares the encoding capabilities of **Media Encoder Standard**, **Azure Media Encoder**, and **Media Encoder Premium Workflow**.


##Input Container/File Formats

Input Container/File Formats|Media Encoder Premium Workflow|Azure Media Encoder|Media Encoder Standard
---|---|---|---
Adobe® Flash® F4V|Yes|No|Yes
MXF/SMPTE 377M|Yes|Limited|Yes
GXF|Yes|No|Yes
MPEG-2 Transport Streams|Yes|Yes|Yes
MPEG-2 Program Streams|Yes|Yes|Yes
MPEG-4/MP4|Yes|Yes|Yes
Windows Media/ASF|Yes|Yes|Yes
AVI (Uncompressed 8bit/10bit)|Yes|Yes|Yes
3GPP/3GPP2|No|Yes|Yes
Smooth Streaming File Format (PIFF 1.3)|No|Yes|Yes
[Microsoft Digital Video Recording(DVR-MS)](https://msdn.microsoft.com/library/windows/desktop/dd692984)|No|No|Yes
Matroska/WebM|No|No|Yes

##Input Video Codecs

Input Video Codecs|Media Encoder Premium Workflow|Azure Media Encoder|Media Encoder Standard
---|---|---|---
AVC 8-bit/10-bit, up to 4:2:2, including AVCIntra|Yes|Only 8bit 4:2:0|8 bit 4:2:0 and 4:2:2
Avid DNxHD (in MXF)|Yes|No|Yes
DVCPro/DVCProHD (in MXF)|Yes|No|Yes
JPEG2000|Yes|No|Yes
MPEG-2 (up to 422 Profile and High Level; including variants such as XDCAM, XDCAM HD, XDCAM IMX, CableLabs® and D10)|Yes|Up to 422 Profile|Up to 422 Profile
MPEG-1|Yes|Yes|Yes
Windows Media Video/VC-1|Yes|Yes|Yes
Canopus HQ/HQX|No|Yes|No
MPEG-4 Part 2|No|No|Yes
[Theora](https://en.wikipedia.org/wiki/Theora)|No|No|Yes

##Input Audio Codecs

Input Audio Codecs|Media Encoder Premium Workflow|Azure Media Encoder|Media Encoder Standard
---|---|---|---
AES (SMPTE 331M and 302M, AES3-2003)|Yes|No|No
Dolby® E|Yes|No|No
Dolby® Digital (AC3)|Yes|Yes|No
Dolby® Digital Plus (E-AC3)|Yes|No|No
AAC (AAC-LC, AAC-HE, and AAC-HEv2; up to 5.1)|Yes|Yes|Yes
MPEG Layer 2|Yes|Yes|Yes
MP3 (MPEG-1 Audio Layer 3)|Yes|Yes|Yes
Windows Media Audio|Yes|Yes|Yes
WAV/PCM|Yes|Yes|Yes
[FLAC](https://en.wikipedia.org/wiki/FLAC)</a>|No|No|Yes
[Opus](https://en.wikipedia.org/wiki/Opus_(audio_format) |No|No|Yes
[Vorbis](https://en.wikipedia.org/wiki/Vorbis)</a>|No|No|Yes


##Output Container/File Formats

Output Container/File Formats|Media Encoder Premium Workflow|Azure Media Encoder|Media Encoder Standard
---|---|---|---
Adobe® Flash® F4V|Yes|No|No
MXF (OP1a, XDCAM and AS02)|Yes|No|No
DPP (including AS11)|Yes|No|No
GXF|Yes|No|No
MPEG-4/MP4|Yes|Yes|Yes
MPEG-TS|Yes|No|Yes
Windows Media/ASF|Yes|Yes|No
AVI (Uncompressed 8bit/10bit)|Yes|No|No
Smooth Streaming File Format (PIFF 1.3)|Yes|Yes|No

##Output Video Codecs

Output Video Codecs|Media Encoder Premium Workflow|Azure Media Encoder|Media Encoder Standard
---|---|---|---
AVC (H.264; 8-bit; up to High Profile, Level 5.2; 4K Ultra HD; AVC Intra)|Yes|Only 8 bit 4:2:0 up to 1080p|Only 8 bit 4:2:0
Avid DNxHD (in MXF)|Yes|No|No
DVCPro/DVCProHD (in MXF)|Yes|No|No
MPEG-2 (up to 422 Profile and High Level; including variants such as XDCAM, XDCAM HD, XDCAM IMX, CableLabs® and D10)|Yes|No|No
MPEG-1|Yes|No|No
Windows Media Video/VC-1|Yes|Yes|No
JPEG thumbnail creation|Yes|Yes|No

##Output Audio Codecs

Output Audio Codecs|Media Encoder Premium Workflow|Azure Media Encoder|Media Encoder Standard
---|---|---|---
AES (SMPTE 331M and 302M, AES3-2003)|Yes|No|No
Dolby® Digital (AC3)|Yes|Yes|No
Dolby® Digital Plus (E-AC3) up to 7.1|Yes|Up to 5.1|No
AAC (AAC-LC, AAC-HE, and AAC-HEv2; up to 5.1)|Yes|Yes|Yes
MPEG Layer 2|Yes|No|No
MP3 (MPEG-1 Audio Layer 3)|Yes|No|No
Windows Media Audio|Yes|Yes|No

##Related articles

- [Introducing Premium Encoding in Azure Media Services](http://azure.microsoft.com/blog/2015/03/05/introducing-premium-encoding-in-azure-media-services)
- [How to Use Premium Encoding in Azure Media Services](http://azure.microsoft.com/blog/2015/03/06/how-to-use-premium-encoding-in-azure-media-services)
- [Quotas and Limitations](media-services-quotas-and-limitations.md)

 
<!--Reference links in article-->
[1]: http://azure.microsoft.com/pricing/details/media-services/
