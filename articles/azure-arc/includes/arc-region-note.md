---
author: MikeRayMSFT
ms.author: mikeray
ms.service: azure-arc
ms.topic: include
ms.date: 12/13/2022
---

To get the region segment of a regional endpoint, remove all spaces from the Azure region name. For example, *East US 2* region, the region name is `eastus2`.

For example: `san-af-<region>-prod.azurewebsites.net` should be `san-af-eastus2-prod.azurewebsites.net` in the East US 2 region.

To see a list of all regions, run this command:

```azcli
az account list-locations -o table
```
