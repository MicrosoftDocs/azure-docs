---
title: Next Hop IP Support
titleSuffix: Azure Route Server
description: Learn how to use Next Hop IP feature in Azure Route Server to peer with network virtual appliances (NVAs) behind an internal load balancer.
author: halkazwini
ms.author: halkazwini
ms.service: route-server
ms.topic: concept-article
ms.date: 08/21/2023
---

# Next Hop IP support

With the support for Next Hop IP in Azure Route Server, you can peer with network virtual appliances (NVAs) that are deployed behind an Azure internal load balancer. The internal load balancer lets you set up active-passive connectivity scenarios and use load balancing to improve connectivity performance.

:::image type="content" source="./media/next-hop-ip/route-server-next-hop.png" alt-text="Diagram of two NVAs behind a load balancer and a Route Server.":::

## Active-passive NVA connectivity

You can deploy a set of active-passive NVAs behind an internal load balancer to ensure symmetrical routing to and from the NVA. With the support for Next hop IP, you can define the next hop for both the active and passive NVAs as the IP address of the internal load balancer and set up the load balancer to direct traffic towards the Active NVA instance. 

## Active-active NVA connectivity

You can deploy a set of active-active NVAs behind an internal load balancer to optimize connectivity performance. With the support for Next hop IP, you can define the next hop for both NVA instances as the IP address of the internal load balancer. Traffic that reaches the load balancer is sent to both NVA instances.
> [!NOTE]
> * Active-active NVA connectivity may result in asymmetric routing.

## Next hop IP configuration

Next hop IPs are set up in the BGP configuration of the target NVAs. The Next hop IP isn't part of the Azure Route Server configuration.

## Next steps

- Learn how to [configure Azure Route Server](quickstart-configure-route-server-portal.md).
- Learn how to [monitor Azure Route Server](monitor-route-server.md).
