---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Clouds and regions in which Azure Media Services v3 is available
description: This article talks about Azure clouds and regions in which Azure Media Services v3 is available.  
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 5/28/2020
ms.author: inhenkel
ms.custom: references_regions
---

# Clouds and regions in which Azure Media Services v3 exists

Azure Media Services v3 is available via Azure Resource Manager manifest in global Azure, Azure Government, Azure Germany, Azure China 21Vianet. However, not all Media Services features are available in all the Azure clouds. This document outlines availabilities of main Media Services v3 components.

## Feature availability in Azure clouds

| Feature|Global Azure Regions | Azure Government|Azure Germany|Azure China 21Vianet|
| --- | --- | --- | --- | --- |
| [Azure EventGrid](reacting-to-media-services-events.md) | Available | Not available | Not available | Not available |
| [VideoAnalyzerPreset](analyzing-video-audio-files-concept.md) |  Available | Not available | Not available | Not available |
| [AudioAnalyzerPreset](analyzing-video-audio-files-concept.md) |  Available | Not available | Not available | Not available |
| [StandardEncoderPreset](encoding-concept.md) | Available | Available | Available | Available |
| [LiveEvents](live-streaming-overview.md) | Available | Available | Available | Available |
| [StreamingEndpoints](streaming-endpoint-concept.md) | Available | Available | Available | Available |

## Feature availability in preview

[LiveTranscription](live-transcription.md) is available in the following regions:

- Southeast Asia
- West Europe
- North Europe
- East US
- Central US
- South Central US
- West US 2
- Brazil South

## Regions/geographies/locations

[Regions in which the Azure Media Services service is deployed](https://azure.microsoft.com/global-infrastructure/services/?products=media-services)

### Region code name

When you need to supply the **location** parameter, you need to provide the region code name as the **location** value. To get the code name of the region that your account is in and that your call should be routed to, you can run the following line in [Azure CLI](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest)

```azurecli-interactive
az account list-locations
```

Once you run the line shown above, you get a list of all Azure regions. Navigate to the Azure region that has the *displayName* you are looking for, and use its *name* value for the **location** parameter.

For example, for the Azure region West US 2 (displayed below), you will use "westus2" for the **location** parameter.

```json
   {
      "displayName": "West US 2",
      "id": "/subscriptions/00000000-23da-4fce-b59c-f6fb9513eeeb/locations/westus2",
      "latitude": "47.233",
      "longitude": "-119.852",
      "name": "westus2",
      "subscriptionId": null
    }
```

## Endpoints  

The following endpoints are important to know when connecting to Media Services accounts from different national Azure clouds.

### Global Azure

|Endpoints||
| --- | --- |
| Azure Resource Manager |  `https://management.azure.com/` |
| Authentication | `https://login.microsoftonline.com/` |
| Token audience | `https://management.core.windows.net/` |

### Azure Government

|Endpoints||
| --- | --- |
| Azure Resource Manager |  `https://management.usgovcloudapi.net/` |
| Authentication | `https://login.microsoftonline.us/` |
| Token audience | `https://management.core.usgovcloudapi.net/` |

### Azure Germany

| Endpoints ||
| --- | --- |  
| Azure Resource Manager | `https://management.cloudapi.de/` |
| Authentication | `https://login.microsoftonline.de/` |
| Token audience | `https://management.core.cloudapi.de/`|

### Azure China 21Vianet

|Endpoints||
| --- | --- |
| Azure Resource Manager | `https://management.chinacloudapi.cn/` |
| Authentication | `https://login.chinacloudapi.cn/` |
| Token audience |  `https://management.core.chinacloudapi.cn/` |

## See also

* [Azure regions](https://azure.microsoft.com/global-infrastructure/regions/)
* [Azure geographies](https://azure.microsoft.com/global-infrastructure/geographies/)
* [Azure locations](https://azure.microsoft.com/global-infrastructure/locations/)

## Next steps

[Media Services v3 overview](media-services-overview.md)
