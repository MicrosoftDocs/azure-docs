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

Change `your-storage-account-name` to a unique name with a length of less than 24 characters. The command assumes that you have already created a resource group.  Use that resource group name for `your-resource-group-name`. Use the name of your preferred region for `your-region`.

```azurecli-interactive
az storage account create --name <your-storage-account-name> --kind StorageV2 --sku Standard_LRS -l <your-region> -g <your-resource-group-name>
```

Example JSON response:

```json
{
  "accessTier": "Hot",
  "allowBlobPublicAccess": null,
  "azureFilesIdentityBasedAuthentication": null,
  "blobRestoreStatus": null,
  "creationTime": "2021-05-12T22:10:22.058640+00:00",
  "customDomain": null,
  "enableHttpsTrafficOnly": true,
  "encryption": {
    "keySource": "Microsoft.Storage",
    "keyVaultProperties": null,
    "requireInfrastructureEncryption": null,
    "services": {
      "blob": {
        "enabled": true,
        "keyType": "Account",
        "lastEnabledTime": "2021-05-12T22:10:22.152394+00:00"
      },
      "file": {
        "enabled": true,
        "keyType": "Account",
        "lastEnabledTime": "2021-05-12T22:10:22.152394+00:00"
      },
      "queue": null,
      "table": null
    }
  },
  "failoverInProgress": null,
  "geoReplicationStats": null,
  "id": "/subscriptions/00000000-0000-0000-000000000000/resourceGroups/your-resource-group-name/providers/Microsoft.Storage/storageAccounts/your-storage-account-name",
  "identity": null,
  "isHnsEnabled": null,
  "kind": "StorageV2",
  "largeFileSharesState": null,
  "lastGeoFailoverTime": null,
  "location": "your-region",
  "minimumTlsVersion": null,
  "name": "your-storage-account-name",
  "networkRuleSet": {
    "bypass": "AzureServices",
    "defaultAction": "Allow",
    "ipRules": [],
    "virtualNetworkRules": []
  },
  "primaryEndpoints": {
    "blob": "https://your-storage-account-name.blob.core.windows.net/",
    "dfs": "https://your-storage-account-name.dfs.core.windows.net/",
    "file": "https://your-storage-account-name.file.core.windows.net/",
    "internetEndpoints": null,
    "microsoftEndpoints": null,
    "queue": "https://your-storage-account-name.queue.core.windows.net/",
    "table": "https://your-storage-account-name.table.core.windows.net/",
    "web": "your-storage-account-name.z5.web.core.windows.net/"
  },
  "primaryLocation": "your-region",
  "privateEndpointConnections": [],
  "provisioningState": "Succeeded",
  "resourceGroup": "your-resource-group-name",
  "routingPreference": null,
  "secondaryEndpoints": null,
  "secondaryLocation": null,
  "sku": {
    "name": "Standard_LRS",
    "tier": "Standard"
  },
  "statusOfPrimary": "available",
  "statusOfSecondary": null,
  "tags": {},
  "type": "Microsoft.Storage/storageAccounts"
}
```