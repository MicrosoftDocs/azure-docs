---
title: 'Azure ExpressRoute: Configure BFD'
description: This article provides instructions on how to configure BFD (Bidirectional Forwarding Detection) over private-peering of an ExpressRoute circuit.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: article
ms.date: 06/30/2023
ms.author: duau
---

# Configure BFD over ExpressRoute

ExpressRoute supports Bidirectional Forwarding Detection (BFD) both over private and Microsoft peering. When you enable BFD over ExpressRoute, you can speed up the link failure detection between Microsoft Enterprise edge (MSEE) devices and the routers that your ExpressRoute circuit gets configured (CE/PE). You can configure ExpressRoute over your edge routing devices or your Partner Edge routing devices (if you went with managed Layer 3 connection service). This document walks you through the need for BFD, and how to enable BFD over ExpressRoute.

## Need for BFD

The following diagram shows the benefit of enabling BFD over ExpressRoute circuit:
[![1]][1]

You can enable ExpressRoute circuit either by Layer 2 connections or managed Layer 3 connections. In both cases, if there are more than one Layer-2 devices in the ExpressRoute connection path, the responsibility of detecting any link failures in the path lies with the overlying BGP session.

On the MSEE devices, BGP keep-alive and hold-time are typically configured as 60 and 180 seconds respectively. For that reason when a link failure happens it can take up to three minutes to detect any link failure and switch traffic to alternate connection.

You can control the BGP timers by configuring a lower BGP keep-alive and hold-time on your edge peering device. If the BGP timers aren't the same between the two peering devices, the BGP session establishes using the lower time value. The BGP keep-alive can be set as low as three seconds, and the hold-time as low as 10 seconds. However, setting an aggressive BGP timer isn't recommended because the protocol is process intensive.

In this scenario, BFD can help. BFD provides low-overhead link failure detection in a subsecond time interval. 

> [!NOTE]
> BFD provides faster failover time when a link failure is detected, but the overall connection convergence will take up to a minute for failover between ExpressRoute virtual network gateways and MSEEs. 
>

## Enabling BFD

BFD is configured by default under all the newly created ExpressRoute private and Microsoft peering interfaces on the MSEEs. As such, to enable BFD, you only need to configure BFD on both your primary and secondary devices. Configuring BFD is two-step process. You configure the BFD on the interface and then link it to the BGP session.

An example CE/PE (using Cisco IOS XE) configuration is shown as followed: 

```console
interface TenGigabitEthernet2/0/0.150
   description private peering to Azure
   encapsulation dot1Q 15 second-dot1q 150
   ip vrf forwarding 15
   ip address 192.168.15.17 255.255.255.252
   bfd interval 300 min_rx 300 multiplier 3


router bgp 65020
   address-family ipv4 vrf 15
      network 10.1.15.0 mask 255.255.255.128
      neighbor 192.168.15.18 remote-as 12076
      neighbor 192.168.15.18 fall-over bfd
      neighbor 192.168.15.18 activate
      neighbor 192.168.15.18 soft-reconfiguration inbound
   exit-address-family
```

>[!NOTE]
>To enable BFD under an already existing private or Microsoft peering, you'll need to reset the peering. This will need to be done on circuits configured with private peering before August 2018 and Microsoft peering before January 2020. See [Reset ExpressRoute peerings][ResetPeering]
>

## BFD Timer Negotiation

Between BFD peers, the slower of the two peers determine the transmission rate. MSEEs BFD transmission/receive intervals are set to 300 milliseconds. In certain scenarios, the interval may be set at a higher value of 750 milliseconds. By configuring a higher value, you can force these intervals to be longer but it's not possible to make them shorter.

>[!NOTE]
>If you have configured Geo-redundant ExpressRoute circuits or use Site-to-Site IPSec VPN connectivity as backup. Enabling BFD would help failover quicker following an ExpressRoute connectivity failure. 
>

## Next Steps

For more information or help, check out the following links:

- [Create and modify an ExpressRoute circuit][CreateCircuit]
- [Create and modify routing for an ExpressRoute circuit][CreatePeering]

<!--Image References-->
[1]: ./media/expressroute-bfd/bfd-need.png "BFD expedites link failure deduction time"

<!--Link References-->
[CreateCircuit]: ./expressroute-howto-circuit-portal-resource-manager.md
[CreatePeering]: ./expressroute-howto-routing-portal-resource-manager.md
[ResetPeering]: ./expressroute-howto-reset-peering.md
