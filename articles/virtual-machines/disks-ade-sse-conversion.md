---
title: Identify unattached Azure disks - Azure portal
description: How to find unattached Azure managed and unmanaged (VHDs/page blobs) disks by using the Azure portal.
author: roygara
ms.service: virtual-machines
ms.topic: how-to
ms.date: 06/19/2020
ms.author: rogarana
ms.subservice: disks
---

# Converting from ADE to SSE

## Prerequisite

Create a Key Vault and Disk Encryption Set for SSE+CMK  (Note: must be same subscription and region as the VM. This can be the same key vault and key used with ADE.) 

# [PowerShell](#tab/azure-powershell)

[!INCLUDE [virtual-machines-disks-encryption-create-key-vault-powershell](../../includes/virtual-machines-disks-encryption-create-key-vault-powershell.md)]

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [virtual-machines-disks-encryption-create-key-vault](../../includes/virtual-machines-disks-encryption-create-key-vault-cli.md)]

---

## Create a backup of the encrypted VMs or take a snapshot of the disks 

# [PowerShell](#tab/azure-powershell)

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

# [Azure CLI](#tab/azure-cli)

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

---

## Disable Azure Disk Encrypton

# [PowerShell](#tab/azure-powershell)

[!INCLUDE [disk-encryption-disable-encryption-powershell](../../includes/disk-encryption-disable-encryption-powershell.md)]

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [disk-encryption-disable-encryption-cli](../../includes/disk-encryption-disable-encryption-cli.md)]

---

## Verify encryption status

Verify encryption status is 'NotEncrypted' with PowerShell or CLI (Note: do not remove the extension until encryption status changes from 'DecryptionInProgress' to 'NotEncrypted'. Progress message will say 'Disable Encryption completed successfully'.)

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Get-AzVmDiskEncryptionStatus -ResourceGroupName "MyResourceGroup001" -VMName "VM001"
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az vm encryption show --name MyVirtualMachine --resource-group MyResourceGroup
```
---

## Remove the Azure Disk Encryption extension 

Use the following cmd to remove the Azure Disk Encryption extension from your VM.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzVMExtension -ResourceGroupName "ResourceGroup11" -Name "AzureiDskEncryption" -VMName "VirtualMachine22"
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az vm extension delete -g MyResourceGroup --vm-name MyVm -n AzureiDskEncryption
```

---

## Stop the VM

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Stop-AzVM -ResourceGroupName $myResourceGroup -Name $myVM
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az vm stop --resource-group myResourceGroup --name myVM
```

---
## Change disk encryption type

Set encryption type on disk to encryption at rest with CMK using Powershell or CLI or Portal using the DES and key vault from the step 1

# [PowerShell](#tab/azure-powershell)

```azurepowershell
$rgName = "yourResourceGroupName"
$diskName = "yourDiskName"
$diskEncryptionSetName = "yourDiskEncryptionSetName"
 
$diskEncryptionSet = Get-AzDiskEncryptionSet -ResourceGroupName $rgName -Name $diskEncryptionSetName
 
New-AzDiskUpdateConfig -EncryptionType "EncryptionAtRestWithCustomerKey" -DiskEncryptionSetId $diskEncryptionSet.Id | Update-AzDisk -ResourceGroupName $rgName -DiskName $diskName
```

# [Azure CLI](#tab/azure-cli)

```azurecli
rgName=yourResourceGroupName
diskName=yourDiskName
diskEncryptionSetName=yourDiskEncryptionSetName
 
az disk update -n $diskName -g $rgName --encryption-type EncryptionAtRestWithCustomerKey --disk-encryption-set $diskEncryptionSetId
```

---

## Start the VM

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Start-AzVM -ResourceGroupName $myResourceGroup -Name $myVM
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az vm start --resource-group myResourceGroup --name myVM
```

---

## [Optional] You can again check the status of SSE with CMK using PowerShell or CLI.
