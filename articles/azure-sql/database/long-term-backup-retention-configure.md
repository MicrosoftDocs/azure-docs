---
title: "Azure SQL Database: Manage long-term backup retention"
description: "Learn how to store and restore automated backups for Azure SQL Database in Azure storage (for up to 10 years) using the Azure portal and PowerShell"
services: sql-database
ms.service: sql-db-mi
ms.subservice: backup-restore
ms.custom: devx-track-azurepowershell
ms.devlang: 
ms.topic: how-to
author: SQLSourabh
ms.author: sourabha
ms.reviewer: mathoma
ms.date: 12/16/2020
---

# Manage Azure SQL Database long-term backup retention
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

With Azure SQL Database, you can set a [long-term backup retention](long-term-retention-overview.md) policy (LTR) to automatically retain backups in separate Azure Blob storage containers for up to 10 years. You can then recover a database using these backups using the Azure portal or PowerShell. Long-term retention policies are also supported for [Azure SQL Managed Instance](../managed-instance/long-term-backup-retention-configure.md).

## Using the Azure portal

The following sections show you how to use the Azure portal to set long-term retention policies, manage available long-term retention backups, and restore from an available backup.

### Configure long-term retention policies

You can configure SQL Database to [retain automated backups](long-term-retention-overview.md) for a period longer than the retention period for your service tier.

1. In the Azure portal, navigate to your server and then select **Backups**. Select the **Retention policies** tab to modify your backup retention settings.

   ![retention policies experience](./media/long-term-backup-retention-configure/ltr-policies-tab.png)

2. On the Retention policies tab, select the database(s) on which you want to set or modify long-term backup retention policies. Unselected databases will not be affected.

   ![select database to configure backup retention policies](./media/long-term-backup-retention-configure/ltr-policies-tab-configure.png)

3. In the **Configure policies** pane, specify your desired retention period for weekly, monthly, or yearly backups. Choose a retention period of '0' to indicate that no long-term backup retention should be set.

   ![configure policies pane](./media/long-term-backup-retention-configure/ltr-configure-policies.png)

4. Select **Apply** to apply the chosen retention settings to all selected databases.

> [!IMPORTANT]
> When you enable a long-term backup retention policy, it may take up to 7 days for the first backup to become visible and available to restore. For details of the LTR backup cadance, see [long-term backup retention](long-term-retention-overview.md).

### View backups and restore from a backup

View the backups that are retained for a specific database with an LTR policy, and restore from those backups.

1. In the Azure portal, navigate to your server and then select **Backups**. To view the available LTR backups for a specific database, select **Manage** under the Available LTR backups column. A pane will appear with a list of the available LTR backups for the selected database.

   ![available backups experience](./media/long-term-backup-retention-configure/ltr-available-backups-tab.png)

1. In the **Available LTR backups** pane that appears, review the available backups. You may select a backup to restore from or to delete.

   ![view available LTR backups](./media/long-term-backup-retention-configure/ltr-available-backups-manage.png)

1. To restore from an available LTR backup, select the backup from which you want to restore, and then select **Restore**.

   ![restore from available LTR backup](./media/long-term-backup-retention-configure/ltr-available-backups-restore.png)

1. Choose a name for your new database, then select **Review + Create** to review the details of your Restore. Select **Create** to restore your database from the chosen backup.

   ![configure restore details](./media/long-term-backup-retention-configure/restore-ltr.png)

1. On the toolbar, select the notification icon to view the status of the restore job.

   ![restore job progress](./media/long-term-backup-retention-configure/restore-job-progress-long-term.png)

1. When the restore job is completed, open the **SQL databases** page to view the newly restored database.

> [!NOTE]
> From here, you can connect to the restored database using SQL Server Management Studio to perform needed tasks, such as to [extract a bit of data from the restored database to copy into the existing database or to delete the existing database and rename the restored database to the existing database name](recovery-using-backups.md#point-in-time-restore).

## Using PowerShell

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

> [!IMPORTANT]
> The PowerShell Azure Resource Manager module is still supported by Azure SQL Database, but all future development is for the Az.Sql module. For these cmdlets, see [AzureRM.Sql](/powershell/module/AzureRM.Sql/). The arguments for the commands in the Az module and in the AzureRm modules are substantially identical.

The following sections show you how to use PowerShell to configure the long-term backup retention, view backups in Azure storage, and restore from a backup in Azure storage.

### Azure roles to manage long-term retention

For **Get-AzSqlDatabaseLongTermRetentionBackup** and **Restore-AzSqlDatabase**, you will need to have one of the following roles:

- Subscription Owner role or
- SQL Server Contributor role or
- Custom role with the following permissions:

   Microsoft.Sql/locations/longTermRetentionBackups/read
   Microsoft.Sql/locations/longTermRetentionServers/longTermRetentionBackups/read
   Microsoft.Sql/locations/longTermRetentionServers/longTermRetentionDatabases/longTermRetentionBackups/read

For **Remove-AzSqlDatabaseLongTermRetentionBackup**, you will need to have one of the following roles:

- Subscription Owner role or
- Custom role with the following permission:

   Microsoft.Sql/locations/longTermRetentionServers/longTermRetentionDatabases/longTermRetentionBackups/delete

> [!NOTE]
> The SQL Server Contributor role does not have permission to delete LTR backups.

Azure RBAC permissions could be granted in either *subscription* or *resource group* scope. However, to access LTR backups that belong to a dropped server, the permission must be granted in the *subscription* scope of that server.

- Microsoft.Sql/locations/longTermRetentionServers/longTermRetentionDatabases/longTermRetentionBackups/delete

### Create an LTR policy

```powershell
# get the SQL server
$subId = "<subscriptionId>"
$serverName = "<serverName>"
$resourceGroup = "<resourceGroupName>"
$dbName = "<databaseName>"

Connect-AzAccount
Select-AzSubscription -SubscriptionId $subId

$server = Get-AzSqlServer -ServerName $serverName -ResourceGroupName $resourceGroup

# create LTR policy with WeeklyRetention = 12 weeks. MonthlyRetention and YearlyRetention = 0 by default.
Set-AzSqlDatabaseBackupLongTermRetentionPolicy -ServerName $serverName -DatabaseName $dbName `
    -ResourceGroupName $resourceGroup -WeeklyRetention P12W

# create LTR policy with WeeklyRetention = 12 weeks, YearlyRetention = 5 years and WeekOfYear = 16 (week of April 15). MonthlyRetention = 0 by default.
Set-AzSqlDatabaseBackupLongTermRetentionPolicy -ServerName $serverName -DatabaseName $dbName `
    -ResourceGroupName $resourceGroup -WeeklyRetention P12W -YearlyRetention P5Y -WeekOfYear 16
```

### View LTR policies

This example shows how to list the LTR policies within a server

```powershell
# get all LTR policies within a server
$ltrPolicies = Get-AzSqlDatabase -ResourceGroupName $resourceGroup -ServerName $serverName | `
    Get-AzSqlDatabaseLongTermRetentionPolicy

# get the LTR policy of a specific database
$ltrPolicies = Get-AzSqlDatabaseBackupLongTermRetentionPolicy -ServerName $serverName -DatabaseName $dbName `
    -ResourceGroupName $resourceGroup
```

### Clear an LTR policy

This example shows how to clear an LTR policy from a database

```powershell
Set-AzSqlDatabaseBackupLongTermRetentionPolicy -ServerName $serverName -DatabaseName $dbName `
    -ResourceGroupName $resourceGroup -RemovePolicy
```

### View LTR backups

This example shows how to list the LTR backups within a server.

```powershell
# get the list of all LTR backups in a specific Azure region
# backups are grouped by the logical database id, within each group they are ordered by the timestamp, the earliest backup first
$ltrBackups = Get-AzSqlDatabaseLongTermRetentionBackup -Location $server.Location

# get the list of LTR backups from the Azure region under the named server
$ltrBackups = Get-AzSqlDatabaseLongTermRetentionBackup -Location $server.Location -ServerName $serverName

# get the LTR backups for a specific database from the Azure region under the named server
$ltrBackups = Get-AzSqlDatabaseLongTermRetentionBackup -Location $server.Location -ServerName $serverName -DatabaseName $dbName

# list LTR backups only from live databases (you have option to choose All/Live/Deleted)
$ltrBackups = Get-AzSqlDatabaseLongTermRetentionBackup -Location $server.Location -DatabaseState Live

# only list the latest LTR backup for each database
$ltrBackups = Get-AzSqlDatabaseLongTermRetentionBackup -Location $server.Location -ServerName $serverName -OnlyLatestPerDatabase
```

### Delete LTR backups

This example shows how to delete an LTR backup from the list of backups.

```powershell
# remove the earliest backup
$ltrBackup = $ltrBackups[0]
Remove-AzSqlDatabaseLongTermRetentionBackup -ResourceId $ltrBackup.ResourceId
```

> [!IMPORTANT]
> Deleting LTR backup is non-reversible. To delete an LTR backup after the server has been deleted you must have Subscription scope permission. You can set up notifications about each delete in Azure Monitor by filtering for operation 'Deletes a long term retention backup'. The activity log contains information on who and when made the request. See [Create activity log alerts](../../azure-monitor/alerts/alerts-activity-log.md) for detailed instructions.

### Restore from LTR backups

This example shows how to restore from an LTR backup. Note, this interface did not change but the resource ID parameter now requires the LTR backup resource ID.

```powershell
# restore a specific LTR backup as an P1 database on the server $serverName of the resource group $resourceGroup
Restore-AzSqlDatabase -FromLongTermRetentionBackup -ResourceId $ltrBackup.ResourceId -ServerName $serverName -ResourceGroupName $resourceGroup `
    -TargetDatabaseName $dbName -ServiceObjectiveName P1
```

> [!IMPORTANT]
> To restore from an LTR backup after the server or resource group has been deleted, you must have permissions scoped to the server's subscription and that subscription must be active. You must also omit the optional -ResourceGroupName parameter.

> [!NOTE]
> From here, you can connect to the restored database using SQL Server Management Studio to perform needed tasks, such as to extract a bit of data from the restored database to copy into the existing database or to delete the existing database and rename the restored database to the existing database name. See [point in time restore](recovery-using-backups.md#point-in-time-restore).

## Limitations
- When restoring from an LTR backup, the read scale property is disabled. To enable, read scale on the restored database, update the database after it has been created.
- You need to specify the target service level objective, when restoring from a LTR backup, which was created when the database was in an elastic pool. 

## Next steps

- To learn about service-generated automatic backups, see [automatic backups](automated-backups-overview.md)
- To learn about long-term backup retention, see [long-term backup retention](long-term-retention-overview.md)
