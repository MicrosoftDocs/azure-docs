---
title: Encrypt disks on a Windows VM in Azure | Microsoft Docs
description: Encrypt virtual disks on a Windows VM for enhanced security by using Azure PowerShell
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: gwallace
editor: ''
tags: azure-resource-manager

ms.assetid:
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 10/30/2018
ms.author: cynthn

---
# Encrypt virtual disks on a Windows VM
For enhanced virtual machine (VM) security and compliance, virtual disks in Azure can be encrypted. Disks are encrypted by using cryptographic keys that are secured in an Azure Key Vault. You control these cryptographic keys and can audit their use. This article describes how to encrypt virtual disks on a Windows VM by using Azure PowerShell. You can also [encrypt a Linux VM by using the Azure CLI](../linux/encrypt-disks.md).

[!INCLUDE [updated-for-az.md](../../../includes/updated-for-az.md)]

## Overview of disk encryption
Virtual disks on Windows VMs are encrypted at rest by using BitLocker. There's no charge for encrypting virtual disks in Azure. Cryptographic keys are stored in an Azure Key Vault by using software protection, or you can import or generate your keys in Hardware Security Modules (HSMs) certified to FIPS 140-2 level 2 standards. Cryptographic keys are used to encrypt and decrypt virtual disks attached to your VM. You keep control of these cryptographic keys and can audit their use. 

The process for encrypting a VM is as follows:

1. Create a cryptographic key in an Azure Key Vault.
1. Configure the cryptographic key to be usable for encrypting disks.
1. Enable disk encryption for your virtual disks.
1. The required cryptographic keys are requested from Azure Key Vault.
1. The virtual disks are encrypted using the provided cryptographic key.


## Requirements and limitations

Supported scenarios and requirements for disk encryption:

* Enabling encryption on new Windows VMs from Azure Marketplace images or custom VHD images.
* Enabling encryption on existing Windows VMs in Azure.
* Enabling encryption on Windows VMs that are configured by using Storage Spaces.
* Disabling encryption on OS and data drives for Windows VMs.
* Standard tier VMs, such as A, D, DS, G, and GS series VMs.

    > [!NOTE]
    > All resources (including the Key Vault, Storage account, and VM) must be in the same Azure region and subscription.

Disk encryption isn't currently supported in the following scenarios:

* Basic tier VMs.
* VMs created by using the Classic deployment model.
* Updating the cryptographic keys on an already encrypted VM.
* Integration with on-premises Key Management Service.


## Create an Azure Key Vault and keys
Before you start, make sure the latest version of the Azure PowerShell module has been installed. For more information, see [How to install and configure Azure PowerShell](/powershell/azure/overview). In the following command examples, replace all example parameters with your own names, location, and key values, such as *myResourceGroup*, *myKeyVault*, *myVM*, and so forth.

The first step is to create an Azure Key Vault to store your cryptographic keys. Azure Key Vaults can store keys, secrets, or passwords that allow you to securely implement them in your applications and services. For virtual disk encryption, you'll create a Key Vault to store a cryptographic key that is used to encrypt or decrypt your virtual disks. 

Enable the Azure Key Vault provider within your Azure subscription with [Register-AzResourceProvider](https://docs.microsoft.com/powershell/module/az.resources/register-azresourceprovider), then create a resource group with [New-AzResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/new-azresourcegroup). The following example creates a resource group name *myResourceGroup* in the *East US* location:

```azurepowershell-interactive
$rgName = "myResourceGroup"
$location = "East US"

Register-AzResourceProvider -ProviderNamespace "Microsoft.KeyVault"
New-AzResourceGroup -Location $location -Name $rgName
```

The Azure Key Vault holding the cryptographic keys and associated compute resources such as storage and the VM itself must all be in the same region. Create an Azure Key Vault with [New-AzKeyVault](https://docs.microsoft.com/powershell/module/az.keyvault/new-azkeyvault) and enable the Key Vault for use with disk encryption. Specify a unique Key Vault name for *keyVaultName* as follows:

```azurepowershell-interactive
$keyVaultName = "myKeyVault$(Get-Random)"
New-AzKeyVault -Location $location `
    -ResourceGroupName $rgName `
    -VaultName $keyVaultName `
    -EnabledForDiskEncryption
```

You can store cryptographic keys by using either software or Hardware Security Model (HSM) protection.  A standard Key Vault only stores software-protected keys. Using an HSM requires a premium Key Vault at an additional cost. To create a premium Key Vault, in the preceding step add the *-Sku "Premium"* parameter. The following example uses software-protected keys since we created a standard Key Vault. 

For both protection models, the Azure platform needs to be granted access to request the cryptographic keys when the VM boots to decrypt the virtual disks. Create a cryptographic key in your Key Vault with [Add-AzureKeyVaultKey](https://docs.microsoft.com/powershell/module/az.keyvault/add-azkeyvaultkey). The following example creates a key named *myKey*:

```azurepowershell-interactive
Add-AzKeyVaultKey -VaultName $keyVaultName `
    -Name "myKey" `
    -Destination "Software"
```

## Create a virtual machine
To test the encryption process, create a VM with [New-AzVm](https://docs.microsoft.com/powershell/module/az.compute/new-azvm). The following example creates a VM named *myVM* using a *Windows Server 2016 Datacenter* image. When prompted for credentials, enter the username and password to be used for your VM:

```azurepowershell-interactive
$cred = Get-Credential

New-AzVm `
    -ResourceGroupName $rgName `
    -Name "myVM" `
    -Location $location `
    -VirtualNetworkName "myVnet" `
    -SubnetName "mySubnet" `
    -SecurityGroupName "myNetworkSecurityGroup" `
    -PublicIpAddressName "myPublicIpAddress" `
    -Credential $cred
```


## Encrypt a virtual machine
Encrypt your VM with [Set-AzVMDiskEncryptionExtension](https://docs.microsoft.com/powershell/module/az.compute/set-azvmdiskencryptionextension) using the Azure Key Vault key. The following example retrieves all the key information then encrypts the VM named *myVM*:

```azurepowershell-interactive
$keyVault = Get-AzKeyVault -VaultName $keyVaultName -ResourceGroupName $rgName;
$diskEncryptionKeyVaultUrl = $keyVault.VaultUri;
$keyVaultResourceId = $keyVault.ResourceId;
$keyEncryptionKeyUrl = (Get-AzKeyVaultKey -VaultName $keyVaultName -Name myKey).Key.kid;

Set-AzVMDiskEncryptionExtension -ResourceGroupName $rgName `
    -VMName "myVM" `
    -DiskEncryptionKeyVaultUrl $diskEncryptionKeyVaultUrl `
    -DiskEncryptionKeyVaultId $keyVaultResourceId `
    -KeyEncryptionKeyUrl $keyEncryptionKeyUrl `
    -KeyEncryptionKeyVaultId $keyVaultResourceId
```

Accept the prompt to continue with the VM encryption. The VM restarts during the process. Once the encryption process completes and the VM has rebooted, review the encryption status with [Get-AzVmDiskEncryptionStatus](https://docs.microsoft.com/powershell/module/az.compute/get-azvmdiskencryptionstatus):

```azurepowershell-interactive
Get-AzVmDiskEncryptionStatus  -ResourceGroupName $rgName -VMName "myVM"
```

The output is similar to the following example:

```azurepowershell-interactive
OsVolumeEncrypted          : Encrypted
DataVolumesEncrypted       : Encrypted
OsVolumeEncryptionSettings : Microsoft.Azure.Management.Compute.Models.DiskEncryptionSettings
ProgressMessage            : OsVolume: Encrypted, DataVolumes: Encrypted
```

## Next steps
* For more information about managing an Azure Key Vault, see [Set up a Key Vault for virtual machines](key-vault-setup.md).
* For more information about disk encryption, such as preparing an encrypted custom VM to upload to Azure, see [Azure Disk Encryption](../../security/azure-security-disk-encryption.md).
