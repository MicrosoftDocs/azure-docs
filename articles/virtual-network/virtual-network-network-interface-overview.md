---
title: Network interfaces | Microsoft Docs
description: Learn about Azure network interfaces in Azure Resource Manager.
services: virtual-network
documentationcenter: na
author: jimdial
manager: carmonm
editor: ''
tags: azure-resource-manager

ms.assetid: f58b503f-18bf-4377-aa63-22fc8a96e4be
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/23/2016
ms.author: jdial

---
# Network interfaces
A network interface (NIC) is the interconnection between a Virtual Machine (VM) and the underlying software network. This article explains what a network interface is and how it's used in the Azure Resource Manager deployment model.

Microsoft recommends deploying new resources using the Resource Manager deployment model, but you can also deploy VMs with network connectivity in the [classic](virtual-network-ip-addresses-overview-classic.md) deployment model. If you're familiar with the classic model, there are important differences in VM networking in the Resource Manager deployment model. Learn more about the differences by reading the [Virtual machine networking - Classic](virtual-network-ip-addresses-overview-classic.md#differences-between-resource-manager-and-classic-deployments) article.

In Azure, a network interface:

1. Is a resource that can be created, deleted, and has its own configurable settings.
2. Must be connected to one subnet in one Azure Virtual Network (VNet) when it's created. If you're not familiar with VNets, learn more about them by reading the [Virtual network overview](virtual-networks-overview.md) article. The NIC must be connected to a VNet that exists in the same Azure [location](https://azure.microsoft.com/regions) and [subscription](../azure-glossary-cloud-terminology.md#subscription) as the NIC. After a NIC is created, you can change the subnet it's connected to, but you cannot change the VNet it's connected to.
3. Has a name assigned to it that cannot be changed after the NIC is created. The name must be unique within an Azure [resource group](../azure-resource-manager/resource-group-overview.md#resource-groups), but doesn't have to be unique within the subscription, the Azure location it's created in, or the VNet it's connected to. Several NICs are typically created within an Azure subscription. It's recommended that you devise a naming convention that makes managing multiple NICs easier than using default names. See the [Recommended naming conventions for Azure resources](../guidance/guidance-naming-conventions.md) article for suggestions.
4. May be attached to a VM, but can only be attached to a single VM that exists in the same location as the NIC.
5. Has a MAC address, which is persisted with the NIC for as long as it remains attached to a VM. The MAC address is persisted whether the VM is restarted (from within the operating system) or stopped (de-allocated) and started using the Azure Portal, Azure PowerShell, or the Azure Command-Line Interface. If it's detached from a VM and attached to a different VM, the NIC receives a different MAC address. If the NIC is deleted, the MAC address is assigned to other NICs.
6. Must have one primary **private** *IPv4* static or dynamic IP address assigned to it.
7. May have one public IP address resource associated to it.
8. Supports accelerated networking with single-root I/O virtualization (SR-IOV) for specific VM sizes running specific versions of the Microsoft Windows Server operating system. To learn more about this PREVIEW feature, read the [Accelerated networking for a virtual machine](virtual-network-accelerated-networking-powershell.md) article.
9. Can receive traffic not destined to private IP addresses assigned to it if IP forwarding is enabled for the NIC. If a VM is running firewall software for example, it routes packets not destined for its own IP addresses. The VM must still run software capable of routing or forwarding traffic, but to do so, IP forwarding must be enabled for a NIC.
10. Is often created in the same resource group as the VM it's attached to or the same VNet that it's connected to, though it isn't required to be.

## VMs with multiple network interfaces
Multiple NICs can be attached to a VM, but when doing so, be aware of the following:  

* The VM size must support multiple NICs. To learn more about which VM sizes support multiple NICs, read the [Windows Server VM sizes](../virtual-machines/virtual-machines-windows-sizes.md) or [Linux VM sizes](../virtual-machines/virtual-machines-linux-sizes.md) articles.   
* The VM must be created with at least two NICs. If the VM is created with only one NIC, even if the VM size supports more than one, you cannot attach additional NICs to the VM after it's created. As long as the VM was created with at least two NICs, you can attach additional NICs to the VM after it's created, as long as the VM size supports more than two NICs.  
* You can detach secondary NICs (the primary NIC cannot be detached) from a VM if the VM has at least three NICs attached to it. You cannot detach NICs if the VM has two or less NICs attached to it.  
* The order of the NICs from inside the VM will be random, and could also change across Azure infrastructure updates. However, the IP addresses, and the corresponding ethernet MAC addresses, will remain the same. For example, assume the operating system identifies Azure NIC1 as Eth1. Eth1 has IP address 10.1.0.100 and MAC address 00-0D-3A-B0-39-0D. After an Azure infrastructure update and reboot, the operating system may now identify Azure NIC1 as Eth2, but the IP and MAC addresses will be the same as they were when the operating system identified Azure NIC1 as Eth1. When a restart is customer-initiated, the NIC order will remain the same within the operating system.  
* If the VM is a member of an [availability set](../azure-glossary-cloud-terminology.md#availability-set), all VMs within the availability set must have either a single NIC or multiple NICs. If the VMs have multiple NICs, the number they each have isn't required to be the same, as long as each VM has at least two NICs.

## Next steps
* Learn how to create a VM with a single NIC by reading the [Create a VM](../virtual-machines/virtual-machines-windows-hero-tutorial.md) article.
* Learn how to create a VM with multiple NICs by reading the [Deploy a VM with multiple NIC](virtual-network-deploy-multinic-arm-ps.md) article.
* Learn how to create a NIC with multiple IP configurations by reading the [Multiple IP addresses for Azure virtual machines](virtual-network-multiple-ip-addresses-powershell.md) article.

