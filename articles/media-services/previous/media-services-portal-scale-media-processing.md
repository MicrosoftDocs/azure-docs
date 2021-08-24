---
title: Scale media processing using the Azure portal | Microsoft Docs
description: This tutorial walks you through the steps of scaling media processing using the Azure portal.
services: media-services
documentationcenter: ''
author: jiayali
manager: femila
editor: ''
ms.assetid: e500f733-68aa-450c-b212-cf717c0d15da
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/24/2021
ms.author: inhenkel
---
# Change the reserved unit type

[!INCLUDE [media services api v2 logo](./includes/v2-hr.md)]

> [!div class="op_single_selector"]
> * [.NET](media-services-dotnet-encoding-units.md)
> * [Portal](media-services-portal-scale-media-processing.md)
> * [REST](/rest/api/media/operations/encodingreservedunittype)
> * [Java](https://github.com/rnrneverdies/azure-sdk-for-media-services-java-samples)
> * [PHP](https://github.com/Azure/azure-sdk-for-php/tree/master/examples/MediaServices)
> 
> 

## Overview

By default, Media Reserve Units are no longer needed to be used and are not supported by Azure Media Services. For compatibility purposes, the current Azure portal has an option for you to manage and scale MRUs. However, by default, none of the MRU configurations that you set will be used to control encoding concurrency or performance. Make sure to review the [Overview](media-services-scale-media-processing-overview.md) to get more information about scaling media processing. 

## Next steps
[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]
