---
title: High availability ports overview in Azure
titleSuffix: Azure Load Balancer
description: Learn about high availability ports load balancing on an internal load balancer.
author: mbender-ms
ms.service: load-balancer
ms.topic: conceptual
ms.date: 05/03/2023
ms.author: mbender
ms.custom: template-concept, engagement-fy23
---

# High availability ports overview

Azure Standard Load Balancer helps you load-balance **all** protocol flows on **all** ports simultaneously when you're using an internal load balancer via HA Ports.

High availability (HA) ports are a type of load balancing rule that provides an easy way to load-balance **all** flows that arrive on **all** ports of an internal standard load balancer. The load-balancing decision is made per flow. This action is based on the following five-tuple connection: source IP address, source port, destination IP address, destination port, and protocol

The HA ports load-balancing rules help you with critical scenarios, such as high availability and scale for network virtual appliances (NVAs) inside virtual networks. The feature can also help when a large number of ports must be load-balanced. 

The HA ports load-balancing rules are configured when you set the frontend and backend ports to **0** and the protocol to **All**. The internal load balancer resource then balances all TCP and UDP flows, regardless of port number

## Why use HA ports?

### Network virtual appliances

You can use NVAs to help secure your Azure workload from multiple types of security threats. When you use NVAs in these scenarios, they must be reliable and highly available, and they must scale out for demand. Add NVA instances to the backend pool of your internal load balancer and configure an HA ports rule.

For NVA HA scenarios, HA ports offer the following advantages:

- Provide fast failover to healthy instances, with per-instance health probes

- Ensure higher performance with scale-out to **n**-active instances

- Provide **n**-active and active-passive scenarios

- Eliminate the need for complex solutions, such as Apache ZooKeeper nodes for monitoring appliances

The following diagram presents a hub-and-spoke virtual network deployment. The spokes force-tunnel their traffic to the hub virtual network and through the NVA, before leaving the trusted space. The NVAs are behind an internal Standard Load Balancer with an HA ports configuration. All traffic can be processed and forwarded accordingly. When configured as show in the following diagram, an HA Ports load-balancing rule additionally provides flow symmetry for ingress and egress traffic.

:::image type="content" source="./media/load-balancer-ha-ports-overview/nvahathmb.png" alt-text="Diagram of hub-and-spoke virtual network, with NVAs deployed in HA mode." lightbox="media/load-balancer-ha-ports-overview/nvaha.png":::

>[!NOTE]
> If you are using NVAs, confirm with their providers how to best use HA ports and to learn which scenarios are supported.

### Load balance a large number of ports

You can also use HA ports for applications that require load balancing of large numbers of ports. You can simplify these scenarios by using an internal [standard load balancer](./load-balancer-overview.md) with HA ports. A single load-balancing rule replaces multiple individual load-balancing rules, one for each port.

## Supported configurations

### A single, nonfloating IP (non-Direct Server Return) HA-ports configuration on an internal standard load balancer

This configuration is a basic HA ports configuration. Use the following steps to configure an HA ports load-balancing rule on a single frontend IP address:

1. When configuring a standard load balancer, select the **HA ports** check box in the load balancer rule configuration.

2. For **Floating IP**, select **Disabled**.

This configuration doesn't allow any other load-balancing rule configuration on the current load balancer resource. It also allows no other internal load balancer resource configuration for the given set of backend instances.

However, you can configure a public Standard Load Balancer for the backend instances in addition to this HA ports rule.

### A single, floating IP (Direct Server Return) HA-ports configuration on an internal standard load balancer

You can similarly configure your load balancer to use a load-balancing rule with **HA Port** with a single front end by setting the **Floating IP** to **Enabled**. 

With this configuration, you can add more floating IP load-balancing rules and/or a public load balancer. However, you can't use a nonfloating IP, HA-ports load-balancing configuration on top of this configuration.

### Multiple HA-ports configurations on an internal standard load balancer

To configure more than one HA port frontend for the same backend pool, use the following steps:

- Configure more than one frontend private IP address for a single internal standard load balancer resource.

- Configure multiple load-balancing rules, where each rule has a single unique frontend IP address selected.

- Select the **HA ports** option, and then set **Floating IP** to **Enabled** for all the load-balancing rules.

### An internal load balancer with HA ports and a public load balancer on the same backend instance

You can configure **one** public standard load balancer resource for the backend resources with a single internal standard load balancer with HA ports.

## Flow symmetry

 Flow symmetry is only supported in the architecture described in the above diagram, for the following configurations:
 
- When the load balancer backend pool contains instances that only have one NIC and one IP configuration each

- When the load balancer backend pool contains instances that have multiple NICs with only one IP configuration on each NIC

- Dual-stack scenarios, where each backend instance only has one NIC and only one IPv4 and IPv6 configuration on each NIC. Please note that flow symmetry is only guaranteed for IPv4 and IPv6 flows independently, as these IP configurations would be configured with two separate backend pools and frontend IP configurations, respectively.

Flow symmetry isn't guaranteed in any scenarios that involve two or more load balancer components, such as across two different load balancers, multiple backend pools, or multiple frontend IP configurations. Since traffic is distributed based on load balancing rules, which make independent decisions and aren't coordinated, flow symmetry cannot be guaranteed in such scenarios. As a result, flow symmetry isn't supported when placing NVAs between a public and internal load balancer. If you need flow symmetry in such scenarios, consider leveraging [Gateway Load Balancer](gateway-overview.md) instead.


## Limitations

- HA ports load-balancing rules are available only for an internal standard load balancer.

- The combining of an HA ports load-balancing rule and a non-HA ports load-balancing rule pointing to the same backend **ipconfiguration(s)** isn't supported on a single frontend IP configuration unless both have Floating IP enabled.

- IP fragmenting isn't supported. 


## Next steps

- [Learn about Standard Load Balancer](load-balancer-overview.md)
