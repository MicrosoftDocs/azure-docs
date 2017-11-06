---
title: Create a Linux VM in Azure with multiple NICs | Microsoft Docs
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
ms.date: 05/11/2017
ms.author: iainfou

---
# How to create a Linux virtual machine in Azure with multiple network interface cards
You can create a virtual machine (VM) in Azure that has multiple virtual network interfaces (NICs) attached to it. A common scenario is to have different subnets for front-end and back-end connectivity, or a network dedicated to a monitoring or backup solution. This article details how to create a VM with multiple NICs attached to it and how to add or remove NICs from an existing VM. For detailed information, including how to create multiple NICs within your own Bash scripts, read more about [deploying multi-NIC VMs](../../virtual-network/virtual-network-deploy-multinic-arm-cli.md). Different [VM sizes](sizes.md) support a varying number of NICs, so size your VM accordingly.

This article details how to create a VM with multiple NICs with the Azure CLI 2.0. You can also perform these steps with the [Azure CLI 1.0](multiple-nics-nodejs.md).


## Create supporting resources
Install the latest [Azure CLI 2.0](/cli/azure/install-az-cli2) and log in to an Azure account using [az login](/cli/azure/#login).

In the following examples, replace example parameter names with your own values. Example parameter names included *myResourceGroup*, *mystorageaccount*, and *myVM*.

First, create a resource group with [az group create](/cli/azure/group#create). The following example creates a resource group named *myResourceGroup* in the *eastus* location:

```azurecli
az group create --name myResourceGroup --location eastus
```

Create the virtual network with [az network vnet create](/cli/azure/network/vnet#create). The following example creates a virtual network named *myVnet* and subnet named *mySubnetFrontEnd*:

```azurecli
az network vnet create \
    --resource-group myResourceGroup \
    --name myVnet \
    --address-prefix 192.168.0.0/16 \
    --subnet-name mySubnetFrontEnd \
    --subnet-prefix 192.168.1.0/24
```

Create a subnet for the back-end traffic with [az network vnet subnet create](/cli/azure/network/vnet/subnet#create). The following example creates a subnet named *mySubnetBackEnd*:

```azurecli
az network vnet subnet create \
    --resource-group myResourceGroup \
    --vnet-name myVnet \
    --name mySubnetBackEnd \
    --address-prefix 192.168.2.0/24
```

Create a network security group with [az network nsg create](/cli/azure/network/nsg#create). The following example creates a network security group named *myNetworkSecurityGroup*:

```azurecli
az network nsg create \
    --resource-group myResourceGroup \
    --name myNetworkSecurityGroup
```

## Create and configure multiple NICs
Create two NICs with [az network nic create](/cli/azure/network/nic#create). The following example creates two NICs, named *myNic1* and *myNic2*, connected the network security group, with one NIC connecting to each subnet:

```azurecli
az network nic create \
    --resource-group myResourceGroup \
    --name myNic1 \
    --vnet-name myVnet \
    --subnet mySubnetFrontEnd \
    --network-security-group myNetworkSecurityGroup
az network nic create \
    --resource-group myResourceGroup \
    --name myNic2 \
    --vnet-name myVnet \
    --subnet mySubnetBackEnd \
    --network-security-group myNetworkSecurityGroup
```

## Create a VM and attach the NICs
When you create the VM, specify the NICs you created with `--nics`. You also need to take care when you select the VM size. There are limits for the total number of NICs that you can add to a VM. Read more about [Linux VM sizes](sizes.md). 

Create a VM with [az vm create](/cli/azure/vm#create). The following example creates a VM named *myVM*:

```azurecli
az vm create \
    --resource-group myResourceGroup \
    --name myVM \
    --image UbuntuLTS \
    --size Standard_DS3_v2 \
    --admin-username azureuser \
    --generate-ssh-keys \
    --nics myNic1 myNic2
```

## Add a NIC to a VM
The previous steps created a VM with multiple NICs. You can also add NICs to an existing VM with the Azure CLI 2.0. 

Create another NIC with [az network nic create](/cli/azure/network/nic#create). The following example creates a NIC named *myNic3* connected to the back-end subnet and network security group created in the previous steps:

```azurecli
az network nic create \
    --resource-group myResourceGroup \
    --name myNic3 \
    --vnet-name myVnet \
    --subnet mySubnetBackEnd \
    --network-security-group myNetworkSecurityGroup
```

To add a NIC to an existing VM, first deallocate the VM with [az vm deallocate](/cli/azure/vm#deallocate). The following example deallocates the VM named *myVM*:


```azurecli
az vm deallocate --resource-group myResourceGroup --name myVM
```

Add the NIC with [az vm nic add](/cli/azure/vm/nic#add). The following example adds *myNic3* to *myVM*:

```azurecli
az vm nic add \
    --resource-group myResourceGroup \
    --vm-name myVM \
    --nics myNic3
```

Start the VM with [az vm start](/cli/azure/vm#start):

```azurecli
az vm start --resource-group myResourceGroup --name myVM
```

## Remove a NIC from a VM
To remove a NIC from an existing VM, first deallocate the VM with [az vm deallocate](/cli/azure/vm#deallocate). The following example deallocates the VM named *myVM*:

```azurecli
az vm deallocate --resource-group myResourceGroup --name myVM
```

Remove the NIC with [az vm nic remove](/cli/azure/vm/nic#remove). The following example removes *myNic3* from *myVM*:

```azurecli
az vm nic remove \
    --resource-group myResourceGroup \
    --vm-name myVM 
    --nics myNic3
```

Start the VM with [az vm start](/cli/azure/vm#start):

```azurecli
az vm start --resource-group myResourceGroup --name myVM
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

## Configure guest OS for multiple NICs

When creating multiple NICs for a Linux Guest-OS based VM
it is required to create additional routing rules which allows to send and receive traffic
belonging to a specific NIC only. Otherwise traffic belonging to eth1 can not be processed correct, 
due to the defined default route.  


### Solution

First add two routing tables to the file /etc/iproute2/rt_tables

```bash
echo "200 eth0-rt" >> /etc/iproute2/rt_tables
echo "201 eth1-rt" >> /etc/iproute2/rt_tables
```

To make the change persistent and applied during the network stack activation, it is required 
to alter the */etc/sysconfig/network-scipts/ifcfg-eth0* and */etc/sysconfig/network-scipts/ifcfg-eth1* file.
Alter the line *"NM_CONTROLLED=yes"* to *"NM_CONTROLLED=no"*.
Without this step the additonal rules/routing we are going to add taking no effect.
 
Next step is to extend the routing tables. In order to make the next steps more visible let's assume we have the following setup in place

*Routing*

```bash
default via 10.0.1.1 dev eth0 proto static metric 100
10.0.1.0/24 dev eth0 proto kernel scope link src 10.0.1.4 metric 100
10.0.1.0/24 dev eth1 proto kernel scope link src 10.0.1.5 metric 101
168.63.129.16 via 10.0.1.1 dev eth0 proto dhcp metric 100
169.254.169.254 via 10.0.1.1 dev eth0 proto dhcp metric 100
```
    
*Interfaces*

```bash
lo: inet 127.0.0.1/8 scope host lo
eth0: inet 10.0.1.4/24 brd 10.0.1.255 scope global eth0    
eth1: inet 10.0.1.5/24 brd 10.0.1.255 scope global eth1
```
    
    
With the above information it is possible to create the following additional files as root

*   /etc/sysconfig/network-scripts/rule-eth0
*   /etc/sysconfig/network-scripts/route-eth0
*   /etc/sysconfig/network-scripts/rule-eth1
*   /etc/sysconfig/network-scripts/route-eth1

The content of each file is the following
```bash
cat /etc/sysconfig/network-scripts/rule-eth0
from 10.0.1.4/32 table eth0-rt
to 10.0.1.4/32 table eth0-rt

cat /etc/sysconfig/network-scripts/route-eth0
10.0.1.0/24 dev eth0 table eth0-rt
default via 10.0.1.1 dev eth0 table eth0-rt

cat /etc/sysconfig/network-scripts/rule-eth1
from 10.0.1.5/32 table eth1-rt
to 10.0.1.5/32 table eth1-rt

cat /etc/sysconfig/network-scripts/route-eth1
10.0.1.0/24 dev eth1 table eth1-rt
default via 10.0.1.1 dev eth1 table eth1-rt
```

After the files got created and popultated it is necessary to restart the network service
    `systemctl restart network`

Connecting from the outside against either eth0 or eth1 is possible now

## Next steps
Review [Linux VM sizes](sizes.md) when trying to creating a VM with multiple NICs. Pay attention to the maximum number of NICs each VM size supports. 
