---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Streaming Policies in Azure Media Services | Microsoft Docs
description: This article gives an explanation of what Streaming Policies are, and how they are used by Azure Media Services.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 02/03/2019
ms.author: juliako
---

# Streaming Policies

In Azure Media Services v3, [Streaming Policies](https://docs.microsoft.com/rest/api/media/streamingpolicies) enable you to define streaming protocols and encryption options for your StreamingLocators. Streaming Policies are associated with [Streaming Locators](streaming-locators-concept.md). You can either use one of the predefined Streaming Policies or created a custom policy. The predefined Streaming Policies currently available are: 'Predefined_DownloadOnly', 'Predefined_ClearStreamingOnly', 'Predefined_DownloadAndClearStreaming', 'Predefined_ClearKey', 'Predefined_MultiDrmCencStreaming' and 'Predefined_MultiDrmStreaming'.

> [!IMPORTANT]
> * Properties of **Streaming Policies** that are of the Datetime type are always in UTC format.
> * You should design a limited set of policies for your Media Service account and re-use them for your Streaming Locators whenever the same options and are needed. 

## Filtering, ordering, paging

See [Filtering, ordering, paging of Media Services entities](entities-overview.md).

## Next steps

[Stream a file](stream-files-dotnet-quickstart.md)
