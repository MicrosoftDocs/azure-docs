---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 08/17/2020
ms.author: inhenkel
ms.custom: CLI, devx-track-azurecli
---

<!-- ### Create a Storage Blob Contributor role -->

The following command creates a Reader role. 

The command assumes that you have already created a resource group and a Storage account. Change `your-resource-group-name` to the resource group name and `your-storage-account-name` to the storage account name you want to work with in the command below:

```azurecli-interactive
az ams account storage set-authentication --storage-auth ManagedIdentity --resource-group <your-resource-group_name> --account-name <your-media-services-account-name>

```

Example JSON response:

```json

```
