---
title: Create and encrypt a Windows VM with Azure PowerShell
description: In this quickstart, you learn how to use Azure PowerShell to create and encrypt a Windows virtual machine
author: msmbaldwin
ms.author: mbaldwin
ms.service: virtual-machines
ms.subservice: disks
ms.collection: windows
ms.topic: quickstart
ms.date: 01/04/2023
ms.custom: devx-track-azurepowershell, mode-api
---

# Quickstart: Create and encrypt a Windows virtual machine in Azure with PowerShell

**Applies to:** :heavy_check_mark: Windows VMs 

The Azure PowerShell module is used to create and manage Azure resources from the PowerShell command line or in scripts. This quickstart shows you how to use the Azure PowerShell module to create a Windows virtual machine (VM), create a Key Vault for the storage of encryption keys, and encrypt the VM. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create a resource group

Create an Azure resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). A resource group is a logical container into which Azure resources are deployed and managed:

```powershell
New-AzResourceGroup -Name "myResourceGroup" -Location "EastUS"
```

## Create a virtual machine

Create an Azure virtual machine with [New-AzVM](/powershell/module/az.compute/new-azvm). You must supply credentials to the cmdlet. 

```powershell
$cred = Get-Credential 

New-AzVM -Name MyVm -Credential $cred -ResourceGroupName MyResourceGroup -Image win2016datacenter -Size Standard_D2S_V3
```

It will take a few minutes for your VM to be deployed. 

## Create a Key Vault configured for encryption keys

Azure disk encryption stores its encryption key in an Azure Key Vault. Create a Key Vault with [New-AzKeyvault](/powershell/module/az.keyvault/new-azkeyvault). To enable the Key Vault to store encryption keys, use the -EnabledForDiskEncryption parameter.

> [!Important]
> Each Key Vault must have a unique name. The following example creates a Key Vault named *myKV*, but you must name yours something different.

```powershell
New-AzKeyvault -name MyKV -ResourceGroupName myResourceGroup -Location EastUS -EnabledForDiskEncryption
```

## Encrypt the virtual machine

Encrypt your VM with [Set-AzVmDiskEncryptionExtension](/powershell/module/az.compute/set-azvmdiskencryptionextension). 

Set-AzVmDiskEncryptionExtension requires some values from your Key Vault object. You can obtain these values by passing the unique name of your key vault to [Get-AzKeyvault](/powershell/module/az.keyvault/get-azkeyvault).

```powershell
$KeyVault = Get-AzKeyVault -VaultName MyKV -ResourceGroupName MyResourceGroup

Set-AzVMDiskEncryptionExtension -ResourceGroupName MyResourceGroup -VMName MyVM -DiskEncryptionKeyVaultUrl $KeyVault.VaultUri -DiskEncryptionKeyVaultId $KeyVault.ResourceId
```

After a few minutes the process will return the following output:

```
RequestId IsSuccessStatusCode StatusCode ReasonPhrase
--------- ------------------- ---------- ------------
                         True         OK OK
```

You can verify the encryption process by running [Get-AzVmDiskEncryptionStatus](/powershell/module/az.compute/Get-AzVMDiskEncryptionStatus).

```powershell
Get-AzVmDiskEncryptionStatus -VMName MyVM -ResourceGroupName MyResourceGroup
```

When encryption is enabled, you will see the following fields in the returned output:

```
OsVolumeEncrypted          : Encrypted
DataVolumesEncrypted       : NoDiskFound
OsVolumeEncryptionSettings : Microsoft.Azure.Management.Compute.Models.DiskEncryptionSettings
ProgressMessage            : Provisioning succeeded
```

## Clean up resources

When no longer needed, you can use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) cmdlet to remove the resource group, VM, and all related resources:

```powershell
Remove-AzResourceGroup -Name "myResourceGroup"
```

## Next steps

In this quickstart, you created a virtual machine, created a Key Vault that was enable for encryption keys, and encrypted the VM.  Advance to the next article to learn more about Azure Disk Encryption prerequisites for IaaS VMs.

> [!div class="nextstepaction"]
> [Azure Disk Encryption overview](disk-encryption-overview.md)
