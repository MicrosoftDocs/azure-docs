---
title: 'Connectivity between virtual networks over Azure ExpressRoute'
description: This article explains why virtual network peering is the recommended solution for virtual network to virtual network connectivity when using ExpressRoute.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: concept-article
ms.date: 01/31/2025
ms.author: duau
---

# Connectivity between virtual networks over Azure ExpressRoute

## Overview

Azure ExpressRoute private peering allows connectivity between multiple virtual networks by deploying an ExpressRoute virtual network gateway in each virtual network and creating a connection to the ExpressRoute circuit. This setup enables connectivity to virtual machines (VMs) and private endpoints from on-premises. When multiple virtual networks are linked to an ExpressRoute circuit, virtual network to virtual network connectivity is established by default. However, Microsoft recommends using virtual network peering for optimal performance. For more information, see [About Virtual Network Peering](../virtual-network/virtual-network-peering-overview.md) and [Manage virtual network peering](../virtual-network/virtual-network-manage-peering.md).

## Limitations

While ExpressRoute supports virtual network to virtual network connectivity, there are two main limitations compared to virtual network peering:

### ExpressRoute virtual network gateway in the data path

Connecting virtual networks via ExpressRoute involves a virtual network gateway, which manages connectivity to VMs and private endpoints. These gateways have bandwidth and performance limitations. For more information, see [About ExpressRoute gateways](expressroute-about-virtual-network-gateways.md). Virtual network peering avoids these limitations as the gateway isn't in the data path.

### Higher latency

ExpressRoute connectivity is managed through Microsoft Enterprise Edge (MSEE) devices at [ExpressRoute peering locations](expressroute-locations-providers.md#expressroute-locations), which are separate from Azure regions. This setup introduces extra latency. Virtual network peering, on the other hand, allows direct traffic flow between Azure regions, resulting in lower latency and better performance.

## Enable virtual network to virtual network or virtual network to Virtual WAN connectivity through ExpressRoute

By default, virtual network to virtual network and virtual network to Virtual WAN connectivity is disabled through an ExpressRoute circuit. To enable this connectivity, configure the ExpressRoute virtual network gateway accordingly. For more information, see [Enable virtual network to virtual network or virtual network to Virtual WAN connectivity through ExpressRoute](expressroute-howto-add-gateway-portal-resource-manager.md#enable-or-disable-vnet-to-vnet-or-vnet-to-virtual-wan-traffic-through-expressroute).

## Next steps

* Learn more about [Designing for high availability](designing-for-high-availability-with-expressroute.md).
* Plan for [Disaster recovery](designing-for-disaster-recovery-with-expressroute-privatepeering.md) and [using VPN as a backup](use-s2s-vpn-as-backup-for-expressroute-privatepeering.md).
