---
title: Create a virtual network - quickstart - Azure CLI
titlesuffix: Azure Virtual Network
description: In this quickstart, you learn to create a virtual network using the Azure CLI. A virtual network lets Azure resources, like virtual machines, communicate privately with each other, and with the internet.
services: virtual-network
documentationcenter: virtual-network
author: KumudD
Customer intent: I want to create a virtual network so that virtual machines can communicate with privately with each other and with the internet.
ms.service: virtual-network
ms.devlang: azurecli
ms.topic: quickstart
ms.tgt_pltfrm: virtual-network
ms.workload: infrastructure
ms.date: 12/12/2018
ms.author: kumud
---

# Quickstart: Create a virtual network using the Azure CLI

A virtual network enables Azure resources, like virtual machines (VMs), to communicate privately with each other, and with the internet. In this quickstart, you learn how to create a virtual network. After creating a virtual network, you deploy two VMs into the virtual network. You then connect to the VMs from the internet, and communicate privately over the new virtual network.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) now.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you decide to install and use Azure CLI locally instead, this quickstart requires you to use Azure CLI version 2.0.28 or later. To find your installed version, run `az --version`. See [Install Azure CLI](/cli/azure/install-azure-cli) for install or upgrade info.

## Create a resource group and a virtual network

Before you can create a virtual network, you have to create a resource group to host the virtual network. Create a resource group with [az group create](/cli/azure/group). This example creates a resource group named *myResourceGroup* in the *eastus* location:

```azurecli-interactive
az group create --name myResourceGroup --location eastus
```

Create a virtual network with [az network vnet create](/cli/azure/network/vnet). This example creates a default virtual network named *myVirtualNetwork* with one subnet named *default*:

```azurecli-interactive
az network vnet create \
  --name myVirtualNetwork \
  --resource-group myResourceGroup \
  --subnet-name default
```

## Create virtual machines

Create two VMs in the virtual network.

### Create the first VM

Create a VM with [az vm create](/cli/azure/vm). If SSH keys don't already exist in a default key location, the command creates them. To use a specific set of keys, use the `--ssh-key-value` option. The `--no-wait` option creates the VM in the background, so that you can continue to the next step. This example creates a VM named *myVm1*:

```azurecli-interactive
az vm create \
  --resource-group myResourceGroup \
  --name myVm1 \
  --image UbuntuLTS \
  --generate-ssh-keys \
  --no-wait
```

### Create the second VM

Since you used the `--no-wait` option in the previous step, you can go ahead and create the second VM named *myVm2*.

```azurecli-interactive
az vm create \
  --resource-group myResourceGroup \
  --name myVm2 \
  --image UbuntuLTS \
  --generate-ssh-keys
```

### Azure CLI output message

The VMs take a few minutes to create. After Azure creates the VMs, the Azure CLI returns output like this:

```azurecli
{
  "fqdns": "",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVm2",
  "location": "eastus",
  "macAddress": "00-0D-3A-23-9A-49",
  "powerState": "VM running",
  "privateIpAddress": "10.0.0.5",
  "publicIpAddress": "40.68.254.142",
  "resourceGroup": "myResourceGroup"
  "zones": ""
}
```

Take note of the **publicIpAddress**. You will use this address to connect to the VM from the internet in the next step.

## Connect to a VM from the internet

In this command, replace `<publicIpAddress>` with the public IP address of your *myVm2* VM:

```bash
ssh <publicIpAddress>
```

## Communicate between VMs

To confirm private communication between the *myVm2* and *myVm1* VMs, enter this command:

```bash
ping myVm1 -c 4
```

You'll receive four replies from *10.0.0.4*.

Exit the SSH session with the *myVm2* VM.

## Clean up resources

When no longer needed, you can use [az group delete](/cli/azure/group) to remove the resource group and all the resources it has:

```azurecli-interactive
az group delete --name myResourceGroup --yes
```

## Next steps

In this quickstart, you created a default virtual network and two VMs. You connected to one VM from the internet and communicated privately between the two VMs. To learn more about virtual network settings, see [Manage a virtual network](manage-virtual-network.md).

Azure lets unrestricted private communication between VMs. By default, Azure only lets inbound remote desktop connections to Windows VMs from the internet. To learn more about configuring different types of VM network communications, go to the [Filter network traffic](tutorial-filter-network-traffic.md) tutorial.
