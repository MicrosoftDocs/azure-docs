---
title: Frequently asked questions about Azure Cosmos DB point-in-time restore feature.
description: This article lists frequently asked questions about the Azure Cosmos DB point-in-time restore feature that is achieved by using the continuous backup mode.
author: kanshiG
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 02/01/2021
ms.author: govindk
ms.reviewer: sngun

---

# Frequently asked questions on the Azure Cosmos DB point-in-time restore feature (Preview)
[!INCLUDE[appliesto-sql-mongodb-api](includes/appliesto-sql-mongodb-api.md)]

> [!IMPORTANT]
> The point-in-time restore feature(continuous backup mode) for Azure Cosmos DB is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article lists frequently asked questions about the Azure Cosmos DB point-in-time restore functionality(Preview) that is achieved by using the continuous backup mode.

## How much time does it takes to restore?
The restore duration dependents on the size of your data.

### Can I submit the restore time in local time?
The restore may not happen depending on whether the key resources like databases or containers existed at that time. You can verify by entering the time and looking at the selected database or container for a given time. If you see no resources exist to restore, then the restore process doesn't work.

### How can I track if an account is being restored?
After you submit the restore command, and wait on the same page, after the operation is complete, the status bar shows successfully restored account message. You can also search for the restored account and [track the status of account being restored](continuous-backup-restore-portal.md#track-restore-status). While restore is in progress, the status of the account will be *Creating*, after the restore operation completes, the account status will change to *Online*.

Similarly for PowerShell and CLI, you can track the progress of restore operation by executing `az cosmosdb show` command as follows:

```azurecli-interactive
az cosmosdb show --name "accountName" --resource-group "resourceGroup"
```

The provisioningState shows *Succeeded* when the account is online.

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

### How can I find out whether an account was restored from another account?
Run the `az cosmosdb show` command, in the output, you can see that the value of `createMode` property. If the value is set to **Restore**. it indicates that the account was restored from another account. The `restoreParameters` property has further details such as `restoreSource`, which has the source account ID. The last GUID in the `restoreSource` parameter is the instanceId of the source account.

For example, in the following output, the source account's instance ID is *7b4bb-f6a0-430e-ade1-638d781830cc*

```json
"restoreParameters": {
   "databasesToRestore" : [],
   "restoreMode": "PointInTime",
   "restoreSource": "/subscriptions/2a5b-f6a0-430e-ade1-638d781830dd/providers/Microsoft.DocumentDB/locations/westus/restorableDatabaseAccounts/7b4bb-f6a0-430e-ade1-638d781830cc",
   "restoreTimestampInUtc": "2020-06-11T22:05:09Z"
}
```

### What happens when I restore a shared throughput database or a container within a shared throughput database?
The entire shared throughput database is restored. You cannot choose a subset of containers in a shared throughput database for restore.

### What is the use of InstanceID in the account definition?
At any given point in time, Azure Cosmos DB account's `accountName` property is globally unique while it is alive. However, after the account is deleted, it is possible to create another account with the same name and hence the "accountName" is no longer enough to identify an instance of an account. 

ID or the `instanceId` is a property of an instance of an account and it is used to disambiguate across multiple accounts (live and deleted) if they have same name for restore. You can get the instance ID by running the `Get-AzCosmosDBRestorableDatabaseAccount` or  `az cosmosdb restorable-database-account` commands. The name attribute value denotes the "InstanceID".

## Next steps

* What is [continuous backup](continuous-backup-restore-introduction.md) mode?
* Configure and manage continuous backup using [Azure portal](continuous-backup-restore-portal.md), [PowerShell](continuous-backup-restore-powershell.md), [CLI](continuous-backup-restore-command-line.md), or [Azure Resource Manager](continuous-backup-restore-template.md).
* [Manage permissions](continuous-backup-restore-permissions.md) required to restore data with continuous backup mode.
* [Resource model of continuous backup mode](continuous-backup-restore-resource-model.md)