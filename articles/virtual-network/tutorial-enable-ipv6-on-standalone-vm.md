---
title: Add Public IPv6 to a standalone VM - Azure Portal
titlesuffix: Azure Virtual Network
description: This article shows how to convert your VNET to hybrid IPv6/IPv4 and to deploy IPv6 public addresses to associate them to a standalone VM
services: virtual-network
documentationcenter: na
author: romoriar
ms.service: virtual-network
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 12/03/2020
ms.author: romoriar
---

> [!div class="checklist"]
> * Assign IPv6 address space to your virtual network
> * Assign IPv6 address space to your existing subnet
> * Add a private IPv6 address to your VM 
> * Add a public IPv6 address to your VM

# Add IPv6 to a standalone IPv4 application in Azure virtual network - Azure Portal

This article shows you how to add IPv6 addresses to a standalone application that is using IPv4 public IP address in an Azure virtual network. 

## Prerequisites

- This article assumes that you deployed a Virtual Network that's using IPv4 and a standalone Virtual Machine. 

## Enable your IPv4 virtual network to hybridly use IPv4 and IPv6 

1. On the [Azure portal](https://portal.azure.com) menu or from the **Home** page, search **Virtual networks** and select the virtual network that you would like to add IPv6 functionality to.

1. Choose Address Space on the left pane

1. Add a valid IPv6 CIDR such as ace:cab:deca::/64 and click save[add image: vnet_address_space_ipv6](./media/tutorial-create-route-table-portal/vnet_address_space_ipv6

1. Choose subnet on the left pane under settings. Select the subnet of which your standalone VM is associated.  

1. Add the CIDR to the subnet associated to your standalone VM by checking the AddIPv6 addres space drop down. Then, enter your IPv6 CIDR and click save.[add image: vnet_address_space_ipv6.png](./media/tutorial-create-route-table-portal/vm-ws2016-datacenter.png)




## Add an IPv6 ipconfig to the network interface of your standalone virtual machine

1. On the [Azure portal](https://portal.azure.com) menu or from the **Home** page, search **Network interfaces** and select the network interace associated to the virtual machine that you would IPv6 functionality to.

1. On the left pane under settings, select IP configurations.

1. Select add and configuration pane will appear on the right.  From this configuration pane, give your IP configuration a name, select IP version as IPv6, Allocate the IP as static or dynamic, Associate a public IPv6 IP, choose to create a new IPv6 IP address resource, give your IP addres resource a name, and then click save [addImage: ipv6_add_config_to_NIC.png](./media/tutorial-create-route-table-portal/vm-ws2016-datacenter.png)
