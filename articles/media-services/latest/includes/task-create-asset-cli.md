---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 08/18/2020
ms.author: inhenkel
ms.custom: CLI
---

<!--Create a media services asset CLI-->

The following Azure CLI command creates a new Media Services asset. Replace the values `assetName`  `amsAccountName` and `resourceGroup` with values you are currently working with.

```azurecli
az ams asset create -n assetName -a amsAccountName -g resourceGroup
```
