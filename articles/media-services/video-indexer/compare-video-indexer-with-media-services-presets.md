---
title: Comparison of Video Indexer and Azure Media Services v3 presets | Microsoft Docs
description: This topic compares Video Indexer and Azure Media Services v3 presets.
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
ms.date: 09/27/2018
ms.author: juliako

---

# Compare Azure Media Services v3 presets and Video Indexer 

This article compares the capabilities of **Video Indexer APIs** and **Media Services v3 APIs**. 

Currently, there is an overlap between features offered by the [Video Indexer v2 APIs](https://api-portal.videoindexer.ai/) and the [Media Services v3 APIs](https://github.com/Azure/azure-rest-api-specs/blob/master/specification/mediaservices/resource-manager/Microsoft.Media/stable/2018-07-01/Encoding.json). The following table offers the current guideline for understanding the differences and similarities. 

## Compare

|Feature|Video Indexer APIs |Video Analyzer and Audio Analyzer Presets<br/>in Media Services v3 APIs|
|---|---|---|
|Media Insights|[Enhanced]() |[Fundamentals]()|
|Experiences||Returns video insights only|
|Compliance|TBD|Get the complete list from [https://ecosystemmanager.azurewebsites.net/v2/compliance/customer-promise](https://ecosystemmanager.azurewebsites.net/v2/compliance/customer-promise)|
|Free Trial|East US|Not available|
|Availability |West US, East Asia, North Europe|See [Azure status](https://azure.microsoft.com/status/).|

## Next steps

[Video Indexer overview](../../cognitive-services/video-indexer/video-indexer-overview.md?toc=%2fazure%2fmedia-services%2fvideo-indexer%2ftoc.json)

[Media Services v3 overview](../../media-services/latest/media-services-overview.md)
