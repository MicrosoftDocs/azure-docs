---
title: Comparison of Azure Video Analyzer for Media (formerly Video Indexer) and Azure Media Services v3 presets
description: This article compares Azure Video Analyzer for Media (formerly Video Indexer) capabilities and Azure Media Services v3 presets.
services: azure-video-analyzer
documentationcenter: ''
author: juliako
manager: femila
editor: ''

ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.subservice: azure-video-analyzer-media
ms.date: 02/24/2020
ms.author: juliako

---

# Compare Azure Media Services v3 presets and Video Analyzer for Media 

This article compares the capabilities of **Video Analyzer for Media (formerly Video Indexer) APIs** and **Media Services v3 APIs**. 

Currently, there is an overlap between features offered by the [Video Analyzer for Media APIs](https://api-portal.videoindexer.ai/) and the [Media Services v3 APIs](https://github.com/Azure/azure-rest-api-specs/blob/master/specification/mediaservices/resource-manager/Microsoft.Media/stable/2018-07-01/Encoding.json). The following table offers the current guideline for understanding the differences and similarities. 

## Compare

|Feature|Video Analyzer for Media APIs |Video Analyzer and Audio Analyzer Presets<br/>in Media Services v3 APIs|
|---|---|---|
|Media Insights|[Enhanced](video-indexer-output-json-v2.md) |[Fundamentals](../../media-services/latest/analyze-video-audio-files-concept.md)|
|Experiences|See the full list of supported features: <br/> [Overview](video-indexer-overview.md)|Returns video insights only|
|Billing|[Media Services pricing](https://azure.microsoft.com/pricing/details/media-services/#analytics)|[Media Services pricing](https://azure.microsoft.com/pricing/details/media-services/#analytics)|
|Compliance|For the most current compliance updates, visit [Azure Compliance Offerings.pdf](https://gallery.technet.microsoft.com/Overview-of-Azure-c1be3942/file/178110/23/Microsoft%20Azure%20Compliance%20Offerings.pdf) and search for "Video Analyzer for Media" to see if it complies with a certificate of interest.|For the most current compliance updates, visit [Azure Compliance Offerings.pdf](https://gallery.technet.microsoft.com/Overview-of-Azure-c1be3942/file/178110/23/Microsoft%20Azure%20Compliance%20Offerings.pdf) and search for "Media Services" to see if it complies with a certificate of interest.|
|Free Trial|East US|Not available|
|Region availability|See [Cognitive Services availability by region](https://azure.microsoft.com/global-infrastructure/services/?products=cognitive-services)|See [Media Services availability by region](https://azure.microsoft.com/global-infrastructure/services/?products=media-services).|

## Next steps

[Video Analyzer for Media overview](video-indexer-overview.md)

[Media Services v3 overview](../../media-services/latest/media-services-overview.md)
