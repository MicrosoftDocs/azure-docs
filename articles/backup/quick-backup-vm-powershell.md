---
title: Azure Quick Start - Backup VM with PowerShell | Microsoft Docs
description: Learn how to back up your virtual machines with Azure PowerShell
services: virtual-machines-windows, azure-backup
documentationcenter: virtual-machines
author: iainfoulds
manager: jeconnoc
editor: 
tags: azure-resource-manager, virtual-machine-backup

ms.assetid: 
ms.service: virtual-machines-windows, azure-backup
ms.devlang: azurecli
ms.topic: hero-article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 09/18/2017
ms.author: iainfou
ms.custom: mvc
---

# Back up a virtual machine in Azure with PowerShell
The Azure PowerShell module is used to create and manage Azure resources from the command line or in scripts. You can protect your data by taking backups at regular intervals. Azure Backup creates recovery points that are stored in geo-redundant recovery vaults. This article details how to back up a virtual machine (VM) in Azure with the Azure PowerShell module. You can also perform these steps with the [Azure CLI](quick-backup-vm-cli.md).

This quick start enables backup on an existing Azure VM. If you need to create a VM, you can [create a VM with Azure PowerShell](../virtual-machines/scripts/virtual-machines-windows-powershell-sample-create-vm?toc=%2fpowershell%2fmodule%2ftoc.json).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

This quick start requires the Azure PowerShell module version 3.6 or later. Run ` Get-Module -ListAvailable AzureRM` to find the version. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps).


## Log in to Azure
Log in to your Azure subscription with the `Login-AzureRmAccount` command and follow the on-screen directions.

```powershell
Login-AzureRmAccount
```

The first time you use Azure Backup, you must register the Azure Recovery Service provider with your subscription.

```powershell
Register-AzureRmResourceProvider -ProviderNamespace "Microsoft.RecoveryServices"
```


## Create a recovery services vault
A [Recovery Services vault](backup-azure-recovery-services-vault-overview.md) is a container that holds the recovery points for the items being backed up. A Recovery Services vault is an Azure resource that can be deployed and managed as part of an Azure resource group.

Create a Recovery Services vault with [New-AzureRmRecoveryServicesVault](/powershell/module/azurerm.recoveryservices/new-azurermrecoveryservicesvault). Specify the same resource group and location parameters for the vault as was used for the virtual machine.

```powershell
New-AzureRmRecoveryServicesVault -Name myRecoveryServicesVault -ResourceGroupName myResourceGroup -Location EastUS
```

By default, the vault is set for Geo-Redundant storage. To use this vault with the remaining steps, set the vault context with [Set-AzureRmRecoveryServicesVaultContext](/powershell/module/AzureRM.RecoveryServices/Set-AzureRmRecoveryServicesVaultContext)

```powershell
Get-AzureRmRecoveryServicesVault -Name myRecoveryServicesVault | Set-AzureRmRecoveryServicesVaultContext
```


## Enable backup for an Azure VM
The default protection policy triggers a backup job each day at midnight. The default retention policy retains the daily recovery points for 30 days. You can use the default policy to quickly protect your VM. First, set the default policy with [Get-AzureRmRecoveryServicesBackupProtectionPolicy](/powershell/module/AzureRM.RecoveryServices.Backup/Get-AzureRmRecoveryServicesBackupProtectionPolicy):

```powershell
$policy = Get-AzureRmRecoveryServicesBackupProtectionPolicy -Name "DefaultPolicy"
```

To enable backup protection for a VM, use [Enable-AzureRmRecoveryServicesBackupProtection](/powershell/module/AzureRM.RecoveryServices.Backup/Enable-AzureRmRecoveryServicesBackupProtection). Specify the policy to use, then the resource group and VM to protect:

```powershell
Enable-AzureRmRecoveryServicesBackupProtection -Policy $policy -ResourceGroupName myResourceGroup -Name myVM
```


## Start a backup job
To start a backup now rather than wait for the default policy to start a job at midnight, use [Backup-AzureRmRecoveryServicesBackupItem](/powershell/module/azurerm.recoveryservices.backup/backup-azurermrecoveryservicesbackupitem). This first backup job creates a full recovery point. Each backup job after this initial backup creates incremental recovery points.

```powershell
$backupcontainer = Get-AzureRmRecoveryServicesBackupContainer -ContainerType "AzureVM" -FriendlyName myVM
$item = Get-AzureRmRecoveryServicesBackupItem -Container $backupcontainer -WorkloadType "AzureVM"
$job = Backup-AzureRmRecoveryServicesBackupItem -Item $item
```

As this first backup job creates a full recovery point, the process can take up to 20 minutes.


## Monitor a backup job
To monitor the status of the backup process, use [Get-AzureRmRecoveryservicesBackupJob](/powershell/module/azurerm.recoveryservices.backup/get-azurermrecoveryservicesbackupjob):

```powershell
Get-AzureRmRecoveryservicesBackupJob
```

The output is similar to the following example, which shows the backup job is **InProgress**:

```powershell
WorkloadName     Operation            Status               StartTime                 EndTime                   JobID                                
------------     ---------            ------               ---------                 -------                   -----                                
myvm             Backup               InProgress           9/18/2017 9:38:02 PM                                9f9e8f14-{snip} 
myvm             ConfigureBackup      Completed            9/18/2017 9:33:18 PM      9/18/2017 9:33:51 PM      fe79c739-{snip}
```


## Clean up deployment
When no longer needed, you can disable protection on the VM, remove the restore points and Recovery Services vault, then delete the resource group and associated VM resources:

```powershell
Disable-AzureRmRecoveryServicesBackupProtection -Item $item  -RemoveRecoveryPoints
$vault = Get-AzureRmRecoveryServicesVault -Name myRecoveryServicesVault
Remove-AzureRmRecoveryServicesVault -Vault $vault
Remove-AzureRmResourceGroup -Name myResourceGroup
```


## Next steps
In this quick start, you created a Recovery Services vault, enabled protection on a VM, and created the initial recovery point. To learn more about Azure Backup and Recovery Services, continue to the tutorials.

> [!div class="nextstepaction"]
> [Restore VMs using templates](./tutorial-backup-azure-vm.md)