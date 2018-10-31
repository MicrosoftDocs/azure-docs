---
title: Back up Azure VMs in Azure at scale
description: This tutorial details backing up multiple Azure virtual machines to a Recovery Services vault.
services: backup
author: markgalioto
manager: carmonm
keywords: virtual machine backup; back up virtual machine; backup and disaster recovery
ms.service: backup
ms.topic: tutorial
ms.date: 09/06/2017
ms.author: trinadhk
ms.custom: mvc
---
# Back up Azure virtual machines in Azure at scale

This tutorial details how to back up Azure virtual machines to a Recovery Services vault. Most of the work for backing up virtual machines is the preparation. Before you can back up (or protect) a virtual machine, you must complete the [prerequisites](backup-azure-arm-vms-prepare.md) to prepare your environment for protecting your VMs. 

> [!IMPORTANT]
> This tutorial assumes you have already created a resource group and an Azure virtual machine.

## Create a Recovery Services vault

A [Recovery Services vault](backup-azure-recovery-services-vault-overview.md) is a container that holds the recovery points for the items being backed up. A Recovery Services vault is an Azure resource that can be deployed and managed as part of an Azure resource group. In this tutorial, you create a Recovery Services vault in the same resource group as the virtual machine being protected.


The first time you use Azure Backup, you must register the Azure Recovery Service provider with your subscription. If you have already registered the provider with your subscription, go to the next step.

```powershell
Register-AzureRmResourceProvider -ProviderNamespace Microsoft.RecoveryServices
```

Create a Recovery Services vault with **New-AzureRmRecoveryServicesVault**. Be sure to specify the resource group name and location used when configuring the virtual machine that you want to back up. 

```powershell
New-AzureRmRecoveryServicesVault -Name myRSvault -ResourceGroupName "myResourceGroup" -Location "EastUS"
```

Many Azure Backup cmdlets require the Recovery Services vault object as an input. For this reason, it is convenient to store the Backup Recovery Services vault object in a variable. Then use **Set-AzureRmRecoveryServicesBackupProperties** to set the **-BackupStorageRedundancy** option to [Geo-Redundant Storage (GRS)](../storage/common/storage-redundancy-grs.md). 

```powershell
$vault1 = Get-AzureRmRecoveryServicesVault –Name myRSVault
Set-AzureRmRecoveryServicesBackupProperties  -vault $vault1 -BackupStorageRedundancy GeoRedundant
```

## Back up Azure virtual machines

Before you can run the initial backup, you must set the vault context. The vault context is the type of data protected in the vault. When you create a Recovery Services vault, it comes with default protection and retention policies. The default protection policy triggers a backup job each day at a specified time. The default retention policy retains the daily recovery point for 30 days. For this tutorial, accept the default policy. 

Use **[Set-AzureRmRecoveryServicesVaultContext](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices/set-azurermrecoveryservicesvaultcontext)** to set the vault context. Once the vault context is set, it applies to all subsequent cmdlets. 

```powershell
Get-AzureRmRecoveryServicesVault -Name myRSVault | Set-AzureRmRecoveryServicesVaultContext
```

Use **[Backup-AzureRmRecoveryServicesBackupItem](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices.backup/backup-azurermrecoveryservicesbackupitem)** to trigger the backup job. The backup job creates a recovery point. If it is the initial backup, then the recovery point is a full backup. Subsequent backups create an incremental copy.

```powershell
$namedContainer = Get-AzureRmRecoveryServicesBackupContainer -ContainerType AzureVM -Status Registered -FriendlyName "V2VM"
$item = Get-AzureRmRecoveryServicesBackupItem -Container $namedContainer -WorkloadType AzureVM
$job = Backup-AzureRmRecoveryServicesBackupItem -Item $item
```

## Delete the Recovery Services vault

To delete a Recovery Services vault, you must first delete any recovery points in the vault, and then unregister the vault. The following commands detail these steps. 


```powershell
$Cont = Get-AzureRmRecoveryServicesBackupContainer -ContainerType AzureVM -Status Registered
$PI = Get-AzureRmRecoveryServicesBackupItem -Container $Cont[0] -WorkloadType AzureVm
Disable-AzureRmRecoveryServicesBackupProtection -RemoveRecoveryPoints $PI[0]
Unregister-AzureRmRecoveryServicesBackupContainer -Container $namedContainer
Remove-AzureRmRecoveryServicesVault -Vault $vault1
```

## Troubleshooting errors
If you run into issues while backing up your virtual machine, see the [Back up Azure virtual machines troubleshooting article](backup-azure-vms-troubleshoot.md) for help.

## Next steps
Now that you have protected your virtual machines, see the following articles to learn about management tasks, and how to restore virtual machines from a recovery point.

* To modify the backup policy, see [Use AzureRM.RecoveryServices.Backup cmdlets to back up virtual machines](backup-azure-vms-automation.md#create-a-protection-policy).
* [Manage and monitor your virtual machines](backup-azure-manage-vms.md)
* [Restore virtual machines](backup-azure-arm-restore-vms.md)
