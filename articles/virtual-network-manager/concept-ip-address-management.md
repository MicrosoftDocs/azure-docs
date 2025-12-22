---
title: What is IP address management (IPAM) in Azure Virtual Network Manager?
description: Learn about IP address management (IPAM) in Azure Virtual Network Manager to efficiently manage IP addresses in your virtual networks.
#customer intent: As a network administrator, I want to learn about IP address management in Azure Virtual Network Manager so that I can efficiently manage IP addresses in my virtual networks.  
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: how-to
ms.date: 11/18/2025
ms.custom:
  - references_regions
  - ai-gen-docs-bap
  - ai-gen-description
  - ai-seo-date:06/12/2025
  - references_regions
---

# What is IP address management (IPAM) in Azure Virtual Network Manager?

[!INCLUDE [virtual-network-manager-ipam](../../includes/virtual-network-manager-ipam.md)]

In this article, you learn about the IP address management (IPAM) feature in Azure Virtual Network Manager and how it can help you manage IP addresses in your virtual networks. With Azure Virtual Network Manager's IP address management, you can create pools for IP address planning, automatically assign nonoverlapping classless inter-domain routing (CIDR) addresses to Azure resources, and prevent address space conflicts across on-premises and multicloud environments.

## What is IP address management (IPAM)?

In Azure Virtual Network Manager, IP address management (IPAM) helps you centrally manage IP addresses in your virtual networks by using IP address pools.

The following are some key features of IPAM in Azure Virtual Network Manager:

- Create pools for IP address planning.

- Automatically assign nonoverlapping CIDRs to Azure resources.

- Create reserved IPs for specific needs.

- Prevent Azure address space from overlapping on-premises and cloud environments.

- Monitor IP and CIDR usages and allocations in a pool.

- Support for IPv4 and IPv6 address pools.

## How does IPAM work in Azure Virtual Network Manager?

The IPAM feature in Azure Virtual Network Manager works through the following key components:

1. Managing IP address pools

1. Allocating IP addresses to Azure resources

1. Delegating IPAM permissions

1. Simplifying resource creation

### Manage IP address pools

IPAM allows network administrators to plan and organize IP address usage by creating pools with address spaces and respective sizes.

These pools act as containers for groups of CIDRs, enabling logical grouping for specific networking purposes. You can create a structured hierarchy of pools by dividing a larger pool into smaller, more manageable pools. This hierarchy provides more granular control and organization of your network's IP address space.

There are two types of pools in IPAM:

- **Root pool**: The first pool you create in your instance. This pool represents your entire IP address range.

- **Child pool**: A subset of the root pool or another child pool. You can create multiple child pools within a root pool or another child pool. You can have up to seven layers of pools.

### Allocating IP addresses to Azure resources

You can allocate Azure resources, such as virtual networks, to a specific pool with CIDRs. This allocation helps you identify which CIDRs are currently in use.

You can also allocate static CIDRs to a pool. This allocation is useful for occupying CIDRs that aren't currently in use within Azure or are part of Azure resources that the IPAM service doesn't yet support. When you remove or delete the associated resource, the allocated CIDRs are released back to the pool. This process ensures efficient utilization and management of the IP space.

### Delegating permissions for IPAM

With IPAM, you can delegate permission to other users to utilize the IP address pools. This approach ensures controlled access and management while democratizing pool allocation.

These permissions allow users to see the pools they have access to, which helps them choose the right pool for their needs.

Delegating permissions also grants others the ability to view usage statistics and lists of resources associated with the pool. Within your network manager, you can access complete usage statistics, including:

- The total number of IPs in the pool.

- The percentage of allocated pool space.

Additionally, the details for pools and resources associated with pools give a complete overview of the IP usages. This information aids in better resource management and planning.

### Simplifying resource creation

When you create CIDR-supporting resources like virtual networks, the system automatically allocates CIDRs from the selected pool. This process simplifies resource creation.

The system ensures that the automatically allocated CIDRs don't overlap within the pool. This feature maintains network integrity and prevents conflicts.


## Managing IP address spaces across multiple regions (Preview)

[!INCLUDE [virtual-network-manager-ipam-multi-region-preview](../../includes/virtual-network-manager-ipam-multi-region-preview.md)]

You can now associate a single IPAM pool with virtual networks in multiple regions. This feature simplifies governance and ensures consistent CIDR allocation globally. Azure PowerShell and Azure CLI support this capability in the preview regions listed in the preceding note.

### Create a virtual network in Region A and associate with an IPAM pool located in Region B

In the following example, you create a virtual network in *Region A* and associate it with an IPAM pool located in *Region B*.

```azurecli

$ipamAllocation = '[{ 
  "numberOfIpAddresses": 100, 
  "id": "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Network/networkManagers/<network-manager-name>/ipamPools/<ipam-pool-name-region-b>" 
}]' 


az network vnet create `
    --name "<virtual-network-name>" `
    --resource-group "<resource-group-name>" `
    --ipam-allocations $ipamAllocation `
    --location "Region A"
```

### Associate a virtual network in Region A with an IPAM pool located in Region B

In the following example, you associate an existing virtual network in *Region A* with an IPAM pool located in *Region B*:


```azurecli

$ipamAllocation = '[{ 
  "numberOfIpAddresses": 100, 
  "id": "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Network/networkManagers/<network-manager-name>/ipamPools/<ipam-pool-name-region-b>" 

}]' 

az network vnet update ` 
  --name "<virtual-network-name>" ` 
  --resource-group "<resource-group-name>" ` 
  --ipam-allocations $ipamAllocation ` 
  --location "Region A"

```

## Permission requirements for IPAM in Azure Virtual Network Manager

The **IPAM Pool User** role alone is sufficient for delegation when using IPAM. If permission issues arise, you also need to grant **Network Manager Read** access to ensure full discoverability of IP address pools and virtual networks across the Network Manager's scope.

Without this role, users with only the **IPAM Pool User** role don't see available pools and virtual networks.

Learn more about [Azure role-based access control (Azure RBAC)](/azure/role-based-access-control/overview).

## Next steps

> [!div class="nextstepaction"]
> [Learn how to manage IP addresses in Azure Virtual Network Manager](./how-to-manage-ip-addresses-network-manager.md)