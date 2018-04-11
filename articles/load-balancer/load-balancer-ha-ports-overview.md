---
title: High availability ports overview in Azure | Microsoft Docs
description: Learn about high availability ports load balancing on an internal load balancer. 
services: load-balancer
documentationcenter: na
author: KumudD
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 46b152c5-6a27-4bfc-bea3-05de9ce06a57
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/21/2017
ms.author: kumud
---

# High availability ports overview

Azure Standard Load Balancer helps you load balance TCP and UDP flows on all ports simultaneously, when you are using an internal Load Balancer. 

An HA ports rule is a variant of a load balancing rule, configured on an internal Standard Load Balancer. You can simplify your use of Load Balancer by providing a single rule to load balance all TCP and UDP flows arriving on all ports of an internal Standard Load Balancer. The load balancing decision is made per flow. This is based on the following five-tuple connection: source IP address, source port, destination IP address, destination port, and protocol.

The HA ports feature helps you with critical scenarios, such as high availability and scale for network virtual appliances (NVA) inside virtual networks. It can also help when a large number of ports must be load balanced. 

The HA ports feature is configured when you set the front-end and back-end ports to **0**, and the protocol to **All**. The internal Load Balancer resource then balances all TCP and UDP flows, regardless of port number.

## Why use HA ports?

### <a name="nva"></a>Network virtual appliances

You can use NVAs for securing your Azure workload from multiple types of security threats. When NVAs are used in these scenarios, they must be reliable and highly available, and they must scale out for demand.

You can achieve these goals simply by adding NVA instances to the back-end pool of the Azure internal Load Balancer, and configuring an HA ports Load Balancer rule.

HA ports provide several advantages for NVA HA scenarios:
- Fast failover to healthy instances, with per-instance health probes
- Higher performance with scale-out to *n*-active instances
- *N*-active and active-passive scenarios
- Eliminating the need for complex solutions like Apache ZooKeeper nodes for monitoring appliances

The following diagram presents a hub-and-spoke virtual network deployment. The spokes force-tunnel their traffic to the hub virtual network and through the NVA, before leaving the trusted space. The NVAs are behind an internal Standard Load Balancer with an HA ports configuration. All traffic can be processed and forwarded accordingly.

![Diagram of hub-and-spoke virtual network, with NVAs deployed in HA mode](./media/load-balancer-ha-ports-overview/nvaha.png)

>[!NOTE]
> If you are using NVAs, confirm with the respective provider how to best use HA ports, and which scenarios are supported.

### Load balancing large numbers of ports

You can also use HA ports for applications that require load balancing of large numbers of ports. You can simplify these scenarios by using an internal [Standard Load Balancer](load-balancer-standard-overview.md) with HA ports. A single load balancing rule replaces multiple individual load balancing rules, one for every port.

## Region availability

The HA ports feature is available in all the global Azure regions.

## Supported configurations

### One single non-floating IP (non-Direct Server Return) HA ports configuration on the internal Standard Load Balancer

This is a basic HA Ports configuration. The following configuration allows you to configure HA Ports load balancing on a single frontend IP Address -
- While configuring your Standard Load Balancer, select **HA Ports** checkbox in the Load Balancer rule configuration, 
- Making sure **Floating IP** is set to **Disabled**.

This configuration does not allow any other load-balancing rule configuration on the current Load Balancer resource, as well as no other internal load balancer resource configuration for the given set of backend instances.

However, you can configure a public Standard Load Balancer for the backend instances in addition to this HA Port rule.

### One single floating IP (Direct Server Return) HA Ports configuration on the internal Standard Load Balancer

You can similarly configure your load balancer to use a load balancing rule with **HA Port** with a single frontend, and the **Floating IP** set to **Enabled**. 

This configuration allows you to add more floating IP load balancing rules, and / or a public Load Balancer. However, you cannot use a non-Floating IP HA Port boad balancing configuration on top of this configuration.

### Multiple HA Ports configurations on the internal Standard Load Balancer

If your scenario requires that you configure more than one HA port frontends for the same backend pool, you can achieve this by: 
- configuring more than one frontend private IP Addresses for a single internal Standard Load Balancer resource.
- configure multiple load balancing rules, where each rule has a single unique frontend IP Address is selected.
- Select **HA Ports** option, and set **Floating IP** to **Enabled** for all of the load balancing rules.

### Internal Load Balancer with HA Ports & public Load Balancer on the same backend instances

You can configure **one** public Standard Load Balancer resource for the backend resources along with a single internal Standard Load Balancer with HA ports.

>[!NOTE]
>This capability is available via Azure Resource Manager templates today, but not via the Azure portal.

## Limitations

- HA Ports configuration is only available for internal Load Balancer, it is not available for a public Load Balancer.

- A combination of HA Ports Load Balancing rule and non-HA Ports Load Balancing rule is not supported.

- The HA Ports feature is not available for IPv6.

- Flow symmetry for NVA scenarios is supported with a single NIC only. See the description and diagram for [network virtual appliances](#nva). However, if a Destination NAT can work for your scenario, you could use that to make sure the internal Load Balancer sends the return traffic to the same NVA.


## Next steps

- [Configure HA Ports on an internal Standard Load Balancer](load-balancer-configure-ha-ports.md)
- [Learn about Standard Load Balancer](load-balancer-standard-overview.md)
