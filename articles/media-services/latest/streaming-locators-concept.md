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
ms.date: 05/08/2019
ms.author: juliako
---

# Streaming Locators

To make videos in the output Asset available to clients for playback, you have to create a [Streaming Locator](https://docs.microsoft.com/rest/api/media/streaminglocators) and then build streaming URLs. For .NET sample, see [Get a Streaming Locator](stream-files-tutorial-with-api.md#get-a-streaming-locator).

The process of creating a **Streaming Locator** is called publishing. By default, the **Streaming Locator** is valid immediately after you make the API calls, and lasts until it is deleted, unless you configure the optional start and end times. 

When creating a **Streaming Locator**, you need to specify the [Asset](https://docs.microsoft.com/rest/api/media/assets) name and the [Streaming Policy](https://docs.microsoft.com/rest/api/media/streamingpolicies) name. You can either use one of the predefined Streaming Policies or created a custom policy. The predefined policies currently available are: 'Predefined_DownloadOnly', 'Predefined_ClearStreamingOnly', 'Predefined_DownloadAndClearStreaming', 'Predefined_ClearKey', 'Predefined_MultiDrmCencStreaming' and 'Predefined_MultiDrmStreaming'. When using a custom streaming policy, you should design a limited set of such policies for your Media Service account, and reuse them for your Streaming Locators whenever the same options and protocols are needed. 

If you want to specify encryption options on your stream, create the [Content Key Policy](https://docs.microsoft.com/rest/api/media/contentkeypolicies) that configures how the content key is delivered to end clients via the Key Delivery component of Media Services. Associate your Streaming Locator with the **Content Key Policy** and the content key. You can let Media Services to autogenerate the key. The following .NET example shows how to configure AES encryption with a token restriction in Media Services v3: [EncodeHTTPAndPublishAESEncrypted](https://github.com/Azure-Samples/media-services-v3-dotnet-core-tutorials/tree/master/NETCore/EncodeHTTPAndPublishAESEncrypted). **Content Key Policies** are updatable, you might want to update the policy if you need to do a key rotation. It can take up to 15 minutes for the Key Delivery caches to update and pick up the updated policy. It is recommended to not create a new Content Key Policy for each Streaming Locator. You should try to reuse the existing policies whenever the same options are needed.

> [!IMPORTANT]
> * Properties of **Streaming Locators** that are of the Datetime type are always in UTC format.
> * You should design a limited set of policies for your Media Service account and reuse them for your Streaming Locators whenever the same options are needed. 

## Associate filters with Streaming Locators

See [Filters: associate with Streaming Locators](filters-concept.md#associate-filters-with-streaming-locator).

## Filter, order, page Streaming Locator entities

See [Filtering, ordering, paging of Media Services entities](entities-overview.md).

## Next steps

* [Tutorial: Upload, encode, and stream videos using .NET](stream-files-tutorial-with-api.md)
* [Use DRM dynamic encryption and license delivery service](protect-with-drm.md)
