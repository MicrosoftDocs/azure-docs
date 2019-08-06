---
title: Encrypt disks on a Linux VM in Azure | Microsoft Docs
description: How to encrypt virtual disks on a Linux VM for enhanced security using the Azure CLI
services: virtual-machines-linux
documentationcenter: ''
author: cynthn
manager: gwallace
editor: ''
tags: azure-resource-manager

ms.assetid: 2a23b6fa-6941-4998-9804-8efe93b647b3
ms.service: virtual-machines-linux
ms.devlang: azurecli
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 10/30/2018
ms.author: cynthn

---
# How to encrypt a Linux virtual machine in Azure

For enhanced virtual machine (VM) security and compliance, virtual disks and the VM itself can be encrypted. VMs are encrypted using cryptographic keys that are secured in an Azure Key Vault. You control these cryptographic keys and can audit their use. This article details how to encrypt virtual disks on a Linux VM using the Azure CLI. 

## Launch Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. 

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also launch Cloud Shell in a separate browser tab by going to [https://shell.azure.com/bash](https://shell.azure.com/bash). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press enter to run it.

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0.30 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).

## Overview of disk encryption
Virtual disks on Linux VMs are encrypted at rest using [dm-crypt](https://wikipedia.org/wiki/Dm-crypt). There is no charge for encrypting virtual disks in Azure. Cryptographic keys are stored in Azure Key Vault using software-protection, or you can import or generate your keys in Hardware Security Modules (HSMs) certified to FIPS 140-2 level 2 standards. You retain control of these cryptographic keys and can audit their use. These cryptographic keys are used to encrypt and decrypt virtual disks attached to your VM. 

The process for encrypting a VM is as follows:

1. Create a cryptographic key in an Azure Key Vault.
1. Configure the cryptographic key to be usable for encrypting disks.
1. Enable disk encryption for your virtual disks.
1. The required cryptographic keys are requested from Azure Key Vault.
1. The virtual disks are encrypted using the provided cryptographic key.


## Requirements and limitations
Supported scenarios and requirements for disk encryption:

* The following Linux server SKUs - Ubuntu, CentOS, SUSE and SUSE Linux Enterprise Server (SLES), and Red Hat Enterprise Linux.
* All resources (such as Key Vault, Storage account, and VM) must be in the same Azure region and subscription.
* Standard A, D, DS, G, GS, etc., series VMs.
* Updating the cryptographic keys on an already encrypted Linux VM.

Disk encryption is not currently supported in the following scenarios:

* Basic tier VMs.
* VMs created using the Classic deployment model.
* Disabling OS disk encryption on Linux VMs.
* Use of custom Linux images.

For more information on supported scenarios and limitations, see [Azure Disk Encryption for IaaS VMs](../../security/azure-security-disk-encryption.md)


## Create an Azure Key Vault and keys
In the following examples, replace example parameter names with your own values. Example parameter names include *myResourceGroup*, *myKey*, and *myVM*.

The first step is to create an Azure Key Vault to store your cryptographic keys. Azure Key Vault can store keys, secrets, or passwords that allow you to securely implement them in your applications and services. For virtual disk encryption, you use Key Vault to store a cryptographic key that is used to encrypt or decrypt your virtual disks.

Enable the Azure Key Vault provider within your Azure subscription with [az provider register](/cli/azure/provider#az-provider-register) and create a resource group with [az group create](/cli/azure/group#az-group-create). The following example creates a resource group name *myResourceGroup* in the `eastus` location:

```azurecli-interactive
az provider register -n Microsoft.KeyVault
resourcegroup="myResourceGroup"
az group create --name $resourcegroup --location eastus
```

The Azure Key Vault containing the cryptographic keys and associated compute resources such as storage and the VM itself must reside in the same region. Create an Azure Key Vault with [az keyvault create](/cli/azure/keyvault#az-keyvault-create) and enable the Key Vault for use with disk encryption. Specify a unique Key Vault name for *keyvault_name* as follows:

```azurecli-interactive
keyvault_name=myvaultname$RANDOM
az keyvault create \
    --name $keyvault_name \
    --resource-group $resourcegroup \
    --location eastus \
    --enabled-for-disk-encryption True
```

You can store cryptographic keys using software or Hardware Security Model (HSM) protection. Using an HSM requires a premium Key Vault. There is an additional cost to creating a premium Key Vault rather than standard Key Vault that stores software-protected keys. To create a premium Key Vault, in the preceding step add `--sku Premium` to the command. The following example uses software-protected keys since you created a standard Key Vault.

For both protection models, the Azure platform needs to be granted access to request the cryptographic keys when the VM boots to decrypt the virtual disks. Create a cryptographic key in your Key Vault with [az keyvault key create](/cli/azure/keyvault/key#az-keyvault-key-create). The following example creates a key named *myKey*:

```azurecli-interactive
az keyvault key create \
    --vault-name $keyvault_name \
    --name myKey \
    --protection software
```


## Create a virtual machine
Create a VM with [az vm create](/cli/azure/vm#az-vm-create) and attach a 5Gb data disk. Only certain marketplace images support disk encryption. The following example creates a VM named *myVM* using an *Ubuntu 16.04 LTS* image:

```azurecli-interactive
az vm create \
    --resource-group $resourcegroup \
    --name myVM \
    --image Canonical:UbuntuServer:16.04-LTS:latest \
    --admin-username azureuser \
    --generate-ssh-keys \
    --data-disk-sizes-gb 5
```

SSH to your VM using the *publicIpAddress* shown in the output of the preceding command. Create a partition and filesystem, then mount the data disk. For more information, see [Connect to a Linux VM to mount the new disk](add-disk.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json#connect-to-the-linux-vm-to-mount-the-new-disk). Close your SSH session.


## Encrypt the virtual machine


Encrypt your VM with [az vm encryption enable](/cli/azure/vm/encryption#az-vm-encryption-enable):

```azurecli-interactive
az vm encryption enable \
    --resource-group $resourcegroup \
    --name myVM \
    --disk-encryption-keyvault $keyvault_name \
    --key-encryption-key myKey \
    --volume-type all
```

It takes some time for the disk encryption process to complete. Monitor the status of the process with [az vm encryption show](/cli/azure/vm/encryption#az-vm-encryption-show):

```azurecli-interactive
az vm encryption show --resource-group $resourcegroup --name myVM --query 'status'
```

When complete, the output will look similar to the following example:

```json
[
  {
    "code": "ProvisioningState/succeeded",
    "displayStatus": "Provisioning succeeded",
    "level": "Info",
    "message": "Encryption succeeded for all volumes",
    "time": null
  }
]
```


## Add additional data disks
Once you have encrypted your data disks, you can add additional virtual disks to your VM and encrypt them. 

Once the data disk has been added to the VM, rerun the command to encrypt the virtual disks as follows:

```azurecli-interactive
az vm encryption enable \
    --resource-group $resourcegroup \
    --name myVM \
    --disk-encryption-keyvault $keyvault_name \
    --key-encryption-key myKey \
    --volume-type data
```


## Next steps
* For more information about managing Azure Key Vault, including deleting cryptographic keys and vaults, see [Manage Key Vault using CLI](../../key-vault/key-vault-manage-with-cli2.md).
* For more information about disk encryption, such as preparing an encrypted custom VM to upload to Azure, see [Azure Disk Encryption](../../security/azure-security-disk-encryption.md).
