---
title: SQL Database managed instance - point-in-time restore | Microsoft Docs
description: How to restore a database in SQL managed instance to a previous point in time.
services: sql-database
ms.service: sql-database
ms.subservice: managed-instance
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: jovanpop-msft
ms.author: jovanpop
ms.reviewer: sstein, carlrab
ms.date: 08/25/2019
---
# Restore a SQL managed instance database to a previous point in time

Point-in-time restore (PITR) enables you to create a database as a copy of another database at some point in time in the past. This article describes how to perform a point-in-time restore of a database in a managed instance.

Point-in-time restore can be used in recovery scenarios, incidents caused by errors, incorrect data load, crucial data delete, and other issues, or simply for testing or auditing purposes. Depending on your database settings, backup files are kept for period between 7 and 35 days.

Point-in-time restore can be used to:

1. Restore database from existing database
2. Restore database from deleted database

With managed instance, point-in-time restore can be used to: 

1. Restore database to the same managed instance
2. Restore database to another managed instance


> [!NOTE]
> Point-in-time restore of a whole managed instance is not possible. What is possible, and explained in this article, is point-in-time restore of a database hosted on managed instance.


## Limitations

When restoring to another managed instance, both instances must be in the same subscription and region. Cross-region and cross-subscription restore are not currently supported.

> [!WARNING]
> Be careful about storage size of your managed instance – depending on size of data restoring, you may run out of instance storage. In case you don’t have enough space for restored data, alternative approach should be used (restore from dropped database).

The following table shows point-in-time recovery scenarios for managed instance:

|           |Restore existing DB| Restore existing DB|Restore dropped DB| Restore dropped DB|
|:----------|:----------|:----------|:----------|:----------|
|Destination| Same MI|Another MI |Same MI|Another MI |
|Azure portal| Yes|No |No|No|
|Azure CLI|Yes |Yes |No|No|
|PowerShell| Yes|Yes |Yes|Yes|


## Point-in-time restore of an existing database 

This PITR scenario can be executed through Azure portal, using PowerShell command, or using Azure CLI. Database can be restored to the same or another instance. Restore to another instance is not supported through Azure portal, with PowerShell and Azure CLI it is possible using the target managed instance and target resource group properties. If no parameters for these two properties are provided, by default database is restored to existing instance.

### Azure portal

1. Launch the Azure portal at https://portal.azure.com/.
2. Find managed instance
3. Select database you want to restore
4. On database screen, click Restore action
5. On Restore screen, select date and time of point in history to which you are restoring database
6. After confirming, restore process will start and, depending on size of database, new database will be created and populated with data from the original database at the desired point in time. For duration of restore process check recovery using backups article.


### PowerShell

If you don't already have Azure PowerShell installed, see [install the Azure PowerShell module](https://docs.microsoft.com/powershell/azure/install-az-ps).

To restore database using PowerShell, update the parameters with your values and run the following command:

```powershell
$subscriptionId = "my-subscription-id" 
$resourceGroupName = "my resource group name" 
$managedInstanceName = "my managed instance name" 
$databaseName = "my source database name" 
$pointInTime = "2018-06-27T08:51:39.3882806Z" 
$targetDatabase = "name of the new database that will be created" 
 
Get-AzSubscription -SubscriptionId $subscriptionId 
Select-AzSubscription -SubscriptionId $subscriptionId 
 
Restore-AzSqlInstanceDatabase -FromPointInTimeBackup ` 
                                  -ResourceGroupName $resourceGroupName ` 
                                  -InstanceName $managedInstanceName ` 
                                  -Name $databaseName ` 
                                  -PointInTime $pointInTime ` 
                                  -TargetInstanceDatabaseName $targetDatabase `
```

In case you are restoring database to another managed instance, set target resource group name and target managed instance name.  

```powershell
$targetResourceGroupName "resource group of target managed instance" 
$targetInstanceName = "my target managed instance name" 

Restore-AzSqlInstanceDatabase -FromPointInTimeBackup ` 
                                  -ResourceGroupName $resourceGroupName ` 
                                  -InstanceName $managedInstanceName ` 
                                  -Name $databaseName ` 
                                  -PointInTime $pointInTime ` 
                                  -TargetInstanceDatabaseName $targetDatabase `
                                  -TargetResourceGroupName $targetResourceGroupName ` 
                                  -TargetInstanceName $targetInstanceName 
```

For details, see [Restore-AzSqlInstanceDatabase](https://docs.microsoft.com/powershell/module/az.sql/restore-azsqlinstancedatabase).


### Azure CLI 

Update and run the following command with your specific values: 


```console
az sql midb restore -g mygroupname --mi myinstancename -n mymanageddbname --dest-name targetmidbname --time "2018-05-20T05:34:22"
```


Note: In case you are restoring database to another managed instance, set target resource group name and target managed instance name.  

```console
az sql midb restore -g mygroupname --mi myinstancename -n mymanageddbname --dest-name targetmidbname --time "2018-05-20T05:34:22" --dest-resource-group mytargetinstancegroupname --dest-mi mytargetinstancename
```


For detailed explanation of available params follow [link](https://docs.microsoft.com/cli/azure/sql/midb?view=azure-cli-latest#az-sql-midb-restore) 

## Point-in-time restore of a deleted database 
 
This scenario can only be accomplished using PowerShell. Database can be restored to the same or another instance.
To restore a deleted database using PowerShell, update the parameters with your values and run the following command:

```powershell
$subscriptionId = "my-subscription-id" 
Get-AzSubscription -SubscriptionId $subscriptionId 
Select-AzSubscription -SubscriptionId $subscriptionId 

$resourceGroupName = "my resource group name" 
$managedInstanceName = "my managed instance name" 
$deletedDatabaseName = "my source database name" 

$deleted_db = Get-AzSqlDeletedInstanceDatabaseBackup -ResourceGroupName $resourceGroupName -InstanceName $managedInstanceName -DatabaseName $deletedDatabaseName 

$pointInTime = "2018-06-27T08:51:39.3882806Z" 
$properties = New-Object System.Object 
$properties | Add-Member -type NoteProperty -name CreateMode -Value "PointInTimeRestore" 
$properties | Add-Member -type NoteProperty -name RestorePointInTime -Value $pointInTime 
$properties | Add-Member -type NoteProperty -name RestorableDroppedDatabaseId -Value $deleted_db.Id
```



If you're restoring database to another managed instance, change the resource group name and managed instance name.
Location parameter should match location of resource group and managed instance.

```powershell
$resourceGroupName = "my second resource group name" 
$managedInstanceName = "my second managed instance name" 

$location = "West Europe" 

$restoredDBName = "WorldWideImportersPITR" 
$resource_id = "subscriptions/$subscribption/resourceGroups/$resourceGroupName/providers/Microsoft.Sql/managedInstances/$managedInstanceName/databases/$restoredDBName" 

New-AzResource -Location $location -Properties $properties -ResourceId $resource_id -ApiVersion "2017-03-01-preview" -Force
```

## Overriding existing database 
 
If you want to override existing database with restored database, the following two steps are required:

1. DROP database that you want to overwrite.
2. Rename database restored from point-in-time to match the name of overwriting one (previously dropped).


### DROP original database 
 
Database dropping can be executed using Azure portal, PowerShell, or Azure CLI.

Note: Dropping the database can also be achieved by connecting to managed instance (which will be required in step 3). Use one of the following methods to connect to your managed instance database: 

- [VM method](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-managed-instance-configure-vm)
- [Point-to-site](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-managed-instance-configure-p2s)
- [Public endpoint]( https://docs.microsoft.com/en-us/azure/sql-database/sql-database-managed-instance-public-endpoint-configure)

And drop original database by executing query:

```sql
DROP DATABASE WorldWideImporters;
```

#### Azure portal 

In the Azure portal, select the database from the managed instance (the database you did the point-in-time restore for) and click **Delete**.

#### PowerShell


```powershell
$resourceGroupName = "my resource group name"
$managedInstanceName = "my managed instance name"
$databaseName = "my source database"

Remove-AzSqlInstanceDatabase -Name $databaseName -InstanceName $managedInstanceName -ResourceGroupName $resourceGroupName
```

#### Azure CLI


```console
az sql midb delete -g mygroupname --mi myinstancename -n mymanageddbname
```


### ALTER new database name with original 


If you are not already connected, connect to database using [VM method](https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance-configure-vm), [Point-to-site](https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance-configure-p2s), or[Public endpoint](https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance-public-endpoint-configure) and execute following query to alter restored database name:


```sql
ALTER WorldWideImportersPITR MODIFY NAME = WorldWideImporters;
```









