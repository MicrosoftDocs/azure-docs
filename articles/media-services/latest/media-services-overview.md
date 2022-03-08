---
title: Azure Media Services v3 overview
: Azure Media Services
description: A high-level overview of Azure Media Services v3 with links to quickstarts, tutorials, and code samples.
services: media-services
documentationcenter: na
author: IngridAtMicrosoft
manager: femila
editor: ''
tags: ''
keywords: azure media services, stream, broadcast, live, offline

ms.service: media-services
ms.topic: overview
ms.tgt_pltfrm: multiple
ms.workload: media
ms.date: 3/10/2021
ms.author: inhenkel
ms.custom: mvc
#Customer intent: As a developer or a content provider, I want to encode, stream (on demand or live), analyze my media content so that my customers can: view the content on a wide variety of browsers and devices, gain valuable insights from recorded content.
---

# Azure Media Services v3 overview

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

Azure Media Services is a cloud-based platform that enables you to build solutions that achieve broadcast-quality video streaming, enhance accessibility and distribution, analyze content, and much more. Whether you're an app developer, a call center, a government agency, or an entertainment company, Media Services helps you create apps that deliver media experiences of outstanding quality to large audiences on today's most popular mobile devices and browsers.

The Media Services v3 SDKs are based on [Media Services v3 OpenAPI Specification (Swagger)](https://aka.ms/ams-v3-rest-sdk).

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]
 
## What can I do with Media Services?

Media Services lets you build a variety of media workflows in the cloud. Some examples of what you can do with Media Services include:

* Deliver videos in various formats so they can be played on a wide variety of browsers and devices. For both on-demand and live streaming delivery to various clients (mobile devices, TV, PC, and so on), the video and audio content needs to be encoded and packaged appropriately. To see how to deliver and stream such content, see [Quickstart: Encode and stream files](stream-files-dotnet-quickstart.md).
* Stream live sporting events to a large online audience, like soccer, baseball, college and high school sports, and more.
* Broadcast public meetings and events, like town halls, city council meetings, and legislative bodies.
* Analyze recorded videos or audio content. For example, to achieve higher customer satisfaction, organizations can extract speech-to-text and build search indexes and dashboards. Then, they can extract intelligence around common complaints, sources of complaints, and other relevant data.
* Create a subscription video service and stream DRM protected content when a customer (for example, a movie studio) needs to restrict the access and use of proprietary copyrighted work.
* Deliver offline content for playback on airplanes, trains, and automobiles. A customer might need to download content onto their phone or tablet for playback when they anticipate to be disconnected from the network.
* Implement an educational e-learning video platform with Azure Media Services and [Azure Cognitive Services APIs](../../index.yml?pivot=products&panel=ai) for speech-to-text captioning, translating to multi-languages, and so on.
* Use Azure Media Services together with [Azure Cognitive Services APIs](../../index.yml?pivot=products&panel=ai) to add subtitles and captions to videos to cater to a broader audience (for example, people with hearing disabilities or people who want to read along in a different language).
* Enable Azure CDN to achieve large scaling to better handle instantaneous high loads (for example, the start of a product launch event).

## How can I get started with v3?

Learn how to encode and package content, stream videos on-demand, broadcast live, and analyze your videos with Media Services v3. Tutorials, API references, and other documentation show you how to securely deliver on-demand and live video or audio streams that scale to millions of users.

> [!TIP]
> Before you start developing, review: [Fundamental concepts](concepts-overview.md) which includes important concepts, like packaging, encoding, and protecting, and [Developing with Media Services v3 APIs](media-services-apis-overview.md) which includes information on accessing APIs, naming conventions, and so on.

### SDKs

Start developing with [Azure Media Services v3 client SDKs](media-services-apis-overview.md#sdks).

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
* [Analyze your video - .NET](analyze-videos-tutorial.md)
* [AES-128 dynamic encryption - .NET](drm-playready-license-template-concept.md)

### Samples

Use [this samples browser](/samples/browse/?products=azure-media-services) to browse Azure Media Services code samples.

### How-to guides

How-to guides contain code samples that demonstrate how to complete a task. In this section, you'll find many examples. Here are a few of them:

* [Create an account - CLI](./account-create-how-to.md)
* [Access APIs - CLI](./access-api-howto.md)
* [Encode with HTTPS as job input - .NET](job-input-from-http-how-to.md)  
* [Monitor events - Portal](monitoring/monitor-events-portal-how-to.md)
* [Encrypt dynamically with multi-DRM - .NET](drm-protect-with-drm-tutorial.md) 
* [How to encode with a custom transform - CLI](transform-custom-preset-cli-how-to.md)

## Ask questions, give feedback, get updates

Check out the [Azure Media Services community](media-services-community.md) article to see different ways you can ask questions, give feedback, and get updates about Media Services.

## Compliance, privacy and security

[!IMPORTANT] Read the [Compliance, privacy and security document](media-services-compliance.md) before using Azure Media Services to deliver your media content.
