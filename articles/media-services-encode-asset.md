<properties 
	pageTitle="Encoding On-Demand Content with Azure Media Services" 
	description="This topic gives an overview of encoding of On-Demand content with Media Services." 
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
	ms.date="03/05/2015" 
	ms.author="juliako"/>

#Encoding On-Demand Content with Azure Media Services

This topic is part of the [Media Services Video-on-Demand Workflow](media-services-video-on-demand-workflow.md).

##Overview

Media Services supports the following encoders:

- [Azure Media Encoder](#azure_media_encoder)
- [Media Encoder Premium Workflow](#media_encoder_premium_workflow) (public preview)

The [following section](#compare_encoders) compares encoding capabilities of both encoders.

By default each Media Services account can have one active encoding task at a time. You can reserve encoding units that allow you to have multiple encoding tasks running concurrently, one for each encoding reserved unit you purchase. For information about scaling encoding units, see the following **Portal** and **.NET** topics.

[AZURE.INCLUDE [media-services-selector-scale-encoding-units](../includes/media-services-selector-scale-encoding-units.md)]

##<a id="azure_media_encoder"></a>Azure Media Encoder

[Formats Supported by the Media Services Encoder](media-services-azure-media-encoder-formats.md)  – Discusses the file and stream formats supported by **Azure Media Encoder**.

**Azure Media Encoder** is configured using one of the encoder preset strings described [here](https://msdn.microsoft.com/library/azure/dn619392.aspx). You can also get the actual Azure Media Encoder preset files [here](https://github.com/Azure/azure-media-services-samples/tree/master/Encoding%20Presets/VoD/Azure%20Media%20Encoder).

Encode with **Azure Media Encoder** using **Azure Management Portal**, **.NET**, or **REST API**.
 
[AZURE.INCLUDE [media-services-selector-encode](../includes/media-services-selector-encode.md)]

####Other related topics

[Dynamic Packaging](https://msdn.microsoft.com/library/azure/jj889436.aspx) – Describes how to encode to adaptive bitrate MP4s and dynamically serve Smooth Streaming, Apple HLS, or MPEG-DASH.

[Controlling Media Service Encoder Output Filenames](https://msdn.microsoft.com/library/azure/dn303341.aspx)– Describes the file naming convention used by Azure Media Encoder and how to modify the output file names.

[Encoding your media with Dolby Digital Plus](media-services-encode-with-dolby-digital-plus.md) – Describes how to encode audio tracks using Dolby Digital Plus encoding.


##<a id="media_encoder_premium_wokrflow"></a>Media Encoder Premium Workflow (public preview)

**Note** Media Encoder Premium Workflow media processor discussed in this topic is not available in China. 

[Formats Supported by Media Encoder Premium Workflow](media-services-premium-workflow-encoder-formats.md) – Discusses file formats and codecs supported by **Media Encoder Premium Workflow**.

**Media Encoder Premium Workflow** is configured using complex workflows. Workflow files could be created using the [Workflow Designer](media-services-workflow-designer.md) tool. 

You can get the default workflow files [here](https://github.com/Azure/azure-media-services-samples/tree/master/Encoding%20Presets/VoD/MediaEncoderPremiumWorkfows). The folder also contains the description of these files.

Encode with **Media Encoder Premium Workflow** using **.NET**. For more information, see [Advanced encoding with Media Encoder Premium Workflow](media-services-encode-with-premium-workflow.md).
 

##<a id="compare_encoders"></a>Compare Encoders

This section compares the encoding capabilities of **Azure Media Encoder** and **Media Encoder Premium Workflow**.

###Input formats

Input Container/File Formats

<table border="1">
<tr><th>Input Container/File Formats</th><th>Media Encoder Premium Workflow</th><th>Azure Media Encoder
</th></tr>
<tr><td>Adobe® Flash® F4V</td><td>Yes</td><td>No</td></tr>
<tr><td>MXF/SMPTE 377M</td><td>Yes</td><td>Limited</td></tr>
<tr><td>GXF</td><td>Yes</td><td>No</td></tr>
<tr><td>MPEG-2 Transport Streams</td><td>Yes</td><td>Yes</td></tr>
<tr><td>MPEG-2 Program Streams</td><td>Yes</td><td>Yes</td></tr>
<tr><td>MPEG-4/MP4</td><td>Yes</td><td>Yes</td></tr>
<tr><td>Windows Media/ASF</td><td>Yes</td><td>Yes</td></tr>
<tr><td>AVI (Uncompressed 8bit/10bit)</td><td>Yes</td><td>Yes</td></tr>
<tr><td>3GPP/3GPP2</td><td>No</td><td>Yes</td></tr>
<tr><td>Smooth Streaming File Format (PIFF 1.3)</td><td>No</td><td>Yes</td></tr>
</table>

Input Video Codecs

<table border="1">
<tr><th>Input Video Codecs</th><th>Media Encoder Premium Workflow</th><th>Azure Media Encoder
</th></tr>
<tr><td>AVC 8-bit/10-bit, up to 4:2:2, including AVCIntra</td><td>Yes</td><td>Only 8bit 4:2:0</td></tr>
<tr><td>Avid DNxHD (in MXF)</td><td>Yes</td><td>No</td></tr>
<tr><td>DVCPro/DVCProHD (in MXF)</td><td>Yes</td><td>No</td></tr>
<tr><td>JPEG2000</td><td>Yes</td><td>No</td></tr>
<tr><td>MPEG-2 (up to 422 Profile and High Level; including variants such as XDCAM, XDCAM HD, XDCAM IMX, CableLabs® and D10)</td><td>Yes</td><td>Up to 422 Profile</td></tr>
<tr><td>MPEG-1</td><td>Yes</td><td>Yes</td></tr>
<tr><td>Windows Media Video/VC-1</td><td>Yes</td><td>Yes</td></tr>
<tr><td>Canopus HQ/HQX</td><td>No</td><td>Yes</td></tr>
</table>

Input Audio Codecs

<table border="1">
<tr><th>Input Audio Codecs</th><th>Media Encoder Premium Workflow</th><th>Azure Media Encoder
</th></tr>
<tr><td>AES (SMPTE 331M and 302M, AES3-2003)</td><td>Yes</td><td>No</td></tr>
<tr><td>Dolby® E</td><td>Yes</td><td>No</td></tr>
<tr><td>Dolby® Digital (AC3)</td><td>Yes</td><td>Yes</td></tr>
<tr><td>Dolby® Digital Plus (E-AC3)</td><td>Yes</td><td>No</td></tr>
<tr><td>AAC (AAC-LC, AAC-HE, and AAC-HEv2; up to 5.1)</td><td>Yes</td><td>Yes</td></tr>
<tr><td>MPEG Layer 2</td><td>Yes</td><td>Yes</td></tr>
<tr><td>MP3 (MPEG-1 Audio Layer 3)</td><td>Yes</td><td>Yes</td></tr>
<tr><td>Windows Media Audio</td><td>Yes</td><td>Yes</td></tr>
<tr><td>WAV/PCM</td><td>Yes</td><td>Yes</td></tr>
</table>

###Output formats

Output Container/File Formats

<table border="1">
<tr><th>Output Container/File Formats</th><th>Media Encoder Premium Workflow</th><th>Azure Media Encoder
</th></tr>
<tr><td>Adobe® Flash® F4V</td><td>Yes</td><td>No</td></tr>
<tr><td>MXF (OP1a, XDCAM and AS02)</td><td>Yes</td><td>No</td></tr>
<tr><td>DPP (including AS11)</td><td>Yes</td><td>No</td></tr>
<tr><td>GXF</td><td>Yes</td><td>No</td></tr>
<tr><td>MPEG-4/MP4</td><td>Yes</td><td>Yes</td></tr>
<tr><td>Windows Media/ASF</td><td>Yes</td><td>Yes</td></tr>
<tr><td>AVI (Uncompressed 8bit/10bit)</td><td>Yes</td><td>No</td></tr>
<tr><td>Smooth Streaming File Format (PIFF 1.3)</td><td>Yes</td><td>Yes</td></tr>
</table>

Output Video Codecs

<table border="1">
<tr><th>Output Video Codecs</th><th>Media Encoder Premium Workflow</th><th>Azure Media Encoder
</th></tr>
<tr><td>AVC (H.264; 8-bit; up to High Profile, Level 5.2; 4K Ultra HD; AVC Intra)</td><td>Yes</td><td>Only 8bit 4:2:0 up to 1080p</td></tr>
<tr><td>Avid DNxHD (in MXF)</td><td>Yes</td><td>No</td></tr>
<tr><td>DVCPro/DVCProHD (in MXF)</td><td>Yes</td><td>No</td></tr>
<tr><td>MPEG-2 (up to 422 Profile and High Level; including variants such as XDCAM, XDCAM HD, XDCAM IMX, CableLabs® and D10)</td><td>Yes</td><td>No</td></tr>
<tr><td>MPEG-1</td><td>Yes</td><td>No</td></tr>
<tr><td>Windows Media Video/VC-1</td><td>Yes</td><td>Yes</td></tr>
<tr><td>JPEG thumbnail creation</td><td>Yes</td><td>Yes</td></tr>
</table>

Output Audio Codecs

<table border="1">
<tr><th>Output Audio Codecs</th><th>Media Encoder Premium Workflow</th><th>Azure Media Encoder
</th></tr>
<tr><td>AES (SMPTE 331M and 302M, AES3-2003)</td><td>Yes</td><td>No</td></tr>
<tr><td>Dolby® Digital (AC3)</td><td>Yes</td><td>Yes</td></tr>
<tr><td>Dolby® Digital Plus (E-AC3) up to 7.1</td><td>Yes</td><td>Up to 5.1</td></tr>
<tr><td>AAC (AAC-LC, AAC-HE, and AAC-HEv2; up to 5.1)</td><td>Yes</td><td>Yes</td></tr>
<tr><td>MPEG Layer 2</td><td>Yes</td><td>No</td></tr>
<tr><td>MP3 (MPEG-1 Audio Layer 3)</td><td>Yes</td><td>No</td></tr>
<tr><td>Windows Media Audio</td><td>Yes</td><td>Yes</td></tr>
</table>
##Related articles

- [Introducing Premium Encoding in Azure Media Services](http://azure.microsoft.com/blog/2015/03/05/introducing-premium-encoding-in-azure-media-services)
- [How to Use Premium Encoding in Azure Media Services](http://azure.microsoft.com/blog/2015/03/06/how-to-use-premium-encoding-in-azure-media-services)
- [Quotas and Limitations](media-services-quotas-and-limitations.md)

