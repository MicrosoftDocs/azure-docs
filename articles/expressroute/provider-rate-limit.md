---
title: About rate limiting for ExpressRoute circuits over service provider ports
titleSuffix: Azure ExpressRoute
description: This document discusses how rate limiting works for ExpressRoute circuits over service provider ports. You'll also learn how to monitor the throughput and traffic drop due to rate limiting.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: conceptual
ms.date: 03/01/2024
ms.author: duau
---

# About rate limiting for ExpressRoute circuits over service provider ports

This article discusses how rate limiting works for ExpressRoute circuits created over service provider ports. You'll also learn how to monitor the throughput and traffic drop due to rate limiting.

## How does rate limiting work over an ExpressRoute circuit?

An ExpressRoute circuit consists of two links that connects the Customer or Provider edge to the Microsoft Enterprise Edge (MSEE) routers. With a circuit bandwidth of 1 Gbps and traffic distributed evenly across both links, a maximum throughput of 2 Gbps (twice the 1 Gbps) can be achieved. However, rate limiting will restricts your throughput to the configured bandwidth if it is exceeded on either link. It is important to note that the excess 1 Gbps in this example serves as redundancy to prevent service disruptions during any link or device maintenance periods.

:::image type="content" source="./media/provider-rate-limit/circuit.png" alt-text="Diagram of rate limiting on an ExpressRoute circuit over provider ports.":::

## How can I determine what my circuit throughput is?

You can monitor the ingress and egress throughput of your ExpressRoute circuit for both links through the Azure portal using ExpressRoute circuit metrics. For ingress, select `BitsInPerSecond` and for egress, select `BitsOutPerSecond`. The following screenshot shows the ExpressRoute circuit metrics for ingress and egress throughput.

:::image type="content" source="./media/provider-rate-limit/throughput-metrics.png" alt-text="Screenshot of the throughput per seconds metrics for an ExpressRoute Direct circuit.":::

## How can I identify if traffic is being dropped due to rate limiting?

You can monitor the traffic that is being dropped due to rate limiting through the Azure portal using the ExpressRoute circuit QOS metrics. For ingress, select `DroppedInBitsPerSecond` and for egress, select `DroppedOutBitsPerSecond`. The following screenshot shows the ExpressRoute circuit QOS metrics for ingress and egress throughput.

:::image type="content" source="./media/provider-rate-limit/drop-bits-metric.png" alt-text="Screenshot of the drop bits per seconds metrics for an ExpressRoute Direct circuit.":::

## How can I increase my circuit bandwidth?

You can seamlessly increase your circuit bandwidth through the Azure portal. For more information, see [About upgrading ExpressRoute circuit bandwidth](about-upgrade-circuit-bandwidth.md).

## What are the causes of traffic drop when the throughput is below the configured bandwidth?

ExpressRoute circuit throughput is monitored at an aggregate level of every few minutes, while the rate limiting is enforced at a granular level in milliseconds. Therefore, occasional traffic bursts exceeding the configured bandwidth might not get detected by the throughput monitoring. However, the rate limiting is still be enforced and traffic gets dropped.

## Next steps

For more frequently asked questions, see [ExpressRoute FAQ](expressroute-faqs.md).
