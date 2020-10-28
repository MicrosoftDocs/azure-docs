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
ms.date: 08/31/2020
ms.author: inhenkel
ms.custom: references_regions
---

# Clouds and regions in which Azure Media Services v3 exists

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

Azure Media Services v3 is available via Azure Resource Manager manifest in global Azure, Azure Government, Azure Germany, Azure China 21Vianet. However, not all Media Services features are available in all the Azure clouds. This document outlines availabilities of main Media Services v3 components.

## Feature availability in Azure clouds

> [!div class="op_single_selector"]
> - [United States](./includes/reference-feature-availability-us.md)
> - [Azure Government](./includes/reference-feature-availability-usgov.md)
> - [Africa](./includes/reference-feature-availability-africa.md)
> - [Asia Pacific](./includes/reference-feature-availability-apac.md)
> - [Australia](#tab/australia/)
> - [Austria](#tab/austria/)
> - [Brazil](#tab/brazil/)
> - [Canada](#tab/canada/)
> - [China](#tab/china/)
> - [Europe](#tab/europe/)
> - [France](#tab/france/)
> - [Germany](#tab/germany/)
> - [Greece](#tab/greece/)
> - [India](#tab/india/)
> - [Israel](#tab/isreal/)
> - [Italy](#tab/italy/)
> - [Japan](#tab/japan/)
> - [Korea](#tab/korea/)
> - [Mexico](#tab/mexico/)
> - [New Zealand](#tab/newz/)
> - [Norway](#tab/norway/)
> - [Poland](#tab/poland/)
> - [Qatar](#tab/qatar/)
> - [Spain](#tab/spain/)
> - [Switzerland](#tab/switzerland/)
> - [Taiwan](#tab/taiwan/)
> - [United Arab Emirates](#tab/uae/)
> - [United Kingdom](#tab/uk/)

## Regional and non-regional availability

<!-- TABLE KEY<br/>
![ga](./media/azure-clouds-regions/ga.svg) Generally available ![in preview](./media/azure-clouds-regions/preview.svg) In preview ![in preview expected date](./media/azure-clouds-regions/preview-active.svg) In preview and expected date ![future availability](./media/azure-clouds-regions/planned-active.svg) Future availability

| Region | [Azure EventGrid](reacting-to-media-services-events.md) | [VideoAnalyzerPreset](analyzing-video-audio-files-concept.md) | [StandardEncoderPreset](encoding-concept.md) | [LiveEvents](live-streaming-overview.md) | [StreamingEndpoints](streaming-endpoint-concept.md) |  [LiveTranscription](live-transcription.md) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **United States** ||||||||
| Central US |![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|
| East US |![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|
| East US 2 |![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|
| North Central US |![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|
| South Central US |![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|
| West US 2 |![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|
| **Azure US Government** ||||||||
| US DoD Central ||||||||
| US DoD East ||||||||
| US Gov Arizona ||||||||
| US Gov Texas ||||||||
| US Gov Virginia ||||||||
| USNat ||||||||
| USSec ||||||||
| **Africa** ||||||||
| South Africa North |![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|
| South Africa West |![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|
| **Asia Pacific** ||||||||
| East Asia ||||||||
| Southeast Asia ||||||||
| **Australia** ||||||||
| Australia Central ||||||||
| Australia Central 2 ||||||||
| Australia East |![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|
| Australia Southeast |![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|
| **Brazil** ||||||||
| Brazil South |![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![ga](./media/azure-clouds-regions/ga.svg)|![future](./media/azure-clouds-regions/preview-active.svg)|
| Brazil Southeast |![future](./media/azure-clouds-regions/planned-active.svg)|![future](./media/azure-clouds-regions/planned-active.svg)|![future](./media/azure-clouds-regions/planned-active.svg)|![future](./media/azure-clouds-regions/planned-active.svg)|![future](./media/azure-clouds-regions/planned-active.svg)|![future](./media/azure-clouds-regions/planned-active.svg)|![future](./media/azure-clouds-regions/planned-active.svg)|
| **Canada** ||||||||
| Canada Central ||||||||
| Canada East ||||||||
| **China** ||||||||
| China East ||||||||
| China East 2 ||||||||
| China North ||||||||
| China North 2 ||||||||
| **Europe** ||||||||
| North Europe ||||||||
| West Europe ||||||||
| **Germany** ||||||||
| Germany Central (Sovereign) ||||||||
| Germany North (Public) ||||||||
| Germany Northeast (Sovereign) ||||||||
| Germany West Central (Public) ||||||||
| **India** ||||||||
| Central India ||||||||
| South India ||||||||
| West India ||||||||
| **Japan** ||||||||
| Japan East ||||||||
| Japan West ||||||||
| **Korea** ||||||||
| Korea Central ||||||||
| Korea South ||||||||
| **Norway** ||||||||
| Norway East ||||||||
| Norway West ||||||||
| **Switzerland** ||||||||
| Switzerland North ||||||||
| Switzerland West ||||||||
| **United Arab Emirates** ||||||||
| UAE Central ||||||||
| UAE North ||||||||
| **United Kingdom** ||||||||
| UK South ||||||||
| UK West ||||||||

<!--
## [Global](#tab/global/)

| Feature| Availability |
| --- | --- |
| [Azure EventGrid](reacting-to-media-services-events.md) | ![ga](./media/azure-clouds-regions/ga.svg) |
| [VideoAnalyzerPreset](analyzing-video-audio-files-concept.md) |  ![ga](./media/azure-clouds-regions/ga.svg) |
| [AudioAnalyzerPreset](analyzing-video-audio-files-concept.md) |  Available |
| [StandardEncoderPreset](encoding-concept.md) | Available |
| [LiveEvents](live-streaming-overview.md) | Available |
| [StreamingEndpoints](streaming-endpoint-concept.md) | Available |
| [LiveTranscription](live-transcription.md) | Available |

## [Africa](#tab/africa/)

| Feature| Availability |
| --- | --- |
| [Azure EventGrid](reacting-to-media-services-events.md) | x |
| [VideoAnalyzerPreset](analyzing-video-audio-files-concept.md) |  x |
| [AudioAnalyzerPreset](analyzing-video-audio-files-concept.md) |  x |
| [StandardEncoderPreset](encoding-concept.md) | x |
| [LiveEvents](live-streaming-overview.md) | x |
| [StreamingEndpoints](streaming-endpoint-concept.md) | x |
| [LiveTranscription](live-transcription.md) | x |

## [Asia Pacific](#tab/apac/)
APAC goes here

## [Australia](#tab/australia/)
australia goes here

## [Austria](#tab/austria/)
austria goes here

## [Azure Government](#tab/government/)

| Feature | DoD | USNat | USSec |
| --- | --- | --- | --- | --- |
| [Azure EventGrid](reacting-to-media-services-events.md) | maybe? | Not available | Not available |
| [VideoAnalyzerPreset](analyzing-video-audio-files-concept.md) | Not available  | Not available | Not available |
| [AudioAnalyzerPreset](analyzing-video-audio-files-concept.md) |  Not available | Not available | Not available |
| [StandardEncoderPreset](encoding-concept.md) | Available | Available | Available |
| [LiveEvents](live-streaming-overview.md) | Available | Available | Available |
| [StreamingEndpoints](streaming-endpoint-concept.md) | Available | Available | Available |
| [LiveTranscription](live-transcription.md) | Available |

## [Azure Germany](#tab/germany/)

| Feature | Germany Central (Sovereign) | Germany North (Public) | Germany Northeast (Sovereign) | Germany West Central (Public) |
| --- | --- | --- | --- | --- |
| [Azure EventGrid](reacting-to-media-services-events.md) | Not available | Not vailable | Not available | Available |
| [VideoAnalyzerPreset](analyzing-video-audio-files-concept.md) |  Not available | Not available | Not available | Not available |
| [AudioAnalyzerPreset](analyzing-video-audio-files-concept.md) |  Not available | Not available | Not available | Not available |
| [StandardEncoderPreset](encoding-concept.md) | Available | Available | Available | Available |
| [LiveEvents](live-streaming-overview.md) | Available | Available | Available | Available |
| [StreamingEndpoints](streaming-endpoint-concept.md) | Available | Available | Available | Available |
| [LiveTranscription](live-transcription.md) | Available |

## [Azure China 21Vianet](#tab/china/)

| Feature| Availability |
| --- | --- | --- | --- | --- |
| [Azure EventGrid](reacting-to-media-services-events.md) | Available |
| [VideoAnalyzerPreset](analyzing-video-audio-files-concept.md) | Available |
| [AudioAnalyzerPreset](analyzing-video-audio-files-concept.md) | Available |
| [StandardEncoderPreset](encoding-concept.md) | Available |
| [LiveEvents](live-streaming-overview.md) | Available |
| [StreamingEndpoints](streaming-endpoint-concept.md) |
| [LiveTranscription](live-transcription.md) | Available |
-->
## Regions/geographies/locations

[Regions in which the Azure Media Services service is deployed](https://azure.microsoft.com/global-infrastructure/services/?products=media-services)

### Region code name

When you need to supply the **location** parameter, you need to provide the region code name as the **location** value. To get the code name of the region that your account is in and that your call should be routed to, you can run the following line in [Azure CLI](/cli/azure/?view=azure-cli-latest)

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

| Service | Endpoint |
| ------- | -------- |
| Azure Resource Manager |  `https://management.azure.com/` |
| Authentication | `https://login.microsoftonline.com/` |
| Token audience | `https://management.core.windows.net/` |

### Azure Government

| Service | Endpoint |
| ------- | -------- |
| Azure Resource Manager |  `https://management.usgovcloudapi.net/` |
| Authentication | `https://login.microsoftonline.us/` |
| Token audience | `https://management.core.usgovcloudapi.net/` |

[!INCLUDE [Widevine is not available in the GovCloud region.](./includes/widevine-not-available-govcloud.md)]

### Azure Germany

| Service | Endpoint |
| ------- | -------- |
| Azure Resource Manager | `https://management.cloudapi.de/` |
| Authentication | `https://login.microsoftonline.de/` |
| Token audience | `https://management.core.cloudapi.de/`|

### Azure China 21Vianet

| Service | Endpoint |
| ------- | -------- |
| Azure Resource Manager | `https://management.chinacloudapi.cn/` |
| Authentication | `https://login.chinacloudapi.cn/` |
| Token audience |  `https://management.core.chinacloudapi.cn/` |

## See also

* [Azure regions](https://azure.microsoft.com/global-infrastructure/regions/)
* [Azure geographies](https://azure.microsoft.com/global-infrastructure/geographies/)
* [Azure locations](https://azure.microsoft.com/global-infrastructure/locations/)

## Next steps

[Media Services v3 overview](media-services-overview.md)
