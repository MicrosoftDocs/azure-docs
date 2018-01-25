---
title: Create a virtual network - Azure CLI | Microsoft Docs
description: Quickly learn to create a virtual network using the Azure CLI.
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

In this article, you learn how to create a virtual network. You can deploy several types of Azure resources into a virtual network and allow them to communicate with each other privately, and with the Internet. After creating the virtual network, you deploy two virtual machines into the virtual network so they can communicate privately with each other, and with the Internet.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.4 or later. To find the version, run `az --version`. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

## Create a resource group

Create a resource group with the [az group create](/cli/azure/group#create) command. A resource group is a logical container into which Azure resources are deployed and managed. 

The following example creates a resource group named *myResourceGroup* in the *eastus* location. All Azure resources are created within an Azure location (or region).

```azurecli-interactive 
az group create --name myResourceGroup --location eastus
```

## Create a virtual network

Create a virtual network with the [az network vnet create](/cli/azure/network/vnet#create) command. A virtual network is a logical isolation of the Azure cloud dedicated to your subscription. Resources deployed within a virtual network can communicate privately with each other, and with the Internet. 

The following example creates a default virtual network named *myVirtualNetwork* with one subnet named *default*. Since a location isn't specified, Azure creates the virtual network in the same location as the resource group.

```azurecli-interactive 
az network vnet create \
  --name myVirtualNetwork \
  --resource-group myResourceGroup \
  --subnet-name default
```

Since a location wasn't specified in the previous command, Azure created the virtual network in the same location that the *myResourceGroup* resource group exists in. After the virtual network is created, a portion of the information returned is as follows.

```azurecli
"newVNet": {
    "addressSpace": {
      "addressPrefixes": [
        "10.0.0.0/16"
```

All virtual networks have one or more address prefixes assigned to them. Since an address prefix wasn't specified when creating the virtual network, Azure defined the 10.0.0.0/16 address space, by default. The address space is specified in CIDR notation. The address space 10.0.0.0/16 encompasses 10.0.0.0-10.0.255.254.

Another portion of the information returned is the **addressPrefix** of *10.0.0.0/24* for the *default* subnet specified in the command. A virtual network contains zero or more subnets. The command created a single subnet named *default*, but no address prefix was specified for the subnet. When an address prefix isn't specified for a virtual network or subnet, Azure defines 10.0.0.0/16 as the address prefix for the first subnet, by default. As a result, the subnet encompasses 10.0.0.0-10.0.0.254, but only 10.0.0.4-10.0.0.254 are available, because Azure reserves the first four addresses (0-3) and the last address in each subnet.


## Create virtual machines

A virtual network enables several types of Azure resources to communicate privately with each other. One type of resource you can deploy into a virtual network is a virtual machine. Create two virtual machines in the virtual network so you can validate and understand how communication between virtual machines in a virtual network works in a later step.

Create a virtual machine with the [az vm create](/cli/azure/vm#az_vm_create) command. The following example creates a virtual machine named *myVm1*. If SSH keys do not already exist in a default key location, the command creates them. To use a specific set of keys, use the `--ssh-key-value` option.  

```azurecli-interactive 
az vm create \
  --resource-group myResourceGroup \
  --name myVm1 \
  --image UbuntuLTS \
  --generate-ssh-keys
```

Azure automatically creates the virtual machine in the *default* subnet of the *myVirtualNetwork* virtual network, because the virtual network exists in the resource group, and no virtual network or subnet is specified in the command. If a virtual network didn't exist in the resource group, Azure would have created a default virtual network for the virtual machine. The location that a virtual machine is created in must be the same location the virtual network exists in. The virtual machine isn't required to be in the same resource group as the virtual machine, though it is in this article.

After the virtual machine is created, the Azure CLI returns information similar to the following example: 

```azurecli 
{
  "fqdns": "",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVm1",
  "location": "eastus",
  "macAddress": "00-0D-3A-23-9A-49",
  "powerState": "VM running",
  "privateIpAddress": "10.0.0.4",
  "publicIpAddress": "40.68.254.142",
  "resourceGroup": "myResourceGroup"
}
```

In the example, you see that the **privateIpAddress** is *10.0.0.4*. Azure DHCP automatically assigned 10.0.0.4 to the virtual machine because it is the first available address in the *default* subnet. Take note of the **publicIpAddress**. This address is used to access the virtual machine from the Internet in a later step. The public IP address is not assigned from within the virtual network or subnet address prefixes. Public IP addresses are assigned from a pool of public, Internet-routable IP addresses that are allocated to each Azure location. While Azure knows which public IP address is assigned to a virtual machine, the operating system running in a virtual machine has no awareness of any public IP address assigned to it.

Create a second virtual machine. By default, Azure also creates this virtual machine in the *default* subnet. The `--public-ip-address ""` parameter instructs Azure not to assign a public IP address to *myVm2*, because it isn't necessary to connect to this virtual machine from the Internet.

```azurecli-interactive 
az vm create \
  --resource-group myResourceGroup \
  --name myVm2 \
  --image UbuntuLTS \
  --public-ip-address "" \
  --generate-ssh-keys
```

After the virtual machine is created, notice in the output returned that the private IP address is *10.0.0.5*. Since Azure previously assigned the first usable address of 10.0.0.4 in the subnet to the *myVm1* virtual machine, it assigned 10.0.0.5 to the *myVm2* virtual machine, because it was the next available address in the subnet.

## Validate virtual machine communication

Use the following command to create an SSH session with the *myVm1* virtual machine. Replace `<publicIpAddress>` with the public IP address of your virtual machine. In the example above, the IP address is *40.68.254.142*.

```bash 
ssh <publicIpAddress>
```

The connection succeeds because a public IP address is assigned to *myVm1*. You cannot SSH into *myVm2* from the Internet because *myVm2* does not have a public IP address assigned to it.

Use the following command to confirm communication with *myVm2* from *myVm1*:

```bash
ping myVm2 -c 4
```

You receive four replies from *10.0.0.5*. You can communicate with *myVm2* from *myVm1*, because both virtual machines have private IP addresses assigned from the *default* subnet. You are able to ping by hostname because Azure automatically provides DNS name resolution for all hosts within a virtual network.

Use the following command to confirm outbound communication to the Internet:

```bash
ping bing.com -c 4
```

You receive four replies from bing.com. By default, any virtual machine in a virtual network can communicate outbound to the Internet, whether a public IP address is assigned to the virtual machine or not. If you want to communicate from the Internet to a virtual machine however, a public IP address must be assigned to the virtual machine.

## Clean up resources

When no longer needed, you can use the [az group delete](/cli/azure/group#delete) command to remove the resource group and all of the resources it contains. Exit the SSH session to your VM, then delete the resources.

```azurecli-interactive 
az group delete --name myResourceGroup --yes
```

## Next steps

In this article, you deployed a default virtual network with one subnet and two virtual machines. To learn how to create a custom virtual network with multiple subnets and perform basic management tasks, continue to the tutorial for creating a custom virtual network and managing it.


> [!div class="nextstepaction"]
> [Create a custom virtual network and manage it](virtual-networks-create-vnet-arm-pportal.md#azure-cli)
