---
title: Azure Virtual Network Concepts and Best Practices
description: Learn Azure Virtual Network concepts and best practices to design secure, scalable cloud infrastructure. Discover address spaces, subnets, regions, and security guidelines for optimal network architecture.
author: asudbring
ms.service: azure-virtual-network
ms.topic: concept-article
ms.date: 07/28/2025
ms.author: allensu
# Customer intent: As a network architect, I want to understand Azure Virtual Network concepts and best practices, so that I can design an efficient, secure, and scalable network infrastructure for my organization's cloud-based applications.
---

# Azure Virtual Network concepts and best practices

Azure Virtual Network is a fundamental building block for your private network in Azure. It enables Azure resources to securely communicate with each other, the internet, and on-premises networks. 

A virtual network is similar to a traditional network that you'd operate in your own data center. However, it brings extra benefits of Azure's infrastructure such as scale, availability, and isolation.

Understanding virtual network concepts and following best practices helps you design robust, secure, and scalable network architectures. Whether you're migrating existing workloads to Azure or building new cloud-native applications, proper network design is essential for performance, security, and cost optimization.

This article describes key Azure Virtual Network concepts and best practices to help you design efficient, secure, and scalable network infrastructure for your cloud-based applications. Learn about address spaces, subnets, security groups, and architectural guidelines that optimize your Azure networking strategy.

## Virtual Network concepts

- **Address space:** When creating a virtual network, you must specify a custom private IP address space using public and private (RFC 1918) addresses. Azure assigns resources in a virtual network a private IP address from the address space that you assign. For example, if you deploy a VM in a virtual network with address space, 10.0.0.0/16, a private IP similar to 10.0.0.4 is assigned to the virtual machine.

- **Subnets:** Subnets enable you to segment the virtual network into one or more sub networks and allocate a portion of the virtual network's address space to each subnet. You can then deploy Azure resources in a specific subnet. Just like in a traditional network, subnets allow you to segment your virtual network address space into segments that are appropriate for the organization's internal network. Segmentation improves address allocation efficiency. You can secure resources within subnets using Network Security Groups. For more information, see [Network security groups](./network-security-groups-overview.md).

- **Regions**: A virtual network is scoped to a single region/location; however, multiple virtual networks from different regions can be connected together using Virtual Network Peering.

- **Subscription:** A virtual network is scoped to a subscription. You can implement multiple virtual networks within each Azure [subscription](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#subscription) and Azure [region](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fvirtual-network%2ftoc.json#region).

## Best practices

As you build your network in Azure, it's important to keep in mind the following universal design principles:

- Ensure address spaces don't overlap. Make sure your virtual network address spaces (CIDR blocks) don't overlap with your organization's other in-use network ranges.

    - See the recommended address ranges in the [FAQ](/azure/virtual-network/virtual-networks-faq#what-address-ranges-can-i-use-in-my-virtual-networks)

- Your subnets shouldn't cover the entire address space of the virtual network. Plan ahead and reserve some address space for the future.

- Use a few large virtual networks instead of multiple small ones to reduce management overhead within a single Azure subscription.
    
    -  You should also follow the [Azure landing zone design principle of Subscription Democratization](/azure/cloud-adoption-framework/ready/landing-zone/design-principles#subscription-democratization) meaning it is recommended to have many subscriptions, each with their own virtual network (possibly multiple), to help you achieve and implement [Zero Trust](/security/zero-trust/azure-networking-overview) in your Azure networking.
    -  Commonly a hub and spoke architecture is used to implement this at scale with a [traditional virtual network approach](/azure/architecture/networking/architecture/hub-spoke) or [Virtual WAN](/azure/architecture/networking/architecture/hub-spoke-virtual-wan-architecture)

- Secure your virtual networks by assigning Network Security Groups (NSGs) to the subnets beneath them. For more information about network security concepts, see [Azure network security overview](../security/fundamentals/network-overview.md).

## Next steps

To get started using a virtual network, create one, deploy a few VMs to it, and communicate between the VMs. To learn how, see the [Create a virtual network](quick-create-portal.md) quickstart.
