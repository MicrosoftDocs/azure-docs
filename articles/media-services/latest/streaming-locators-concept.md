---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Streaming Locators in Azure Media Services | Microsoft Docs
description: This article gives an explanation of what Streaming Locators are, and how they are used by Azure Media Services.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 05/15/2019
ms.author: juliako
---

# Streaming Locators

To make videos in the output Asset available to clients for playback, you have to create a [Streaming Locator](https://docs.microsoft.com/rest/api/media/streaminglocators) and then build streaming URLs. For .NET sample, see [Get a Streaming Locator](stream-files-tutorial-with-api.md#get-a-streaming-locator).

The process of creating a **Streaming Locator** is called publishing. By default, the **Streaming Locator** is valid immediately after you make the API call, and lasts until it is deleted, unless you configure the optional start and end times. 

When creating a **Streaming Locator**, you need to specify the [Asset](https://docs.microsoft.com/rest/api/media/assets) name and the [Streaming Policy](https://docs.microsoft.com/rest/api/media/streamingpolicies) name. You can either use one of the predefined Streaming Policies or created a custom policy. For more information, see [Streaming Policies](streaming-policy-concept.md).

If you want to specify encryption options on your stream, create the **Content Key Policy** that configures how the content key is delivered to end clients via the Key Delivery component of Media Services. Associate your Streaming Locator with the **Content Key Policy** and the content key. For more information, see [Content Key Policy](content-key-policy-concept.md). It is recommended to not create a new Content Key Policy for each Streaming Locator. You should try to reuse the existing policies whenever the same options are needed.

> [!IMPORTANT]
> * Properties of **Streaming Locators** that are of the Datetime type are always in UTC format.
> * You should design a limited set of policies for your Media Service account and reuse them for your Streaming Locators whenever the same options are needed. 

## Associate filters with Streaming Locators

You can specify a list of [asset or account filters](filters-concept.md), which would apply to your [Streaming Locator](https://docs.microsoft.com/rest/api/media/streaminglocators/create#request-body). The [dynamic packager](dynamic-packaging-overview.md) applies this list of filters together with those your client specifies in the URL. This combination generates a [dynamic manifest](filters-dynamic-manifest-overview.md), which is based on filters in the URL + filters you specify on Streaming Locator. We recommend that you use this feature if you want to apply filters but do not want to expose the filter names in the URL.

## Filter, order, page Streaming Locator entities

See [Filtering, ordering, paging of Media Services entities](entities-overview.md).

## Next steps

* [Tutorial: Upload, encode, and stream videos using .NET](stream-files-tutorial-with-api.md)
* [Use DRM dynamic encryption and license delivery service](protect-with-drm.md)
