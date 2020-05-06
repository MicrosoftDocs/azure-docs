---
title: Routing Preference public IP
titlesuffix: Azure Virtual Network
description: Learn about public IP address with a routing preference choice.
services: virtual-network
documentationcenter: na
author: mnayak
manager: 
ms.service: virtual-network
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 04/30/2020
ms.author: mnayak

---
# Create a Public IP with a Routing Preference type

This article shows you how to create a Public IP address with a routing preference type using Azure PowerShell. Once the public IP address is created, it can be assigned to an azure resource for inbound and outbound traffic to internet. Some of the resources you can associate a public IP address resource with routing preference type are:

* Virtual machine network interfaces
* Azure Kubernetes Service (AKS)
* Internet-facing load balancers
* VPN gateways
* Application gateways
* Azure Firewall

> [!NOTE]
> Azure has two different deployment models for creating and working with resources:  [Resource Manager and classic](../azure-resource-manager/management/deployment-models.md?toc=%2fazure%2fvirtual-network%2ftoc.json).  This article covers using the Resource Manager deployment model, which Microsoft recommends for most new deployments instead of the [classic deployment model](virtual-network-ip-addresses-overview-classic.md).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) now.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Click on **Create a resource** to create a public ip address.
3. Select the **Routing preference** choice as shown in the picture below:

      ![Create a public ip address](./media/routingpreference/pip.png)

> [!NOTE]
     > Public IP addresses are created with an IPv4 or IPv6 address. However, routing preference only supports IPV4 currently.

You can associate the above created public IP address with a [Windows](../virtual-machines/windows/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Linux](../virtual-machines/linux/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) virtual machine. Use the CLI section on the tutorial page: [Associate a public IP address to a virtual machine](associate-public-ip-address-vm.md#azure-cli) to associate the Public IP to your VM. You can also associate the public IP address created above with with an [Azure Load Balancer](../load-balancer/load-balancer-overview.md), by assigning it to the load balancer **frontend** configuration. The public IP address serves as a load-balanced virtual IP address (VIP).

## Next steps
- [Deploy a VM and assign a public IP with routing preference choice using the Azure portal](tutorial-routing-preference-virtual-machine-portal.md)
- [Create a public IP with routing preference choice using the PowerShell](routing-preference-powershell.md)
- Learn more about [public IP addresses](virtual-network-ip-addresses-overview-arm.md#public-ip-addresses) in Azure
- Learn more about all [public IP address settings](virtual-network-public-ip-address.md#create-a-public-ip-address)
