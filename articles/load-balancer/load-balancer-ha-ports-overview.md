---
title: High availability ports overview in Azure
titleSuffix: Azure Load Balancer
description: Learn about high availability ports load balancing on an internal load balancer. 
author: mbender-ms
ms.service: load-balancer
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 05/03/2023
ms.author: mbender
ms.custom: template-concept, seodec18, engagement-fy23
---

# High availability ports overview

Azure Standard Load Balancer helps you load-balance **all** protocol flows on **all** ports simultaneously when you're using an internal load balancer via HA Ports.

High availability (HA) ports are a type of load balancing rule that provides an easy way to load-balance **all** flows that arrive on **all** ports of an internal standard load balancer. The load-balancing decision is made per flow. This action is based on the following five-tuple connection: source IP address, source port, destination IP address, destination port, and protocol

The HA ports load-balancing rules help you with critical scenarios, such as high availability and scale for network virtual appliances (NVAs) inside virtual networks. The feature can also help when a large number of ports must be load-balanced. 

The HA ports load-balancing rules are configured when you set the front-end and back-end ports to **0** and the protocol to **All**. The internal load balancer resource then balances all TCP and UDP flows, regardless of port number

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

This configuration doesn't allow any other load-balancing rule configuration on the current load balancer resource. It also allows no other internal load balancer resource configuration for the given set of back-end instances.

However, you can configure a public Standard Load Balancer for the back-end instances in addition to this HA ports rule.

### A single, floating IP (Direct Server Return) HA-ports configuration on an internal standard load balancer

You can similarly configure your load balancer to use a load-balancing rule with **HA Port** with a single front end by setting the **Floating IP** to **Enabled**. 

With this configuration, you can add more floating IP load-balancing rules and/or a public load balancer. However, you can't use a nonfloating IP, HA-ports load-balancing configuration on top of this configuration.

### Multiple HA-ports configurations on an internal standard load balancer

To configure more than one HA port frontend for the same backend pool, use the following steps:

- Configure more than one front-end private IP address for a single internal standard load balancer resource.

- Configure multiple load-balancing rules, where each rule has a single unique front-end IP address selected.

- Select the **HA ports** option, and then set **Floating IP** to **Enabled** for all the load-balancing rules.

### An internal load balancer with HA ports and a public load balancer on the same backend instance

You can configure **one** public standard load balancer resource for the backend resources with a single internal standard load balancer with HA ports.

## Limitations

- HA ports load-balancing rules are available only for an internal standard load balancer.

- The combining of an HA ports load-balancing rule and a non-HA ports load-balancing rule pointing to the same backend **ipconfiguration(s)** isn't supported on a single front-end IP configuration unless both have Floating IP enabled.

- IP fragmenting isn't supported. 

- Flow symmetry for NVA scenarios with a backend instance and a single IP/single NIC configuration is supported only when used as shown in the diagram above. Flow symmetry isn't provided in any other scenario. Two or more load balancer resources and their rules make independent decisions and aren't coordinated. Flow symmetry isn't available with the use of multiple IP configurations. Flow symmetry isn't available when placing the NVA between a public and internal load balancer. We recommend the use of a single IP/single NIC configuration referenced in the architecture above.

## Next steps

- [Learn about Standard Load Balancer](load-balancer-overview.md)
