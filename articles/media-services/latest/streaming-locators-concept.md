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
ms.date: 03/04/2020
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
* You should design a limited set of policies for your Media Service account and reuse them for your Streaming Locators whenever the same options are needed. For more information, see [Quotas and limits](limits-quotas-constraints.md).

## Create Streaming Locators  

### Not encrypted

If you want to stream your file in-the-clear (non-encrypted), set the predefined clear streaming policy: to 'Predefined_ClearStreamingOnly' (in .NET, you can use the PredefinedStreamingPolicy.ClearStreamingOnly enum).

```csharp
StreamingLocator locator = await client.StreamingLocators.CreateAsync(
    resourceGroup,
    accountName,
    locatorName,
    new StreamingLocator
    {
        AssetName = assetName,
        StreamingPolicyName = PredefinedStreamingPolicy.ClearStreamingOnly
    });
```

### Encrypted 

If you need to encrypt your content with the CENC encryption, set your policy to 'Predefined_MultiDrmCencStreaming'. The  Widevine encryption will be applied to a DASH stream and PlayReady to Smooth. The key will be delivered to a playback client based on the configured DRM licenses.

```csharp
StreamingLocator locator = await client.StreamingLocators.CreateAsync(
    resourceGroup,
    accountName,
    locatorName,
    new StreamingLocator
    {
        AssetName = assetName,
        StreamingPolicyName = "Predefined_MultiDrmCencStreaming",
        DefaultContentKeyPolicyName = contentPolicyName
    });
```

If you also want to encrypt your HLS stream with CBCS (FairPlay), use 'Predefined_MultiDrmStreaming'.

> [!NOTE]
> Widevine is a service provided by Google Inc. and subject to the terms of service and Privacy Policy of Google, Inc.

## Associate filters with Streaming Locators

See [Filters: associate with Streaming Locators](filters-concept.md#associating-filters-with-streaming-locator).

## Filter, order, page Streaming Locator entities

See [Filtering, ordering, paging of Media Services entities](entities-overview.md).

## List Streaming Locators by Asset name

To get Streaming Locators based on the associated Asset name, use the following operations:

|Language|API|
|---|---|
|REST|[liststreaminglocators](https://docs.microsoft.com/rest/api/media/assets/liststreaminglocators)|
|CLI|[az ams asset list-streaming-locators](https://docs.microsoft.com/cli/azure/ams/asset?view=azure-cli-latest#az-ams-asset-list-streaming-locators)|
|.NET|[ListStreamingLocators](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.media.assetsoperationsextensions.liststreaminglocators?view=azure-dotnet#Microsoft_Azure_Management_Media_AssetsOperationsExtensions_ListStreamingLocators_Microsoft_Azure_Management_Media_IAssetsOperations_System_String_System_String_System_String_)|
|Java|[AssetStreamingLocator](https://docs.microsoft.com/rest/api/media/assets/liststreaminglocators#assetstreaminglocator)|
|Node.js|[listStreamingLocators](https://docs.microsoft.com/javascript/api/@azure/arm-mediaservices/assets#liststreaminglocators-string--string--string--msrest-requestoptionsbase-)|

## See also

* [Assets](assets-concept.md)
* [Streaming Policies](streaming-policy-concept.md)
* [Content Key Policies](content-key-policy-concept.md)
* [Tutorial: Upload, encode, and stream videos using .NET](stream-files-tutorial-with-api.md)

## Next steps

[How to create a streaming locator and build URLs](create-streaming-locator-build-url.md)
