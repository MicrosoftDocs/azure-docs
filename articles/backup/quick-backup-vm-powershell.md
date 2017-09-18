---
title: Use PowerShell to back up Azure virtual machines to Azure | Microsoft Docs 
description: This Quickstart uses Azure PowerShell to back up an Azure virtual machine to a Recovery Services vault. 
services: backup 
keywords: Don’t add or edit keywords without consulting your SEO champ.
author: trinadhk
ms.author: trinadhk
ms.date: 08/30/2017
ms.topic: article
ms.service: backup
ms.devlang: powershell
manager: vijayts
---

# Back up Azure virtual machines using PowerShell

The Azure PowerShell module is used to create and manage Azure resources from the PowerShell command line or in scripts. This article details using Azure PowerShell cmdlets to back up an Azure virtual machine. Backing up your data is a good practice for business and data continuity. This quickstart requires an existing virtual machine. 

Before you start, make sure that the latest version of PowerShell is installed. For detailed information, see [Install and configure Azure PowerShell](/powershell/azure/install-azurerm-ps). 

## Log in to Azure

Log in to your Azure subscription with the `Login-AzureRmAccount` command and follow the on-screen directions.

```powershell
Login-AzureRmAccount
```

## Create a recovery services vault

A [Recovery Services vault](backup-azure-recovery-services-vault-overview.md) is a container that holds the recovery points for the items being backed up. A Recovery Services vault is an Azure resource that can be deployed and managed as part of an Azure resource group.

### Register the provider

The first time you use Azure Backup, you must register the Azure Recovery Service provider with your subscription.

```powershell
PS C:\> Register-AzureRmResourceProvider -ProviderNamespace "Microsoft.RecoveryServices"
```

### Create a vault

Use [New-AzureRmRecoveryServicesVault](https://docs.microsoft.com/en-us/powershell/module/azurerm.recoveryservices/new-azurermrecoveryservicesvault?view=azurermps-4.3.1) to create a Recovery Services vault. Specify the same resource group and location parameters for the vault as was used for the virtual machine.

```powershell
PS C:\> New-AzureRmRecoveryServicesVault -Name myRSvault -ResourceGroupName myResourceGroup -Location EastUS
```

### Specify storage redundancy

Use the [-BackupStorageRedundancy](https://docs.microsoft.com/en-us/powershell/module/AzureRM.RecoveryServices/Set-AzureRmRecoveryServicesBackupProperties?view=azurermps-4.3.1#optional-parameters) parameter to specify the type of storage redundancy: [Locally Redundant Storage (LRS)](../storage/common/storage-redundancy.md#locally-redundant-storage) or [Geo-Redundant Storage (GRS)](../storage/common/storage-redundancy.md#geo-redundant-storage). The following example sets the storage redundancy option for myRSVault to GeoRedundant. Many Azure Backup cmdlets require the Recovery Services vault object as an input. For this reason, it may be convenient to store the Backup Recovery Services vault object in a variable.

```powershell
PS C:\> $vault1 = Get-AzureRmRecoveryServicesVault –Name myRSVault
PS C:\> Set-AzureRmRecoveryServicesBackupProperties  -vault $vault1 -BackupStorageRedundancy GeoRedundant
```

## Back up Azure virtual machines

Before you can run the initial backup, you must set the vault context, which is the type of data protected in the vault, and verify the protection policy. The protection policy is the schedule when the backup jobs run, and how long each backup snapshot is retained.

### Set vault context

Use [Set-AzureRmRecoveryServicesVaultContext](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices/set-azurermrecoveryservicesvaultcontext) to set the vault context. Once the vault context is set, it applies to all subsequent cmdlets. The following example sets the vault context for the vault, *myRSVault*.

```powershell
PS C:\> Get-AzureRmRecoveryServicesVault -Name myRSVault | Set-AzureRmRecoveryServicesVaultContext
```

### Protection and retention policy

When you create a Recovery Services vault, it comes with default protection and retention policies. The default protection policy triggers a backup job each day at a specified time. The default retention policy retains the daily recovery point for 30 days. You can use the default policy to quickly protect your virtual machine and edit the policy later with different details. For information on modifying these policies, see [Use AzureRM.RecoveryServices.Backup cmdlets to back up virtual machines](backup-azure-vms-automation.md#create-a-protection-policy).

### Trigger the backup job

Use [Backup-AzureRmRecoveryServicesBackupItem](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices.backup/backup-azurermrecoveryservicesbackupitem) to trigger a backup job. The backup job creates a recovery point. If it is the initial backup, then the recovery point is a full backup. Subsequent backups take an incremental copy. Be sure to use [Set-AzureRmRecoveryServicesVaultContext](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices/set-azurermrecoveryservicesvaultcontext) to set the vault context before triggering the backup job. The following example assumes vault context was set.

```powershell
PS C:\> $namedContainer = Get-AzureRmRecoveryServicesBackupContainer -ContainerType "AzureVM" -Status "Registered" -FriendlyName "V2VM"
PS C:\> $item = Get-AzureRmRecoveryServicesBackupItem -Container $namedContainer -WorkloadType "AzureVM"
PS C:\> $job = Backup-AzureRmRecoveryServicesBackupItem -Item $item
```

## Monitoring a backup job

Depending on the size of the backup job, it can take a while to complete. You can monitor long-running backup jobs, without using the Azure portal. Use [Get-AzureRmRecoveryservicesBackupJob](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices.backup/get-azurermrecoveryservicesbackupjob) to view the status of an in-progress job. This cmdlet gets the backup jobs for the vault specified in the vault context. The following example gets the status of an in-progress job as an array, and stores the status in the $joblist variable.

```powershell
PS C:\> $joblist = Get-AzureRmRecoveryservicesBackupJob –Status "InProgress"
PS C:\> $joblist[0]
```

Instead of polling these jobs for completion, use [Wait-AzureRmRecoveryServicesBackupJob](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices.backup/wait-azurermrecoveryservicesbackupjob) to pause the execution until either the job completes or the specified timeout value is reached.

```powershell
PS C:\> Wait-AzureRmRecoveryServicesBackupJob -Job $joblist[0] -Timeout 43200
```

## Clean up deployment

If you do not want to retain the Recovery Services vault and backup data, run the following script for your subscription and Recovery Services vault to delete the backup data and vault.

```powershell
PS C:\> Login-AzureRmAccount
PS C:\> Get-AzureRmSubscription
PS C:\> Select-AzureRmSubscription -SubscriptionId e3d2d341-4ddb-4c5d-9121-69b7e719485e
PS C:\> $vault = Get-AzureRmRecoveryServicesVault -Name "myRSvault"
PS C:\> Set-AzureRmRecoveryServicesVaultContext -Vault $vault
PS C:\> $container = Get-AzureRmRecoveryServicesBackupContainer -ContainerType AzureVM -Status Registered
PS C:\> $item = Get-AzureRmRecoveryServicesBackupItem -Container $container -WorkloadType "AzureVM"
PS C:\> Disable-AzureRmRecoveryServicesBackupProtection -Item $item  -RemoveRecoveryPoints
PS C:\> Remove-AzureRmRecoveryServicesVault -Vault $vault
```

## Next steps

In this quickstart you used PowerShell to:

> [!div class="checklist"]
> * Create a Recovery Services vault
> * Create a backup and retention policy 
> * Trigger the initial back up of the virtual machine

Continue to the tutorials to learn how to back up multiple Azure virtual machines using the Azure portal. 

> [!div class="nextstepaction"]
> [Restore VMs using templates](./tutorial-backup-azure-vm.md)