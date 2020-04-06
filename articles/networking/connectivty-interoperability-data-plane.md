---
title: 'Interoperability in Azure : Data plane analysis'
description: This article provides the data plane analysis of the test setup you can use to analyze interoperability between ExpressRoute, a site-to-site VPN, and virtual network peering in Azure.
documentationcenter: na
services: networking
author: rambk
manager: tracsman

ms.service: virtual-network
ms.topic: article
ms.workload: infrastructure-services
ms.date: 10/18/2018
ms.author: rambala

---

# Interoperability in Azure : Data plane analysis

This article describes the data plane analysis of the [test setup][Setup]. You can also review the [test setup configuration][Configuration] and the [control plane analysis][Control-Analysis] of the test setup.

Data plane analysis examines the path taken by packets that traverse from one local network (LAN or virtual network) to another within a topology. The data path between two local networks isn't necessarily symmetrical. Therefore, in this article, we analyze a forwarding path from a local network to another network that's separate from the reverse path.

## Data path from the hub VNet

### Path to the spoke VNet

Virtual network (VNet) peering emulates network bridge functionality between the two VNets that are peered. Traceroute output from a hub VNet to a VM in the spoke VNet is shown here:

    C:\Users\rb>tracert 10.11.30.4

    Tracing route to 10.11.30.4 over a maximum of 30 hops

      1     2 ms     1 ms     1 ms  10.11.30.4

    Trace complete.

The following figure shows the graphical connection view of the hub VNet and the spoke VNet from the perspective of Azure Network Watcher:


![1][1]

### Path to the branch VNet

Traceroute output from a hub VNet to a VM in the branch VNet is shown here:

    C:\Users\rb>tracert 10.11.30.68

    Tracing route to 10.11.30.68 over a maximum of 30 hops

      1     1 ms     1 ms     1 ms  10.10.30.142
      2     *        *        *     Request timed out.
      3     2 ms     2 ms     2 ms  10.11.30.68

    Trace complete.

In this traceroute, the first hop is the VPN gateway in Azure VPN Gateway of the hub VNet. The second hop is the VPN gateway of the branch VNet. The IP address of the VPN gateway of the branch VNet isn't advertised in the hub VNet. The third hop is the VM on the branch VNet.

The following figure shows the graphical connection view of the hub VNet and the branch VNet from the perspective of Network Watcher:

![2][2]

For the same connection, the following figure shows the grid view in Network Watcher:

![3][3]

### Path to on-premises Location 1

Traceroute output from a hub VNet to a VM in on-premises Location 1 is shown here:

    C:\Users\rb>tracert 10.2.30.10

    Tracing route to 10.2.30.10 over a maximum of 30 hops

      1     2 ms     2 ms     2 ms  10.10.30.132
      2     *        *        *     Request timed out.
      3     *        *        *     Request timed out.
      4     2 ms     2 ms     2 ms  10.2.30.10

    Trace complete.

In this traceroute, the first hop is the Azure ExpressRoute gateway tunnel endpoint to a Microsoft Enterprise Edge Router (MSEE). The second and third hops are the customer edge (CE) router and the on-premises Location 1 LAN IPs. These IP addresses aren't advertised in the hub VNet. The fourth hop is the VM in the on-premises Location 1.


### Path to on-premises Location 2

Traceroute output from a hub VNet to a VM in on-premises Location 2 is shown here:

    C:\Users\rb>tracert 10.1.31.10

    Tracing route to 10.1.31.10 over a maximum of 30 hops

      1    76 ms    75 ms    75 ms  10.10.30.134
      2     *        *        *     Request timed out.
      3     *        *        *     Request timed out.
      4    75 ms    75 ms    75 ms  10.1.31.10

    Trace complete.

In this traceroute, the first hop is the ExpressRoute gateway tunnel endpoint to an MSEE. The second and third hops are the CE router and the on-premises Location 2 LAN IPs. These IP addresses aren't advertised in the hub VNet. The fourth hop is the VM on the on-premises Location 2.

### Path to the remote VNet

Traceroute output from a hub VNet to a VM in the remote VNet is shown here:

    C:\Users\rb>tracert 10.17.30.4

    Tracing route to 10.17.30.4 over a maximum of 30 hops

      1     2 ms     2 ms     2 ms  10.10.30.132
      2     *        *        *     Request timed out.
      3    69 ms    68 ms    69 ms  10.17.30.4

    Trace complete.

In this traceroute, the first hop is the ExpressRoute gateway tunnel endpoint to an MSEE. The second hop is the remote VNet's gateway IP. The second hop IP range isn't advertised in the hub VNet. The third hop is the VM on the remote VNet.

## Data path from the spoke VNet

The spoke VNet shares the network view of the hub VNet. Through VNet peering, the spoke VNet uses the remote gateway connectivity of the hub VNet as if it's directly connected to the spoke VNet.

### Path to the hub VNet

Traceroute output from the spoke VNet to a VM in the hub VNet is shown here:

    C:\Users\rb>tracert 10.10.30.4

    Tracing route to 10.10.30.4 over a maximum of 30 hops

      1    <1 ms    <1 ms    <1 ms  10.10.30.4

    Trace complete.

### Path to the branch VNet

Traceroute output from the spoke VNet to a VM in the branch VNet is shown here:

    C:\Users\rb>tracert 10.11.30.68

    Tracing route to 10.11.30.68 over a maximum of 30 hops

      1     1 ms    <1 ms    <1 ms  10.10.30.142
      2     *        *        *     Request timed out.
      3     3 ms     2 ms     2 ms  10.11.30.68

    Trace complete.

In this traceroute, the first hop is the VPN gateway of the hub VNet. The second hop is the VPN gateway of the branch VNet. The IP address of the VPN gateway of the branch VNet isn't advertised within the hub/spoke VNet. The third hop is the VM on the branch VNet.

### Path to on-premises Location 1

Traceroute output from the spoke VNet to a VM in on-premises Location 1 is shown here:

    C:\Users\rb>tracert 10.2.30.10

    Tracing route to 10.2.30.10 over a maximum of 30 hops

      1    24 ms     2 ms     3 ms  10.10.30.132
      2     *        *        *     Request timed out.
      3     *        *        *     Request timed out.
      4     3 ms     2 ms     2 ms  10.2.30.10

    Trace complete.

In this traceroute, the first hop is the hub VNet's ExpressRoute gateway tunnel endpoint to an MSEE. The second and third hops are the CE router and the on-premises Location 1 LAN IPs. These IP addresses aren't advertised in the hub/spoke VNet. The fourth hop is the VM in the on-premises Location 1.

### Path to on-premises Location 2

Traceroute output from the spoke VNet to a VM in on-premises Location 2 is shown here:


    C:\Users\rb>tracert 10.1.31.10

    Tracing route to 10.1.31.10 over a maximum of 30 hops

      1    76 ms    75 ms    76 ms  10.10.30.134
      2     *        *        *     Request timed out.
      3     *        *        *     Request timed out.
      4    75 ms    75 ms    75 ms  10.1.31.10

    Trace complete.

In this traceroute, the first hop is the hub VNet's ExpressRoute gateway tunnel endpoint to an MSEE. The second and third hops are the CE router and the on-premises Location 2 LAN IPs. These IP addresses aren't advertised in the hub/spoke VNets. The fourth hop is the VM in the on-premises Location 2.

### Path to the remote VNet

Traceroute output from the spoke VNet to a VM in the remote VNet is shown here:

    C:\Users\rb>tracert 10.17.30.4

    Tracing route to 10.17.30.4 over a maximum of 30 hops

      1     2 ms     1 ms     1 ms  10.10.30.133
      2     *        *        *     Request timed out.
      3    71 ms    70 ms    70 ms  10.17.30.4

    Trace complete.

In this traceroute, the first hop is the hub VNet's ExpressRoute gateway tunnel endpoint to an MSEE. The second hop is the remote VNet's gateway IP. The second hop IP range isn't advertised in the hub/spoke VNet. The third hop is the VM on the remote VNet.

## Data path from the branch VNet

### Path to the hub VNet

Traceroute output from the branch VNet to a VM in the hub VNet is shown here:

    C:\Windows\system32>tracert 10.10.30.4

    Tracing route to 10.10.30.4 over a maximum of 30 hops

      1    <1 ms    <1 ms    <1 ms  10.11.30.100
      2     *        *        *     Request timed out.
      3     4 ms     3 ms     3 ms  10.10.30.4

    Trace complete.

In this traceroute, the first hop is the VPN gateway of the branch VNet. The second hop is the VPN gateway of the hub VNet. The IP address of the VPN gateway of the hub VNet isn't advertised in the remote VNet. The third hop is the VM on the hub VNet.

### Path to the spoke VNet

Traceroute output from the branch VNet to a VM in the spoke VNet is shown here:

    C:\Users\rb>tracert 10.11.30.4

    Tracing route to 10.11.30.4 over a maximum of 30 hops

      1     1 ms    <1 ms     1 ms  10.11.30.100
      2     *        *        *     Request timed out.
      3     4 ms     3 ms     2 ms  10.11.30.4

    Trace complete.

In this traceroute, the first hop is the VPN gateway of the branch VNet. The second hop is the VPN gateway of the hub VNet. The IP address of the VPN gateway of the hub VNet isn't advertised in the remote VNet. The third hop is the VM on the spoke VNet.

### Path to on-premises Location 1

Traceroute output from the branch VNet to a VM in on-premises Location 1 is shown here:

    C:\Users\rb>tracert 10.2.30.10

    Tracing route to 10.2.30.10 over a maximum of 30 hops

      1     1 ms    <1 ms    <1 ms  10.11.30.100
      2     *        *        *     Request timed out.
      3     3 ms     2 ms     2 ms  10.2.30.125
      4     *        *        *     Request timed out.
      5     3 ms     3 ms     3 ms  10.2.30.10

    Trace complete.

In this traceroute, the first hop is the VPN gateway of the branch VNet. The second hop is the VPN gateway of the hub VNet. The IP address of the VPN gateway of the hub VNet isn't advertised in the remote VNet. The third hop is the VPN tunnel termination point on the primary CE router. The fourth hop is an internal IP address of on-premises Location 1. This LAN IP address isn't advertised outside the CE router. The fifth hop is the destination VM in the on-premises Location 1.

### Path to on-premises Location 2 and the remote VNet

As we discussed in the control plane analysis, the branch VNet has no visibility either to on-premises Location 2 or to the remote VNet per the network configuration. The following ping results confirm: 

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

## Data path from on-premises Location 1

### Path to the hub VNet

Traceroute output from on-premises Location 1 to a VM in the hub VNet is shown here:

    C:\Users\rb>tracert 10.10.30.4

    Tracing route to 10.10.30.4 over a maximum of 30 hops

      1    <1 ms    <1 ms    <1 ms  10.2.30.3
      2    <1 ms    <1 ms    <1 ms  192.168.30.0
      3    <1 ms    <1 ms    <1 ms  192.168.30.18
      4     *        *        *     Request timed out.
      5     2 ms     2 ms     2 ms  10.10.30.4

    Trace complete.

In this traceroute, the first two hops are part of the on-premises network. The third hop is the primary MSEE interface that faces the CE router. The fourth hop is the ExpressRoute gateway of the hub VNet. The IP range of the ExpressRoute gateway of the hub VNet isn't advertised to the on-premises network. The fifth hop is the destination VM.

Network Watcher provides only an Azure-centric view. For an on-premises perspective, we use Azure Network Performance Monitor. Network Performance Monitor provides agents that you can install on servers in networks outside Azure for data path analysis.

The following figure shows the topology view of the on-premises Location 1 VM connectivity to the VM on the hub VNet via ExpressRoute:

![4][4]

As discussed earlier, the test setup uses a site-to-site VPN as backup connectivity for ExpressRoute between the on-premises Location 1 and the hub VNet. To test the backup data path, let's induce an ExpressRoute link failure between the on-premises Location 1 primary CE router and the corresponding MSEE. To induce an ExpressRoute link failure, shut down the CE interface that faces the MSEE:

    C:\Users\rb>tracert 10.10.30.4

    Tracing route to 10.10.30.4 over a maximum of 30 hops

      1    <1 ms    <1 ms    <1 ms  10.2.30.3
      2    <1 ms    <1 ms    <1 ms  192.168.30.0
      3     3 ms     2 ms     3 ms  10.10.30.4

    Trace complete.

The following figure shows the topology view of the on-premises Location 1 VM connectivity to the VM on the hub VNet via site-to-site VPN connectivity when ExpressRoute connectivity is down:

![5][5]

### Path to the spoke VNet

Traceroute output from on-premises Location 1 to a VM in the spoke VNet is shown here:

Let's bring back the ExpressRoute primary connectivity to do the data path analysis toward the spoke VNet:

    C:\Users\rb>tracert 10.11.30.4

    Tracing route to 10.11.30.4 over a maximum of 30 hops

      1    <1 ms    <1 ms    <1 ms  10.2.30.3
      2    <1 ms    <1 ms    <1 ms  192.168.30.0
      3    <1 ms    <1 ms    <1 ms  192.168.30.18
      4     *        *        *     Request timed out.
      5     3 ms     2 ms     2 ms  10.11.30.4

    Trace complete.

Bring up the primary ExpressRoute 1 connectivity for the remainder of the data path analysis.

### Path to the branch VNet

Traceroute output from on-premises Location 1 to a VM in the branch VNet is shown here:

    C:\Users\rb>tracert 10.11.30.68

    Tracing route to 10.11.30.68 over a maximum of 30 hops

      1    <1 ms    <1 ms    <1 ms  10.2.30.3
      2    <1 ms    <1 ms    <1 ms  192.168.30.0
      3     3 ms     2 ms     2 ms  10.11.30.68

    Trace complete.

### Path to on-premises Location 2

As we discuss in the [control plane analysis][Control-Analysis], the on-premises Location 1 has no visibility to on-premises Location 2 per the network configuration. The following ping results confirm: 

    C:\Users\rb>ping 10.1.31.10
    
    Pinging 10.1.31.10 with 32 bytes of data:

    Request timed out.
    ...
    Request timed out.

    Ping statistics for 10.1.31.10:
        Packets: Sent = 4, Received = 0, Lost = 4 (100% loss),

### Path to the remote VNet

Traceroute output from on-premises Location 1 to a VM in the remote VNet is shown here:

    C:\Users\rb>tracert 10.17.30.4

    Tracing route to 10.17.30.4 over a maximum of 30 hops

      1    <1 ms    <1 ms    <1 ms  10.2.30.3
      2     2 ms     5 ms     7 ms  192.168.30.0
      3    <1 ms    <1 ms    <1 ms  192.168.30.18
      4     *        *        *     Request timed out.
      5    69 ms    70 ms    69 ms  10.17.30.4

    Trace complete.

## Data path from on-premises Location 2

### Path to the hub VNet

Traceroute output from on-premises Location 2 to a VM in the hub VNet is shown here:

    C:\Windows\system32>tracert 10.10.30.4

    Tracing route to 10.10.30.4 over a maximum of 30 hops

      1    <1 ms    <1 ms    <1 ms  10.1.31.3
      2    <1 ms    <1 ms    <1 ms  192.168.31.4
      3    <1 ms    <1 ms    <1 ms  192.168.31.22
      4     *        *        *     Request timed out.
      5    75 ms    74 ms    74 ms  10.10.30.4

    Trace complete.

### Path to the spoke VNet

Traceroute output from on-premises Location 2 to a VM in the spoke VNet is shown here:

    C:\Windows\system32>tracert 10.11.30.4

    Tracing route to 10.11.30.4 over a maximum of 30 hops
      1    <1 ms    <1 ms     1 ms  10.1.31.3
      2    <1 ms    <1 ms    <1 ms  192.168.31.0
      3    <1 ms    <1 ms    <1 ms  192.168.31.18
      4     *        *        *     Request timed out.
      5    75 ms    74 ms    74 ms  10.11.30.4

    Trace complete.

### Path to the branch VNet, on-premises Location 1, and the remote VNet

As we discuss in the [control plane analysis][Control-Analysis], the on-premises Location 1 has no visibility to the branch VNet, to on-premises Location 1, or to the remote VNet per the network configuration. 

## Data path from the remote VNet

### Path to the hub VNet

Traceroute output from the remote VNet to a VM in the hub VNet is shown here:

    C:\Users\rb>tracert 10.10.30.4

    Tracing route to 10.10.30.4 over a maximum of 30 hops

      1    65 ms    65 ms    65 ms  10.17.30.36
      2     *        *        *     Request timed out.
      3    69 ms    68 ms    68 ms  10.10.30.4

    Trace complete.

### Path to the spoke VNet

Traceroute output from the remote VNet to a VM in the spoke VNet is shown here:

    C:\Users\rb>tracert 10.11.30.4

    Tracing route to 10.11.30.4 over a maximum of 30 hops

      1    67 ms    67 ms    67 ms  10.17.30.36
      2     *        *        *     Request timed out.
      3    71 ms    69 ms    69 ms  10.11.30.4

    Trace complete.

### Path to the branch VNet and on-premises Location 2

As we discuss in the [control plane analysis][Control-Analysis], the remote VNet has no visibility to the branch VNet or to on-premises Location 2 per the network configuration. 

### Path to on-premises Location 1

Traceroute output from the remote VNet to a VM in on-premises Location 1 is shown here:

    C:\Users\rb>tracert 10.2.30.10

    Tracing route to 10.2.30.10 over a maximum of 30 hops

      1    67 ms    67 ms    67 ms  10.17.30.36
      2     *        *        *     Request timed out.
      3     *        *        *     Request timed out.
      4    69 ms    69 ms    69 ms  10.2.30.10

    Trace complete.


## ExpressRoute and site-to-site VPN connectivity in tandem

###  Site-to-site VPN over ExpressRoute

You can configure a site-to-site VPN by using ExpressRoute Microsoft peering to privately exchange data between your on-premises network and your Azure VNets. With this configuration, you can exchange data with confidentiality, authenticity, and integrity. The data exchange also is anti-replay. For more information about how to configure a site-to-site IPsec VPN in tunnel mode by using ExpressRoute Microsoft peering, see [Site-to-site VPN over ExpressRoute Microsoft peering][S2S-Over-ExR]. 

The primary limitation of configuring a site-to-site VPN that uses Microsoft peering is throughput. Throughput over the IPsec tunnel is limited by the VPN gateway capacity. The VPN gateway throughput is lower than ExpressRoute throughput. In this scenario, using the IPsec tunnel for highly secure traffic and using private peering for all other traffic helps optimize the ExpressRoute bandwidth utilization.

### Site-to-site VPN as a secure failover path for ExpressRoute

ExpressRoute serves as a redundant circuit pair to ensure high availability. You can configure geo-redundant ExpressRoute connectivity in different Azure regions. Also, as demonstrated in our test setup, within an Azure region, you can use a site-to-site VPN to create a failover path for your ExpressRoute connectivity. When the same prefixes are advertised over both ExpressRoute and a site-to-site VPN, Azure prioritizes ExpressRoute. To avoid asymmetrical routing between ExpressRoute and the site-to-site VPN, on-premises network configuration should also reciprocate by using ExpressRoute connectivity before it uses site-to-site VPN connectivity.

For more information about how to configure coexisting connections for ExpressRoute and a site-to-site VPN, see [ExpressRoute and site-to-site coexistence][ExR-S2S-CoEx].

## Extend back-end connectivity to spoke VNets and branch locations

### Spoke VNet connectivity by using VNet peering

Hub and spoke VNet architecture is widely used. The hub is a VNet in Azure that acts as a central point of connectivity between your spoke VNets and to your on-premises network. The spokes are VNets that peer with the hub, and which you can use to isolate workloads. Traffic flows between the on-premises datacenter and the hub through an ExpressRoute or VPN connection. For more information about the architecture, see [Implement a hub-spoke network topology in Azure][Hub-n-Spoke].

In VNet peering within a region, spoke VNets can use hub VNet gateways (both VPN and ExpressRoute gateways) to communicate with remote networks.

### Branch VNet connectivity by using site-to-site VPN

You might want branch VNets, which are in different regions, and on-premises networks to communicate with each other via a hub VNet. The native Azure solution for this configuration is site-to-site VPN connectivity by using a VPN. An alternative is to use a network virtual appliance (NVA) for routing in the hub.

For more information, see [What is VPN Gateway?][VPN] and [Deploy a highly available NVA][Deploy-NVA].


## Next steps

See the [ExpressRoute FAQ][ExR-FAQ] to:
-   Learn how many ExpressRoute circuits you can connect to an ExpressRoute gateway.
-   Learn how many ExpressRoute gateways you can connect to an ExpressRoute circuit.
-   Learn about other scale limits of ExpressRoute.


<!--Image References-->
[1]: ./media/backend-interoperability/HubVM-SpkVM.jpg "Network Watcher view of connectivity from a hub VNet to a spoke VNet"
[2]: ./media/backend-interoperability/HubVM-BranchVM.jpg "Network Watcher view of connectivity from a hub VNet to a branch VNet"
[3]: ./media/backend-interoperability/HubVM-BranchVM-Grid.jpg "Network Watcher grid view of connectivity from a hub VNet to a branch VNet"
[4]: ./media/backend-interoperability/Loc1-HubVM.jpg "Network Performance Monitor view of connectivity from the Location 1 VM to the hub VNet via ExpressRoute 1"
[5]: ./media/backend-interoperability/Loc1-HubVM-S2S.jpg "Network Performance Monitor view of connectivity from the Location 1 VM to the hub VNet via a site-to-site VPN"

<!--Link References-->
[Setup]: https://docs.microsoft.com/azure/networking/connectivty-interoperability-preface
[Configuration]: https://docs.microsoft.com/azure/networking/connectivty-interoperability-configuration
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


