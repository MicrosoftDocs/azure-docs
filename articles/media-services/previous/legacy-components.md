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
ms.date: 09/26/2019
ms.author: juliako
 
---
# Azure Media Services legacy components

Over time, there have been steady improvements and enhancements to Media Service components. As a result, some legacy components have been retired. You can find the instructions on how to migrate your application from the legacy component to a current component in the following articles.

## Legacy components and migration guidance

We are announcing deprecation of the *Windows Azure Media Encoder* (WAME) and *Azure Media Encoder* (AME) media processors. These processors are being retired on November 30, 2019.

* [Migrate from Windows Azure Media Encoder to Media Encoder Standard](migrate-windows-azure-media-encoder.md)
* [Migrate from Azure Media Encoder to Media Encoder Standard](migrate-azure-media-encoder.md)

We are also announcing deprecation of *Azure Media Indexer v1* and *Azure Media Indexer v2 Preview*. The [Azure Media Indexer v1](media-services-index-content.md) media processor will be retired on October 1st of 2020. The [[Azure Media Indexer v2 Preview](media-services-process-content-with-indexer2.md) media processors will be retired on January 1 of 2019.  [Azure Media Services Video Indexer](https://docs.microsoft.com/azure/media-services/video-indexer/) replaces these legacy media processors.

* [Migrate from Azure Media Indexer v1 and Azure Media Indexer v2 to Azure Media Services Video Indexer](migrate-indexer-v1-v2.md).

## Next steps

[Migration guidance for moving from Media Services v2 to v3](../latest/migrate-from-v2-to-v3.md)
