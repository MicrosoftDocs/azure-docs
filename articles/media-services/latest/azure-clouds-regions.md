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

Azure Media Services v3 is available via Azure Resource Manager. However, not all Media Services features are available in all the Azure clouds. This document outlines availabilities of main Media Services v3 components. The following tables show which Media Services features are available in each region.  

[!INCLUDE [reference-feature-availability-us](./includes/regions-availability-table-key.md)]

Use the navigation on the right to find the region you are interested in.

<!-- US and US Gov -->
[!INCLUDE [reference-feature-availability-us](./includes/reference-feature-availability-us.md)]
[!INCLUDE [reference-feature-availability-usgov](./includes/reference-feature-availability-usgov.md)]
<!-- Africa -->
[!INCLUDE [reference-feature-availability-africa](./includes/reference-feature-availability-africa.md)]
<!-- APAC -->
[!INCLUDE [reference-feature-availability-apac](./includes/reference-feature-availability-apac.md)]
<!-- Australia -->
[!INCLUDE [reference-feature-availability-australia](./includes/reference-feature-availability-australia.md)]
<!-- Brazil -->
[!INCLUDE [reference-feature-availability-brazil](./includes/reference-feature-availability-brazil.md)]
<!-- Canada -->
[!INCLUDE [reference-feature-availability-canada](./includes/reference-feature-availability-canada.md)]
<!-- China -->
[!INCLUDE [reference-feature-availability-china](./includes/reference-feature-availability-china.md)]
<!-- Europe -->
[!INCLUDE [reference-feature-availability-europe](./includes/reference-feature-availability-europe.md)]
<!-- Germany -->
[!INCLUDE [reference-feature-availability-germany](./includes/reference-feature-availability-germany.md)]
<!-- India -->
[!INCLUDE [reference-feature-availability-india](./includes/reference-feature-availability-india.md)]
<!-- Japan -->
[!INCLUDE [reference-feature-availability-japan](./includes/reference-feature-availability-japan.md)]
<!-- Korea -->
[!INCLUDE [reference-feature-availability-korea](./includes/reference-feature-availability-korea.md)]
<!-- Norway -->
[!INCLUDE [reference-feature-availability-norway](./includes/reference-feature-availability-norway.md)]
<!-- Switzerland -->
[!INCLUDE [reference-feature-availability-switzerland](./includes/reference-feature-availability-switzerland.md)]
<!-- UAE -->
[!INCLUDE [reference-feature-availability-uae](./includes/reference-feature-availability-uae.md)]
<!-- UK -->
[!INCLUDE [reference-feature-availability-uk](./includes/reference-feature-availability-uk.md)]

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
