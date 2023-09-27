---
title: Troubleshoot Azure Route Server issues
description: Learn how to troubleshoot some of the common Azure Route Server issues.
author: halkazwini
ms.author: halkazwini
ms.service: route-server
ms.topic: how-to
ms.date: 09/15/2023
---

# Troubleshoot Azure Route Server issues

Learn how to troubleshoot some of the common Azure Route Server issues.

## Connectivity issues

### Why does my network virtual appliance (NVA) lose internet connectivity after it advertises the default route (0.0.0.0/0) to Azure Route Server?

When your NVA advertises the default route, Azure Route Server programs it for all the virtual machines (VMs) in the virtual network including the NVA itself. This default route sets the NVA as the next hop for all internet-bound traffic. If your NVA needs internet connectivity, you need to configure a user-defined route (UDR) to override this default route from the NVA and attach the UDR to the subnet where the NVA is hosted. Otherwise, the NVA host machine keeps sending the internet-bound traffic including the one sent by the NVA back to the NVA itself. For more information, see [user-defined routes](../virtual-network/virtual-networks-udr-overview.md#user-defined).

| Route | Next hop |
|-------|----------|
| 0.0.0.0/0 | Internet |

### Why does the NVA lose its connectivity to the Azure Route Server after forcing all traffic to a firewall using a user-defined route (UDR) on the GatewaySubnet?

If you want to inspect your on-premises traffic using a firewall, you can force all on-premises traffic to the firewall using a user-defined route (UDR) on the GatewaySubnet (a route table associated to the GatewaySubnet that has the UDR). However, this UDR may break the communication between the Route Server and the gateway by forcing their control plane traffic (BGP) to the firewall (this issue occurs if you're inspecting the traffic destined to the virtual network that has the Route Server). To avoid this issue, you need to add another UDR to the GatewaySubnet route table to exclude control plane traffic from being forced to the firewall (in case adding a BGP rule to the firewall is not desired/possible):

| Route | Next hop |
|-------|----------|
| 10.0.0.0/16 | 10.0.2.1 |
| 10.0.1.0/27 | VirtualNetwork |

10.0.0.0/16 is the address space of the virtual network and 10.0.1.0/27 is the address space of RouteServerSubnet. 10.0.2.1 is the IP address of the firewall.

### Why can't I TCP ping from my NVA to the BGP peer IP of the Azure Route Server after I set up the BGP peering between them?

In some NVAs, you need to add a static route to the Azure Route Server subnet to be able to TCP ping the Route Server from the NVA and to avoid BGP peering flapping. For example, if Azure Route Server is in 10.0.255.0/27 and your NVA is in 10.0.1.0/24, you need to add the following route to the routing table in the NVA:

| Route | Next hop |
|-------|----------|
| 10.0.255.0/27 | 10.0.1.1 |

10.0.1.1 is the default gateway IP in the subnet where your NVA (or more precisely, one of the NICs) is hosted.

### Why do I lose connectivity to my on-premises network over ExpressRoute and/or Azure VPN when I'm deploying Azure Route Server to a virtual network that already has ExpressRoute gateway and/or Azure VPN gateway?

When you deploy Azure Route Server to a virtual network, we need to update the control plane between the gateways and the virtual network. During this update, there's a period of time when the VMs in the virtual network lose connectivity to the on-premises network. We strongly recommend that you schedule maintenance to deploy Azure Route Server in your production environment.  

## Control plane issues

### Why does my on-premises network connected to Azure VPN gateway not receive the default route advertised by Azure Route Server?

Although Azure VPN gateway can receive the default route from its BGP peers including Azure Route Server, it [doesn't advertise the default route](../vpn-gateway/vpn-gateway-vpn-faq.md#what-address-prefixes-will-azure-vpn-gateways-advertise-to-me) to other peers. 

### Why does my NVA not receive routes from Azure Route Server even though the BGP peering is up?

The ASN that Azure Route Server uses is 65515. Make sure you configure a different ASN for your NVA so that an “eBGP” session can be established between your NVA and Azure Route Server so route propagation can happen automatically. Make sure you enable "multi-hop" in your BGP configuration because your NVA and Azure Route Server are in different subnets in the virtual network.

### The BGP peering between my NVA and Azure Route Server is up. I can see routes exchanged correctly between them. Why aren’t the NVA routes in the effective routing table of my VM? 

* If your VM is in the same virtual network as your NVA and Azure Route Server:

     Azure Route Server exposes two BGP peer IPs, which are hosted on two VMs that share the responsibility of sending the routes to all other VMs running in your virtual network. Each NVA must set up two identical BGP sessions (for example, use the same AS number, the same AS path and advertise the same set of routes) to the two VMs so that your VMs in the virtual network can get consistent routing info from Azure Route Server.

    :::image type="content" source="./media/troubleshoot-route-server/network-virtual-appliances.png" alt-text="Diagram showing a network virtual appliance (NVA) with Azure Route Server.":::

    If you have two or more instances of the NVA, you *can* advertise different AS paths for the same route from different NVA instances if you want to designate one NVA instance as active and the other passive.

* If your VM is in a different virtual network than the one that hosts your NVA and Azure Route Server. Check if VNet Peering is enabled between the two VNets *and* if Use Remote Route Server is enabled on your VM's virtual network.

### Why is the Equal-Cost Multi-Path (ECMP) function of my ExpressRoute turned off after I deploy Azure Route Server to the virtual network?

When you advertise the same routes from your on-premises network to Azure over multiple ExpressRoute connections, normally ECMP is enabled by default for the traffic destined for these routes from Azure back to your on-premises network. However, after the route server is deployed, the multiple-path information is lost in the BGP exchange between ExpressRoute and Azure Route Server, and consequently traffic from Azure will traverse only on one of the ExpressRoute connections.

## Next step

To learn how to create and configure Azure Route Server, see:

> [!div class="nextstepaction"]
> [Create and configure Azure Route Server](quickstart-configure-route-server-portal.md)