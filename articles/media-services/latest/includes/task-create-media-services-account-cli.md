---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 08/17/2020
ms.author: inhenkel
ms.custom: CLI
---

<!--Create a media services account -->

The following Azure CLI command creates a new Media Services account. You can replace the following values: `amsaccount`  `storageaccountforams` (must match the value you gave for your storage account), and `amsResourceGroup` (must match the value you gave for the resource group).

```azurecli
az ams account create --name amsaccount -g amsResourceGroup --storage-account storageaccountforams -l westus2
```