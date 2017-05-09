---
title: Azure Virtual Networks and Linux Virtual Machines | Microsoft Docs
description: Tutorial - Manage Azure Virtual Networks and Linux Virtual Machines with the Azure CLI 
services: virtual-machines-linux
documentationcenter: virtual-machines
author: neilpeterson
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 05/09/2017
ms.author: nepeters
---

# Manage Azure Virtual Networks and Linux Virtual Machines with the Azure CLI

Azure virtual machines use Azure networking for internal and external network communication. When configuring Azure networking it is important to consider access and security requirements. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Deploy a virtual network
> * Create a subnet within a virtual network
> * Attach virtual machines to a subnet
> * Manage virtual machine public IP addresses
> * Secure incoming internet traffic
> * Secure VM to VM traffic

This tutorial requires the Azure CLI version 2.0.4 or later. To find the CLI version run `az --version`. If you need to upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).

## VM networking overview

Azure virtual networks enable secure network connections between virtual machines, virtual machines and the internet, and between virtual machines and other Azure services such as Azure SQL database. Virtual networks are broken down into logical segments called subnets. Subnets are used to control network flow, and as a security boundary. When deploying a VM, it will generally include one or more virtual network card which is attached to a subnet.

## Deploy virtual network

For this tutorial, a single virtual network is created with two subnets subnets. A front-end subnet can host a web application, and the back-end subnet can host a database for the application.

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

### Create subnet

A new subnet will be added to the virtual network using the [az network vnet subnet create](/cli/azure/network/vnet/subnet#create) command. In this example the subnet is named *mySubnetBackEnd* and is given an address prefix of *10.0.2.0/24*. This subnet will be used with all back-end services.

```azurecli
az network vnet subnet create \
  --resource-group myRGNetwork \
  --vnet-name myVnet \
  --name mySubnetBackEnd \
  --address-prefix 10.0.2.0/24
```

In the next section, virtual machines will be created and connected to these subnets.

## Understand public IP address

A public IP address allows Azure resources to be accessible on the internet. In this section of the tutorial multiple VMs will be created to demonstrate how to work with public IP addresses.

### Allocation method

A public IP address can be allocated as either dynamic or static. The default public IP address allocation method is dynamic, where the IP address is released when the VM is deallocated. This causes the IP address to change during any operation that includes a VM deallocation.

The allocation method can be set to static which ensures that the IP address will remain assigned to a VM, even during a deallocated state. When using a statically allocated IP address, the IP address cannot be specified. Instead it is allocated from a pool of available addresses.

### Dynamic allocation

When creating a VM with the [az vm create](/cli/azure/vm#create) command, the default public IP address allocation method is dynamic. In the following example, a VM is created with a dynamic IP address. 

```azurecli
az vm create \
  --resource-group myRGNetwork \
  --name myFrontEndVM \
  --vnet-name myVnet \
  --subnet mySubnetFrontEnd \
  --nsg myNSGFrontEnd \
  --public-ip-address myFrontEndIP \
  --image UbuntuLTS \
  --generate-ssh-keys
```

### Static allocation

When creating a virtual machine using the [az vm create](/cli/azure/vm#create) command, include the `--public-ip-address-allocation static` argument to assign a static public IP address. This is not demonstrated in this tutorial, however in the next section a dynamically allocated IP address will be changed to static allocation. 

### Change allocation method

The IP address allocation method can be changed to using the [az network public-ip update](/cli/azure/network/public-ip#update) command. In this example, the IP address allocation method of the front-end VM is changed to static.

First, deallocate the VM.

```azurecli
az vm deallocate --resource-group myRGNetwork --name myFrontEndVM
```

Use the [az network public-ip update](/azure/network/public-ip#update) command to update the allocation method. 

```azurecli
az network public-ip update --resource-group myRGNetwork --name myFrontEndIP --allocation-method static
```

Start the VM.

```azurecli
az vm start --resource-group myRGNetwork --name myFrontEndVM --no-wait
```

### No public IP address

In many cases, a VM does not need to be accessible over the internet. To create a VM without a public IP address use the `--public-ip-address ""` argument with an empty set of double quotes. This is demonstrated later in this tutorial

## Secure network traffic

A network security group (NSG) contains a list of security rules that allow or deny network traffic to resources connected to Azure Virtual Networks (VNet). NSGs can be associated to subnets or individual network interfaces. When an NSG is associated to a subnet, the rules apply to all resources connected to the subnet. 

### Network security group rules

NSG rules define networking ports over which traffic is allowed or denied. The rules can include source and destination IP address ranges so that traffic is controlled between specific systems or subnets. NSG rules also include a priority (between 1—and 4096). Rules are evaluated in the order of priority, a rule with a priority of 100 is evaluated before a rule with priority 200.

All NSGs contain a set of default rules. The default rules cannot be deleted, but because they are assigned the lowest priority, they can be overridden by the rules that you create.

- **Virtual network** - Traffic originating and ending in a virtual network is allowed both in inbound and outbound directions.
- **Internet** - Outbound traffic is allowed, but inbound traffic is blocked.
- **Load balancer** - Allow Azure’s load balancer to probe the health of your VMs and role instances. If you are not using a load balanced set you can override this rule.

### Create network security groups

A network security group can be created at the same time as a VM using the [az vm create](/cli/azure/vm#create) command. When doing so an NSG rule is auto created to allow traffic on port *22* from any destination. Earlier in this tutorial, the front-end NSG was created with the VM, which also auto created a rule for port 22. 

In some cases it may be helpful to create an NSG independently, such as when default SSH rules should not be created or when the NSG should be attached to a subnet as opposed to a network interface. Use the [az network nsg create](/cli/azure/network/nsg#create) command to create a network security group.

```azurecli
az network nsg create --resource-group myRGNetwork --name myNSGBackEnd
```

Instead of associating the NSG to a network interface, it will be associated with a subnet. In this configuration any VM that is attached to the subnet will inherit the NSG rules.

Update the exsisting subnet named *mySubnetBackEnd* with the new NSG.

```azurecli
az network vnet subnet update \
  --resource-group myRGNetwork \
  --vnet-name myVnet \
  --name mySubnetBackEnd \
  --network-security-group myNSGBackEnd
```

Now create a virtual machine, which will be attached to the *mySubnetBackEnd*.

```azurecli
az vm create \
  --resource-group myRGNetwork \
  --name myBackEndVM \
  --vnet-name myVnet \
  --subnet mySubnetBackEnd \
  --public-ip-address "" \
  --image UbuntuLTS \
  --generate-ssh-keys
```

### Secure incoming traffic

When the front end VM was created, an NSG rule was created to allow incoming traffic on port 22. This rule will allow SSH connections to the VM. For this example, traffic should also be allowed on port *80*. This allows a web application to be accessed on the VM.

Use the [az network nsg rule create](/cli/azure/network/nsg/rule#create) command to create a new rule for port *80*.

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

The front end VM is now only accessible on port *22* and port *80*. All other incoming traffic will be blocked at the network security group. It may be helpful to visualize the NSG rule configurations. This can be done with the [az network rule list](/cli/azure/network/nsg/rule#list) command. 

```azurecli
az network nsg rule list --resource-group myRGNetwork --nsg-name myNSGFrontEnd --output table
```

Output:

```azurecli
Access    DestinationAddressPrefix      DestinationPortRange  Direction    Name                 Priority  Protocol    ProvisioningState    ResourceGroup    SourceAddressPrefix    SourcePortRange
--------  --------------------------  ----------------------  -----------  -----------------  ----------  ----------  -------------------  ---------------  ---------------------  -----------------
Allow     *                                               22  Inbound      default-allow-ssh        1000  Tcp         Succeeded            myRGNetwork      *                      *
Allow     *                                               80  Inbound      http                      200  Tcp         Succeeded            myRGNetwork      *                      *
```

### Secure VM to VM traffic

Network security rules can also apply between VMs. For this example, the front end VM needs to communicate with the back end VM on port *22* and *3306*. This will allow SSH connections from the front-end VM, and also allow an application on the front-end VM to communicate with a back-end MySQL database. All other traffic should be blocked between the front-end and back-end virtual machines.

Use the [az network nsg rule create](/cli/azure/network/nsg/rule#create) command to create a rule for port 22. Notice that the `--source-address-prefix` argument specifies a value of *10.0.1.0/24*. This will ensure that only traffic from the front-end is allowed through the NSG.

```azurecli
az network nsg rule create \
  --resource-group myRGNetwork \
  --nsg-name myNSGBackEnd \
  --name SSH \
  --access Allow \
  --protocol Tcp \
  --direction Inbound \
  --priority 100 \
  --source-address-prefix 10.0.1.0/24 \
  --source-port-range "*" \
  --destination-address-prefix "*" \
  --destination-port-range "22"
```

Now add a rule for MySQL traffic on port 3306.

```azurecli
az network nsg rule create \
  --resource-group myRGNetwork \
  --nsg-name myNSGBackEnd \
  --name MySQL \
  --access Allow \
  --protocol Tcp \
  --direction Inbound \
  --priority 200 \
  --source-address-prefix 10.0.1.0/24 \
  --source-port-range "*" \
  --destination-address-prefix "*" \
  --destination-port-range "80"
```

Finally, because NSGs have a default rule allowing all traffic between VMs in the same VNet, a rule can be created for the back-end NSGs to block all traffic. Notice here that the `--priority` is given a value of *300*, which is lower that both the NSG and MySQL rules. This will ensure that SSH and MySQL traffic is still allowed through the NSG.

```azurecli
az network nsg rule create \
  --resource-group myRGNetwork \
  --nsg-name myNSGBackEnd \
  --name denyAll \
  --access Deny \
  --protocol Tcp \
  --direction Inbound \
  --priority 300 \
  --source-address-prefix "*" \
  --source-port-range "*" \
  --destination-address-prefix "*" \
  --destination-port-range "*"
```

The back-end VM is now only accessible on port *22* and port *3306* from the front-end subnet. All other incoming traffic will be blocked at the network security group. It may be helpful to visualize the NSG rule configurations. This can be done with the [az network rule list](/cli/azure/network/nsg/rule#list) command. 

```azurecli
az network nsg rule list --resource-group myRGNetwork --nsg-name myNSGBackEnd --output table
```

Output:

```azurecli
Access    DestinationAddressPrefix    DestinationPortRange    Direction    Name       Priority  Protocol    ProvisioningState    ResourceGroup    SourceAddressPrefix    SourcePortRange
--------  --------------------------  ----------------------  -----------  -------  ----------  ----------  -------------------  ---------------  ---------------------  -----------------
Allow     *                           22                      Inbound      SSH             100  Tcp         Succeeded            myRGNetwork      10.0.1.0/24            *
Allow     *                           80                      Inbound      MySQL           200  Tcp         Succeeded            myRGNetwork      10.0.1.0/24            *
Deny      *                           *                       Inbound      denyAll         300  Tcp         Succeeded            myRGNetwork      *                      *
```

## Next steps

In this tutorial, you created and secured Azure networks as related to virtual machines. You learned how to:

> [!div class="checklist"]
> * Deploy a virtual network
> * Create a subnet within a virtual network
> * Attach virtual machines to a subnet
> * Manage virtual machine public IP addresses
> * Secure incoming internet traffic
> * Secure VM to VM traffic

Advance to the next tutorial to learn about securing data on virtual machines using Azure backup. 

> [!div class="nextstepaction"]
> [Back up Linux virtual machines in Azure](./tutorial-backup-vms.md)