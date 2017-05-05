---
title: Azure Virtual Networks and Linux Virtual Machines | Microsoft Docs
description: Tutorial - Manage Azure Virtual Networks and Linux Virtual Machines with the Azure CLI 
services: virtual-machines-linux
documentationcenter: virtual-machines
author: davidmu1
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 05/02/2017
ms.author: davidmu
---

# Manage Azure Virtual Networks and Linux Virtual Machines with the Azure CLI

Azure virtual machines use Azure networking for internal and external network communication. In this tutorial, you will learn about networking virtual machine, providing internet connectivity to VMs, and securing network communication.

This tutorial requires the Azure CLI version 2.0.4 or later. To find the CLI version run `az --version`. If you need to upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).

## VM networking overview

Azure virtual networks enable secure network connections between virtual machines, virtual machines and the internet, and between virtual machines and other Azure services such as Azure SQL database. Virtual networks are broken down into logical segments called subnets. Subnets are used to control network flow, and as a security boundary. When deploying a VM, it will generally include one or more virtual network card which is attached to a subnet.

## Deploy virtual network

For this tutorial, a single virtual network will be created with three subnets. The subnets will be arranged as the follows:

- **Front-end** – VMs that host internet accessible applications and virtual machines.
- **Back-end** – VMs that host back-end databases.
- **Remote access** – hosts a single VM that can be used to remotely access the front-end and back-end VMs.

Before you can create a virtual network, create a resource group with az group create. The following example creates a resource group named myRGNetwork in the eastus location.

```azurecli
az group create --name myRGNetwork --location eastus
```

### Create virtual network

Us the [az network vnet create](/cli/azure/network/vnet#create) command to create a virtual network. This command can also create an initial subnet. In this example, the network is named *mvVnet* and is given a address prefix of 10.0.0.0/16. The subnet *mySubnetFrontEnd* and is given a prefix of *10.0.1.0/24*.

```azurecli
az network vnet create \
  --resource-group myRGNetwork \
  --name myVnet \
  --address-prefix 10.0.0.0/16 \
  --subnet-name mySubnetFrontEnd \
  --subnet-prefix 10.0.1.0/24
```

### Create subnets

A new subnet will be added to the virtual network using the [az network vnet subnet create](/cli/azure/network/vnet/subnet#create) command. In this example the subnet is named *mySubnetBackEnd* and is given an address prefix of *10.0.2.0/24*. This subnet will be used with all back-end services.

```azurecli
az network vnet subnet create \
  --resource-group myRGNetwork \
  --vnet-name myVnet \
  --name mySubnetBackEnd \
  --address-prefix 10.0.2.0/24
```

Finally create a subnet for the remote access systems. In this example the subnet is named *mySubnetRemoteAccess* and is given an address prefix of *10.0.3.0/24*.

```azurecli
az network vnet subnet create \
  --resource-group myRGNetwork \
  --vnet-name myVnet \
  --name mySubnetRemoteAccess \
  --address-prefix 10.0.3.0/24
```

In the next section, virtual machines will be created and connected to these subnets.

## Create public IP address

A public IP address allows Azure resources to be accessible on the internet. In this section of the tutorial multiple VMs will be created to demonstrate how to work with public IP addresses.

### Allocation method

A public IP address can be allocated as either dynamic or static. The default public IP address allocation method is dynamic, where the IP address is released when the VM is stopped. This causes the IP address to change during any operation that includes a VM deallocation.

The allocation method can be set to static which ensures that the IP address will remain assigned to a VM, even during a deallocated state. When using a statically allocated IP address, the IP address cannot be specified. Instead it is allocated from a pool of available addresses.

### Dynamic allocation

When creating a VM with the [az vm create](/cli/azure/vm#create) command, the default public IP address allocation method is dynamic. In the following example, a VM is created with a dynamic IP address. 

```azurecli
az vm create \
  --resource-group myRGNetwork \
  --name myRemoteAccessVM \
  --vnet-name myVnet \
  --subnet mySubnetRemoteAccess \
  --nsg myNSGRemoteAccess \
  --image UbuntuLTS \
  --generate-ssh-keys \
  --no-wait
```

### Static allocation

To create a VM with a statically allocated IP address, the `--public-ip-address-allocation` argument can be used with a value of `static`. 

```azurecli
az vm create \
  --resource-group myRGNetwork \
  --name myFrontEndVM \
  --vnet-name myVnet \
  --subnet mySubnetFrontEnd \
  --nsg myNSGFrontEnd \
  --public-ip-address myFrontEndIP \
  --public-ip-address-allocation static \
  --image UbuntuLTS \
  --generate-ssh-keys \
  --no-wait
```

### Change allocation method

The IP address allocation method can be changed to using the [az network public-ip update](/cli/azure/network/public-ip#update) command. In this example, the IP address allocation method of the VM created in the last step is changed to dynamic.

```azurecli
az network public-ip update --name myFrontEndIP --allocation-method Dynamic
```

### No public IP address

In many cases, a VM does not need to be accessible over the internet. To create a VM without a public IP address use the ` --private-ip-address` argument with an empty set of double quotes.

```azurecli
az vm create \
  --resource-group myRGNetwork \
  --name myBackEndVM \
  --vnet-name myVnet \
  --subnet mySubnetBackEnd \
  --nsg myNSGBackEnd \
  --public-ip-address "" \
  --image UbuntuLTS \
  --generate-ssh-keys
```

## Secure network traffic

A network security group (NSG) contains a list of security rules that allow or deny network traffic to resources connected to Azure Virtual Networks (VNet). NSGs can be associated to subnets or individual network interfaces. When an NSG is associated to a subnet, the rules apply to all resources connected to the subnet. 

### Network security group rules

NSG rules define networking ports over which traffic will be allowed or denied. The rules can include source and destination IP address ranges so that traffic controlled between specific systems. NSG rules also include a priority (between 1—and 4096). Rules are evaluated in the order of priority, a rule with a priority of 100 will be evaluated before a rule with priority 200.

All NSGs contain a set of default rules. The default rules cannot be deleted, but because they are assigned the lowest priority, they can be overridden by the rules that you create.

- **Virtual network** - Traffic originating and ending in a virtual network is allowed both in inbound and outbound directions.
- **Internet** - Outbound traffic is allowed, but inbound traffic is blocked.
- **Load balancer** - Allow Azure’s load balancer to probe the health of your VMs and role instances. If you are not using a load balanced set you can override this rule.

### Create network security groups

A network security group can be created with the VM when using the [az vm create](/cli/azure/vm#create) command. When doing so an NSG rule is auto created to allow traffic on port 22 from any destination. You may decide to modify this default rule which will be shown in a later example.

A network security group rule can also be created independently of a VM using the [az network nsg create](/cli/azure/network/nsg/rule#create) command. Because an NSG was auto created for the VMs in this tutorial, there is no need to individually create an NSG. 

### Secure incoming traffic

A network security group rule is created with the [az network nsg rule create](/cli/azure/network/nsg/rule#create) command. In this example, a rule allows internet traffic to the front-end VM on port 80. This will allow a web application to be hosted on the VM and accessed from the internet 

```azurecli
az network nsg rule create \
  --resource-group myRGNetwork \
  --nsg-name myNSGFrontEnd \
  --name http \
  --access allow \
  --protocol Tcp \
  --direction Inbound \
  --priority 200 \
  --source-address-prefix "*" \
  --source-port-range "*" \
  --destination-address-prefix "*" \
  --destination-port-range 80
```

### Secure VM to VM traffic

Network security rules can also apply between VMs. For this example, VMs in the remote-access subnet need to be able to access VMs on the front-end and back-end subnets on port 22. This configuration will allow SSH connections to be made with these VMs.

First, get the name of the NSG rule for the back-end vm. In this example, the name is stored in a variable named *nsgrule*. 

```azurecli
nsgrule=$(az network nsg rule list --resource-group myRGNetwork --nsg-name myNSGBackEnd --query [0].name -o tsv)
```

Next, use the [az network nsg rule update](/cli/azure/network/nsg/rule#update) command to modify the rule. In this example the rule is modified so that only traffic originating at the remote access subnet is allowed on port 22. This configuration ensures that SSH connections can only be made from the remote access subnet. 

```azurecli
az network nsg rule update \
  --resource-group myRGNetwork \
  --nsg-name myNSGBackEnd \
  --name $nsgrule \
  --protocol tcp \
  --direction inbound \
  --priority 100 \
  --source-address-prefix 10.0.3.0/24 \
  --source-port-range '*' \
  --destination-address-prefix '*' \
  --destination-port-range 22 \
  --access allow
```

Because all NSGs have a default rule allowing all traffic between VMs in the same VNet, a rule can be created to block all traffic.

```azurecli
az network nsg rule create \
  --resource-group myRGNetwork \
  --nsg-name myNSGBackEnd \
  --name denyAll \
  --access Deny \
  --protocol Tcp \
  --direction Inbound \
  --priority 200 \
  --source-address-prefix "*" \
  --source-port-range "*" \
  --destination-address-prefix "*" \
  --destination-port-range "*"
```

## Next steps

In this tutorial, you learned about creating and securing Azure networks as related to virtual machines. Advance to the next tutorial to learn about monitoring VM security with Azure Security Center.

[Manage virtual machine security](./tutorial-azure-security.md)