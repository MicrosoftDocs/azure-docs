---
title: Migrate to server-side encryption - Azure CLI
description: How to migrate your managed disks using Azure Disk Encryption to server-side encryption using the Azure CLI.
author: roygara
ms.service: virtual-machines-linux
ms.topic: how-to
ms.date: 06/23/2020
ms.author: rogarana
ms.subservice: disks
---

# Migrate managed disks from ADE to SSE - Azure CLI

This article covers how to migrate managed disks from Azure Disk Encryption (ADE) to server-side encryption (SSE). To learn more about ADE or SSE, see our articles: [server-side encryption](disk-encryption.md) or [Azure Disk Encryption](disk-encryption-overview.md).

## Prerequisites

In order to convert to SSE with customer-managed keys, you must create a Key Vault and Disk Encryption Set. Both the Key Vault and the Disk Encryption Set must be in the same subscription and region as the VMs you want to migrate, they can be the same key vault and key that you used with ADE.

[!INCLUDE [virtual-machines-disks-encryption-create-key-vault-cli](../../../includes/virtual-machines-disks-encryption-create-key-vault-cli.md)]


## Create a backup of the encrypted VMs or take a snapshot of the disks 

Before you start the migration process, take a snapshot of your disks. So that you can revert to them just in case.

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


## Disable Azure Disk Encryption

Since ADE and SSE are incompatible, you must disable ADE to start the migration process.

[!INCLUDE [disk-encryption-disable-encryption-cli](../../../includes/disk-encryption-disable-encryption-cli.md)]

## Verify encryption status

Verify encryption status is 'NotEncrypted' with. (Note: do not remove the extension until encryption status changes from 'DecryptionInProgress' to 'NotEncrypted'. Progress message will say 'Disable Encryption completed successfully'.)

```azurecli
az vm encryption show --name MyVirtualMachine --resource-group MyResourceGroup
```


## Remove the Azure Disk Encryption extension 

Once you've confirmed the encryption status has changed and the encryption has been disabled, you can remove the ADE extension.

Use the following cmd to remove the Azure Disk Encryption extension from your VM.

```azurecli
az vm extension delete -g MyResourceGroup --vm-name MyVm -n AzureiDskEncryption
```


## Stop the VM

You must stop the VM in order to swap the encryption to SSE with customer-managed keys.

```azurecli
az vm stop --resource-group myResourceGroup --name myVM
```

## Change disk encryption type

Now that you've stopped the VM you can change your disks encryption type. Use the following command to change the encryption type, make sure to use the values for your disk encryption set and your key vault from earlier in this article:

```azurecli
rgName=yourResourceGroupName
diskName=yourDiskName
diskEncryptionSetName=yourDiskEncryptionSetName
 
az disk update -n $diskName -g $rgName --encryption-type EncryptionAtRestWithCustomerKey --disk-encryption-set $diskEncryptionSetId
```

## Start the VM

Now that you've swapped the encryption type, you can start your VM again. The following command will start your VM:

```azurecli
az vm start --resource-group myResourceGroup --name myVM
```

## [Optional] Check the status of your encryption

If you like, you can confirm that the encryption has completed with the following command:

[!INCLUDE [virtual-machines-disks-encryption-status-cli](../../../includes/virtual-machines-disks-encryption-status-cli.md)]

## Next steps

[Replicate machines with Customer-Managed Keys (CMK) enabled disks](../../site-recovery/azure-to-azure-how-to-enable-replication-cmk-disks.md)