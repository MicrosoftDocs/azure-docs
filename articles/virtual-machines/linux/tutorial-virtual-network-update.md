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
az network vnet create --resource-group myRGNetwork --name myVnet --address-prefix 10.0.0.0/16 --subnet-name mySubnetFrontEnd --subnet-prefix 10.0.1.0/24
```

### Create subnets

A new subnet will be added to the virtual network using the [az network vnet subnet create](/cli/azure/network/vnet/subnet#create) comment. In this example the subnet is named *mySubnetBackEnd* and will be used with all back-end services.

```azurecli
az network vnet subnet create --resource-group myRGNetwork --vnet-name myVnet --name mySubnetBackEnd --address-prefix 10.0.2.0/24
```

Finally create a subnet for the remote access systems.

```azurecli
az network vnet subnet create --resource-group myRGNetwork --vnet-name myVnet --name mySubnetRemoteAccess --address-prefix 10.0.3.0/24
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
az vm create --resource-group myRGNetwork --name myRemoteAccessVM --vnet-name myVnet --subnet mySubnetRemoteAccess --nsg myNSGRemoteAccess --image UbuntuLTS --generate-ssh-keys
```

### Static allocation

To create a VM with a statically allocated IP address, the `--public-ip-address-allocation` argument can be used with a value of `static`. 

```azurecli
az vm create --resource-group myRGNetwork --name myFrontEndVM --vnet-name myVnet --subnet mySubnetFrontEnd --nsg myNSGFrontEnd --public-ip-address myFrontEndIP --public-ip-address-allocation static ---image UbuntuLTS --generate-ssh-keys --no-wait
```

### Change allocation method

The IP address allocation method can be changed to using the [az network public-ip update](/cli/azure/network/public-ip#update) command. In this example, the IP address allocation method of the VM created in the last step is changed to dynamic.

```azurecli
az network public-ip update --name myFrontEndIP --allocation-method Dynamic
```

### No public IP address

In many cases, a VM does not need to be accessible over the internet. To create a VM without a public IP address use the ` --private-ip-address` argument with an empty set of double quotes.

```azurecli
az vm create --resource-group myRGNetwork --name myBackEndVM --vnet-name myVnet --subnet mySubnetBackEnd --nsg myNSGBackEnd --public-ip-address "" --image UbuntuLTS --generate-ssh-keys --no-wait
```

## Secure network traffic

A network security group (NSG) contains a list of security rules that allow or deny network traffic to resources connected to Azure Virtual Networks (VNet). NSGs can be associated to subnets or individual network interfaces. When an NSG is associated to a subnet, the rules apply to all resources connected to the subnet.

### Default NSG rules

All NSGs contain a set of default rules. The default rules cannot be deleted, but because they are assigned the lowest priority, they can be overridden by the rules that you create. +
The default rules allow and disallow traffic as follows:

- **Virtual network** - Traffic originating and ending in a virtual network is allowed both in inbound and outbound directions.
- **Internet** - Outbound traffic is allowed, but inbound traffic is blocked.
- **Load balancer** - Allow Azure’s load balancer to probe the health of your VMs and role instances. If you are not using a load balanced set you can override this rule.

### Tutorial configuration

In the following steps, network access will be configured between the three VMs in this configuration.

- Front-End VM – Port 80 allowed in from the internet so that the hosted application is accessible. Port 22 will be allowed in from the remote access subnet so that an SSH connection can be made if needed.
- Back-End VM – Port 3306 allow in only from the front-end subnet to allow for database communications between the front-end application and a MySQL instance. Port 22 will be allowed in from the remote access subnet so that an SSH connection can be made if needed. Because a default rule exists that allows all inter-vnet traffic, a rule is created to block all traffic. 
- Remote access VM – Port 22 will be allowed in from the internet. This will allow an SSH session to be created with the VM from the internet.

### Secure incoming traffic

```azurecli
az network nsg rule create --resource-group myRGNetwork --nsg-name myNSGFrontEnd --name http --access allow --protocol Tcp --direction Inbound --priority 200 --source-address-prefix "*" --source-port-range "*" --destination-address-prefix "*" --destination-port-range 80
```

### Secure VM to VM traffic

```azurecli
nsgrule=$(az network nsg rule list --resource-group myRGNetwork --nsg-name myNSGBackEnd --query [0].name -o tsv)
```

```azurecli
az network nsg rule update --resource-group myRGNetwork --nsg-name myNSGBackEnd --name $nsgrule --protocol tcp --direction inbound --priority 100 --source-address-prefix 10.0.3.0/24 --source-port-range '*' --destination-address-prefix '*' --destination-port-range 22 --access allow
```

```azurecli
az network nsg rule create --resource-group myRGNetwork --nsg-name myNSGBackEnd --name denyAll --access Deny --protocol Tcp --direction Inbound --priority 200 --source-address-prefix "*" --source-port-range "*" --destination-address-prefix "*" --destination-port-range "*"
```

## Next steps

In this tutorial, you learned about creating and securing Azure networks as related to virtual machines. Advance to the next tutorial to learn about monitoring VM security with Azure Security Center.

[Manage virtual machine security](./tutorial-azure-security.md)