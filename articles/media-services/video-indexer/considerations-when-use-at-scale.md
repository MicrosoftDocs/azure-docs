---
title: Things to consider when using Video Indexer at scale - Azure
titleSuffix: Azure Media Services
description: This topic explains what things to consider when using Video Indexer at scale.
services: media-services
author: itarbel
manager: ayardeni

ms.service: media-services
ms.subservice: video-indexer
ms.topic: how-to
ms.date: 11/13/2020
ms.author: itayar 
---

# Things to consider when using Video Indexer at scale

When using Azure Media Services Video indexer to index videos and your archive of videos is growing, consider scaling. 

This article answers questions like:

* Are there any technological constraints I need to take into account?
* Is there a smart and efficient way of doing it?
* Can I prevent spending excess money in the process?

The article provides six best practices of how to use Video Indexer at scale.

## When uploading videos, consider using a URL over byte array

Video Indexer does give you the choice to upload videos from URL or directly by sending the file as a byte array, but remember that the latter comes with some constraints.

First, it has file size limitations. The size of the byte array file is limited to 2 GB compared to the 30 GB upload size limitation while using URL.

Second, consider just some of the issues that can affect your performance and hence your ability to scale:

* Sending files using multi-part means high dependency on your network, 
* service reliability, 
* connectivity, 
* upload speed, 
* lost packets somewhere in the world wide web.

:::image type="content" source="./media/considerations-when-use-at-scale/first-consideration.png" alt-text="First consideration for using Video Indexer at scale":::

When you upload videos using URL you just need to give us a path to the location of a media file and we will take care of the rest (see below the field from the [upload video](https://api-portal.videoindexer.ai/docs/services/Operations/operations/Upload-Video?&pattern=upload) API).

> [!TIP]
> Use the `videoURL` optional parameter of the upload video API.

To see an example of how to upload videos using URL, check out this example(upload-index-videos.md#code-sample). Or, you can use [AzCopy](https://docs.microsoft.com/en-azure/storage/common/storage-use-azcopy-v10) for a fast and reliable way to get your content to a storage account from which you can submit it to Video Indexer using [SAS URL](https://docs.microsoft.com/azure/storage/common/storage-sas-overview).

## Increase media reserved units if needed

Usually in the proof of concept stage when you just start using Video Indexer, you don’t need a lot of computing power. Now, when you want to scale up your usage of Video Indexer you have a larger archive of videos you want to index and you want the process to be at a pace that fits your use case. Therefore, you should think about increasing the number of compute resources you use if the current amount of computing power is just not enough.

In Azure Media Services, when talking about computing power and parallelization we talk about media [reserved units](../latest/concept-media-reserved-units.md)(RUs), those are the compute units that determine the parameters for your media processing tasks. The number of RUs affects the number of media tasks that can be processed concurrently in each account and their type determines the speed of processing and one video might require more than one RU if its indexing is complex. When your RUs are busy, new tasks will be held in a queue until another resource is available.

We know you want to operate efficiently and you don’t want to have resources that eventually will stay idle part of the time. For that reason, we offer an auto-scale system that spins RUs down when less processing is needed and spin RUs up when you are in your rush hours (up to fully use all of your RUs). You can easily enable this functionality by [turning on the autoscale](manage-account-connected-to-azure.md#auto-scale-reserved-units) in the account settings or using [Update-Paid-Account-Azure-Media-Services API](https://api-portal.videoindexer.ai/docs/services/Operations/operations/Update-Paid-Account-Azure-Media-Services?&pattern=update).

:::image type="content" source="./media/considerations-when-use-at-scale/second-consideration.jpg" alt-text="Second consideration for using Video Indexer at scale":::

:::image type="content" source="./media/considerations-when-use-at-scale/reserved-units.jpg" alt-text="AMS reserved units":::

To minimize indexing duration and low throughput we recommend you start with 10 RUs of type S3. Later if you scale up to support more content or higher concurrency, and you need more resources to do so, you can [contact us using the support system](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) (on paid accounts only) to ask for more RUs allocation.

## Respect throttling

Video Indexer is built to deal with indexing at scale, and when you want to get the most out of it you should also be aware of the system’s capabilities and design your integration accordingly. You don’t want to send an upload request for a batch of videos just to discover that some of the movies didn’t upload and you are receiving an HTTP 429 response code (too many requests). It can happen due to the fact that you sent more requests than the [limit of movies per minute we support](upload-index-videos.md#uploading-considerations-and-limitations). Don’t worry, in the HTTP response, we add a retry-after header. The header we will specify when you should attempt your next retry. Make sure you respect it before trying your next request.

:::image type="content" source="./media/considerations-when-use-at-scale/throttling.jpg" alt-text="Respect throttling":::

## Use callback URL

Have you ever called customer service and their response was “I’m now processing your request, it will take a few minutes. You can leave your phone number and we'll get back to you when it is done”? The cases when you do leave your number and they call you back the second your request was processed are exactly the same concept as using [callbackUrl](upload-index-videos.md#callbackurl).

Thus we recommend that instead of polling the status of your request constantly from the second you sent the upload request, you can just add a callback URL, and wait for us to update you. As soon as there is any status change in your upload request, we will send a POST notification to the URL you sent.

You can add a callback URL as one of the parameters of the [upload video API](https://api-portal.videoindexer.ai/docs/services/Operations/operations/Upload-Video?&pattern=upload) (see below the description from the API). If you are not sure how to do it, you can check the code samples from our [GitHub repo](https://github.com/Azure-Samples/media-services-video-indexer/tree/master/). By the way, for callback URL you can also use Azure Functions, a serverless event-driven platform that can be triggered by HTTP and implement a following flow.

### callBack URL

[!INCLUDE [callback url](./includes/callback-url.md)]

## Use the right indexing parameters for you

Probably the first thing you need to do when using Video Indexer, and specifically when trying to scale, is to think about how to get the most out of it with the right parameters for your needs. Think about your use case, by defining different parameters you can save yourself money and make the indexing process for your videos faster.

We are giving you the option to customize your usage in Video Indexer by choosing those indexing parameters. Don’t set the preset to streaming it if you don’t plan to watch it, don’t index video insights if you only need audio insights, it is that easy.

Before uploading and indexing your video read this short [documentation](upload-index-videos.md), check the [indexingPreset](upload-index-videos.md#indexingpreset) and [streamingPreset](upload-index-videos.md#streamingpreset) parts to get a better idea of what your options are.

## Index in optimal resolution, not highest resolution

Not too long ago, we were in times when HD videos didn't exist. Now, we have videos of varied qualities from HD to 8K. The question is, what video quality do you need for indexing your videos? The higher the quality of the movie you upload means the higher the file size, and this leads to higher computing power and time needed to upload the video.

Our experiences show that, in many cases, indexing performance has almost no difference between HD (720P) videos and 4K videos. Eventually, you’ll get almost the same insights with the same confidence.

For example, for the face detection feature, a higher resolution can help with the scenario where there are many small but contextually important faces. However, this will come with a quadratic increase in runtime and an increased risk of false positives.

Therefore, we recommend you to verify that you get the right results for your use case and to first test it locally. Upload the same video in 720P and in 4K and compare the insights you get.

## Next steps

[Examine the Azure Video Indexer output produced by API](video-indexer-output-json-v2.md)
