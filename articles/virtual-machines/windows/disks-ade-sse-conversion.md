---
title: Migrate to server-side encryption - PowerShell
description: How to migrate your managed disks using Azure Disk Encryption to server-side encryption using PowerShell.
author: roygara
ms.service: virtual-machines-windows
ms.topic: how-to
ms.date: 06/23/2020
ms.author: rogarana
ms.subservice: disks
---

# Migrate managed disks from ADE to SSE - PowerShell

This article covers how to migrate managed disks from Azure Disk Encryption (ADE) to server-side encryption (SSE). To learn more about ADE or SSE, see our articles: [server-side encryption](disk-encryption.md) or [Azure Disk Encryption](disk-encryption-overview.md).

## Prerequisites

Create a Key Vault and Disk Encryption Set for SSE+CMK  (Note: must be same subscription and region as the VM. This can be the same key vault and key used with ADE.) 

[!INCLUDE [virtual-machines-disks-encryption-create-key-vault-powershell](../../../includes/virtual-machines-disks-encryption-create-key-vault-powershell.md)]

## Take a disk snapshot

Before you start the migration process, take a snapshot of your disks. So that you can revert to them just in case.

```azurepowershell
$resourceGroupName = 'myResourceGroup' 
$location = 'eastus' 
$vmName = 'myVM'
$snapshotName = 'mySnapshot'

$vm = get-azvm `
-ResourceGroupName $resourceGroupName 
-Name $vmName

$snapshot =  New-AzSnapshotConfig 
-SourceUri $vm.StorageProfile.OsDisk.ManagedDisk.Id 
-Location $location 
-CreateOption copy

New-AzSnapshot 
-Snapshot $snapshot 
-SnapshotName $snapshotName 
-ResourceGroupName $resourceGroupName
```

## Disable Azure Disk Encryption

Since ADE and SSE are incompatible, you must disable ADE to start the migration process.

[!INCLUDE [disk-encryption-disable-encryption-powershell](../../../includes/disk-encryption-disable-encryption-powershell.md)]

## Verify encryption status

Verify encryption status is 'NotEncrypted' with. (Note: do not remove the extension until encryption status changes from 'DecryptionInProgress' to 'NotEncrypted'. Progress message will say 'Disable Encryption completed successfully'.)

```azurepowershell
Get-AzVmDiskEncryptionStatus -ResourceGroupName "MyResourceGroup001" -VMName "VM001"
```

## Remove Azure Disk Encryption extension 

Once you've confirmed the encryption status has changed and the encryption has been disabled, you can remove the ADE extension.

Use the following cmd to remove the Azure Disk Encryption extension from your VM.

```azurepowershell
Remove-AzVMExtension -ResourceGroupName "ResourceGroup11" -Name "AzureiDskEncryption" -VMName "VirtualMachine22"
```

## Stop the VM

You must stop the VM in order to swap the encryption to SSE with customer-managed keys.

```azurepowershell
Stop-AzVM -ResourceGroupName $myResourceGroup -Name $myVM
```

## Change disk encryption type

Now that you've stopped the VM you can change your disks encryption type. Use the following command to change the encryption type, make sure to use the values for your disk encryption set and your key vault from earlier in this article:

```azurepowershell
$rgName = "yourResourceGroupName"
$diskName = "yourDiskName"
$diskEncryptionSetName = "yourDiskEncryptionSetName"
 
$diskEncryptionSet = Get-AzDiskEncryptionSet -ResourceGroupName $rgName -Name $diskEncryptionSetName
 
New-AzDiskUpdateConfig -EncryptionType "EncryptionAtRestWithCustomerKey" -DiskEncryptionSetId $diskEncryptionSet.Id | Update-AzDisk -ResourceGroupName $rgName -DiskName $diskName
```

## Start the VM

Now that you've swapped the encryption type, you can start your VM again. The following command will start your VM:

```azurepowershell
Start-AzVM -ResourceGroupName $myResourceGroup -Name $myVM
```

## (Optional) Check encryption status
If you like, you can confirm that the encryption has completed with the following command:

[!INCLUDE [virtual-machines-disks-encryption-status-powershell](../../../includes/virtual-machines-disks-encryption-status-powershell.md)]

## Next steps

[Replicate machines with Customer-Managed Keys (CMK) enabled disks](../../site-recovery/azure-to-azure-how-to-enable-replication-cmk-disks.md)