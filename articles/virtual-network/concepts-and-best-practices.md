---
title: Azure Virtual Network - Concepts and best practices
description: Learn about Azure Virtual Network concepts and best practices. 
author: asudbring
ms.service: virtual-network
ms.topic: conceptual
ms.date: 05/08/2023
ms.author: allensu
---

# Azure Virtual Network concepts and best practices

This article describes key concepts and best practices for Azure Virtual Network.

## Virtual network concepts

- **Address space:** When creating a virtual network, you must specify a custom private IP address space using public and private (RFC 1918) addresses. Azure assigns resources in a virtual network a private IP address from the address space that you assign. For example, if you deploy a VM in a virtual network with address space, 10.0.0.0/16, the VM is assigned a private IP like 10.0.0.4.

- **Subnets:** Subnets enable you to segment the virtual network into one or more subnetworks and allocate a portion of the virtual network's address space to each subnet. You can then deploy Azure resources in a specific subnet. Just like in a traditional network, subnets allow you to segment your virtual network address space into segments that are appropriate for the organization's internal network. Segmentation improves address allocation efficiency. You can secure resources within subnets using Network Security Groups. For more information, see [Network security groups](./network-security-groups-overview.md).

- **Regions**: A virtual network is scoped to a single region/location; however, multiple virtual networks from different regions can be connected together using Virtual Network Peering.

- **Subscription:** A virtual network is scoped to a subscription. You can implement multiple virtual networks within each Azure [subscription](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#subscription) and Azure [region](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#region).

## Best practices

As you build your network in Azure, it's important to keep in mind the following universal design principles:

- Ensure nonoverlapping address spaces. Make sure your virtual network address space (CIDR block) doesn't overlap with your organization's other network ranges.

- Your subnets shouldn't cover the entire address space of the virtual network. Plan ahead and reserve some address space for the future.

- It's recommended you have fewer large virtual networks rather than multiple small virtual networks to prevent management overhead.

- Secure your virtual networks by assigning Network Security Groups (NSGs) to the subnets beneath them. For more information about network security concepts, see [Azure network security overview](../security/fundamentals/network-overview.md).

## Next steps

 To get started using a virtual network, create one, deploy a few VMs to it, and communicate between the VMs. To learn how, see the [Create a virtual network](quick-create-portal.md) quickstart.
