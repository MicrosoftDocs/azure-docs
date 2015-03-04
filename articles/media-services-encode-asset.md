<properties 
	pageTitle="How to Encode an Asset with Azure Media Services" 
	description="Learn how to use the Azure Media Encoder to encode media content on Media Services. Code samples are written in C# and use the Media Services SDK for .NET." 
	services="media-services" 
	documentationCenter="" 
	authors="juliako" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="02/10/2015" 
	ms.author="juliako"/>

#Encoding with Azure Media Services

##Overview

In order to deliver digital video over the internet you must compress the media. Digital video files are quite large and may be too big to deliver over the internet or for your customers’ devices to display properly. People watch videos on a variety of devices from TVs with set-top boxes, desktop PCs to tablets and smartphones. Each of these devices have different bandwidth and compression requirements. Encoding is the process of compressing video and audio using Compressor/Decompressors or codecs. Transcoding is the process of taking a video that has been encoded and re-encode it into a different encoding format. Since most cameras encode video to some degree, most encoding work done on Azure Media Services is technically transcoding.
The quality of encoded\transcoded content is determined by the amount of data that is lost when the content is compressed and decompressed. Many factors affect the loss of data in the compression process, but in general, the more complex the original data and the higher the compression ratio, the more detail is lost in the compression process.

Videos can be encoded to single bitrate or multiple bitrate files. The bitrate of a video is the number of bits recorded per second, usually measured in kilobits/sec or megabits/sec.  When encoding to single bitrate, a single video file is produced at a specified bitrate. When encoding to multiple bitrate, multiple files are created at different bitrates. The number and types of files created depends on the technology used.
Adaptive bitrate technologies allow the video player to determine network conditions and select from among several bitrates. When network conditions degrade, the client can select a lower bitrate allowing the player to continue to play the video at a lower video quality. As network conditions improve the client can switch to a higher bitrate with improved video quality. Media Services supports two adaptive bitrate technologies HTTP Live Streaming and Smooth Streaming. HTTP Live Streaming (HLS) is an adaptive bitrate technology created by Apple. Smooth Streaming is an adaptive bitrate technology created by Microsoft.

By default each Media Services account can have one active encoding task at a time. You can reserve encoding units that allow you to have multiple encoding tasks running concurrently, one for each encoding reserved unit you purchase. For information about scaling encoding units, see the following **Portal** and **.NET** topics.

[AZURE.INCLUDE [media-services-selector-scale-encoding-units](../includes/media-services-selector-scale-encoding-units.md)]


Once a video has been encoded\transcoded it can be placed into different file containers. The process of placing encoded media into a container is called packaging. The following blog explains the difference between encoding and packaging: [Encoding versus Packaging](http://blog-ndrouin.azurewebsites.net/streaming-media-terminology-explained/).


##Encoding and packaging with Azure Media Encoder

The **Azure Media Encoder** is configured using one of the encoder preset strings described [here](https://msdn.microsoft.com/en-us/library/azure/dn619392.aspx).

For information about codecs and formats supported by the **Azure Media Encoder**, see [this](../media-services-azure-media-encoder-formats) topic. 
This section contains topics that describe the encoding and packaging with Media Services.

It is recommended to encode your asset into a set of adaptive MP4 or adaptive smooth streaming files. You can then use [Dynamic Packaging](https://msdn.microsoft.com/en-us/library/azure/jj889436.aspx) to stream your media in one of the following formats: HLS, Smooth Streaming, MPEG-DASH, or HDS. 

Encode with **Azure Media Encoder** using **Azure Management Portal**, **.NET**, or **REST API**.
 
[AZURE.INCLUDE [media-services-selector-encode](../includes/media-services-selector-encode.md)]

Encode with **Dolby Digital Plus**

For more information, see: [Encode with Dolby Digital Plus](../media-services-encode-with-dolby-digital-plus). 


##Related topics

[Controlling Media Service Encoder Output Filenames ](https://msdn.microsoft.com/en-us/library/azure/dn303341.aspx)– Describes the file naming convention used by the Azure Media Encoder and how to modify the output filenames.
[Encoder Guides](https://msdn.microsoft.com/en-us/library/azure/dn535856.aspx)- A collection of topics that help you determine the best encoding for your intended audience.
[Encoding your media with Dolby Digital Plus](https://msdn.microsoft.com/en-us/library/azure/dn296426.aspx) – Describes how to encode audio tracks using Dolby Digital Plus encoding
[Dynamic Packaging](https://msdn.microsoft.com/en-us/library/azure/jj889436.aspx) – Describes how to encode to a single format and dynamically serve Smooth Streaming, Apple HLS, or MPEG-DASH
[Quotas and Limitations](../media-services-quotas-and-limitations) – Describes quotas used and limitations of the Media Services Encoder