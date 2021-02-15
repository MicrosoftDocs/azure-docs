---
title: Clouds and regions for Azure Media Services v3
description: This article talks about the URLs used for endpoints and code for regions.
services: media-services
author: IngridAtMicrosoft
manager: femila
ms.service: media-services
ms.topic: reference
ms.date: 10/28/2020
ms.author: inhenkel
---

# Regional code names and endpoints

### Region code name

When the **location** parameter is used in a command or request, you need to provide the region code name as the **location** value. To get the code name of the region that your account is in and that your call should be routed to, you can run the following line in Azure CLI.

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

> [!NOTE]
> The Azure Germany endpoints only apply to the Sovereign clouds in Germany.

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
* [Regional code names and endpoints](azure-regions-code-names.md)
* [Azure geographies](https://azure.microsoft.com/global-infrastructure/geographies/)
* [Azure locations](https://azure.microsoft.com/global-infrastructure/locations/)

## Next steps

[Media Services v3 overview](media-services-overview.md)
