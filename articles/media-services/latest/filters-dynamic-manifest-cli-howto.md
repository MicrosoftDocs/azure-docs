---
title: Use CLI to create filters with Azure Media Services
description: This article shows how to use CLI to create filters with Azure Media Services v3.
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.date: 08/31/2020
ms.author: inhenkel
ms.custom: seodec18, devx-track-azurecli

---
# Creating filters with CLI

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

When delivering your content to customers (streaming Live events or Video on Demand), your client might need more flexibility than what's described in the default asset's manifest file. Azure Media Services enables you to define account filters and asset filters for your content.

For detailed description of this feature and scenarios where it is used, see [Dynamic Manifests](filters-dynamic-manifest-overview.md) and [Filters](filters-concept.md).

This topic shows how to configure a filter for a Video on-Demand asset and use CLI for Media Services v3 to create [Account Filters](/cli/azure/ams/account-filter) and [Asset Filters](/cli/azure/ams/asset-filter).

> [!NOTE]
> Make sure to review [presentationTimeRange](filters-concept.md#presentationtimerange).

## Prerequisites

- [Create a Media Services account](./create-account-howto.md). Make sure to remember the resource group name and the Media Services account name.

## Define a filter

The following example defines the track selection conditions that are added to the final manifest. This filter includes any audio tracks that are EC-3 and any video tracks that have bitrate in the 0-1000000 range.

> [!TIP]
> If you plan to define **Filters** in REST, notice that you need to include the "Properties" wrapper JSON object.  

```json
[
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
                "operation": "NotEqual"
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
```

## Create account filters

The following [az ams account-filter](/cli/azure/ams/account-filter) command creates an account filter with filter track selections that were [defined earlier](#define-a-filter).

The command allows you to pass an optional `--tracks` parameter that contains JSON representing the track selections.  Use @{file} to load JSON from a file. If you are using the Azure CLI locally, specify the whole file path:

```azurecli
az ams account-filter create -a amsAccount -g resourceGroup -n filterName --tracks @tracks.json
```

Also, see [JSON examples for filters](/rest/api/media/accountfilters/createorupdate#create-an-account-filter).

## Create asset filters

The following [az ams asset-filter](/cli/azure/ams/asset-filter) command creates an asset filter with filter track selections that were [defined earlier](#define-a-filter). 

```azurecli
az ams asset-filter create -a amsAccount -g resourceGroup -n filterName --asset-name assetName --tracks @tracks.json
```

Also, see [JSON examples for filters](/rest/api/media/assetfilters/createorupdate#create-an-asset-filter).

## Associate filters with Streaming Locator

You can specify a list of asset or account filters, which would apply to your Streaming Locator. The [Dynamic Packager (Streaming Endpoint)](dynamic-packaging-overview.md) applies this list of filters together with those your client specifies in the URL. This combination generates a [Dynamic Manifest](filters-dynamic-manifest-overview.md), which is based on filters in the URL + filters you specify on Streaming Locator. We recommend that you use this feature if you want to apply filters but do not want to expose the filter names in the URL.

The following CLI code shows how to create a Streaming Locator and specify `filters`. This is an optional property that takes a space-separated list of asset filter names and/or account filter names.

```azurecli
az ams streaming-locator create -a amsAccount -g resourceGroup -n streamingLocatorName \
                                --asset-name assetName \                               
                                --streaming-policy-name policyName \
                                --filters filterName1 filterName2
                                
```

## Stream using filters

Once you define filters, your clients could use them in the streaming URL. Filters could be applied to adaptive bitrate streaming protocols: Apple HTTP Live Streaming (HLS), MPEG-DASH, and Smooth Streaming.

The following table shows some examples of URLs with filters:

|Protocol|Example|
|---|---|
|HLS|`https://amsv3account-usw22.streaming.media.azure.net/fecebb23-46f6-490d-8b70-203e86b0df58/bigbuckbunny.ism/manifest(format=m3u8-aapl,filter=myAccountFilter)`|
|MPEG DASH|`https://amsv3account-usw22.streaming.media.azure.net/fecebb23-46f6-490d-8b70-203e86b0df58/bigbuckbunny.ism/manifest(format=mpd-time-csf,filter=myAssetFilter)`|
|Smooth Streaming|`https://amsv3account-usw22.streaming.media.azure.net/fecebb23-46f6-490d-8b70-203e86b0df58/bigbuckbunny.ism/manifest(filter=myAssetFilter)`|

## Next step

[Stream videos](stream-files-tutorial-with-api.md)

## See also

[Azure CLI](/cli/azure/ams)
