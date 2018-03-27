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
Azure [virtual machine scale sets](/azure/virtual-machine-scale-sets/) support Azure disk encryption (ADE).  Azure disk encryption can be enabled for Windows and Linux virtual machine scale sets to protect and safeguard the scale sets data at rest using industry standard encryption technology. For more information, read Azure Disk Encryption for Windows and Linux virtual machines.

> [!NOTE]
>  Azure disk encryption for virtual machine scale sets is currently in public preview, available in all Azure public regions.

Azure disk encryption is supported:
- for scale sets created with managed disks, and not supported for native (or unmanaged) disk scale sets.
- for OS and data volumes in Windows scale sets. Disable encryption is supported for OS and Data volumes for Windows scale sets.
- for data volumes in Linux scale sets. OS disk encryption is NOT supported in the current preview for Linux scale sets.

Scale set VM reimage and upgrade operations are not supported in the current preview. The Azure disk encryption for virtual machine scale sets preview is recommended only in test environments. In the preview, do not enable disk encryption in production environments where you might need to upgrade an OS image in an encrypted scale set.

An end-to-end batch file example for Linux scale set data disk encryption can be found [here](https://gist.githubusercontent.com/ejarvi/7766dad1475d5f7078544ffbb449f29b/raw/03e5d990b798f62cf188706221ba6c0c7c2efb3f/enable-linux-vmss.bat).  This example creates a resource group, Linux scale set, mounts a 5-GB data disk, and encrypts the virtual machine scale set.

## Prerequisites
Install the latest versions of [Azure Powershell](https://github.com/Azure/azure-powershell/releases) or [Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest), which contain the encryption commands.

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

```azurecli
rgname="linuxdatadiskencryptiontest"
VaultName="encryptionvault321"

az keyvault create --name $VaultName --resource-group $rgname --enabled-for-disk-encryption
```

Or, enable an existing key vault in the same subscription and region as the scale set for disk encryption.

```azurecli
VaultName="encryptionvault321"
az keyvault update --name $VaultName --enabled-for-disk-encryption
```

## Enable encryption

The following commands encrypt a data disk in a running scale set using a key vault in the same resource group. You can also use templates to encrypt disks in a running [Windows scale set](https://github.com/Azure/azure-quickstart-templates/tree/master/201-encrypt-vmss-windows-jumpbox) or [Linux scale set](https://github.com/Azure/azure-quickstart-templates/tree/master/201-encrypt-vmss-linux-jumpbox).

```azurecli
ResourceGroup="linuxdatadiskencryptiontest"
VmssName="nt1vm"
EncryptionKeyVaultUrl="https://encryptionvaultlinuxsf.vault.azure.net"
VaultResourceId="/subscriptions/0754ecc2-d80d-426a-902c-b83f4cfbdc95/resourceGroups/linuxdatadiskencryptiontest/providers/Microsoft.KeyVault/vaults/encryptionvaultlinuxsf"

az vmss encryption enable -g $ResourceGroup -n $VmssName --disk-encryption-keyvault $VaultResourceId --volume-type DATA
az vmss update-instances -g $ResourceGroup -n $VmssName --instance-ids *
```

## Check encryption progress

Use the following commands to show encryption status of the scale set.

```azurecli
ResourceGroup="linuxdatadiskencryptiontest"
VmssName="nt1vm"

az vmss encryption show -g $ResourceGroup -n $VmssName
```

## Disable encryption
Disable encryption on a running virtual machine scale set using the following commands. You can also use templates to disable encryption in a running [Windows VM scale set](https://github.com/Azure/azure-quickstart-templates/tree/master/201-decrypt-vmss-windows) or [Linux VM scale set](https://github.com/Azure/azure-quickstart-templates/tree/master/201-decrypt-vmss-linux).

```azurecli
ResourceGroup="linuxdatadiskencryptiontest"
VmssName="nt1vm"

az vmss encryption disable -g $ResourceGroup -n $VmssName
```

