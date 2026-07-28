---
title: Path selection with Azure Route Server
description: Learn how Azure Route Server enables path selection and routing preference configuration for network virtual appliances to optimize performance or cost for hybrid connectivity.
author: duongau
ms.author: duau
ms.service: azure-route-server
ms.topic: concept-article
ms.date: 09/17/2025
ms.custom: sfi-image-nochange

#CustomerIntent: As a network administrator, I want to understand path selection options with Azure Route Server so I can optimize traffic routing between Azure and on-premises networks for either performance or cost.
---

# Path selection with Azure Route Server

Azure Route Server enables sophisticated path selection capabilities for network virtual appliances (NVAs) in hybrid connectivity scenarios. By configuring routing preferences, you can optimize traffic flows between Azure virtual networks and on-premises networks based on your specific requirements for performance, cost, or resilience.

This article explains how path selection works with Azure Route Server and how to configure routing preferences to meet your business needs.

## What is path selection

Path selection in Azure Route Server refers to the ability to control how traffic flows between Azure and external networks through different network paths. This capability allows you to:

- **Optimize performance**: Route traffic through the fastest available paths
- **Minimize costs**: Choose cost-effective routing paths for bulk data transfers
- **Enhance resilience**: Implement multiple paths for redundancy and failover
- **Meet compliance requirements**: Ensure traffic follows specific network routes

## Routing preference options

Azure Route Server supports two primary routing preferences that determine how traffic travels between Azure and your on-premises networks.

### Microsoft network routing (cold potato routing)

Microsoft network routing prioritizes performance by keeping traffic on Microsoft's global network for as long as possible:

:::image type="content" source="./media/path-selection/ip-routing-preference.png" alt-text="Diagram showing Azure Route Server with SD-WAN appliance demonstrating Microsoft network and internet routing paths between Azure and customer premises.":::

In Microsoft network routing, outbound traffic travels over Microsoft's global network and exits at the point closest to your on-premises location, while inbound traffic enters Microsoft's network at the point closest to your on-premises network. This approach provides significant performance benefits through optimal latency and reliability via Microsoft's premium network infrastructure. Microsoft network routing is ideal for real-time applications, video conferencing, and mission-critical workloads that require the best possible performance.

### Internet routing (hot potato routing)

Internet routing optimizes for cost by minimizing traffic on Microsoft's global network. In internet routing, outbound traffic exits Microsoft's network in the same Azure region and then travels over the public internet to reach its destination. Inbound traffic enters Microsoft's network at the point closest to the Azure region hosting your services. This approach provides cost benefits by reducing data transfer costs through limited premium network usage. Internet routing is ideal for bulk data transfers, backup operations, and other non-time-sensitive workloads where cost optimization takes priority over performance.

### Configure internet routing preference

Implementing path selection with Azure Route Server involves configuring public IP addresses with appropriate routing preferences for your network virtual appliances.

To enable cost-optimized internet routing for your NVA:

1. Create a standard SKU public IP address in the Azure portal
2. Select **Internet** as the routing preference during creation
3. Assign the public IP address to your network virtual appliance

:::image type="content" source="./media/path-selection/ip-routing-preference-internet.png" alt-text="Screenshot showing internet routing preference configuration for a public IP address in the Azure portal.":::

Microsoft recommends implementing a connectivity solution using both the Microsoft network and the internet to provide your environment with an extra layer of resiliency.

## Related content

Learn more about Azure Route Server and routing optimization:

- [Azure Route Server overview](overview.md)
- [Configure Azure Route Server](quickstart-configure-route-server-portal.md)
- [Azure routing preference overview](../virtual-network/ip-services/routing-preference-overview.md)
- [Monitor Azure Route Server](monitor-route-server.md)
