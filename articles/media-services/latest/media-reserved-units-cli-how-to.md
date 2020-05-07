---
title: Use CLI to scale Media Reserved Units - Azure | Microsoft Docs
description: This topic shows how to use CLI to scale media processing with Azure Media Services.
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
ms.date: 03/09/2020
ms.author: juliako
ms.custom: seodec18

---
# Scaling media processing

Azure Media Services enables you to scale media processing in your account by managing Media Reserved Units (MRUs). MRUs determine the speed with which your media processing tasks are processed. You can pick between the following reserved unit types: **S1**, **S2**, or **S3**. For example, the same encoding job runs faster when you use the **S2** reserved unit type compare to the **S1** type. 

In addition to specifying the reserved unit type, you can specify to provision your account with reserved units. The number of provisioned reserved units determines the number of media tasks that can be processed concurrently in a given account. For example, if your account has five reserved units, then five media tasks will be running concurrently as long as there are tasks to be processed. The remaining tasks will wait in the queue and will get picked up for processing sequentially when a running task finishes. If an account does not have any reserved units provisioned, then tasks will be picked up sequentially. In this case, the wait time between one task finishing and the next one starting will depend on the availability of resources in the system.

## Choosing between different reserved unit types

The following table helps you make a decision when choosing between different encoding speeds. It also provides a few benchmark cases on [a video that you can download](https://nimbuspmteam.blob.core.windows.net/asset-46f1f723-5d76-477e-a153-3fd0f9f90f73/SeattlePikePlaceMarket_7min.ts?sv=2015-07-08&sr=c&si=013ab6a6-5ebf-431e-8243-9983a6b5b01c&sig=YCgEB8DxYKK%2B8W9LnBykzm1ZRUTwQAAH9QFUGw%2BIWuc%3D&se=2118-09-21T19%3A28%3A57Z) to perform your own tests:

|RU type|Scenario|Example results for the [7 min 1080p video](https://nimbuspmteam.blob.core.windows.net/asset-46f1f723-5d76-477e-a153-3fd0f9f90f73/SeattlePikePlaceMarket_7min.ts?sv=2015-07-08&sr=c&si=013ab6a6-5ebf-431e-8243-9983a6b5b01c&sig=YCgEB8DxYKK%2B8W9LnBykzm1ZRUTwQAAH9QFUGw%2BIWuc%3D&se=2118-09-21T19%3A28%3A57Z)|
|---|---|---|
| **S1**|Single bitrate encoding. <br/>Files at SD or below resolutions, not time sensitive, low cost.|Encoding to single bitrate SD resolution MP4 file using “H264 Single Bitrate SD 16x9” takes around 7 minutes.|
| **S2**|Single bitrate and multiple bitrate encoding.<br/>Normal usage for both SD and HD encoding.|Encoding with "H264 Single Bitrate 720p" preset takes around 6 minutes.<br/><br/>Encoding with "H264 Multiple Bitrate 720p" preset takes around 12 minutes.|
| **S3**|Single bitrate and multiple bitrate encoding.<br/>Full HD and 4K resolution videos. Time sensitive, faster turnaround encoding.|Encoding with "H264 Single Bitrate 1080p" preset takes approximately 3 minutes.<br/><br/>Encoding with "H264 Multiple Bitrate 1080p" preset takes approximately 8 minutes.|

## Considerations

* For the Audio Analysis and Video Analysis jobs that are triggered by Media Services v3 or Video Indexer, S3 unit type is highly recommended.
* If using the shared pool, that is, without any reserved units, then your encode tasks have the same performance as with S1 RUs. However, there is no upper bound to the time your Tasks can spend in queued state, and at any given time, at most only one Task will be running.

The rest of the article shows how to use [Media Services v3 CLI](https://aka.ms/ams-v3-cli-ref) to scale MRUs.

> [!NOTE]
> For the Audio Analysis and Video Analysis Jobs that are triggered by Media Services v3 or Video Indexer, it is highly recommended to provision your account with 10 S3 MRUs. If you need more than 10 S3 MRUs, open a support ticket using the [Azure portal](https://portal.azure.com/).

## Prerequisites 

[Create a Media Services account](create-account-cli-how-to.md).

[!INCLUDE [media-services-cli-instructions](../../../includes/media-services-cli-instructions.md)]

## Scale Media Reserved Units with CLI

Run the `mru` command.

The following [az ams account mru](https://docs.microsoft.com/cli/azure/ams/account/mru?view=azure-cli-latest) command sets Media Reserved Units on the "amsaccount" account using the **count** and **type** parameters.

```azurecli
az ams account mru set -n amsaccount -g amsResourceGroup --count 10 --type S3
```

## Billing

You are charged based on number of minutes the Media Reserved Units are provisioned in your account. This occurs independent of whether there are any Jobs running in your account. For a detailed explanation, see the FAQ section of the [Media Services pricing](https://azure.microsoft.com/pricing/details/media-services/) page.   

## Next step

[Analyze videos](analyze-videos-tutorial-with-api.md) 

## See also

* [Quotas and limits](limits-quotas-constraints.md)
* [Azure CLI](https://docs.microsoft.com/cli/azure/ams?view=azure-cli-latest)
