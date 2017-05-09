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

Azure virtual machines use Azure networking for internal and external network communication. In this tutorial, you learn about creating multiple virtual machines (VMs) in a virtual network and configure network connectivity between them. When completed a 'front-end' VM will be accessible from the internet on port 22 for SSH and port 80 for HTTP connections. A 'back-end' VM with a MySQL database will be isolated and only accessible from the front-end VM on port 3306.

This tutorial requires the Azure CLI version 2.0.4 or later. To find the CLI version run `az --version`. If you need to upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).

## Create VM and VNet

An Azure Virtual Network (VNet) is a representation of your own network in the cloud. A VNet is a logical isolation of the Azure cloud dedicated to your subscription. Within a VNet, you find subnets, rules for connectivity to those subnets, and connections from the VMs to the subnets. Azure CLI makes it easy for you to create all the network-related resources that you need to support access to your VMs. 

Before you can create any other Azure resources, you need to create a resource group with az group create. The following example creates a resource group named *myRGNetwork* in the *eastus* location:

```azurecli
az group create --name myRGNetwork --location eastus
```

When you create a virtual machine using Azure CLI, the network resources that it needs are automatically created at the same time. Create *myFrontendVM* and its supporting network resources with [az vm create](https://docs.microsoft.com/cli/azure/vm#create):

```azurecli
az vm create \
  --resource-group myRGNetwork \
  --name myFrontendVM \
  --image UbuntuLTS \
  --generate-ssh-keys
```

After the VM is created, take note of the public IP address. This address is used in later steps of this tutorial:

```bash
{
  "fqdns": "",
  "id": "/subscriptions/{id}/resourceGroups/myRGNetwork/providers/Microsoft.Compute/virtualMachines/myFrontendVM",
  "location": "eastus",
  "macAddress": "00-0D-3A-23-9A-49",
  "powerState": "VM running",
  "privateIpAddress": "10.0.0.4",
  "publicIpAddress": "40.68.254.142",
  "resourceGroup": "myRGNetwork"
}
```

These network resources were created:

- **myFrontendVMNSG** – The network security group that secures incoming traffic to *myFrontendVM*.
- **myVMPublicIP** – The public IP address that enables internet access to *myFrontendVM*.
- **myVMVMNic** – The virtual network interface that provides network connectivity for *myFrontendVM*.
- **myVMVNET** – The virtual network that *myFrontendVM* is connected to.

## Install web server

Create an SSH connection with *myFrontendVM*. Replace the example IP address with the public IP address of the VM:

```bash
ssh 40.68.254.142
```

Run the following commands to install NGINX:

```bash
sudo apt-get -y update && sudo apt-get -y install nginx
```

Close the SSH session:

```bash
exit
```

## Manage internet traffic

A network security group (NSG) contains a list of security rules that allow or deny network traffic to resources connected to a VNet. NSGs can be associated to subnets or individual NICs attached to VMs. Opening or closing access to VMs through ports is done using NSG rules. When you created *myFrontendVM*, inbound port 22 was automatically opened for SSH connectivity.

Open port 80 on *myFrontendVM* with [az vm open-port](https://docs.microsoft.com/cli/azure/vm#open-port):

```azurecli
az vm open-port --resource-group myRGNetwork --name myFrontendVM --port 80
```

Now you can browse to the public IP address of the VM to see the NGINX site.

![NGINX default site](./media/quick-create-cli/nginx.png)

## Manage internal traffic

Internal communication of VMs can also be configured using an NSG. In this section, you learn how to create an additional subnet in the network and assign an NSG to the subnet to allow a connection from *myFrontendVM* to *myBackendVM* on port 3306. The subnet is then assigned to the VM when it is created.

Add a network security group named *myBackendNSG* with [az network nsg create](https://docs.microsoft.com/cli/azure/network/nsg#create). 

```azurecli
az network nsg create \
 --resource-group myRGNetwork \
 --name myBackendNSG
```

Set up a port to enable *myFrontendVM* and *myBackendVM* to communicate with each other in the VNet. Add an NSG rule that allows traffic to *myBackendSubnet* only from *myVMSubnet* with [az network rule create](/cli/azure/network/rule#create):

```azurecli
az network nsg rule create \
 --resource-group myRGNetwork \
 --nsg-name myBackendNSG \
 --name com-rule \
 --access Allow \
 --protocol Tcp \
 --direction Inbound \
 --priority 100 \
 --source-address-prefix 10.0.0.0/24 \
 --source-port-range "*" \
 --destination-address-prefix "*" \
 --destination-port-range 3306
```

## Add back-end subnet

A subnet is a child resource of a VNet, and helps define segments of address spaces within a CIDR block, using IP address prefixes. NICs can be added to subnets, and connected to VMs, providing connectivity for various workloads.

Add *myBackEndSubnet* to *myFrontendVMVNet* with [az network vnet subnet create](https://docs.microsoft.com/cli/azure/network/vnet/subnet#create):

```azurecli
az network vnet subnet create \
 --address-prefix 10.0.1.0/24 \
 --name myBackendSubnet \
 --resource-group myRGNetwork \
 --vnet-name myFrontendVMVNET \
 --network-security-group myBackendNSG
```

## Create back-end VM

Create *myBackendVM* using *myBackendSubnet* with [az vm create](/cli/azure/vm#create):

```azurecli
az vm create \
  --resource-group myRGNetwork \
  --name myBackendVM \
  --image UbuntuLTS \
  --generate-ssh-keys \
  --subnet myBackendSubnet \
  --vnet-name myFrontendVMVNET \
  --public-ip-address ""

```

## Install database

For this tutorial, you copy the private key from your development VM to *myFrontendVM*. In a production environment, it is recommended to create specific keys for use on the VMs rather than use --generate-ssh-keys when you create the VMs. 

The back-end VM is intended to not be publicly accessed. In this section, you learn how to use SSH to log into *myFrontendVM* and then use SSH to log into *myBackendVM* from the *myFrontendVM*.

Replace the example IP address with the public IP address of the *myFrontendVM*:

```bash
scp ~/.ssh/id_rsa 40.68.254.142:~/.ssh/id_rsa
```

Create an SSH connection with *myFrontendVM*. Replace the example IP address with the public IP address of the *myFrontendVM*:

```bash
ssh 40.68.254.142
```

From *myFrontendVM*, connect to *myBackendVM*:

```bash
ssh myBackendVM
```

Run the following command to install MySQL:

```bash
sudo apt-get -y install mysql-server
```

Follow the instructions for setting up MySQL.

Close the SSH sessions:

```bash
exit
```

MySQL is installed to show how an application can be installed on *myBackendVM*, it is not used in this tutorial.

## Next steps

In this tutorial, you learned about creating and securing Azure networks as related to virtual machines. Advance to the next tutorial to learn about monitoring VM security with Azure Security Center.

[Manage virtual machine security](./tutorial-azure-security.md)