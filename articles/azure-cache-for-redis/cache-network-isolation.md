---
title: Azure Cache for Redis network isolation options 
description: In this article, you learn how to determine the best network isolation solution for your needs. We go through the basics of Azure Private Link, Azure Virtual Network (VNet) injection, and Azure Firewall Rules with their advantages and limitations.
author: flang-msft
ms.author: franlanglois
ms.service: cache
ms.topic: conceptual
ms.date: 08/29/2023


---

# Azure Cache for Redis network isolation options

In this article, you learn how to determine the best network isolation solution for your needs. We discuss the basics of Azure Private Link (recommended), Azure Virtual Network (VNet) injection, and Firewall Rules. We discuss their advantages and limitations.  

## Azure Private Link (recommended)

Azure Private Link provides private connectivity from a virtual network to Azure PaaS services. Private Link simplifies the network architecture and secures the connection between endpoints in Azure. Private Link also secures the connection by eliminating data exposure to the public internet.

### Advantages of Private Link

- Private link supported on Basic, Standard, Premium, Enterprise, and Enterprise Flash tiers of Azure Cache for Redis instances.
- By using [Azure Private Link](../private-link/private-link-overview.md), you can connect to an Azure Cache instance from your virtual network through a private endpoint. The endpoint is assigned a private IP address in a subnet within the virtual network. With this private link, cache instances are available from both within the VNet and publicly.

   > [!IMPORTANT]
   > Enterprise/Enterprise Flash caches with private link cannot be accessed publicly.

- Once a private endpoint is created on Basic/Standard/Premium tier caches, access to the public network can be restricted through the `publicNetworkAccess` flag. This flag is set to `Disabled` by default, which  only allows private link access. You can set the value to `Enabled` or `Disabled` with a PATCH request. For more information, see [Azure Cache for Redis with Azure Private Link](cache-private-link.md).

   > [!IMPORTANT]
   > Enterprise/Enterprise Flash tier does not support `publicNetworkAccess` flag.

- Any external cache dependencies don't affect the VNet's NSG rules.
- Persisting to any Storage accounts protected with firewall rules is supported when using managed identity to connect to Storage account, see more [Import and Export data in Azure Cache for Redis](cache-how-to-import-export-data.md#how-to-export-if-i-have-firewall-enabled-on-my-storage-account)

### Limitations of Private Link

- Currently, portal console isn't supported for caches with private link.

> [!NOTE]
> When adding a private endpoint to a cache instance, all Redis traffic is moved to the private endpoint because of the DNS.
> Ensure previous firewall rules are adjusted before.

## Azure Virtual Network injection

Virtual Network (VNet) is the fundamental building block for your private network in Azure. VNet enables many Azure resources to securely communicate with each other, the internet, and on-premises networks. VNet is like a traditional network you would operate in your own data center. However, VNet also has the benefits of Azure infrastructure, scale, availability, and isolation.

### Advantages of VNet injection

- When an Azure Cache for Redis instance is configured with a VNet, it's not publicly addressable. It can only be accessed from virtual machines and applications within the VNet.  
- When VNet is combined with restricted NSG policies, it helps reduce the risk of data exfiltration.
- VNet deployment provides enhanced security and isolation for your Azure Cache for Redis. Subnets, access control policies, and other features further restrict access.
- Geo-replication is supported.

### Limitations of VNet injection

- Creating and maintaining virtual network configurations can be error prone. Troubleshooting is challenging. Incorrect virtual network configurations can lead to various issues: 
  - obstructed metrics transmission from your cache instances, 
  - failure of replica node to replicate data from primary node, 
  - potential data loss, 
  - failure of management operations like scaling, 
  - and in the most severe scenarios, loss of availability.
- VNet injected caches are only available for Premium-tier Azure Cache for Redis instances.
- When using a VNet injected cache, you must change your VNet to cache dependencies, such as CRLs/PKI, AKV, Azure Storage, Azure Monitor, and more.
- You can't inject an existing Azure Cache for Redis instance into a Virtual Network. You can only select this option when you _create_ the cache.

## Firewall rules

Azure Cache for Redis allows configuring Firewall rules for specifying IP address that you want to allow to connect to your Azure Cache for Redis instance.

### Advantages of firewall rules

- When firewall rules are configured, only client connections from the specified IP address ranges can connect to the cache. Connections from Azure Cache for Redis monitoring systems are always permitted, even if firewall rules are configured. NSG rules that you define are also permitted.  

### Limitations of firewall rules

- Firewall rules can be used with VNet injected caches, but not private endpoints.
- Firewall rules configuration is available for all Basic, Standard, and Premium tiers.
- Firewall rules configuration isn't available for Enterprise nor Enterprise Flash tiers.

## Next steps

- Learn how to configure a [VNet injected cache for a Premium Azure Cache for Redis instance](cache-how-to-premium-vnet.md).
- Learn how to configure [firewall rules for all Azure Cache for Redis tiers](cache-configure.md#firewall).
- Learn how to [configure private endpoints for all Azure Cache for Redis tiers](cache-private-link.md).
