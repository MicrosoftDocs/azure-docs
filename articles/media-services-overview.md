<properties 
	pageTitle="Azure Media Services Overview" 
	description="This topic gives an overview of Azure Media Services" 
	services="media-services" 
	documentationCenter="" 
	authors="Juliako" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/26/2015" 
	ms.author="juliako"/>

#Azure Media Services Overview

Microsoft Azure Media Services is an extensible cloud-based platform that enables developers to build scalable media management and delivery applications. Media Services is based on REST APIs that enable you to securely upload, store, encode and package video or audio content for both on-demand and live streaming delivery to various clients (for example, TV, PC, and mobile devices).

You can build end-to-end workflows using entirely Media Services. You can also choose to use third-party components for some parts of your workflow. For example, encode using a third-party encoder. Then, upload, protect, package, deliver using Media Services.

To build Media Services solutions, you can use:

- [Media Services REST API](https://msdn.microsoft.com/library/azure/hh973617.aspx)
- One of the available client SDKs: [Azure Media Services SDK for .NET](https://github.com/Azure/azure-sdk-for-media-services), [Azure SDK for Java](https://github.com/Azure/azure-sdk-for-java), [Azure Media Services for Node.js](https://github.com/fritzy/node-azure-media), [Azure PHP SDK](https://github.com/Azure/azure-sdk-for-php)
- Existing tools: [Azure Management Portal](http://manage.windowsazure.com/) or [Azure-Media-Services-Explorer](https://github.com/Azure/Azure-Media-Services-Explorer).

**Service Level Agreement (SLA)**: Media Services guarantees 99.9% availability of REST API transactions for Media Services Encoding. On-Demand Streaming will successfully service requests with a 99.9% availability guarantee for existing media content when at least one Streaming Reserved Unit is purchased. Availability is calculated over a monthly billing cycle. For more information, download the [SLA document](https://www.microsoft.com/download/details.aspx?id=39302).

The following poster depicts Azure Media Services workflows, from media creation through consumption. You can download the poster from here: [Azure Media Services poster](http://www.microsoft.com/download/details.aspx?id=38195).

![Overview][overview]

##Concepts

For more information, see [Concepts](media-services-concepts.md).

##Choosing Your Media Experience

One of the first steps in sharing video content is deciding what type of experience you want your clients to have. How will your customers be viewing the video content? Will they be connected to the internet? Will they be viewing your content on a computer or a hand-held device? Will your customers expect the video to be in HD? Questions such as these can help you give your customers the best possible experience.

###Accessing video
 
There are four basic ways customers can access videos:

- Streaming\Adaptive Bitrate Streaming (most common)

	Streaming technologies download a small piece of the video at a time and discard it once it has been displayed. This requires very little storage on the viewing device. The throughput of a network connection can vary, but customers still expect to be able to view videos regardless of network bandwidth. Adaptive bitrate technologies allow video player applications to determine network conditions and select from among several bitrates. When network communication degrades, the client can select a lower bitrate allowing the player to continue to play the video at a lower video quality. As network conditions improve the client can switch to a higher bitrate with improved video quality. Azure Media Services supports the following adaptive bitrate technologies: HTTP Live Streaming (HLS), Smooth Streaming, MPEG DASH, and HDS.

- Progressive Download
	
	Progressive download requires that a customer is connected to the internet and allows them to start viewing the video before the entire video has been downloaded. Both offline viewing and progressive download approaches require that the device the customer is using to view the video has enough storage space to hold the entire video.


- Offline Viewing 
	
	To view a video offline a customer will download the entire video onto their computer or device. Videos tend to be quite large so it may take some time for the download to complete. The benefit of offline viewing is you do not need a network connection to view the video once it has been downloaded to your device. 

###Supported Technologies by Device


You can blayback your content on any of the following devices: iOS Devices, Android Devices, Windows, Windows Phone, Xbox, and Set-top boxes.

The following table shows each type of device and the client technologies supported by  Media Services:
 
<table border="1">
<tr><th>Device</th><th>Technologies</th></tr>
<tr><td>iOS</td><td>Smooth Streaming, Apple HLS, Progressive Download</td></tr>
<tr><td>Windows Phone 8</td><td>Smooth Streaming</td></tr>
<tr><td>Windows RT</td><td>Smooth Streaming</td></tr>
<tr><td>Windows</td><td>Smooth Streaming, Progressive Download</td></tr>
<tr><td>Android Phones</td><td>Smooth Streaming and Apple HLS</td></tr>
<tr><td>XBox</td><td>Smooth Streaming</td></tr>
<tr><td>Macintosh</td><td>Apple HLS, Progressive Download</td></tr>
<tr><td>Set-top Box, Connected TV</td><td>Smooth Streaming, Apple HLS, Progressive Download</td></tr>
</table>


##Delivering Media on-Demand with Azure Media Services

For more information, see [Delivering Media on-Demand with Azure Media Services](media-services-video-on-demand-workflow.md).

##Delivering Live Streaming with Azure Media Services

For more information, see [Delivering Live Streaming with Azure Media Services](media-services-live-streaming-workflow.md).

##Consuming content

For more information, see [Developing Video Player Applications](media-services-develop-video-players.md)

##Patterns & practices guidance

[Patterns and practices guidance](https://wamsg.codeplex.com/)
[Online documentation](https://msdn.microsoft.com/library/dn735912.aspx)
[Downloadable eBook](https://www.microsoft.com/download/details.aspx?id=42629)

##Support

[Azure Support](http://azure.microsoft.com/support/options/) provides support options for Azure, including Media Services.

##Next Steps



<!-- Images -->
[overview]: ./media/media-services-overview/media-services-overview.png
