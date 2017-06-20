---
title: Storing Azure SQL Database Backups for up to 10 years | Microsoft Docs
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
# Storing Azure SQL Database Backups for up to 10 years
Many applications have regulatory, compliance, or other business purposes that require you to retain the automatic full database backups beyond the 7-35 days provided by SQL Database's [automatic backups](sql-database-automated-backups.md). The **Long-Term Backup Retention** feature enables you to store your Azure SQL Database backups in an Azure Recovery Services vault for up to 10 years. You can store up to 1000 databases per vault. You can select any backup in the vault to restore it as a new database.

> [!IMPORTANT]
> Long-Term Backup Retention is currently in preview and available in the following regions: Australia East, Australia Southeast, Brazil South, Central US, East Asia, East US, East US 2, India Central, India South, Japan East, Japan West, North Central US, North Europe, South Central US, Southeast Asia, West Europe, and West US.
>

> [!NOTE]
> You can enable up to 200 databases per vault during a 24-hour period. Therefore, we recommend that you use a separate vault for each server to minimize the impact of this limit. 
> 



 
## How does SQL Database long-term backup retention work?

Long-term backup retention of backups allows you to associate an Azure SQL Database server with an Azure Recovery Services vault. 

* The vault must be created in the same Azure subscription that created the SQL server and in the same geographic region and resource group. 
* You then configure a retention policy for any database. The policy causes the weekly full database backups be copied to the Recovery Services vault and retained for the specified retention period (up to 10 years). 
* You can then restore from any of these backups to a new database in any server in the subscription. The copy is performed by Azure storage from existing backups and has no performance impact on the existing database.

> [!TIP]
> For a how-to guide, see [Configure and restore from Azure SQL Database long-term backup retention](sql-database-long-term-backup-retention-configure.md)

## How do I enable long-term backup retention?

To configure long-term backup retention for a database:

1. Create an Azure Recovery Services vault in the same region, subscription, and resource group as your SQL Database server. 
2. Register the server to the vault
3. Create an Azure Recovery Services Protection Policy
4. Apply the protection policy to the databases that require long-term backup retention

### Azure portal

To configure, manage, and restore from long-term backup retention of automated backups in an Azure Recovery Services vault using the Azure portal, click **Long-term backup retention**, select a database, and then click **Configure**. 

   ![select database for long-term backup retention](./media/sql-database-get-started-backup-recovery/select-database-for-long-term-backup-retention.png)

To configure, manage, and restore from long-term backup retention of automated backups in an Azure Recovery Services vault using PowerShell, see [Configure and restore from Azure SQL Database long-term backup retention](sql-database-long-term-backup-retention-configure.md).

## How do I restore a database stored with the long-term backup retention feature?

To recover from a long-term backup retention backup:

1. List the vault where the backup is stored
2. List the container that is mapped to your logical server
3. List the data source within the vault that is mapped to your database
4. List the recovery points available to restore
5. Restore from the recovery point to the target server within your subscription

To configure, manage, and restore from long-term backup retention of automated backups in an Azure Recovery Services vault using the Azure portal, see [Manage long-term backup retention usihg the Azure portal](sql-database-long-term-backup-retention-configure.md). To configure, manage, and restore from long-term backup retention of automated backups in an Azure Recovery Services vault using PowerShell, see [Manage long-term backup retention usihg PowerShell](sql-database-long-term-backup-retention-configure.md).

## How much does long-term backup retention cost?

Long-term backup retention of an Azure SQL database is charged according to the [Azure backup services pricing rates](https://azure.microsoft.com/pricing/details/backup/).

After the Azure SQL Database server is registered to the vault, you are charged for the total storage that is used by the weekly backups stored in the vault.

## View available backups stored in long-term backup retention

To configure, manage, and restore from long-term backup retention of automated backups in an Azure Recovery Services vault using the Azure portal, see [Manage long-term backup retention using the Azure portal](sql-database-long-term-backup-retention-configure.md). To configure, manage, and restore from long-term backup retention of automated backups in an Azure Recovery Services vault using PowerShell, see [Manage long-term backup retention using PowerShell](sql-database-long-term-backup-retention-configure.md).

## Disabling Long-term Retention

The Recovery Service automatically handles cleanup of backups based on the provided retention policy. 

* To stop sending the backups for a specific database to the vault, remove the retention policy for that database.
  
    ```
    Set-AzureRmSqlDatabaseBackupLongTermRetentionPolicy -ResourceGroupName 'RG1' -ServerName 'Server1' -DatabaseName 'DB1' -State 'Disabled' -ResourceId $policy.Id
    ```

> [!NOTE]
> The backups already in the vault are not be impacted. They are automatically deleted by the Recovery Service when their retention period expires.

## Removing long-term backup retention backups from the Azure Recovery Services vault

To remove long-term backup retention backups from the vault, see [Delete long-term backup retention backups](sql-database-long-term-backup-retention-configure.md)

## Long-term backup retention FAQ:

1. Q: Can I manually delete specific backups in the vault?

    A: Not currently. The vault automatically cleans up backups when the retention period has expired.
2. Q: Can I register my server to store Backups to more than one vault?

    A: No, today you can only store backups to one vault at a time.
3. Q: Can I have a vault and server in different subscriptions?

    A: No, currently the vault and server must be in both the same subscription and resource group.
4. Q: Can I use a vault I created in a different region than my server’s region?

    A: No, the vault and server must be in the same region to minimize the copy time and avoid the traffic charges.
5. Q: How many databases can I store in one vault?

    A: Currently, we only support up to 1000 databases per vault. 
6. Q. How many vaults can I create per subscription?

    A. You can create up to 25 vaults per subscription.
7. Q. How many databases can I configure per day per vault?

    A. You can only set up 200 databases per day per vault.
8. Q: Does long-term backup retention work with elastic pools?

    A: Yes. Any database in the pool can be configured with the retention policy.
9. Q: Can I choose the time at which the backup is created?

    A: No, SQL Database controls the backups schedule to minimize the performance impact on your databases.
10. Q: I have TDE enabled for my database. Can I use TDE with the vault? 

    A. Yes, TDE is supported. You can restore the database from the vault even if the original database no longer exists.
11. Q. What happens with the backups in the vault if my subscription is suspended? 

    A. If your subscription is suspended, we retain the existing databases and backups. New backups are not being copied to the vault. After you reactivate the subscription, the service resumes copying backups to the vault. Your vault becomes accessible to the restore operations using the backups that had been copied there before the subscription was suspended. 
12. Q: Can I get access to the SQL Database backup files so I can download / restore to SQL Server?

    A: No, not currently.
13. Q: Is it possible to have multiple Schedules (Daily, Weekly, Monthly, Yearly) within a SQL Retention Policy.

    A: No, this is currently only available for virtual machine backups.
14. Q. What if we set up long-term backup retention on a database that is an active geo-replication secondary?

    A: Currently we don't take backups on replicas, and therefore, there is no option for long-term backup retention on secondaries. However, it is important for a customer to set up long-term backup retention on an active geo-replication secondary for these reasons:
    - When a failover happens and the database becomes a primary, we take a full backup and this full backup is uploaded to vault.
    - There is no extra cost to the customer for setting up long-term backup retention on a secondary.



## Next steps
Database backups are an essential part of any business continuity and disaster recovery strategy because they protect your data from accidental corruption or deletion. To learn about the other Azure SQL Database business continuity solutions, see [Business continuity overview](sql-database-business-continuity.md).

