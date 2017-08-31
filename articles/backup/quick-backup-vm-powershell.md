---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Use PowerShell to back up Azure VMs to Azure | Microsoft Docs 
description: 115-145 characters including spaces. Edit the intro para describing article intent to fit here. This abstract displays in the search result.
services: backup 
keywords: Don’t add or edit keywords without consulting your SEO champ.
author: trinadhk
ms.author: trinadhk
ms.date: 08/30/2017
ms.topic: article
ms.service: backup


# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
ms.devlang: powershell
# ms.suite: 
# ms.tgt_pltfrm:
# ms.reviewer:
manager: vijayts
---

# Back up Azure VMs using PowerShell

The Azure PowerShell module is used to create and manage Azure resources from the PowerShell command line or in scripts. This article details using Azure PowerShell cmdlets to back up an Azure virtual machine (VM). Backing up your data is a good practice for business and data continuity.

Before you start, make sure that the latest version of PowerShell is installed. For detailed information, see [How to install and configure Azure PowerShell](/powershell/azureps-cmdlets-docs). 

This quick start requires Azure PowerShell version 1.4.0. or later.  

## Log in to Azure

Log in to your Azure subscription with the `Login-AzureRmAccount` command and follow the on-screen directions.

```powershell
Login-AzureRmAccount
```

## Create resource group

Create an Azure resource group with [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup). A resource group is a logical container into which Azure resources are deployed and managed. 

```powershell
New-AzureRmResourceGroup -Name myResourceGroup -Location EastUS
```

## Create a recovery services vault

A [Recovery Services vault](backup-azure-recovery-services-vault-overview.md) is a container that holds the recovery points for the items being backed up. A Recovery Services vault is an Azure resource that can be deployed and managed as part of an Azure resource group.

### Register the provider
The first time you use Azure Backup, you must register the Azure Recovery Service provider with your subscription.

```powershell
PS C:\> Register-AzureRmResourceProvider -ProviderNamespace "Microsoft.RecoveryServices"
```

### Create a vault
Use **New-AzureRmRecoveryServicesVault** to create a Recovery Services vault. Specify the same location for the vault as was used for the VM's resource group.

```powershell
PS C:\> New-AzureRmRecoveryServicesVault -Name myRSvault -ResourceGroupName myResourceGroup -Location EastUS
```

### Specify storage redundancy
Use the **-BackupStorageRedundancy** option to specify the type of storage redundancy: [Locally Redundant Storage (LRS)](../storage/common/storage-redundancy.md#locally-redundant-storage) or [Geo Redundant Storage (GRS)](../storage/common/storage-redundancy.md#geo-redundant-storage). The following example sets the storage redundancy option for myRSVault to GeoRedundant. Many Azure Backup cmdlets require the Recovery Services vault object as an input. For this reason, it may be convenient to store the Backup Recovery Services vault object in a variable.

```powershell
PS C:\> $vault1 = Get-AzureRmRecoveryServicesVault –Name myRSVault
PS C:\> Set-AzureRmRecoveryServicesBackupProperties  -vault $vault1 -BackupStorageRedundancy GeoRedundant
```

## Back up Azure VMs
Before you can run the intial backup, you must set the vault context which is the type of data protected in the vault, and verify the protection policy. The protection policy is the schedule when the backup jobs run, and how long each backup snapshot is retained.

### Set vault context
Use **[Set-AzureRmRecoveryServicesVaultContext](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices/set-azurermrecoveryservicesvaultcontext)** to set the vault context. Once the vault context is set, it applies to all subsequent cmdlets. The following example sets the vault context for the vault, *myRSVault*.

```powershell
PS C:\> Get-AzureRmRecoveryServicesVault -Name myRSVault | Set-AzureRmRecoveryServicesVaultContext
```

### Protection and retention policy
When you create a Recovery Services vault, it comes with default protection and retention policies. The default protection policy triggers a backup job each day at a specified time. The default retention policy retains the daily recovery point for 30 days. You can use the default policy to quickly protect your VM and edit the policy later with different details. For information on modifying these policies, see [Use AzureRM.RecoveryServices.Backup cmdlets to back up virtual machines](backup-azure-vms-automation.md#create-a-protection-policy).

## Initiate a backup
Use **[Backup-AzureRmRecoveryServicesBackupItem](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices.backup/backup-azurermrecoveryservicesbackupitem)** to initiate a backup job. If it is the initial backup, it is a full backup. Subsequent backups take an incremental copy. Be sure to use **[Set-AzureRmRecoveryServicesVaultContext](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices/set-azurermrecoveryservicesvaultcontext)** to set the vault context before triggering the backup job. The following example assumes vault context was set.

```powershell
PS C:\> $namedContainer = Get-AzureRmRecoveryServicesBackupContainer -ContainerType "AzureVM" -Status "Registered" -FriendlyName "V2VM"
PS C:\> $item = Get-AzureRmRecoveryServicesBackupItem -Container $namedContainer -WorkloadType "AzureVM"
PS C:\> $job = Backup-AzureRmRecoveryServicesBackupItem -Item $item
WorkloadName     Operation            Status               StartTime                 EndTime                   JobID
------------     ---------            ------               ---------                 -------                   ----------
V2VM              Backup               InProgress            4/23/2016 5:00:30 PM                      cf4b3ef5-2fac-4c8e-a215-d2eba4124f27
```

> [!NOTE]
> The timezone of the StartTime and EndTime fields in PowerShell is UTC. However, when the time is shown in the Azure portal, the time is adjusted to your local timezone.
>
>

## Monitoring a backup job
Depending on the size of the backup job, it can take a while to complete. You can monitor long-running backup jobs, without using the Azure portal. Use **[Get-AzureRmRecoveryservicesBackupJob](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices.backup/get-azurermrecoveryservicesbackupjob)** to view the status of an in-progress job. This cmdlet gets the backup jobs for the vault specified in the vault context. The following example gets the status of an in-progress job as an array, and stores the status in the $joblist variable.

```powershell
PS C:\> $joblist = Get-AzureRmRecoveryservicesBackupJob –Status "InProgress"
PS C:\> $joblist[0]
WorkloadName     Operation            Status               StartTime                 EndTime                   JobID
------------     ---------            ------               ---------                 -------                   ----------
V2VM             Backup               InProgress            4/23/2016 5:00:30 PM           cf4b3ef5-2fac-4c8e-a215-d2eba4124f27
```

Instead of polling these jobs for completion, use **[Wait-AzureRmRecoveryServicesBackupJob](https://docs.microsoft.com/powershell/module/azurerm.recoveryservices.backup/wait-azurermrecoveryservicesbackupjob)** to pause the execution until either the job completes or the specified timeout value is reached.

```powershell
PS C:\> Wait-AzureRmRecoveryServicesBackupJob -Job $joblist[0] -Timeout 43200
```

## Next steps

<!---1. A simple of list of articles that link to logical next steps.  This is probalby a tutorial that is a superset of this QuickStart. Include no more than 3 next steps.--->

*EXAMPLE 1:*
[Use PowerShell to restore virtual machines from backup](backup-azure-vms-automation.md#restore-an-azure-vm)

[Use Azure portal to back up Azure VMs](backup-azure-arm-vms.md)

<---!
Rules for screenshots:
- Use default Public Portal colors​
- Remove personally identifiable information​
- Browser included in the first shot of the article​
- Resize the browser to minimize white space​
- Include complete blades in the screenshots​
- Linux: Safari – consider context in images​

Guidelines for outlining areas within screenshots:
- Red outline #ef4836
- 3px thick outline
- Text should be vertically centered within the outline.
- Length of outline should be dependent on where it sits within the screenshot. Make the shape fit the layout of the screenshot.
-->