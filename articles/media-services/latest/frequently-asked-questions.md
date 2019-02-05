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
ms.date: 02/05/2019
ms.author: juliako
---

# Azure Media Services v3 frequently asked questions

This article gives answers to Azure Media Services (AMS) v3 frequently asked questions.

## Media Services v2 vs v3 

### Can I use the Azure portal to manage v3 resources?

Not yet. You can use one of the supported SDKs. See tutorials and samples in this doc set.

### Is there an AssetFile concept in v3?

The AssetFiles were removed from the AMS API in order to separate Media Services from Storage SDK dependency. Now Storage, not Media Services, keeps the information that belongs in Storage. 

For more information, see [Migrate to Media Services v3](migrate-from-v2-to-v3.md).

### Where did client-side storage encryption go?

It is now recommended to use the server-side storage encryption (which is on by default). For more information, see [Azure Storage Service Encryption for Data at Rest](https://docs.microsoft.com/azure/storage/common/storage-service-encryption).

## v3 APIs

### How do I configure Media Reserved Units?

See, [Scale media processing with CLI](media-reserved-units-cli-how-to.md).

### What is the recommended upload method?

It is recommended to use the HTTP(s) ingests mehod. For more information, see [HTTP(s) ingest](job-input-from-http-how-to.md).

### How does pagination work?

Media Services supports $top for resources that support OData but the value passed to $top must be less than 1000 (for example, the page size for pagination).

This allows you to either get a small sample of items using $top (for example, the 100 most recent items) or to page though all items using pagination. 

Media Services does not support paging through the data with a user specified page size.

For more information, see [Filtering, ordering, paging](entities-overview.md).

### How to retrieve an entity in Media Services v3?

v3 is based on a unified API surface, which exposes both management and operations functionality built on **Azure Resource Manager**. In accordance with **Azure Resource Manager**, the resource names are always unique. Thus, you can use any unique identifier strings (for example, GUIDs) for your resource.

## Live streaming 

###  How to insert breaks/videos and image slates during live stream

Media Services v3 live encoding does not have support for inserting video or image slates yet. 

You can use a [live on-premises encoder](recommended-on-premises-live-encoders.md) to switch the source video. Many apps provide ability to switch sources, including Telestream Wirecast, Switcher Studio (on iOS), OBS Studio (free app), and many more.

## Next steps

> [!div class="nextstepaction"]
> [Media Services v3 overview](media-services-overview.md)
