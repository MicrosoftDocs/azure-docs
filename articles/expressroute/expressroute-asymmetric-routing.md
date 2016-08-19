<properties
   pageTitle="title | Microsoft Azure"
   description="This article walks you through issues you can face with asymmetric routing in your network "
   documentationCenter="na"
   services="expressroute"
   authors="osamaz"
   manager="carmonm"
   editor=""
   tags="azure-resource-manager"/>
<tags
   ms.service="expressroute"
   ms.devlang="na"
   ms.topic="article" 
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="08/17/2016"
   ms.author="osamaz"/>

# Asymmetric Routing with multiple network paths

To understand asymmetric routing, we need to understand two concepts. One is the impact of multiple network paths. Other is the behavior of the devices that keep the state such as firewalls. This type of devices are called stateful devices. A combination of these two factors creates scenarios where the traffic is dropped by a stateful device as it did not see the traffic originated through itself.

## Multiple Network Paths

When an enterprise network has only one link to the Internet via their Internet service provider, then all the traffic towards and from the Internet comes through the same path. Often, companies decide to have redundant paths to improve network uptime and purchase multiple circuits. In such cases, it is possible that traffic going outside the network towards the Internet goes through one link while the return traffic comes through a different link. This phenomenon is commonly known as Asymmetric Routing where the reverse traffic takes a different path from the original flow.

While the preceding description is for Internet, it applies to other combinations of multiple paths. For example, an Internet path to a destination and private path to the same destination, multiple private paths to the same destination etc. 

Each router along the way from source to destination computes best path to reach a destination based on its calculation of best path to reach the destination. Determination of best possible path is based on two main factors.

1.	Routing between external networks is based on routing protocol called Border Gateway Protocol commonly known as BGP. BGP takes advertisements from neighbors and run them through number of steps to determine the best path to the destination and installs it in its routing table.
2.	Length of subnet mask associated with a route. If multiple advertisements for the same IP address but different subnet masks are received, then the advertisement with longer subnet mask is preferred because it is considered more specific route.

## Stateful Devices

While routers look at the IP header of the packet, there are devices that have the capability to look even deeper inside the packet e.g. Layer4 (TCP/UDP) or even Layer7(Application Layer). These devices are either security devices or bandwidth optimization devices. Firewall is a common example of stateful devices. For example, firewall has the ability to allow or deny a packet through its interfaces based on protocol, TCP/UDP port, URL headers etc. This packet inspection puts lot of processing load on the device. To improve the performance when the first packet of a flow arrives at the firewall, it looks at the packet for deep packet inspection and if the packet is allowed, it keeps the flow information in its state table. All subsequent packets related to this flow are allowed based on the initial decision. This would mean that if a packet, which is part of an existing communication, arrives at the firewall and firewall has no prior state information about it, the firewall will drop this packet.

## Asymmetric routing with ExpressRoute

When you connect to Microsoft, through ExpressRoute, then following changes happen to your network.

1.	You have multiple links to Microsoft. One link is your existing Internet connection and other will be via ExpressRoute. This would mean that some traffic to Microsoft may go through Internet and come back via ExpressRoute or vice versa.
2.	You receive more specific IP addresses via ExpressRoute. This would mean that traffic from your network to Microsoft for services offered via ExpressRoute always prefer ExpressRoute. 

To understand the impact of above two, let’s go through some scenarios. Let's assume you have only one circuit to Internet and you consume all Microsoft services via Internet. The traffic from your network to Microsoft and back traverses through the same Internet link and passes through the firewall. The firewall records the flow as it sees the first packet and return packets are allowed as the flow exists in the state table.

![Routing1](./media/expressroute-asymmetric-routing/AsymmetricRouting1.png)


You turn on ExpressRoute and consume services offered by Microsoft over ExpressRoute. All other services from Microsoft will be consumed over the Internet. Microsoft will advertise more specific routes to your network over ExpressRoute for specific services. There is communication expected between your public facing servers such as Web, SMTP, ADFS etc. and Microsoft. Your routing infrastructure will choose ExpressRoute as preferred path, over Internet, for those prefixes. However, if you are not advertising Public IP addresses of your servers such as Web, SMTP, ADFS etc. to Microsoft then Microsoft will initiate connection to these Public IP addresses via Internet. However, the return traffic from the servers (hosted in your network) to Microsoft will be via ExpressRoute. If there is a stateful device deployed at your edge connecting to ExpressRoute such as Firewall, IDS, NAT etc.  Then this device has not seen the original request and hence this flow will not be present in its state table, so it will drop the return traffic. 

If you choose to use the same NAT pool for ExpressRoute and for Internet, you will see similar issues with the clients on private IP addresses in your network. Request for services such as Windows Update will go via Internet as IP addresses for these services are not advertised via ExpressRoute. However, the return traffic will come back via ExpressRoute because from Microsoft perspective if an IP address with same subnet mask is received from Internet as well as ExpressRoute, then ExpressRoute is preferred over Internet. This would mean that firewall or other Stateful device at your network edge facing ExpressRoute may drop the packets if it had no prior information about the flow. 

## Solutions to Asymmetric Routing

There are two main ways to solve the Asymmetric Routing problem. One is via routing and other is via source-based NAT (SNAT). 

1. Routing 

    - You should ensure that your Public IP addresses are advertised to appropriate WAN links. For example, if you want to use Internet for authentication traffic and ExpressRoute for your mail traffic. Then you must not advertise your ADFS public IP addresses over ExpressRoute. Similarly, on-premises ADFS server must not be exposed to IP addresses received over ExpressRoute. Routes received over ExpressRoute are more specific so they will make ExpressRoute preferred path for authentication traffic to Microsoft thus causing asymmetric routing.

    - If you want to use ExpressRoute for authentication, then you must make sure that you are advertising ADFS public IP addresses over ExpressRoute without NAT. This way traffic originating from Microsoft to on premises ADFS server goes over ExpressRoute while return traffic from customer to Microsoft will use ExpressRoute as it is preferred over Internet. 

2. Source-based NAT

	Another way of solving Asymmetric Routing issues is via Source NAT (SNAT). For example, if you have not advertised the public IP address of on-premises SMTP server over ExpressRoute intending to use Internet for this communication. A request originated from Microsoft to your on-premises SMTP server traverses the Internet. You source NAT the incoming request to an internal IP address. Reverse traffic from SMTP server will go to the edge firewall instead of ExpressRoute. This way the return traffic will go back via Internet. 


![Routing2](./media/expressroute-asymmetric-routing/AsymmetricRouting2.png)

## Detection of Asymmetric Routing

Traceroute is the best way to ensure that traffic is traversing the expected path. For example, if you are expecting the traffic from your on-premises SMTP server to Microsoft will take the Internet path, then you should traceroute from the SMTP server to Office 365 and verify that traffic is indeed leaving your network towards Internet and not towards ExpressRoute. 


