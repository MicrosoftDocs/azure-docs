---
title: 'Path selection with Azure Route Server'
description: Learn about how Azure Route Server enables path selection for your network virtual appliance.
services: route-server
author: halkazwini
ms.service: route-server
ms.topic: conceptual
ms.date: 11/09/2021
ms.author: halkazwini
#Customer intent: As a network administrator, I want to control how traffic is routed from Azure to my on-premises network.
---

# Path selection with Azure Route Server

Azure Route Server allows you to control traffic to route through your SDWAN NVA over the Internet to your on-premises network. In this article, we'll talk about how Azure Route Server enables path selection which allows you to configure your SNWAN NVA to have a [routing preference](../virtual-network/ip-services/routing-preference-overview.md) when communicating with your on-premises network.

## How does it work?

:::image type="content" source="./media/path-selection/routing-preference.png" alt-text="Diagram of Azure Route Server and a SDWAN with Internet routing IP.":::

### Cold potato routing

When you deploy an SDWAN NVA in the same virtual network as the Azure Route Server it is configured with a Microsoft network IP address. Traffic path to your on-premises will use the Microsoft global network and exits the Microsoft network closest to the destination. The routing from your on-premises will enter the Microsoft network closest to the user on the return path. This method of routing is performance optimize, therefore providing the best possible experience at a cost. 

### Hot potato routing

As a way to optimize for cost, a second method of routing is introduce by assigning your SDWAN NVA with an Internet IP. When traffic is routed to your on-premises, it will exit the Microsoft network in the same region the service is hosted. Then it will route through the Internet using the ISP's network. The routing from on-premises will enter Microsoft network closest to the hosted service region. This method of routing will provide the best overall price when completing a task such as transferring large amount of data.

## How to enable routing preference?

When creating a new Public IP address, select **Internet** as the *Routing preference*. Then assign the public IP address to the SDWAN NVA.

:::image type="content" source="./media/path-selection/internet-ip.png" alt-text="Screenshot of the Internet routing preference for a public IP address.":::

Microsoft recommends implementing a connectivity solution using both the Microsoft network and the Internet to provide your environment with an extra layer of resiliency.

## Next steps

- Learn more about [Azure Route Server](route-server-faq.md).
- Learn how to [configure Azure Route Server](quickstart-configure-route-server-powershell.md).
