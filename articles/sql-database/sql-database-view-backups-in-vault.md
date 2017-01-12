---
title: View the backups in the Azure Recovery Services vault | Microsoft Docs
description: Quick reference on how to view the backups in the Azure Recovery Services vault and the space used by those backups
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
# View information about your database backups in long-term backup retention

In this How To topic, you learn how to view information about your database backups in long-term backup retention.

## View long-term backup retention information using the Azure portal 

1. Open the blade for the Azure Recovery Services vault (go to **All resources** and select it from the list of resources for your subscription) to view the amount of storage used by your database backups in the vault.

   ![view recovery services vault with backups](./media/sql-database-get-started-backup-recovery/view-recovery-services-vault-with-data.png)

2. Open the **SQL database** blade for your database.

    ![new sample db blade](./media/sql-database-get-started/new-sample-db-blade.png)

3. On the toolbar, click **Restore**.

    ![restore toolbar](./media/sql-database-get-started-backup-recovery/restore-toolbar.png)

4. On the Restore blade, click **Long-term**.

5. Under Azure vault backups, click **Select a backup** to view the available database backups in long-term backup retention.

    ![backups in vault](./media/sql-database-get-started-backup-recovery/view-backups-in-vault.png)

> [!TIP]
> For a tutorial, see [Get Started with Backup and Restore for Data Protection and Recovery](sql-database-get-started-backup-recovery.md)
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
- To configure long-term retention of automated backups in an Azure Recovery Services vault, see [configure long-term retention](sql-database-configure-long-term-retention.md)
- To restore a database from a backup in long-term backup retention, see [restore from long-term retention](sql-database-restore-from-long-term-retention.md)
- To learn about service-generated automatic backups, see [automatic backups](sql-database-automated-backups.md)
- To learn about long-term backup retention, see [long-term backup retention](sql-database-long-term-retention.md)
- To learn about restoring from backups, see [restore from backup](sql-database-recovery-using-backups.md)