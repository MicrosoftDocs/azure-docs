---
title: In-account restore for continuous backup (preview)
titleSuffix: Azure Cosmos DB
description: Restore a deleted container or database to a specific point in time and the same Azure Cosmos DB account.
author: kanshiG
ms.author: govindk
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/08/2023
---

# In-account restore for continuous backup with Azure Cosmos DB (preview)

[!INCLUDE[NoSQL, MongoDB, Gremlin, Table](includes/appliesto-nosql-mongodb-gremlin-table.md)]

The in-account point-in-time restore capability of continuous backup in Azure Cosmos DB allows you to restore the deleted databases or containers within the same account. You can perform this restore operation via the Azure portal, the Azure CLI, Azure PowerShell. This feature helps in recovering the data from accidental deletions of databases or containers.

## What is restored?

You can choose to restore any combination of deleted provisioned throughput containers or nonshared throughput database. The specified databases or containers are restored in all the regions present in account when the restored operation was performed. The duration of restoration depends on the amount of data that needs to be restored and the regions where account is present. Since database has to be present before restore of the container can be restored, that has to be done independently if it was deleted.

See more details on [what is restored](https://learn.microsoft.com/azure/cosmos-db/continuous-backup-restore-introduction#what-is-restored) and [what isn't restored](https://learn.microsoft.com/azure/cosmos-db/continuous-backup-restore-introduction#what-isnt-restored) from the continuous backup public documentation.

> [!NOTE]
> When the deleted databases or containers are restored within the same account, those should be considered as new resources and the old session/continuation tokens which were in use will become invalid. It is recommended to refresh the locally stored session and continuations tokens before performing further reads/writes on the restored resources. Also, It is recommended to restart SDK clients to refresh session and continuations tokens stored in SDK cache.

If your application listens to change feed events on the restored database or containers, it should restart the change feed from the beginning after a restore operation. This restore operation allows the application to get the correct set of change feed events. The restored resource will only have the change feed events starting from the lifetime of the resource after restore. All change feed events before the deletion of resource aren't propagated to the change feed. Similarly, it's also recommended to restart query operations after a restore operation as they might have stored continuation token, which becomes invalid after restore.

## Permissions

You can restrict the restore permissions for a continuous backup account to a specific role or principal. For more information on permissions and how to assign them, see [continuous backup and restore permissions](continuous-backup-restore-permissions.md).

## Understanding container instance identifiers

When a deleted container gets restored within the same account, the restored container has same name and resourced as of original (deleted) container. To easily distinguish between the different versions of the container present, we have introduced the concept of 'InstanceId', which represents the different incarnations of a container. The instanceId field is stored as part of restore parameters in container body. The original container has no restore parameters. The subsequent restored instances of container have restore parameters with unique instanceId.

## In Account Restore Scenarios

Azure Cosmos DB's point-in-time restore feature helps you to recover from an accidental delete on database or a container, by performing restore into any region (where backups existed) within same existing account. The continuous backup mode allows you to do restore to any point of time within the last 30 days or 7 days as per the tier.

- For the scenario where restore happens in an existing account - You can only perform the restore operation on a specified database or container only if the specified resource was available in current write region as of restore timestamp.  In-Account restore doesn't allow performing restore of existing(not-deleted) databases or container within the same account. Restore of live resources can be done by restoring to a new account.
  
For example:

- **Scenario 1**: The Azure Cosmos DB database account has two regions: West US (write region) and East US (read region) as of timestamp T1. Assume container (col1) is created at timestamp T1 and got deleted at T2. The container col1 can be restored within the retention period. Say, the write region of the account is failed over to East US and West US becomes the read region. Even now, col1 can be restored within its retention period as long as col1 was present in East US region as of the restore timestamp specified.

- **Scenario 2**: The Azure Cosmos DB database account has one region West US at timestamp T1. Assume col1 was created at timestamp T2 and then deleted at T3. The new region East US got added at T4 and then failover was performed to East US to make it as new write region as of T5. In this scenario, col1 can't be restored because col1 wasn't present in East US region.

Following is the current behavior of this feature:

- Shared throughput containers are restored with their shared throughput database.

- Container restore requires the original database present. This restriction implies that the restoration of the database has to be performed before trying to restore the deleted container.  

- Restore of the same resource (database or container) would fail if another restore on same resource is in progress.

- Creation of container in a shared throughput database being restored isn't allowed until restore finishes.

- Restore of container or database is blocked if a delete operation is already under process on them.

- On a given account more than three different resources, restore activities can't be run in parallel.  

- Restore of a database or container resource succeeds when it's present in as of restore time in the current write region of the account.  

You can find here more details on Backup restore introduction, Continuous backup restore and backup options.

## Next steps

- [Trigger a restore operation](how-to-restore-in-account-continuous-backup.md) for a continuous backup account.
- [Resource model of continuous backup mode](restore-in-account-continuous-backup-resource-model.md)
