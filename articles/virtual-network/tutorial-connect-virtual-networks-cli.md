---
title: Connect virtual networks with virtual network peering - Azure CLI | Microsoft Docs
description: In this article, you learn how to connect virtual networks with virtual network peering, using the Azure CLI.
services: virtual-network
documentationcenter: virtual-network
author: KumudD
manager: twooley
editor: ''
tags: azure-resource-manager
Customer intent: I want to connect two virtual networks so that virtual machines in one virtual network can communicate with virtual machines in the other virtual network.

ms.assetid: 
ms.service: virtual-network
ms.devlang: azurecli
ms.topic: article
ms.tgt_pltfrm: virtual-network
ms.workload: infrastructure
ms.date: 03/13/2018
ms.author: kumud
ms.custom:
---

# Connect virtual networks with virtual network peering using the Azure CLI

You can connect virtual networks to each other with virtual network peering. Once virtual networks are peered, resources in both virtual networks are able to communicate with each other, with the same latency and bandwidth as if the resources were in the same virtual network. In this article, you learn how to:

* Create two virtual networks
* Connect two virtual networks with a virtual network peering
* Deploy a virtual machine (VM) into each virtual network
* Communicate between VMs

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0.28 or later. To find the version, run `az --version`. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). 

## Create virtual networks

Before creating a virtual network, you have to create a resource group for the virtual network, and all other resources created in this article. Create a resource group with [az group create](/cli/azure/group). The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive 
az group create --name myResourceGroup --location eastus
```

Create a virtual network with [az network vnet create](/cli/azure/network/vnet). The following example creates a virtual network named *myVirtualNetwork1* with the address prefix *10.0.0.0/16*.

```azurecli-interactive 
az network vnet create \
  --name myVirtualNetwork1 \
  --resource-group myResourceGroup \
  --address-prefixes 10.0.0.0/16 \
  --subnet-name Subnet1 \
  --subnet-prefix 10.0.0.0/24
```

Create a virtual network named *myVirtualNetwork2* with the address prefix *10.1.0.0/16*:

```azurecli-interactive 
az network vnet create \
  --name myVirtualNetwork2 \
  --resource-group myResourceGroup \
  --address-prefixes 10.1.0.0/16 \
  --subnet-name Subnet1 \
  --subnet-prefix 10.1.0.0/24
```

## Peer virtual networks

Peerings are established between virtual network IDs, so you must first get the ID of each virtual network with [az network vnet show](/cli/azure/network/vnet) and store the ID in a variable.

```azurecli-interactive
# Get the id for myVirtualNetwork1.
vNet1Id=$(az network vnet show \
  --resource-group myResourceGroup \
  --name myVirtualNetwork1 \
  --query id --out tsv)

# Get the id for myVirtualNetwork2.
vNet2Id=$(az network vnet show \
  --resource-group myResourceGroup \
  --name myVirtualNetwork2 \
  --query id \
  --out tsv)
```

Create a peering from *myVirtualNetwork1* to *myVirtualNetwork2* with [az network vnet peering create](/cli/azure/network/vnet/peering). If the `--allow-vnet-access` parameter is not specified, a peering is established, but no communication can flow through it.

```azurecli-interactive
az network vnet peering create \
  --name myVirtualNetwork1-myVirtualNetwork2 \
  --resource-group myResourceGroup \
  --vnet-name myVirtualNetwork1 \
  --remote-vnet $vNet2Id \
  --allow-vnet-access
```

In the output returned after the previous command executes, you see that the **peeringState** is *Initiated*. The peering remains in the *Initiated* state until you create the peering from *myVirtualNetwork2* to *myVirtualNetwork1*. Create a peering from *myVirtualNetwork2* to *myVirtualNetwork1*. 

```azurecli-interactive
az network vnet peering create \
  --name myVirtualNetwork2-myVirtualNetwork1 \
  --resource-group myResourceGroup \
  --vnet-name myVirtualNetwork2 \
  --remote-vnet $vNet1Id \
  --allow-vnet-access
```

In the output returned after the previous command executes, you see that the **peeringState** is *Connected*. Azure also changed the peering state of the *myVirtualNetwork1-myVirtualNetwork2* peering to *Connected*. Confirm that the peering state for the *myVirtualNetwork1-myVirtualNetwork2* peering changed to *Connected* with [az network vnet peering show](/cli/azure/network/vnet/peering).

```azurecli-interactive
az network vnet peering show \
  --name myVirtualNetwork1-myVirtualNetwork2 \
  --resource-group myResourceGroup \
  --vnet-name myVirtualNetwork1 \
  --query peeringState
```

Resources in one virtual network cannot communicate with resources in the other virtual network until the **peeringState** for the peerings in both virtual networks is *Connected*. 

## Create virtual machines

Create a VM in each virtual network so that you can communicate between them in a later step.

### Create the first VM

Create a VM with [az vm create](/cli/azure/vm). The following example creates a VM named *myVm1* in the *myVirtualNetwork1* virtual network. If SSH keys do not already exist in a default key location, the command creates them. To use a specific set of keys, use the `--ssh-key-value` option. The `--no-wait` option creates the VM in the background, so you can continue to the next step.

```azurecli-interactive
az vm create \
  --resource-group myResourceGroup \
  --name myVm1 \
  --image UbuntuLTS \
  --vnet-name myVirtualNetwork1 \
  --subnet Subnet1 \
  --generate-ssh-keys \
  --no-wait
```

### Create the second VM

Create a VM in the *myVirtualNetwork2* virtual network.

```azurecli-interactive 
az vm create \
  --resource-group myResourceGroup \
  --name myVm2 \
  --image UbuntuLTS \
  --vnet-name myVirtualNetwork2 \
  --subnet Subnet1 \
  --generate-ssh-keys
```

The VM takes a few minutes to create. After the VM is created, the Azure CLI shows information similar to the following example: 

```azurecli 
{
  "fqdns": "",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVm2",
  "location": "eastus",
  "macAddress": "00-0D-3A-23-9A-49",
  "powerState": "VM running",
  "privateIpAddress": "10.1.0.4",
  "publicIpAddress": "13.90.242.231",
  "resourceGroup": "myResourceGroup"
}
```

Take note of the **publicIpAddress**. This address is used to access the VM from the internet in a later step.

## Communicate between VMs

Use the following command to create an SSH session with the *myVm2* VM. Replace `<publicIpAddress>` with the public IP address of your VM. In the previous example, the public IP address is *13.90.242.231*.

```bash 
ssh <publicIpAddress>
```

Ping the VM in *myVirtualNetwork1*.

```bash 
ping 10.0.0.4 -c 4
```

You receive four replies. 

Close the SSH session to the *myVm2* VM. 

## Clean up resources

When no longer needed, use [az group delete](/cli/azure/group) to remove the resource group and all of the resources it contains.

```azurecli-interactive 
az group delete --name myResourceGroup --yes
```

## Next steps

In this article, you learned how to connect two networks in the same Azure region, with virtual network peering. You can also peer virtual networks in different [supported regions](virtual-network-manage-peering.md#cross-region) and in [different Azure subscriptions](create-peering-different-subscriptions.md#cli), as well as create [hub and spoke network designs](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke?toc=%2fazure%2fvirtual-network%2ftoc.json#vnet-peering) with peering. To learn more about virtual network peering, see [Virtual network peering overview](virtual-network-peering-overview.md) and [Manage virtual network peerings](virtual-network-manage-peering.md).

You can [connect your own computer to a virtual network](../vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) through a VPN, and interact with resources in a virtual network, or in peered virtual networks. For reusable scripts to complete many of the tasks covered in the virtual network articles, see [script samples](cli-samples.md).
