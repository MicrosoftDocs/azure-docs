---
title: Global Secure Access traffic forwarding profiles
description: Learn about the traffic forwarding profiles for Global Secure Access.
author: shlipsey3
ms.author: sarahlipsey
manager: amycolannino
ms.topic: conceptual
ms.date: 05/19/2023
ms.service: network-access
ms.custom: 
---

# Global Secure Access traffic forwarding profiles

With the traffic forwarding profiles in Global Secure Access, you can apply policies to the network traffic that your organization needs to secure and manage. Network traffic is evaluated against the traffic forwarding policies you configure. The profiles are applied and the traffic goes through the service to the appropriate apps and resources. 

This article describes the traffic forwarding profiles and how they work.

## Traffic forwarding

**Traffic forwarding** enables you to configure the type of network traffic to route through the Microsoft Entra Private and Microsoft Entra Internet Access services. You set up profiles to manage how specific types of traffic are managed. 

When traffic comes through Global Secure Access, the service evaluates the type of traffic first through the **M365 profile** and then through the **Private access profile**. Any traffic that doesn't match the first two profiles isn't forwarded to Global Secure Access. 

:::image type="content" source="media/concept-traffic-forwarding/global-secure-access-overview.png" alt-text="Diagram of the Global Secure Access process." lightbox="media/concept-traffic-forwarding/global-secure-access-overview-expanded.png":::

In the previous diagram, the traffic coming into your network first passes through dedicated tunnels where Conditional Access policies can be applied. The traffic is then routed through Global Secure Access and is evaluated by the traffic profiles. The traffic is routed to the appropriate apps and resources according to your enabled policies.

For each traffic forwarding profile, you can configure three main details:

- The IP addresses, IP address ranges, and fully qualified domain names (FQDN) to either forward to the service or bypass the service
- Conditional Access policies to apply
- Remote network locations to assign

## Microsoft 365

The Microsoft 365 traffic forwarding profile includes SharePoint Online, Exchange Online, and Microsoft 365 apps. All of the destinations for these apps are automatically included in the profile. Within each of the three main groups of destinations, you can choose to forward that traffic to Global Secure Access or bypass the service.

## Private access

With the Private Access profile you can route traffic to your private apps and resources. 

## Next steps

- [Enable the M365 traffic profile](how-to-enable-m365-profile.md)
- [How to enable the Private access traffic profile](how-to-enable-private-access-profile.md)