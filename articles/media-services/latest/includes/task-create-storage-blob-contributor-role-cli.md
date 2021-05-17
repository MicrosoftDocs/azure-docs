---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 08/17/2020
ms.author: inhenkel
ms.custom: CLI, devx-track-azurecli
---

<!-- ### Create a Storage Blob Contributor role -->

The following command creates a Storage Blob Contributor role. 

Change `assignee` to the `principalId`. The command assumes that you have already created a resource group and a Storage account.  Use `your-resource-group-name` and `your-storage-account-name` as part of the `scope` value as shown in the command below:

```azurecli-interactive
az role assignment create --assignee 00000000-0000-0000-000000000000 --role "Storage Blob Data Contributor" --scope "/subscriptions/00000000-0000-0000-000000000000/resourceGroups/your-resource-group-name/providers/Microsoft.Storage/storageAccounts/your-storage-account-name"
```

Example JSON response:

```json

```
