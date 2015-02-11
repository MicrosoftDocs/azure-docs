<properties 
	pageTitle="Media Services Live Streaming Workflow" 
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
	ms.date="02/11/2015" 
	ms.author="juliako"/>


#Media Services Live Streaming  Workflow

##Overview

This topic describes steps of a typical Azure Media Services (AMS) Live Streaming  workflow. Each step links to relevant topics. For tasks that can be achieved using different technologies, there are buttons that link to technology of your choice (for example, .NET or REST).   

Note that you can integrate Media Services with your existing tools and processes. For example, encode content on-site then upload to Media Services for transcoding into multiple formats and deliver through Azure CDN, or a third-party CDN. 

The following diagram shows the major parts of the Media Services platform that are involved in the Video on Demand Workflow.
![Live workflow][live-overview]

##Creating a Media Services account

Use **Azure Management Portal** to [Create Azure Media Services Account](../media-services-create-account/).

##Setting up development environment  

Choose **.NET** or **REST API** for your development environment.

[AZURE.INCLUDE [media-services-selector-setup](../includes/media-services-selector-setup.md)]

##Connecting programmatically  

Choose **.NET** or **REST API** to programmatically connect to Azure Media Services.

[AZURE.INCLUDE [media-services-selector-connect](../includes/media-services-selector-connect.md)]

##Working with Live Transcoders

For more information, see [Using 3rd Party Live Encoders with Azure Media Services](https://msdn.microsoft.com/en-us/library/azure/dn783464.aspx).

##Managing Channels, Programs, Assets

For more information, see [Live Streaming](https://msdn.microsoft.com/en-us/library/azure/dn783466.aspx).

##Configure content key authorization policy 

Configure key authorization policy using **.NET** or **REST API**.

[AZURE.INCLUDE [media-services-selector-content-key-auth-policy](../includes/media-services-selector-content-key-auth-policy.md)]

##Configuring asset delivery policy

Configure asset delivery policy using **.NET** or **REST API**.

[AZURE.INCLUDE [media-services-selector-configure_asset_delivery_policy](../media-services-selector-configure_asset_delivery_policy.md)]

##Publishing assets

Publish assets (by creating Locators) using **Azure Management Portal** or **.NET**.

[AZURE.INCLUDE [media-services-selector-publish](../includes/media-services-selector-publish.md)]






[live-overview]: ./media/media-services-overview/media-services-live-streaming-current.png