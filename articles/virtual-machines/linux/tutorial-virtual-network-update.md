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

Azure virtual machines use Azure networking for internal and external network communication. In this tutorial, you will learn about networking virtual machine, making VMs available on the internet, and securing network communication.

This tutorial requires the Azure CLI version 2.0.4 or later. To find the CLI version run `az --version`. If you need to upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).

## VM networking overview

Azure virtual networks enables you to establish secure network connections between virtual machines, between virtual machines and the internet, and between virtual machines and other Azure services such as Azure SQL database. The following networking items are discussed in this tutorial.

**Azure virtual networks** – an Azure hosted network that securely connects Azure VMs, VMs to other Azure resources, and optionally Azure VMs to on-premises networks.

**Virtual network subnets** – Virtual networks are broken down into logical segments called subnets. A subnet is primarily used to control network flow and as a security boundary. 

**Public IP addresses** – An IP address that is presented on the internet and allows internet connectivity to Azure resources.

**Network security groups** – secure azure resources, like a firewall.

**Network security group rules** -  security rules that allow or deny network traffic to Azure resources. 

## Deploy Virtual Network and Subnet

For this tutorial, a single virtual network will be created with three subnets. The subnets will be arranged as the following:

**Front-end** – VMs that host internet accessible applications and virtual machines.

**Back-end** – VMs that host back-end databases.

**Remote access** – hosts a single VM that can be used to remotely access the front-end and back-end VMs.

```azurecli
az group create --name myRGNetwork --location eastus
```

Create a virtual network and front-end subnet.

```azurecli
az network vnet create --resource-group myFrontendVM --name myVnet --address-prefix 10.0.0.0/16 --subnet-name mySubnetFrontEnd --subnet-prefix 10.0.1.0/24
```

Create back-end subnet.

```azurecli
az network vnet subnet create --resource-group myFrontendVM --vnet-name myVnet --name mySubnetBackEnd --address-prefix 10.0.2.0/24
```

Create remote access subnet.

```azurecli
az network vnet subnet create --resource-group myFrontendVM --vnet-name myVnet --name mySubnetRemoteAccess --address-prefix 10.0.3.0/24
```

## Deploy front-end VM

```azurecli
az vm create --resource-group myRGNetwork --name myFrontEndVM --vnet-name --subnet mySubnetFrontEnd --nsg myNSGFrontEnd --image UbuntuLTS --generate-ssh-keys
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

## Deploy back-end VM

```azurecli
az vm create --resource-group myRGNetwork --name myBackEndVM --vnet-name --subnet mySubnetBackEnd --nsg myNSGBackEnd --public-ip-address "" --image UbuntuLTS --generate-ssh-keys
```

## Deploy remote access VM

```azurecli
az vm create --resource-group myRGNetwork --name myRemoteAccessVM --vnet-name --subnet mySubnetRemoteAccess --nsg myNSGRemoteAccess --image UbuntuLTS --generate-ssh-keys
```

## Configure front-end NSG

az network nsg rule create --resource-group myResourceGroup --nsg-name mySubnetFrontEnd --name http --access allow --protocol Tcp --direction Inbound --priority 200 --source-address-prefix "*" --source-port-range "*" --destination-address-prefix "*" --destination-port-range 80

## Configure back-end NSG


```azurecli
nsgrule=$(az network nsg rule list --resource-group myResourceGroup --nsg-name myNetworkSecurityGroupBackEnd --query [0].name -o tsv)
```

```azurecli
az network nsg rule update --resource-group myResourceGroup --nsg-name mySubnetBackEnd --name $nsgrule --protocol tcp --direction inbound --priority 100 --source-address-prefix 10.0.2.0/24 --source-port-range '*' --destination-address-prefix '*' --destination-port-range 22 --access allow
```azurecli

```azurecli
az network nsg rule create --resource-group myResourceGroup --nsg-name mySubnetBackEnd --name denyAll --access Deny --protocol Tcp --direction Inbound --priority 200 --source-address-prefix "*" --source-port-range "*" --destination-address-prefix "*" --destination-port-range "*"
```azurecli

## Next steps

In this tutorial, you learned about creating and securing Azure networks as related to virtual machines. Advance to the next tutorial to learn about monitoring VM security with Azure Security Center.

[Manage virtual machine security](./tutorial-azure-security.md)