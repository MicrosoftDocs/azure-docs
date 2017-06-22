---
title: Store Azure SQL Database backups for up to 10 years | Microsoft Docs
description: Learn how Azure SQL Database supports storing backups for up to 10 years.
keywords: ''
services: sql-database
documentationcenter: ''
author: anosov1960
manager: jhubbard
editor: ''

ms.assetid: 66fdb8b8-5903-4d3a-802e-af08d204566e
ms.service: sql-database
ms.custom: business continuity
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 12/22/2016
ms.author: sashan

---
# Store Azure SQL Database backups for up to 10 years
Many applications have regulatory, compliance, or other business purposes that require you to retain automatic full database backups beyond the 7-35 days provided by Azure SQL Database [automatic backups](sql-database-automated-backups.md). By using the long-term backup retention feature, you can store your SQL database backups in an Azure Recovery Services vault for up to 10 years. You can store up to 1,000 databases per vault. You can select any backup in the vault to restore it as a new database.

> [!IMPORTANT]
> Long-term backup retention is currently in preview and available in the following regions: Australia East, Australia Southeast, Brazil South, Central US, East Asia, East US, East US 2, India Central, India South, Japan East, Japan West, North Central US, North Europe, South Central US, Southeast Asia, West Europe, and West US.
>

> [!NOTE]
> You can enable up to 200 databases per vault during a 24-hour period. We recommend that you use a separate vault for each server to minimize the impact of this limit. 
> 

## How SQL Database long-term backup retention works

With long-term backup retention, you can associate a SQL database server with an Azure Recovery Services vault. 

* You must create the vault in the same Azure subscription that created the SQL server and in the same geographic region and resource group. 
* You then configure a retention policy for any database. The policy causes the weekly full database backups to be copied to the Recovery Services vault and retained for the specified retention period (up to 10 years). 
* You can then restore the database from any of these backups to a new database in any server in the subscription. Azure storage creates a copy from existing backups, and the copy has no performance impact on the existing database.

> [!TIP]
> For a how-to guide, see [Configure and restore from Azure SQL Database long-term backup retention](sql-database-long-term-backup-retention-configure.md).

## Enable long-term backup retention

To configure long-term backup retention for a database:

1. Create an Azure Recovery Services vault in the same region, subscription, and resource group as your SQL database server. 
2. Register the server to the vault.
3. Create an Azure Recovery Services protection policy.
4. Apply the protection policy to the databases that require long-term backup retention.

To configure, manage, and restore a database from long-term backup retention of automated backups in an Azure Recovery Services vault, do either of the following:

* Using the Azure portal: Click **Long-term backup retention**, select a database, and then click **Configure**. 

   ![Select a database for long-term backup retention](./media/sql-database-get-started-backup-recovery/select-database-for-long-term-backup-retention.png)

* Using PowerShell: Go to [Configure and restore from Azure SQL Database long-term backup retention](sql-database-long-term-backup-retention-configure.md).

## Restore a database that's stored with the long-term backup retention feature

To recover from a long-term backup retention backup:

1. List the vault where the backup is stored.
2. List the container that is mapped to your logical server.
3. List the data source within the vault that is mapped to your database.
4. List the recovery points that are available to restore.
5. Restore the database from the recovery point to the target server within your subscription.

To configure, manage, and restore a database from long-term backup retention of automated backups in an Azure Recovery Services vault, do either of the following:

* Using the Azure portal: Go to [Manage long-term backup retention using the Azure portal](sql-database-long-term-backup-retention-configure.md). 

* Using PowerShell: Go to [Manage long-term backup retention using PowerShell](sql-database-long-term-backup-retention-configure.md).

## Get pricing for long-term backup retention

Long-term backup retention of a SQL database is charged according to the [Azure backup services pricing rates](https://azure.microsoft.com/pricing/details/backup/).

After the SQL database server is registered to the vault, you are charged for the total storage that's used by the weekly backups stored in the vault.

## View available backups that are stored in long-term backup retention

To configure, manage, and restore a database from long-term backup retention of automated backups in an Azure Recovery Services vault by using the Azure portal, do either of the following:

* Using the Azure portal: Go to [Manage long-term backup retention using the Azure portal](sql-database-long-term-backup-retention-configure.md). 

* Using PowerShell: Go to [Manage long-term backup retention using PowerShell](sql-database-long-term-backup-retention-configure.md).

## Disable long-term retention

The recovery service automatically handles the cleanup of backups based on the provided retention policy. 

To stop sending the backups for a specific database to the vault, remove the retention policy for that database.
  
```
Set-AzureRmSqlDatabaseBackupLongTermRetentionPolicy -ResourceGroupName 'RG1' -ServerName 'Server1' -DatabaseName 'DB1' -State 'Disabled' -ResourceId $policy.Id
```

> [!NOTE]
> The backups that are already in the vault are unaffected. They are automatically deleted by the recovery service when their retention period expires.

## Long-term backup retention FAQ

**Can I manually delete specific backups in the vault?**

Not currently. The vault automatically cleans up backups when the retention period has expired.

**Can I register my server to store backups to more than one vault?**

No, you can currently store backups to only one vault at a time.

**Can I have a vault and server in different subscriptions?**

No, currently the vault and server must be in the same subscription and resource group.

**Can I use a vault that I created in a region that's different from my server’s region?**

No, the vault and server must be in the same region to minimize copy time and avoid traffic charges.

**How many databases can I store in one vault?**

Currently, we support up to 1,000 databases per vault. 

**How many vaults can I create per subscription?**

You can create up to 25 vaults per subscription.

**How many databases can I configure per day per vault?**

You can set up 200 databases per day per vault.

**Does long-term backup retention work with elastic pools?**

Yes. Any database in the pool can be configured with the retention policy.

**Can I choose the time at which the backup is created?**

No, SQL Database controls the backup schedule to minimize the performance impact on your databases.

**I have transparent data encryption enabled for my database. Can I use it with the vault?** 

Yes, transparent data encryption is supported. You can restore the database from the vault even if the original database no longer exists.

**What happens with the backups in the vault if my subscription is suspended?** 

If your subscription is suspended, we retain the existing databases and backups. New backups are not copied to the vault. After you reactivate the subscription, the service resumes copying backups to the vault. Your vault becomes accessible to the restore operations by using the backups that were copied there before the subscription was suspended. 

**Can I get access to the SQL database backup files so I can download or restore them to the SQL server?**

No, not currently.

**Is it possible to have multiple schedules (daily, weekly, monthly, yearly) within a SQL retention policy.**

No, multiple schedules are currently available only for virtual machine backups.

**What if we set up long-term backup retention on a database that is an active geo-replication secondary database?**

Because we don't take backups on replicas, there is currently no option for long-term backup retention on secondary databases. However, it is important for users to set up long-term backup retention on an active geo-replication secondary database for these reasons:
* When a failover happens and the database becomes a primary database, we take a full backup, which is uploaded to vault.
* There is no extra cost to the customer for setting up long-term backup retention on a secondary database.

## Next steps
Because database backups protect data from accidental corruption or deletion, they're an essential part of any business continuity and disaster recovery strategy. To learn about the other SQL Database business-continuity solutions, see [Business continuity overview](sql-database-business-continuity.md).
