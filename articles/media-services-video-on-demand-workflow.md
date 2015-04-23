<properties 
	pageTitle="Delivering Media on-Demand with Azure Media Services" 
	description="This topic talks about common scenarios of delivering media on-demand with Azure Media Services." 
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
	ms.date="04/20/2015" 
	ms.author="juliako"/>


#Delivering Media on-Demand with Azure Media Services

##Overview

This topic describes steps of a typical Azure Media Services (AMS) Video-on-Demand workflow. Each step links to relevant topics. For tasks that can be achieved using different technologies, there are buttons that link to technology of your choice (for example, .NET or REST).   

Note that you can integrate Media Services with your existing tools and processes. For example, encode content on-site, then upload to Media Services for transcoding into multiple formats and deliver through Azure CDN or a third-party CDN. 

The following diagram shows the major parts of the Media Services platform that are involved in the Video on Demand Workflow.
![VoD workflow][vod-overview]

##<a id="vod_scenarios"></a>Common Scenarios: Delivering Media on-Demand. 

###Protect content in storage and deliver streaming media in the clear (non-encrypted)

1. Upload a high-quality mezzanine file into an asset.
	
	It is recommended to apply storage encryption option to your asset in order to protect your content during upload and while at rest in storage. 
1. Encode to adaptive bitrate MP4 set. 

	It is recommended to apply storage encryption option to the output asset in order to protect your content at rest.
	
1. Configure asset delivery policy (used by dynamic packaging). 
	
	If your asset is storage encrypted, you **must** configure asset delivery policy. 

1. Publish the asset by creating an OnDemand locator.

	Make sure to have at least one streaming reserved unit on the streaming endpoint from which you want to stream content.

1. Stream published content.

###Protect content in storage, deliver dynamically encrypted streaming media  

To be able to use dynamic encryption, you must first get at least one streaming reserved unit on the streaming endpoint from which you want to stream encrypted content.

1. Upload a high-quality mezzanine file into an asset. Apply storage encryption option to the asset.
1. Encode to adaptive bitrate MP4 set. Apply storage encryption option to the output asset.
1. Create encryption content key for the asset you want to be dynamically encrypted during playback.
2. Configure content key authorization policy.
1. Configure asset delivery policy (used by dynamic packaging and dynamic encryption).
1. Publish the asset by creating an OnDemand locator.
1. Stream published content. 

###Index content

1. Upload a high-quality mezzanine file into an Asset.
1. Index content.

	The indexing job generates files that can be used as Closed Captions (CC) in video playback. It also generates files that enable you to do in-video search and jump to the exact location of the video.	

1. Consume indexed content.


###Deliver progressive download 

1. Upload a high-quality mezzanine file into an asset.
1. Encode to adaptive bitrate MP4 set or a single MP4.
1. Publish the asset by creating an OnDemand or SAS locator.

	If using OnDemand locator, make sure to have at least one streaming reserved unit on the streaming endpoint from which you plan to progressively download content.

	If using SAS locator, the content is downloaded from the Azure blob storage. In this case, you do not need to have streaming reserved units.
  
1. Progressively download content.

This article contains links to topics that show how to set up your development environment and perform tasks mentioned above.


##Concepts

For concepts related to delivering your content on demand, see [Media Services Concepts](media-services-concepts.md).

##Creating a Media Services account

Use **Azure Management Portal** to [Create Azure Media Services Account](media-services-create-account.md). 

##Setting up development environment  

Choose **.NET** or **REST API** for your development environment.

[AZURE.INCLUDE [media-services-selector-setup](../includes/media-services-selector-setup.md)]

##Connecting programmatically  

Choose **.NET** or **REST API** to programmatically connect to Azure Media Services.

[AZURE.INCLUDE [media-services-selector-connect](../includes/media-services-selector-connect.md)]


##Configuring streaming endpoints

For an overview about streaming endpoints and information on how to manage them, see [How to Manage Streaming Endpoints in a Media Services Account](media-services-manage-origins.md).

##Uploading media 

Upload your files using **Azure Management Portal**, **.NET** or **REST API**.

[AZURE.INCLUDE [media-services-selector-upload-files](../includes/media-services-selector-upload-files.md)]

##Creating jobs \ tasks

A job is an entity that contains metadata about a set of tasks (for example, encoding or indexing). Each task performs an atomic operation on the input asset(s). For example on how to create encoding jobs, see:

For an overview, see [Working with Azure Media Services Jobs](media-services-jobs.md).

Get a Media Processor appropriate for your task with **.NET** or **REST API**.

[AZURE.INCLUDE [media-services-selector-get-media-processor](../includes/media-services-selector-get-media-processor.md)]

The following examples create encoding jobs with **Azure Management Portal**, **.NET**, or **REST API**.

[AZURE.INCLUDE [media-services-selector-encode](../includes/media-services-selector-encode.md)]

##Indexing

[AZURE.INCLUDE [media-services-selector-index-content](../includes/media-services-selector-index-content.md)]

##Encoding 

**Overview**: 

- [Dynamic Packaging Overview](media-services-dynamic-packaging-overview.md)
- [Encoding On-Demand Content with Azure Media Services](media-services-encode-asset.md).

Encode with **Azure Media Encoder** using **Azure Management Portal**, **.NET**, or **REST API**.
 
[AZURE.INCLUDE [media-services-selector-encode](../includes/media-services-selector-encode.md)]

Advanced encoding with **Media Encoder Premium Workflow** using **.NET**. 

[AZURE.INCLUDE [media-services-selector-advanced-encoding](../includes/media-services-selector-advanced-encoding.md)]


##Monitoring job progress

Monitor job progress using **Azure Management Portal**, **.NET** or **REST API**.

[AZURE.INCLUDE [media-services-selector-job-progress](../includes/media-services-selector-job-progress.md)]

##Creating content key

Create a content key with which you want to encrypt your asset using **.NET** or **REST API**.

[AZURE.INCLUDE [media-services-selector-create-contentkey](../includes/media-services-selector-create-contentkey.md)]

##Configuring content key authorization policy 

Configure content protection and key authorization policy using **.NET** or **REST API**.

[AZURE.INCLUDE [media-services-selector-content-key-auth-policy](../includes/media-services-selector-content-key-auth-policy.md)]


##Publishing and delivering assets

**Overview**: 

- [Dynamic Packaging Overview](media-services-dynamic-packaging-overview.md)
- [Delivering Content Overview](media-services-deliver-content-overview.md)

Configure asset delivery policy using **.NET** or **REST API**.

[AZURE.INCLUDE [media-services-selector-asset-delivery-policy](../includes/media-services-selector-asset-delivery-policy.md)]

Publish assets (by creating Locators) using **Azure Management Portal** or **.NET**.

[AZURE.INCLUDE [media-services-selector-publish](../includes/media-services-selector-publish.md)]

##Enabling Azure CDN

Media Services supports integration with Azure CDN. For information on how to enable Azure CDN, see [How to Manage Streaming Endpoints in a Media Services Account](media-services-manage-origins.md#enable_cdn).

##Scaling a Media Services account

You can scale **Media Services** by specifying the number of **Streaming Reserved Units** and **Encoding Reserved Units** that you would like your account to be provisioned with. 

You can also scale your Media Services account by adding storage accounts to it. Each storage account is limited to 500 TB. To expand your storage beyond the default limitations, you can choose to attach multiple storage accounts to a single Media Services account.

[This](media-services-how-to-scale.md) topic links to relevant topics.

##Playback your content with existing players

For more information, see [playing your content with existing players](media-services-playback-content-with-existing-players.md).


[vod-overview]: ./media/media-services-overview/media-services-video-on-demand.png
