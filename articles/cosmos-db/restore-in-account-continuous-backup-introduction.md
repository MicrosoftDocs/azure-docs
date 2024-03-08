---
title: Same-account (in-account) restore for continuous backup (preview)
titleSuffix: Azure Cosmos DB
description: An introduction to restoring a deleted container or database to a specific point in time in the same Azure Cosmos DB account.
author: kanshiG
ms.author: govindk
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.custom: build-2023
ms.topic: conceptual
ms.date: 05/08/2023
---

# Restore a deleted database or container in the same account by using continuous backup (preview)

[!INCLUDE[NoSQL, MongoDB, Gremlin, Table](includes/appliesto-nosql-mongodb-gremlin-table.md)]

The same-account restore capability of continuous backup in Azure Cosmos DB allows you to restore a deleted database or container in the same existing account. You can perform this restore operation by using the [Azure portal](how-to-restore-in-account-continuous-backup.md?tabs=azure-portal&pivots=api-nosql), the [Azure CLI](how-to-restore-in-account-continuous-backup.md?tabs=azure-cli&pivots=api-nosql), or [Azure PowerShell](how-to-restore-in-account-continuous-backup.md?tabs=azure-powershell&pivots=api-nosql). This feature helps you recover data from accidental deletions of databases or containers.

## What is restored?

You can choose to restore any combination of deleted provisioned throughput containers or shared throughput databases. The specified databases or containers are restored in all the regions that are present in the account when the restore operation is started. The duration of restoration depends on the amount of data that needs to be restored and the regions in which the account is present. Because a parent database must be present before a container can be restored, the database restoration must be done before you restore the child container.

For more information on what continuous backup restores and what it doesn't restore, see the [continuous backup introduction](continuous-backup-restore-introduction.md).

> [!NOTE]
> When the deleted databases or containers are restored within the same account, those resource should be treated as new resources. Existing session or continuation tokens in use from your client applications become invalid. We recommend that you refresh the locally stored session and continuations tokens before you perform further reads or writes on the newly restored resources. Also, we recommend that you restart SDK clients to automatically refresh session and continuations tokens that are stored in the SDK cache.

If your application listens to change feed events on the restored database or containers, it should restart the change feed from the beginning after a restore operation. The restored resource will have only the change feed events starting from the lifetime of the resource after restore. All change feed events before the deletion of the resource aren't propagated to the change feed. We also recommend that you restart query operations after a restore operation. Existing query operations might have generated continuation tokens, which become invalid after a restoration operation.

## Permissions

You can restrict the restore permissions for a continuous backup account to a specific role or principal. For more information on permissions and how to assign them, see [Continuous backup and restore permissions](continuous-backup-restore-permissions.md).

## Understand container instance identifiers

When a deleted container is restored within the same account, the restored container has the same name and `resourceId` value of the original container that was previously deleted. To easily distinguish between the different versions of the container, use the `CollectionInstanceId` field. The `CollectionInstanceId` field differentiates between the different versions of a container. These versions include both the original container that was deleted and the newly restored container. The instance identifier is stored as part of the restore parameters in the restored container's resource definition. The original container conversely doesn't have restore parameters defined in the resource definition of the container. Each later restored instance of a container has a unique instance identifier.

Here's an example:

| Instance | Instance identifier |
| --- | --- |
| **Original container** | *not defined* |
| **First restoration of container** | `11111111-1111-1111-1111-111111111111` |
| **Second restoration of container** | `22222222-2222-2222-2222-222222222222` |

## In-account restore scenarios

The Azure Cosmos DB feature to restore to a point in time in the same account helps you recover from an accidental delete on a database or a container. This feature restores to any region in which previous backups existed in the same account. You can use continuous backup mode to restore to any point of time within the last 30 days or 7 days depending on the configured tier.

Consider an example scenario in which the restore operation targets an existing account. In this scenario, you can perform the restore operation on a specified database or container if the specified resource was available in the current write region as of the restore's source database or container timestamp. The in-account restore feature doesn't allow restoring existing (or not-deleted) databases or containers within the same account. To restore live resources, target the restore operation to a new account.
  
Consider two more scenarios:

- **Scenario 1**: The Azure Cosmos DB account has two regions: **West US** (write region) and **East US** (read region) as of time stamp `T1`. Assume the container (`C1`) is created at time stamp `T1` and was deleted at `T2`. The container, `C1` can be restored within the retention period. Now, consider a situation in which the write region of the account is failed over to **East US**. Now, **West US** becomes the read region. Even with this situation, `C1` can be restored within its retention period as long as `C1` was present in the **East US** region when the restore time stamp was specified.

- **Scenario 2**: The Azure Cosmos DB account has one region **West US** at time stamp `T3`. Assume `CT2` was created at time stamp `T4` and then deleted at `T5`. The new region **East US** was added at `T6`, and then failover was performed to **East US** to make it as new write region as of `T7`. In this scenario, `CT2` can't be restored because `CT2` wasn't present in the **East US** region.

Here's a list of the current behavior characteristics of the point-in-time in-account restore feature:

- Shared-throughput containers are restored with their shared-throughput database.

- Container restore operations require the original database to be present. This restriction implies that the restoration of the parent database must be performed before you try to restore a deleted child container.  

- Restoration of a resource (database or container) fails if another restore operation for the same resource is already in progress.

- Creating a container in a shared-throughput database isn't allowed until all restoration options finish.

- Restoration of a container or database is blocked if a delete operation is already in process on either the container or the database.

- If an account has more than three different resources, restoration operations can't be run in parallel.  

- Restoration of a database or container resource succeeds when the resource is present as of restore time in the current write region of the account.

- Same-account restore can't be performed while any account-level operations, such as add region, remove region, or fail over, is in progress.

## Next steps

- [Initiate an in-account restore operation](how-to-restore-in-account-continuous-backup.md) for a continuous backup account.
- Learn about the [resource model of in-account continuous backup mode](restore-in-account-continuous-backup-resource-model.md).
