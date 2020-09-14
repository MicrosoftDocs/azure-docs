---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 08/17/2020
ms.author: inhenkel
ms.custom: CLI
---

<!-- Create a resource group -->

Use the following command to create a resource group. Select the geographic region that will be used to store the media and metadata records for your Media Services account. This region will be used to process and stream your media.

```azurecli
az group create --name amsResourceGroup --location westus2
```
