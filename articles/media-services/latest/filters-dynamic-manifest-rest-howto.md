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
ms.date: 06/13/2019
ms.author: juliako

---
# Creating filters with Media Services REST API

When delivering your content to customers (streaming Live events or Video on Demand) your client might need more flexibility than what's described in the default asset's manifest file. Azure Media Services enables you to define account filters and asset filters for your content. 

For detailed description of this feature and scenarios where it is used, see [Dynamic Manifests](filters-dynamic-manifest-overview.md) and [Filters](filters-concept.md).

This topic shows how to define a filter for a Video on Demand asset and use REST APIs to create [Account Filters](https://docs.microsoft.com/rest/api/media/accountfilters) and [Asset Filters](https://docs.microsoft.com/rest/api/media/assetfilters). 

> [!NOTE]
> Make sure to review [presentationTimeRange](filters-concept.md#presentationtimerange).

## Prerequisites 

To complete the steps described in this topic, you have to:

- Review [Filters and dynamic manifests](filters-dynamic-manifest-overview.md).
- [Configure Postman for Azure Media Services REST API calls](media-rest-apis-with-postman.md).

    Make sure to follow the last step in the topic [Get Azure AD Token](media-rest-apis-with-postman.md#get-azure-ad-token). 

## Define a filter  

The following is the **Request body** example that defines the track selection conditions that are added to the manifest. This filter includes any audio tracks that are EC-3 and any video tracks that have bitrate in the 0-1000000 range.

```json
{
    "properties": {
        "tracks": [
          {
                "trackSelections": [
                    {
                        "property": "Type",
                        "value": "Audio",
                        "operation": "Equal"
                    },
                    {
                        "property": "FourCC",
                        "value": "EC-3",
                        "operation": "Equal"
                    }
                ]
            },
            {
                "trackSelections": [
                    {
                        "property": "Type",
                        "value": "Video",
                        "operation": "Equal"
                    },
                    {
                        "property": "Bitrate",
                        "value": "0-1000000",
                        "operation": "Equal"
                    }
                ]
            }
        ]
     }
}
```

## Create account filters

In the Postman's collection that you downloaded, select **Account Filters**->**Create or update an Account Filter**.

The **PUT** HTTP request method is similar to:

```
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Media/mediaServices/{accountName}/accountFilters/{filterName}?api-version=2018-07-01
```

Select the **Body** tab and paste the json code you [defined earlier](#define-a-filter).

Select **Send**. 

The filter has been created.

For more information, see [Create or update](https://docs.microsoft.com/rest/api/media/accountfilters/createorupdate). Also, see [JSON examples for filters](https://docs.microsoft.com/rest/api/media/accountfilters/createorupdate#create-an-account-filter).

## Create asset filters  

In the "Media Services v3" Postman collection that you downloaded, select **Assets**->**Create or update Asset Filter**.

The **PUT** HTTP request method is similar to:

```
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Media/mediaServices/{accountName}/assets/{assetName}/assetFilters/{filterName}?api-version=2018-07-01
```

Select the **Body** tab and paste the json code you [defined earlier](#define-a-filter).

Select **Send**. 

The asset filter has been created.

For details on how to create or update asset filters, see [Create or update](https://docs.microsoft.com/rest/api/media/assetfilters/createorupdate). Also, see [JSON examples for filters](https://docs.microsoft.com/rest/api/media/assetfilters/createorupdate#create-an-asset-filter). 

## Associate filters with Streaming Locator

You can specify a list of asset or account filters, which would apply to your Streaming Locator. The [Dynamic Packager (Streaming Endpoint)](dynamic-packaging-overview.md) applies this list of filters together with those your client specifies in the URL. This combination generates a [Dynamic Manifest](filters-dynamic-manifest-overview.md), which is based on filters in the URL + filters you specify on Streaming Locator. We recommend that you use this feature if you want to apply filters but do not want to expose the filter names in the URL.

To create and associate filters with a Streaming Locator using REST, use the [Streaming Locators - Create](https://docs.microsoft.com/rest/api/media/streaminglocators/create) API and specify `properties.filters` in the [Request Body](https://docs.microsoft.com/rest/api/media/streaminglocators/create#request-body).
                                
## Stream using filters

Once you define filters, your clients could use them in the streaming URL. Filters could be applied to adaptive bitrate streaming protocols: Apple HTTP Live Streaming (HLS), MPEG-DASH, and Smooth Streaming.

The following table shows some examples of URLs with filters:

|Protocol|Example|
|---|---|
|HLS|`https://amsv3account-usw22.streaming.media.azure.net/fecebb23-46f6-490d-8b70-203e86b0df58/bigbuckbunny.ism/manifest(format=m3u8-aapl,filter=myAccountFilter)`|
|MPEG DASH|`https://amsv3account-usw22.streaming.media.azure.net/fecebb23-46f6-490d-8b70-203e86b0df58/bigbuckbunny.ism/manifest(format=mpd-time-csf,filter=myAssetFilter)`|
|Smooth Streaming|`https://amsv3account-usw22.streaming.media.azure.net/fecebb23-46f6-490d-8b70-203e86b0df58/bigbuckbunny.ism/manifest(filter=myAssetFilter)`|

## Next steps

[Stream videos](stream-files-tutorial-with-rest.md) 
