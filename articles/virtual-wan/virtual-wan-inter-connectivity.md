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

In this article, you learn about the various connection options available today to connect multiple Virtual WAN environments.

## IPSec tunnels using virtual network gateways

In this option users can simply provision Azure Virtual Network Gateways on each vhub in each vWAN environment to connect both vWANs together. It's important to note that today you cannot change the vWAN virtual Network Gateway ASN, which is 65515. This is hardcoded inside the vhub gateway config. At a later date, there should be an option to change the virtual network gateway ASN. For this reason, you cannot do BGP over IPSEC due to BGP loop prevention and seeing its own ASN in the path. The remote vhub will receive routes from the source vhub with 65515 in the AS-PATH and BGP will drop that. Therefore, if you want to connect two different vWAN environments, the tunnels need to be static, no BGP option. The other thing to note is max throughput you can get per tunnel is around 2.4Gbps, and this is an SDN limitation. This can be increased by adding more tunnels.

## SDWan tunnels with BGP+IPSEC inside the vHubs

This option is good for users who are already running their own SDWAN devices today to connect to on-prem WAN links or don't need the extra bandwidth of Express-Route. Deploying SDWan partner devices in each respective vhub to build the connections between vWans, users can run BGP over IPSEC to make the connectivity. In order to make the routing work, inside the SDWAN operating system, it's necessary to do "AS-Path Replace or AS-Path Exclude" BGP commands for the vhub 65520 and Route Server 65515 ASNs. The command for example would be "as-path exclude 65520 65515" or similar depending on the vendor. You would then need to apply that inbound route-map to each BGP peer. That way, the remote vWAN vhub won't drop the route, because it won't see its own ASN in the path. This is the same behavior is option 1, except here we have the ability to do BGP manipulation on third party devices unlike the Azure Virtual Network Gateways. The SDWANs can use different ASNs and do eBGP, or they could also be the same ASN and have an iBGP session.

## SDWan Tunnels with BGP+IPSEC with SDWan devices BGP peered in spokes

This would be the similar to option 3, except we have the SDWAN device in a spoke vnet that is vnet peered to each vhub. We then would BGP peer the SDWAN device to the Route Server instances inside the vhub. This is a good for scenarios where users have SDWAN devices that cannot be deployed inside vhubs, but still support BGP. Like above, we need to apply inbound route-maps to each SDWan device and do the "same as-path exclude or as-path replace on both 65520 and 65515 ASNs" so the receiving end does not drop the routes.