---
title: Azure and Linux VM Network Overview | Microsoft Docs
description: An overview of Azure and Linux VM networking.
services: virtual-machines-linux
documentationcenter: virtual-machines-linux
author: vlivech
manager: timlt
editor: ''

ms.assetid: b5420e35-0463-4456-9803-6142db150f2e
ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 10/25/2016
ms.author: v-livech

---
# Azure and Linux VM Network Overview
## Virtual Networks
An Azure virtual network (VNet) is a representation of your own network in the cloud. It is a logical isolation of the Azure cloud dedicated to your subscription. You can fully control the IP address blocks, DNS settings, security policies, and route tables within this network. You can also further segment your VNet into subnets and launch Azure IaaS virtual machines (VMs) and/or Cloud services (PaaS role instances). Additionally, you can connect the virtual network to your on-premises network using one of the connectivity options available in Azure. In essence, you can expand your network to Azure, with complete control on IP address blocks with the benefit of enterprise scale Azure provides.

* [Virtual Network Overview](../../virtual-network/virtual-networks-overview.md)

To create a VNet by using the Azure CLI, go here to follow the walk through.

* [How to create a VNet using the Azure CLI](../../virtual-network/virtual-networks-create-vnet-arm-cli.md)

## Network Security Groups
Network security group (NSG) contains a list of Access Control List (ACL) rules that allow or deny network traffic to your VM instances in a Virtual Network. NSGs can be associated with either subnets or individual VM instances within that subnet. When a NSG is associated with a subnet, the ACL rules apply to all the VM instances in that subnet. In addition, traffic to an individual VM can be restricted further by associating a NSG directly to that VM.

* [What is a Network Security Group (NSG)?](../../virtual-network/virtual-networks-nsg.md)
* [How to create NSGs in the Azure CLI](../../virtual-network/virtual-networks-create-nsg-arm-cli.md)

## User Defined Routes
When you add virtual machines (VMs) to a virtual network (VNet) in Azure, you will notice that the VMs are able to communicate with each other over the network, automatically. You do not need to specify a gateway, even though the VMs are in different subnets. The same is true for communication from the VMs to the public Internet, and even to your on-premises network when a hybrid connection from Azure to your own datacenter is present.

* [What are User Defined Routes and IP Forwarding?](../../virtual-network/virtual-networks-udr-overview.md)
* [Create a UDR in the Azure CLI](../../virtual-network/virtual-network-create-udr-arm-cli.md)

## Associating a FQDN to your Linux VM
When you create a virtual machine (VM) in the Azure portal using the Resource Manager deployment model, a public IP resource for the virtual machine is automatically created. You use this IP address to remotely access the VM. Although the portal does not create a fully qualified domain name, or FQDN, by default, you can add one once the VM is created.

* [Create a Fully Qualified Domain Name in the Azure portal](portal-create-fqdn.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

## Network interfaces
A network interface (NIC) is the interconnection between a Virtual Machine (VM) and the underlying software network. This article explains what a network interface is and how it's used in the Azure Resource Manager deployment model.

* [Virtual Network Interfaces](../../virtual-network/virtual-network-network-interface.md)

## Virtual NICs and DNS labeling
If you have a server that you need to be persistent, but that server is treated as cattle and is torn down and deployed frequently, you will want to use DNS labeling on your NIC to persist the name on the VNET.  With the following walk-through you will setup a persistently named NIC with a static IP.

* [Create a complete Linux environment by using the Azure CLI](create-cli-complete.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

## Virtual Network Gateways
A virtual network gateway is used to send network traffic between Azure virtual networks and on-premises locations and also between virtual networks within Azure (VNet-to-VNet). When you configure a VPN gateway, you must create and configure a virtual network gateway and a virtual network gateway connection.

* [About VPN Gateway](../../vpn-gateway/vpn-gateway-about-vpngateways.md)

## Internal Load Balancing
An Azure load balancer is a Layer-4 (TCP, UDP) load balancer. The load balancer provides high availability by distributing incoming traffic among healthy service instances in cloud services or virtual machines in a load balancer set. Azure Load Balancer can also present those services on multiple ports, multiple IP addresses, or both.

* [Creating an internal load balancer using the Azure CLI](../../load-balancer/load-balancer-get-started-internet-arm-cli.md)

