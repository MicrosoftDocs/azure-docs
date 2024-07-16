---
title: Next hop IP support
titleSuffix: Azure Route Server
description: Learn how to use the next hop IP support in Azure Route Server to peer with network virtual appliances (NVAs) behind an internal load balancer.
author: halkazwini
ms.author: halkazwini
ms.service: route-server
ms.topic: concept-article
ms.date: 02/13/2024

#CustomerIntent: As an Azure administrator, I want to use the frontend IP address of the load balancer as the next hop IP so packets are routed to the load balancer to get to the NVAs that are in the backend pool.
---

# Next hop IP support

With the support for Next hop IP in Azure Route Server, you can peer with network virtual appliances (NVAs) that are deployed behind an Azure internal load balancer. The internal load balancer lets you set up active-passive connectivity scenarios and use load balancing to improve connectivity performance.

:::image type="content" source="./media/next-hop-ip/route-server-next-hop.png" alt-text="Diagram of a Route Server peered with two NVAs behind an internal load balancer.":::

> [!NOTE] 
> The load balancer must be in the same region as the Route Server. If the load balancer is in a different region than the Route Server, then connectivity to these NVAs will not be functional.  

## Active-passive NVA connectivity

You can deploy a set of active-passive NVAs behind an internal load balancer to ensure symmetrical routing to and from the NVA. With the support for Next hop IP, you can define the next hop for both the active and passive NVAs as the IP address of the internal load balancer and set up the load balancer to direct traffic towards the Active NVA instance. 

## Active-active NVA connectivity

You can deploy a set of active-active NVAs behind an internal load balancer to optimize connectivity performance. With the support for Next hop IP, you can define the next hop for both NVA instances as the IP address of the internal load balancer. Traffic that reaches the load balancer is sent to both NVA instances.

> [!NOTE]
> Active-active NVA connectivity may result in asymmetric routing.

## Next hop IP configuration

Next hop IP addresses are set up in the BGP configuration of the target NVAs. The Next hop IP isn't part of the Azure Route Server configuration.

## Related content

- [Configure Azure Route Server](quickstart-configure-route-server-portal.md).
- [Monitor Azure Route Server](monitor-route-server.md).
