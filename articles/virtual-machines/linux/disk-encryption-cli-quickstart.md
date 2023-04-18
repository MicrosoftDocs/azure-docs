---
title: Create and encrypt a Linux VM with Azure CLI
description: In this quickstart, you learn how to use Azure CLI to create and encrypt a Linux virtual machine
author: msmbaldwin
ms.author: mbaldwin
ms.service: virtual-machines
ms.collection: linux
ms.subservice: disks
ms.topic: quickstart
ms.date: 03/29/2023
ms.custom: devx-track-azurecli, mode-api
---

# Quickstart: Create and encrypt a Linux VM with the Azure CLI

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets 

The Azure CLI is used to create and manage Azure resources from the command line or in scripts. This quickstart shows you how to use the Azure CLI to create and encrypt a Linux virtual machine (VM).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

If you choose to install and use the Azure CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.30 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI]( /cli/azure/install-azure-cli).

## Create a resource group

Create a resource group with the [az group create](/cli/azure/group#az-group-create) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named *myResourceGroup* in the *eastus* location:

```azurecli-interactive
az group create --name "myResourceGroup" --location "eastus"
```

## Create a virtual machine

Create a VM with [az vm create](/cli/azure/vm#az-vm-create). The following example creates a VM named *myVM*.

```azurecli-interactive
az vm create \
    --resource-group "myResourceGroup" \
    --name "myVM" \
    --image "Canonical:UbuntuServer:20.04-LTS:latest" \
    --size "Standard_D2S_V3"\
    --generate-ssh-keys
```

> [!NOTE]
> Any [ADE supported Linux image version](/azure/virtual-machines/linux/disk-encryption-overview#supported-operating-systems) could be used instead of an Ubuntu VM. Replace `Canonical:UbuntuServer:20.04-LTS:latest` accordingly.

It takes a few minutes to create the VM and supporting resources. The following example output shows the VM create operation was successful.

```json
{
  "fqdns": "",
  "id": "/subscriptions/<guid>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM",
  "location": "eastus",
  "macAddress": "00-0D-3A-23-9A-49",
  "powerState": "VM running",
  "privateIpAddress": "10.0.0.4",
  "publicIpAddress": "52.174.34.95",
  "resourceGroup": "myResourceGroup"
}
```

## Create a Key Vault configured for encryption keys

Azure disk encryption stores its encryption key in an Azure Key Vault. Create a Key Vault with [az keyvault create](/cli/azure/keyvault#az-keyvault-create). To enable the Key Vault to store encryption keys, use the --enabled-for-disk-encryption parameter.

> [!Important]
> Every key vault must have a name that is unique across Azure. Replace \<your-unique-keyvault-name\> with the name you choose.

```azurecli-interactive
az keyvault create --name "<your-unique-keyvault-name>" --resource-group "myResourceGroup" --location "eastus" --enabled-for-disk-encryption
```

## Encrypt the virtual machine

Encrypt your VM with [az vm encryption](/cli/azure/vm/encryption), providing your unique Key Vault name to the --disk-encryption-keyvault parameter.

```azurecli-interactive
az vm encryption enable -g "MyResourceGroup" --name "myVM" --disk-encryption-keyvault "<your-unique-keyvault-name>"
```

After a moment the process will return, "The encryption request was accepted. Use 'show' command to monitor the progress.". The "show" command is [az vm show](/cli/azure/vm/encryption#az-vm-encryption-show).

```azurecli-interactive
az vm encryption show --name "myVM" -g "MyResourceGroup"
```

When encryption is enabled, you will see "EnableEncryption" in the returned output:

```output
"EncryptionOperation": "EnableEncryption"
```

## Clean up resources

When no longer needed, you can use the [az group delete](/cli/azure/group) command to remove the resource group, VM, and Key Vault. 

```azurecli-interactive
az group delete --name "myResourceGroup"
```

## Next steps

In this quickstart, you created a virtual machine, created a Key Vault that was enabled for encryption keys, and encrypted the VM.  Advance to the next article to learn more about more Azure Disk Encryption for Linux VMs.

> [!div class="nextstepaction"]
> [Azure Disk Encryption overview](disk-encryption-overview.md)
