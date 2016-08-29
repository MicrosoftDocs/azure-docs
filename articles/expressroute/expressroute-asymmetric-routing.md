<properties
   pageTitle="Asymmetric routing | Microsoft Azure"
   description="This article walks you through the issues a customer might face with asymmetric routing in a network that has multiple links to a destination."
   documentationCenter="na"
   services="expressroute"
   authors="osamazia"
   manager="carmonm"
   editor=""/>
<tags
   ms.service="expressroute"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="08/23/2016"
   ms.author="osamazia"/>

# Asymmetric routing with multiple network paths

This article explains how forward and return network traffic can take different routes when multiple paths are available between source and destination.

It's important to understand two concepts to understand asymmetric routing. One is the effect of multiple network paths. The other is how devices keep state, like in firewalls. These devices are called stateful devices. A combination of these two factors creates scenarios in which network traffic is dropped by a stateful device because the stateful device didn't detect that traffic originated with the device itself.

## Multiple network paths

When an enterprise network has only one link to the Internet through their Internet service provider, all traffic to and from the Internet travels the same path. Often, companies purchase multiple circuits, as redundant paths, to improve network uptime. When this happens, it's possible that traffic that goes outside of the network, to the Internet, goes through one link, and the return traffic goes through a different link. This is commonly known as asymmetric routing. In asymmetric routing, reverse network traffic takes a different path from the original flow.

![Network with multiple paths](./media/expressroute-asymmetric-routing/AsymmetricRouting3.png)

Although primarily for the Internet, asymmetric routing also applies to other combinations of multiple paths. It applies, for example, both to an Internet path and a private path that go to the same destination, and to multiple private paths that go to the same destination.

Each router along the way, from source to destination, computes the best path to reach a destination. The router's determination of best possible path is based on two main factors:

-	Routing between external networks is based on a routing protocol, Border Gateway Protocol (BGP). BGP takes advertisements from neighbors and runs them through a series of steps to determine the best path to the intended destination. It installs the best path in its routing table.
-	The length of subnet mask associated with a route. If BGP receives multiple advertisements for the same IP address but with different subnet masks, BGP prefers the advertisement with a longer subnet mask because it's considered a more specific route.

## Stateful devices

Routers look at the IP header of a packet for routing purposes. Some devices look even deeper inside the packet. Typically, these devices look at Layer4 (Transmission Control Protocol, or TCP; and User Datagram Protocol, or UDP) or even Layer7 (Application Layer) headers. These devices are either security devices or bandwidth-optimization devices. A firewall is a common example of a stateful device. A firewall allows or denies a packet to pass through its interfaces based on various fields such as protocol, TCP/UDP port, and URL headers. This level of packet inspection puts a heavy processing load on the device. To improve performance, the firewall inspects the first packet of a flow. If the packet is allowed, it keeps the flow information in its state table. All subsequent packets related to this flow are allowed based on the initial determination. When a packet that is part of an existing flow arrives at the firewall and the firewall has no prior state information about it, the firewall drops the packet.

## Asymmetric routing with ExpressRoute

When you connect to Microsoft through ExpressRoute, your network changes like this:

-	You have multiple links to Microsoft. One link is your existing Internet connection, and the other is via ExpressRoute. Some traffic to Microsoft might go through the Internet but come back via ExpressRoute or vice versa.
-	You receive more specific IP addresses via ExpressRoute. So, traffic from your network to Microsoft for services offered via ExpressRoute always prefer ExpressRoute.

To understand the effect these two changes have on a network, let’s consider some scenarios. As an example, you have only one circuit to the Internet and you consume all Microsoft services via the Internet. The traffic from your network to Microsoft and back traverses through the same Internet link and passes through the firewall. The firewall records the flow as it sees the first packet and return packets are allowed as the flow exists in the state table.

![Asymmetric routing with ExpressRoute](./media/expressroute-asymmetric-routing/AsymmetricRouting1.png)


Then, you turn on ExpressRoute and consume services offered by Microsoft over ExpressRoute. All other services from Microsoft are consumed over the Internet. You deploy a separate firewall at your edge that is connected to ExpressRoute. Microsoft advertises more specific prefixes to your network over ExpressRoute for specific services. Your routing infrastructure chooses ExpressRoute as the preferred path for those prefixes. If you are not advertising your public IP addresses to Microsoft over ExpressRoute, Microsoft communicates with your public IP addresses via the Internet. Forward traffic from your network to Microsoft uses ExpressRoute, and reverse traffic from Microsoft uses the Internet. When the firewall at the edge sees a response packet for a flow that is not found in the state table, it drops the return traffic.

If you choose to use the same network address translation (NAT) pool for ExpressRoute and for the Internet, you'll see similar issues with the clients in your network on private IP addresses. Requests for services like Windows Update go via the Internet because IP addresses for these services are not advertised via ExpressRoute. However, the return traffic comes back via ExpressRoute. If Microsoft receives an IP address with the same subnet mask from the Internet and ExpressRoute, it prefers ExpressRoute over the Internet. If a firewall or another stateful device on your network edge, and facing ExpressRoute, has no prior information about the flow, it drops the packets that belong to that flow.

## Asymmetric routing solutions

You have two main options to solve the problem of asymmetric routing. One is through routing, and the other is by using source-based NAT (SNAT).

- Routing

    - You should ensure that your public IP addresses are advertised to appropriate wide area network (WAN) links. For example, if you want to use the Internet for authentication traffic and ExpressRoute for your mail traffic, you should not advertise your Active Directory Federation Services (AD FS) public IP addresses over ExpressRoute. Similarly, on-premises AD FS server must not be exposed to IP addresses received over ExpressRoute. Routes received over ExpressRoute are more specific so they make ExpressRoute the preferred path for authentication traffic to Microsoft. This causes asymmetric routing.

    - If you want to use ExpressRoute for authentication, you must make sure that you are advertising AD FS public IP addresses over ExpressRoute without NAT. This way, traffic that originates from Microsoft and goes to an on-premises AD FS server goes over ExpressRoute. Return traffic from customer to Microsoft uses ExpressRoute because it's the preferred route over the Internet.

- Source-based NAT

	Another way of solving asymmetric routing issues is by using Source NAT (SNAT). For example, you have not advertised the public IP address of on-premises Simple Mail Transfer Protocol (SMTP) server over ExpressRoute because you intend to use the Internet for this communication. A request that originates with Microsoft and then goes to your on-premises SMTP server traverses the Internet. You SNAT the incoming request to an internal IP address. Reverse traffic from the SMTP server goes to the edge firewall (which you use for NAT) instead of through ExpressRoute. The return traffic goes back via the Internet.


![Source-based NAT (SNAT) network configuration](./media/expressroute-asymmetric-routing/AsymmetricRouting2.png)

## Asymmetric routing detection

Traceroute is the best way to make sure that your network traffic is traversing the expected path. If you expect traffic from your on-premises SMTP server to Microsoft to take the Internet path, the expected traceroute is from the SMTP server to Office 365. The result validates that traffic is indeed leaving your network toward the Internet and not toward ExpressRoute.
