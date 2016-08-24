<properties
   pageTitle="Asymmetric Routing | Microsoft Azure"
   description="This article walks through issues a customer can face with asymmetric routing in its network when it has multiple links to a destination."
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

# Asymmetric Routing with multiple network paths

This article explains how forward and return traffic can take different routes when there are multiple paths available between source and destination.

To understand asymmetric routing, we need to understand two concepts. One is impact of multiple network paths. Other is behavior of the devices that keep state such as firewalls. These devices are called stateful devices. A combination of these two factors creates scenarios where the traffic is dropped by a stateful device as it did not see the traffic originated through itself.

## Multiple Network Paths

When an enterprise network has only one link to the Internet via their Internet service provider, then all traffic towards and from the Internet comes through the same path. Often, companies purchase multiple circuits, as redundant paths, to improve network uptime. In such cases, it is possible that traffic going outside the network towards the Internet goes through one link while the return traffic comes through a different link. This phenomenon is commonly known as Asymmetric Routing where the reverse traffic takes a different path from the original flow.

![Routing3](./media/expressroute-asymmetric-routing/AsymmetricRouting3.png)

While the preceding description is for Internet, it applies to other combinations of multiple paths. Examples are, an Internet path and a private path to the same destination, multiple private paths to the same destination etc. 

Each router along the way from source to destination computes best path to reach a destination based on its calculation of best path to reach the destination. Determination of best possible path is based on two main factors.

1.	Routing between external networks is based on routing protocol called Border Gateway Protocol commonly known as BGP. BGP takes advertisements from neighbors and run them through number of steps to determine the best path to the destination and installs it in its routing table.
2.	Length of subnet mask associated with a route. If multiple advertisements for the same IP address but different subnet masks are received, then the advertisement with longer subnet mask is preferred because it is considered more specific route.

## Stateful Devices

Routers look at the IP header of the packet for routing purposes. However, there are devices that look even deeper inside the packet. Typically these devices look at Layer4 (TCP/UDP) or even Layer7(Application Layer) headers. These devices are either security devices or bandwidth optimization devices. Firewall is a common example of stateful devices. Firewall allows or denies a packet through its interfaces based on various fields such as protocol, TCP/UDP port, URL headers. This packet inspection puts lot of processing load on the device. To improve the performance, the firewall inspects the first packet of a flow. If the packet is allowed, it keeps the flow information in its state table. All subsequent packets related to this flow are allowed based on the initial decision. So, when a packet, which is part of an existing flow, arrives at the firewall and firewall has no prior state information about it, the firewall drops this packet.

## Asymmetric routing with ExpressRoute

When you connect to Microsoft, through ExpressRoute, then following changes happen to your network.

1.	You have multiple links to Microsoft. One link is your existing Internet connection and other will be via ExpressRoute. Some traffic to Microsoft may go through Internet but come back via ExpressRoute or vice versa.
2.	You receive more specific IP addresses via ExpressRoute. So, traffic from your network to Microsoft for services offered via ExpressRoute always prefer ExpressRoute. 

To understand the impact of above two, let’s go through some scenarios. Let's assume you have only one circuit to Internet and you consume all Microsoft services via Internet. The traffic from your network to Microsoft and back traverses through the same Internet link and passes through the firewall. The firewall records the flow as it sees the first packet and return packets are allowed as the flow exists in the state table.

![Routing1](./media/expressroute-asymmetric-routing/AsymmetricRouting1.png)


Now you turn on ExpressRoute and consume services offered by Microsoft over ExpressRoute. All other services from Microsoft are consumed over the Internet. You deploy a separate firewall at your edge connecting to ExpressRoute. Microsoft will advertise more specific prefixes to your network over ExpressRoute for specific services. Your routing infrastructure will choose ExpressRoute as preferred path for those prefixes. If you are not advertising  your Public IP addresses to Microsoft over ExpressRoute, then Microsoft will communicate with your Public IP addresses via Internet. So, forward traffic from your network to Microsoft will use ExpressRoute while reverse traffic from Microsoft will use Internet. When the firewall at the edge sees a response packet for a flow not found in the state table, then it will drop the return traffic. 

If you choose to use the same NAT pool for ExpressRoute and for Internet, you will see similar issues with the clients on private IP addresses in your network. Request for services such as Windows Update will go via Internet as IP addresses for these services are not advertised via ExpressRoute. However, the return traffic will come back via ExpressRoute. If Microsoft receives an IP address with same subnet mask from Internet and ExpressRoute, then it prefers ExpressRoute over Internet. If a firewall or other stateful device at your network edge, facing ExpressRoute, has no prior information about the flow, it will drop the packets belonging to that flow. 

## Solutions to Asymmetric Routing

There are two main ways to solve the Asymmetric Routing problem. One is via routing and other is via source-based NAT (SNAT). 

1. Routing 

    - You should ensure that your Public IP addresses are advertised to appropriate WAN links. For example, if you want to use Internet for authentication traffic and ExpressRoute for your mail traffic. Then you must not advertise your ADFS public IP addresses over ExpressRoute. Similarly, on-premises ADFS server must not be exposed to IP addresses received over ExpressRoute. Routes received over ExpressRoute are more specific so they will make ExpressRoute preferred path for authentication traffic to Microsoft thus causing asymmetric routing.

    - If you want to use ExpressRoute for authentication, then you must make sure that you are advertising ADFS public IP addresses over ExpressRoute without NAT. This way traffic originating from Microsoft to on premises ADFS server goes over ExpressRoute while return traffic from customer to Microsoft will use ExpressRoute as it is preferred over Internet. 

2. Source-based NAT

	Another way of solving Asymmetric Routing issues is via Source NAT (SNAT). For example, if you have not advertised the public IP address of on-premises SMTP server over ExpressRoute intending to use Internet for this communication. A request originated from Microsoft to your on-premises SMTP server traverses the Internet. You source NAT the incoming request to an internal IP address. Reverse traffic from SMTP server will go to the edge firewall (used to do NAT) instead of ExpressRoute. This way the return traffic will go back via Internet. 


![Routing2](./media/expressroute-asymmetric-routing/AsymmetricRouting2.png)

## Detection of Asymmetric Routing

Traceroute is the best way to ensure that traffic is traversing the expected path. If you expect traffic from your on-premises SMTP server to Microsoft take the Internet path, then traceroute from the SMTP server to Office 365. The result will validate that traffic is indeed leaving your network towards Internet and not towards ExpressRoute. 


