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


3.	Since ADE and SSE are incompatible, you must disable Azure Disk Encryption on the VM. See these articles for instructions on disabling ADE for [Windows](windows/disk-encryption-windows.md#disable-encryption) or [Linux](linux/disk-encryption-linux.md#disable-encryption-for-linux-vms).

4.	Verify encryption status is 'NotEncrypted' with PowerShell or CLI (Note: do not remove the extension until encryption status changes from 'DecryptionInProgress' to 'NotEncrypted'. Progress message will say 'Disable Encryption completed successfully'.)

```azurepowershell
Get-AzVmDiskEncryptionStatus -ResourceGroupName "MyResourceGroup001" -VMName "VM001"
```

```azurecli
az vm encryption show --name MyVirtualMachine --resource-group MyResourceGroup
```

5.	Remove the Azure Disk Encryption extension (Set Name parameter in the cmdlet to "AzureDiskEncryption")

```azurepowershell
Remove-AzVMExtension -ResourceGroupName "ResourceGroup11" -Name "AzureiDskEncryption" -VMName "VirtualMachine22"
```

```azurecli
az vm extension delete -g MyResourceGroup --vm-name MyVm -n AzureiDskEncryption
```


6.	Stop the VM
7.	Set encryption type on disk to encryption at rest with CMK using Powershell or CLI or Portal using the DES and key vault from the step 1

```azurepowershell
$rgName = "yourResourceGroupName"
$diskName = "yourDiskName"
$diskEncryptionSetName = "yourDiskEncryptionSetName"
 
$diskEncryptionSet = Get-AzDiskEncryptionSet -ResourceGroupName $rgName -Name $diskEncryptionSetName
 
New-AzDiskUpdateConfig -EncryptionType "EncryptionAtRestWithCustomerKey" -DiskEncryptionSetId $diskEncryptionSet.Id | Update-AzDisk -ResourceGroupName $rgName -DiskName $diskName
```

```azurecli
rgName=yourResourceGroupName
diskName=yourDiskName
diskEncryptionSetName=yourDiskEncryptionSetName
 
az disk update -n $diskName -g $rgName --encryption-type EncryptionAtRestWithCustomerKey --disk-encryption-set $diskEncryptionSetId
```


8.	Start the VM
9.	[Optional] You can again check the status of SSE with CMK using PowerShell or CLI.
