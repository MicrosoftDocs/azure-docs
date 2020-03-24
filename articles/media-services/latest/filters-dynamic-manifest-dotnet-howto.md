---
title: Creating filters with Azure Media Services v3 .NET SDK
description: This topic describes how to create filters so your client can use them to stream specific sections of a stream. Media Services creates dynamic manifests to achieve this selective streaming.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: ne
ms.topic: article
ms.date: 06/03/2019
ms.author: juliako

---
# Create filters with Media Services .NET SDK

When delivering your content to customers (streaming Live events or Video on Demand) your client might need more flexibility than what's described in the default asset's manifest file. Azure Media Services enables you to define account filters and asset filters for your content. 

For detailed description of this feature and scenarios where it is used, see [Dynamic Manifests](filters-dynamic-manifest-overview.md) and [Filters](filters-concept.md).

This topic shows how to use Media Services .NET SDK to define a filter for a Video on Demand asset and create [Account Filters](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.media.models.accountfilter?view=azure-dotnet) and [Asset Filters](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.media.models.assetfilter?view=azure-dotnet). 

> [!NOTE]
> Make sure to review [presentationTimeRange](filters-concept.md#presentationtimerange).

## Prerequisites 

- Review [Filters and dynamic manifests](filters-dynamic-manifest-overview.md).
- [Create a Media Services account](create-account-cli-how-to.md). Make sure to remember the resource group name and the Media Services account name. 
- Get information needed to [access APIs](access-api-cli-how-to.md)
- Review [Upload, encode, and stream using Azure Media Services](stream-files-tutorial-with-api.md) to see how to [start using .NET SDK](stream-files-tutorial-with-api.md#start_using_dotnet)

## Define a filter  

In .NET, you configure track selections with [FilterTrackSelection](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.media.models.filtertrackselection?view=azure-dotnet) and [FilterTrackPropertyCondition](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.media.models.filtertrackpropertycondition?view=azure-dotnet) classes. 

The following code defines a filter that includes any audio tracks that are EC-3 and any video tracks that have bitrate in the 0-1000000 range.

```csharp
var audioConditions = new List<FilterTrackPropertyCondition>()
{
    new FilterTrackPropertyCondition(FilterTrackPropertyType.Type, "Audio", FilterTrackPropertyCompareOperation.Equal),
    new FilterTrackPropertyCondition(FilterTrackPropertyType.FourCC, "EC-3", FilterTrackPropertyCompareOperation.Equal)
};

var videoConditions = new List<FilterTrackPropertyCondition>()
{
    new FilterTrackPropertyCondition(FilterTrackPropertyType.Type, "Video", FilterTrackPropertyCompareOperation.Equal),
    new FilterTrackPropertyCondition(FilterTrackPropertyType.Bitrate, "0-1000000", FilterTrackPropertyCompareOperation.Equal)
};

List<FilterTrackSelection> includedTracks = new List<FilterTrackSelection>()
{
    new FilterTrackSelection(audioConditions),
    new FilterTrackSelection(videoConditions)
};
```

## Create account filters

The following code shows how to use .NET to create an account filter that includes all track selections [defined above](#define-a-filter). 

```csharp
AccountFilter accountFilterParams = new AccountFilter(tracks: includedTracks);
client.AccountFilters.CreateOrUpdate(config.ResourceGroup, config.AccountName, "accountFilterName1", accountFilter);
```

## Create asset filters

The following code shows how to use .NET to create an asset filter that includes all track selections [defined above](#define-a-filter). 

```csharp
AssetFilter assetFilterParams = new AssetFilter(tracks: includedTracks);
client.AssetFilters.CreateOrUpdate(config.ResourceGroup, config.AccountName, encodedOutputAsset.Name, "assetFilterName1", assetFilterParams);
```

## Associate filters with Streaming Locator

You can specify a list of asset or account filters, which would apply to your Streaming Locator. The [Dynamic Packager (Streaming Endpoint)](dynamic-packaging-overview.md) applies this list of filters together with those your client specifies in the URL. This combination generates a [Dynamic Manifest](filters-dynamic-manifest-overview.md), which is based on filters in the URL + filters you specify on Streaming Locator. We recommend that you use this feature if you want to apply filters but do not want to expose the filter names in the URL.

The following C# code shows how to create a Streaming Locator and specify `StreamingLocator.Filters`. This is an optional property that takes an `IList<string>` of filter names.

```csharp
IList<string> filters = new List<string>();
filters.Add("filterName");

StreamingLocator locator = await client.StreamingLocators.CreateAsync(
    resourceGroup,
    accountName,
    locatorName,
    new StreamingLocator
    {
        AssetName = assetName,
        StreamingPolicyName = PredefinedStreamingPolicy.ClearStreamingOnly,
        Filters = filters
    });
```
      
## Stream using filters

Once you define filters, your clients could use them in the streaming URL. Filters could be applied to adaptive bitrate streaming protocols: Apple HTTP Live Streaming (HLS), MPEG-DASH, and Smooth Streaming.

The following table shows some examples of URLs with filters:

|Protocol|Example|
|---|---|
|HLS|`https://amsv3account-usw22.streaming.media.azure.net/fecebb23-46f6-490d-8b70-203e86b0df58/bigbuckbunny.ism/manifest(format=m3u8-aapl,filter=myAccountFilter)`|
|MPEG DASH|`https://amsv3account-usw22.streaming.media.azure.net/fecebb23-46f6-490d-8b70-203e86b0df58/bigbuckbunny.ism/manifest(format=mpd-time-csf,filter=myAssetFilter)`|
|Smooth Streaming|`https://amsv3account-usw22.streaming.media.azure.net/fecebb23-46f6-490d-8b70-203e86b0df58/bigbuckbunny.ism/manifest(filter=myAssetFilter)`|

## Next steps

[Stream videos](stream-files-tutorial-with-api.md) 


