<properties 
	pageTitle="How to Encode an Asset using Azure Media Encoder" 
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

#Encoding with Azure Media Encoder

##Overview

Encoding is the process of taking a video and compressing it into a format that can be consumed by your customers. Your customers may be using any number of devices to watch your videos: PC's, Macs, smart phones, tablets, XBox consoles, set-top boxes, or connected TVs.  Each of these devices have features that affect the encoding used.  Smart phones have small screens and little storage, tablets have larger screens but less storage space when compared with PC and so on.  If you have not already decided what device or devices you are targeting, see Choosing Your Media Experience. When choosing the encoding for a video be sure to keep in mind all of the devices you want your customers to be able to use. In some cases you may want to have multiple encodings to enable the best possible experience on a range of devices.


After your media has been uploaded into Azure Media Services you can encode it into one of Formats Supported by the Media Services Encoder. 

##Encoding with Azure Media Encoder

It is recommended to encode your asset into a set of adaptive MP4 or adaptive smooth streaming files. You can then use [Dynamic Packaging](https://msdn.microsoft.com/en-us/library/azure/jj889436.aspx) to stream your media in one of the following formats: HLS, Smooth Streaming, MPEG-DASH, or HDS. 

For more information, see [Delivering Content](https://msdn.microsoft.com/en-us/library/azure/hh973618.aspx).

###Encoding Concepts

Transcoding is the process of taking a video that has been encoded and re-encoding it into a different encoding format. Since most cameras encode video to some degree, most encoding work done on Azure Media Services is technically transcoding.
Videos can be encoded to single bitrate or multiple bitrate files. The bitrate of a video is the number of bits recorded per second, usually measured in kilobits/sec or megabits/sec.  When encoding to single bitrate, a single video file is produced at a specified bitrate. When encoding to multiple bitrate, multiple files are created at different bitrates. The number and types of files created depends on the technology used.
Adaptive bitrate technologies allow the video player to determine network conditions and select from among several bitrates. When network conditions degrade, the client can select a lower bitrate allowing the player to continue to play the video at a lower video quality. As network conditions improve the client can switch to a higher bitrate with improved video quality. Media Services supports two adaptive bitrate technologies HTTP Live Streaming and Smooth Streaming. HTTP Live Streaming (HLS) is an adaptive bitrate technology created by Apple. Smooth Streaming is an adaptive bitrate technology created by Microsoft.

By default each Media Services account can have one active encoding task at a time. You can reserve encoding units that allow you to have multiple encoding tasks running concurrently, one for each encoding reserved unit you purchase. For more information on Encoding Reserved Units, see How to Scale a Media Service.

###Dynamic Packaging

Media Services allows you to encode your video once and convert it in real-time to the format requested by the client. This functionality, called Dynamic Packaging, requires that you purchase On-Demand Streaming Reserve Units). On-Demand Streaming Reserved Units provide dedicated egress capacity that can be purchased in increments of 200 megabits per second. For more information about On-Demand Streaming Reserved Units, see How to Scale a Media Service.

When using Dynamic Packaging, your video is stored in one encoded format, usually an adaptive bitrate MP4 file. When a video player requests the video 
it specifies the format it requires. The Origin Service converts the MP4 adaptive bitrate file to the format requested by the player. This allows you to store only one format of your videos, reducing the storage costs. Dynamic Packaging is the preferred method of publishing your video. For more information about Dynamic Packaging, see Introduction to Dynamic Packaging.

###Encoder Configuration

The Azure Media Encoder is a component of Media Services that encodes/transcodes video. The Azure Media Encoder is configured using one of the encoder preset strings. Each preset specifies a group of settings required for the encoder. For a comprehensive list of all the presets see Updating Reserved Unit Type and Increasing Encoding RUs.
If you want to use single bitrate streaming, use one of the "BroadBand" presets such as VC1 Broadband 1080p or H264 Broadband 720p. There are presets for both VC1 Broadband and H264 Broadband for HD and SD video. Choose the one that best fits your needs.
If you want to use adaptive bitrate streaming, use one of the adaptive bitrate presets such as H264 Adaptive Bitrate MP4 Set 1080p or H264 Adaptive Bitrate MP4 Set 720p. The Media Services Encoder generates a set of files, each at a different bitrate. If you want more control over the bitrates used, you can encode a video to whatever bitrates you want to use and combine them into MP4 or Smooth Streaming files by using the Media Packager. The Media Packager takes an encoded video and converts it into a different format. For more information about using the Media Packager, see [Packaging Media with Azure Media Services][Package]

Encoder presets can be broken down into two groups: device specific presets and general presets. The video encoded with device specific presets is designed to be used by a specific type of device, for example smart phone, or gaming console. Video encoded with general presets can be used by any device as long as it supports the required file formats, codecs, and so on. For code examples illustrating how to program the Azure Encoder, see Encoding Media with Media Services.


###Device Specific Encodings

####Smart Phone Encoding

When selecting an encoding for a smart phone, choose a encoding preset that matches the resolution, supported codecs, and supported file formats of the target device. Different smart phones, even those from the same company can vary in which codecs, resolution, and file formats they support. Consult the documentation for each target device to determine their capabilities. iPhone 5 supports H.264 video up to 1080p in HLS format. Media Services doesn't support encoding directly into HLS but you can encode to MP4 or Smooth Streaming and use Dynamic Packaging to convert to HLS. Or you could encode to Smooth Streaming then use the packager to convert the Smooth Streaming format to HLS if you are not using Dynamic Packaging. So if you wanted to encode video to 1080p you would use the "H264 Adaptive Bitrate MP4 Set 1080p for iOS Cellular Only" preset which would create an MP4 file. The MP4 file can be used by Media Services Dynamic Packaging feature to convert to HLS in real time. For a Windows Phone that supports H.264 video up to 1080p you can use the "H264 Smooth Streaming Windows Phone 7 Series" preset. For an Android phone that supports H.264 video at 480 * 360 you can use the "H264 Adaptive Bitrate MP4 Set SD 4x3 for iOS Cellular Only" preset. For more information about all of the available presets and their specifications, see Updating Reserved Unit Type and Increasing Encoding RUs.

####XBox Encoding

When encoding for XBox you can choose between VC1 and H.264 smooth streaming video at resolutions up to 1080p. To encode a 720p video using H.264, use the "H264 Smooth Streaming 720p Xbox Live ADK" preset. For more information about all of the available presets and their specifications, see Updating Reserved Unit Type and Increasing Encoding RUs.

####General Encodings

General encodings can be used for a wide variety of devices: tablets, PCs, set-top boxes, and so on. Check with the target device's documentation for information regarding codec, resolution, and file format support. To choose the appropriate encoding preset, determine the following:

- How will customers be downloading your content, progressive download or streaming?
- What codecs are supported on the target device? 
- What resolutions are supported?
- What file formats are supported?
 
For Windows PCs a number of different clients (player applications) are available:



- Web Browser
	- HTML5 Video Tag
	- Silverlight
	- Adobe Flash OSMF Plug-in
- Windows 8 App
- Windows RT App

The HTML5 video tag supports progressive download only. The video formats supported vary by browser, for more information see HTML5 Browser Support on Wikipedia. Internet Explorer supports MP4 and WebM (manual installation required at WebM for Internet Explorer) and Smooth Streaming with Silverlight. Windows and Windows RT apps both natively support Smooth Streaming.

To encode a video for progressive download with an HTML5 client on Windows you could use the VC1 Broadband 1080p encoding preset. To encode a video for a Windows Smooth Streaming client with 720p resolution you could use the VC1 Smooth Streaming 720p or the H264 Smooth Streaming 720p preset. The major difference between the two is the encoding algorithm used (VC1 versus H.264).
noteNote


Macintosh PCs support progressive download with HTML5 or streaming with HLS. To encode a video for progressive download with 1080p resolution on a Mac, use the H264 Broadband 1080p encoding preset. To encode a video for streaming with 720p resolution on a Mac use the H264 Smooth Streaming 720p encoding preset.

iPads apps support HLS with the iOS Azure Media Player Framework and PlayReady with the iOS porting kit for Smooth Streaming with PlayReady. To encode a video for an iPad you could use the H264 Smooth Streaming 1080p preset. You will need to either use Dynamic Packaging or convert the Smooth Streaming media to HLS manually.

For a complete list of encoder presets see Updating Reserved Unit Type and Increasing Encoding RUs.



###Encoding Jobs

Encoding jobs are created and controlled using a Job. The Job contains metadata about the processing to be performed. Each Job contains one or more Tasks that specify an atomic processing task, its input Assets, output Assets, a media processor and its associated settings. For more information on encoder settings, see Encoder Guides and Encoder Schemas.
An encoding job is usually combined with other processing, for example, packaging, or encrypting the asset or assets generated by the encoder. Tasks within a Job can be chained together, where the output asset of one task is given as the input asset to the next task. In this way one job can contain all of the processing necessary for a media presentation.
WarningWarning
There is currently a limit of 30 tasks per job. If you need to chain more than 30 tasks, create more than one job to contain the tasks.
For more information see the following topics:
Creating an Encoding Job with the Media Services REST API 

Creating Encoding Jobs with the Media Services SDK for .NET 

Creating Encoding Jobs with Media Services REST APIs 
