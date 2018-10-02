---
title: Encrypt disks for Azure scale sets with the Azure CLI | Microsoft Docs
description: Learn how to use the Azure CLI to encrypt VM instances and attached disks in a Linux virtual machine scale set
services: virtual-machine-scale-sets
documentationcenter: ''
author: cynthn
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machine-scale-sets
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/30/2018
ms.author: cynthn

---
# Encrypt OS and attached data disks in a virtual machine scale set with the Azure CLI (Preview)

To protect and safeguard data at rest using industry standard encryption technology, virtual machine scale sets support Azure Disk Encryption (ADE). Encryption can be enabled for Linux and Windows virtual machine scale sets. For more information, see [Azure Disk Encryption for Linux and Windows](../security/azure-security-disk-encryption.md).

> [!NOTE]
>  Azure disk encryption for virtual machine scale sets is currently in public preview, available in all Azure public regions.

Azure disk encryption is supported:
- for scale sets created with managed disks, and not supported for native (or unmanaged) disk scale sets.
- for OS and data volumes in Windows scale sets. Disable encryption is supported for OS and Data volumes for Windows scale sets.
- for data volumes in Linux scale sets. OS disk encryption is NOT supported in the current preview for Linux scale sets.

Scale set VM reimage and upgrade operations are not supported in the current preview. The Azure disk encryption for virtual machine scale sets preview is recommended only in test environments. In the preview, do not enable disk encryption in production environments where you might need to upgrade an OS image in an encrypted scale set.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this tutorial requires that you are running the Azure CLI version 2.0.31 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).

## Register for disk encryption preview

The Azure disk encryption for virtual machine scale sets preview requires you to self-register your subscription with [az feature register](/cli/azure/feature#az_feature_register). You only need to perform the following steps the first time that you use the disk encryption preview feature:

```azurecli-interactive
az feature register --name UnifiedDiskEncryption --namespace Microsoft.Compute
```

It can take up to 10 minutes for the registration request to propagate. You can check on the registration state with [az feature show](/cli/azure/feature#az_feature_show). When the `State` reports *Registered*, re-register the *Mirosoft.Compute* provider with [az provider register](/cli/azure/provider#az_provider_register):

```azurecli-interactive
az provider register --namespace Microsoft.Compute
```

## Create a scale set

Before you can create a scale set, create a resource group with [az group create](/cli/azure/group#az_group_create). The following example creates a resource group named *myResourceGroup* in the *eastus* location:

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

Now create a virtual machine scale set with [az vmss create](/cli/azure/vmss#az_vmss_create). The following example creates a scale set named *myScaleSet* that is set to automatically update as changes are applied, and generates SSH keys if they do not exist in *~/.ssh/id_rsa*. A 32Gb data disk is attached to each VM instance, and the Azure [Custom Script Extension](../virtual-machines/linux/extensions-customscript.md) is used to prepare the data disks with [az vmss extension set](/cli/azure/vmss/extension#az_vmss_extension_set):

```azurecli-interactive
# Create a scale set with attached data disk
az vmss create \
  --resource-group myResourceGroup \
  --name myScaleSet \
  --image UbuntuLTS \
  --upgrade-policy-mode automatic \
  --admin-username azureuser \
  --generate-ssh-keys \
  --data-disk-sizes-gb 32

# Prepare the data disk for use with the Custom Script Extension
az vmss extension set \
  --publisher Microsoft.Azure.Extensions \
  --version 2.0 \
  --name CustomScript \
  --resource-group myResourceGroup \
  --vmss-name myScaleSet \
  --settings '{"fileUris":["https://raw.githubusercontent.com/Azure-Samples/compute-automation-configurations/master/prepare_vm_disks.sh"],"commandToExecute":"./prepare_vm_disks.sh"}'
```

It takes a few minutes to create and configure all the scale set resources and VMs.

## Create an Azure key vault enabled for disk encryption

Azure Key Vault can store keys, secrets, or passwords that allow you to securely implement them in your applications and services. Cryptographic keys are stored in Azure Key Vault using software-protection, or you can import or generate your keys in Hardware Security Modules (HSMs) certified to FIPS 140-2 level 2 standards. These cryptographic keys are used to encrypt and decrypt virtual disks attached to your VM. You retain control of these cryptographic keys and can audit their use.

Define your own unique *keyvault_name*. Then, create a KeyVault with [az keyvault create](/cli/azure/ext/keyvault-preview/keyvault#ext-keyvault-preview-az-keyvault-create) in the same subscription and region as the scale set, and set the *--enabled-for-disk-encryption* access policy.

```azurecli-interactive
# Provide your own unique Key Vault name
keyvault_name=myuniquekeyvaultname

# Create Key Vault
az keyvault create --resource-group myResourceGroup --name $keyvault_name --enabled-for-disk-encryption
```

### Use an existing Key Vault

This step is only required if you have an existing Key Vault that you wish to use with disk encryption. Skip this step if you created a Key Vault in the previous section.

Define your own unique *keyvault_name*. Then, updated your KeyVault with [az keyvault update](/cli/azure/ext/keyvault-preview/keyvault#ext-keyvault-preview-az-keyvault-update) and set the *--enabled-for-disk-encryption* access policy.

```azurecli-interactive
# Provide your own unique Key Vault name
keyvault_name=myuniquekeyvaultname

# Create Key Vault
az keyvault update --name $keyvault_name --enabled-for-disk-encryption
```

## Enable encryption

To encrypt VM instances in a scale set, first get some information on the Key Vault resource ID with [az keyvault show](/cli/azure/ext/keyvault-preview/keyvault#ext-keyvault-preview-az-keyvault-show). These variables are used to then start the encryption process with [az vmss encryption enable](/cli/azure/vmss/encryption#az-vmss-encryption-enable):

```azurecli-interactive
# Get the resource ID of the Key Vault
vaultResourceId=$(az keyvault show --resource-group myResourceGroup --name $keyvault_name --query id -o tsv)

# Enable encryption of the data disks in a scale set
az vmss encryption enable \
    --resource-group myResourceGroup \
    --name myScaleSet \
    --disk-encryption-keyvault $vaultResourceId \
    --volume-type DATA
```

It may take a minute or two for the encryption process to start.

As the scale set is upgrade policy on the scale set created in an earlier step is set to *automatic*, the VM instances automatically start the encryption process. On scale sets where the upgrade policy is to manual, start the encryption policy on the VM instances with [az vmss update-instances](/cli/azure/vmss#az-vmss-update-instances).

## Check encryption progress

To check on the status of disk encryption, use [az vmss encryption show](/cli/azure/vmss/encryption#az-vmss-encryption-show):

```azurecli-interactive
az vmss encryption show --resource-group myResourceGroup --name myScaleSet
```

When VM instances are encrypted, the status code reports *EncryptionState/encrypted*, as shown in the following example output:

```bash
[
  {
    "disks": [
      {
        "encryptionSettings": null,
        "name": "myScaleSet_myScaleSet_0_disk2_3f39c2019b174218b98b3dfae3424e69",
        "statuses": [
          {
            "additionalProperties": {},
            "code": "EncryptionState/encrypted",
            "displayStatus": "Encryption is enabled on disk",
            "level": "Info",
            "message": null,
            "time": null
          }
        ]
      }
    ],
    "id": "/subscriptions/guid/resourceGroups/MYRESOURCEGROUP/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet/virtualMachines/0",
    "resourceGroup": "MYRESOURCEGROUP"
  }
]
```

## Disable encryption

If you no longer wish to use encrypted VM instances disks, you can disable encryption with [az vmss encryption disable](/cli/azure/vmss/encryption?view=azure-cli-latest#az-vmss-encryption-disable) as follows:

```azurecli-interactive
az vmss encryption disable --resource-group myResourceGroup --name myScaleSet
```

## Next steps

In this article, you used the Azure CLI to encrypt a virtual machine scale set. You can also use [Azure PowerShell](virtual-machine-scale-sets-encrypt-disks-ps.md) or templates for [Windows](https://github.com/Azure/azure-quickstart-templates/tree/master/201-encrypt-vmss-windows-jumpbox) or [Linux](https://github.com/Azure/azure-quickstart-templates/tree/master/201-encrypt-vmss-linux-jumpbox).

An end-to-end batch file example for Linux scale set data disk encryption can be found [here](https://gist.githubusercontent.com/ejarvi/7766dad1475d5f7078544ffbb449f29b/raw/03e5d990b798f62cf188706221ba6c0c7c2efb3f/enable-linux-vmss.bat). This example creates a resource group, Linux scale set, mounts a 5-GB data disk, and encrypts the virtual machine scale set.