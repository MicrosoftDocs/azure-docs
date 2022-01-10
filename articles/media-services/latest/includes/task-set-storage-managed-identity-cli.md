---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 08/17/2020
ms.author: inhenkel
ms.custom: CLI, devx-track-azurecli
---

<!-- ### Give a Media Services Managed identity access to a storage account. -->

The following command gives a Media Services Managed Identity access to a storage account.

In the command below, change `your-resource-group-name` to the resource group name, and `your-media-services-account-name`to the Media Services account name you want to work with:

```azurecli-interactive
az ams account storage set-authentication --storage-auth ManagedIdentity --resource-group <your-resource-group_name> --account-name <your-media-services-account-name>

```

Example JSON response:

```json
{
  "encryption": {
    "keyVaultProperties": null,
    "type": "SystemKey"
  },
  "id": "/subscriptions/00000000-0000-0000-00000000/resourceGroups/your-resource-group-name/providers/Microsoft.Media/mediaservices/your-storage-account-name",
  "identity": null,
  "location": "West US 2",
  "mediaServiceId": "00000000-0000-0000-00000000",
  "name": "your-media-services-account",
  "resourceGroup": "your-resource-group-name",
  "storageAccounts": [
    {
      "id": "/subscriptions/2b461b25-f7b4-4a22-90cc-d640a14b5471/resourceGroups/your-resource-group-name/providers/Microsoft.Storage/storageAccounts/your-storage-account-name",
      "resourceGroup": "your-resource-group-name",
      "type": "Primary"
    }
  ],
  "storageAuthentication": "ManagedIdentity",
  "systemData": {
    "createdAt": "2021-05-17T19:15:00.8850297Z",
    "createdBy": "you@example.com",
    "createdByType": "User",
    "lastModifiedAt": "2021-05-17T21:23:11.3863627Z",
    "lastModifiedBy": "you@example.com",
    "lastModifiedByType": "User"
  },
  "tags": null,
  "type": "Microsoft.Media/mediaservices"
}

```
