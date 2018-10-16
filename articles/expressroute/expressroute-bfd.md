---
title: 'Configure BFD over ExpressRoute | Microsoft Docs'
description: This document provides instructions on how to configure BFD over private-peering of an ExpressRoute circuit.
documentationcenter: na
services: expressroute
author: rambk
manager: tracsman
editor: 

ms.assetid: 
ms.service: expressroute
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 8/17/2018
ms.author: rambala

---
# Configure BFD over ExpressRoute

ExpressRoute supports Bidirectional Forwarding Detection (BFD) over private peering. By enabling BFD over ExpressRoute, you can expedite link failure detection between Microsoft Enterprise edge (MSEE) devices and the routers on which you terminate the ExpressRoute circuit (PE). You can terminate ExpressRoute over Customer Edge routing devices or Partner Edge routing devices (if you went with managed Layer 3 connection service). This document walks you through the need for BFD, and how to enable BFD over ExpressRoute.

## Need for BFD

The following diagram shows the benefit of enabling BFD over ExpressRoute circuit:
[![1]][1]

You can enable ExpressRoute circuit either by Layer 2 connections or managed Layer 3 connections. In either case, if there are one or more Layer-2 devices in the ExpressRoute connection path, responsibility of detecting any link failures in the path lies with the overlying BGP.

On the MSEE devices, BGP keepalive and hold-time are typically configured as 60 and 180 seconds respectively. Therefore, following a link failure it would take up to three minutes to detect any link failure and switch traffic to alternate connection.

You can control the BGP timers by configuring lower BGP keepalive and hold-time on the customer edge peering device. If the BGP timers are mismatched between the two peering devices, the BGP session between the peers would use the lower timer value. The BGP keepalive can be set as low as three seconds, and the hold-time in the order of tens of seconds. However, setting BGP timers aggressively less preferable because the protocol is process intensive.

In this scenario, BFD can help. BFD provides low-overhead link failure detection in a subsecond time interval. 


## Enabling BFD

BFD is configured by default under all the newly created ExpressRoute private peering interfaces on the MSEEs. Therefore, to enable BFD, you need to just configure BFD on your PEs. Configuring BFD is two-step process: you need configure the BFD on the interface and then link it to the BGP session.

An example PE (using Cisco IOS XE) configuration is shown below. 

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

>[!NOTE]
>To enable BFD under an already existing private peering; you need to reset the peering. See [Reset ExpressRoute peerings][ResetPeering]
>

## BFD Timer Negotiation

Between BFD peers, the slower of the two peers determine the transmission rate. MSEEs BFD transmission/receive intervals are set to 300 milliseconds. By configuring higher values, you can force these intervals to be longer; but, not shorter.

>[!NOTE]
>If you have configured Geo-redundant ExpressRoute private peering circuits or use Site-to-Site IPSec VPN connectivity as backup for ExpressRoute private peering; enabling BFD over the private peering would help failover quicker following an ExpressRoute connectivity failure. 
>

## Next Steps

For more information or help, check out the following links:

- [Create and modify an ExpressRoute circuit][CreateCircuit]
- [Create and modify routing for an ExpressRoute circuit][CreatePeering]

<!--Image References-->
[1]: ./media/expressroute-bfd/BFD_Need.png "BFD expedites link failure deduction time"

<!--Link References-->
[CreateCircuit]: https://docs.microsoft.com/azure/expressroute/expressroute-howto-circuit-portal-resource-manager 
[CreatePeering]: https://docs.microsoft.com/azure/expressroute/expressroute-howto-routing-portal-resource-manager
[ResetPeering]: https://docs.microsoft.com/en-us/azure/expressroute/expressroute-howto-reset-peering






