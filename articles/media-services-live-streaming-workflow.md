<properties 
	pageTitle="Delivering Live Streaming with Azure Media Services" 
	description="This topic describes steps of a typical Media Services Live Streaming workflow." 
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
	ms.date="04/19/2015" 
	ms.author="juliako"/>


#Delivering Live Streaming with Azure Media Services

##Overview

This topic describes steps of a typical Azure Media Services (AMS) Live Streaming  workflow. Each step links to relevant topics. For tasks that can be achieved using different technologies, there are buttons that link to technology of your choice (for example, .NET or REST).   

Note that you can integrate Media Services with your existing tools and processes. For example, encode content on-site then upload to Media Services for transcoding into multiple formats and deliver through Azure CDN, or a third-party CDN. 

The following diagram shows the major parts of the Media Services platform that are involved in the Live Streaming Workflow.

![Live workflow][live-overview]

This topic describes concepts related to live streaming and links to topics that demonstrate how to achieve live streaming tasks.

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


##Using On-premises Live Encoders to Output Multi-bitrate Stream to a Channel

##Working with 3rd Party Live Transcoders

For more information, see [Using 3rd Party Live Encoders with Azure Media Services](https://msdn.microsoft.com/library/azure/dn783464.aspx).

##Managing Channels, Programs, Assets

**Overview**: [Managing Channels and Programs overview](media-services-manage-channels-overview.md).

Choose **Portal**, **.NET**, **REST API** to see examples.

[AZURE.INCLUDE [media-services-selector-manage-channels](../includes/media-services-selector-manage-channels.md)]

##Creating content key

Create a content key with which you want to encrypt your asset using **.NET** or **REST API**.

[AZURE.INCLUDE [media-services-selector-create-contentkey](../includes/media-services-selector-create-contentkey.md)]

##Configuring content key authorization policy 

Configure content protection and key authorization policy using **.NET** or **REST API**.

[AZURE.INCLUDE [media-services-selector-content-key-auth-policy](../includes/media-services-selector-content-key-auth-policy.md)]


##Publishing and delivering assets


**Overview**: 

- [Dynamic Packaging Overview](media-services-dynamic-overview.md)
- [Delivering Content Overview](media-services-deliver-content-overview.md)

Configure asset delivery policy using **.NET** or **REST API**.

[AZURE.INCLUDE [media-services-selector-asset-delivery-policy](../includes/media-services-selector-asset-delivery-policy.md)]

Publish assets (by creating Locators) using **Azure Management Portal** or **.NET**.

[AZURE.INCLUDE [media-services-selector-publish](../includes/media-services-selector-publish.md)]


##Enabling Azure CDN

Media Services supports integration with Azure CDN. For information on how to enable Azure CDN, see [How to Manage Streaming Endpoints in a Media Services Account](media-services-manage-origins.md#enable_cdn).

##Scaling a Media Services account

You can scale **Media Services** by specifying the number of **Streaming Reserved Units** you would like your account to be provisioned with. 

For information about scaling streaming units, see: [How to scale streaming units](media-services-manage-origins.md#scale_streaming_endpoints.md).




[live-overview]: ./media/media-services-overview/media-services-live-streaming-current.png