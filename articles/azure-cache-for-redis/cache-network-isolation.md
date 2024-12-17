---
title: Azure Cache for Redis network isolation options 
description: In this article, you learn how to determine the best network isolation solution for your needs. We go through the basics of Azure Private Link, Azure Virtual Network (VNet) injection, and Azure Firewall Rules with their advantages and limitations.



ms.topic: conceptual
ms.date: 11/11/2024


---

# Azure Cache for Redis network isolation options

In this article, you learn how to determine the best network isolation solution for your needs. We discuss the basics of Azure Private Link (recommended), Azure Virtual Network (VNet) injection, and Firewall Rules. We discuss their advantages and limitations.  

## Azure Private Link (recommended)

Azure Private Link provides private connectivity from a virtual network to Azure PaaS services. Private Link simplifies the network architecture and secures the connection between endpoints in Azure. Private Link also secures the connection by eliminating data exposure to the public internet.

### Advantages of Private Link

- Private link supported on all tiers - Basic, Standard, Premium, Enterprise, and Enterprise Flash tiers - of Azure Cache for Redis instances.
- By using [Azure Private Link](../private-link/private-link-overview.md), you can connect to an Azure Cache instance from your virtual network through a private endpoint. The endpoint is assigned a private IP address in a subnet within the virtual network. With this private link, cache instances are available from both within the VNet and publicly.

   > [!IMPORTANT]
   > Enterprise/Enterprise Flash caches with private link cannot be accessed publicly.

- Once a private endpoint is created on Basic/Standard/Premium tier caches, access to the public network can be restricted through the `publicNetworkAccess` flag. This flag is set to `Disabled` by default, which  only allows private link access. You can set the value to `Enabled` or `Disabled` with a PATCH request. For more information, see [Azure Cache for Redis with Azure Private Link](cache-private-link.md).

   > [!IMPORTANT]
   > Enterprise/Enterprise Flash tier does not support `publicNetworkAccess` flag.

- Any external cache dependencies don't affect the VNet's NSG rules.
- Persisting to any storage accounts protected with firewall rules is supported on the Premium tier when using managed identity to connect to Storage account, see more [Import and Export data in Azure Cache for Redis](cache-how-to-import-export-data.md#what-if-i-have-firewall-enabled-on-my-storage-account)
- Private link offers less privilege by reducing the amount of access your cache has to other network resources. Private link prevents a bad actor from initiating traffic to the rest of your network.

### Limitations of Private Link

- Currently, portal console isn't supported for caches with private link.

> [!NOTE]
> When adding a private endpoint to a cache instance, all Redis traffic is moved to the private endpoint because of the DNS.
> Ensure previous firewall rules are adjusted before.

## Azure Virtual Network injection

> [!CAUTION]
> Virtual Network injection is not recommended. For more information, see [Limitations of VNet injection](#limitations-of-vnet-injection).

Virtual Network (VNet) enables many Azure resources to securely communicate with each other, the internet, and on-premises networks. VNet is like a traditional network you would operate in your own data center.

### Limitations of VNet injection

- Creating and maintaining virtual network configurations are often error prone. Troubleshooting is challenging, too. Incorrect virtual network configurations can lead to issues:

  - obstructed metrics transmission from your cache instances
  
  - failure of replica node to replicate data from primary node
  
  - potential data loss
  
  - failure of management operations like scaling
  
  - intermittent or complete SSL/TLS failures
  
  - failure to apply updates, including important security and reliability improvements
  
  - in the most severe scenarios, loss of availability
  
- When using a VNet injected cache, you must keep your VNet updated to allow access to cache dependencies, such as Certificate Revocation Lists, Public Key Infrastructure, Azure Key Vault, Azure Storage, Azure Monitor, and more.
- VNet injected caches are only available for Premium-tier Azure Cache for Redis instances, not other tiers.
- You can't inject an existing Azure Cache for Redis instance into a Virtual Network. You must select this option when you *create* the cache.

## Firewall rules

Azure Cache for Redis allows configuring Firewall rules for specifying IP address that you want to allow to connect to your Azure Cache for Redis instance.

### Advantages of firewall rules

- When firewall rules are configured, only client connections from the specified IP address ranges can connect to the cache. Connections from Azure Cache for Redis monitoring systems are always permitted, even if firewall rules are configured. NSG rules that you define are also permitted.  

### Limitations of firewall rules

- Firewall rules can be applied to a private endpoint cache only if the public network access is enabled. If public network access is enabled on the private endpoint cache with no firewall rules are configured, the cache accepts all public network traffic.  
- Firewall rules configuration is available for all Basic, Standard, and Premium tiers.
- Firewall rules configuration isn't available for Enterprise nor Enterprise Flash tiers.

## Next steps

- Learn how to configure a [VNet injected cache for a Premium Azure Cache for Redis instance](cache-how-to-premium-vnet.md).
- Learn how to configure [firewall rules for all Azure Cache for Redis tiers](cache-configure.md#firewall).
- Learn how to [configure private endpoints for all Azure Cache for Redis tiers](cache-private-link.md).
