---
title: Azure Quick Start - Create VM CLI | Microsoft Docs
description: Quickly learn to create virtual machines with the Azure CLI.
services: virtual-machines-linux
documentationcenter: virtual-machines
author: neilpeterson
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 03/08/2017
ms.author: nepeters
---

# Create a Linux virtual machine with the Azure CLI 2.0

The Azure CLI 2.0 is used to create and manage Azure resources from the command line or in scripts. This guide details using the Azure CLI to deploy a virtual machine running Ubuntu 14.04 LTS.

Before you start, make sure that the Azure CLI has been installed. For more information, see [Azure CLI installation guide](https://docs.microsoft.com/cli/azure/install-azure-cli). 

## Create a virtual machine

Log in to your Azure subscription with the [az login](/cli/azure/#login) command and follow the on-screen directions.

```azurecli
az login
```

Create a resource group with [az group create](/cli/azure/group#create). An Azure resource group is a logical container into which Azure resources are deployed and managed. 

The following example creates a resource group named `myResourceGroup` in the `westeurope` location.

```azurecli
az group create --name myResourceGroup --location westeurope
```

Create a VM with [az vm create](/cli/azure/vm#create). 

The following example creates a VM named `myVM` and creates SSH keys if they do not already exist in a default key location. To use a specific set of keys, use the `--ssh-key-value` option.  

```azurecli
az vm create --resource-group myResourceGroup --name myVM --image UbuntuLTS --generate-ssh-keys
```

When the VM has been created, the Azure CLI shows information similar to the following example. Take note of the public IP address. This address is used to access the VM.

```azurecli
{
  "fqdns": "",
  "id": "/subscriptions/d5b9d4b7-6fc1-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM",
  "location": "westeurope",
  "macAddress": "00-0D-3A-23-9A-49",
  "powerState": "VM running",
  "privateIpAddress": "10.0.0.4",
  "publicIpAddress": "52.174.34.95",
  "resourceGroup": "myResourceGroup"
}
```

## Connect to virtual machine

Use the following command to create an SSH session with the virtual machine. Replace the IP address with the public IP address of your virtual machine.

```bash 
ssh <Public IP Address>
```

## Delete virtual machine

When no longer needed, the following command can be used to remove the Resource Group, VM, and all related resources.

```azurecli
az group delete --name myResourceGroup
```

## Next steps

[Create highly available virtual machines tutorial](./virtual-machines-linux-create-cli-complete.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

[Explore VM deployment CLI samples](./virtual-machines-linux-cli-samples.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)