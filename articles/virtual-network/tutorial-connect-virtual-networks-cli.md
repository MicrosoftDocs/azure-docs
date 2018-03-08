---
title: Connect virtual networks with virtual network peering - Azure CLI | Microsoft Docs
description: Learn how to connect virtual networks with virtual network peering.
services: virtual-network
documentationcenter: virtual-network
author: jimdial
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.devlang: azurecli
ms.topic:
ms.tgt_pltfrm: virtual-network
ms.workload: infrastructure
ms.date: 03/06/2018
ms.author: jdial
ms.custom:
---

# Connect virtual networks with virtual network peering using the Azure CLI

You can connect virtual networks to each other with virtual network peering. Once virtual networks are peered, resources in both virtual networks are able to communicate with each other, with the same latency and bandwidth as if the resources were in the same virtual network. This article covers creation and peering of two virtual networks. You learn how to:

> [!div class="checklist"]
> * Create two virtual networks
> * Create a peering between virtual networks
> * Test peering

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.4 or later. To find the version, run `az --version`. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli). 

## Create virtual networks

Before creating a virtual network, you have to create a resource group for the virtual network, and all other resources created in this article. Create a resource group with [az group create](/cli/azure/group#az_group_create). The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive 
az group create --name myResourceGroup --location eastus
```

Create a virtual network with [az network vnet create](/cli/azure/network/vnet#az_network_vnet_create). The following example creates a virtual network named *myVirtualNetwork1* with the address prefix *10.0.0.0/16*.

```azurecli-interactive 
az network vnet create \
  --name myVirtualNetwork1 \
  --resource-group myResourceGroup \
  --address-prefixes 10.0.0.0/16 \
  --subnet-name Subnet1 \
  --subnet-prefix 10.0.0.0/24
```

Create a virtual network named *myVirtualNetwork2* with the address prefix *10.1.0.0/16*. The address prefix does not overlap with the address prefix of the *myVirtualNetwork1* virtual network. You cannot peer virtual networks with overlapping address prefixes.

```azurecli-interactive 
az network vnet create \
  --name myVirtualNetwork2 \
  --resource-group myResourceGroup \
  --address-prefixes 10.1.0.0/16 \
  --subnet-name Subnet1 \
  --subnet-prefix 10.1.0.0/24
```

## Peer virtual networks

Peerings are established between virtual network IDs, so you must first get the ID of each virtual network with [az network vnet show](/cli/azure/network/vnet#az_network_vnet_show) and store the ID in a variable.

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

Create a peering from *myVirtualNetwork1* to *myVirtualNetwork2* with [az network vnet peering create](/cli/azure/network/vnet/peering#az_network_vnet_peering_create). If the `--allow-vnet-access` parameter is not specified, a peering is established, but no communication can flow through it.

```azurecli-interactive
az network vnet peering create \
  --name myVirtualNetwork1-myVirtualNetwork2 \
  --resource-group myResourceGroup \
  --vnet-name myVirtualNetwork1 \
  --remote-vnet-id $vNet2Id \
  --allow-vnet-access
```

In the output returned after the previous command executes, you see that the **peeringState** is *Initiated*. The peering remains in the *Initiated* state until you create the peering from *myVirtualNetwork2* to *myVirtualNetwork1*. Create a peering from *myVirtualNetwork2* to *myVirtualNetwork1*. 

```azurecli-interactive
az network vnet peering create \
  --name myVirtualNetwork2-myVirtualNetwork1 \
  --resource-group myResourceGroup \
  --vnet-name myVirtualNetwork2 \
  --remote-vnet-id $vNet1Id \
  --allow-vnet-access
```

In the output returned after the previous command executes, you see that the **peeringState** is *Connected*. Azure also changed the peering state of the *myVirtualNetwork1-myVirtualNetwork2* peering to *Connected*. Confirm that the peering state for the *myVirtualNetwork1-myVirtualNetwork2* peering changed to *Connected* with [az network vnet peering show](/cli/azure/network/vnet/peering#az_network_vnet_peering_show).

```azurecli-interactive
az network vnet peering show \
  --name myVirtualNetwork1-myVirtualNetwork2 \
  --resource-group myResourceGroup \
  --vnet-name myVirtualNetwork1 \
  --query peeringState
```

Resources in one virtual network cannot communicate with resources in the other virtual network until the **peeringState** for the peerings in both virtual networks is *Connected*. 

Peerings are between two virtual networks, but are not transitive. So, for example, if you also wanted to peer *myVirtualNetwork2* to *myVirtualNetwork3*, you need to create an additional peering between virtual networks *myVirtualNetwork2* and *myVirtualNetwork3*. Even though *myVirtualNetwork1* is peered with *myVirtualNetwork2*, resources within *myVirtualNetwork1* could only access resources in *myVirtualNetwork3* if *myVirtualNetwork1* was also peered with *myVirtualNetwork3*. 

Before peering production virtual networks, it's recommended that you thoroughly familiarize yourself with the [peering overview](virtual-network-peering-overview.md), [managing peering](virtual-network-manage-peering.md), and [virtual network limits](../azure-subscription-service-limits.md?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits). Though this article illustrates a peering between two virtual networks in the same subscription and location, you can also peer virtual networks in [different regions](#register) and [different Azure subscriptions](create-peering-different-subscriptions.md#cli). You can also create [hub and spoke network designs](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke?toc=%2fazure%2fvirtual-network%2ftoc.json#vnet-peering) with peering.

## Test peering

To test network communication between virtual machines in different virtual networks through a peering, deploy a virtual machine to each subnet and then communicate between the virtual machines. 

### Create virtual machines

Create a virtual machine with [az vm create](/cli/azure/vm#az_vm_create). The following example creates a virtual machine named *myVm1* in the *myVirtualNetwork1* virtual network. If SSH keys do not already exist in a default key location, the command creates them. To use a specific set of keys, use the `--ssh-key-value` option. The `--no-wait` option creates the virtual machine in the background, so you can continue to the next step.

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

Azure automatically assigns 10.0.0.4 as the private IP address of the virtual machine, because 10.0.0.4 is the first available IP address in *Subnet1* of *myVirtualNetwork1*. 

Create a virtual machine in the *myVirtualNetwork2* virtual network.

```azurecli-interactive 
az vm create \
  --resource-group myResourceGroup \
  --name myVm2 \
  --image UbuntuLTS \
  --vnet-name myVirtualNetwork2 \
  --subnet Subnet1 \
  --generate-ssh-keys
```

The virtual machine takes a few minutes to create. After the virtual machine is created, the Azure CLI shows information similar to the following example: 

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

In the example output, you see that the **privateIpAddress** is *10.1.0.4*. Azure DHCP automatically assigned 10.1.0.4 to the virtual machine because it is the first available address in *Subnet1* of *myVirtualNetwork2*. Take note of the **publicIpAddress**. This address is used to access the virtual machine from the Internet in a later step.

### Test virtual machine communication

Use the following command to create an SSH session with the *myVm2* virtual machine. Replace `<publicIpAddress>` with the public IP address of your virtual machine. In the previous example, the public IP address is *13.90.242.231*.

```bash 
ssh <publicIpAddress>
```

Ping the virtual machine in *myVirtualNetwork1*.

```bash 
ping 10.0.0.4 -c 4
```

You receive four replies. If you ping by the virtual machine's name (*myVm1*), instead of its IP address, ping fails, because *myVm1* is an unknown host name. Azure's default name resolution works between virtual machines in the same virtual network, but not between virtual machines in different virtual networks. To resolve names across virtual networks, you must [deploy your own DNS server](virtual-networks-name-resolution-for-vms-and-role-instances.md) or use [Azure DNS private domains](../dns/private-dns-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

Close the SSH session to the *myVm2* virtual machine. 

## Clean up resources

When no longer needed, use [az group delete](/cli/azure/group#az_group_delete) to remove the resource group and all of the resources it contains.

```azurecli-interactive 
az group delete --name myResourceGroup --yes
```

**<a name="register"></a>Register for the global virtual network peering preview**

Peering virtual networks in the same region is generally available. Peering virtual networks in different regions is currently in preview. See [Virtual network updates](https://azure.microsoft.com/updates/?product=virtual-network) for available regions. To peer virtual networks across regions, you must first register for the preview, by completing the following steps (within the subscription each virtual network you want to peer is in):

1. Register for the preview by entering the following commands:

  ```azurecli-interactive
  az feature register --name AllowGlobalVnetPeering --namespace Microsoft.Network
  az provider register --name Microsoft.Network
  ```

2. Confirm that you are registered for the preview by entering the following command:

  ```azurecli-interactive
  az feature show --name AllowGlobalVnetPeering --namespace Microsoft.Network
  ```

  If you attempt to peer virtual networks in different regions before the **RegistrationState** output you receive after entering the previous command is **Registered** for both subscriptions, peering fails.

## Next steps

In this article, you learned how to connect two networks with virtual network peering. You can [connect your own computer to a virtual network](../vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) through a VPN, and interact with resources in a virtual network, or in peered virtual networks.

Continue to script samples for reusable scripts to complete many of the tasks covered in the virtual network articles.

> [!div class="nextstepaction"]
> [Virtual network script samples](../networking/cli-samples.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
