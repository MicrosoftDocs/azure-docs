---
title: Create a virtual network - Azure CLI | Microsoft Docs
description: Quickly learn to create a virtual network using the Azure CLI. A virtual network enables many types of Azure resources to communicate privately with each other.
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
ms.date: 01/25/2018
ms.author: jdial
ms.custom:
---

# Create a virtual network using the Azure CLI

In this article, you learn how to create a virtual network. After creating a virtual network, you deploy two virtual machines into the virtual network to test private network communication between them.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0.4 or later. To find the installed version, run `az --version`. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli). 

## Create a resource group

Create a resource group with the [az group create](/cli/azure/group#az_group_create) command. A resource group is a logical container into which Azure resources are deployed and managed. 

The following example creates a resource group named *myResourceGroup* in the *eastus* location. All Azure resources are created within an Azure location (or region).

```azurecli-interactive 
az group create --name myResourceGroup --location eastus
```

## Create a virtual network

Create a virtual network with the [az network vnet create](/cli/azure/network/vnet#az_network_vnet_create) command. The following example creates a default virtual network named *myVirtualNetwork* with one subnet named *default*. Since a location isn't specified, Azure creates the virtual network in the same location as the resource group.

```azurecli-interactive 
az network vnet create \
  --name myVirtualNetwork \
  --resource-group myResourceGroup \
  --subnet-name default
```

After the virtual network is created, a portion of the information returned is as follows.

```azurecli
"newVNet": {
    "addressSpace": {
      "addressPrefixes": [
        "10.0.0.0/16"
```

All virtual networks have one or more address prefixes assigned to them. Since an address prefix wasn't specified when creating the virtual network, Azure defined the 10.0.0.0/16 address space, by default. The address space is specified in CIDR notation. The address space 10.0.0.0/16 encompasses 10.0.0.0-10.0.255.254.

Another portion of the information returned is the **addressPrefix** of *10.0.0.0/24* for the *default* subnet specified in the command. A virtual network contains zero or more subnets. The command created a single subnet named *default*, but no address prefix was specified for the subnet. When an address prefix isn't specified for a virtual network or subnet, Azure defines 10.0.0.0/24 as the address prefix for the first subnet, by default. As a result, the subnet encompasses 10.0.0.0-10.0.0.254, but only 10.0.0.4-10.0.0.254 are available, because Azure reserves the first four addresses (0-3) and the last address in each subnet.

## Test network communication

A virtual network enables several types of Azure resources to communicate privately with each other. One type of resource you can deploy into a virtual network is a virtual machine. Create two virtual machines in the virtual network so you can validate private communication between them in a later step.

### Create virtual machines

Create a virtual machine with the [az vm create](/cli/azure/vm#az_vm_create) command. The following example creates a virtual machine named *myVm1*. If SSH keys do not already exist in a default key location, the command creates them. To use a specific set of keys, use the `--ssh-key-value` option. The `--no-wait` option creates the virtual machine in the background, so you can continue to the next step.

```azurecli-interactive 
az vm create \
  --resource-group myResourceGroup \
  --name myVm1 \
  --image UbuntuLTS \
  --generate-ssh-keys \
  --no-wait
```

Azure automatically creates the virtual machine in the *default* subnet of the *myVirtualNetwork* virtual network, because the virtual network exists in the resource group, and no virtual network or subnet is specified in the command. Azure DHCP automatically assigned 10.0.0.4 to the virtual machine during creation, because it is the first available address in the *default* subnet. The location that a virtual machine is created in must be the same location the virtual network exists in. The virtual machine isn't required to be in the same resource group as the virtual network, though it is in this article.

Create a second virtual machine. By default, Azure also creates this virtual machine in the *default* subnet.

```azurecli-interactive 
az vm create \
  --resource-group myResourceGroup \
  --name myVm2 \
  --image UbuntuLTS \
  --generate-ssh-keys
```

The virtual machine takes a few minutes to create. After the virtual machine is created, the Azure CLI returns output similar to the following example: 

```azurecli 
{
  "fqdns": "",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVm1",
  "location": "eastus",
  "macAddress": "00-0D-3A-23-9A-49",
  "powerState": "VM running",
  "privateIpAddress": "10.0.0.5",
  "publicIpAddress": "40.68.254.142",
  "resourceGroup": "myResourceGroup"
}
```

In the example, you see that the **privateIpAddress** is *10.0.0.5*. Azure DHCP automatically assigned *10.0.0.5* to the virtual machine because it was the next available address in the *default* subnet. Take note of the **publicIpAddress**. This address is used to access the virtual machine from the Internet in a later step. The public IP address is not assigned from within the virtual network or subnet address prefixes. Public IP addresses are assigned from a [pool of addresses assigned to each Azure region](https://www.microsoft.com/download/details.aspx?id=41653). While Azure knows which public IP address is assigned to a virtual machine, the operating system running in a virtual machine has no awareness of any public IP address assigned to it.

### Connect to a virtual machine

Use the following command to create an SSH session with the *myVm2* virtual machine. Replace `<publicIpAddress>` with the public IP address of your virtual machine. In the example above, the IP address is *40.68.254.142*.

```bash 
ssh <publicIpAddress>
```

### Validate communication

Use the following command to confirm communication with *myVm1* from *myVm2*:

```bash
ping myVm1 -c 4
```

You receive four replies from *10.0.0.4*. You can communicate with *myVm1* from *myVm2*, because both virtual machines have private IP addresses assigned from the *default* subnet. You are able to ping by hostname because Azure automatically provides DNS name resolution for all hosts within a virtual network.

Use the following command to confirm outbound communication to the Internet:

```bash
ping bing.com -c 4
```

You receive four replies from bing.com. By default, any virtual machine in a virtual network can communicate outbound to the Internet.

Exit the SSH session to your VM.

## Clean up resources

When no longer needed, you can use the [az group delete](/cli/azure/group#az_group_delete) command to remove the resource group and all of the resources it contains:

```azurecli-interactive 
az group delete --name myResourceGroup --yes
```

## Next steps

In this article, you deployed a default virtual network with one subnet. To learn how to create a custom virtual network with multiple subnets, continue to the tutorial for creating a custom virtual network.

> [!div class="nextstepaction"]
> [Create a custom virtual network](virtual-networks-create-vnet-arm-cli.md)
