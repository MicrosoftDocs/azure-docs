---
title: Scaling Media Reserved Units - Azure | Microsoft Docs
description: This topic is an overview of scaling Media Processing with Azure Media Services.
services: media-services
documentationcenter: ''
author: juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/11/2018
ms.author: juliako

---
# Creating filters with CLI 

When delivering your content to customers (streaming live events or video-on-demand) your client might need more flexibility than what's described in the default asset's manifest file. Azure Media Services enables you to define account filters and asset filters for your content. 
For detailed information related to filters and Dynamic Manifest, see [Filters and dynamic manifests overview]().

This topic shows how to use CLI for Media Services v3 to create [Account Filters](https://docs.microsoft.com/cli/azure/ams/account-filter?view=azure-cli-latest) and [Asset Filters](https://docs.microsoft.com/cli/azure/ams/asset-filter?view=azure-cli-latest). 

## Prerequisites 

- Install and use the CLI locally, this article requires the Azure CLI version 2.0 or later. Run `az --version` to find the version you have. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli). 

    Currently, not all [Media Services v3 CLI](https://aka.ms/ams-v3-cli-ref) commands work in the Azure Cloud Shell. It is recommended to use the CLI locally.

- Review [Filters and dynamic manifests overview]().
- [Create a Media Services account](create-account-cli-how-to.md). Make sure to remember the resource group name and the Media Services account name. 
- Get information needed to [access APIs](access-api-cli-how-to.md)

## Considerations

- The values for **presentation-window-duration** and **live-backoff-duration** should not be set for a video on-demand filter. They are only used for live filter scenarios. 
- If you update a filter, it can take up to two minutes for streaming endpoint to refresh the rules. If the content was served using this filter (and cached in proxies and CDN caches), updating this filter can result in player failures. Always clear the cache after updating the filter. If this option is not possible, consider using a different filter. 

## Configure filter track selections

You configure track selections with **FilterTrackSelection** and **FilterTrackPropertyCondition** types. The track selections support both an **AND** semantic and an **OR** semantic. To get an **AND** semantic, you add multiple **FilterTrackPropertyCondition** statements to the same list. To match the **FilterTrackPropertyCondition** all of the conditions must be met. To get an **OR** semantic, you add multiple sets of **FilterTrackPropertyConditions**. Any tracks that match all of the conditions of any one set of conditions will be added to the final manifest.

The filter commands shown in this article use a json file (tracks.json) that defines the following filter track selections. 

```json
[
    {
        "trackSelections": [
            {
                "property": "FourCC",
                "operation": "Equal",
                "value": "AVC1"
            }
        ]
    },
    {
        "trackSelections": [
            {
                "property": "Unknown",
                "operation": "NotEqual",
                "value": "EC-3"
            },
            {
                "property": "FourCC",
                "operation": "Equal",
                "value": "MP4A"
            }
        ]
    }
]
```

## Create account filters

The following [az ams account-filter](https://docs.microsoft.com/en-us/cli/azure/ams/account-filter?view=azure-cli-latest) command creates an account filter with filter track selections.

```azurecli
az ams account-filter create -a amsAccount -g resourceGroup -n filterName --force-end-timestamp=False --end-timestamp 200000 --start-timestamp 100000 --live-backoff-duration 60 --presentation-window-duration 600000 --timescale 1000 --bitrate 720 --tracks @C:\tracks.json
```

## Create asset filters

The following [az ams asset-filter](https://docs.microsoft.com/en-us/cli/azure/ams/asset-filter?view=azure-cli-latest) command creates an asset filter with filter track selections.

```azurecli
az ams asset-filter create -a amsAccount -g resourceGroup -n filterName --force-end-timestamp=False --end-timestamp 200000 --start-timestamp 100000 --live-backoff-duration 60 --presentation-window-duration 600000 --timescale 1000 --bitrate 720 --asset-name assetName --tracks @C:\tracks.json
```
 
## Next step

[Stream videos](stream-files-tutorial-with-api.md) 

## See also

[Azure CLI](https://docs.microsoft.com/cli/azure/ams?view=azure-cli-latest)
