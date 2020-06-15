---
title: Identify unattached Azure disks - Azure portal
description: How to find unattached Azure managed and unmanaged (VHDs/page blobs) disks by using the Azure portal.
author: roygara
ms.service: virtual-machines
ms.topic: how-to
ms.date: 06/01/2020
ms.author: rogarana
ms.subservice: disks
---

# Converting from ADE to SSE

1.	Prerequisite: Create a Key Vault and Disk Encryption Set for SSE+CMK  (Note: must be same subscription and region as the VM. This can be the same key vault and key used with ADE.) 

PowerShell

[!INCLUDE [virtual-machines-disks-encryption-create-key-vault-powershell](../../includes/virtual-machines-disks-encryption-create-key-vault-powershell.md)]

CLI

[!INCLUDE [virtual-machines-disks-encryption-create-key-vault](../../includes/virtual-machines-disks-encryption-create-key-vault-cli.md)]


2.	Create a backup of the encrypted VMs or take a snapshot of the disks 

CLI

```azurecli
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


3.	Disable Azure Disk Encryption on the VM
4.	Verify encryption status is 'NotEncrypted' with PowerShell or CLI (Note: do not remove the extension until encryption status changes from 'DecryptionInProgress' to 'NotEncrypted'. Progress message will say 'Disable Encryption completed successfully'.)
5.	Remove the Azure Disk Encryption extension (Set Name parameter in the cmdlet to "AzureDiskEncryption")
6.	Stop the VM
7.	Set encryption type on disk to encryption at rest with CMK using Powershell or CLI or Portal using the DES and key vault from the step 1
8.	Start the VM
9.	[Optional] You can again check the status of SSE with CMK using PowerShell or CLI.
