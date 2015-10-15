<properties 
	pageTitle="Using partners to deliver Widevine licenses to Azure Media Services" 
	description="This article describes how you can use Azure Media Services (AMS) to deliver a stream that is dynamically encrypted by AMS with both PlayReady and Widevine DRMs. The PlayReady license comes from Media Services PlayReady license server and Widevine license is delivered by castLabs license server." 
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
	ms.date="10/07/2015"  
	ms.author="juliako"/>

#Using partners to deliver Widevine licenses to Azure Media Services

##Overview

Microsoft Azure Media Services enables you to deliver MPEG-DASH protected with Widevine DRM, which is encrypted per the Common Encryption (CENC) specification.

>[AZURE.NOTE] Currently, Media Services does not provide a Widevine license server. You can use the following AMS partners to help you deliver Widevine licenses: [Axinom](http://www.axinom.com/press/ibc-axinom-drm-6/), [EZDRM](http://ezdrm.com/), [castLabs](http://castlabs.com/company/partners/azure/)

##castLabs

You can use [castLabs](http://castlabs.com/company/partners/azure/) to deliver Widevine licenses. For more information, see [Using castLabs to deliver DRM licenses to Azure Media Services](media-services-castlabs-integration.md)

##Axinom

You can use [Axinom](http://www.axinom.com/press/ibc-axinom-drm-6/) to deliver Widevine licenses. For more information, see [Using Axinom to deliver DRM licenses to Azure Media Services](media-services-axinom-integration.md)


##Media Services learning paths

You can view AMS learning paths here:

- [AMS Live Streaming Workflow](http://azure.microsoft.com/documentation/learning-paths/media-services-streaming-live/)
- [AMS on Demand Streaming Workflow](http://azure.microsoft.com/documentation/learning-paths/media-services-streaming-on-demand/)

##See also

[Using PlayReady and/or Widevine dynamic common encryption](media-services-protect-with-drm.md)

[Mingfei’s blog](https://azure.microsoft.com/en-us/blog/azure-media-services-adds-google-widevine-packaging-for-delivering-multi-drm-stream/)

