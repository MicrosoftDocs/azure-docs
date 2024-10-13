---
author: MikeRayMSFT
ms.author: mikeray
ms.service: azure-arc
ms.topic: include
ms.date: 10/27/2023
---

To get the region segment of a regional endpoint, remove all spaces from the Azure region name. For example, *East US 2* region, the region name is `eastus2`.

For example: `*.<region>.arcdataservices.com` should be `*.eastus2.arcdataservices.com` in the East US 2 region.

To see a list of all regions, run this command:

```azurecli
az account list-locations -o table
```

```azurepowershell
Get-AzLocation | Format-Table
```
