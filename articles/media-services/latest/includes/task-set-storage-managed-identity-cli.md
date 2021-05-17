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

The command assumes that you have already created a resource group, a Storage account, and a Media Services account. Change `your-resource-group-name` to the resource group name, `your-storage-account-name` to the storage account name, and `your-media-services-account-name`to the Media Services account name you want to work with in the command below:

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
  "name": "mediatestacc3",
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
