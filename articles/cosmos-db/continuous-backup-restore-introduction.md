---
title: Continuous backup with point in time restore feature in Azure Cosmos DB
description: Azure Cosmos DB's point-in-time restore feature helps to recover data from an accidental write, delete operation, or to restore data into any region. Learn about pricing and current limitations.
author: kanshiG
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 02/01/2021
ms.author: govindk
ms.reviewer: sngun
ms.custom: references_regions

---

# Continuous backup with point-in-time restore (Preview) feature in Azure Cosmos DB
[!INCLUDE[appliesto-sql-mongodb-api](includes/appliesto-sql-mongodb-api.md)]

> [!IMPORTANT]
> The point-in-time restore feature(continuous backup mode) for Azure Cosmos DB is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Cosmos DB's point-in-time restore feature(Preview) helps in multiple scenarios such as the following:

* To recover from an accidental write or delete operation within a container.
* To restore a deleted account, database, or a container.
* To restore into any region (where backups existed) at the restore point in time.

Azure Cosmos DB performs data backup in the background without consuming any extra provisioned throughput (RUs) or affecting the performance and availability of your database. Continuous backups are taken in every region where the account exists. The following image shows how a container with write region in West US, read regions in East and East US 2 is backed up to a remote Azure Blob Storage account in the respective regions. By default, each region stores the backup in Locally Redundant storage accounts. If the region has [Availability zones](high-availability.md#availability-zone-support) enabled  then the backup is stored in Zone-Redundant storage accounts.

:::image type="content" source="./media/continuous-backup-restore-introduction/continuous-backup-restore-blob-storage.png" alt-text="Azure Cosmos DB data backup to the Azure Blob Storage." lightbox="./media/continuous-backup-restore-introduction/continuous-backup-restore-blob-storage.png" border="false":::

The available time window for restore (also known as retention period) is the lower value of the following two: *30 days back in past from now* or *up to the resource creation time*. The point in time for restore can be any timestamp within the retention period.

In public preview, you can restore the Azure Cosmos DB account for SQL API or MongoDB contents point in time to another account using [Azure portal](continuous-backup-restore-portal.md), [Azure Command Line Interface](continuous-backup-restore-command-line.md) (az CLI), [Azure PowerShell](continuous-backup-restore-powershell.md), or the [Azure Resource Manager](continuous-backup-restore-template.md).

## What is restored?

In a steady state, all mutations performed on the source account (which includes databases, containers, and items) are backed up asynchronously within 100 seconds. If the backup media (that is Azure storage) is down or unavailable, the mutations are persisted locally until the media is available back and then they are flushed out to prevent any loss in fidelity of operations that can be restored.

You can choose to restore any combination of provisioned throughput containers, shared throughput database, or the entire account. The restore action restores all data and its index properties into a new account. The restore process ensures that all the data restored in an account, database, or a container is guaranteed to be consistent up to the restore time specified. The duration of restore will depend on the amount of data that needs to be restored.

> [!NOTE]
> With the continuous backup mode, the backups are taken in every region where your Azure Cosmos DB account is available. Backups taken for each region account are Locally redundant by default and Zone redundant if your account has [availability zone](high-availability.md#availability-zone-support) feature enabled for that region. The restore action always restores data into a new account.

## What is not restored?

The following configurations aren't restored after the point-in-time recovery:

* Firewall, VNET, private endpoint settings.
* Consistency settings. By default, the account is restored with session consistency.  
* Regions.
* Stored procedures, triggers, UDFs.

You can add these configurations to the restored account after the restore is completed.

## Restore scenarios

The following are some of the key scenarios that are addressed by the point-in-time-restore feature. Scenarios [a] through [c] demonstrate how to trigger a restore if the restore timestamp is known beforehand.
However, there could be scenarios where you don't know the exact time of accidental deletion or corruption. Scenarios [d] and [e] demonstrate how to _discover_ the restore timestamp using the new event feed APIs on the restorable database or containers.

:::image type="content" source="./media/continuous-backup-restore-introduction/restorable-account-scenario.png" alt-text="Life-cycle events with timestamps for a restorable account." lightbox="./media/continuous-backup-restore-introduction/restorable-account-scenario.png" border="false":::

a. **Restore deleted account** - All the deleted accounts that you can restore are visible from the **Restore** pane. For example, if *Account A* is deleted at timestamp T3. In this case the timestamp just before T3, location, target account name, resource group, and target account name is sufficient to restore from [Azure portal](continuous-backup-restore-portal.md#restore-deleted-account), [PowerShell](continuous-backup-restore-powershell.md#trigger-restore), or [CLI](continuous-backup-restore-command-line.md#trigger-restore).  

:::image type="content" source="./media/continuous-backup-restore-introduction/restorable-container-database-scenario.png" alt-text="Life-cycle events with timestamps for a restorable database and container." lightbox="./media/continuous-backup-restore-introduction/restorable-container-database-scenario.png" border="false":::

b. **Restore data of an account in a particular region** - For example, if *Account A* exists in two regions *East US* and *West US* at timestamp T3. If you need a copy of account A in *West US*, you can do a point in time restore from [Azure portal](continuous-backup-restore-portal.md), [PowerShell](continuous-backup-restore-powershell.md#trigger-restore), or [CLI](continuous-backup-restore-command-line.md#trigger-restore) with West US as the target location.

c. **Recover from an accidental write or delete operation within a container with a known restore timestamp** - For example, if you **know** that the contents of *Container 1* within *Database 1* were modified accidentally at timestamp T3. You can do a point in time restore from [Azure portal](continuous-backup-restore-portal.md#restore-live-account), [PowerShell](continuous-backup-restore-powershell.md#trigger-restore), or [CLI](continuous-backup-restore-command-line.md#trigger-restore) into another account at timestamp T3 to recover the desired state of container.

d. **Restore an account to a previous point in time before the accidental delete of the database** - In the [Azure portal](continuous-backup-restore-portal.md#restore-live-account), you can use the event feed pane to determine when a database was deleted and find the restore time. Similarly, with [Azure CLI](continuous-backup-restore-command-line.md#trigger-restore) and [PowerShell](continuous-backup-restore-powershell.md#trigger-restore), you can discover the database deletion event by enumerating the database events feed and then trigger the restore command with the required parameters.

e. **Restore an account to a previous point in time before the accidental delete or modification of the container properties.** - In [Azure portal](continuous-backup-restore-portal.md#restore-live-account), you can use the event feed pane to determine when a container was created, modified, or deleted to find the restore time. Similarly, with [Azure CLI](continuous-backup-restore-command-line.md#trigger-restore) and [PowerShell](continuous-backup-restore-powershell.md#trigger-restore), you can discover all the container events by enumerating the container events feed and then trigger the restore command with required parameters.

## Permissions

Azure Cosmos DB allows you to isolate and restrict the restore permissions for continuous backup account to a specific role or a principal. The owner of the account can trigger a restore and assign a role to other principals to perform the restore operation. To learn more, see the [Permissions](continuous-backup-restore-permissions.md) article.

## <a id="continuous-backup-pricing"></a>Pricing

Azure Cosmos DB accounts that have continuous backup enabled will incur an additional monthly charge to *store the backup* and to *restore your data*. The restore cost is added every time the restore operation is initiated. If you configure an account with continuous backup but don't restore the data, only backup storage cost is included in your bill.

The following example is based on the price for an Azure Cosmos account deployed in a non-government region in the US. The pricing and calculation can vary depending on the region you are using, see the [Azure Cosmos DB pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/) for latest pricing information.

* All accounts enabled with continuous backup policy incur an additional monthly charge for backup storage that is calculated as follows:

  $0.20/GB * Data size in GB in account * Number of regions

* Every restore API invocation incurs a one time charge. The charge is a function of the amount of data restore and it is calculated as follows:

  $0.15/GB * Data size in GB.

For example, if you have 1-TB of data in two regions then:

* Backup storage cost is calculated as (1000 * 0.20 * 2) = $400 per month

* Restore cost is calculated as (1000 * 0.15) = $150 per restore

## Current limitations (public preview)

Currently the point in time restore functionality is in public preview and it has the following limitations:

* Only Azure Cosmos DB APIs for SQL and MongoDB are supported for continuous backup. Cassandra, Table, and Gremlin APIs are not yet supported.

* An existing account with default periodic backup policy cannot be converted to use continuous backup mode.

* Azure sovereign and Azure Government cloud regions not yet supported.

* Accounts with customer-managed keys are not supported to use continuous backup.

* Multi-regions write accounts are not supported.

* Accounts with Synapse Link enabled are not supported.

* The restored account is created in the same region where your source account exists. You can't restore an account into a region where the source account did not exist.

* The restore window is only 30 days and it cannot be changed.

* The backups are not automatically geo-disaster resistant. You have to explicitly add another region to have resiliency for the account and the backup.

* While a restore is in progress, don't modify or delete the Identity and Access Management (IAM) policies that grant the permissions for the account or change any VNET, firewall configuration.

* Azure Cosmos DB API for SQL or MongoDB accounts that create unique index after the container is created are not supported for continuous backup. Only containers that create unique index as a part of the initial container creation are supported. For MongoDB accounts, you create unique index using [extension commands](mongodb-custom-commands.md).

* The point-in-time restore functionality always restores to a new Azure Cosmos account. Restoring to an existing account is currently not supported. If you are interested in providing feedback about in-place restore, contact the Azure Cosmos DB team via your account representative or [UserVoice](https://feedback.azure.com/forums/263030-azure-cosmos-db).

* All the new APIs exposed for listing `RestorableDatabaseAccount`, `RestorableSqlDatabases`, `RestorableSqlContainer`, `RestorableMongodbDatabase`, `RestorableMongodbCollection` are subject to changes while the feature is in preview.

* After restoring, it is possible that for certain collections the consistent index may be rebuilding. You can check the status of the rebuild operation via the [IndexTransformationProgress](how-to-manage-indexing-policy.md) property.

* The restore process restores all the properties of a container including its TTL configuration. As a result, it is possible that the data restored is deleted immediately if you configured that way. In order to prevent this situation, the restore timestamp must be before the TTL properties were added into the container.

## Next steps

* Configure and manage continuous backup using [Azure portal](continuous-backup-restore-portal.md), [PowerShell](continuous-backup-restore-powershell.md), [CLI](continuous-backup-restore-command-line.md), or [Azure Resource Manager](continuous-backup-restore-template.md).
* [Manage permissions](continuous-backup-restore-permissions.md) required to restore data with continuous backup mode.
* [Resource model of continuous backup mode](continuous-backup-restore-resource-model.md)
