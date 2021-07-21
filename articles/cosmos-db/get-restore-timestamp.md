---
title: Get the latest restorable timestamp for a SQL container
description: The latest restorable timestamp API provides the latest restorable timestamp for SQL containers on accounts created with continuous mode backup policy. 
author: SnehaGunda
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.date: 07/16/2020
ms.author: sngun
ms.topic: how-to
ms.reviewer: sngun
---

# Get the latest restorable timestamp for a SQL container

Azure Cosmos DB offers an API to get the latest restorable timestamp for a SQL container. This API provides the latest restorable timestamp for SQL containers on accounts created with continuous mode backup policy. This is the latest timestamp up to which your data has been successfully backed up. You can restore your data to anytime timestamp up to this latest restorable timestamp.

## Request and response format

### Powershell

```azurepowershell-interactive
Get-AzCosmosDBSqlContainerBackupInformation [[-ResourceGroupName] <resourceGroupName>] [[-AccountName] <accountName>] [[-DatabaseName] <databaseName>] [[-Name] <containerName>] [[-Location] <location>]
```

**Sample request**

```azurepowershell-interactive
Get-AzCosmosDBSqlContainerBackupInformation -ResourceGroupName CosmosDBResourceGroup3668 -AccountName pitr-sql-stage-source -DatabaseName TestDB1 -Name TestCollectionInDB1 -Location "EAST US 2"
```

**Sample response**

```console
LatestRestorableTimestamp
-------------------------
1623042210
```

### CLI

```azurecli-interactive
az cosmosdb sql retrieve-latest-backup-time -g {resourcegroup} -a {accountname} -d {db_name} -c {container_name} -l {location}
```

**Sample response**

```console
{'continuousBackupInformation': {'latestRestorableTimestamp': '1623982363'}}
Response: Number of seconds since epoch time (00:00:00 UTC Thursday, 1 January 1970)
```

## Frequently asked questions

### Can I use this API for accounts with Periodic backup policies?
No. This API can only be used on accounts with continuous backup mode.

### Can I use this API for accounts migrated to continuous mode?
Yes

### What is the typical delay between the write operations and latest restorable timestamp?
Usually, your data is backed up within 100 seconds after the data write operation. However, in some exceptional cases, backups could be delayed for more than 100 seconds.

## Next steps

* [Introduction to continuous backup mode with point-in-time restore](continuous-backup-restore-introduction.md)

* [Continuous backup mode resource model](continuous-backup-restore-resource-model.md)

* [Configure and manage continuous backup mode](continuous-backup-restore-portal.md) using Azure portal
