---
title: Virtual WAN to Virtual WAN connectivity
description: This article describes HTTP header protocols that Front Door supports.
author: halkazwini
ms.author: halkazwini
ms.service: azure-virtual-wan
ms.topic: how-to
ms.date: 03/24/2025
---

# Virtual WAN to Virtual WAN connectivity options

In this article, you learn about the various connection options available to connect multiple Virtual WAN environments.

## IPsec tunnels using virtual network gateways

In this option, you can provision a virtual network gateway in each virtual hub of your virtual WAN environment to connect virtual WANs together.

Because the virtual network gateway ASN is always 65515, you can't have BGP over IPsec due to BGP loop prevention mechanism as the remote virtual hub will receive routes from the source virtual hub with 65515 in the AS-PATH and BGP will drop that. Therefore, if you want to connect two different virtual WANs, the tunnels must use static routing.

This option is good for you if you want to connect two virtual WANs together and don't need the extra bandwidth of ExpressRoute, but it has the following limitations:

- No BGP support
- Max throughput per tunnel is 2.4 Gbps, depending on ciphers. You can add more tunnels to achieve higher throughput.

## SD-WAN tunnels with BGP+IPsec inside the virtual Hubs

This option is good for you if you're already running your own SD-WAN devices to connect to on-premises WAN links or don't need the extra bandwidth of ExpressRoute. By deploying an SD-WAN partner device in each respective virtual hub to connect virtual WANs, you can run BGP over IPsec for these connections.

In order to make the routing work, you must use "AS-Path Replace" or "AS-Path Exclude" BGP commands in your SD-WAN devices for the virtual hub 65520 and Route Server 65515 ASNs. The command for example would be "as-path exclude 65520 65515" or similar depending on the vendor. You would then need to apply that inbound route-map to each BGP peer. That way, the remote virtual WAN virtual hub won't drop the route, because it won't see its own ASN in the path. This is the same behavior is option 1, except here we have the ability to do BGP manipulation on third party devices unlike the Azure Virtual Network Gateways. The SD-WANs can use different ASNs and do eBGP, or they could also be the same ASN and have an iBGP session.

## SD-WAN Tunnels with BGP+IPSEC with SD-WAN devices BGP peered in spokes

This would be the similar to option 3, except we have the SD-WAN device in a spoke VNet that is VNet peered to each virtual hub. We then would BGP peer the SD-WAN device to the Route Server instances inside the virtual hub. This is a good for scenarios where users have SD-WAN devices that cannot be deployed inside virtual hubs, but still support BGP. Like above, we need to apply inbound route-maps to each SD-WAN device and do the "same as-path exclude or as-path replace on both 65520 and 65515 ASNs" so the receiving end does not drop the routes.