---
title: Scale media processing using the Azure portal | Microsoft Docs
description: This tutorial walks you through the steps of scaling media processing using the Azure portal.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.assetid: e500f733-68aa-450c-b212-cf717c0d15da
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/19/2019
ms.author: juliako

---
# Change the reserved unit type
> [!div class="op_single_selector"]
> * [.NET](media-services-dotnet-encoding-units.md)
> * [Portal](media-services-portal-scale-media-processing.md)
> * [REST](https://docs.microsoft.com/rest/api/media/operations/encodingreservedunittype)
> * [Java](https://github.com/southworkscom/azure-sdk-for-media-services-java-samples)
> * [PHP](https://github.com/Azure/azure-sdk-for-php/tree/master/examples/MediaServices)
> 
> 

## Overview

A Media Services account is associated with a Reserved Unit Type, which determines the speed with which your media processing tasks are processed. You can pick between the following reserved unit types: **S1**, **S2**, or **S3**. For example, the same encoding job runs faster when you use the **S2** reserved unit type compare to the **S1** type.

In addition to specifying the reserved unit type, you can specify to provision your account with **Reserved Units** (RUs). The number of provisioned RUs determines the number of media tasks that can be processed concurrently in a given account.

>[!NOTE]
>RUs work for parallelizing all media processing, including indexing jobs using Azure Media Indexer. However, unlike encoding, indexing jobs do not get processed faster with faster reserved units.

> [!IMPORTANT]
> Make sure to review the [overview](media-services-scale-media-processing-overview.md) topic to get more information about scaling media processing topic.
> 
> 

## Scale media processing
To change the reserved unit type and the number of reserved units, do the following:

1. In the [Azure portal](https://portal.azure.com/), select your Azure Media Services account.
2. In the **Settings** window, select **Media reserved units**.
   
    To change the number of reserved units for the selected reserved unit type, use the **Media Served Units** slider at the top of the screen.
   
    To change the **RESERVED UNIT TYPE**, click on the **Speed of reserved processing units** bar. Then, select the pricing tier you need: S1, S2, or S3.
   
3. Press the SAVE button to save your changes.
   
    The new reserved units are allocated when you press SAVE.

## Next steps
Review Media Services learning paths.

[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]

