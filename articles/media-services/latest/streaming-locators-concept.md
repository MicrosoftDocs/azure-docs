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
ms.date: 05/22/2019
ms.author: juliako
---

# Streaming Locators

To make videos in the output Asset available to clients for playback, you have to create a [Streaming Locator](https://docs.microsoft.com/rest/api/media/streaminglocators) and then build streaming URLs. To build a URL, you need to concatenate the Streaming Endpoint host name and the Streaming Locator path. For .NET sample, see [Get a Streaming Locator](stream-files-tutorial-with-api.md#get-a-streaming-locator).

The process of creating a **Streaming Locator** is called publishing. By default, the **Streaming Locator** is valid immediately after you make the API calls, and lasts until it is deleted, unless you configure the optional start and end times. 

When creating a **Streaming Locator**, you must specify an **Asset** name and a **Streaming Policy** name. For more information, see the following topics:

* [Assets](assets-concept.md)
* [Streaming Policies](streaming-policy-concept.md)
* [Content Key Policies](content-key-policy-concept.md)

You can also specify the start and end time on your Streaming Locator, which will only let your user play the content between these times (for example, between 5/1/2019 to 5/5/2019).  

## Considerations

* **Streaming Locators** are not updatable. 
* Properties of **Streaming Locators** that are of the Datetime type are always in UTC format.
* You should design a limited set of policies for your Media Service account and reuse them for your Streaming Locators whenever the same options are needed. For more information, see [Quotas and limitations](limits-quotas-constraints.md).

## Associate filters with Streaming Locators

See [Filters: associate with Streaming Locators](filters-concept.md#associating-filters-with-streaming-locator).

## Filter, order, page Streaming Locator entities

See [Filtering, ordering, paging of Media Services entities](entities-overview.md).

## Next steps

[Tutorial: Upload, encode, and stream videos using .NET](stream-files-tutorial-with-api.md)
