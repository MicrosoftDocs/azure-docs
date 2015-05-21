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
	ms.date="05/11/2015" 
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


##Delivering Media on-Demand with Azure Media Services

The following topic describes steps of common Media Services Video-on-Demand workflows. The topic links to other topics that show how to achieve these steps using technologies supported by Media Services.  

[Delivering Media on-Demand with Azure Media Services](media-services-video-on-demand-workflow.md).

##Delivering Live Streaming with Azure Media Services

The following topic describes steps of common Media Services Live Streaming workflows. The topic links to other topics that show how to achieve these steps using technologies supported by Media Services. 

[Delivering Live Streaming with Azure Media Services](media-services-live-streaming-workflow.md).

##Consuming content

Azure Media Services provides the tools you need to create rich, dynamic client player applications for most platforms including: iOS Devices, Android Devices, Windows, Windows Phone, Xbox, and Set-top boxes. The following topic provides links to SDKs and Player Frameworks that you can use to develop your own client applications that can consume streaming media from Media Services.

[Developing Video Player Applications](media-services-develop-video-players.md)

##Patterns & practices guidance

[Patterns and practices guidance](https://wamsg.codeplex.com/)
[Online documentation](https://msdn.microsoft.com/library/dn735912.aspx)
[Downloadable eBook](https://www.microsoft.com/download/details.aspx?id=42629)

##Support

[Azure Support](http://azure.microsoft.com/support/options/) provides support options for Azure, including Media Services.

##Next Steps

[Delivering Live Streaming with Azure Media Services](media-services-live-streaming-workflow.md)

[Developing Video Player Applications](media-services-develop-video-players.md)
 
[Developing Video Player Applications](media-services-develop-video-players.md)


<!-- Images -->
[overview]: ./media/media-services-overview/media-services-overview.png
