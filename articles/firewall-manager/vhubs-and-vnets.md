---
title: What are the Azure Firewall Manager architecture options?
description: Compare and contrast using hub virtual network or secured virtual hub architectures with Azure Firewall Manager.
author: vhorne
ms.service: firewall-manager
services: firewall-manager
ms.topic: article
ms.date: 02/18/2020
ms.author: victorh
---

# What are the Azure Firewall Manager architecture options?

Azure Firewall Manager can provide security management for two network architecture types:

- **secured virtual hub**

   An [Azure Virtual WAN Hub](../virtual-wan/virtual-wan-about.md#resources) is a Microsoft-managed resource that lets you easily create hub and spoke architectures. When security and routing policies are associated with such a hub, it's referred to as a *[secured virtual hub](secured-virtual-hub.md)*. 
- **hub virtual network**

   This is a standard Azure virtual network that you create and manage yourself. When security policies are associated with such a hub, it is referred to as a *hub virtual network*. At this time, only Azure Firewall Policy is supported. You can peer spoke virtual networks that contain your workload servers and services. You can also manage firewalls in standalone virtual networks that are not peered to any spoke.

## Comparison

The following table compares these two architecture options and can help you decide which one is right for your organization's security requirements:


|  |**Hub virtual network**|**Secured virtual hub**  |
|---------|---------|---------|
|**Underlying resource**     |Virtual network|Virtual WAN Hub|
|**Hub & Spoke**     |Uses Virtual network peering|Automated using hub virtual network connection|
|**On-prem connectivity**     |VPN Gateway up to 10 Gbps and 30 S2S connections; ExpressRoute|More scalable VPN Gateway up 20 Gbps and 1000 S2S connections; Express Route|
|**Automated branch connectivity using SDWAN**      |Not supported|Supported|
|**Hubs per region**     |Multiple Virtual Networks per region|Single Virtual Hub per region. Multiple hubs possible with multiple Virtual WANs|
|**Azure Firewall – multiple public IP addresses**      |Customer provided|Auto generated. To be available by GA.|
|**Azure Firewall Availability Zones**     |Supported|Not available in preview. To be available by GA|
|**Advanced Internet security with third-party Security as a Service partners**     |Customer established and managed VPN connectivity to partner service of choice|Automated via Trusted Security Partner flow and partner management experience|
|**Centralized route management to route traffic to the hub**     |Customer-managed User Defined Route|Supported using BGP|
|**Web Application Firewall on Application Gateway** |Supported in Virtual Network|Currently supported in spoke network|
|**Network Virtual Appliance**|Supported in Virtual Network|Currently supported in spoke network|

## Next steps

- Review [Azure Firewall Manager Preview deployment overview](deployment-overview.md)
- Learn about [secured Virtual Hubs](secured-virtual-hub.md).