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
ms.date: 12/21/2016
ms.author: sstein

---
# Delete long-term retention backups and the Azure Recovery Services vault 

In this How To topic, you learn how to delete long-term retention backups and the Azure Recovery Services vault.

>[!Warning]
>Verify that you want to delete your backups before running this code. To avoid any unwanted charges, this code snippet is for cleaning up any backups and vaults created when learning how to use [long-term backup retention](sql-database-long-term-retention.md), or backups and vaults you no longer need.

## Delete long-term retention backups and the Azure Recovery Services vault using PowerShell


```
# Delete long-term backups and the vault
########################################

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
      Disable-AzureRmRecoveryServicesBackupProtection –item $item -RemoveRecoveryPoints -ea SilentlyContinue
   }
   
   Unregister-AzureRmRecoveryServicesBackupContainer –Container $container
}

Remove-AzureRmRecoveryServicesVault -Vault $vault
```



## Next steps

- To learn about service-generated automatic backups, see [automatic backups](: https://azure.microsoft.com/en-us/documentation/articles/)sql-database-automated-backups.MD)
- To learn about long-term backup retention, see [long-term backup retention](sql-database-long-term-retention.md)
- To learn about restoring from backups, see [restore from backup](sql-database-recovery-using-backups.md)