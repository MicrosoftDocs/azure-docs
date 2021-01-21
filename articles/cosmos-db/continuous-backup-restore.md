---
title: 
description: 
author: kanshiG
ms.service: cosmos-db
ms.topic: how-to
ms.date: 01/31/2021
ms.author: govindk
ms.reviewer: sngun

---

# Configure your Azure Cosmos DB data with continuous backup and point in time restore

Azure Cosmos DB’s Point-in-time restore feature helps in multiple scenarios such as the following:

* To recover from an accidental write or delete operations within a container.
* To restore an account to a previous point in time where a certain container or a database existed before the unintentional delete of the data.
* To restore the account in a read region where account exists to allow extraction of data into different account.

Azure Cosmos DB performs data backup in the background without consuming any additional provisioned throughput (RUs) or affecting the performance and availability of your database. Continuous backups are taken in every region where account exists. The following image shows how an Azure Cosmos container with write region in West US, read regions in East and East US 2 is backed up to a remote Azure Blob Storage account in the respective regions. By default, each region stores the backup in Locally Redundant Storage (LRS) accounts. If the region has [Availability zones](high-availability.md#availability-zone-support) enabled  then the backup is stored in Zone-Redundant Storage (ZRS) accounts.

:::image type="content" source="./media/continuous-backup-restore/continuous-backup-restore-blob-storage.png" alt-text="Azure Cosmos DB data backup to the Azure Blob Storage" border="false":::

The available window for restore (also known as retention period) is the lower value of the following two: “30 days back in past from now” or "up to the resource creation time". The point in time for restore can be any timestamp within the retention period.

For example, assume a developer or an application either updates or deletes data accidentally in a container. With the point-in-time restore feature, restoring that container or database to any point in time in the last 30 days is possible. Or you can get another copy of account in one of the existing regions for the account from last 30 days. Or if you found a container was dropped and want to create a new account with that container from a specific time in last 30 days, you can do so with point-in-time restore.

> [!NOTE]
> Currently the point-in-time restore feature is in public preview and it's available for Azure Cosmos DB API for MongoDB, and SQL accounts.

In public preview you can restore a SQL API or MongoDB API Azure Cosmos DB account contents to a point in time to another account using the Azure Portal, the Azure Command Line Interface (az cli) , Azure PowerShell, or the Azure ARM.  

## What is backed up and restored?

In a steady state, all mutations performed on the source account (which includes databases, containers, and items) are backed up asynchronously within ~100 seconds. If the backup media (that is Azure storage) is down or unavailable, the mutations are persisted locally until the media is available back and then they are flushed out to prevent any loss in fidelity of operations that can be restored. 

You can choose to restore any combination of provisioned throughput container/s, shared throughput database or the entire account. The restore action restores all data and index properties into a new account. The restore process ensures that all the data restored in an account, database, or a container is guaranteed to be consistent up to the restore time specified.

> [!NOTE]
> With the continuous backup mode, the backups are taken in every region where your Azure Cosmos DB account is available. Backups taken for each region account are Locally redundant by default and Zone redundant if your account has availability zone feature enabled for that region.

## What is not restored?

The following configurations aren’t restored after the point-in-time recovery:

* Firewall, VNET, private endpoint settings.
* Consistency settings.
* Regions.
* Stored procedures, triggers, UDFs.

You can add these configurations to the restored account after the restore is completed.

## Resource model

A new property in the account level backup policy named "BackupMode" enables continuous backup and point-in-time restore functionalities. This mode is called **continuous backup**. In the public preview, you can only set this mode when creating the account. After it’s enabled, all the containers and databases created within this account will have continuous backup and point-in-time restore functionalities enabled by default.

```json
DatabaseAccountResource
{
.
.
BackupPolicy
{
BackupMode: {Continous, Periodic}
ContinousModeProperties:{} 
PeriodicModeProperties 
{
RetentionPeriod:
Interval:
}
}
.
.
}
```

> [!NOTE]
> In the public preview release, after you create an account with continuous mode you can’t switch it to a legacy periodic mode.

## Configure continuous backup with Azure portal

### Provision an account with continuous backup

When creating a new Azure Cosmos DB account, for the **Backup policy** option, choose **continuous** mode to enable the point in time restore functionality for the new account. After this feature is enabled for the account, all the databases and containers are available for continuous backup. With the point-in-time restore, data is always restored to a new account, currently you can’t restore to an existing account.

:::image type="content" source="./media//.png" alt-text="Provision an Azure Cosmos DB account with continuous backup configuration" border="false":::

After choosing the option, you can validate the summary after validation with Backup policy as continuous.

## Restore a live account

You can use Azure portal to restore an entire live account or selected databases and containers under it. The restore time should be within the last 30 days or after the resource creation time. Use the following steps to restore your data:

1. Sign into the [Azure portal](https://portal.azure.com/)
2. Navigate to your Azure Cosmos DB account and open the **Point In Time Restore** pane.

   > [!NOTE]
   > The restore pane in Azure portal is only populated if you have the `Microsoft.DocumentDB/locations/restorableDatabaseAccounts/*/read` permission.

3. You need to fill the following details to restore:

   * Source account name

   * **Restore Point (UTC)** – A timestamp within the last 30 days. The account should exist at that timestamp. You can specify the restore point in UTC or a different time zone specific format. It can be as close to the second when you want to restore it.  Select the **Click here** link to get help on identifying the restore point.

   * **Location** – The region where the restore happens. The account should exist in this region at the given timestamp. An account can be restored only to the regions in which the source account existed.

   * **Restore Resource** – You can either choose **Entire account** or a **selected database/container** to restore. The databases and containers should exist at the given timestamp. Based on the restore point and location selected, restore resources are populated, which allows user to select specific databases or containers that need to be restored.

   * **Resource group** - Resource group under which the target account will be created and restored. This must be an existing resource group.

   * **Restore Target Account** – The target account name. This account will be created by the restore process in the same region where your source account exists.

:::image type="content" source="./media//.png" alt-text="Restore a live account" border="false":::