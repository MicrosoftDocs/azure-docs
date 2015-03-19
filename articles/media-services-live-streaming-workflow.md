<properties 
	pageTitle="Delivering Live Streaming with Azure Media Services" 
	description="This topic describes steps of a typical Media Services Live Streaming workflow." 
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
	ms.date="03/10/2015" 
	ms.author="juliako"/>


#Delivering Live Streaming with Azure Media Services

##Overview

This topic describes steps of a typical Azure Media Services (AMS) Live Streaming  workflow. Each step links to relevant topics. For tasks that can be achieved using different technologies, there are buttons that link to technology of your choice (for example, .NET or REST).   

Note that you can integrate Media Services with your existing tools and processes. For example, encode content on-site then upload to Media Services for transcoding into multiple formats and deliver through Azure CDN, or a third-party CDN. 

The following diagram shows the major parts of the Media Services platform that are involved in the Live Streaming Workflow.
![Live workflow][live-overview]


##Common Scenarios: Delivering Live Streaming.

###Deliver live streaming media using on-premises encoder

1. Create and start a channel.
1. Retrieve the channel ingest URL.
1. Start and configure the live transcoder of your choice.
1. Retrieve the channel’s preview endpoint and verify that your channel is properly receiving the live stream.
2. Create an asset.
1. Configure asset delivery policy (used by dynamic packaging).
3. Create a program and specify to use the asset that you created.
1. Publish the asset associated with the program by creating an OnDemand locator.  

	Make sure to have at least one streaming reserved unit on the streaming endpoint from which you want to stream content.
1. Start the program when you are ready to start streaming and archiving.
1. Stop the program whenever you want to stop streaming and archiving the event.
1. Delete the Program (and optionally delete the asset).  

###Deliver live streaming media that is dynamically encrypted 

To be able to use dynamic encryption, you must first get at least one streaming reserved unit on the streaming endpoint from which you want to stream encrypted content.

1. Same steps as described in the earlier scenario until the step where you create an asset. 
2. Create an asset that you want to encrypt. 
1. Create encryption content key for the asset you want to be dynamically encrypted during playback.
2. Configure content key authorization policy.
1. Configure asset delivery policy (used by dynamic packaging and dynamic encryption).
3. Create a program and specify to use the asset that is configured for dynamic encryption.
4. Publish the asset associated with the program by creating an OnDemand locator.  
1. Start the program when you are ready to start streaming and archiving.
1. Stop the program whenever you want to stop streaming and archiving the event.
1. Delete the Program (and optionally delete the asset).  

This article contains links to topics that show how to set up your development environment and perform tasks mentioned above.

##Concepts

For concepts related to live streaming, see [Media Services Concepts](media-services-concepts.md).

##Creating a Media Services account

Use **Azure Management Portal** to [Create Azure Media Services Account](media-services-create-account.md).

##Configuring streaming endpoints

For an overview about streaming endpoints and information on how to manage them, see [How to Manage Streaming Endpoints in a Media Services Account](media-services-manage-origins.md)

##Setting up development environment  

Choose **.NET** or **REST API** for your development environment.

[AZURE.INCLUDE [media-services-selector-setup](../includes/media-services-selector-setup.md)]

##Connecting programmatically  

Choose **.NET** or **REST API** to programmatically connect to Azure Media Services.

[AZURE.INCLUDE [media-services-selector-connect](../includes/media-services-selector-connect.md)]

##Working with 3rd Party Live Transcoders

For more information, see [Using 3rd Party Live Encoders with Azure Media Services](https://msdn.microsoft.com/library/azure/dn783464.aspx).

##Managing Channels, Programs, Assets

For more information, see [Live Streaming](https://msdn.microsoft.com/library/azure/dn783466.aspx).

##Creating content key

Create a content key with which you want to encrypt your asset using **.NET** or **REST API**.

[AZURE.INCLUDE [media-services-selector-create-contentkey](../includes/media-services-selector-create-contentkey.md)]

##Configuring content key authorization policy 

Configure content protection and key authorization policy using **.NET** or **REST API**.

[AZURE.INCLUDE [media-services-selector-content-key-auth-policy](../includes/media-services-selector-content-key-auth-policy.md)]

##Configuring asset delivery policy

Configure asset delivery policy using **.NET** or **REST API**.

[AZURE.INCLUDE [media-services-selector-asset-delivery-policy](../includes/media-services-selector-asset-delivery-policy.md)]

##Publishing assets

Publish assets (by creating Locators) using **Azure Management Portal** or **.NET**.

[AZURE.INCLUDE [media-services-selector-publish](../includes/media-services-selector-publish.md)]


##Enabling Azure CDN

Media Services supports integration with Azure CDN. For information on how to enable Azure CDN, see [How to Manage Streaming Endpoints in a Media Services Account](media-services-manage-origins.md#enable_cdn).

##Scaling a Media Services account

You can scale **Media Services** by specifying the number of **Streaming Reserved Units** you would like your account to be provisioned with. 

For information about scaling streaming units, see: [How to scale streaming units](media-services-manage-origins.md#scale_streaming_endpoints.md).




[live-overview]: ./media/media-services-overview/media-services-live-streaming-current.png