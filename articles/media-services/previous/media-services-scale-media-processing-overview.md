---
title: Media reserved units overview | Microsoft Docs
description: This article is an overview of scaling Media Processing with Azure Media Services.
services: media-services
documentationcenter: ''
author: jiayali
manager: femila
editor: ''
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 08/24/2021
ms.author: inhenkel
---
# Media reserved units

[!INCLUDE [media services api v2 logo](./includes/v2-hr.md)]

Media Reserved Units (MRUs) were previously used to control encoding concurrency and performance. MRUs are only being used for the following legacy media processors that are to be deprecated soon. See [Azure Media Services legacy components](legacy-components.md) for retirement info for these legacy processors:

* Media Encoder Premium Workflow
* Media Indexer V1 and V2

For all other media processors, you no longer need to manage MRUs or request quota increases for any media services account as the system will automatically scale up and down based on load. You will also see performance that is equal to or improved in comparison to using MRUs.

## Billing

While there were previously charges for Media Reserved Units, as of April 17, 2021 there are no longer any charges for accounts that have configuration for Media Reserved Units.

## Scaling MRUs

For compatibility purposes, you can continue to use the Azure portal or the following APIs to manage and scale MRUs:

[.NET](media-services-dotnet-encoding-units.md)
[Portal](media-services-portal-scale-media-processing.md)
[REST](/rest/api/media/operations/encodingreservedunittype)
[Java](https://github.com/rnrneverdies/azure-sdk-for-media-services-java-samples)
[PHP](https://github.com/Azure/azure-sdk-for-php/tree/master/examples/MediaServices)

However, by default none of the MRU configuration that you set will be used to control encoding concurrency or performance. The only exception to this configuration is if you are encoding with one of the following legacy media processors: Media Encoder Premium Workflow or Media Indexer V1.  
