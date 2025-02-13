---
title: 'About Azure DDoS Protection Tier Comparison'
description: Learn about the available tiers for Azure DDoS Protection.
author: AbdullahBell
ms.author: Abell
ms.service: azure-ddos-protection
ms.topic: concept-article
ms.date: 11/20/2024
ms.custom: template-concept
---


# About Azure DDoS Protection Tier Comparison


The sections in this article discuss the resources and settings of Azure DDoS Protection.

## Tiers

Azure DDoS Protection supports two tier types, DDoS IP Protection and DDoS Network Protection. The tier is configured in the Azure portal during the workflow when you configure Azure DDoS Protection.

The following table shows features and corresponding tiers.

| Feature | DDoS IP Protection | DDoS Network Protection |
|---|---|---|
| Active traffic monitoring & always on detection |  Yes| Yes |
| L3/L4 Automatic attack mitigation  | Yes | Yes |
| Automatic attack mitigation | Yes | Yes |
| Application based mitigation policies | Yes| Yes |
| Metrics & alerts | Yes | Yes |
| Mitigation reports | Yes | Yes |
| Mitigation flow logs| Yes| Yes |
| Mitigation policies tuned to customers application | Yes| Yes |
| Integration with Firewall Manager | Yes | Yes |
| Microsoft Sentinel data connector and workbook | Yes | Yes |
| Protection of resources across subscriptions in a tenant   | Yes | Yes |
| Public IP Standard tier protection | Yes | Yes |
| Public IP Basic tier protection | No | Yes |
| DDoS rapid response support | Not available | Yes |
| Cost protection | Not available  | Yes |
| WAF discount | Not available | Yes |
| Price | Per protected IP | Per 100 protected IP addresses |

> [!NOTE]
> At no additional cost, Azure DDoS infrastructure protection protects every Azure service that uses public IPv4 and IPv6 addresses. This DDoS protection service helps to protect all Azure services, including platform as a service (PaaS) services such as Azure DNS. For more information on supported PaaS services, see [DDoS Protection reference architectures](ddos-protection-reference-architectures.md). Azure DDoS infrastructure protection requires no user configuration or application changes. Azure provides continuous protection against DDoS attacks. DDoS protection does not store customer data.

## Limitations

DDoS Network Protection and DDoS IP Protection have the following limitations:

- PaaS services (multi-tenant), which includes Azure App Service Environment for Power Apps, Azure API Management in deployment modes other than APIM with virtual network integration, and Azure Virtual WAN aren't currently supported. For more information, see [Azure DDoS Protection APIM in VNET Integration](https://techcommunity.microsoft.com/t5/azure-network-security-blog/azure-ddos-standard-protection-now-supports-apim-in-vnet/ba-p/3641671)
- Protecting a public IP resource attached to a NAT Gateway isn't supported.
- Virtual machines in Classic/RDFE deployments aren't supported.
- VPN gateway or Virtual network gateway is protected by a DDoS policy. Adaptive tuning isn't supported at this stage. 
- Protection of a public IP address prefix linked to a public load balancer frontend is supported with the Azure DDoS Network Protection SKU.
- DDoS telemetry for individual virtual machine instances in Virtual Machine Scale Sets is available with Flexible orchestration mode.


DDoS IP Protection is similar to Network Protection, but has the following additional limitation:

- Public IP Basic tier protection isn't supported. 

> [!NOTE]
> Scenarios in which a single VM is running behind a public IP is supported, but not recommended. For more information, see [Fundamental best practices](./fundamental-best-practices.md#design-for-scalability).

For more information, see [Azure DDoS Protection reference architectures](./ddos-protection-reference-architectures.md).

## Next steps

* [Azure DDoS Protection features](ddos-protection-features.md)
* [Reference architectures](ddos-protection-reference-architectures.md)
