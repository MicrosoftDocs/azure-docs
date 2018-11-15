---
title: Creating Filters with Azure Media Services REST API | Microsoft Docs
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
# Creating filters with Media Services REST API

When delivering your content to customers (streaming live events or video-on-demand) your client might need more flexibility than what's described in the default asset's manifest file. Azure Media Services enables you to define account filters and asset filters for your content. 
For detailed information related to filters and Dynamic Manifest, see [Filters and dynamic manifests overview]().

This article shows how to use REST APIs to create [Account Filters](https://docs.microsoft.com/en-us/rest/api/media/accountfilters) and [Asset Filters](https://docs.microsoft.com/en-us/rest/api/media/assetfilters). 

## Prerequisites 

- Review [Filters and dynamic manifests overview]().
- [Create a Media Services account](create-account-cli-how-to.md). Make sure to remember the resource group name and the Media Services account name. 
- Get information needed to [access APIs](access-api-cli-how-to.md)
- (Optional but recommended)[Configure Postman for Azure Media Services REST API calls](media-rest-apis-with-postman.md)

## Considerations

- The values for **presentationWindow** and **liveBackoffDuration** should not be set for a video on-demand filter. They are only used for live filter scenarios. 
- If you update a filter, it can take up to two minutes for streaming endpoint to refresh the rules. If the content was served using this filter (and cached in proxies and CDN caches), updating this filter can result in player failures. Always clear the cache after updating the filter. If this option is not possible, consider using a different filter. 

## Configure filter  

The following is the **Request body** exmple that defines the presentationTimeRange, firstQuality, and trackSelections.  

```
{
  "properties": {
    "presentationTimeRange": {
      "startTimestamp": 0,
      "endTimestamp": 170000000,
      "presentationWindowDuration": 9223372036854776000,
      "liveBackoffDuration": 0,
      "timescale": 10000000,
      "forceEndTimestamp": false
    },
    "firstQuality": {
      "bitrate": 128000
    },
    "tracks": [
      {
        "trackSelections": [
          {
            "property": "Type",
            "operation": "Equal",
            "value": "Audio"
          },
          {
            "property": "Language",
            "operation": "NotEqual",
            "value": "en"
          },
          {
            "property": "FourCC",
            "operation": "NotEqual",
            "value": "EC-3"
          }
        ]
      },
      {
        "trackSelections": [
          {
            "property": "Type",
            "operation": "Equal",
            "value": "Video"
          },
          {
            "property": "Bitrate",
            "operation": "Equal",
            "value": "3000000-5000000"
          }
        ]
      }
    ]
  }
}
```

## Create account filters

For details on how to create or update account filters, see [Create or update](https://docs.microsoft.com/rest/api/media/accountfilters/createorupdate).

If you followed [Configure Postman for Azure Media Services REST API calls](media-rest-apis-with-postman.md), check out **Account Filters** defined in the "Media Services v3" Postman collection.

### HTTP request method 

PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Media/mediaServices/{accountName}/accountFilters/{filterName}?api-version=2018-07-01

#### Request example

PUT https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.Media/mediaServices/contosomedia/accountFilters/newAccountFilter?api-version=2018-07-01

### Body example

Request body includes the following properties that define your filter:

|Name|Description|
|---|---|
|properties.firstQuality|The first quality.|
|properties.presentationTimeRange|The presentation time range. <br/>Not recommended to use when defining Account filters.| 
|properties.tracks|The tracks selection conditions.|

See [Configure filter](#configure-filter) that we defined earlier. 

## Create asset filters  

For details on how to create or update asset filters, see [Create or update](https://docs.microsoft.com/rest/api/media/assetfilters/createorupdate).

If you followed [Configure Postman for Azure Media Services REST API calls](media-rest-apis-with-postman.md), check out **Assets** -> **Create or update Asset Filter**  defined in the "Media Services v3" Postman collection.

### HTTP request method 

PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Media/mediaServices/{accountName}/assets/{assetName}/assetFilters/{filterName}?api-version=2018-07-01

#### Request example

PUT https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/contoso/providers/Microsoft.Media/mediaServices/contosomedia/assets/ClimbingMountRainer/assetFilters/newAssetFilter?api-version=2018-07-01

### Body example

Request body includes the following properties that define your filter:

|Name|Description|
|---|---|
|properties.firstQuality|The first quality.|
|properties.presentationTimeRange|The presentation time range.| 
|properties.tracks|The tracks selection conditions.|

See [Configure filter](#configure-filter) that we defined earlier. 

## Next steps

[Stream videos](stream-files-tutorial-with-rest.md) 