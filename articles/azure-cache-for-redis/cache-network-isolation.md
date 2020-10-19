---
title: Azure Cache for Redis network isolation options 
description: In this article, you’ll learn how to determine the best network isolation solution for your needs. We’ll go through the basics of Azure Private Link, Azure Virtual Network (VNet) injection, and Azure Firewall Rules with their advantages and limitations.
author: curib
ms.author: cauribeg
ms.service: cache
ms.topic: conceptual
ms.date: 10/15/2020
---

# Azure Cache for Redis network isolation options 
In this article, you’ll learn how to determine the best network isolation solution for your needs. We’ll go through the basics of Azure Private Link, Azure Virtual Network (VNet) injection, and Azure Firewall Rules with their advantages and limitations.  

## Azure Private Link (Public Preview) 
Azure Private Link provides private connectivity from a virtual network to Azure PaaS services. It simplifies the network architecture and secures the connection between endpoints in Azure by eliminating data exposure to the public internet. 

### Advantages
* Supported on Basic, Standard, and Premium Azure Cache for Redis instances. 
* By using [Azure Private Link](/azure/private-link/private-link-overview), you can connect to an Azure Cache instance from your virtual network via a private endpoint, which is assigned a private IP address in a subnet within the virtual network. With this, cache instances are available from both within the VNet and publicly.  
* Once a private endpoint is created, access to the public network can be restricted through the `publicNetworkAccess` flag. This flag is set to `Enabled` by default, giving you the option to allow both public and private link access to the cache. If set to `Disabled`, it will only allow private link access. You can set the value to `Disabled` with a PATCH request. For more information, see [Azure Cache for Redis with Azure Private Link (Preview)](cache-private-link.md). 
* All external cache dependencies won't affect the VNet's NSG rules.

### Limitations 
* Network security groups (NSG) are disabled for private endpoints. However, if there are other resources on the subnet, NSG enforcement will apply to those resources.
* Geo-replication, firewall rules, portal console support, multiple endpoints per clustered cache, persistence to firewall and VNet injected caches aren't supported yet. 
* To connect to a clustered cache, `publicNetworkAccess` needs to be set to `Disabled` and there can only be one private endpoint connection.

> [!NOTE]
> When adding a private endpoint to a cache instance, all Redis traffic will be moved to the private endpoint because of the DNS.
> Ensure previous firewall rules are adjusted before.  
>
>

## Azure Virtual Network Injection 
VNet is the fundamental building block for your private network in Azure. VNet enables many Azure resources to securely communicate with each other, the internet, and on-premises networks. VNet is like a traditional network that you would operate in your own data center, but with the benefits of Azure infrastructure, scale, availability, and isolation. 

### Advantages
* When an Azure Cache for Redis instance is configured with a VNet, it's not publicly addressable and can only be accessed from virtual machines and applications within the VNet.  
* When VNet is combined with restricted NSG policies, it helps reduce the risk of data exfiltration. 
* VNet deployment provides enhanced security and isolation for your Azure Cache for Redis, as well as subnets, access control policies, and other features to further restrict access. 
* Geo replication is supported. 

### Limitations
* VNet injected caches are only available for Premium Azure Cache for Redis. 
* When using a VNet injected cache, you'll need to open your VNet to cache dependencies such as CRLs/PKI, AKV, Azure Storage, Azure Monitor, and more.  


## Firewall Rules
[Azure Firewall](/azure/firewall/overview) is a managed, cloud-based network security service that protects your Azure VNet resources. It’s a fully stateful firewall as a service with built-in high availability and unrestricted cloud scalability. You can centrally create, enforce, and log application and network connectivity policies across subscriptions and virtual networks.  

### Advantages
* When firewall rules are configured, only client connections from the specified IP address ranges can connect to the cache. Connections from Azure Cache for Redis monitoring systems are always permitted, even if firewall rules are configured. NSG rules that you define are also permitted.  

### Limitations
* Firewall rules can be used in conjunction with VNet injected caches, but not private endpoints currently. 


## Next steps
* Learn how to configure a [VNet injected cache for a Premium Azure Cache for Redis instance](cache-how-to-premium-vnet.md).  
* Learn how to configure [firewall rules for all Azure Cache for Redis tiers](cache-configure.md#firewall). 
* Learn how to [configure private endpoints for all Azure Cache for Redis tiers](cache-private-link.md). 
