---
title: 'Azure Stack Networking: Differences and considerations'
description: Learn about differences and considerations when working with networking in Azure Stack.
services: azure-stack
keywords: 
author: ScottNapolitan
ms.author: victorh
ms.date: 9/25/2017
ms.topic: article
ms.service: azure-stack

---

# Considerations for Azure Stack networking

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

Networking in Azure Stack provides many of the features you find in Azure, with some differences you should understand before you start deploying.


This article provides an overview of the unique considerations for Networking and its features in Azure Stack. To learn about high-level differences between Azure Stack and Azure, see the [Key considerations](azure-stack-considerations.md) topic.


## Cheat sheet: Networking differences

|Service | Feature | Azure (global) | Azure Stack |
| --- | --- | --- | --- |
| DNS | Multi-tenant DNS | Supported| Not yet supported|
| |DNS AAAA records|Supported|Not supported|
| |DNS zones per subscription|100 (default)<br>Can be increased on request.|100|
| |DNS record sets per zone|5000 (default)<br>Can be increased on request.|5000|
||Name servers for zone delegation|Azure provide four name servers for each user (tenant) zone that is created.|Azure Stack provides two name servers for each user (tenant) zone that is created.|
| Virtual network|Virtual network peering|Connect two virtual networks in the same region through the Azure backbone network.|Not yet supported|
| |IPv6 addresses|You can assign an IPv6 address as part of the [Network Interface Configuration](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-network-network-interface-addresses#ip-address-versions).|Only IPv4 is supported.|
|VPN gateways|Point-to-Site VPN Gateway|Supported|Not yet supported|
| |Vnet-to-Vnet Gateway|Supported|Not yet supported|
| |VPN Gateway SKUs|Support for Basic, GW1, GW2, GW3, Standard High Performance, Ultra-High Performance. |Support for Basic, Standard, and High-Performance SKUs.|
|Load balancer|IPv6 public IP addresses|Support for assigning an IPv6 public IP address to a load balancer.|Only IPv4 is supported.|
|Network Watcher|Network Watcher tenant network monitoring capabilities|Supported|Not yet supported|
|CDN|Content Delivery Network profiles|Supported|Not yet supported|
|Application gateway|Layer-7 load balancing|Supported|Not yet supported|
|Traffic Manager|Route incoming traffic for optimal application performance and reliability.|Supported|Not yet supported|
|Express Route|Set up a fast, private connection to Microsoft cloud services from your on-premises infrastructure or colocation facility.|Supported|Support for connecting Azure Stack to an Express Route circuit.|

## Next steps

[DNS in Azure Stack](azure-stack-dns.md)
