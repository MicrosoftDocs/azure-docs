---
title: Azure Media Services v3 overview | Microsoft Docs
description: This article provides a high-level overview of Media Services and provides links to articles for more details.
services: media-services
documentationcenter: na
author: Juliako
manager: cfowler
editor: ''
tags: ''
keywords: azure media services, stream, broadcast, live, offline

ms.service: media-services
ms.devlang: multiple
ms.topic: overview
ms.tgt_pltfrm: multiple
ms.workload: media
ms.date: 06/14/2018
ms.author: juliako
ms.custom: mvc
#Customer intent: As a developer or a content provider, I want to encode, stream (on demand or live), analyze my media content so that my customers can: view the content on a wide variety of browsers and devices, gain valuable insights from recorded content.
---

# What is Azure Media Services v3?

> [!div class="op_single_selector" title1="Select the version of Media Services that you are using:"]
> * [Version 2 - GA](../previous/media-services-overview.md)
> * [Version 3 - Preview](media-services-overview.md)

> [!NOTE]
> The latest version of Azure Media Services is in Preview and may be referred to as v3.

Azure Media Services is a cloud-based platform that enables you to build solutions that achieve broadcast-quality video streaming, enhance accessibility and distribution, analyze content, and much more. Whether you are an application developer, a call center, a government agency, an entertainment company, Media Services helps you create applications that deliver media experiences of outstanding quality to large audiences on today’s most popular mobile devices and browsers. 

## What can I do with Media Services?

Media Services enables you to build a variety of media workflows in the cloud, the following are some examples of what can be accomplished with Media Services.  

* Deliver videos in various formats so they can be played on a wide variety of browsers and devices. For both on-demand and live streaming delivery to various clients (mobile devices, TV, PC, etc.) the video and audio content needs to be encoded and packaged appropriately. To see how to deliver and stream such content, see [Quickstart: Encode and stream files](stream-files-dotnet-quickstart.md).
* Stream live sporting events to a large online audience, such as soccer, baseball, college and high school sports, and more. 
* Broadcast public meetings and events such as town halls, city council meetings, and legislative bodies.
* Analyze recorded videos or audio content. For example, to achieve higher customer satisfaction, organizations can extract speech-to-text and build search indexes and dashboards. Then, they can extract intelligence around common complaints, sources of complaints, and other relevant data. 
* Create a subscription video service and stream DRM protected content when a customer (for example, a movie studio) needs to restrict the access and use of proprietary copyrighted work.
* Deliver offline content for playback on airplanes, trains, and automobiles. A customer might need to download content onto their phone or tablet for playback when they anticipate to be disconnected from the network.
* Add subtitles and captions to videos to cater to a broader audience (for example, people with hearing disabilities or people who want to read along in a different language). 
* Implement an educational e-learning video platform with Azure Media Services and [Azure Cognitive Services APIs](https://docs.microsoft.com/azure/#pivot=products&panel=ai) for speech-to-text captioning, translating to multi-languages, etc.
* Enable Azure CDN to achieve large scaling to better handle instantaneous high loads (for example, the start of a product launch event.) 

## v3 capabilities

v3 is based on a unified API surface, which exposes both management and operations functionality built on Azure Resource Manager. 

This version provides the following capabilities:  

* **Transforms** that help you define simple workflows of media processing or analytics tasks. Transform is a recipe for processing your video and audio files. You can then apply it repeatedly to process all the files in your content library, by submitting jobs to the Transform.
* **Jobs** to process (encode or analyze) your videos. An input content can be specified on a job using HTTP(s) URLs, SAS URLs, or paths to files located in Azure Blob storage. 
* **Notifications** that monitor job progress or states, or Live Channel start/stop and error events. Notifications are integrated with the Azure Event Grid notification system. You can easily subscribe to events on several resources in Azure Media Services. 
* **Azure Resource Management** templates can be used to create and deploy Transforms, Streaming Endpoints, Channels, and more.
* **Role-based access control** can be set at the resource level, allowing you to lock down access to specific resources like Transforms, Channels, and more.
* **Client SDKs** in multiple languages: .NET, .NET core, Python, Go, Java, and Node.js.

## Naming conventions

Azure Media Services v3 resource names (for example, Assets, Jobs, Transforms) are subject to Azure Resource Manager naming constraints. In accordance with Azure Resource Manager, the resource names are always unique. Thus, you can use any unique identifier strings (for example, GUIDs) for your resource names. 

Media Services resource names cannot include: '<', '>', '%', '&', ':', '&#92;', '?', '/', '*', '+', '.', the single quote character, or any control characters. All other characters are allowed. The max length of a resource name is 260 characters. 

For more information about Azure Resource Manager naming, see: [Naming requirements](https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/resource-api-reference.md#arguments-for-crud-on-resource) and [Naming conventions](https://docs.microsoft.com/azure/architecture/best-practices/naming-conventions).

## How can I get started with v3?

As a developer, you can use Media Services [REST API](https://go.microsoft.com/fwlink/p/?linkid=873030) or client libraries that allow you to interact with the REST API, to easily create, manage, and maintain custom media workflows. You can find REST Postman example [here](https://github.com/Azure-Samples/media-services-v3-rest-postman). You can also use [Azure Resource Manager based REST API](https://github.com/Azure-Samples/media-services-v3-arm-templates).

Microsoft generates and supports the following client libraries: 

|Client library|Samples|
|---|---|
|[Azure CLI SDK](https://docs.microsoft.com/cli/azure/ams?view=azure-cli-latest)|[Azure CLI samples](https://github.com/Azure/azure-docs-cli-python-samples/tree/master/media-services)|
|[.NET SDK](https://www.nuget.org/packages/Microsoft.Azure.Management.Media/1.0.0)|[.NET samples](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials)|
|[.NET Core SDK](https://www.nuget.org/packages/Microsoft.Azure.Management.Media/1.0.0) (Choose the **.NET CLI** tab)|[.NET Core samples](https://github.com/Azure-Samples/media-services-v3-dotnet-core-tutorials)|
|[Java SDK](https://docs.microsoft.com/java/api/mediaservices/management?view=azure-java-stable)||
|[Node.js SDK](https://docs.microsoft.com/javascript/api/azure-arm-mediaservices/index?view=azure-node-latest)|[Node.js samples](https://github.com/Azure-Samples/media-services-v3-node-tutorials)|
|[Python SDK](https://pypi.org/project/azure-mgmt-media/1.0.0rc1/)||
|[Go SDK](https://github.com/Azure/azure-sdk-for-go/tree/master/services/preview/mediaservices/mgmt/2018-03-30-preview/media)||

Media Services provides [Swagger files](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/mediaservices/resource-manager/Microsoft.Media) that you can use to generate SDKs for your preferred language/technology.  

## Next steps

To see how easy it is to start encoding and streaming video files, check out [Stream files](stream-files-dotnet-quickstart.md). 

