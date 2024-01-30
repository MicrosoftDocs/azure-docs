---
title: 'Connectivity between virtual networks over ExpressRoute'
description: This article explains why virtual network peering is the recommended solution for VNet to VNet connectivity when using ExpressRoute.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: conceptual
ms.date: 06/30/2023
ms.author: duau
---

# Connectivity between virtual networks over ExpressRoute

## Overview

ExpressRoute private peering supports connectivity between multiple virtual networks. To achieve this connectivity, an ExpressRoute virtual network gateway gets deployed into each virtual network. Then a connection is created between the gateway and the ExpressRoute circuit. When this connection gets established, connectivity to virtual machines (VMs) and private endpoints are enabled from on-premises. When multiple virtual networks are linked to an ExpressRoute circuit, VNet to VNet connectivity is enabled. Although this behavior happens by default when linking virtual networks to the same ExpressRoute circuit, Microsoft doesn't recommend this solution. To establish connectivity between virtual networks, VNet peering should be implemented instead for the best performance possible. For more information, see [About Virtual Network Peering](../virtual-network/virtual-network-peering-overview.md) and [Manage VNet peering](../virtual-network/virtual-network-manage-peering.md).

## Limitations

Even though ExpressRoute supports virtual network to virtual network connectivity, there are two main limitations with this solution that make it not an ideal choice when compared to VNet peering.

### ExpressRoute virtual network gateway in the data path

Virtual networks that are connected to an ExpressRoute circuit are established by deploying a virtual network gateway. The gateway facilitates the management plane and data path connectivity to virtual machines (VMs) and private endpoints defined in a virtual network. These gateway resources have bandwidth, connections-per-second and packets-per-second limitations. For more information about these limitations, see [About ExpressRoute gateways](expressroute-about-virtual-network-gateways.md). When virtual network to virtual network connectivity goes through ExpressRoute, the virtual network gateway can be the source of bottleneck in terms of bandwidth and data path or control plane limitations. When you configure virtual network peering, the virtual network gateway isn't in the data path. Therefore, you don't experience those limitations seen with VNet to VNet connectivity going through ExpressRoute.

### Higher latency

ExpressRoute connectivity gets managed by a pair of Microsoft Enterprise Edge (MSEE) devices located at [ExpressRoute peering locations](expressroute-locations-providers.md#expressroute-locations). ExpressRoute peering locations are physically separate from Azure regions, when virtual network to virtual network connectivity is enabled using ExpressRoute. Traffic from the virtual network leaves the origin Azure region and passes through the MSEE devices at the peering location. Then that traffic goes through Microsoft's global network to reach the destination Azure region. With VNet peering, traffic flows from the origin Azure region directly to the destination Azure region using Microsoft's global network, without the extra hop of the MSEE devices. Since the extra hop is no longer in the data path, you see lower latency and an overall better experience with your applications and network traffic.

## Next steps

* Learn more about [Designing for high availability](designing-for-high-availability-with-expressroute.md).
* Plan for [Disaster recovery](designing-for-disaster-recovery-with-expressroute-privatepeering.md) and [using VPN as a backup](use-s2s-vpn-as-backup-for-expressroute-privatepeering.md).
