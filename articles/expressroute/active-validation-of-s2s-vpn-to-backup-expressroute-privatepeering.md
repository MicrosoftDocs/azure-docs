---
title: 'Leveraging S2S VPN to backup Azure ExpressRoute Private Peering | Microsoft Docs'
description: This page provides architectural recommendations for backing up Azure ExpressRoute private peering with S2S VPN.
documentationcenter: na
services: networking
author: rambk
manager: tracsman

ms.service: expressroute
ms.topic: article
ms.workload: infrastructure-services
ms.date: 02/05/2020
ms.author: rambala

---

# Active validation of S2S VPN to backup ExpressRoute private peering

In the article titled [Designing for disaster recovery with ExpressRoute private peering][DR-PP], we discussed the need for backup connectivity solution for an ExpressRoute private peering connectivity and how to use geo-redundant ExpressRoute circuits for the purpose. In this article, let us consider leveraging site-to-site (S2S) VPN to backup ExpressRoute private peering. 

Unlike geo-redundant ExpressRoute circuits, you can use ExpressRoute-VPN combination only in active-passive mode. One of the major drawbacks of using any backup network connectivity in the passive mode is that the passive connection would often fail alongside the primary connection because of lack of active validation and maintance of the passive connection. Therefore, in this article let's focus on how to validate and actively maintain S2S VPN connectivity that is backing an ExpressRoute private peering.

>[!NOTE] When a given route is advertised via both ExpressRoute and VPN, Azure would prefer routing over ExpressRoute.  
>

In this article, let's see how to validate the connectivity both from the Azure perspective and from the perspective of the network equipments that peer with the Microsoft edge devices. This would enable you to do the validation irrespective of if you have a Layer 2 or Layer 3 network service provider. 

## Example Topology

Let's consider the following topology for our discussion. In our setup, we have an on-premises network connected to an Azure hub Vnet and in turn to a spoke Vnet peered to the hub Vnet via both an ExpressRoute circuit and a S2S VPN connection.  

[![1]][1]

In the setup, the ExpressRoute circuit is terminated on a pair of "Customer Edge" (CE) routers at the on-premises. The on-premises LAN is connected to the CE routers via a pair of firewalls that operate in master-slave mode. The S2S VPN is directly terminated on the firewalls.

## High availability and avoiding asymmetric traffic

### Configuring for high availability

[Configure ExpressRoute and Site-to-Site coexisting connections][Conf-CoExist] discusses how to configure the coexisting ExpressRoute circuit and S2S VPN connections. To improve high availability, as we discussed in [Designing for high availability with ExpressRoute][HA], our setup maintains the network redundancy (avoids single point of failure) all the way up to the endpoints. Also both the primary and secondary connections of the ExpressRoute circuits are configured to operate in active-active mode by advertsing the on-premises route prefixes the same way through both the connections. 

The on-premises route advertisement of the primary CE router through the primary connection of the ExpressRoute circuit is show below (Junos commands):

    rambala@SEA-MX03-01> show route advertising-protocol bgp 192.168.11.18 

    Cust11.inet.0: 8 destinations, 8 routes (7 active, 0 holddown, 1 hidden)
      Prefix                  Nexthop              MED     Lclpref    AS path
    * 10.1.11.0/25            Self                                    I

The on-premises route advertisement of the secondary CE router through the secondary connection of the ExpressRoute circuit is show below (Junos commands):

    rambala@SEA-MX03-02> show route advertising-protocol bgp 192.168.11.22 

    Cust11.inet.0: 8 destinations, 8 routes (7 active, 0 holddown, 1 hidden)
      Prefix                  Nexthop              MED     Lclpref    AS path
    * 10.1.11.0/25            Self                                    I

To improve the high availability of the backup connection, the S2S VPN is also configured in the active-active mode. The Azure VPN gateway configuration is shown below. Note as part of the configuration VPN tunnels' BGP peer IP addresses of the gateway is also listed.

[![2]][2]

The on-premises route advertisement of the firewalls to the primary and secondary BGP peers of the VPN gateway is shown below (Junos):

   rambala@SEA-SRX42-01> show route advertising-protocol bgp 10.17.11.76 

    Cust11.inet.0: 14 destinations, 21 routes (14 active, 0 holddown, 0 hidden)
      Prefix                  Nexthop              MED     Lclpref    AS path
    * 10.1.11.0/25            Self                                    I

    {primary:node0}
    rambala@SEA-SRX42-01> show route advertising-protocol bgp 10.17.11.77    

    Cust11.inet.0: 14 destinations, 21 routes (14 active, 0 holddown, 0 hidden)
      Prefix                  Nexthop              MED     Lclpref    AS path
    * 10.1.11.0/25            Self                                    I

>[!NOTE] Configuring the S2S VPN in active-active mode not only provides high-availability to your disaster recovery backup network connectivity, but also provides higher throughput to the backup connectivity. In other words, configuring S2S VPN in active-active mode force create multiple underlying tunnels.
>

### Configuring for symmetric traffic flow

We noted that when a given route is advertised via both ExpressRoute and VPN, Azure would prefer routing over ExpressRoute. To force Azure route over VPN instead of the coexisting ExpressRoute, you need to advertise more specic routes over the VPN connection. Our objective here is to use the VPN connections as back only. So, the default route selection behavior of Azure works for us. 

It is our responsibility to ensure that the traffic destined to Azure also prefers ExpressRoute circuit over VPN. The default local preference of the CE routers and firewalls in our on-premises setup is 100. So, by configuring the local preference of the routes received through the ExpressRoute private peerings greater than 100 (say 150), we can make the traffic destined to Azure prefer ExpressRoute circuit.

The bgp configuration of the primary CE router that terminates the primary connection of the ExpressRoute circuit is shown below. Pay particular attention to local preference configured to 150. Similarly, we need to ensure the local preference of the secondary CE router that terminates the secondary connection of the ExpressRoute circuit is also configured to be 150.

    rambala@SEA-MX03-01> show configuration routing-instances Cust11 
    description "Customer 11 VRF";
    instance-type virtual-router;
    interface xe-0/0/0:0.110;
    interface ae0.11;
    protocols {
      bgp {
        group ibgp {
            type internal;
            local-preference 150;
            export nhs-vnet;
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

Let's ensure that per our configuration for Azure destined traffic ExpressRoute circuit is preferred over VPN by looking at the route table of the firewall.

    rambala@SEA-SRX42-01> show route table Cust11.inet.0 10.17.11.0/24    

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

In the above route table, for the hub and spoke Vnet routes--10.17.11.0/25 and 10.17.11.128/26--we see ExpressRoute circuit is prefered over VPN connections. The 192.168.11.0 and 192.168.11.2 are IPs on firewall interface towards CE routers.

## Validation and maintanence of backup VPN

Earlier in this article, we verified on-premises route advertisement of the firewalls to the primary and secondary BGP peers of the VPN gateway. Additionally, let's confirm Azure route received by the firewalls from the primary and secondary BGP peers of the VPN gateway.

    rambala@SEA-SRX42-01> show route receive-protocol bgp 10.17.11.76 table Cust11.inet.0 

    Cust11.inet.0: 14 destinations, 21 routes (14 active, 0 holddown, 0 hidden)
      Prefix                  Nexthop              MED     Lclpref    AS path
      10.17.11.0/25           10.17.11.76                             65515 I
      10.17.11.128/26         10.17.11.76                             65515 I

    {primary:node0}
    rambala@SEA-SRX42-01> show route receive-protocol bgp 10.17.11.77 table Cust11.inet.0    

    Cust11.inet.0: 14 destinations, 21 routes (14 active, 0 holddown, 0 hidden)
      Prefix                  Nexthop              MED     Lclpref    AS path
      10.17.11.0/25           10.17.11.77                             65515 I
      10.17.11.128/26         10.17.11.77                             65515 I

Similarly let's verify for on-premises route received by the Azure VPN gateway. 

    PS C:\Users\rambala> Get-AzVirtualNetworkGatewayLearnedRoute -ResourceGroupName SEA-Cust11 -VirtualNetworkGatewayName SEA-Cust11-VNet01-gw-vpn | where {$_.Network -eq "10.1.11.0/25"} | select Network, NextHop, AsPath, Weight

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

As seen above, the VPN gateway has routes received both by the primary and secondary BGP peers of the VPN gateway. It also has visibility over the routes received via primary and secondary ExpressRoute conections (the ones with AS-path prepended with 12076). To confirm the routes received via VPN connections, we need to know the on-premises BGP peer IP of the connections. In our setup under consideration it is 192.168.11.88 and we do see the routes received from it.

Next, let's verify the routes advertised to on-premises by the Azure VPN gateway.

    PS C:\Users\rambala> Get-AzVirtualNetworkGatewayAdvertisedRoute -Peer 192.168.11.88 -ResourceGroupName SEA-Cust11 -VirtualNetworkGatewayName SEA-Cust11-VNet01-gw-vpn |  select Network, NextHop, AsPath, Weight

    Network         NextHop     AsPath Weight
    -------         -------     ------ ------
    10.17.11.0/25   10.17.11.76 65515       0
    10.17.11.128/26 10.17.11.76 65515       0
    10.17.11.0/25   10.17.11.77 65515       0
    10.17.11.128/26 10.17.11.77 65515       0


Failure to see route exchanges indicate connection failure. See [Troubleshooting: An Azure site-to-site VPN connection cannot connect and stops working][VPN Troubleshoot] for help with troubleshooting the VPN connection.

Now that we have confirmed successful route exchanges over the VPN connection, we are set to do a failover from the ExpressRoute connectivity and test the dataplane of the VPN connectivity. 

>[!NOTE] In production environments failover testing has to be done during well notified network maintenance work-windows as they can be service disruptive.
>

Prior to do the failover, let's trace route the current path in our setup from an on-premises server and a VM in the spoke Vnet.

    C:\Users\PathLabUser>tracert 10.17.11.132

    Tracing route to 10.17.11.132 over a maximum of 30 hops

      1    <1 ms    <1 ms    <1 ms  10.1.11.1
      2    <1 ms    <1 ms    11 ms  192.168.11.0
      3    <1 ms    <1 ms    <1 ms  192.168.11.18
      4     *        *        *     Request timed out.
      5     6 ms     6 ms     5 ms  10.17.11.132

    Trace complete.

The primary and secondary ExpressRoute connection subnets of our setup are, respectively, 192.168.11.16/30 and 192.168.11.20/30. In the above trace route, in step 3 we see that we are hitting 192.168.11.18, which is the interface IP of the primary MSEE. This confirm that as expected our current path is over the ExpressRoute.

Let's use the following set of commands to disable both the primary and secondary ExpressRoute connections.

    $ckt = Get-AzExpressRouteCircuit -Name "expressroute name" -ResourceGroupName "SEA-Cust11"
    $ckt.Peerings[0].State = "Disabled"
    Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt

The failover time depends on the BGP convergence time. In our setup, the failover takes a few seconds (less than 10). Following, the failover, repeat of the traceroute shows the following:

    C:\Users\PathLabUser>tracert 10.17.11.132

    Tracing route to 10.17.11.132 over a maximum of 30 hops

      1    <1 ms    <1 ms    <1 ms  10.1.11.1
      2     *        *        *     Request timed out.
      3     6 ms     7 ms     9 ms  10.17.11.132

    Trace complete.

This confirms that the backup connection is active and can provide service continuity in the event of both the primary and secondary ExpressRoute connections failure. Let's enable the ExpressRoute connections and switch the traffic over using the following set of commands.

    $ckt = Get-AzExpressRouteCircuit -Name "expressroute name" -ResourceGroupName "SEA-Cust11"
    $ckt.Peerings[0].State = "Enabled"
    Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt

To confirm traffic it switched over, repeat the traceroute and ensure that it is going through one of the ExpressRoute connections.

## Next steps

The secret of maintaining the passive backup connection is not to let the VPN configuration stale and periodically (say every quarter) repeat the validation steps described in this article during maintenance window.

To enable monitoring and alerts based on VPN gateway metrics, see [Set up alerts on VPN Gateway metrics][VPN-alerts].

To expedite BGP convergence following an ExpressRoute failure, [Configure BFD over ExpressRoute][BFD].

<!--Image References-->
[1]: ./media/active-validation-of-s2s-vpn-to-backup-expressroute-private-peering/topology.png "topology under consideration"
[2]: ./media/active-validation-of-s2s-vpn-to-backup-expressroute-private-peering/vpn-gw-config.png "VPN GW configuration"

<!--Link References-->
[DR-PP]: https://docs.microsoft.com/azure/expressroute/designing-for-disaster-recovery-with-expressroute-privatepeering
[Conf-CoExist]: https://docs.microsoft.com/azure/expressroute/expressroute-howto-coexist-resource-manager
[HA]: https://docs.microsoft.com/azure/expressroute/designing-for-high-availability-with-expressroute
[VPN Troubleshoot]: https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-troubleshoot-site-to-site-cannot-connect
[VPN-alerts]: https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-howto-setup-alerts-virtual-network-gateway-metric
[BFD]: https://docs.microsoft.com/azure/expressroute/expressroute-bfd



