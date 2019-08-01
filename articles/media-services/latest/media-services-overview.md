---
title: Azure Media Services v3 overview | Microsoft Docs
description: This article provides a high-level overview of Media Services and provides links to articles for more details.
services: media-services
documentationcenter: na
author: Juliako
manager: femila
editor: ''
tags: ''
keywords: azure media services, stream, broadcast, live, offline

ms.service: media-services
ms.devlang: multiple
ms.topic: overview
ms.tgt_pltfrm: multiple
ms.workload: media
ms.date: 05/13/2019
ms.author: juliako
ms.custom: mvc
#Customer intent: As a developer or a content provider, I want to encode, stream (on demand or live), analyze my media content so that my customers can: view the content on a wide variety of browsers and devices, gain valuable insights from recorded content.
---

# Azure Media Services v3 overview

Azure Media Services is a cloud-based platform that enables you to build solutions that achieve broadcast-quality video streaming, enhance accessibility and distribution, analyze content, and much more. Whether you are an application developer, a call center, a government agency, an entertainment company, Media Services helps you create applications that deliver media experiences of outstanding quality to large audiences on today’s most popular mobile devices and browsers. 

> [!NOTE]
> Currently, you cannot use the Azure portal to manage v3 resources. Use the [REST API](https://aka.ms/ams-v3-rest-ref), [CLI](https://aka.ms/ams-v3-cli-ref), or one of the supported [SDKs](media-services-apis-overview.md#sdks).

## What can I do with Media Services?

Media Services enables you to build a variety of media workflows in the cloud, the following are some examples of what can be accomplished with Media Services.  

* Deliver videos in various formats so they can be played on a wide variety of browsers and devices. For both on-demand and live streaming delivery to various clients (mobile devices, TV, PC, etc.) the video and audio content needs to be encoded and packaged appropriately. To see how to deliver and stream such content, see [Quickstart: Encode and stream files](stream-files-dotnet-quickstart.md).
* Stream live sporting events to a large online audience, such as soccer, baseball, college and high school sports, and more. 
* Broadcast public meetings and events such as town halls, city council meetings, and legislative bodies.
* Analyze recorded videos or audio content. For example, to achieve higher customer satisfaction, organizations can extract speech-to-text and build search indexes and dashboards. Then, they can extract intelligence around common complaints, sources of complaints, and other relevant data.
* Create a subscription video service and stream DRM protected content when a customer (for example, a movie studio) needs to restrict the access and use of proprietary copyrighted work.
* Deliver offline content for playback on airplanes, trains, and automobiles. A customer might need to download content onto their phone or tablet for playback when they anticipate to be disconnected from the network.
* Implement an educational e-learning video platform with Azure Media Services and [Azure Cognitive Services APIs](https://docs.microsoft.com/azure/#pivot=products&panel=ai) for speech-to-text captioning, translating to multi-languages, etc. 
* Use Azure Media Services together with [Azure Cognitive Services APIs](https://docs.microsoft.com/azure/#pivot=products&panel=ai) to add subtitles and captions to videos to cater to a broader audience (for example, people with hearing disabilities or people who want to read along in a different language).
* Enable Azure CDN to achieve large scaling to better handle instantaneous high loads (for example, the start of a product launch event). 

## How can I get started with v3? 

Learn how to encode and package content, stream videos on-demand, broadcast live, analyze your videos with Media Services v3. Tutorials, API references, and other documentation show you how to securely deliver on-demand and live video or audio streams that scale to millions of users.

> [!TIP]
> Before you start developing, review:<br/>* [Fundamental concepts](concepts-overview.md) (incudes important concepts: packaging, encoding, protecting, etc.)<br/>* [Developing with Media Services v3 APIs](media-services-apis-overview.md) (includes information on accessing APIs, naming conventions, etc.)

### Quickstarts  

The quickstarts show fundamental day-1 instructions for new customers to quickly try out Media Services.

* [Stream video files - .NET](stream-files-dotnet-quickstart.md)
* [Stream video files - CLI](stream-files-cli-quickstart.md)
* [Stream video files - Node.js](stream-files-nodejs-quickstart.md)
    
### Tutorials 

The tutorials show scenario-based procedures for some of the top Media Services tasks.

* [Encode remote file and stream video – REST](stream-files-tutorial-with-rest.md)
* [Encode uploaded file and stream video - .NET](stream-files-tutorial-with-api.md)
* [Stream live - .NET](stream-live-tutorial-with-api.md)
* [Analyze your video - .NET](analyze-videos-tutorial-with-api.md)
* [AES-128 dynamic encryption - .NET](protect-with-aes128.md)
    
### How-to guides

Articles contain code samples that demonstrate how to complete a task. In this section, you will find many examples, here are just a few of them:

* [Create an account - CLI](create-account-cli-how-to.md)
* [Access APIs - CLI](access-api-cli-how-to.md)
* [Encode with HTTPS as job input - .NET](job-input-from-http-how-to.md)  
* [Monitor events - Portal](monitor-events-portal-how-to.md)
* [Encrypt dynamically with multi-DRM - .NET](protect-with-drm.md) 
* [How to encode with a custom transform - CLI](custom-preset-cli-howto.md)

## Ask questions, give feedback, get updates

Check out the [Azure Media Services community](media-services-community.md) article to see different ways you can ask questions, give feedback, and get updates about Media Services.

## Next steps

[Learn about fundamental concepts](concepts-overview.md)

