---
title: Clouds and regions in which Azure Media Services v3 is available
description: This article talks about Azure clouds and regions in which Azure Media Services v3 is available.  
services: media-services
author: IngridAtMicrosoft
manager: femila
ms.service: media-services
ms.topic: reference
ms.date: 10/28/2020
ms.author: inhenkel
---

# Clouds and regions in which Azure Media Services v3 exists

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

Azure Media Services v3 is available via Azure Resource Manager manifest in global Azure, Azure Government, Azure Germany, Azure China 21Vianet. However, not all Media Services features are available in all the Azure clouds. This document outlines availabilities of main Media Services v3 components.

## Feature availability in Azure clouds
<!-- you can use either the dropdow or the tabs but not both -->
<!--
> [!div class="op_single_selector"]
> - [United States](reference-feature-availability-us.md)
> - [Azure US Government](reference-feature-availability-usgov.md)
> - [Africa](reference-feature-availability-africa.md)
> - [Asia Pacific](reference-feature-availability-apac.md)
> - [Australia](reference-feature-availability-australia.md)
> - [Brazil](reference-feature-availability-brazil.md)
> - [Canada](reference-feature-availability-canada.md)
> - [China](reference-feature-availability-china.md)
> - [Europe](reference-feature-availability-europe.md)
> - [Germany](reference-feature-availability-germany.md)
> - [India](reference-feature-availability-india.md)
> - [Japan](reference-feature-availability-japan.md)
> - [Korea](reference-feature-availability-korea.md)
> - [Norway](reference-feature-availability-norway.md)
> - [Switzerland](reference-feature-availability-switzerland.md)
> - [Taiwan](reference-feature-availability-taiwan.md)
> - [United Arab Emirates](reference-feature-availability-uae.md)
> - [United Kingdom](reference-feature-availability-uk.md)
-->
## Regional and non-regional availability

 TABLE KEY <br/>
![ga](./media/azure-clouds-regions/ga.svg) Generally available ![in preview](./media/azure-clouds-regions/preview.svg) In preview ![in preview expected date](./media/azure-clouds-regions/preview-active.svg) In preview and expected date ![future availability](./media/azure-clouds-regions/planned-active.svg) Future availability

## [US](#tab/us)

stuff goes here

## [US Gov](#tab/usgov)

stuff goes here

## [Africa](#tab/africa)

stuff goes here

## [Asia Pacific](#tab/apac)

stuff goes here

## [Australia](#tab/australia)

stuff goes here

## [Brazil](#tab/brazil)

stuff goes here

## [Canada](#tab/canada.md)

stuff goes here

## [China](#tab/china)

stuff goes here

## [Europe](#tab/europe)

stuff goes here

## [Germany](#tab/germany)

stuff goes here

## [India](#tab/india)

stuff goes here

## [Japan](#tab/japan)

stuff goes here

## [Korea](#tab/korea)

stuff goes here

## [Norway](#tab/norway)

stuff goes here

## [Switzerland](#tab/switzerland)

stuff goes here

## [Taiwan](#tab/taiwan)

stuff goes here

## [United Arab Emirates](#tab/uae)

stuff goes here

## [United Kingdom](#tab/uk)

stuff goes here

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
