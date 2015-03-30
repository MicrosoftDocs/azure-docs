<tags 
   pageTitle="Introduction to ExpressRoute"
   description="This page provides an overview of the ExpressRoute service."
   services="expressroute"
   authors="cherylmc"
   manager="adinah"
   editor="tysonn" />
<tags 
   ms.service="expressroute"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="3/30/2015"
   ms.author="cherylmc" />

#  ExpressRoute Technical Overview

Microsoft Azure ExpressRoute lets you create private connections between Azure datacenters and infrastructure that’s on your premises or in a co-location environment. With ExpressRoute, you can establish connections to Azure at an ExpressRoute partner co-location facility, or directly connect to Azure from your existing WAN network (such as a MPLS VPN provided by a network service provider). Use ExpressRoute to extend your network to Azure and unlock hybrid IT scenarios.

ExpressRoute connections offer higher security, more reliability, faster speeds and lower latencies than typical connections over the Internet. In some cases, using ExpressRoute connections to transfer data between your on-premises network and Azure can also yield significant cost benefits. If you already have created a cross-premises connection from your on-premises network to Azure, you can migrate to an ExpressRoute connection while keeping your virtual network intact.

See the [ExpressRoute FAQ](expressroute-faq.md) for more details.




##  How does an ExpressRoute connection work?

In order to connect your WAN and services hosted in Azure (compute, storage, media services, websites and other services), you must order a dedicated circuit through a connectivity provider. There are two connectivity provider types to choose from: direct layer 3 through an exchange provider, or layer 3 through a network service provider. You can choose to enable one or both types of connectivity through your circuit to your Azure subscription. You will be able to connect to all supported Azure services through the circuit only if you configure both direct layer 3 and layer 3 connectivity. Note the following:



- If you are connecting to Azure through an exchange provider location, you will need a pair of physical cross-connections and will need to configure a pair of BGP sessions per physical cross connection (one public peering and one for private peering) in order to have a highly available link. The cross-connects go into the exchange provider’s cloud connectivity infrastructure. They do not connect directly to Azure routers.
- If you connect to Azure through a network service provider, the network service provider takes care of configuring routes to all the services. Work with your network service provider to have routes configured appropriately.

The figure below shows a logical representation of connectivity between your infrastructure and Azure. In the diagram, a circuit represents a redundant pair of logical cross connections between your network and Azure configured in Active-Active configuration. The circuit is partitioned to 2 sub-circuits to isolate traffic. 

The following traffic is isolated:

 - Traffic is isolated between your premises and Azure compute services. Azure compute services, namely virtual machines (IaaS) and cloud services (PaaS) deployed within a virtual network are covered.
 - Traffic is isolated between your premises and Azure services hosted on public IP addresses. The services that are supported can be found here: [Supported Azure Services](expressroute-faqs.md)

![](./media/expressroute-introduction/expressroute-basic.png)


##  Exchange Providers and Network Service Providers
ExpressRoute providers are classified as Network Service Providers (NSPs) and Exchange providers (EXPs).

![](./media/expressroute-introduction/expressroute-nsp-exp.png)


|   |**Exchange Provider**|**Network Service Provider**|
|---|---|---|
|**Typical Connectivity model**| Point to point Ethernet links or Connectivity at a cloud exchange | Any to any connectivity through a telco VPN |
|**Supported Bandwidths**|200 Mbps, 500 Mbps, 1 Gbps and 10 Gbps|10 Mbps, 50 Mbps, 100 Mbps, 500 Mbps, 1 Gbps|
|**Connectivity Providers**|[Exchange Providers page](https://msdn.microsoft.com/en-us/library/azure/4da69a0f-8f52-49ea-a990-dacd4202150a#BKMK_EXP)|[Network Service Providers page](https://msdn.microsoft.com/en-us/library/azure/4da69a0f-8f52-49ea-a990-dacd4202150a#BKMK_NSP)|
|**Routing**|BGP sessions directly with customer edge routers| BGP sessions with telco|
|**Pricing**|[EXP pricing](http://azure.microsoft.com/pricing/details/expressroute/)|[NSP pricing](http://azure.microsoft.com/pricing/details/expressroute/)|

### Exchange Providers (EXPs)
We partner with cloud exchange service providers such as Equinix and TeleCity group, and also with point-to-point connectivity service providers such as Level 3, to offer connectivity between Azure and the customer’s premises. We offer circuit bandwidths from 200 Mbps to 10 Gbps (200 Mbps, 500 Mbps, 1 Gbps and 10 Gbps).

If you want a direct layer 3 connection through an exchange provider, you can do this one of 3 ways:

- You can be co-located with the cloud exchanges such as Equinix in the locations we offer services in. 
- You can work with local Ethernet providers such as Equinix to have Ethernet circuits setup between your on-premises network and Azure. For an exchange provider connection, we configure a pair of cross-connections between Azure infrastructure and the connectivity provider’s infrastructure in active-active configuration to ensure that the connection is highly available and is resilient to failures.
- You can work with your local metro Ethernet service provider to acquire leased lines in order to connect to the closest exchange provider facility that can connect to Azure.

No matter which way you decide, for a direct layer 3 connection, we configure a pair of cross-connections between Azure infrastructure and the connectivity provider’s infrastructure in active-active configuration to ensure that the connection is highly available and is resilient to failures. After you meet the, you can then setup BGP sessions between your routers and the Microsoft routers in order to exchange routes and have traffic flow between your network and Azure.

For more information about configuration and to see real-world examples, you can follow this step by step guidance: [Configure an ExpressRoute Connection through an EXP](.https://msdn.microsoft.com/library/azure/dn606306.aspx).


###  Network Service Providers (NSPs)

We partner with Telcos such as AT&T, and British Telecom to offer connectivity between Azure and your WAN. We offer circuit bandwidths from 10 Mbps to 1 Gbps. If you use VPN services from any of the network service providers we partner with, they can extend the networks into Azure without having to deploy any new hardware or making major configuration changes to your existing networks.

For more information about configuration and to see real-world examples, you can follow this step by step guidance: [Configure ExpressRoute circuits through NSPs](https://msdn.microsoft.com/library/azure/dn643736.aspx).

##Next Steps



- [ExpressRoute Service Providers and Locations](https://msdn.microsoft.com/library/azure/dn957919.aspx) 
- [Configure an ExpressRoute Connection through a Network Service Provider](https://msdn.microsoft.com/en-us/library/azure/dn606309.aspx)
- [Configure an ExpressRoute Connection through an Exchange Provider](https://msdn.microsoft.com/library/azure/dn606306.aspx)

