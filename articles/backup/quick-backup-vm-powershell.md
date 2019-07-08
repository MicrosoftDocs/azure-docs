---
title: Azure Quickstart - Back up a VM with PowerShell
description: Learn how to back up your virtual machines with Azure PowerShell
services: backup
author: rayne-wiselman
manager: carmonm
ms.service: backup
ms.devlang: azurecli
ms.topic: quickstart
ms.date: 04/16/2019
ms.author: raynew
ms.custom: mvc
---

# Back up a virtual machine in Azure with PowerShell

The [Azure PowerShell AZ](https://docs.microsoft.com/powershell/azure/new-azureps-module-az?view=azps-1.4.0) module is used to create and manage Azure resources from the command line or in scripts. 

[Azure Backup](backup-overview.md) backs up on-premises machines and apps, and Azure VMs. This article shows you how to back up an Azure VM with the AZ module. Alternatively, you can back up a VM using the [Azure CLI](quick-backup-vm-cli.md), or in the [Azure portal](quick-backup-vm-portal.md).

This quickstart enables backup on an existing Azure VM. If you need to create a VM, you can [create a VM with Azure PowerShell](../virtual-machines/scripts/virtual-machines-windows-powershell-sample-create-vm.md?toc=%2fpowershell%2fmodule%2ftoc.json).

This quickstart requires the Azure PowerShell AZ module version 1.0.0 or later. Run `Get-Module -ListAvailable Az` to find the version. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps).

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Sign in and register

1. Log in to your Azure subscription with the `Connect-AzAccount` command and follow the on-screen directions.

    ```powershell
    Connect-AzAccount
    ```
2. The first time you use Azure Backup, you must register the Azure Recovery Service provider in your subscription with [Register-AzResourceProvider](/powershell/module/az.Resources/Register-azResourceProvider), as follows:

    ```powershell
    Register-AzResourceProvider -ProviderNamespace "Microsoft.RecoveryServices"
    ```


## Create a Recovery Services vault

A [Recovery Services vault](backup-azure-recovery-services-vault-overview.md) is a logical container that stores backup data for protected resources, such as Azure VMs. When a backup job runs, it creates a recovery point inside the Recovery Services vault. You can then use one of these recovery points to restore data to a given point in time.

When you create the vault:

- For the resource group and location, specify the resource group and location of the VM you want to back up.
- If you used this [sample script](../virtual-machines/scripts/virtual-machines-windows-powershell-sample-create-vm.md?toc=%2fpowershell%2fmodule%2ftoc.json) to create the VM, the resource group is **myResourceGroup**, the VM is ***myVM**, and the resources are in the **WestEurope** region.
- Azure Backup automatically handles storage for backed up data. By default the vault uses [Geo-Redundant Storage (GRS)](../storage/common/storage-redundancy-grs.md). Geo-redundancy ensures that backed up data is replicated to a secondary Azure region, hundreds of miles away from the primary region.

Now create a vault:


1. Use the  [New-AzRecoveryServicesVault](/powershell/module/az.recoveryservices/new-azrecoveryservicesvault) to create the vault:

    ```powershell
    New-AzRecoveryServicesVault `
        -ResourceGroupName "myResourceGroup" `
        -Name "myRecoveryServicesVault" `
    -Location "WestEurope"
    ```

2. Set the vault context with [Set-AzRecoveryServicesVaultContext](/powershell/module/az.RecoveryServices/Set-azRecoveryServicesVaultContext), as follows:

    ```powershell
    Get-AzRecoveryServicesVault `
        -Name "myRecoveryServicesVault" | Set-AzRecoveryServicesVaultContext
    ```

3. Change the storage redundancy configuration (LRS/GRS) of the vault with [Set-AzRecoveryServicesBackupProperty](https://docs.microsoft.com/powershell/module/az.recoveryservices/Set-AzRecoveryServicesBackupProperty), as follows:
    
    ```powershell
    Get-AzRecoveryServicesVault `
        -Name "myRecoveryServicesVault" | Set-AzRecoveryServicesBackupProperty -BackupStorageRedundancy LocallyRedundant/GeoRedundant
    ```
    > [!NOTE]
    > Storage Redundancy can be modified only if there are no backup items protected to the vault.

## Enable backup for an Azure VM

You enable backup for an Azure VM, and specify a backup policy.

- The policy defines when backups run, and how long recovery points created by the backups should be retained.
- The default protection policy runs a backup once a day for the VM, and retains the created recovery points for 30 days. You can use this default policy to quickly protect your VM. 

Enable backup as follows:

1. First, set the default policy with [Get-AzRecoveryServicesBackupProtectionPolicy](/powershell/module/az.recoveryservices/get-azrecoveryservicesbackupprotectionpolicy):

    ```powershell
    $policy = Get-AzRecoveryServicesBackupProtectionPolicy     -Name "DefaultPolicy"
    ```

2. Enable VM backup with [Enable-AzRecoveryServicesBackupProtection](/powershell/module/az.recoveryservices/enable-azrecoveryservicesbackupprotection). Specify the policy, the resource group, and the VM name.

    ```powershell
    Enable-AzRecoveryServicesBackupProtection `
        -ResourceGroupName "myResourceGroup" `
        -Name "myVM" `
        -Policy $policy
    ```


## Start a backup job

Backups run in accordance with the schedule specified in the backup policy. You can also run an ad hoc backup:

- The first initial backup job creates a full recovery point.
- After the initial backup, each backup job creates incremental recovery points.
- Incremental recovery points are storage and time-efficient, as they only transfer changes made since the last backup.

To run an ad hoc backup, you use the [Backup-AzRecoveryServicesBackupItem](/powershell/module/az.recoveryservices/get-azrecoveryservicesbackupitem). 
- You specify a container in the vault that holds your backup data with [Get-AzRecoveryServicesBackupContainer](/powershell/module/az.recoveryservices/get-azrecoveryservicesbackupcontainer).
- Each VM to back up is treated as an item. To start a backup job, you obtain information about the VM with [Get-AzRecoveryServicesBackupItem](/powershell/module/az.recoveryservices/get-azrecoveryservicesbackupitem).

Run an ad hoc backup job as follows:

1. Specify the container, obtain VM information, and run the backup.

    ```powershell
    $backupcontainer = Get-AzRecoveryServicesBackupContainer `
        -ContainerType "AzureVM" `
        -FriendlyName "myVM"

    $item = Get-AzRecoveryServicesBackupItem `
        -Container $backupcontainer `
        -WorkloadType "AzureVM"

    Backup-AzRecoveryServicesBackupItem -Item $item
    ```

2. You might need to wait up to 20 minutes, since the first backup job creates a full recovery point. Monitor the job as described in the next procedure.


## Monitor the backup job

1. Run [Get-AzRecoveryservicesBackupJob](/powershell/module/az.recoveryservices/get-azrecoveryservicesbackupjob) to monitor the job status.

    ```powershell
    Get-AzRecoveryservicesBackupJob
    ```
    Output is similar to the following example, which shows the job as **InProgress**:

    ```
    WorkloadName   Operation         Status       StartTime              EndTime                JobID
    ------------   ---------         ------       ---------              -------                -----
    myvm           Backup            InProgress   9/18/2017 9:38:02 PM                          9f9e8f14
    myvm           ConfigureBackup   Completed    9/18/2017 9:33:18 PM   9/18/2017 9:33:51 PM   fe79c739
    ```

2. When the job status is **Completed**, the VM is protected and has a full recovery point stored.


## Clean up the deployment

If you no longer need to back up the VM, you can clean it up.
- If you want to try out restoring the VM, skip the clean up.
- If you used an existing VM, you can skip the final [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) cmdlet to leave the resource group and VM in place.

Disable protection, remove the restore points and vault. Then delete the resource group and associated VM resources, as follows:

```powershell
Disable-AzRecoveryServicesBackupProtection -Item $item -RemoveRecoveryPoints
$vault = Get-AzRecoveryServicesVault -Name "myRecoveryServicesVault"
Remove-AzRecoveryServicesVault -Vault $vault
Remove-AzResourceGroup -Name "myResourceGroup"
```


## Next steps

In this quickstart, you created a Recovery Services vault, enabled protection on a VM, and created the initial recovery point. 

- [Learn how](tutorial-backup-vm-at-scale.md) to back up VMs in the Azure portal.
- [Learn how](tutorial-restore-disk.md) to quickly restore a VM
