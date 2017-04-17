---
title: Create a Linux VM with multiple NICs using the Azure CLI 2.0 | Microsoft Docs
description: Learn how to create a Linux VM with multiple NICs attached to it using the Azure CLI 2.0 or Resource Manager templates.
services: virtual-machines-linux
documentationcenter: ''
author: iainfoulds
manager: timlt
editor: ''

ms.assetid: 5d2d04d0-fc62-45fa-88b1-61808a2bc691
ms.service: virtual-machines-linux
ms.devlang: azurecli
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 02/10/2017
ms.author: iainfou

---
# Create a Linux VM with multiple NICs
You can create a virtual machine (VM) in Azure that has multiple virtual network interfaces (NICs) attached to it. A common scenario would be to have different subnets for front-end and back-end connectivity, or a network dedicated to a monitoring or backup solution. This article provides quick commands to create a VM with multiple NICs attached to it. For detailed information, including how to create multiple NICs within your own Bash scripts, read more about [deploying multi-NIC VMs](../../virtual-network/virtual-network-deploy-multinic-arm-cli.md). Different [VM sizes](sizes.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) support a varying number of NICs, so size your VM accordingly.

This article details how to create a VM with multiple NICs with the Azure CLI 2.0. You can also perform these steps with the [Azure CLI 1.0](multiple-nics-nodejs.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).


## Create supporting resources
Install the latest [Azure CLI 2.0](/cli/azure/install-az-cli2) and log in to an Azure account using [az login](/cli/azure/#login).

In the following examples, replace example parameter names with your own values. Example parameter names included `myResourceGroup`, `mystorageaccount`, and `myVM`.

First, create a resource group with [az group create](/cli/azure/group#create). The following example creates a resource group named `myResourceGroup` in the `WestUS` location:

```azurecli
az group create --name myResourceGroup --location westus
```

Create the virtual network with [az network vnet create](/cli/azure/network/vnet#create). The following example creates a virtual network named `myVnet` and subnet named `mySubnetFrontEnd`:

```azurecli
az network vnet create --resource-group myResourceGroup --name myVnet \
  --address-prefix 192.168.0.0/16 --subnet-name mySubnetFrontEnd --subnet-prefix 192.168.1.0/24
```

Create a subnet for the back-end traffic with [az network vnet subnet create](/cli/azure/network/vnet/subnet#create). The following example creates a subnet named `mySubnetBackEnd`:

```azurecli
az network vnet subnet create --resource-group myResourceGroup --vnet-name myVnet \
    --name mySubnetBackEnd --address-prefix 192.168.2.0/24
```

## Create and configure multiple NICs
You can read more details about [deploying multiple NICs using the Azure CLI](../../virtual-network/virtual-network-deploy-multinic-arm-cli.md), including scripting the process of looping through to create all the NICs.

Typically you create a [Network Security Group](../../virtual-network/virtual-networks-nsg.md) or [load balancer](../../load-balancer/load-balancer-overview.md) to help manage and distribute traffic across your VMs. Create a network security group with [az network nsg create](/cli/azure/network/nsg#create). The following example creates a network security group named `myNetworkSecurityGroup`:

```azurecli
az network nsg create --resource-group myResourceGroup \
  --name myNetworkSecurityGroup
```

Create two NICs with [az network nic create](/cli/azure/network/nic#create). The following example creates two NICs, named `myNic1` and `myNic2`, connected the network security group, with one NIC connecting to each subnet:

```azurecli
az network nic create --resource-group myResourceGroup --name myNic1 \
  --vnet-name myVnet --subnet mySubnetFrontEnd \
  --network-security-group myNetworkSecurityGroup
az network nic create --resource-group myResourceGroup --name myNic2 \
  --vnet-name myVnet --subnet mySubnetBackEnd \
  --network-security-group myNetworkSecurityGroup
```

## Create a VM and attach the NICs
When you create the VM, specify the NICs you created with `--nics`. You also need to take care when you select the VM size. There are limits for the total number of NICs that you can add to a VM. Read more about [Linux VM sizes](sizes.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). 

Create a VM with [az vm create](/cli/azure/vm#create). The following example creates a VM named `myVM` using [Azure Managed Disks](../../storage/storage-managed-disks-overview.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json):

```azurecli
az vm create \
    --resource-group myResourceGroup \
    --name myVM \
    --image UbuntuLTS \
    --size Standard_DS2_v2 \
    --admin-username azureuser \
    --ssh-key-value ~/.ssh/id_rsa.pub \
    --nics myNic1 myNic2
```

## Create multiple NICs using Resource Manager templates
Azure Resource Manager templates use declarative JSON files to define your environment. You can read an [overview of Azure Resource Manager](../../azure-resource-manager/resource-group-overview.md). Resource Manager templates provide a way to create multiple instances of a resource during deployment, such as creating multiple NICs. You use *copy* to specify the number of instances to create:

```json
"copy": {
    "name": "multiplenics"
    "count": "[parameters('count')]"
}
```

Read more about [creating multiple instances using *copy*](../../resource-group-create-multiple.md). 

You can also use a `copyIndex()` to then append a number to a resource name, which allows you to create `myNic1`, `myNic2`, etc. The following shows an example of appending the index value:

```json
"name": "[concat('myNic', copyIndex())]", 
```

You can read a complete example of [creating multiple NICs using Resource Manager templates](../../virtual-network/virtual-network-deploy-multinic-arm-template.md).

## Next steps
Review [Linux VM sizes](sizes.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) when trying to creating a VM with multiple NICs. Pay attention to the maximum number of NICs each VM size supports. 