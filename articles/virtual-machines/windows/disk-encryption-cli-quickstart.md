---
title: Create and encrypt a Windows VM with Azure CLI
description: In this quickstart, you learn how to use Azure CLI to create and encrypt a Windows virtual machine
author: msmbaldwin
ms.author: mbaldwin
ms.service: virtual-machines
ms.subservice: disks
ms.collection: windows
ms.topic: quickstart
ms.date: 01/04/2023
ms.custom: devx-track-azurecli, mode-api
---

# Quickstart: Create and encrypt a Windows VM with the Azure CLI

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets 

The Azure CLI is used to create and manage Azure resources from the command line or in scripts. This quickstart shows you how to use the Azure CLI to create and encrypt a Windows Server 2016 virtual machine (VM).

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0.30 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

Create a resource group with the [az group create](/cli/azure/group#az-group-create) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named *myResourceGroup* in the *eastus* location:

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

## Create a virtual machine

Create a VM with [az vm create](/cli/azure/vm#az-vm-create). The following example creates a VM named *myVM*. This example uses *azureuser* for an administrative user name and *myPassword12* as the password.

```azurecli-interactive
az vm create \
    --resource-group myResourceGroup \
    --name myVM \
    --image win2016datacenter \
    --admin-username azureuser \
    --admin-password myPassword12
```

It takes a few minutes to create the VM and supporting resources. The following example output shows the VM create operation was successful.

```console
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

Azure disk encryption stores its encryption key in an Azure Key Vault. Create a Key Vault with [az keyvault create](/cli/azure/keyvault#az-keyvault-create). To enable the Key Vault to store encryption keys, use the--enabled-for-disk-encryption parameter.
> [!Important]
> Each Key Vault must have a unique name. This example creates a Key Vault named *myKV*, but you must name yours something different.

```azurecli-interactive
az keyvault create --name "myKV" --resource-group "myResourceGroup" --location eastus --enabled-for-disk-encryption
```

## Encrypt the virtual machine

Encrypt your VM with [az vm encryption](/cli/azure/vm/encryption), providing your unique Key Vault name to the --disk-encryption-keyvault parameter.

```azurecli-interactive
az vm encryption enable -g MyResourceGroup --name MyVM --disk-encryption-keyvault myKV
```

You can verify that encryption is enabled on your VM with [az vm show](/cli/azure/vm/encryption#az-vm-encryption-show)

```azurecli-interactive
az vm encryption show --name MyVM -g MyResourceGroup
```

You will see the following in the returned output:

```console
"EncryptionOperation": "EnableEncryption"
```

## Clean up resources

When no longer needed, you can use the [az group delete](/cli/azure/group) command to remove the resource group, VM, and Key Vault.

```azurecli-interactive
az group delete --name myResourceGroup
```

## Next steps

In this quickstart, you created a virtual machine, created a Key Vault that was enabled for encryption keys, and encrypted the VM.  Advance to the next article to learn more about Azure Disk Encryption prerequisites for IaaS VMs.

> [!div class="nextstepaction"]
> [Azure Disk Encryption overview](disk-encryption-overview.md)
