---
title: Restore a database from a backup in the Azure Recovery Services vault | Microsoft Docs
description: Quick reference on how to restore a database for a backup in the Azure Recovery Services vault and the space used by those backups
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: sql-database
ms.custom: business continuity
ms.devlang: NA
ms.workload: data-management
ms.topic: article
ms.tgt_pltfrm: NA
ms.date: 12/22/2016
ms.author: carlrab; sstein

---
# Restore a database from a backup in long-term backup retention

In this How To topic, you learn how to restore a database from a backup in long-term backup retention.


## Restore from long-term backup retention using the Azure portal

1. On the **Azure vault backups** blade, click the backup to restore and then click **Select**.

    ![select backup in vault](./media/sql-database-get-started-backup-recovery/select-backup-in-vault.png)

2. In the **Database name** text box, provide the name for the restored database.

    ![new database name](./media/sql-database-get-started-backup-recovery/new-database-name.png)

3. Click **OK** to restore your database from the backup in the vault to the new database.

4. On the toolbar, click the notification icon to view the status of the restore job.

    ![restore job progress from vault](./media/sql-database-get-started-backup-recovery/restore-job-progress-long-term.png)

5. When the restore job is completed, open the **SQL databases** blade to view the newly restored database.

    ![restored database from vault](./media/sql-database-get-started-backup-recovery/restored-database-from-vault.png)

> [!TIP]
> For a tutorial, see [Get Started with Backup and Restore for Data Protection and Recovery](sql-database-get-started-backup-recovery.md)


## Restore from long-term backup retention using PowerShell

Restoring a database from a long-term retention backup requires the latest [Azure PowerShell](https://docs.microsoft.com/powershell/azureps-cmdlets-docs/), and uses the following cmdlets:

- [Get-AzureRmRecoveryServicesVault](https://docs.microsoft.com/powershell/resourcemanager/azurerm.recoveryservices/v2.3.0/get-azurermrecoveryservicesvault)
- [Get-AzureRmRecoveryServicesBackupContainer](https://docs.microsoft.com/powershell/resourcemanager/azurerm.recoveryservices.backup/v2.3.0/get-azurermrecoveryservicesbackupcontainer)
- [Get-AzureRmRecoveryServicesBackupItem](https://docs.microsoft.com/powershell/resourcemanager/azurerm.recoveryservices.backup/v2.3.0/get-azurermrecoveryservicesbackupitem)
- [Get-AzureRmRecoveryServicesBackupRecoveryPoint](https://docs.microsoft.com/powershell/resourcemanager/azurerm.recoveryservices.backup/v2.3.0/get-azurermrecoveryservicesbackuprecoverypoint)
- [Restore-AzureRmSqlDatabase](https://docs.microsoft.com/powershell/resourcemanager/azurerm.sql/v2.3.0/restore-azurermsqldatabase)

For more information, see [Storing Azure SQL Database Backups for up to 10 years](sql-database-long-term-retention.md).

For a step-by-step tutorial, see [Get Started with Backup and Restore for Data Protection and Recovery using PowerShell](sql-database-get-started-backup-recovery-powershell.md).

```
# Restore a database from long-term backup retention

# User variables
################
$resourceGroupName = "{resource-group-name}"
$serverName = "{server-name}"
$databaseNeedingRestore = "{database-name}"
$recoveryServiceVaultName = "{vault-name}"

$restoredDatabaseName = "{restored-db-name}"
$edition = "{restored-db-edition}"
$performanceLevel = "{restored-db-slo}"


# Set the vault context to the vault we want to restore from
############################################################
$vault = Get-AzureRmRecoveryServicesVault -ResourceGroupName $resourceGroupName -Name $recoveryServiceVaultName
Set-AzureRmRecoveryServicesVaultContext -Vault $vault


# Get the container associated with the selected vault
######################################################
$container = Get-AzureRmRecoveryServicesBackupContainer -ContainerType AzureSQL -FriendlyName $vault.Name

# Get the long-term retention metadata associated with a specific database
##########################################################################
$item = Get-AzureRmRecoveryServicesBackupItem -Container $container -WorkloadType AzureSQLDatabase -Name $databaseNeedingRestore


# Get all available backups for the previously indicated database
# Optionally, set the -StartDate and -EndDate parameters for specific backups
#############################################################################
$availableBackups = Get-AzureRmRecoveryServicesBackupRecoveryPoint -Item $item
$availableBackups

if (!$availableBackups)
{
    Write-Host "No backups available"
}
else
{
    # Restore the most recent available backup: $availableBackups[0]
    ################################################################
    $restoredDb = Restore-AzureRmSqlDatabase -FromLongTermRetentionBackup -ResourceId $availableBackups[0].Id -ResourceGroupName $resourceGroupName ` 
     -ServerName $serverName -TargetDatabaseName $restoredDatabaseName -Edition $edition -ServiceObjectiveName $performanceLevel
    $restoredDb
}
```


## Next steps

- To configure long-term retention of automated backups in an Azure Recovery Services vault, see [configure long-term backup retention](sql-database-configure-long-term-retention.md)
- To view backups in the Azure Recovery Services vault, see [view backups in long-term retention](sql-database-view-backups-in-vault.md)
- To learn about service-generated automatic backups, see [automatic backups](sql-database-automated-backups.md)
- To learn about long-term backup retention, see [long-term backup retention](sql-database-long-term-retention.md)
- To learn about restoring from backups, see [restore from backup](sql-database-recovery-using-backups.md)
- To delete long-term retention backups, see [delete long-term retention backups](sql-database-long-term-retention-delete.md)