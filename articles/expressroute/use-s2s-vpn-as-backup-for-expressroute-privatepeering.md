---
title: 'Using S2S VPN as a backup for Azure ExpressRoute Private Peering | Microsoft Docs'
description: This page provides architectural recommendations for backing up Azure ExpressRoute private peering with S2S VPN.
services: networking
author: duongau
ms.service: expressroute
ms.topic: how-to
ms.date: 12/27/2022
ms.author: duau 
ms.custom: devx-track-azurepowershell
---

# Using S2S VPN as a backup for ExpressRoute private peering

In the article titled [Designing for disaster recovery with ExpressRoute private peering][DR-PP], we discussed the need for a backup connectivity solution when using ExpressRoute private peering. We also discussed how to use geo-redundant ExpressRoute circuits for high-availability. In this article, we'll explain how to use and maintain a site-to-site (S2S) VPN as a backup for ExpressRoute private peering. 

Unlike geo-redundant ExpressRoute circuits, you can only use ExpressRoute and VPN disaster recovery combination in an active-passive setup. A major challenge of using any backup network connectivity in the passive mode is that the passive connection would often fail alongside the primary connection. The common reason for the failures of the passive connection is lack of active maintenance. Therefore, in this article, the focus is on how to verify and actively maintain a S2S VPN connectivity that is backing up an ExpressRoute private peering.

> [!NOTE] 
> When a given route is advertised through both ExpressRoute and VPN, Azure will prefer routing over ExpressRoute.  
>

In this article, you'll also learn how to verify the connectivity from both the Azure perspective and the on-premises network edge side. The ability to validate from either side will help irrespective of whether or not you manage the on-premises network devices that peer with the Microsoft network entities. 

## Example topology

In our setup, we have an on-premises network connected to an Azure hub VNet via both an ExpressRoute circuit and a S2S VPN connection. The Azure hub VNet is in turn peered to a spoke VNet, as shown in the diagram:

![1][1]

In the setup, the ExpressRoute circuit is terminated on a pair of customer edge (CE) routers at the on-premises. The on-premises LAN is connected to the CE routers with a pair of firewalls that operate in leader-follower mode. The S2S VPN is directly terminated on the firewalls.

The following table lists the key IP prefixes of the topology:

| **Entity** | **Prefix** |
| --- | --- |
| On-premises LAN | 10.1.11.0/25 |
| Azure Hub VNet | 10.17.11.0/25 |
| Azure spoke VNet | 10.17.11.128/26 |
| On-premises test server | 10.1.11.10 |
| Spoke VNet test VM | 10.17.11.132 |
| ExpressRoute primary connection p2p subnet | 192.168.11.16/30 |
| ExpressRoute secondary connection p2p subnet | 192.168.11.20/30 |
| VPN gateway primary BGP peer IP | 10.17.11.76 |
| VPN gateway secondary BGP peer IP | 10.17.11.77 |
| On-premises firewall VPN BGP peer IP | 192.168.11.88 |
| Primary CE router i/f towards firewall IP | 192.168.11.0/31 |
| Firewall i/f towards primary CE router IP | 192.168.11.1/31 |
| Secondary CE router i/f towards firewall IP | 192.168.11.2/31 |
| Firewall i/f towards secondary CE router IP | 192.168.11.3/31 |

The following table lists the ASNs of the topology:

| **Autonomous system** | **ASN** |
| --- | --- |
| On-premises | 65020 |
| Microsoft Enterprise Edge | 12076 |
| Virtual Network GW (ExR) | 65515 |
| Virtual Network GW (VPN) | 65515 |

## High availability without asymmetricity

### Configuring for high availability

[Configure ExpressRoute and Site-to-Site coexisting connections][Conf-CoExist] discusses how to configure coexisting ExpressRoute and S2S VPN connections. As we discussed in [Designing for high availability with ExpressRoute][HA], to improve ExpressRoute high availability, our setup maintains network redundancy to avoid a single point of failure all the way up to the endpoints. Also, both the primary and secondary connections of the ExpressRoute circuits are configured to operate in an active-active setup by advertising the on-premises prefixes the same way through both the connections. 

The on-premises route advertisement of the primary CE router through the primary connection of the ExpressRoute circuit is shown as follows (Junos commands):

```console
user@SEA-MX03-01> show route advertising-protocol bgp 192.168.11.18 

Cust11.inet.0: 8 destinations, 8 routes (7 active, 0 holddown, 1 hidden)
  Prefix                  Nexthop              MED     Lclpref    AS path
* 10.1.11.0/25            Self                                    I
```

The on-premises route advertisement of the secondary CE router through the secondary connection of the ExpressRoute circuit is shown as follows (Junos commands):

```console
user@SEA-MX03-02> show route advertising-protocol bgp 192.168.11.22 

Cust11.inet.0: 8 destinations, 8 routes (7 active, 0 holddown, 1 hidden)
  Prefix                  Nexthop              MED     Lclpref    AS path
* 10.1.11.0/25            Self                                    I
```

To improve the high availability of the backup connection, the S2S VPN is also configured in the active-active mode. The Azure VPN gateway configuration is shown as follows. Note as part of the VPN configuration VPN the BGP peer IP addresses of the gateway--10.17.11.76 and 10.17.11.77--are also listed.

![2][2]

The on-premises route is advertised by the firewalls to the primary and secondary BGP peers of the VPN gateway. The route advertisements are shown as follows (Junos):

```console
user@SEA-SRX42-01> show route advertising-protocol bgp 10.17.11.76 

Cust11.inet.0: 14 destinations, 21 routes (14 active, 0 holddown, 0 hidden)
  Prefix                  Nexthop              MED     Lclpref    AS path
* 10.1.11.0/25            Self                                    I

{primary:node0}
user@SEA-SRX42-01> show route advertising-protocol bgp 10.17.11.77    

Cust11.inet.0: 14 destinations, 21 routes (14 active, 0 holddown, 0 hidden)
  Prefix                  Nexthop              MED     Lclpref    AS path
* 10.1.11.0/25            Self                                    I
```

> [!NOTE] 
> Configuring the S2S VPN in active-active mode not only provides high-availability to your disaster recovery backup network connectivity, but also provides higher throughput for the backup connectivity. Therefore, configuring S2S VPN in active-active mode is recommended as it will create multiple underlying tunnels.
>

### Configuring for symmetric traffic flow

We noted that when a given on-premises route is advertised through both ExpressRoute and S2S VPN, Azure would prefer the ExpressRoute path. To force Azure to prefer S2S VPN path over the coexisting ExpressRoute, you need to advertise more specific routes (longer prefix with bigger subnet mask) through the VPN connection. Our objective is to use the VPN connections as backup only. So, the default path selection behavior of Azure is in-line with our objective. 

It is our responsibility to ensure that the traffic destined to Azure from on-premises also prefers ExpressRoute path over the Site-to-site VPN. The default local preference of the CE routers and firewalls in our on-premises setup is 100. So, by configuring the local preference of the routes that are received through the ExpressRoute private peerings greater than 100, we can make the traffic that is destined for Azure prefer the ExpressRoute circuit.

The BGP configuration of the primary CE router that terminates the primary connection of the ExpressRoute circuit is shown as follows. Note the value of the local preference of the routes advertised over the iBGP session is configured to be 150. Similarly, we need to ensure the local preference of the secondary CE router that terminates the secondary connection of the ExpressRoute circuit is also configured to be 150.

```console
user@SEA-MX03-01> show configuration routing-instances Cust11
description "Customer 11 VRF";
instance-type virtual-router;
interface xe-0/0/0:0.110;
interface ae0.11;
protocols {
  bgp {
    group ibgp {
        type internal;
        local-preference 150;
        neighbor 192.168.11.1;
    }
    group ebgp {
        peer-as 12076;
        bfd-liveness-detection {
            minimum-interval 300;
            multiplier 3;
        }
        neighbor 192.168.11.18;
    }
  }
}
```

The routing table of the on-premises firewalls confirms that for the on-premises traffic that is destined to Azure the preferred path is over ExpressRoute in the steady state.

```console
user@SEA-SRX42-01> show route table Cust11.inet.0 10.17.11.0/24

Cust11.inet.0: 14 destinations, 21 routes (14 active, 0 holddown, 0 hidden)
+ = Active Route, - = Last Active, * = Both

10.17.11.0/25      *[BGP/170] 2d 00:34:04, localpref 150
                      AS path: 12076 I, validation-state: unverified
                    > to 192.168.11.0 via reth1.11
                      to 192.168.11.2 via reth2.11
                    [BGP/170] 2d 00:34:01, localpref 150
                      AS path: 12076 I, validation-state: unverified
                     > to 192.168.11.2 via reth2.11
                    [BGP/170] 2d 21:12:13, localpref 100, from 10.17.11.76
                       AS path: 65515 I, validation-state: unverified
                    > via st0.118
                    [BGP/170] 2d 00:41:51, localpref 100, from 10.17.11.77
                       AS path: 65515 I, validation-state: unverified
                     > via st0.119
10.17.11.76/32     *[Static/5] 2d 21:12:16
                     > via st0.118
10.17.11.77/32     *[Static/5] 2d 00:41:56
                    > via st0.119
10.17.11.128/26    *[BGP/170] 2d 00:34:04, localpref 150
                       AS path: 12076 I, validation-state: unverified
                     > to 192.168.11.0 via reth1.11
                       to 192.168.11.2 via reth2.11
                    [BGP/170] 2d 00:34:01, localpref 150
                      AS path: 12076 I, validation-state: unverified
                     > to 192.168.11.2 via reth2.11
                    [BGP/170] 2d 21:12:13, localpref 100, from 10.17.11.76
                       AS path: 65515 I, validation-state: unverified
                    > via st0.118
                     [BGP/170] 2d 00:41:51, localpref 100, from 10.17.11.77
                       AS path: 65515 I, validation-state: unverified
                     > via st0.119
```

In the above route table, for the hub and spoke VNet routes--10.17.11.0/25 and 10.17.11.128/26--we see ExpressRoute circuit is preferred over VPN connections. The 192.168.11.0 and 192.168.11.2 are IPs on firewall interface towards CE routers.

## Validation of route exchange over S2S VPN

Earlier in this article, we verified on-premises route advertisement of the firewalls to the primary and secondary BGP peers of the VPN gateway. Additionally, let's confirm Azure routes received by the firewalls from the primary and secondary BGP peers of the VPN gateway.

```console
user@SEA-SRX42-01> show route receive-protocol bgp 10.17.11.76 table Cust11.inet.0 

Cust11.inet.0: 14 destinations, 21 routes (14 active, 0 holddown, 0 hidden)
  Prefix                  Nexthop              MED     Lclpref    AS path
  10.17.11.0/25           10.17.11.76                             65515 I
  10.17.11.128/26         10.17.11.76                             65515 I

{primary:node0}
user@SEA-SRX42-01> show route receive-protocol bgp 10.17.11.77 table Cust11.inet.0    

Cust11.inet.0: 14 destinations, 21 routes (14 active, 0 holddown, 0 hidden)
  Prefix                  Nexthop              MED     Lclpref    AS path
  10.17.11.0/25           10.17.11.77                             65515 I
  10.17.11.128/26         10.17.11.77                             65515 I
```

Similarly let's verify for on-premises network route prefixes received by the Azure VPN gateway. 

```powershell
PS C:\Users\user> Get-AzVirtualNetworkGatewayLearnedRoute -ResourceGroupName SEA-Cust11 -VirtualNetworkGatewayName SEA-Cust11-VNet01-gw-vpn | where {$_.Network -eq "10.1.11.0/25"} | select Network, NextHop, AsPath, Weight

Network      NextHop       AsPath      Weight
-------      -------       ------      ------
10.1.11.0/25 192.168.11.88 65020        32768
10.1.11.0/25 10.17.11.76   65020        32768
10.1.11.0/25 10.17.11.69   12076-65020  32769
10.1.11.0/25 10.17.11.69   12076-65020  32769
10.1.11.0/25 192.168.11.88 65020        32768
10.1.11.0/25 10.17.11.77   65020        32768
10.1.11.0/25 10.17.11.69   12076-65020  32769
10.1.11.0/25 10.17.11.69   12076-65020  32769
```

As seen previously, the VPN gateway has routes received both by the primary and secondary BGP peers of the VPN gateway. It also has visibility over the routes received via primary and secondary ExpressRoute connections (the ones with AS-path prepended with 12076). To confirm the routes received via VPN connections, we need to know the on-premises BGP peer IP of the connections. In our setup under consideration, the IP is 192.168.11.88 and we do see the routes received from it.

Next, let's verify the routes advertised by the Azure VPN gateway to the on-premises firewall BGP peer (192.168.11.88).

```powershell
PS C:\Users\user> Get-AzVirtualNetworkGatewayAdvertisedRoute -Peer 192.168.11.88 -ResourceGroupName SEA-Cust11 -VirtualNetworkGatewayName SEA-Cust11-VNet01-gw-vpn |  select Network, NextHop, AsPath, Weight

Network         NextHop     AsPath Weight
-------         -------     ------ ------
10.17.11.0/25   10.17.11.76 65515       0
10.17.11.128/26 10.17.11.76 65515       0
10.17.11.0/25   10.17.11.77 65515       0
10.17.11.128/26 10.17.11.77 65515       0
```

Failure to see route exchanges indicate connection failure. See [Troubleshooting: An Azure site-to-site VPN connection can't connect and stops working][VPN Troubleshoot] for help with troubleshooting the VPN connection.

## Testing failover

Now that we have confirmed successful route exchanges over the VPN connection (control plane), we're set to switch traffic (data plane) from the ExpressRoute connectivity to the VPN connectivity. 

>[!NOTE] 
>In production environments failover testing has to be done during scheduled network maintenance work-window as it can be service disruptive.
>

Prior to do the traffic switch, let's trace route the current path in our setup from the on-premises test server to the test VM in the spoke VNet.

```console
C:\Users\PathLabUser>tracert 10.17.11.132

Tracing route to 10.17.11.132 over a maximum of 30 hops

  1    <1 ms    <1 ms    <1 ms  10.1.11.1
  2    <1 ms    <1 ms    11 ms  192.168.11.0
  3    <1 ms    <1 ms    <1 ms  192.168.11.18
  4     *        *        *     Request timed out.
  5     6 ms     6 ms     5 ms  10.17.11.132

Trace complete.
```

The primary and secondary ExpressRoute point-to-point connection subnets of our setup are, respectively, 192.168.11.16/30 and 192.168.11.20/30. In the above trace route, in step 3 we see that we're hitting 192.168.11.18, which is the interface IP of the primary MSEE. Presence of MSEE interface confirms that as expected our current path is over the ExpressRoute.

As reported in the [Reset ExpressRoute circuit peerings][RST], let's use the following PowerShell commands to disable both the primary and secondary peering of the ExpressRoute circuit.

```powershell
$ckt = Get-AzExpressRouteCircuit -Name "expressroute name" -ResourceGroupName "SEA-Cust11"
$ckt.Peerings[0].State = "Disabled"
Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt
```

The failover switch time depends on the BGP convergence time. In our setup, the failover switch takes a few seconds (less than 10). After the switch, repeat of the traceroute shows the following path:

```console
C:\Users\PathLabUser>tracert 10.17.11.132

Tracing route to 10.17.11.132 over a maximum of 30 hops

  1    <1 ms    <1 ms    <1 ms  10.1.11.1
  2     *        *        *     Request timed out.
  3     6 ms     7 ms     9 ms  10.17.11.132

Trace complete.
```

The traceroute result confirms that the backup connection via S2S VPN is active and can provide service continuity if both the primary and secondary ExpressRoute connections fail. To complete the failover testing, let's enable the ExpressRoute connections back and normalize the traffic flow, using the following set of commands.

```powershell
$ckt = Get-AzExpressRouteCircuit -Name "expressroute name" -ResourceGroupName "SEA-Cust11"
$ckt.Peerings[0].State = "Enabled"
Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt
```

To confirm the traffic is switched back to ExpressRoute, repeat the traceroute and ensure that it's going through the ExpressRoute private peering.

## Next steps

ExpressRoute is designed for high availability with no single point of failure within the Microsoft network. Still an ExpressRoute circuit is confined to a single geographical region and to a service provider. S2S VPN can be a good disaster recovery passive backup solution to an ExpressRoute circuit. For a dependable passive backup connection solution, regular maintenance of the passive configuration and periodical validation the connection are important. It's essential not to let the VPN configuration become stale, and to periodically (say every quarter) repeat the validation and failover test steps described in this article during maintenance window.

To enable monitoring and alerts based on VPN gateway metrics, see [Set up alerts on VPN Gateway metrics][VPN-alerts].

To expedite BGP convergence following an ExpressRoute failure, [Configure BFD over ExpressRoute][BFD].

<!--Image References-->
[1]: ./media/use-s2s-vpn-as-backup-for-expressroute-privatepeering/topology.png "topology under consideration"
[2]: ./media/use-s2s-vpn-as-backup-for-expressroute-privatepeering/vpn-gw-config.png "VPN GW configuration"

<!--Link References-->
[DR-PP]: ./designing-for-disaster-recovery-with-expressroute-privatepeering.md
[Conf-CoExist]: ./expressroute-howto-coexist-resource-manager.md
[HA]: ./designing-for-high-availability-with-expressroute.md
[VPN Troubleshoot]: ../vpn-gateway/vpn-gateway-troubleshoot-site-to-site-cannot-connect.md
[VPN-alerts]: ../vpn-gateway/vpn-gateway-howto-setup-alerts-virtual-network-gateway-metric.md
[BFD]: ./expressroute-bfd.md
[RST]: ./expressroute-howto-reset-peering.md
