---
title: Comparison of Video Indexer and Azure Media Services v3 presets | Microsoft Docs
description: This topic compares Video Indexer and Azure Media Services v3 presets.
services: media-services
documentationcenter: ''
author: juliako
manager: femila
editor: ''

ms.service: media-services
ms.subservice: video-indexer
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/15/2019
ms.author: juliako

---

# Compare Azure Media Services v3 presets and Video Indexer 

This article compares the capabilities of **Video Indexer APIs** and **Media Services v3 APIs**. 

Currently, there is an overlap between features offered by the [Video Indexer APIs](https://api-portal.videoindexer.ai/) and the [Media Services v3 APIs](https://github.com/Azure/azure-rest-api-specs/blob/master/specification/mediaservices/resource-manager/Microsoft.Media/stable/2018-07-01/Encoding.json). The following table offers the current guideline for understanding the differences and similarities. 

## Compare

|Feature|Video Indexer APIs |Video Analyzer and Audio Analyzer Presets<br/>in Media Services v3 APIs|
|---|---|---|
|Media Insights|[Enhanced](video-indexer-output-json-v2.md) |[Fundamentals](../latest/intelligence-concept.md)|
|Experiences|See the full list of supported features: <br/> [Overview](video-indexer-overview.md)|Returns video insights only|
|Billing|[Media Services pricing](https://azure.microsoft.com/pricing/details/media-services/#analytics)|[Media Services pricing](https://azure.microsoft.com/pricing/details/media-services/#analytics)|
|Compliance|[ISO 27001](https://www.microsoft.com/TrustCenter/Compliance/ISO-IEC-27001), [ISO 27018](https://www.microsoft.com/trustcenter/Compliance/ISO-IEC-27018), [SOC 1,2,3](https://www.microsoft.com/TrustCenter/Compliance/SOC), [HIPAA](https://www.microsoft.com/trustcenter/compliance/hipaa), [FedRAMP](https://www.microsoft.com/TrustCenter/Compliance/fedramp), [PCI](https://www.microsoft.com/trustcenter/compliance/pci), and [HITRUST](https://www.microsoft.com/TrustCenter/Compliance/hitrust) certified. For the most current updates, visit [current certifications status of Video Indexer](https://gallery.technet.microsoft.com/Overview-of-Azure-c1be3942).|Media Services is compliant with many certifications. Check out [Azure Compliance Offerings.pdf](https://gallery.technet.microsoft.com/Overview-of-Azure-c1be3942/file/178110/23/Microsoft%20Azure%20Compliance%20Offerings.pdf) and search for "Media Services" to see if it complies with a certificate of interest.|
|Free Trial|East US|Not available|
|Region availability|East US 2, South Central US, West US 2, North Europe, West Europe, Southeast Asia, East Asia, and Australia East.  For the most current updates, visit the [products by region](https://azure.microsoft.com/global-infrastructure/services/?products=cognitive-services) page.|See [Azure status](https://azure.microsoft.com/global-infrastructure/services/?products=media-services).|

## Next steps

[Video Indexer overview](video-indexer-overview.md)

[Media Services v3 overview](../latest/media-services-overview.md)
