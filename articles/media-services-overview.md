<properties 
	pageTitle="Azure Media Services Overview" 
	description="This topic gives an overview of Azure Media Services" 
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

- Offline Viewing 
- Progressive Download
- Streaming\Adaptive Bitrate Streaming

####Offline viewing

To view a video offline a customer will download the entire video onto their computer or device. Videos tend to be quite large so it may take some time for the download to complete. The benefit of offline viewing is you do not need a network connection to view the video once it has been downloaded to your device. 

####Progressive download

Progressive download requires that a customer is connected to the internet and allows them to start viewing the video before the entire video has been downloaded. Both offline viewing and progressive download approaches require that the device the customer is using to view the video has enough storage space to hold the entire video.

####Streaming

Streaming technologies also require an internet connection, but they download a small piece of the video at a time and discard it once it has been displayed. This requires very little storage on the viewing device. The throughput of a network connection can vary, but customers still expect to be able to view videos regardless of network bandwidth. Adaptive bitrate technologies allow video player applications to determine network conditions and select from among several bitrates. When network communication degrades, the client can select a lower bitrate allowing the player to continue to play the video at a lower video quality. As network conditions improve the client can switch to a higher bitrate with improved video quality. Azure Media Services supports the following adaptive bitrate technologies: HTTP Live Streaming (HLS), Smooth Streaming, MPEG DASH, and HDS.

###On what Devices

Another decision that needs to be made is what type of devices your customer will be using to view your videos. Media Services provides support for web browsers, smart phones, tablets, XBOX, set-top boxes, and connected TVs.

####Web Browsers

Web browsers can be run on Windows PCs, Macintosh PCs, and Smart Phones. When running on PCs or Macintosh PCs you can take advantage of the large size screen and the large storage capacity. This allows you to stream higher quality videos. Windows PCs or Macintosh PCs can view videos delivered by Media Services by using a native application or an HTML-compatible web browser. Native applications can support Smooth Streaming, Apple HLS, Progressive Download, or offline viewing. HTML5 web pages support Progressive Download.


####Smart Phones

Smart phones have small screens and smaller storage capacities. Streaming is the best choice for these devices. iPhones, Windows Phones, and Android phones are supported. iPhones and Android phones support Smooth Streaming and HLS. Windows Phones support Smooth Streaming.

###Tablets

Tablets have larger screens than smart phones, but till typically have smaller storage capacity. Streaming is the best choice for tablets. Tablets with larger storage capacities can also take advantage of offline viewing as well as Progressive Download.

####XBox

XBox consoles have the benefit of large screens and larger storage capacity, which makes offline, progressive download, and streaming a good fit.
Set-top Boxes and Connected TVs
These devices also have large screen but minimal storage capacity, streaming is the best fit.

###Supported Technologies by Device

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

For more information, see [Delivering Live Streaming with Azure Media Services](media-services-live-streaming-wrokflow.md) contains links to topics that show how to perform tasks mentioned above.

##Clients

Azure Media Services provides the tools you need to create rich, dynamic client player applications for most platforms including: iOS Devices, Android Devices, Windows, Windows Phone, Xbox, and Set-top boxes.

- [Smooth Streaming Client SDK](http://www.iis.net/downloads/microsoft/smooth-streaming) 
- [Microsoft Media Platform: Player Framework](http://playerframework.codeplex.com/) 
- [HTML5 Player Framework Documentation](http://playerframework.codeplex.com/wikipage?title=HTML5%20Player&referringTitle=Documentation) 
- [Microsoft Smooth Streaming Plugin for OSMF](https://www.microsoft.com/download/details.aspx?id=36057) 
- [Media Player Framework for iOS](https://github.com/Azure/azure-media-player-framework) 
- [Licensing Microsoft® Smooth Streaming Client Porting Kit](https://www.microsoft.com/mediaplatform/sspk.aspx) 
- Building Video Applications on Windows 8 
- [XBOX Video Application Development](http://xbox.create.msdn.com/) 

For more information, see [Developing Video Player Applications](media-services-develop-video-players.md)

##Patterns & practices guidance

[Patterns and practices guidance](https://wamsg.codeplex.com/)
[Online documentation](https://msdn.microsoft.com/library/dn735912.aspx)
[Downloadable eBook](https://www.microsoft.com/download/details.aspx?id=42629)

##Support

[Azure Support](http://azure.microsoft.com/support/options/) provides support options for Azure, including Media Services.



<!-- Images -->
[overview]: ./media/media-services-overview/media-services-overview.png
