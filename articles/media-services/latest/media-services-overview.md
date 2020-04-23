---
title: Azure Media Services v3 overview
titleSuffix: Azure Media Services
description: A high-level overview of Azure Media Services v3 with links to quickstarts, tutorials, and code samples.
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
ms.date: 03/09/2020
ms.author: juliako
ms.custom: mvc
#Customer intent: As a developer or a content provider, I want to encode, stream (on demand or live), analyze my media content so that my customers can: view the content on a wide variety of browsers and devices, gain valuable insights from recorded content.
---

# Azure Media Services v3 overview

Azure Media Services is a cloud-based platform that enables you to build solutions that achieve broadcast-quality video streaming, enhance accessibility and distribution, analyze content, and much more. Whether you're an app developer, a call center, a government agency, or an entertainment company, Media Services helps you create apps that deliver media experiences of outstanding quality to large audiences on today's most popular mobile devices and browsers.

The Media Services v3 SDKs are based on [Media Services v3 OpenAPI Specification (Swagger)](https://aka.ms/ams-v3-rest-sdk).

> [!NOTE]
> Currently, you can use the [Azure portal](https://portal.azure.com/) to: manage Media Services v3 [Live Events](live-events-outputs-concept.md), view (not manage) v3 [Assets](assets-concept.md), [get info about accessing APIs](access-api-portal.md). 
> For all other management tasks (for example, [Transforms and Jobs](transforms-jobs-concept.md) and [Content protection](content-protection-overview.md)), use the [REST API](https://docs.microsoft.com/rest/api/media/), [CLI](https://aka.ms/ams-v3-cli-ref), or one of the supported [SDKs](media-services-apis-overview.md#sdks).

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Compliance, Privacy and Security

As an important reminder, you must comply with all applicable laws in your use of Azure Media Services, and you may not use Media Services or any Azure service in a manner that violates the rights of others, or that may be harmful to others.

Before uploading any video/image to Media Services, You must have all the proper rights to use the video/image, including, where required by law, all the necessary consents from individuals (if any) in the video/image, for the use, processing, and storage of their data in Media Services and Azure. Some jurisdictions may impose special legal requirements for the collection, online processing and storage of certain categories of data, such as biometric data. Before using Media Services and Azure for the processing and storage of any data subject to special legal requirements, You must ensure compliance with any such legal requirements that may apply to You.

To learn about compliance, privacy and security in Media Services please visit the Microsoft [Trust Center](https://www.microsoft.com/trust-center/?rtc=1). For Microsoft's privacy obligations, data handling and retention practices, including how to delete your data, please review Microsoft's [Privacy Statement](https://privacy.microsoft.com/PrivacyStatement), the [Online Services Terms](https://www.microsoft.com/licensing/product-licensing/products?rtc=1) ("OST") and [Data Processing Addendum](https://www.microsoftvolumelicensing.com/DocumentSearch.aspx?Mode=3&DocumentTypeId=67) ("DPA"). By using Media Services, you agree to be bound by the OST, DPA and the Privacy Statement.
 
## What can I do with Media Services?

Media Services lets you build a variety of media workflows in the cloud. Some examples of what you can do with Media Services include:

* Deliver videos in various formats so they can be played on a wide variety of browsers and devices. For both on-demand and live streaming delivery to various clients (mobile devices, TV, PC, and so on), the video and audio content needs to be encoded and packaged appropriately. To see how to deliver and stream such content, see [Quickstart: Encode and stream files](stream-files-dotnet-quickstart.md).
* Stream live sporting events to a large online audience, like soccer, baseball, college and high school sports, and more.
* Broadcast public meetings and events, like town halls, city council meetings, and legislative bodies.
* Analyze recorded videos or audio content. For example, to achieve higher customer satisfaction, organizations can extract speech-to-text and build search indexes and dashboards. Then, they can extract intelligence around common complaints, sources of complaints, and other relevant data.
* Create a subscription video service and stream DRM protected content when a customer (for example, a movie studio) needs to restrict the access and use of proprietary copyrighted work.
* Deliver offline content for playback on airplanes, trains, and automobiles. A customer might need to download content onto their phone or tablet for playback when they anticipate to be disconnected from the network.
* Implement an educational e-learning video platform with Azure Media Services and [Azure Cognitive Services APIs](https://docs.microsoft.com/azure/?pivot=products&panel=ai) for speech-to-text captioning, translating to multi-languages, and so on.
* Use Azure Media Services together with [Azure Cognitive Services APIs](https://docs.microsoft.com/azure/?pivot=products&panel=ai) to add subtitles and captions to videos to cater to a broader audience (for example, people with hearing disabilities or people who want to read along in a different language).
* Enable Azure CDN to achieve large scaling to better handle instantaneous high loads (for example, the start of a product launch event).

## How can I get started with v3? 

Learn how to encode and package content, stream videos on-demand, broadcast live, and analyze your videos with Media Services v3. Tutorials, API references, and other documentation show you how to securely deliver on-demand and live video or audio streams that scale to millions of users.

> [!TIP]
> Before you start developing, review:<br/>* [Fundamental concepts](concepts-overview.md) (incudes important concepts, like packaging, encoding, and protecting)<br/>* [Developing with Media Services v3 APIs](media-services-apis-overview.md) (includes information on accessing APIs, naming conventions, and so on)

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
* [Analyze your video - .NET](analyze-videos-tutorial-with-api.md)
* [AES-128 dynamic encryption - .NET](protect-with-aes128.md)

### Samples

Use [this samples browser](https://docs.microsoft.com/samples/browse/?products=azure-media-services) to browse Azure Media Services code samples.

### How-to guides

How-to guides contain code samples that demonstrate how to complete a task. In this section, you'll find many examples. Here are a few of them:

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
