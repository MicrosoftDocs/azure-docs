---
title: Things to consider when using Azure AI Video Indexer at scale - Azure
description: This topic explains what things to consider when using Azure AI Video Indexer at scale.
ms.topic: how-to
ms.date: 07/03/2023
ms.author: juliako
---

# Things to consider when using Azure AI Video Indexer at scale

When using Azure AI Video Indexer to index videos and your archive of videos is growing, consider scaling.

This article answers questions like:

* Are there any technological constraints I need to take into account?
* Is there a smart and efficient way of doing it?
* Can I prevent spending excess money in the process?

The article provides six best practices of how to use Azure AI Video Indexer at scale.

## When uploading videos consider using a URL over byte array

Azure AI Video Indexer does give you the choice to upload videos from URL or directly by sending the file as a byte array, the latter comes with some constraints. For more information, see [uploading considerations and limitations)](upload-index-videos.md)

First, it has file size limitations. The size of the byte array file is limited to 2 GB compared to the 30-GB upload size limitation while using URL.

Second, consider just some of the issues that can affect your performance and hence your ability to scale:

* Sending files using multi-part means high dependency on your network,
* service reliability,
* connectivity,
* upload speed,
* lost packets somewhere in the world wide web.

:::image type="content" source="./media/considerations-when-use-at-scale/first-consideration.png" alt-text="First consideration for using Azure AI Video Indexer at scale":::

When you upload videos using URL, you just need to provide a path to the location of a media file and Video Indexer takes care of the rest (see the `videoUrl` field in the [upload video](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Upload-Video) API).

> [!TIP]
> Use the `videoUrl` optional parameter of the upload video API.

To see an example of how to upload videos using URL, check out [this example](upload-index-videos.md). Or, you can use [AzCopy](../storage/common/storage-use-azcopy-v10.md) for a fast and reliable way to get your content to a storage account from which you can submit it to Azure AI Video Indexer using [SAS URL](../storage/common/storage-sas-overview.md). Azure AI Video Indexer recommends using *readonly* SAS URLs.

## Automatic Scaling of Media Reserved Units

Starting August 1st 2021, Azure Video Indexer enabled [Reserved Units](/azure/media-services/latest/concept-media-reserved-units)(MRUs) auto scaling by [Azure Media Services](/azure/media-services/latest/media-services-overview) (AMS), as a result you do not need to manage them through Azure Video Indexer. That allows price optimization, e.g. price reduction in many cases, based on your business needs as it is being auto scaled.

## Respect throttling

Azure Video Indexer is built to deal with indexing at scale, and when you want to get the most out of it you should also be aware of the system's capabilities and design your integration accordingly. You don't want to send an upload request for a batch of videos just to discover that some of the movies didn't upload and you are receiving an HTTP 429 response code (too many requests). There is an API request limit of 10 requests per second and up to 120 requests per minute.

Azure Video Indexer adds a `retry-after` header in the HTTP response, the header specifies when you should attempt your next retry. Make sure you respect it before trying your next request.

:::image type="content" source="./media/considerations-when-use-at-scale/respect-throttling.jpg" alt-text="Design your integration well, respect throttling":::

## Use callback URL

We recommend that instead of polling the status of your request constantly from the second you sent the upload request, you can add a callback URL and wait for Azure AI Video Indexer to update you. As soon as there is any status change in your upload request, you get a POST notification to the URL you specified.

You can add a callback URL as one of the parameters of the [upload video API](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Upload-Video). Check out the code samples in [GitHub repo](https://github.com/Azure-Samples/media-services-video-indexer/tree/master/).

For callback URL you can also use Azure Functions, a serverless event-driven platform that can be triggered by HTTP and implement a following flow.

### callBack URL definition

[!INCLUDE [callback url](./includes/callback-url.md)]

## Use the right indexing parameters for you

When making decisions related to using Azure AI Video Indexer at scale, look at how to get the most out of it with the right parameters for your needs. Think about your use case, by defining different parameters you can save money and make the indexing process for your videos faster.

Before uploading and indexing your video read the [documentation](upload-index-videos.md) to get a better idea of what your options are.

For example, don’t set the preset to streaming if you don't plan to watch the video, don't index video insights if you only need audio insights.

## Index in optimal resolution, not highest resolution

You might be asking, what video quality do you need for indexing your videos?

In many cases, indexing performance has almost no difference between HD (720P) videos and 4K videos. Eventually, you’ll get almost the same insights with the same confidence. The higher the quality of the movie you upload means the higher the file size, and this leads to higher computing power and time needed to upload the video.

For example, for the face detection feature, a higher resolution can help with the scenario where there are many small but contextually important faces. However, this comes with a quadratic increase in runtime and an increased risk of false positives.

Therefore, we recommend you to verify that you get the right results for your use case and to first test it locally. Upload the same video in 720P and in 4K and compare the insights you get.

## Next steps

[Examine the Azure AI Video Indexer output produced by API](video-indexer-output-json-v2.md)
