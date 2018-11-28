---
title: Creating Filters with Azure Media Services .NET SDK
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
ms.date: 11/13/2018
ms.author: juliako

---
# Create filters with Media Services .NET SDK

When delivering your content to customers (streaming Live events or Video on Demand) your client might need more flexibility than what's described in the default asset's manifest file. Azure Media Services enables you to define account filters and asset filters for your content. For more information, see [Filters and dynamic manifests](filters-dynamic-manifest-overview.md).

This topic shows how to use Media Services .NET SDK to define a filter for a Video on Demand asset and create [Account Filters](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.media.models.accountfilter?view=azure-dotnet) and [Asset Filters](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.media.models.assetfilter?view=azure-dotnet). 

## Prerequisites 

- Review [Filters and dynamic manifests](filters-dynamic-manifest-overview.md).
- [Create a Media Services account](create-account-cli-how-to.md). Make sure to remember the resource group name and the Media Services account name. 
- Get information needed to [access APIs](access-api-cli-how-to.md)
- Review [Upload, encode, and stream using Azure Media Services](stream-files-tutorial-with-api.md) to see how to [start using .NET SDK](stream-files-tutorial-with-api.md#start_using_dotnet)

## Define a filter  

In .NET, you configure track selections with [FilterTrackSelection](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.media.models.filtertrackselection?view=azure-dotnet) and [FilterTrackPropertyCondition](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.media.models.filtertrackpropertycondition?view=azure-dotnet) classes. 

The following code defines a filter that includes any audio tracks that are English with EC-3 and any video tracks that have bitrate in the 0-1000000 range.

```csharp
var audioConditions = new List<FilterTrackPropertyCondition>()
{
    new FilterTrackPropertyCondition(FilterTrackPropertyType.Language, "en-us", FilterTrackPropertyCompareOperation.Equal),
    new FilterTrackPropertyCondition(FilterTrackPropertyType.FourCC, "EC-3", FilterTrackPropertyCompareOperation.Equal)
};

var videoConditions = new List<FilterTrackPropertyCondition>()
{
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

## Next steps

[Stream videos](stream-files-tutorial-with-api.md) 


