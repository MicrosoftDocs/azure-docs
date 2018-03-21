---
title: Azure Virtual Machine Scale Sets Encrypt Disks | Microsoft Docs
description: Learn how to encrypt attached disks in virtual machine scale sets.
services: virtual-machine-scale-sets
documentationcenter: ''
author: iainfoulds
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machine-scale-sets
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/26/2018
ms.author: iainfou

---
# Encrypt OS and attached data disks in a virtual machine scale set
Azure [virtual machine scale sets](/azure/virtual-machine-scale-sets/) supports Azure disk encryption (ADE).  Azure disk encryption can be enabled for Windows and Linux virtual machine scale sets to protect and safeguard the scale sets data at rest using industry standard encryption technology. For more information, read Azure Disk Encryption for Windows and Linux virtual machines.

> [!NOTE]
>  Azure disk encryption for virtual machine scale sets is currently in public preview, available in all Azure public regions.

Azure disk encryption is supported:
- for scale sets created with managed disks, and not supported for native (or unmanaged) disk scale sets.
- for OS and data volumes in Windows scale sets. Disable encryption is supported for OS and Data volumes for Windows scale sets.
- for data volumes in Linux scale sets. OS disk encryption is NOT supported in the current preview for Linux scale sets.

Scale set VM reimage and upgrade operations are not supported in the current preview. The Azure disk encryption for virtual machine scale sets preview is recommended only in test environments. In the preview, do not enable disk encryption in production environments where you might need to upgrade an OS image in an encrypted scale set.

## Prerequisites
Install the latest versions of [Azure Powershell](https://github.com/Azure/azure-powershell/releases), which contains the encryption commands.

The Azure disk encryption for virtual machine scale sets preview requires you to self-register your subscription using the following PowerShell commands: 

```powershell
Login-AzureRmAccount
Register-AzureRmProviderFeature -ProviderNamespace Microsoft.Compute -FeatureName "UnifiedDiskEncryption"
```

Wait around 10 minutes until the 'Registered' state is returned by the following command: 

```powershell
Get-AzureRmProviderFeature -ProviderNamespace "Microsoft.Compute" -FeatureName "UnifiedDiskEncryption"
Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Compute
```

## Create an Azure key vault enabled for disk encryption
Create a new key vault in the same subscription and region as the scale set and set the 'EnabledForDiskEncryption' access policy.

```powershell
$rgname="windatadiskencryptiontest"
$VaultName="encryptionvault321"

New-AzureRmKeyVault -VaultName $VaultName -ResourceGroupName $rgName -Location southcentralus -EnabledForDiskEncryption
``` 

Or, enable an existing key vault in the same subscription and region as the scale set for disk encryption.

```powershell
$VaultName="encryptionvault321"
Set-AzureRmKeyVaultAccessPolicy -VaultName $VaultName -EnabledForDiskEncryption
```

## Enable encryption
The following commands encrypt a data disk in a running scale set using a key vault in the same resource group. You can also use templates to encrypt disks in a running [Windows scale set](https://github.com/Azure/azure-quickstart-templates/tree/master/201-encrypt-vmss-windows-jumpbox) or [Linux scale set](https://github.com/Azure/azure-quickstart-templates/tree/master/201-encrypt-vmss-linux-jumpbox).

```powershell
$rgname="windatadiskencryptiontest"
$VmssName="nt1vm"
$DiskEncryptionKeyVaultUrl="https://encryptionvault321.vault.azure.net"
$KeyVaultResourceId="/subscriptions/0754ecc2-d80d-426a-902c-b83f4cfbdc95/resourceGroups/windatadiskencryptiontest/providers/Microsoft.KeyVault/vaults/encryptionvault321"

Set-AzureRmVmssDiskEncryptionExtension -ResourceGroupName $rgName -VMScaleSetName $VmssName `
    -DiskEncryptionKeyVaultUrl $DiskEncryptionKeyVaultUrl -DiskEncryptionKeyVaultId $KeyVaultResourceId –VolumeType Data
```

## Check encryption progress
Use the following commands to show encryption status of the scale set.

```powershell
$rgname="windatadiskencryptiontest"
$VmssName="nt1vm"
Get-AzureRmVmssDiskEncryption -ResourceGroupName $rgName -VMScaleSetName $VmssName

Get-AzureRmVmssVMDiskEncryption -ResourceGroupName $rgName -VMScaleSetName $VmssName -InstanceId "4"
```

## Disable encryption
Disable encryption on a running virtual machine scale set using the following commands. You can also use templates to disable encryption in a running [Windows scale set](https://github.com/Azure/azure-quickstart-templates/tree/master/201-decrypt-vmss-windows) or [Linux scale set](https://github.com/Azure/azure-quickstart-templates/tree/master/201-decrypt-vmss-linux).

```powershell
$rgname="windatadiskencryptiontest"
$VmssName="nt1vm"
Disable-AzureRmVmssDiskEncryption -ResourceGroupName $rgName -VMScaleSetName $VmssName
```
