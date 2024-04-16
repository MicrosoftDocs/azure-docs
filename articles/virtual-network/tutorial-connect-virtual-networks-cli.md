---
title: Connect virtual networks with virtual network peering - Azure CLI
description: In this article, you learn how to connect virtual networks with virtual network peering, using the Azure CLI.
services: virtual-network
author: asudbring
ms.service: virtual-network
ms.topic: how-to
ms.date: 04/15/2024
ms.author: allensu
ms.custom: devx-track-azurecli
# Customer intent: I want to connect two virtual networks so that virtual machines in one virtual network can communicate with virtual machines in the other virtual network.
---

# Connect virtual networks with virtual network peering using the Azure CLI

You can connect virtual networks to each other with virtual network peering. Once virtual networks are peered, resources in both virtual networks are able to communicate with each other, with the same latency and bandwidth as if the resources were in the same virtual network. 

In this article, you learn how to:

* Create two virtual networks

* Connect two virtual networks with a virtual network peering

* Deploy a virtual machine (VM) into each virtual network

* Communicate between VMs

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create virtual networks

Before creating a virtual network, you have to create a resource group for the virtual network, and all other resources created in this article. Create a resource group with [az group create](/cli/azure/group). The following example creates a resource group named **test-rg** in the **eastus** location.

```azurecli-interactive 
az group create \
    --name test-rg \
    --location eastus
```

Create a virtual network with [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create). The following example creates a virtual network named **vnet-1** with the address prefix **10.0.0.0/16**.

```azurecli-interactive 
az network vnet create \
  --name vnet-1 \
  --resource-group test-rg \
  --address-prefixes 10.0.0.0/16 \
  --subnet-name subnet-1 \
  --subnet-prefix 10.0.0.0/24
```

Create a virtual network named **vnet-2** with the address prefix **10.1.0.0/16**:

```azurecli-interactive 
az network vnet create \
  --name vnet-2 \
  --resource-group test-rg \
  --address-prefixes 10.1.0.0/16 \
  --subnet-name subnet-1 \
  --subnet-prefix 10.1.0.0/24
```

## Peer virtual networks

Peerings are established between virtual network IDs. Obtain the ID of each virtual network with [az network vnet show](/cli/azure/network/vnet#az-network-vnet-show) and store the ID in a variable.

```azurecli-interactive
# Get the id for vnet-1.
vNet1Id=$(az network vnet show \
  --resource-group test-rg \
  --name vnet-1 \
  --query id --out tsv)

# Get the id for vnet-2.
vNet2Id=$(az network vnet show \
  --resource-group test-rg \
  --name vnet-2 \
  --query id \
  --out tsv)
```

Create a peering from **vnet-1** to **vnet-2** with [az network vnet peering create](/cli/azure/network/vnet/peering#az-network-vnet-peering-create). If the `--allow-vnet-access` parameter isn't specified, a peering is established, but no communication can flow through it.

```azurecli-interactive
az network vnet peering create \
  --name vnet-1-to-vnet-2 \
  --resource-group test-rg \
  --vnet-name vnet-1 \
  --remote-vnet $vNet2Id \
  --allow-vnet-access
```

In the output returned after the previous command executes, you see that the **peeringState** is **Initiated**. The peering remains in the **Initiated** state until you create the peering from **vnet-2** to **vnet-1**. Create a peering from **vnet-2** to **vnet-1**. 

```azurecli-interactive
az network vnet peering create \
  --name vnet-2-to-vnet-1 \
  --resource-group test-rg \
  --vnet-name vnet-2 \
  --remote-vnet $vNet1Id \
  --allow-vnet-access
```

In the output returned after the previous command executes, you see that the **peeringState** is **Connected**. Azure also changed the peering state of the **vnet-1-to-vnet-2** peering to **Connected**. Confirm that the peering state for the **vnet-1-to-vnet-2** peering changed to **Connected** with [az network vnet peering show](/cli/azure/network/vnet/peering#az-network-vnet-show).

```azurecli-interactive
az network vnet peering show \
  --name vnet-1-to-vnet-2 \
  --resource-group test-rg \
  --vnet-name vnet-1 \
  --query peeringState
```

Resources in one virtual network can't communicate with resources in the other virtual network until the **peeringState** for the peerings in both virtual networks is **Connected**. 

## Create virtual machines

Create a VM in each virtual network so that you can communicate between them in a later step.

### Create the first VM

Create a VM with [az vm create](/cli/azure/vm#az-vm-create). The following example creates a VM named **vm-1** in the **vnet-1** virtual network. If SSH keys don't already exist in a default key location, the command creates them. To use a specific set of keys, use the `--ssh-key-value` option. The `--no-wait` option creates the VM in the background, so you can continue to the next step.

```azurecli-interactive
az vm create \
  --resource-group test-rg \
  --name vm-1 \
  --image Ubuntu2204 \
  --vnet-name vnet-1 \
  --subnet subnet-1 \
  --generate-ssh-keys \
  --no-wait
```

### Create the second VM

Create a VM in the **vnet-2** virtual network.

```azurecli-interactive
az vm create \
  --resource-group test-rg \
  --name vm-2 \
  --image Ubuntu2204 \
  --vnet-name vnet-2 \
  --subnet subnet-1 \
  --generate-ssh-keys
```

The VM takes a few minutes to create. After the VM is created, the Azure CLI shows information similar to the following example: 

```output
{
  "fqdns": "",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/test-rg/providers/Microsoft.Compute/virtualMachines/vm-2",
  "location": "eastus",
  "macAddress": "00-0D-3A-23-9A-49",
  "powerState": "VM running",
  "privateIpAddress": "10.1.0.4",
  "publicIpAddress": "13.90.242.231",
  "resourceGroup": "test-rg"
}
```

Take note of the **publicIpAddress**. This address is used to access the VM from the internet in a later step.

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## Communicate between VMs

Use the following command to create an SSH session with the **vm-2** VM. Replace `<publicIpAddress>` with the public IP address of your VM. In the previous example, the public IP address is **13.90.242.231**.

```bash
ssh <publicIpAddress>
```

Ping the VM in *vnet-1*.

```bash
ping 10.0.0.4 -c 4
```

You receive four replies. 

Close the SSH session to the **vm-2** VM. 

## Clean up resources

When no longer needed, use [az group delete](/cli/azure/group#az-group-delete) to remove the resource group and all of the resources it contains.

```azurecli-interactive
az group delete \
    --name test-rg \
    --yes
```

## Next steps

In this article, you learned how to connect two networks in the same Azure region, with virtual network peering. You can also peer virtual networks in different [supported regions](virtual-network-manage-peering.md#cross-region) and in [different Azure subscriptions](create-peering-different-subscriptions.md), as well as create [hub and spoke network designs](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke#virtual-network-peering) with peering. To learn more about virtual network peering, see [Virtual network peering overview](virtual-network-peering-overview.md) and [Manage virtual network peerings](virtual-network-manage-peering.md).

You can [connect your own computer to a virtual network](../vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) through a VPN, and interact with resources in a virtual network, or in peered virtual networks. For reusable scripts to complete many of the tasks covered in the virtual network articles, see [script samples](cli-samples.md).
