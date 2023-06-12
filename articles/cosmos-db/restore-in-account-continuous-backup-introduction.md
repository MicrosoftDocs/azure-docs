---
title: Same account(In-account) restore for continuous backup (preview)
titleSuffix: Azure Cosmos DB
description: Restore a deleted container or database to a specific point in time in the same Azure Cosmos DB account.
author: kanshiG
ms.author: govindk
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.custom: build-2023
ms.topic: conceptual
ms.date: 05/08/2023
---

# Restoring deleted databases/containers in the same account with continuous backup in Azure Cosmos DB (preview)

[!INCLUDE[NoSQL, MongoDB, Gremlin, Table](includes/appliesto-nosql-mongodb-gremlin-table.md)]

The same account restore capability of continuous backup in Azure Cosmos DB allows you to restore the deleted databases or containers within the same existing account. You can perform this restore operation using the [Azure portal](how-to-restore-in-account-continuous-backup.md?tabs=azure-portal&pivots=api-nosql), [Azure CLI](how-to-restore-in-account-continuous-backup.md?tabs=azure-cli&pivots=api-nosql), or [Azure PowerShell](how-to-restore-in-account-continuous-backup.md?tabs=azure-powershell&pivots=api-nosql). This feature helps in recovering the data from accidental deletions of databases or containers.

## What is restored?

You can choose to restore any combination of deleted provisioned throughput containers or shared throughput databases. The specified databases or containers are restored in all the regions present in the account when the restore operation was started. The duration of restoration depends on the amount of data that needs to be restored and the regions where the account is present. Since a parent database must be present before a container can be restored, the database restoration must be done first before restoring the child container.

For more information on what continuous backup does and doesn't restore, see the [continuous backup introduction](continuous-backup-restore-introduction.md).

> [!NOTE]
> When the deleted databases or containers are restored within the same account, those resource should be treated as new resources. Existing session or continuation tokens in use from your client applications will become invalid. It is recommended to refresh the locally stored session and continuations tokens before performing further reads or writes on the newly restored resources. Also, It is recommended to restart SDK clients to automatically refresh session and continuations tokens stored in the SDK cache.

If your application listens to change feed events on the restored database or containers, it should restart the change feed from the beginning after a restore operation. The restored resource will only have the change feed events starting from the lifetime of the resource after restore. All change feed events before the deletion of the resource aren't propagated to the change feed. Similarly, it's also recommended to restart query operations after a restore operation. Existing query operations may have generated continuation tokens, which now become invalid after a restoration operation.

## Permissions

You can restrict the restore permissions for a continuous backup account to a specific role or principal. For more information on permissions and how to assign them, see [continuous backup and restore permissions](continuous-backup-restore-permissions.md).

## Understanding container instance identifiers

When a deleted container gets restored within the same account, the restored container has the same name and resourceId of the original container that was previously deleted. To easily distinguish between the different versions of the container, use the `CollectionInstanceId` field. The `CollectionInstanceId` field differentiates between the different versions of a container. These versions include both the original container that was deleted and the newly restored container. The instance identifier is stored as part of the restore parameters in the restored container's resource definition. The original container, conversely doesn't have restore parameters defined in the resource definition of the container. Each later restored instance of a container has a unique instance identifier.

Here's an example:

| | Instance identifier |
| --- | --- |
| **Original container** | *not defined* |
| **First restoration of container** | `11111111-1111-1111-1111-111111111111` |
| **Second restoration of container** | `22222222-2222-2222-2222-222222222222` |

## In-account restore scenarios

Azure Cosmos DB's point-in-time restore in same account feature helps you to recover from an accidental delete on a database or a container. This feature restores into any region, where backups existed, within the same account. The continuous backup mode allows you to restore to any point of time within the last 30 days or seven days depending on the configured tier.

- Consider an example scenario where the restore operation targets an existing account. In this scenario, you can only perform the restore operation on a specified database or container if the specified resource was available in the current write region as of the restore's source database/container timestamp. The in-account restore feature doesn't allow restoring existing (or not-deleted) databases or container within the same account. To restore live resources, target the restore operation to a new account.
  
Let's consider two more scenarios:

- **Scenario 1**: The Azure Cosmos DB account has two regions: **West US** (write region) and **East US** (read region) as of timestamp `T1`. Assume the container (`C1`) is created at timestamp `T1` and got deleted at `T2`. The container, `C1` can be restored within the retention period. Now, consider a situation where the write region of the account is failed over to **East US**. Now, **West US** becomes the read region. Even with this situation, `C1` can be restored within its retention period as long as `C1` was present in the **East US** region as of the restore timestamp specified.

- **Scenario 2**: The Azure Cosmos DB account has one region **West US** at timestamp `T3`. Assume `CT2` was created at timestamp `T4` and then deleted at `T5`. The new region **East US** got added at `T6` and then failover was performed to **East US** to make it as new write region as of `T7`. In this scenario, `CT2` can't be restored because `CT2` wasn't present in the **East US** region.

Here's a list of the current behavior characteristics of the point-in-time in-account restore feature:

- Shared-throughput containers are restored with their shared-throughput database.

- Container restore operations require the original database present. This restriction implies that the restoration of the parent database must be performed before trying to restore the deleted child container.  

- Restoration of a resource (database or container) would fail if another restore operation for the same resource is already in progress.

- Creating a container in a shared-throughput database isn't allowed until all restoration options finish.

- Restoration of a container or database is blocked if a delete operation is already in process on either of them.

- If an account has more than three different resources, restoration operations can't be run in parallel.  

- Restoration of a database or container resource succeeds when the resource is present as of restore time in the current write region of the account.  
- Same account restore cannot be performed while any account level operations such as add region, remove region or failover is in progress.

## Next steps

- [Trigger an in-account restore operation](how-to-restore-in-account-continuous-backup.md) for a continuous backup account.
- [Resource model of in-account continuous backup mode](restore-in-account-continuous-backup-resource-model.md)
- [In-account restore introduction](restore-in-account-continuous-backup-introduction.md)
