---
title: Use CLI to create filters with Azure Media Services| Microsoft Docs
description: This topic shows how to use CLI to create filters with Media Services.
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
ms.date: 11/26/2018
ms.author: juliako
ms.custom: seodec18

---
# Creating filters with CLI 

When delivering your content to customers (streaming Live events or Video on Demand), your client might need more flexibility than what's described in the default asset's manifest file. Azure Media Services enables you to define account filters and asset filters for your content. For more information, see [Filters and dynamic manifests](filters-dynamic-manifest-overview.md).

This topic shows how to configure a filter for a Video on-Demand asset and use CLI for Media Services v3 to create [Account Filters](https://docs.microsoft.com/cli/azure/ams/account-filter?view=azure-cli-latest) and [Asset Filters](https://docs.microsoft.com/cli/azure/ams/asset-filter?view=azure-cli-latest). 

## Prerequisites 

- Install and use the CLI locally, this article requires the Azure CLI version 2.0 or later. Run `az --version` to find the version you have. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli). 

    Currently, not all [Media Services v3 CLI](https://aka.ms/ams-v3-cli-ref) commands work in the Azure Cloud Shell. It is recommended to use the CLI locally.
- [Create a Media Services account](create-account-cli-how-to.md). Make sure to remember the resource group name and the Media Services account name. 
- Review [Filters and dynamic manifests](filters-dynamic-manifest-overview.md).

## Define a filter 

The following example defines the track selection conditions that are added to the final manifest. This filter includes any audio tracks that are EC-3 and any video tracks that have bitrate in the 0-1000000 range.

Filters defined in REST, include the "Properties" wrapper JSON object.  

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

The following [az ams account-filter](https://docs.microsoft.com/cli/azure/ams/account-filter?view=azure-cli-latest) command creates an account filter with filter track selections that were [defined earlier](#define-a-filter). 

The command allows you to pass an optional `--tracks` parameter that contains JSON representing the track selections.  Use @{file} to load JSON from a file. If you are using the Azure CLI locally, specify the whole file path:


```azurecli
az ams account-filter create -a amsAccount -g resourceGroup -n filterName --tracks @c:\tracks.json
```

If you are using the Azure Cloud Shell, upload your file to the Cloud Shell (find the upload/download files button at the top of the shell window). Then, you can reference the file like this:

```azurecli
az ams account-filter create -a amsAccount -g resourceGroup -n filterName --tracks @tracks.json
```

Also, see [JSON examples for filters](https://docs.microsoft.com/rest/api/media/accountfilters/createorupdate#create_an_account_filter).

## Create asset filters

The following [az ams asset-filter](https://docs.microsoft.com/cli/azure/ams/asset-filter?view=azure-cli-latest) command creates an asset filter with filter track selections that were [defined earlier](#define-a-filter). 

> [!TIP]
> See the information about specifying the location of the file name in the previous section.

```azurecli
az ams asset-filter create -a amsAccount -g resourceGroup -n filterName --asset-name assetName --tracks @tracks.json
```

Also, see [JSON examples for filters](https://docs.microsoft.com/rest/api/media/assetfilters/createorupdate#create_an_asset_filter).

## Next step

[Stream videos](stream-files-tutorial-with-api.md) 

## See also

[Azure CLI](https://docs.microsoft.com/cli/azure/ams?view=azure-cli-latest)
