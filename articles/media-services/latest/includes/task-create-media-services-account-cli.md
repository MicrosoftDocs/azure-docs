---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 08/17/2020
ms.author: inhenkel
ms.custom: CLI, devx-track-azurecli
---

<!--Create a media services account -->

The following Azure CLI command creates a new Media Services account. You can replace the following values: `your-media-services-account-name`  `your-storage-account-name`, and `your-resource-group`. The command assumes that you have already created a resource group and a Storage account.

```azurecli-interactive
az ams account create --name your-media-services-account-name -g amsResourceGroup --storage-account your-storage-account-name -l westus2
```
