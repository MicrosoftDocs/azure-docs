<properties 
	pageTitle="How to Encrypt Assets in Media Services - Azure" 
	description="Learn how to use Microsoft PlayReady Protection to encrypt an asset in Media Services. Code samples are written in C# and use the Media Services SDK for .NET. Code samples are written in C# and use the Media Services SDK for .NET." 
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
	ms.date="02/15/2015" 
	ms.author="juliako"/>


#How to: Dynamically Encrypt an Asset with PlayReady or AES-128

This article is part of the [Media Services Video on Demand workflow](media-services-video-on-demand-workflow.md) and [Media Services Live Streaming workflow](media-services-live-streaming-workflow.md) series.
  
##Overview

Microsoft Azure Media Services enables you to deliver your content encrypted (dynamically) with Advanced Encryption Standard (AES) (using 128-bit encryption keys) and PlayReady DRM. Media Services also provides a service for delivering keys and PlayReady licenses to authorized clients. To deliver protected content you need to  configure content key authorization policy and Configure Asset Delivery Policies.

##Configure

For information about how to configure content key authorization policy 
[AZURE.INCLUDE [media-services-selector-content-key-auth-policy](../includes/media-services-selector-content-key-auth-policy.md)] 

Configure Asset Delivery Policies
[AZURE.INCLUDE [media-services-selector-asset-delivery-policy](../includes/media-services-selector-asset-delivery-policy.md)]
 