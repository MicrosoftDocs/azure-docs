---
title: Delete long-term retention backups and the Azure Recovery Services vault | Microsoft Docs
description: Quick reference on how to delete long-term retention backups and the Azure Recovery Services vault
services: sql-database
documentationcenter: ''
author: stevestein
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
# Delete long-term retention backups

In this How To topic, you learn how to delete long-term retention backups and the Azure Recovery Services vault.

>[!Warning]
>Verify that you want to delete your long-term retention backups before running this code. To avoid any unwanted charges, this code snippet is for cleaning up any backups and vaults created when learning how to use [long-term backup retention](sql-database-long-term-retention.md), or backups and vaults you no longer need.

## Delete long-term retention backups using PowerShell

Deleting backups in long-term retention requires the latest [Azure PowerShell](https://docs.microsoft.com/powershell/azureps-cmdlets-docs/), and uses the following cmdlets:

- [Get-AzureRmRecoveryServicesVault](https://docs.microsoft.com/powershell/resourcemanager/azurerm.recoveryservices/v2.3.0/get-azurermrecoveryservicesvault)
- [Get-AzureRmRecoveryServicesBackupContainer](https://docs.microsoft.com/powershell/resourcemanager/azurerm.recoveryservices.backup/v2.3.0/get-azurermrecoveryservicesbackupcontainer)
- [Get-AzureRmRecoveryServicesBackupItem](https://docs.microsoft.com/powershell/resourcemanager/azurerm.recoveryservices.backup/v2.3.0/get-azurermrecoveryservicesbackupitem)
- [Disable-AzureRmRecoveryServicesBackupProtection](https://docs.microsoft.com/powershell/resourcemanager/azurerm.recoveryservices.backup/v2.3.0/disable-azurermrecoveryservicesbackupprotection)
- [Unregister-AzureRmRecoveryServicesBackupContainer](https://docs.microsoft.com/powershell/resourcemanager/azurerm.recoveryservices.backup/v2.3.0/unregister-azurermrecoveryservicesbackupcontainer)
- [Remove-AzureRmRecoveryServicesVault](https://docs.microsoft.com/powershell/resourcemanager/azurerm.recoveryservices/v2.3.0/remove-azurermrecoveryservicesvault)


For more information, see [Storing Azure SQL Database Backups for up to 10 years](sql-database-long-term-retention.md).

```
# Delete long-term backups
##########################

$resourceGroupName = "{resource-group-name}"
$recoveryServiceVaultName = "{vault-name}"

$vault = Get-AzureRmRecoveryServicesVault -ResourceGroupName $resourceGroupName -Name $recoveryServiceVaultName
Set-AzureRmRecoveryServicesVaultContext -Vault $vault

$containers = Get-AzureRmRecoveryServicesBackupContainer –ContainerType AzureSQL -FriendlyName $vault.Name

ForEach ($container in $containers)
{
   $items = Get-AzureRmRecoveryServicesBackupItem –container $container -WorkloadType AzureSQLDatabase

   ForEach ($item in $items)
   {
      # Remove the backups from the vault
      ###################################
      Disable-AzureRmRecoveryServicesBackupProtection –item $item -RemoveRecoveryPoints -ea SilentlyContinue
   }
   
   Unregister-AzureRmRecoveryServicesBackupContainer –Container $container
}
# Delete the recovery services vault
####################################
Remove-AzureRmRecoveryServicesVault -Vault $vault
```



## Next steps

- To learn about service-generated automatic backups, see [automatic backups](sql-database-automated-backups.md)
- To learn about long-term backup retention, see [long-term backup retention](sql-database-long-term-retention.md)
- To learn about restoring from backups, see [restore from backup](sql-database-recovery-using-backups.md)