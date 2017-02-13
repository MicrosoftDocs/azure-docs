---
title: 'PowerShell:View backups in Azure Recovery Services vault | Microsoft Docs'
description: Quick reference on how use PowerShell to view the backups in the Azure Recovery Services vault and the space used by those backups
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
ms.author: sstein

---
# View information about your database backups in long-term backup retention using PowerShell

In this topic, you learn how to use PowerShell to view information about your database backups in long-term backup retention. You can perform this same task using the [Azure portal](sql-database-view-backups-in-vault-portal).

For more information about long-term backup retention, see [Long-term backup retention](sql-database-long-term-retention.md).

> [!TIP]
> For a tutorial, see [Get Started with Backup and Restore for Data Protection and Recovery using PowerShell](sql-database-get-started-backup-recovery-powershell.md).
>

## View long-term backup retention information using the PowerShell

Viewing backups in long-term retention requires the latest [Azure PowerShell](https://docs.microsoft.com/powershell/azureps-cmdlets-docs/), and uses the following cmdlets:

- [Get-AzureRmRecoveryServicesVault](https://docs.microsoft.com/powershell/resourcemanager/azurerm.recoveryservices/v2.3.0/get-azurermrecoveryservicesvault)
- [Get-AzureRmRecoveryServicesBackupContainer](https://docs.microsoft.com/powershell/resourcemanager/azurerm.recoveryservices.backup/v2.3.0/get-azurermrecoveryservicesbackupcontainer)
- [Get-AzureRmRecoveryServicesBackupItem](https://docs.microsoft.com/powershell/resourcemanager/azurerm.recoveryservices.backup/v2.3.0/get-azurermrecoveryservicesbackupitem)
- [Get-AzureRmRecoveryServicesBackupRecoveryPoint](https://docs.microsoft.com/powershell/resourcemanager/azurerm.recoveryservices.backup/v2.3.0/get-azurermrecoveryservicesbackuprecoverypoint)

For more information, see [Storing Azure SQL Database Backups for up to 10 years](sql-database-long-term-retention.md).

```
# View the available backups in long-term backup retention

# User variables
################
$resourceGroupName = "{resource-group-name}"
$serverName = "{server-name}"
$recoveryServiceVaultName = "{vault-name}"

# Set the vault context to the vault we want to query
#####################################################
$vault = Get-AzureRmRecoveryServicesVault -ResourceGroupName $resourceGroupName -Name $recoveryServiceVaultName
Set-AzureRmRecoveryServicesVaultContext -Vault $vault


# Get the container associated with the selected vault
######################################################
$container = Get-AzureRmRecoveryServicesBackupContainer -ContainerType AzureSQL -FriendlyName $vault.Name

# Get the long-term retention metadata associated with the container
####################################################################
$item = Get-AzureRmRecoveryServicesBackupItem -Container $container -WorkloadType AzureSQLDatabase


# Get all available backups
# Optionally, set the -StartDate and -EndDate parameters
########################################################
$availableBackups = Get-AzureRmRecoveryServicesBackupRecoveryPoint -Item $item
$availableBackups
```

## Next steps

- To delete long-term retention backups, see [delete long-term-retention backups](sql-database-long-term-retention-delete.md)
- To configure long-term retention of automated backups in an Azure Recovery Services vault using PowerShell, see [configure long-term retention using PowerShell](sql-database-configure-long-term-retention-powershell.md)
- To restore a database from a backup in long-term backup retention using PowerShell, see [restore from long-term retention using PowerShell](sql-database-restore-from-long-term-retention-powershell.md)
- To learn about service-generated automatic backups, see [automatic backups](sql-database-automated-backups.md)
- To learn about long-term backup retention, see [long-term backup retention](sql-database-long-term-retention.md)
- To learn about restoring from backups, see [restore from backup](sql-database-recovery-using-backups.md)