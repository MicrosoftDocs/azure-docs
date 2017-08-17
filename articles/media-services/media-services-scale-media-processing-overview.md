---
title: Scaling Media Processing overview | Microsoft Docs
description: This topic is an overview of scaling Media Processing with Azure Media Services.
services: media-services
documentationcenter: ''
author: juliako
manager: erikre
editor: ''

ms.assetid: 780ef5c2-3bd6-4261-8540-6dee77041387
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/04/2017
ms.author: juliako

---
# Scaling Media Processing overview
This page gives an overview of how and why to scale media processing. 

## Overview
A Media Services account is associated with a Reserved Unit Type, which determines the speed with which your media processing tasks are processed. You can pick between the following reserved unit types: **S1**, **S2**, or **S3**. For example, the same encoding job runs faster when you use the **S2** reserved unit type compare to the **S1** type. For more information, see the [Reserved Unit Types](https://azure.microsoft.com/blog/high-speed-encoding-with-azure-media-services/).

In addition to specifying the reserved unit type, you can specify to provision your account with reserved units. The number of provisioned reserved units determines the number of media tasks that can be processed concurrently in a given account. For example, if your account has five reserved units, then five media tasks will be running concurrently as long as there are tasks to be processed. The remaining tasks will wait in the queue and will get picked up for processing sequentially when a running task finishes. If an account does not have any reserved units provisioned, then tasks will be picked up sequentially. In this case, the wait time between one task finishing and the next one starting will depend on the availability of resources in the system.

## Choosing between different reserved unit types
The following table helps you make decision when choosing between different encoding speeds. It also provides a few benchmark cases and provides SAS URLs that you can use to download videos on which you can perform your own tests:

| Scenarios | **S1** | **S2** | **S3** |
| --- | --- | --- | --- |
| Intended use case |Single bitrate encoding. <br/>Files at SD or below resolutions, not time sensitive, low cost. |Single bitrate and multiple bitrate encoding.<br/>Normal usage for both SD and HD encoding. |Single bitrate and multiple bitrate encoding.<br/>Full HD and 4K resolution videos. Time sensitive, faster turnaround encoding. |
| Benchmark |[Input file: 5 minutes long 640x360p at 29.97 frames/second](https://wamspartners.blob.core.windows.net/for-long-term-share/Whistler_5min_360p30.mp4?sr=c&si=AzureDotComReadOnly&sig=OY0TZ%2BP2jLK7vmcQsCTAWl33GIVCu67I02pgarkCTNw%3D).<br/><br/>Encoding to a single bitrate MP4 file, at the same resolution, takes approximately 11 minutes. |[Input file: 5 minutes long 1280x720p at 29.97 frames/second](https://wamspartners.blob.core.windows.net/for-long-term-share/Whistler_5min_720p30.mp4?sr=c&si=AzureDotComReadOnly&sig=OY0TZ%2BP2jLK7vmcQsCTAWl33GIVCu67I02pgarkCTNw%3D)<br/><br/>Encoding with "H264 Single Bitrate 720p" preset takes approximately 5 minutes.<br/><br/>Encoding with "H264 Multiple Bitrate 720p" preset takes approximately 11.5 minutes. |[Input file: 5 minutes long 1920x1080p at 29.97 frames/second](https://wamspartners.blob.core.windows.net/for-long-term-share/Whistler_5min_1080p30.mp4?sr=c&si=AzureDotComReadOnly&sig=OY0TZ%2BP2jLK7vmcQsCTAWl33GIVCu67I02pgarkCTNw%3D). <br/><br/>Encoding with "H264 Single Bitrate 1080p" preset takes approximately 2.7 minutes.<br/><br/>Encoding with "H264 Multiple Bitrate 1080p" preset takes approximately 5.7 minutes. |

## Considerations
> [!IMPORTANT]
> Review considerations described in this section.  
> 
> 

* Reserved Units work for parallelizing all media processing, including indexing jobs using Azure Media Indexer.  However, unlike encoding, indexing jobs do not get processed faster with faster reserved units.
* If using the shared pool, that is, without any reserved units, then your encode tasks have the same performance as with S1 RUs. However, there is no upper bound to the time your Tasks can spend in queued state, and at any given time, at most only one Task will be running.
* The following data centers do not offer the **S2** reserved unit type: Brazil South, and India West.
* The following data center does not offer the **S3** reserved unit type: India West.

## Billing

You are charged based on actual minutes of usage of Media Reserved Units. For a detailed explanation, see the FAQ section of the [Media Services pricing](https://azure.microsoft.com/pricing/details/media-services/) page.   

## Quotas and limitations
For information about quotas and limitations and how to open a support ticket, see [Quotas and limitations](media-services-quotas-and-limitations.md).

## Next step
Achieve the scaling media processing task with one of these technologies: 

> [!div class="op_single_selector"]
> * [.NET](media-services-dotnet-encoding-units.md)
> * [Portal](media-services-portal-scale-media-processing.md)
> * [REST](https://docs.microsoft.com/rest/api/media/operations/encodingreservedunittype)
> * [Java](https://github.com/southworkscom/azure-sdk-for-media-services-java-samples)
> * [PHP](https://github.com/Azure/azure-sdk-for-php/tree/master/examples/MediaServices)
> 
> 

## Media Services learning paths
[!INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]

