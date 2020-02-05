---
title: Azure Media Services legacy components | Microsoft Docs
description: This topic discusses Azure Media Services legacy components.
services: media-services
documentationcenter: ''
author: juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/22/2019
ms.author: juliako
 
---
# Azure Media Services legacy components

Over time, there have been steady improvements and enhancements to Media Service components. As a result, some legacy components have been retired. You can find the instructions on how to migrate your application from the legacy component to a current component in the following articles.
 
## Retirement plans of legacy components and migration guidance

We are announcing deprecation of the *Windows Azure Media Encoder* (WAME) and *Azure Media Encoder* (AME) media processors. These processors are being retired on March 1st, 2020.

* [Migrate from Windows Azure Media Encoder to Media Encoder Standard](migrate-windows-azure-media-encoder.md)
* [Migrate from Azure Media Encoder to Media Encoder Standard](migrate-azure-media-encoder.md)

We are also announcing retirement of the following Media Analytics media processors: 
 
|Media processor name|Retirement date|Additional notes|
|---|---|
|[Azure Media Indexer 2](media-services-process-content-with-indexer2.md)| October 1st of 2020|This media processor will be replaced by [Azure Media Services Video Indexer](https://docs.microsoft.com/azure/media-services/video-indexer/). For more information, see [Migrate from Azure Media Indexer 2 to Azure Media Services Video Indexer](migrate-indexer-v1-v2.md).|
|[Azure Media Indexer](media-services-index-content.md)|October 1st of 2020|This media processor will be replaced by [Azure Media Services Video Indexer](https://docs.microsoft.com/azure/media-services/video-indexer/). For more information, see [Migrate from Azure Media Indexer to Azure Media Services Video Indexer](migrate-indexer-v1-v2.md)

## Next steps

[Migration guidance for moving from Media Services v2 to v3](../latest/migrate-from-v2-to-v3.md)
