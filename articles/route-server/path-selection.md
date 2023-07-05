---
title: Path selection with Azure Route Server
description: Learn about how Azure Route Server enables path selection for your network virtual appliance (NVA).
services: route-server
author: halkazwini
ms.service: route-server
ms.topic: conceptual
ms.date: 02/23/2023
ms.author: halkazwini
ms.custom: template-concept, engagement-fy23
#Customer intent: As a network administrator, I want to control how traffic is routed from Azure to my on-premises network.
---

# Path selection with Azure Route Server

Azure Route Server simplifies dynamic routing between Azure virtual network and your network virtual appliance (NVA) that you're using to control traffic between the virtual network and your on-premises network over the internet. In this article, you learn how Azure Route Server enables path selection to allow you to configure your SDWAN NVA to have a [routing preference](../virtual-network/ip-services/routing-preference-overview.md) when communicating with your on-premises network.

## How does it work?

:::image type="content" source="./media/path-selection/routing-preference.png" alt-text="Diagram of Azure Route Server and an SDWAN with Internet routing IP.":::

### Cold potato routing

When you deploy an SDWAN NVA in the same virtual network as the Azure Route Server, it's configured with *Microsoft network* routing preference. Traffic from Azure travels over the *Microsoft global network* and exits it closest to your on-premises. Traffic from your on-premises enters the Microsoft network closest to it on the return path. This method of routing is performance optimized, therefore providing the best possible experience. 

### Hot potato routing

As a way to optimize for cost, you can use the *Internet* routing preference to minimize the travel on the Microsoft global network. Traffic exits the Microsoft network in the same Azure region that hosts the service, then it travels through the internet using the ISPs network. Traffic from your on-premises enters the Microsoft network that's closest to the Azure region of the hosted service. This method of routing provides the best overall price when completing a task like transferring large amount of data.

## How to enable internet routing preference?

To enable internet routing preference for your NVA, create a new zone-redundant standard SKU Public IP address and select **Internet** as the **Routing preference**. Then, assign the public IP address to the NVA.

:::image type="content" source="./media/path-selection/internet-ip.png" alt-text="Screenshot of the internet routing preference of a public IP address in the Azure portal.":::

Microsoft recommends implementing a connectivity solution using both the Microsoft network and the internet to provide your environment with an extra layer of resiliency.

## Next steps

- Learn more about [Azure Route Server](route-server-faq.md).
- Learn how to [configure Azure Route Server](quickstart-configure-route-server-portal.md).
