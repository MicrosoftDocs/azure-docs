---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Azure Media Services v3 frequently asked questions| Microsoft Docs
description: This article gives answers to Azure Media Services v3 frequently asked questions.
services: media-services
documentationcenter: ''
author: Juliako
manager: cfowler
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 05/29/2018
ms.author: juliako
---

# Azure Media Services v3 (preview) frequently asked questions

This article gives answers to Azure Media Services (AMS) v3 frequently asked questions.

## Can I use the Azure portal to manage v3 resources?

Not yet. You can use one of the supported SDKs. See tutorials and samples in this doc set.

## Is there an API for configuring Media Reserved Units?

The Media Services team is eliminating RUs in v3. However the necessary service work is not complete. Until then, customers have to use the Azure portal or AMS v2 APIs to set RUs (as described in [Scaling media processing](../previous/media-services-scale-media-processing-overview.md). 

When using **VideoAnalyzerPreset** and/or **AudioAnalyzerPreset**, set your Media Services account to 10 S3 Media Reserved Units.

## Does V3 Asset have no AssetFile concept?

The AssetFiles were removed from the AMS API in order to separate Media Services from Storage SDK dependency. Now Storage, not Media Services, keeps the information that belongs in Storage. 

## Where did client-side storage encryption go?

We now recommend server-side storage encryption (which is on by default).For more information, see [Azure Storage Service Encryption for Data at Rest](https://docs.microsoft.com/azure/storage/common/storage-service-encryption).

## What is the recommended upload method?

We recommend the use of HTTP(s) ingests. For more information, see [HTTP(s) ingest](job-input-from-http-how-to.md).

## How does pagination work?

Media Services supports $top for resources that support OData but the value passed to $top must be less than 1000 (for example, the page size for pagination).

This allows you to either get a small sample of items using $top (for example, the 100 most recent items) or to page though all items using pagination. 

Media Services does not support paging through the data with a user specified page size.

For more information, see [Filtering, ordering, paging](assets-concept.md#filtering-ordering-paging)

## How to retrieve an entity in Media Services v3?

v3 is based on a unified API surface, which exposes both management and operations functionality built on **Azure Resource Manager**. In accordance with **Azure Resource Manager**, the resource names are always unique. Thus, you can use any unique identifier strings (for example, GUIDs) for your resource names. 

## Next steps

> [!div class="nextstepaction"]
> [Media Services v3 overview](media-services-overview.md)
