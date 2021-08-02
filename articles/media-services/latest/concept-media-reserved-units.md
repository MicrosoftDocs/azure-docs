---
title: Media reserved units - Azure 
description: Media reserved units allow you to scale media process and determine the speed of your media processing tasks.
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 09/30/2020
ms.author: inhenkel

---
# Media Reserved Units

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

Azure Media Services enables you to scale media processing by managing Media Reserved Units (MRUs). An MRU provides additional computing capacity required for encoding media. The number of MRUs determine the speed with which your media tasks are processed and how many media tasks can be processed concurrently in an account. For example, if your account has five MRUs and there are tasks to be processed, then five media tasks can be running concurrently. Any remaining tasks will be queued up and can be picked up for processing sequentially when a running task finishes. Each MRU that you provision results in a capacity reservation but does not provide you with dedicated resource. During times of extremely high demand, all of your MRUs may not start processing immediately.

A task is an individual operation of work on an Asset e.g. adaptive streaming encoding. When you submit a job, Media Services will take care of breaking out the job into individual operations (i.e. tasks) that will then be associated with separate MRUs.

## Choosing between different reserved unit types

The following table helps you make a decision when choosing between different encoding speeds.  It shows the duration of encoding for a 7 minute, 1080p video depending on the MRU used.

|RU type|Scenario|Example results for the 7 min 1080p video |
|---|---|---|
| **S1**|Single bitrate encoding. <br/>Files at SD or below resolutions, not time sensitive, low cost.|Encoding to single bitrate SD resolution MP4 file using “H264 Single Bitrate SD 16x9” takes around 7 minutes.|
| **S2**|Single bitrate and multiple bitrate encoding.<br/>Normal usage for both SD and HD encoding.|Encoding with "H264 Single Bitrate 720p" preset takes around 6 minutes.<br/><br/>Encoding with "H264 Multiple Bitrate 720p" preset takes around 12 minutes.|
| **S3**|Single bitrate and multiple bitrate encoding.<br/>Full HD and 4K resolution videos. Time sensitive, faster turnaround encoding.|Encoding with "H264 Single Bitrate 1080p" preset takes approximately 3 minutes.<br/><br/>Encoding with "H264 Multiple Bitrate 1080p" preset takes approximately 8 minutes.|

> [!NOTE]
> If you do not provision MRU’s for your account, your media tasks will be processed with the performance of an S1 MRU and tasks will be picked up sequentially. No processing capacity is reserved so the wait time between one task finishing and the next one starting will depend on the availability of resources in the system.

## Considerations

* For Audio Analysis and Video Analysis jobs that are triggered by Media Services v3 or Azure Video Analyzer for Media, provisioning the account with ten S3 units is highly recommended. If you need more than 10 S3 MRUs, open a support ticket using the [Azure portal](https://portal.azure.com/).
* For encoding tasks that don't have MRUs, there is no upper bound to the time your tasks can spend in queued state, and at most only one task will be running at a time.

## Billing

You are charged based on number of minutes the Media Reserved Units are provisioned in your account, whether or not there are any jobs running. For a detailed explanation, see the FAQ section of the [Media Services pricing](https://azure.microsoft.com/pricing/details/media-services/) page.

## Next step
[Scale Media Reserved Units with CLI](media-reserved-units-cli-how-to.md)
[Analyze videos](analyze-videos-tutorial.md)

## See also

* [Quotas and limits](limits-quotas-constraints-reference.md)
