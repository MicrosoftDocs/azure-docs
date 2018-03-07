---
title: Azure Media Services overview | Microsoft Docs
description: This article provides a high-level overview of Media Services and provides links to articles for more details.
services: media-services
documentationcenter: na
author: juliako
manager: cfowler
editor: ''
tags: ''
keywords: azure media services, stream, broadcast, live, offline

ms.service: media-services
ms.devlang: multiple
ms.topic: overview
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 02/26/2018
ms.author: juliako

ms.custom: mvc

---

## What is Azure Media Services?

> [!NOTE]
> The latest version of Azure Media Services (2018-03-30) is in preview. This version is also called v3.

Content creators want to reach larger audiences on today’s most popular mobile devices and browsers. To achieve that, the video and audio content needs to be encoded and packaged appropriately, for both on-demand and live streaming delivery to various clients (for example, TV, PC, and mobile devices). To reach a broader audience, content creators might want to add subtitles and captions. They might also want to protect their videos.

More organizations are using videos as the preferred medium to train their employees, engage their customers, and document business functions. As a company's library grows, it needs effective means of extracting insights from all that content. To address this growing need, Azure Media Services enables companies to apply all the power of Microsoft AI (?or Microsoft Cognitive Service?) technologies to their content. 

Azure Media Services is an extensible cloud-based platform that enables developers to build solutions that achieve broadcast-quality video streaming, enhance accessibility, distribution, and scalability, and much more. As a developer, you can use Media Services [REST API](https://docs.microsoft.com/rest/api/media/) or client libraries that allow you to interact with the REST API, to easily create, manage, and maintain custom media workflows. 

This article gives a high-level overview of Media Services and provides links to articles for more details.

### What is Media Services REST API v3?

The latest version of Azure Media Services, REST API v3, is based on the Azure Resource Management (ARM) framework. The new API provides the following.

* It combines together the previously separate management and operations API into a single unified API surface. 
* It enhances Media Services capabilities by introducing a new templated workflow resource called a [Transform](transform-concept.md). Transforms help you define a workflow of tasks - essentially a recipe for processing your video and audio files. You can then apply it repeatedly to process all the files in your content library, by submitting Jobs.
* Jobs can now be submitted using HTTP(s) URLs, SAS URLs, or paths to files located in Azure Blob storage. 
* Notifications have also been enhanced to integrate directly with the Azure Event Grid notification system. Customers can easily subscribe to events on several resources in Azure Media Services, such as Job progress or states, and Live Channel start/stop and error events. 
* Customers can now use ARM templates to create and deploy Transforms, Streaming Endpoints, Channels, and more.
* Role-based access control can also be set at the resource level in the v3 API, allowing customers to lock down access to specific resources like Transforms, Content Keys, Channels, and more.

## What can I do with Media Services?

The following are some examples of tasks you might want to achieve.  

* Deliver adaptive bitrate encoded content in HLS, MPEG DASH, and Smooth Streaming formats so it can be played on a wide variety of browsers and devices.
* Stream sport events such as the FIFA World Cup and the Olympic Games live (?check if we can refer to potentially trade-marked events?). 
* Broadcast public government meetings and events such as town halls, City council meetings, and Legislative bodies (Parliament, House of Representatives).
* Analyze videos for call centers. Embedded in the audio data is a large amount of customer information that can be analyzed to achieve higher customer satisfaction. Organizations can extract text and build search indexes and dashboards. Then they can extract intelligence around common complaints, sources of complaints, and other relevant data.
* Analyze surveillance videos. Manually reviewing surveillance video is time intensive and prone to human error. You can utilize services such as motion detection and face detection to make the process of reviewing, managing, and creating derivatives easier.
* Stream a DRM protected content when a customer (for example, a movie studio) needs to restrict the use of proprietary copyrighted work.
* Deliver offline content for playback on airplanes, trains, and automobiles. A customer might need to download content onto their phone or tablet for playback when they anticipate to be disconnected from the network.
* Add subtitles and captions to videos to cater to a broader audience (for example, people with hearing disabilities or people who want to read along in a different language). 
* Implement an educational e-learning video platform with Azure Media Services and Azure Cognitive Services APIs (TODO: add link) for speech-to-text captioning, translating to multi-languages, etc.
* Enable Azure CDN to achieve large scaling to better handle instantaneous high loads, such as the start of a product launch event. 
* Use CDN to achieve distribution of user requests and serving of content directly from edge servers so that less traffic is sent to the origin server.

## How can I get started?

### Supported client libraries 

Media Services is a RESTfull service, any technology that understands REST can be a client for this API. Microsoft generates and supports the following client libraries, which allow you to interact with Media Services REST APIs: 

* .NET languages,
* .NET Core, 
* Java, 
* Node.js, 
* Azure CLI 2.0

Media Services provides [Swagger files](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/mediaservices/resource-manager/Microsoft.Media) that you can use to generate SDKs for your preferred language/technology. You can use [AutoRest](https://github.com/Azure/autorest) to generate client libraries. 

### Jump right in

The following quickstart shows you how to create an Azure Media Services account, upload a file based on the specified URL, encode it, and stream the video: [Stream your files](stream-files-dotnet-quickstart.md)

For a more advanced streaming scenario, see [Tutorial: Upload, encode, stream](stream-files-tutorial.md).

## Next Steps

* [Broadcast live](broadcast-live-tutorial.md)
* [Analyze your videos](analyze-videos-tutorial.md)
* [Playback on multiple devices](playback-tutorial.md)

