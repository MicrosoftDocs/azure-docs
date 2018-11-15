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
# Creating filters with Media Services .NET SDK

When delivering your content to customers (streaming live events or video-on-demand) your client might need more flexibility than what's described in the default asset's manifest file. Azure Media Services enables you to define account filters and asset filters for your content. 
For detailed information related to filters and Dynamic Manifest, see [Filters and dynamic manifests overview]().

This topic shows how to use Media Services .NET SDK to create [Account Filters](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.media.models.accountfilter?view=azure-dotnet) and [Asset Filters](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.media.models.assetfilter?view=azure-dotnet). 

## Prerequisites 

- Review [Filters and dynamic manifests overview]().
- [Create a Media Services account](create-account-cli-how-to.md). Make sure to remember the resource group name and the Media Services account name. 
- Get information needed to [access APIs](access-api-cli-how-to.md)
- Review [Upload, encode, and stream using Azure Media Services](stream-files-tutorial-with-api.md) to see how to [start using .NET SDK](stream-files-tutorial-with-api.md#start_using_dotnet)

## Considerations

- The values for [PresentationTimeRange.PresentationWindow](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.media.models.presentationtimerange.presentationwindowduration?view=azure-dotnet#Microsoft_Azure_Management_Media_Models_PresentationTimeRange_PresentationWindowDuration) and [PresentationTimeRange.LiveBackoffDuration](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.media.models.presentationtimerange.livebackoffduration?view=azure-dotnet#Microsoft_Azure_Management_Media_Models_PresentationTimeRange_LiveBackoffDuration) should not be set for a video on-demand filter. They are only used for live filter scenarios.  
- If you update a filter, it can take up to two minutes for streaming endpoint to refresh the rules. If the content was served using this filter (and cached in proxies and CDN caches), updating this filter can result in player failures. Always clear the cache after updating the filter. If this option is not possible, consider using a different filter. 

## Configure filter  

This section shows how you might want to configure your filters.

### Configure first quality

Use [FirstQuality](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.media.models.firstquality?view=azure-dotnet) to set the first quality bitrate as shown below:

```csharp
var firstQuality = new FirstQuality(128000);
```

### Configure presentation time range

Use [PresentationTimeRange](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.media.models.presentationtimerange?view=azure-dotnet) to set the presentation time range. Not recommended to use when defining Account filters.

#### For live filter

```csharp
long startTimestamp = 0;
long endTimestamp = 170000000;
long timescale = 10000000;
long liveBackoffDuration = 0;
long presentationWindowDuration = 9223372036854776000;

var range =  new PresentationTimeRange(startTimestamp, endTimestamp, liveBackoffDuration, presentationWindowDuration, timescale, false);
```

#### For video on-demand filter

```csharp
var range = new PresentationTimeRange(scaledStartTime, scaledEndTime, null, null, (long)timeScale, false);
```

### Configure track selections

This section configures track selections with [FilterTrackSelection](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.media.models.filtertrackselection?view=azure-dotnet) and [FilterTrackPropertyCondition](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.media.models.filtertrackpropertycondition?view=azure-dotnet) classes. The track selections support both an **AND** semantic and an **OR** semantic. 

To get an **AND** semantic, you add multiple **FilterTrackPropertyCondition** statements to the same list. To match the **FilterTrackPropertyCondition** all of the conditions must be met. 

```csharp
var listOfAudioConditions = new List<FilterTrackPropertyCondition>()
{
    new FilterTrackPropertyCondition(FilterTrackPropertyType.Language, "en-us", FilterTrackPropertyCompareOperation.Equal),
    new FilterTrackPropertyCondition(FilterTrackPropertyType.FourCC, "EC-3", FilterTrackPropertyCompareOperation.Equal)
};
```
To get an **OR** semantic, you add multiple sets of **FilterTrackPropertyConditions**. Any tracks that match all of the conditions of any one set of conditions will be added to the final manifest.  

Here is an example with multiple sets (including the one above):

```csharp
var h264VideoConditions = new List<FilterTrackPropertyCondition>()
{
    new FilterTrackPropertyCondition(FilterTrackPropertyType.FourCC, "H264", FilterTrackPropertyCompareOperation.Equal)
};

var hev1VideoConditions = new List<FilterTrackPropertyCondition>()
{
    new FilterTrackPropertyCondition(FilterTrackPropertyType.FourCC, "HEV1", FilterTrackPropertyCompareOperation.Equal)
};

List<FilterTrackSelection> includedTracks = new List<FilterTrackSelection>()
{
    new FilterTrackSelection(listOfAudioConditions),
    new FilterTrackSelection(h264VideoConditions),
    new FilterTrackSelection(hev1VideoConditions)
};
```

## Create account filters

The following code shows how to use .NET to create an account filter that includes all track selections defined above.

```csharp
AccountFilter accountFilterParams = new AccountFilter(tracks: includedTracks);
client.AccountFilters.CreateOrUpdate(config.ResourceGroup, config.AccountName, "accountFilterName1", accountFilter);
```

## Create asset filters

The following code shows how to use .NET to create asset filters.  

```csharp
AssetFilter assetFilterParams = new AssetFilter(null, name, FilterType, range, firstQuality, includedTracks);
client.AssetFilters.CreateOrUpdate(config.ResourceGroup, config.AccountName, asset.Name, "assetFilterName1", assetFilterParams);
```

## Next steps

[Stream videos](stream-files-tutorial-with-api.md) 


