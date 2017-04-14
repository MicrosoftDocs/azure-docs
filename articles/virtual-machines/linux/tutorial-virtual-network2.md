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
ms.date: 04/11/2017
ms.author: davidmu
---

# Manage Azure Virtual Networks and Linux Virtual Machines with the Azure CLI

In this tutorial, you create two virtual machines and configure network connectivity and security between these VMs.

To complete this tutorial, make sure that you have installed the latest [Azure CLI 2.0](/cli/azure/install-azure-cli).

## Step 1 - Create front-end VM 

When creating an Azure virtual machine, networking resources are automatically created for you. These resources include:

- Virtual network – Azure network used for communication between Azure resources. 
- Virtual network interface - Connects an Azure virtual machine to the Azure network.
- Public IP address – Connects a virtual machine to the public internet.
- Network security group -Secures incoming and outgoing virtual machine network traffic.
- Network security group rules -  allow or deny traffic on specific network ports.

Before creating a VM, create a resource group using the [az group create](/cli/azure/group#create) command. 

```azurecli
az group create --name myTutorial2 --location westus
```

Create a VM using the [az vm create](/cli/azure/vm#create) command. 

```azurecli
az vm create --resource-group myTutorial2 --name myVM --image UbuntuLTS --generate-ssh-keys
```

Once the VM has been created, take note of the public IP address, this address will be used in later steps of this tutorial.

```bash
{
  "fqdns": "",
  "id": "/subscriptions/d5b9d4b7-6fc1-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM",
  "location": "westus",
  "macAddress": "00-0D-3A-23-9A-49",
  "powerState": "VM running",
  "privateIpAddress": "10.0.0.4",
  "publicIpAddress": "40.68.254.142",
  "resourceGroup": "myTutorial2"
}
```

## Step 2 - Install Web server

Create an SSH connection with the virtual machine. Replace the example IP address with the public IP adress of the VM.

```bash
ssh 40.58.254.142
```

Run the following commands to install NGINX

```bash
sudo apt-get -y update
sudo apt-get -y install nginx
```

Close the SSH session.

```bash
exit
```

## Step 2 - Allow web traffic

In the previous steps, a VM was deployed and NGINX installed. Until a network security group rule has been created for port 80, the NGINX web server is inaccessible. 

Use the [az vm open-port](/cli/azure/vm#open-port) command to open port 80.

```azurecli
az vm open-port --port 80 --resource-group myTutorial2 --name myVM
```

Now browse to the public IP address of the virtual machine to see the NGINX site. 

![NGINX default site](./media/quick-create-cli/nginx.png) 

## Step 3 - Create back-end NSG

In the previous set of exercises a single virtual machine was created, networking resources automatically created, and port 80 opened for web traffic. This configuration will now be expanded on by creating a second virtual machine (back-end). The back-end virtual machine is not exposed to the internet, and only allows incoming traffic from the first virtual machine.

Use the [az network nsg create](/cli/azure/network/nsg#create) command to create a network security group. This NSG is used to control traffic to the back-end VM.

```azurecli
az network nsg create --resource-group myTutorial2 --name myBackendNSG
```

## Step 4 - Create back-end subnet

A new subnet is created for the back-end virtual machine. In this case, the network security group is attached to the subnet as opposed to a virtual machines network card, as seen in the previous example. When an NSG is attached to a subnet, the NSG rules applys to all VMs that are also attached to the subnet.

Use the [az network vnet subnet create](/cli/azure/network/vnet/subnet#create) command to create the subnet. The `--network-security-group` argument is used to specify the NSG to use.

```azurecli
az network vnet subnet create \
 --address-prefix 10.0.1.0/24 \
 --name myBackendSubnet \
 --resource-group myTutorial2 \
 --vnet-name myVMVNET \
 --network-security-group myBackendNSG
```

## Step 5 - Create back-end VM

Now that an NSG and subnet has been created, create a new virtual machine. In this example, the VM is attached to the subnet using the `--subnet` argument. Also note that the `--public-ip-address` argument has a value of empty quotes. The empty quotes indicates that no public IP address is created.

```azurecli
az vm create \
  --resource-group myTutorial2 \
  --name myVM2 \
  --image UbuntuLTS \
  --generate-ssh-keys \
  --subnet myBackendSubnet \
  --vnet-name myVMVNET \
  --public-ip-address ""
```

## Step 6 - Secure outbound traffic

Use the [az network nsg rule create]( /cli/azure/network/nsg/rule#create) command to create an NSG rule that denies all internet bound traffic from the back-end virtual machine.

```azurecli
az network nsg rule create \
 --resource-group myTutorial2 \
 --nsg-name myBackendNSG \
 --name web-rule \
 --access Deny \
 --protocol Tcp  \
 --direction Outbound  \
 --priority 200 \
 --source-address-prefix "*" \
 --source-port-range "*" \
 --destination-address-prefix "*" \
 --destination-port-range "*"
```

## Step 7 - Secure traffic between VMs

Finally, inbound traffic to the back-end virtual machine is limited such that only traffic on port 22, originating from the front-end subnet is allowed.  In this configuration, the back-end VM is not accessible from the internet, however the front-end VM can be used as a ‘jump box’ for accessing the back-end VM.

Use the [az network nsg rule create]( /cli/azure/network/nsg/rule#create) command to create an NSG rule limiting traffic.

```azurecli
az network nsg rule create \
 --resource-group myTutorial2 \
 --nsg-name myBackendNSG \
 --name com-rule \
 --access Allow \
 --protocol Tcp \
 --direction Inbound \
 --priority 100 \
 --source-address-prefix 10.0.0.0/24 \
 --source-port-range "*" \
 --destination-address-prefix "*" \
 --destination-port-range 22
```

## Step 7 - Delete resource group

Delete the resource group, which deletes all virtual machines and related networking resources.

```azurecli
az group delete --name myTutorial2 --no-wait --yes
```

## Next steps

Tutorial - [Create and manage storage](./tutorial-manage-data-disk.md)

Further reading:

- [Virtual Network Overview](../../virtual-network/virtual-networks-overview.md).
- [Filter network traffic with network security groups](../../virtual-network/virtual-networks-nsg.md).
- [Azure Network Interfaces](../../virtual-network/virtual-network-network-interface.md).

