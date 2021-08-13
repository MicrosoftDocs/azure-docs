---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 08/17/2020
ms.author: inhenkel
ms.custom: CLI, devx-track-azurecli
---

<!--Create a media services account -->

The following Azure CLI command creates a new Media Services account. Replace the following values: `your-media-services-account-name`  `your-storage-account-name`, and `your-resource-group-name` with the names you want to use. The command assumes that you have already created a resource group and a Storage account. 

It gives the Media Services account a system assigned managed identity with the `--mi-system-assigned` flag.

```azurecli-interactive

az ams account create --name <your-media-services-account-name> --resource-group <your-resource-group-name> --mi-system-assigned --storage-account <your-storage-account-name>

```

Example JSON response:

```json
{
  "encryption": {
    "keyVaultProperties": null,
    "type": "SystemKey"
  },
  "id": "/subscriptions/00000000-0000-0000-0000-00000000/resourceGroups/your-resource-group/providers/Microsoft.Media/mediaservices/your-media-services-account-name",
  "identity": {
    "principalId": "00000000-0000-0000-0000-00000000",
    "tenantId": "00000000-0000-0000-0000-00000000",
    "type": "SystemAssigned"
  },
  "location": "your-region",
  "mediaServiceId": "00000000-0000-0000-0000-00000000",
  "name": "your-media-services-account-name",
  "resourceGroup": "your-resource-group",
  "storageAccounts": [
    {
      "id": "/subscriptions/00000000-0000-0000-0000-00000000/resourceGroups/mediatest1rg/providers/Microsoft.Storage/storageAccounts/your-storage-account-name",
      "resourceGroup": "your-resource-group",
      "type": "Primary"
    }
  ],
  "storageAuthentication": "System",
  "systemData": {
    "createdAt": "2021-05-14T21:25:12.3492071Z",
    "createdBy": "you@example.com",
    "createdByType": "User",
    "lastModifiedAt": "2021-05-14T21:25:12.3492071Z",
    "lastModifiedBy": "you@example.com",
    "lastModifiedByType": "User"
  },
  "tags": null,
  "type": "Microsoft.Media/mediaservices"
}
```
