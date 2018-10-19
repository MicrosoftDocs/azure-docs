---
title: 'Interoperability of ExpressRoute, Site-to-site VPN, and VNet Peering - Data Plane Analysis: Azure Backend Connectivity Features Interoperability | Microsoft Docs'
description: This page provides the data plane analysis of the test setup that is created to analyze the interoperability of ExpressRoute, Site-to-site VPN, and VNet Peering features.
documentationcenter: na
services: networking
author: rambk
manager: tracsman

ms.service: expressroute,vpn-gateway,virtual-network
ms.topic: article
ms.workload: infrastructure-services
ms.date: 10/18/2018
ms.author: rambala

---

# Interoperability of ExpressRoute, Site-to-site VPN, and VNet-Peering - Data plane analysis

In this article, let's go through the data plane analysis of the test setup. To review the Test Setup, see the [Test Setup][Setup]. To review the Test Setup configuration detail, see [Test Setup Configuration][Configuration]. To review control plane analysis of the test setup, see [Control Plane Analysis][Control-Analysis].

Data plane analysis examines the path taken by packets traversing from one local network (LAN/VNet) to another within a topology. The data path between two local networks may not be necessarily symmetrical. Therefore, in this article let's analyze forwarding path from a local network to another separately from the reverse path.

##Data Path from Hub VNet

###Path to Spoke VNet

VNet peering emulates Network Bridge functionality between the two VNets that are peered. Traceroute output from a Hub VNet to a VM in the spoke VNet is listed below:

	C:\Users\rb>tracert 10.11.30.4

	Tracing route to 10.11.30.4 over a maximum of 30 hops

	  1     2 ms     1 ms     1 ms  10.11.30.4

	Trace complete.

The following screen clip is the graphical connection view of the Hub VNet and the spoke VNet presented by Azure Network Watcher:


[![1]][1]

###Path to Branch VNet

	C:\Users\rb>tracert 10.11.30.68

	Tracing route to 10.11.30.68 over a maximum of 30 hops

	  1     1 ms     1 ms     1 ms  10.10.30.142
	  2     *        *        *     Request timed out.
	  3     2 ms     2 ms     2 ms  10.11.30.68

	Trace complete.

In the above traceroute, the first hop is the VPN GW of the Hub VNet. The second hop is the VPN GW of the Branch VNet, whose IP address is not advertised within the Hub VNet. The third hop is the VM on the Branch VNet.

The following screen clip is the graphical connection view of the Hub VNet and the Branch VNet presented by Azure Network Watcher:

[![2]][2]

For the same connection, following screen clip is the grid view presented by Azure Network Watcher:

[![3]][3]

###Path to On-Premises Location-1

	C:\Users\rb>tracert 10.2.30.10

	Tracing route to 10.2.30.10 over a maximum of 30 hops

	  1     2 ms     2 ms     2 ms  10.10.30.132
	  2     *        *        *     Request timed out.
	  3     *        *        *     Request timed out.
	  4     2 ms     2 ms     2 ms  10.2.30.10

	Trace complete.

In the above traceroute, the first hop is the ExpressRoute GW tunnel endpoint to MSEE. The second and the third hop respectively are CE router and on-premises Location 1 LAN IPs, these IP addresses are not advertised within the Hub VNet. The fourth hop is the VM on the on-premises Location-1.


###Path to On-Premises Location-2

	C:\Users\rb>tracert 10.1.31.10

	Tracing route to 10.1.31.10 over a maximum of 30 hops

	  1    76 ms    75 ms    75 ms  10.10.30.134
	  2     *        *        *     Request timed out.
	  3     *        *        *     Request timed out.
	  4    75 ms    75 ms    75 ms  10.1.31.10

	Trace complete.

In the above traceroute, the first hop is the ExpressRoute GW tunnel endpoint to MSEE. The second and the third hop respectively are CE router and on-premises Location 2 LAN IPs, these IP addresses are not advertised within the Hub VNet. The fourth hop is the VM on the on-premises Location-2.

###Path to Remote VNet

	C:\Users\rb>tracert 10.17.30.4

	Tracing route to 10.17.30.4 over a maximum of 30 hops

	  1     2 ms     2 ms     2 ms  10.10.30.132
	  2     *        *        *     Request timed out.
	  3    69 ms    68 ms    69 ms  10.17.30.4

	Trace complete.

In the above traceroute, the first hop is the ExpressRoute GW tunnel endpoint to MSEE. The second hop is the Remote VNet’s GW IP. The second hop IP range is not advertised within the Hub VNet. The third hop is the VM on the Remote VNet.

##Data path from Spoke VNet

Recall that the Spoke VNet share the network view of the Hub VNet. Through VNet peering, the spoke VNet uses the remote gateway connectivity of the hub VNet as if they are directly connected to the spoke VNet.

###Path to Hub VNet

	C:\Users\rb>tracert 10.10.30.4

	Tracing route to 10.10.30.4 over a maximum of 30 hops

	  1    <1 ms    <1 ms    <1 ms  10.10.30.4

	Trace complete.

###Path to Branch VNet

	C:\Users\rb>tracert 10.11.30.68

	Tracing route to 10.11.30.68 over a maximum of 30 hops

	  1     1 ms    <1 ms    <1 ms  10.10.30.142
	  2     *        *        *     Request timed out.
	  3     3 ms     2 ms     2 ms  10.11.30.68

	Trace complete.

In the above traceroute, the first hop is the VPN GW of the Hub VNet. The second hop is the VPN GW of the Branch VNet, whose IP address is not advertised within the Hub/Spoke VNet. The third hop is the VM on the Branch VNet.

###Path to On-Premises Location-1

	C:\Users\rb>tracert 10.2.30.10

	Tracing route to 10.2.30.10 over a maximum of 30 hops

	  1    24 ms     2 ms     3 ms  10.10.30.132
	  2     *        *        *     Request timed out.
	  3     *        *        *     Request timed out.
	  4     3 ms     2 ms     2 ms  10.2.30.10

	Trace complete.

In the above traceroute, the first hop is the Hub VNet’s ExpressRoute GW tunnel endpoint to MSEE. The second and the third hop respectively are CE router and on-premises Location 1 LAN IPs, these IP addresses are not advertised within the Hub/Spoke VNet. The fourth hop is the VM on the on-premises Location-1.

###Path to On-Premises Location-2

	C:\Users\rb>tracert 10.2.30.10

	Tracing route to 10.2.30.10 over a maximum of 30 hops

	  1    24 ms     2 ms     3 ms  10.10.30.132
	  2     *        *        *     Request timed out.
	  3     *        *        *     Request timed out.
	  4     3 ms     2 ms     2 ms  10.2.30.10

	Trace complete.

In the above traceroute, the first hop is the Hub VNet’s ExpressRoute GW tunnel endpoint to MSEE. The second and the third hop respectively are CE router and on-premises Location 2 LAN IPs, these IP addresses are not advertised within the Hub/Spoke VNets. The fourth hop is the VM on the on-premises Location-2.

###Path to Remote VNet

	C:\Users\rb>tracert 10.17.30.4

	Tracing route to 10.17.30.4 over a maximum of 30 hops

	  1     2 ms     1 ms     1 ms  10.10.30.133
	  2     *        *        *     Request timed out.
	  3    71 ms    70 ms    70 ms  10.17.30.4

	Trace complete.

In the above traceroute, the first hop is the Hub VNet’s ExpressRoute GW tunnel endpoint to MSEE. The second hop is the Remote VNet’s GW IP. The second hop IP range is not advertised within the Hub/Spoke VNet. The third hop is the VM on the Remote VNet.

##Data path from Branch VNet

###Path to Hub VNet

	C:\Windows\system32>tracert 10.10.30.4

	Tracing route to 10.10.30.4 over a maximum of 30 hops

	  1    <1 ms    <1 ms    <1 ms  10.11.30.100
	  2     *        *        *     Request timed out.
	  3     4 ms     3 ms     3 ms  10.10.30.4

	Trace complete.

In the above traceroute, the first hop is the VPN GW of the Branch VNet. The second hop is the VPN GW of the Hub VNet, whose IP address is not advertised within the Remote VNet. The third hop is the VM on the Hub VNet.

###Path to Spoke VNet

	C:\Users\rb>tracert 10.11.30.4

	Tracing route to 10.11.30.4 over a maximum of 30 hops

	  1     1 ms    <1 ms     1 ms  10.11.30.100
	  2     *        *        *     Request timed out.
	  3     4 ms     3 ms     2 ms  10.11.30.4

	Trace complete.

In the above traceroute, the first hop is the VPN GW of the Branch VNet. The second hop is the VPN GW of the Hub VNet, whose IP address is not advertised within the Remote VNet, and the third hop is the VM on the Spoke VNet.

###Path to On-Premises Location-1

	C:\Users\rb>tracert 10.2.30.10

	Tracing route to 10.2.30.10 over a maximum of 30 hops

	  1     1 ms    <1 ms    <1 ms  10.11.30.100
	  2     *        *        *     Request timed out.
	  3     3 ms     2 ms     2 ms  10.2.30.125
	  4     *        *        *     Request timed out.
	  5     3 ms     3 ms     3 ms  10.2.30.10

	Trace complete.

In the above traceroute, the first hop is the VPN GW of the Branch VNet. The second hop is the VPN GW of the Hub VNet, whose IP address is not advertised within the Remote VNet. The third hop is the VPN tunnel termination point on the primary CE router. The fourth hop is an internal IP address of on-premises Location-1 LAN IP address that is not advertised out of CE router. The fifth hop is the destination VM on the on-premises Location-1.

###Path to On-Premises Location-2 and Remote VNet

As we discussed prior in the control plane analysis, the branch VNet has no visibility either to on-premises location-2 or to remote VNet per the network configuration. The following ping results confirm the fact. 

	C:\Users\rb>ping 10.1.31.10

	Pinging 10.1.31.10 with 32 bytes of data:

	Request timed out.
	...
	Request timed out.

	Ping statistics for 10.1.31.10:
	    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss),

	C:\Users\rb>ping 10.17.30.4

	Pinging 10.17.30.4 with 32 bytes of data:

	Request timed out.
	...
	Request timed out.

	Ping statistics for 10.17.30.4:
	    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss),

##Data path from On-Premises Location-1

###Path to Hub VNet

	C:\Users\rb>tracert 10.10.30.4

	Tracing route to 10.10.30.4 over a maximum of 30 hops

	  1    <1 ms    <1 ms    <1 ms  10.2.30.3
	  2    <1 ms    <1 ms    <1 ms  192.168.30.0
	  3    <1 ms    <1 ms    <1 ms  192.168.30.18
	  4     *        *        *     Request timed out.
	  5     2 ms     2 ms     2 ms  10.10.30.4

	Trace complete.

In the above traceroute, the first two hops are part of the On-Premises network. The third hop is the primary MSEE interface facing the CE router. The fourth hop is ExpressRoute G/W of the hub VNet, whose IP range is not advertised to the On-Premises network. The fifth hop is the destination VM.

The Azure Network Watcher provides only Azure-centric view. Therefore, for on-premises centric view we have used Azure Network Performance Monitor (NPM). NPM provides agents that can be installed servers in network outside Azure and do data-path analysis.

The following screen clip is the topology view of the on-premises location-1 VM connectivity to the VM on the hub VNet via ExpressRoute.

[![4]][4]

Recall, the test setup uses Site-to-Site VPN as backup connectivity for ExpressRoute between on-premises Location-1 and Hub VNet. To test back datapath, let’s induce an ExpressRoute link failure between on-premises Location-1 primary CE router and the corresponding MSEE by shutting down the CE interface facing the MSEE.

	C:\Users\rb>tracert 10.10.30.4

	Tracing route to 10.10.30.4 over a maximum of 30 hops

	  1    <1 ms    <1 ms    <1 ms  10.2.30.3
	  2    <1 ms    <1 ms    <1 ms  192.168.30.0
	  3     3 ms     2 ms     3 ms  10.10.30.4

	Trace complete.

The following screen clip is the topology view of the on-premises location-1 VM connectivity to the VM on the hub VNet via Site-to-Site VPN connectivity when the ExpressRoute connectivity is down.

[![5]][5]

###Path to Spoke VNet

Let us bring back the ExpressRoute primary connectivity to do the datapath analysis towards Spoke VNet.

	C:\Users\rb>tracert 10.11.30.4

	Tracing route to 10.11.30.4 over a maximum of 30 hops

	  1    <1 ms    <1 ms    <1 ms  10.2.30.3
	  2    <1 ms    <1 ms    <1 ms  192.168.30.0
	  3    <1 ms    <1 ms    <1 ms  192.168.30.18
	  4     *        *        *     Request timed out.
	  5     3 ms     2 ms     2 ms  10.11.30.4

	Trace complete.

Let us bring up the primary ExpressRoute-1 connectivity  for the rest of the datapath analysis.

###Path to Branch VNet

	C:\Users\rb>tracert 10.11.30.68

	Tracing route to 10.11.30.68 over a maximum of 30 hops

	  1    <1 ms    <1 ms    <1 ms  10.2.30.3
	  2    <1 ms    <1 ms    <1 ms  192.168.30.0
	  3     3 ms     2 ms     2 ms  10.11.30.68

	Trace complete.

###Path to On-Premises Location-2

As we discussed prior in the control plane analysis, the on-premises Location-1 has no visibility to on-premises location-2 per the network configuration. The following ping results confirm the fact. 

	C:\Users\rb>ping 10.1.31.10
	
	Pinging 10.1.31.10 with 32 bytes of data:

	Request timed out.
	...
	Request timed out.

	Ping statistics for 10.1.31.10:
	    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss),

###Path to Remote VNet

	C:\Users\rb>tracert 10.17.30.4

	Tracing route to 10.17.30.4 over a maximum of 30 hops

	  1    <1 ms    <1 ms    <1 ms  10.2.30.3
	  2     2 ms     5 ms     7 ms  192.168.30.0
	  3    <1 ms    <1 ms    <1 ms  192.168.30.18
	  4     *        *        *     Request timed out.
	  5    69 ms    70 ms    69 ms  10.17.30.4

	Trace complete.

##Data path from On-Premises Location-2

###Path to Hub VNet

	C:\Windows\system32>tracert 10.10.30.4

	Tracing route to 10.10.30.4 over a maximum of 30 hops

	  1    <1 ms    <1 ms    <1 ms  10.1.31.3
	  2    <1 ms    <1 ms    <1 ms  192.168.31.4
	  3    <1 ms    <1 ms    <1 ms  192.168.31.22
	  4     *        *        *     Request timed out.
	  5    75 ms    74 ms    74 ms  10.10.30.4

	Trace complete.

###Path to Spoke VNet

	C:\Windows\system32>tracert 10.11.30.4

	Tracing route to 10.11.30.4 over a maximum of 30 hops
	  1    <1 ms    <1 ms     1 ms  10.1.31.3
	  2    <1 ms    <1 ms    <1 ms  192.168.31.0
	  3    <1 ms    <1 ms    <1 ms  192.168.31.18
	  4     *        *        *     Request timed out.
	  5    75 ms    74 ms    74 ms  10.11.30.4

	Trace complete.

###Path to Branch VNet, On-Premises Location-1, and Remote VNet

As we discussed prior in the control plane analysis, the on-premises Location-1 has no visibility to branch VNet, on-premises location-1, and Remote VNet per the network configuration. 

##Data Path from Remote VNet

###Path to Hub VNet

	C:\Users\rb>tracert 10.10.30.4

	Tracing route to 10.10.30.4 over a maximum of 30 hops

	  1    65 ms    65 ms    65 ms  10.17.30.36
	  2     *        *        *     Request timed out.
	  3    69 ms    68 ms    68 ms  10.10.30.4

	Trace complete.

###Path to Spoke VNet

	C:\Users\rb>tracert 10.11.30.4

	Tracing route to 10.11.30.4 over a maximum of 30 hops

	  1    67 ms    67 ms    67 ms  10.17.30.36
	  2     *        *        *     Request timed out.
	  3    71 ms    69 ms    69 ms  10.11.30.4

	Trace complete.

### Path to Branch VNet and On-Premises Location-2

As we discussed prior in the control plane analysis, the remote VNet has no visibility to branch VNet, and to on-premises location-2 per the network configuration. 


### Path to On-Premises Location-1

	C:\Users\rb>tracert 10.2.30.10

	Tracing route to 10.2.30.10 over a maximum of 30 hops

	  1    67 ms    67 ms    67 ms  10.17.30.36
	  2     *        *        *     Request timed out.
	  3     *        *        *     Request timed out.
	  4    69 ms    69 ms    69 ms  10.2.30.10

	Trace complete.


## Further reading

### Using ExpressRoute and Site-to-Site VPN connectivity in tandem

####Site-to-Site VPN over ExpressRoute

Site-to-Site VPN can be configured over ExpressRoute Microsoft peering to privately exchange data between your on-premises network and your Azure VNets with confidentiality, anti-replay, authenticity, and integrity. For more information regarding how to configure Site-to-Site IPSec VPN in tunnel mode over ExpressRoute Microsoft peering, see [Site-to-site VPN over ExpressRoute Microsoft-peering][S2S-Over-ExR]. 

The major limitation of configuring S2S VPN over Microsoft peering is the throughput. Throughput over the IPSec tunnel is limited by the VPN GW capacity. The VPN GW throughput is less compared to ExpressRoute throughput. In such scenarios, using the IPSec tunnel for high secure traffic and private peering for all other traffic would help optimize the ExpressRoute bandwidth utilization.

#### Site-to-Site VPN as a secure failover path for ExpressRoute
ExpressRoute is offered as redundant circuit pair to ensure high availability. You can configure geo-redundant ExpressRoute connectivity in different Azure regions. Also as done in our test setup, within a given Azure region, if you want a failover path for your ExpressRoute connectivity, you can do so using Site-to-Site VPN. When the same prefixes are advertised over both ExpressRoute and S2S VPN, Azure prefers ExpressRoute over S2S VPN. To avoid asymmetrical routing between ExpressRoute and S2S VPN, on-premises network configuration should also reciprocate preferring ExpressRoute over S2S VPN connectivity.

For more information regarding how to configure ExpressRoute and Site-to-Site VPN coexisting connections, see [ExpressRoute and Site-to-Site Coexistence][ExR-S2S-CoEx].

### Extending Backend Connectivity to spoke VNets and branch Locations

#### Spoke VNet connectivity using VNet peering

Hub-and-spoke Vnet architecture is widely used. The hub is a virtual network (VNet) in Azure that acts as a central point of connectivity between your spoke VNets and to your on-premises network. The spokes are VNets that peer with the hub and can be used to isolate workloads. Traffic flows between the on-premises datacenter and the hub through an ExpressRoute or VPN connection. For further details about the architecture, see [Hub-and-Spoke Architecture][Hub-n-Spoke]

VNet peering within a region allows spoke VNets to use hub VNet gateways (both VPN and ExpressRoute gateways) to communicate with remote networks.

#### Branch VNet connectivity using Site-to-Site VPN

If you want branch Vnets (in different regions) and on-premises networks communicate with each other via a hub vnet, the native Azure solution is site-to-site VPN connectivity using VPN. An alternative option is to use an NVA for routing in the hub.

For configuring VPN gateways, see [Configuring VPN Gateway][VPN]. For deploying highly available NVA, see [Deploy highly available NVA][Deploy-NVA].

## Next steps

To learn how many ExpressRoute circuits you can connect to an ExpressRoute Gateway, or how many ExpressRoute Gateways you can connect to an ExpressRoute circuit, or to learn other scale limits of ExpressRoute, see [ExpressRoute FAQ][ExR-FAQ]


<!--Image References-->
[1]: ./media/backend-interoperability/HubVM-SpkVM.jpg "Network Watcher view of connectivity from Hub VNet to Spoke VNet"
[2]: ./media/backend-interoperability/HubVM-BranchVM.jpg "Network Watcher view of connectivity from Hub VNet to Branch VNet"
[3]: ./media/backend-interoperability/HubVM-BranchVM-Grid.jpg "Network Watcher grid view of connectivity from Hub VNet to Branch VNet"
[4]: ./media/backend-interoperability/Loc1-HubVM.jpg "Network Performance Monitor view of connectivity from Location-1 VM to Hub VNet via ExpressRoute 1"
[5]: ./media/backend-interoperability/Loc1-HubVM-S2S.jpg "Network Performance Monitor view of connectivity from Location-1 VM to Hub VNet via S2S VPN"

<!--Link References-->
[Setup]: https://docs.microsoft.com/azure/networking/connectivty-interoperability-preface
[Configuration]: https://docs.microsoft.com/azure/networking/connectivty-interoperability-config
[ExpressRoute]: https://docs.microsoft.com/azure/expressroute/expressroute-introduction
[VPN]: https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways
[VNet]: https://docs.microsoft.com/azure/virtual-network/tutorial-connect-virtual-networks-portal
[Configuration]: https://docs.microsoft.com/azure/networking/connectivty-interoperability-configuration
[Control-Analysis]:https://docs.microsoft.com/azure/networking/connectivty-interoperability-control-plane
[Data-Analysis]: https://docs.microsoft.com/azure/networking/connectivty-interoperability-data-plane
[ExR-FAQ]: https://docs.microsoft.com/azure/expressroute/expressroute-faqs
[S2S-Over-ExR]: https://docs.microsoft.com/azure/expressroute/site-to-site-vpn-over-microsoft-peering
[ExR-S2S-CoEx]: https://docs.microsoft.com/azure/expressroute/expressroute-howto-coexist-resource-manager
[Hub-n-Spoke]: https://docs.microsoft.com/azure/architecture/reference-architectures/hybrid-networking/hub-spoke
[Deploy-NVA]: https://docs.microsoft.com/azure/architecture/reference-architectures/dmz/nva-ha
[VNet-Config]: https://docs.microsoft.com/azure/virtual-network/virtual-network-manage-peering




