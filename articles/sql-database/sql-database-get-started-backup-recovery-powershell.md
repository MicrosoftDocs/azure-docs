---
title: Get Started with backup and restore of Azure SQL databases for data protection and recovery using Azure PowerShell | Microsoft Docs 
description: "This tutorial shows how to restore from automated backups to a point in time, store automated backups in the Azure Recovery Services vault, and to restore from the Azure Recovery Services vault using PowerShell"
keywords: sql database tutorial
services: sql-database
documentationcenter: ''
author: stevestein
manager: jhubbard
editor: ''

ms.assetid:
ms.service: sql-database
ms.custom: tutorial
ms.workload: data-management
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 12/10/2016
ms.author: sstein

---


# Get Started with Backup and Restore for Data Protection and Recovery using PowerShell

In this getting-started tutorial, you learn how to use Azure PowerShell to:

- View existing backups of a database
- Restore a database to a previous point in time
- Configure long-term retention of a database backup file in the Azure Recovery Services vault
- Restore a database from the Azure Recovery Services vault

**Time estimate**: This tutorial takes approximately 30 minutes to complete (assuming you have already met the prerequisites).


## Prerequisites

* You need an Azure account. You can [open a free Azure account](/pricing/free-trial/?WT.mc_id=A261C142F) or [Activate Visual Studio subscriber benefits](/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F). 

* You must be able to connect to Azure using an account that is a member of either the subscription owner or contributor role. For more information on role-based access control (RBAC), see [Getting started with access management in the Azure portal](../active-directory/role-based-access-control-what-is.md).

* You have completed the [Get started with Azure SQL Database servers, databases, and firewall rules by using the Azure portal and SQL Server Management Studio](sql-database-get-started.md) or the equivalent [PowerShell version](sql-database-get-started-powershell.md) of this tutorial. If you have not, either complete this prerequisite tutorial or execute the PowerShell script at the end of the [PowerShell version](sql-database-get-started-powershell.md) of this tutorial before continuing.


> [!TIP]
> You can perform these same tasks in a getting started tutorial by using [Azure portal](sql-database-get-started-backup-recovery.md).
>



[!INCLUDE [Start your PowerShell session](../../includes/sql-database-powershell.md)]


## View the oldest restore point from the service-generated backups of a database

In this section of the tutorial, you view information about the oldest restore point from the [service-generated automated backups](sql-database-automated-backups.md) of your database. You can restore a database to any point-in-time between teh earliest restore point, and the last available backup, which is 6 minutes before the current time. The time is returned as UTC, but the following snippets show how to work in local time.

```
# Get available restore points

$resourceGroupName = "ssteinrg12091603"
$serverName = "ssteinsrv12091603"
$databaseName = "AdventureWorksLT"

$databaseToRestore = Get-AzureRmSqlDatabase -ResourceGroupName $resourceGroupName -ServerName $serverName -DatabaseName $databaseName

$earliestRestorePoint = $databaseToRestore.EarliestRestoreDate.ToLocalTime()
$latestRestorePoint = (Get-Date).AddMinutes(-6).ToLocalTime()

Write-Host "'$databaseName' on '$serverName' can be restored to any point-in-time between '$earliestRestorePoint' thru '$latestRestorePoint'"
```



## Restore a database to a previous point in time

In this section of the tutorial, you restore the database to a new database as of a specific point in time. The **-PointInTime** parameter takes a UTC formatted time value similar to: *12/09/2016 20:00:00*. The snippet converts the local time for you.

>[!NOTE]
>You cannot change the server to which you are restoring to a specific point in time. To restore to a different server, use [Geo-Restore](sql-database-disaster-recovery.md#recover-using-geo-restore). Also, note that you can restore into an [elastic database pool](sql-database-elastic-jobs-overview.md) or to a different pricing tier. 
>

```
# Restore a database to a previous point in time

#$resourceGroupName = {resource-group-name}
#$serverName = {server-name}
$newRestoredDatabaseName = "AWLT4"
$localTimeToRestoreTo = "12/9/2016 12:00:00 PM"
$restorePointInTime = (Get-Date $localTimeToRestoreTo).ToUniversalTime()
$newDatabaseEdition = "Basic"
$newDatabaseServiceLevel = "Basic"

Write-Host "Restoring database '$databaseName' to its state at '$restorePointInTime(UTC)', to a new database named '$newRestoredDatabaseName'."

$restoredDb = Restore-AzureRmSqlDatabase -FromPointInTimeBackup -PointInTime $restorePointInTime -ResourceGroupName $resourceGroupName `
 -ServerName $serverName -TargetDatabaseName $newRestoredDatabaseName -Edition $newDatabaseEdition -ServiceObjectiveName $newDatabaseServiceLevel `
 –ResourceId $databaseToRestore.ResourceID

$restoredDb
```

> [!NOTE]
> From here, you can connect to the restored database using SQL Server Management Studio to perform needed tasks, such as to [extract a bit of data from the restored database to copy into the existing database or to delete the existing database and rename the restored database to the existing database name](sql-database-recovery-using-backups.md#point-in-time-restore).
>

## Configure long-term retention of automated backups in an Azure Recovery Services vault 

In this section of the tutorial, you [configure an Azure Recovery Services vault to retain automated backups](sql-database-long-term-retention.md) for a period longer than the retention period for your service tier. 



### Create a recovery services vault

> [!IMPORTANT]
> The vault must be located in the same region as the Azure SQL logical server, and must use the same resource group as the logical server.
>

```
#$resourceGroupName = {resource-group-name}
#$serverName = {server-name}
$serverLocation = (Get-AzureRmSqlServer -ServerName $serverName -ResourceGroupName $resourceGroupName).Location
$recoveryServiceVaultName = "{vault-name}"

$vault = New-AzureRmRecoveryServicesVault -Name $recoveryServiceVaultName -ResourceGroupName $ResourceGroupName -Location $serverLocation 
Set-AzureRmRecoveryServicesBackupProperties -BackupStorageRedundancy LocallyRedundant -Vault $vault
```

### Set your vault to the server containing the databases you want to retain


```
Set-AzureRmSqlServerBackupLongTermRetentionVault -ResourceGroupName $resourceGroupName -ServerName $serverName –ResourceId $vault.Id
```

### Create a retention policy

You can create multiple retention policies for each vault and then apply the desired policy to specific databases

```
# Retrieve the default retention policy object for the AzureSQLServer workload type
$retentionPolicy = Get-AzureRmRecoveryServicesBackupRetentionPolicyObject -WorkloadType AzureSQLDatabase

# Set the retention value to two years
$retentionPolicy.RetentionDurationType = "Years"
$retentionPolicy.RetentionCount = 2

$retentionPolicyName = "ssteinRetentionPolicy"

# Register the policy for use with any SQL database
Set-AzureRmRecoveryServicesVaultContext -Vault $vault

# Create the new policy
$policy = New-AzureRmRecoveryServicesBackupProtectionPolicy -name $retentionPolicyName –WorkloadType AzureSQLDatabase -retentionPolicy $retentionPolicy
$policy
```


### Configure a database to use the previously defined retention policy

```
# Enable long-term retention
$policyState = "enabled"

#for your database you can select any policy created in the vault with which your server is registered
Set-AzureRmSqlDatabaseBackupLongTermRetentionPolicy –ResourceGroupName $resourceGroupName –ServerName $serverName -DatabaseName $databaseName -State $policyState -ResourceId $policy.Id
```


> [!IMPORTANT]
> Once configured, backups show up in the vault within next seven days. Do not continue this tutorial until backups show up in the vault.
>

## View backups in long-term retention

In this section of the tutorial, you view information about your database backups in [long-term backup retention](sql-database-long-term-retention.md). 



## Restore a database from a backup in long-term backup retention

In this section of the tutorial, you restore the database to a new database from a backup in the Azure Recovery Services vault.



> [!NOTE]
> From here, you can connect to the restored database using SQL Server Management Studio to perform needed tasks, such as to [extract a bit of data from the restored database to copy into the existing database or to delete the existing database and rename the restored database to the existing database name](sql-database-recovery-using-backups.md#point-in-time-restore).
>



## Next steps

- To learn about service-generated automatic backups, see [automatic backups](: https://azure.microsoft.com/en-us/documentation/articles/)sql-database-automated-backups.MD)
- To learn about long-term backup retention, see [long-term backup retention](sql-database-long-term-retention.md)
- To learn about restoring from backups, see [restore from backup](sql-database-recovery-using-backups.md)