---
title: What is IP address management (IPAM) in Azure Virtual Network Manager?
description: Learn about IP address management (IPAM) in Azure Virtual Network Manager and how it can help you manage IP addresses in your virtual networks.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: how-to
ms.date: 08/24/2024
#customer intent: As a network administrator, I want to learn about IP address management (IPAM) in Azure Virtual Network Manager so that I can manage IP addresses in my virtual networks.
---

# What is IP address management (IPAM) in Azure Virtual Network Manager?

In this article, you learn about the IP address management (IPAM) feature in Azure Virtual Network Manager and how it can help you manage IP addresses in your virtual networks. With Azure Virtual Network Manager's IP Address Management (IPAM), you can create pools for IP address planning, automatically assign nonoverlapping classless inter-domain routing (CIDR) addresses to Azure resources, and prevent address space conflicts across on-premises and multicloud environments.

[!INCLUDE [virtual-network-manager-ipam](../../includes/virtual-network-manager-ipam.md)]

## What is IP address management (IPAM)?

In Azure Virtual Network Manager, IP address management (IPAM) helps you centrally manage IP addresses in your virtual networks by using IP address pools. The following are some key features of IPAM in Azure Virtual Network Manager:

- Create pools for IP address planning 

- Automatically assign nonoverlapped CIDRs to Azure resources 

- Reserve IPs for specific demands 

- Prevent Azure address space from overlapping on-premises and  multicloud environments. 

- Monitor IP/CIDR usages and allocations in a pool 

## How does IPAM work in Azure Virtual Network Manager?

The IPAM feature in Azure Virtual Network Manager works through the following key components:
- Managing IP Address Pools
- Allocating IP addresses to Azure resources
- Delegating IP address management permissions
- Simplifying resource creation

### Managing IP Address Pools

IPAM allows network administrators to plan and organize IP address usage by defining pools with address spaces and respective sizes. These pools act as containers for groups of CIDRs, enabling logical grouping for specific networking purposes. You can create a structured hierarchy of pools, dividing a larger pool into smaller, more manageable pools, aiding in more granular control and organization of your network's IP address space. The IPAM service currently handles IPv4 addresses, with IPv6 management to be introduced in the future.

### Allocating IP addresses to Azure resources

When it comes to allocation, you can assign Azure resources with CIDRs, such as virtual networks, to a specific pool. This helps in identifying which CIDRs are currently in use1. There's also the option to allocate static CIDRs to a pool, useful for occupying CIDRs that are either not currently in use within Azure or are part of Azure resources not yet supported by the IPAM service1. Allocated CIDRs are released back to the pool if the associated resource is removed or deleted, ensuring efficient utilization and management of the IP space1.

### Delegating permissions for IP address management

With IPAM, you can delegate permission to other users to utilize the IPAM pools, ensuring controlled access and management while democratizing pool allocation. These permissions allow users to see the pools they have access to, aiding in choosing the right pool for their needs.

Delegating permissions also allows others to view usage statistics and lists of resources associated with the pool. Within your network manager, complete usage statistics are available including:
    - the total number of IPs in pool
    - the number of used IPs
    - the percentage of used IPs
    - the percentage of allocated pool space.
    
Additionally, it shows details for pools and resources associated with pools, giving a complete overview of the IP usages and aiding in better resource management and planning.

### Simplifying resource creation

When creating CIDR-supporting resources like virtual networks, CIDRs are automatically allocated from the selected pool, simplifying the resource creation process1. The system ensures that the automatically allocated CIDRs don't overlap within the pool, maintaining network integrity and preventing conflicts1.

## Permission requirements for IPAM in Azure Virtual Network Manager

You need to have the Network Contributor role for the scope of the network manager instance you want to create and manage.

## Next steps

> [!div class="nextstepaction"]
> [Learn how to managed IP addresses in Azure Virtual Network Manager](./how-to-manage-ip-addresses.md)
