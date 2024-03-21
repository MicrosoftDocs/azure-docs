---
title: Automate UDR Management with Azure Virtual Network Manager
description: Learn to improve network performance and eliminate errors using UDR management with Azure Virtual Network Manager.
author: mbender-ms
ms.author: mbender
ms.topic: overview 
ms.date: 03/18/2024
ms.service: virtual-network-manager
# Customer Intent: As a network engineer, I want learn how I can automate UDR management to improve network performance and eliminate errors in Azure Virtual Network Manager.
---

# Automate UDR Management with Azure Virtual Network Manager

## What is UDR management and what we are solving? 

User-defined Route(UDR) management allows you to describe their designed routing behavior. Azure Virtual Network Manager (AVNM) allows you to describe their desired routing behavior, and AVNM orchestrates UDRs to create and maintain that behavior.

## Why UDR management is important

User-defined routes addresses the need for automation and simplification in managing routing behaviors. you often desire to achieve various routing behaviors, and currently, they resort to manually creating User-Defined Routes (UDRs) or utilizing custom scripts. However, these methods are prone to errors and overly complicated. Also, you can utilize the Azure-managed hub in Virtual WAN, but this option has certain limitations (such as the inability to customize the hub or lack of IPV6 support) not be relevant to your organization.

## How does UDR management works

UDR management works by allowing you to describe their desired routing behavior, and Azure Virtual Network Manager (AVNM) orchestrates UDRs to create and maintain that behavior through routing configurations. This addresses the need for automation and simplification in managing routing behaviors. 

In virtual network manager, you create rule collections to describe the UDRs needed for a network group (target network group). In the rule collection, route rules are used to describe the desired routing behavior for the subnets in the target network group. Each route rule consists of the following attributes: 

- Route source
- Next hop
- Route destination 

Routing configurations create UDRs for you based on what the route rules specify. For example, you can specify that the spoke network group, consisting of two virtual networks, *VNet1* and *VNet2*, accesses the DNS service's address through a Firewall. Your network manager will then create UDRs to make this routing behavior happen.

:::image type="content" source="media/concept-udr-management/udr-management-example.png" alt-text="Diagram of user-defined rules being applied to virtual networks to route DNS traffic through firewall.":::

> [!NOTE]
>  A network group can contain either virtual networks or subnets. You cannot place virtual networks and subnets into the same network group.

## Common routing scenarios

Here are the common routing scenarios that you can simplify and automate by using UDR management. 

| **Routing scenarios**                              | **Description**  |
|--------------------------------------------------|---------------|
| Spoke network -> Network Virtual Appliance -> Spoke network |  Use this scenario for traffic bound between two spoke virtual networks connecting through a network virtual appliance. |
| Spoke network -> Network Virtual Appliance -> Endpoint or Service in Hub network | Use this scenario for traffic from a spoke network to a service endpoint in a hub network connecting through a network virtual appliance. |
| Subnet -> Network Virtual Appliance -> Subnet even in the same virtual network |              |
| Spoke network -> Network Virtual Appliance -> On-premises network/internet | Use this scenario when you have traffic outbound through a network virtual appliance to the Internet or an on-premises location, such as hybrid network scenarios. |
| Cross-hub and spoke network via Network Virtual Appliances in each hub |              |
| hub and spoke network with Spoke network to on-premises needs to go via Network Virtual Appliance | 6             |
| GW -> Network Virtual Appliance -> Spoke network                               |              |

## Next step

> [!div class="nextstepaction"]
> Learn to how to [create user-defined routes in Azure Virtual Network Manager](how-to-create-user-defined-routes.md).

