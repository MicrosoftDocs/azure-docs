---
  author: kanshiG
  ms.author: govindk
  ms.reviewer: mjbrown
  ms.service: cosmos-db
  ms.topic: include
  ms.date: 04/19/2023
---

After you submit the restore command and wait on the page, the status bar shows a message about a successfully restored account when the operation finishes. You can also search for the restored account and [track its status](../restore-account-continuous-backup.md#track-restore-status). While the restore is in progress, the account status is **Creating**. After the restore operation finishes, the account status changes to **Online**.

For PowerShell and the Azure CLI, you can track the progress of a restore operation by using the [`az cosmosdb show`](/cli/azure/cosmosdb#az-cosmosdb-show) command:

```azurecli-interactive
az cosmosdb show \
  --resource-group <resource-group> \
  --name <account-name>
```

The `provisioningState` value is `Succeeded` when the account is online.

```json
{
  "virtualNetworkRules": [],
  "writeLocations" : [
    {
      "documentEndpoint": "https://<accountname>.documents.azure.com:443/", 
      "failoverpriority": 0,
      "id": "accountName" ,
      "isZoneRedundant" : false, 
      "locationName": "West US 2", 
      "provisioningState": "Succeeded"
    }
  ]
}
```
