---
title: Azure CLI Script Sample - Encrypt a Linux VM | Microsoft Docs
description: Azure CLI Script Sample - Encrypt a Linux VM 
services: virtual-machines-linux
documentationcenter: virtual-machines
author: cynthn
manager: gwallace
editor: tysonn
tags: azure-resource-manager

ms.assetid:
ms.service: virtual-machines-linux
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 12/15/2017
ms.author: cynthn
ms.custom: mvc
---

# Encrypt a Linux virtual machine in Azure

This script creates a secure Azure Key Vault, encryption keys, Azure Active Directory service principal, and a Linux virtual machine (VM). The VM is then encrypted using the encryption key from Key Vault and service principal credentials.

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Sample script

[!code-azurecli-interactive[main](../../../cli_scripts/virtual-machine/encrypt-disks/encrypt_vm.sh "Encrypt VM disks")]

## Clean up deployment 

Run the following command to remove the resource group, VM, and all related resources.

```azurecli
az group delete --name myResourceGroup
```

## Script explanation

This script uses the following commands to create a resource group, Azure Key Vault, service principal, virtual machine, and all related resources. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az group create](https://docs.microsoft.com/cli/azure/group) | Creates a resource group in which all resources are stored. |
| [az keyvault create](https://docs.microsoft.com/cli/azure/keyvault) | Creates an Azure Key Vault to store secure data such as encryption keys. |
| [az keyvault key create](https://docs.microsoft.com/cli/azure/keyvault/key) | Creates an encryption key in Key Vault. |
| [az ad sp create-for-rbac](https://docs.microsoft.com/cli/azure/ad/sp) | Creates an Azure Active Directory service principal to securely authenticate and control access to encryption keys. |
| [az keyvault set-policy](https://docs.microsoft.com/cli/azure/keyvault) | Sets permissions on the Key Vault to grant the service principal access to encryption keys. |
| [az vm create](https://docs.microsoft.com/cli/azure/vm) | Creates the virtual machine and connects it to the network card, virtual network, subnet, and NSG. This command also specifies the virtual machine image to be used, and administrative credentials.  |
| [az vm encryption enable](https://docs.microsoft.com/cli/azure/vm/encryption) | Enables encryption on a VM using the service principal credentials and encryption key. |
| [az vm encryption show](https://docs.microsoft.com/cli/azure/vm/encryption) | Shows the status of the VM encryption process. |
| [az group delete](https://docs.microsoft.com/cli/azure/vm/extension) | Deletes a resource group including all nested resources. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional virtual machine CLI script samples can be found in the [Azure Linux VM documentation](../linux/cli-samples.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).
