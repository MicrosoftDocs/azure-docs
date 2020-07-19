---
title: "Azure SQL Managed Instance: Long-term backup retention (PowerShell)"
description: "Learn how to store and restore automated backups on separate Azure Blob storage containers for an Azure SQL Managed Instance using PowerShell."
services: sql-database
ms.service: sql-managed-instance
ms.subservice: operations
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: anosov1960
ms.author: sashan
ms.reviewer: mathoma, carlrab
ms.date: 04/29/2020
---
# Manage Azure SQL Managed Instance long-term backup retention (PowerShell)
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

In Azure SQL Managed Instance, you can configure a [long-term backup retention](../database/long-term-retention-overview.md#sql-managed-instance-support) policy (LTR) as a limited public preview feature. This allows you to to automatically retain database backups in separate Azure Blob storage containers for up to 10 years. You can then recover a database using these backups with PowerShell.

   > [!IMPORTANT]
   > LTR for managed instances is currently in limited preview and available for EA and CSP subscriptions on a case by case basis. To request enrollment, please create an [Azure support ticket](https://azure.microsoft.com/support/create-ticket/). For issue type select technical issue, for service choose SQL Database Managed Instance and for the problem type select **Backup, Restore, and Business Continuity/Long-term backup retention**. In your request, please state you would like to be enrolled in the limited public preview of LTR for managed instance.

The following sections show you how to use PowerShell to configure the long-term backup retention, view backups in Azure SQL storage, and restore from a backup in Azure SQL storage.

## RBAC roles to manage long-term retention

For **Get-AzSqlInstanceDatabaseLongTermRetentionBackup** and **Restore-AzSqlInstanceDatabase**, you will need to have one of the following roles:

- Subscription Owner role or
- Managed Instance Contributor role or
- Custom role with the following permissions:
  - `Microsoft.Sql/locations/longTermRetentionManagedInstanceBackups/read`
  - `Microsoft.Sql/locations/longTermRetentionManagedInstances/longTermRetentionManagedInstanceBackups/read`
  - `Microsoft.Sql/locations/longTermRetentionManagedInstances/longTermRetentionDatabases/longTermRetentionManagedInstanceBackups/read`

For **Remove-AzSqlInstanceDatabaseLongTermRetentionBackup**, you will need to have one of the following roles:

- Subscription Owner role or
- Custom role with the following permission:
  - `Microsoft.Sql/locations/longTermRetentionManagedInstances/longTermRetentionDatabases/longTermRetentionManagedInstanceBackups/delete`

> [!NOTE]
> The Managed Instance Contributor role does not have permission to delete LTR backups.

RBAC permissions could be granted in either *subscription* or *resource group* scope. However, to access LTR backups that belong to a dropped instance, the permission must be granted in the *subscription* scope of that instance.

- `Microsoft.Sql/locations/longTermRetentionManagedInstances/longTermRetentionDatabases/longTermRetentionManagedInstanceBackups/delete`

## Create an LTR policy

```powershell
# get the Managed Instance
$subId = "<subscriptionId>"
$instanceName = "<instanceName>"
$resourceGroup = "<resourceGroupName>"
$dbName = "<databaseName>"

Connect-AzAccount
Select-AzSubscription -SubscriptionId $subId

$instance = Get-AzSqlInstance -Name $instanceName -ResourceGroupName $resourceGroup

# create LTR policy with WeeklyRetention = 12 weeks. MonthlyRetention and YearlyRetention = 0 by default.
Set-AzSqlInstanceDatabaseBackupLongTermRetentionPolicy -InstanceName $instanceName `
   -DatabaseName $dbName -ResourceGroupName $resourceGroup -WeeklyRetention P12W

# create LTR policy with WeeklyRetention = 12 weeks, YearlyRetention = 5 years and WeekOfYear = 16 (week of April 15). MonthlyRetention = 0 by default.
Set-AzSqlInstanceDatabaseBackupLongTermRetentionPolicy -InstanceName $instanceName `
    -DatabaseName $dbName -ResourceGroupName $resourceGroup -WeeklyRetention P12W -YearlyRetention P5Y -WeekOfYear 16
```

## View LTR policies

This example shows how to list the LTR policies within an instance

```powershell
# gets the current version of LTR policy for the database
$ltrPolicies = Get-AzSqlInstanceDatabaseBackupLongTermRetentionPolicy -InstanceName $instanceName `
    -DatabaseName $dbName -ResourceGroupName $resourceGroup
```

## Clear an LTR policy

This example shows how to clear an LTR policy from a database

```powershell
Set-AzSqlInstanceDatabaseBackupLongTermRetentionPolicy -InstanceName $instanceName `
   -DatabaseName $dbName -ResourceGroupName $resourceGroup -RemovePolicy
```

## View LTR backups

This example shows how to list the LTR backups within an instance.

```powershell
# get the list of all LTR backups in a specific Azure region
# backups are grouped by the logical database id, within each group they are ordered by the timestamp, the earliest backup first
$ltrBackups = Get-AzSqlInstanceDatabaseLongTermRetentionBackup -Location $instance.Location

# get the list of LTR backups from the Azure region under the given managed instance
$ltrBackups = Get-AzSqlInstanceDatabaseLongTermRetentionBackup -Location $instance.Location -InstanceName $instanceName

# get the LTR backups for a specific database from the Azure region under the given managed instance
$ltrBackups = Get-AzSqlInstanceDatabaseLongTermRetentionBackup -Location $instance.Location -InstanceName $instanceName -DatabaseName $dbName

# list LTR backups only from live databases (you have option to choose All/Live/Deleted)
$ltrBackups = Get-AzSqlInstanceDatabaseLongTermRetentionBackup -Location $instance.Location -DatabaseState Live

# only list the latest LTR backup for each database
$ltrBackups = Get-AzSqlInstanceDatabaseLongTermRetentionBackup -Location $instance.Location -InstanceName $instanceName -OnlyLatestPerDatabase
```

## Delete LTR backups

This example shows how to delete an LTR backup from the list of backups.

```powershell
# remove the earliest backup
$ltrBackup = $ltrBackups[0]
Remove-AzSqlInstanceDatabaseLongTermRetentionBackup -ResourceId $ltrBackup.ResourceId
```

> [!IMPORTANT]
> Deleting LTR backup is non-reversible. To delete an LTR backup after the instance has been deleted you must have Subscription scope permission. You can set up notifications about each delete in Azure Monitor by filtering for operation 'Deletes a long term retention backup'. The activity log contains information on who and when made the request. See [Create activity log alerts](../../azure-monitor/platform/alerts-activity-log.md) for detailed instructions.

## Restore from LTR backups

This example shows how to restore from an LTR backup. Note, this interface did not change but the resource id parameter now requires the LTR backup resource id.

```powershell
# restore a specific LTR backup as an P1 database on the instance $instanceName of the resource group $resourceGroup
Restore-AzSqlInstanceDatabase -FromLongTermRetentionBackup -ResourceId $ltrBackup.ResourceId `
   -TargetInstanceName $instanceName -TargetResourceGroupName $resourceGroup -TargetInstanceDatabaseName $dbName
```

> [!IMPORTANT]
> To restore from an LTR backup after the instance has been deleted, you must have permissions scoped to the subscription of the instance and that subscription must be active. You must also omit the optional -ResourceGroupName parameter.

> [!NOTE]
> From here, you can connect to the restored database using SQL Server Management Studio to perform needed tasks, such as to extract a bit of data from the restored database to copy into the existing database or to delete the existing database and rename the restored database to the existing database name. See [point in time restore](../database/recovery-using-backups.md#point-in-time-restore).

## Next steps

- To learn about service-generated automatic backups, see [automatic backups](../database/automated-backups-overview.md)
- To learn about long-term backup retention, see [long-term backup retention](../database/long-term-retention-overview.md)
