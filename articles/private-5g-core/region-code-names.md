---
title: Region code names for Azure Private 5G Core 
description: Learn about the region code names used for the location parameter in Azure Private 5G Core ARM templates
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: reference
ms.custom: references_regions
ms.date: 11/17/2022
---

# Region code names

When the **location** parameter is used in a command or request, you need to provide the region code name as the **location** value. To get the code name of the region that your private mobile network is in, run the following command in the Azure CLI.

```cloudshell-bash
az account list-locations -o table
```

The output of this command is a table of the names and locations for all the Azure regions that your subscription supports. Navigate to the Azure region that has the *DisplayName* you are looking for and use its *Name* value for the **location** parameter.

For example, if you're deploying in the East US region, use *eastus* for the **location** parameter.

```json
DisplayName               Name                 RegionalDisplayName
------------------------  -------------------  -------------------------------------
East US                   eastus               (US) East US
West Europe               westeurope           (Europe) West Europe
```

See [Products available by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=private-5g-core) for the Azure regions where Azure Private 5G Core is available.