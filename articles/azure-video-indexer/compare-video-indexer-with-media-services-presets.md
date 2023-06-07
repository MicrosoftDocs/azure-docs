---
title: Comparison of Azure Video Indexer and Azure Media Services v3 presets
description: This article compares Azure Video Indexer capabilities and Azure Media Services v3 presets.
ms.topic: conceptual
ms.date: 11/10/2022
ms.author: juliako

---

# Compare Azure Media Services v3 presets and Azure Video Indexer

This article compares the capabilities of **Azure Video Indexer(AVI) APIs** and **Media Services v3 APIs**.

Currently, there is an overlap between features offered by the [Azure Video Indexer APIs](https://api-portal.videoindexer.ai/) and the [Media Services v3 APIs](https://github.com/Azure/azure-rest-api-specs/blob/master/specification/mediaservices/resource-manager/Microsoft.Media/stable/2018-07-01/Encoding.json). Azure Media Services have [announced deprecation](https://learn.microsoft.com/azure/media-services/latest/release-notes#retirement-of-the-azure-media-redactor-video-analyzer-and-face-detector-on-september-14-2023) of their Video Analysis preset starting September 2023. It is advised to use Azure Video Indexer Video Analysis going forward, which is general available and offers more functionality.

The following table offers the current guideline for understanding the differences and similarities.

## Compare

|Feature|Azure Video Indexer APIs |Video Analyzer and Audio Analyzer Presets<br/>in Media Services v3 APIs|
|---|---|---|
|Media Insights|[Enhanced](video-indexer-output-json-v2.md) |[Fundamentals](/azure/media-services/latest/analyze-video-audio-files-concept)|
|Experiences|See the full list of supported features: <br/> [Overview](video-indexer-overview.md)|Returns video insights only|
|Pricing|[AVI pricing](https://azure.microsoft.com/pricing/details/video-indexer/) |[Media Services pricing](https://azure.microsoft.com/pricing/details/media-services/#analytics) |
|Compliance|For the most current compliance updates, visit [Azure Compliance Offerings.pdf](https://gallery.technet.microsoft.com/Overview-of-Azure-c1be3942/file/178110/23/Microsoft%20Azure%20Compliance%20Offerings.pdf) and search for "Azure Video Indexer" to see if it complies with a certificate of interest.|For the most current compliance updates, visit [Azure Compliance Offerings.pdf](https://gallery.technet.microsoft.com/Overview-of-Azure-c1be3942/file/178110/23/Microsoft%20Azure%20Compliance%20Offerings.pdf) and search for "Media Services" to see if it complies with a certificate of interest.|
|Trial|East US|Not available|
|Region availability|See [Cognitive Services availability by region](https://azure.microsoft.com/global-infrastructure/services/?products=cognitive-services)|See [Media Services availability by region](https://azure.microsoft.com/global-infrastructure/services/?products=media-services).|

## Next steps

[Azure Video Indexer overview](video-indexer-overview.md)

[Media Services v3 overview](/azure/media-services/latest/media-services-overview)
