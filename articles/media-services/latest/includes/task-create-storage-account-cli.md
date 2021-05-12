---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 08/17/2020
ms.author: inhenkel
ms.custom: CLI, devx-track-azurecli
---

<!-- ### Create a storage account -->

The following command creates a Storage account that is associated with a Media Services account. 

Change `your-storage-account-name` to unqiue name with a length of less than 24 characters. The command assumes that you have already created a resource group.  Use that resource group name for `your-resource-group`. Use the name of your preferred region for `your-region`.

```azurecli
az storage account create --name your-storage-account-name --kind StorageV2 --sku Standard_LRS -l your-region -g your-resource-group
```
