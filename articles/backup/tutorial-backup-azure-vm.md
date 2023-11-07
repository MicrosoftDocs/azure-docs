---
title: 'Tutorial: Multiple Azure VM backup with PowerShell'
description: This tutorial details backing up multiple Azure VMs to a Recovery Services vault using Azure PowerShell.
ms.topic: tutorial
ms.date: 03/05/2019
ms.custom: mvc, devx-track-azurepowershell
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Back up Azure VMs with PowerShell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

This tutorial describes how to deploy an [Azure Backup](backup-overview.md) Recovery Services vault to back up multiple Azure VMs using PowerShell.  

In this tutorial you learn how to:

> [!div class="checklist"]
>
> * Create a Recovery Services vault and set the vault context.
> * Define a backup policy
> * Apply the backup policy to protect multiple virtual machines
> * Trigger an on-demand backup job for the protected virtual machines
Before you can back up (or protect) a virtual machine, you must complete the [prerequisites](backup-azure-arm-vms-prepare.md) to prepare your environment for protecting your VMs.

> [!IMPORTANT]
> This tutorial assumes you've already created a resource group and an Azure virtual machine.

## Sign in and register

1. Sign in to your Azure subscription with the `Connect-AzAccount` command and follow the on-screen directions.

    ```powershell
    Connect-AzAccount
    ```

2. The first time you use Azure Backup, you must register the Azure Recovery Service provider in your subscription with [Register-AzResourceProvider](/powershell/module/az.Resources/Register-azResourceProvider). If you've already registered, skip this step.

    ```powershell
    Register-AzResourceProvider -ProviderNamespace "Microsoft.RecoveryServices"
    ```

## Create a Recovery Services vault

A [Recovery Services vault](backup-azure-recovery-services-vault-overview.md) is a logical container that stores backup data for protected resources, such as Azure VMs. When a backup job runs, it creates a recovery point inside the Recovery Services vault. You can then use one of these recovery points to restore data to a given point in time.

* In this tutorial, you create the vault in the same resource group and location as the VM you want to back up.
* Azure Backup automatically handles storage for backed up data. By default the vault uses [Geo-Redundant Storage (GRS)](../storage/common/storage-redundancy.md#geo-redundant-storage). Geo-redundancy ensures that backed up data is replicated to a secondary Azure region, hundreds of miles away from the primary region.

Create the vault as follows:

1. Use the  [New-AzRecoveryServicesVault](/powershell/module/az.recoveryservices/new-azrecoveryservicesvault) to create the vault. Specify the resource group name and location of the VM you want to back up.

    ```powershell
    New-AzRecoveryServicesVault -Name myRSvault -ResourceGroupName "myResourceGroup" -Location "EastUS"
    ```

2. Many Azure Backup cmdlets require the Recovery Services vault object as an input. For this reason, it's convenient to store the Backup Recovery Services vault object in a variable.

    ```powershell
    $vault1 = Get-AzRecoveryServicesVault –Name myRSVault
    ```

3. Set the vault context with [Set-AzRecoveryServicesVaultContext](/powershell/module/az.RecoveryServices/Set-azRecoveryServicesVaultContext).

   * The vault context is the type of data protected in the vault.
   * Once the context is set, it applies to all subsequent cmdlets

     ```powershell
     Get-AzRecoveryServicesVault -Name "myRSVault" | Set-AzRecoveryServicesVaultContext
     ```

## Back up Azure VMs

Backups run in accordance with the schedule specified in the backup policy. When you create a Recovery Services vault, it comes with default protection and retention policies.

* The default protection policy triggers a backup job once a day at a specified time.
* The default retention policy retains the daily recovery point for 30 days.

To enable and backup up the Azure VM in this tutorial, we do the following:

1. Specify a container in the vault that holds your backup data with [Get-AzRecoveryServicesBackupContainer](/powershell/module/az.recoveryservices/get-Azrecoveryservicesbackupcontainer).
2. Each VM for backup is an item. To start a backup job, you obtain information about the VM with [Get-AzRecoveryServicesBackupItem](/powershell/module/az.recoveryservices/Get-AzRecoveryServicesBackupItem).
3. Run an on-demand backup with [Backup-AzRecoveryServicesBackupItem](/powershell/module/az.recoveryservices/backup-Azrecoveryservicesbackupitem).
    * The first initial backup job creates a full recovery point.
    * After the initial backup, each backup job creates incremental recovery points.
    * Incremental recovery points are storage and time-efficient, as they only transfer changes made since the last backup.

Enable and run the backup as follows:

```powershell
$namedContainer = Get-AzRecoveryServicesBackupContainer -ContainerType AzureVM -Status Registered -FriendlyName "V2VM"
$item = Get-AzRecoveryServicesBackupItem -Container $namedContainer -WorkloadType AzureVM
$job = Backup-AzRecoveryServicesBackupItem -Item $item
```

## Troubleshooting

If you run into issues while backing up your virtual machine, review this [troubleshooting article](backup-azure-vms-troubleshoot.md).

### Deleting a Recovery Services vault

If you need to delete a vault, first delete recovery points in the vault, and then unregister the vault, as follows:

```powershell
$Cont = Get-AzRecoveryServicesBackupContainer -ContainerType AzureVM -Status Registered
$PI = Get-AzRecoveryServicesBackupItem -Container $Cont[0] -WorkloadType AzureVm
Disable-AzRecoveryServicesBackupProtection -RemoveRecoveryPoints $PI[0]
Unregister-AzRecoveryServicesBackupContainer -Container $namedContainer
Remove-AzRecoveryServicesVault -Vault $vault1
```

## Next steps

* [Review](backup-azure-vms-automation.md) a more detailed walkthrough of backing up and restoring Azure VMs with PowerShell.
* [Manage and monitor Azure VMs](backup-azure-manage-vms.md)
* [Restore Azure VMs](backup-azure-arm-restore-vms.md)
