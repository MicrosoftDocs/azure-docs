---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Azure Media Services v3 frequently asked questions| Microsoft Docs
description: This article gives answers to Azure Media Services v3 frequently asked questions.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 02/20/2019
ms.author: juliako
---

# Azure Media Services v3 frequently asked questions

This article gives answers to Azure Media Services (AMS) v3 frequently asked questions.

## v3 APIs

### How do I configure Media Reserved Units?

For the Audio Analysis and Video Analysis Jobs that are triggered by Media Services v3 or Video Indexer, it is highly recommended to provision your account with 10 S3 MRUs. If you need more than 10 S3 MRUs, open a support ticket using the [Azure portal](https://portal.azure.com/).

For details, see [Scale media processing with CLI](media-reserved-units-cli-how-to.md).

### What is the recommended method to process videos?

Use [Transforms](https://docs.microsoft.com/rest/api/media/transforms) to configure common tasks for encoding or analyzing videos. Each **Transform** describes a recipe, or a workflow of tasks for processing your video or audio files. A [Job](https://docs.microsoft.com/rest/api/media/jobs) is the actual request to Media Services to apply the **Transform** to a given input video or audio content. Once the Transform has been created, you can submit jobs using Media Services APIs, or any of the published SDKs. For more information, see [Transforms and Jobs](transforms-jobs-concept.md).

### How does pagination work?

When using pagination, you should always use the next link to enumerate the collection and not depend on a particular page size. For details and examples, see [Filtering, ordering, paging](entities-overview.md).

## Live streaming 

###  How to insert breaks/videos and image slates during live stream?

Media Services v3 live encoding does not yet support inserting video or image slates during live stream. 

You can use a [live on-premises encoder](recommended-on-premises-live-encoders.md) to switch the source video. Many apps provide ability to switch sources, including Telestream Wirecast, Switcher Studio (on iOS), OBS Studio (free app), and many more.

## Content protection

For FAQs related to content protection, see:

- [Content protection overview](content-protection-overview.md#frequently-asked-questions)
- [Design of a multi-DRM content protection system with access control](design-multi-drm-system-with-access-control.md#faqs)

## Media Services v2 vs v3 

### Can I use the Azure portal to manage v3 resources?

Not yet. You can use one of the supported SDKs. See tutorials and samples in this doc set.

### Is there an AssetFile concept in v3?

The AssetFiles were removed from the AMS API in order to separate Media Services from Storage SDK dependency. Now Storage, not Media Services, keeps the information that belongs in Storage. 

For more information, see [Migrate to Media Services v3](migrate-from-v2-to-v3.md).

### Where did client-side storage encryption go?

It is now recommended to use the server-side storage encryption (which is on by default). For more information, see [Azure Storage Service Encryption for Data at Rest](https://docs.microsoft.com/azure/storage/common/storage-service-encryption).

## Next steps

> [!div class="nextstepaction"]
> [Media Services v3 overview](media-services-overview.md)
