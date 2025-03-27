---
title: What is IP address management (IPAM) in Azure Virtual Network Manager?
description: Learn about IP address management (IPAM) in Azure Virtual Network Manager and how it can help you manage IP addresses in your virtual networks.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: how-to
ms.date: 02/05/2025
ms.custom:  references_regions
#customer intent: As a network administrator, I want to learn about IP address management in Azure Virtual Network Manager so that I can manage IP addresses in my virtual networks.
---

# What is IP address management (IPAM) in Azure Virtual Network Manager?

[!INCLUDE [virtual-network-manager-ipam](../../includes/virtual-network-manager-ipam.md)]

In this article, you learn about the IP address management (IPAM) feature in Azure Virtual Network Manager and how it can help you manage IP addresses in your virtual networks. With Azure Virtual Network Manager's IP address management, you can create pools for IP address planning, automatically assign nonoverlapping classless inter-domain routing (CIDR) addresses to Azure resources, and prevent address space conflicts across on-premises and multicloud environments.

## What is IP address management (IPAM)?

In Azure Virtual Network Manager, IP address management (IPAM) helps you centrally manage IP addresses in your virtual networks using IP address pools. The following are some key features of IPAM in Azure Virtual Network Manager:

- Create pools for IP address planning.

- Autoassign nonoverlapped CIDRs to Azure resources.

- Create reserved IPs for specific needs.

- Prevent Azure address space from overlapping on-premises and cloud environments. 

- Monitor IP/CIDR usages and allocations in a pool.

- Support for IPv4 and IPv6 address pools.

## How does IPAM work in Azure Virtual Network Manager?

The IPAM feature in Azure Virtual Network Manager works through the following key components:
- Managing IP Address Pools
- Allocating IP addresses to Azure resources
- Delegating IPAM permissions
- Simplifying resource creation

### Manage IP address pools

IPAM allows network administrators to plan and organize IP address usage by creating pools with address spaces and respective sizes. These pools act as containers for groups of CIDRs, enabling logical grouping for specific networking purposes. You can create a structured hierarchy of pools by dividing a larger pool into smaller, more manageable pools. This hierarchy provides more granular control and organization of your network's IP address space.

There are two types of pools in IPAM:
- **Root pool**: The first pool created in your instance is the root pool. This represents your entire IP address range.
- **Child pool**: A child pool is a subset of the root pool or another child pool. You can create multiple child pools within a root pool or another child pool. You can have up to seven layers of pools

### Allocating IP addresses to Azure resources

You can allocate Azure resources, such as virtual networks, to a specific pool with CIDRs. This helps in identifying which CIDRs are currently in use. There's also the option to allocate static CIDRs to a pool, useful for occupying CIDRs that are either not currently in use within Azure or are part of Azure resources not yet supported by the IPAM service. Allocated CIDRs are released back to the pool if the associated resource is removed or deleted, ensuring efficient utilization and management of the IP space.

### Delegating permissions for IPAM

With IPAM, you can delegate permission to other users to utilize the IP address pools, ensuring controlled access and management while democratizing pool allocation. These permissions allow users to see the pools they have access to, aiding in choosing the right pool for their needs.

Delegating permissions also allows others to view usage statistics and lists of resources associated with the pool. Within your network manager, complete usage statistics are available including:

- The total number of IPs in pool.
- The percentage of allocated pool space.
    
Additionally, it shows details for pools and resources associated with pools, giving a complete overview of the IP usages and aiding in better resource management and planning.

### Simplifying resource creation

When you create CIDR-supporting resources like virtual networks, CIDRs are automatically allocated from the selected pool, simplifying the resource creation process. The system ensures that the automatically allocated CIDRs don't overlap within the pool, maintaining network integrity and preventing conflicts.

## Permission requirements for IPAM in Azure Virtual Network Manager

The **IPAM Pool User** role alone is sufficient for delegation when using IPAM. If permission issues arise, you also need to grant **Network Manager Read** access to ensure full discoverability of IP address pools and virtual networks across the Network Manager's scope. Without this role, users with only the **IPAM Pool User** role don't see available pools and virtual networks.

Learn more about [Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md).

## Next steps

> [!div class="nextstepaction"]
> [Learn how to manage IP addresses in Azure Virtual Network Manager](./how-to-manage-ip-addresses-network-manager.md)