---
title: Identify unattached Azure disks - Azure portal
description: How to find unattached Azure managed and unmanaged (VHDs/page blobs) disks by using the Azure portal.
author: roygara
ms.service: virtual-machines-linux
ms.topic: how-to
ms.date: 06/19/2020
ms.author: rogarana
ms.subservice: disks
---

# Converting from ADE to SSE

## Prerequisite

Create a Key Vault and Disk Encryption Set for SSE+CMK  (Note: must be same subscription and region as the VM. This can be the same key vault and key used with ADE.) 


[!INCLUDE [virtual-machines-disks-encryption-create-key-vault-cli](../../../includes/virtual-machines-disks-encryption-create-key-vault-cli.md)]



## Create a backup of the encrypted VMs or take a snapshot of the disks 


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


## Disable Azure Disk Encrypton


[!INCLUDE [disk-encryption-disable-encryption-cli](../../../includes/disk-encryption-disable-encryption-cli.md)]

## Verify encryption status

Verify encryption status is 'NotEncrypted' with PowerShell or CLI (Note: do not remove the extension until encryption status changes from 'DecryptionInProgress' to 'NotEncrypted'. Progress message will say 'Disable Encryption completed successfully'.)

```azurecli
az vm encryption show --name MyVirtualMachine --resource-group MyResourceGroup
```


## Remove the Azure Disk Encryption extension 

Use the following cmd to remove the Azure Disk Encryption extension from your VM.

```azurecli
az vm extension delete -g MyResourceGroup --vm-name MyVm -n AzureiDskEncryption
```


## Stop the VM

```azurecli
az vm stop --resource-group myResourceGroup --name myVM
```

## Change disk encryption type

Set encryption type on disk to encryption at rest with CMK using Powershell or CLI or Portal using the DES and key vault from the step 1

```azurecli
rgName=yourResourceGroupName
diskName=yourDiskName
diskEncryptionSetName=yourDiskEncryptionSetName
 
az disk update -n $diskName -g $rgName --encryption-type EncryptionAtRestWithCustomerKey --disk-encryption-set $diskEncryptionSetId
```

## Start the VM


```azurecli
az vm start --resource-group myResourceGroup --name myVM
```

## [Optional] You can again check the status of SSE with CMK using PowerShell or CLI.
