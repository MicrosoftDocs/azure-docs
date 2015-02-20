<properties 
   pageTitle="ExpressRoute Technical Overview" 
   description="This article introduces the Microsoft Azure ExpressRoute service." 
   services="expressroute" 
   documentationCenter="" 
   authors="cherylmc" 
   manager="adinah">

<tags
   ms.service="expressroute"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="02/13/2015"
   ms.author="cherylmc"/>

# ExpressRoute Technical Overview #


Microsoft Azure ExpressRoute lets you create private connections between Azure datacenters and infrastructure that’s on your premises or in a co-location environment. With ExpressRoute, you can establish connections to Azure at an ExpressRoute partner co-location facility, or directly connect to Azure from your existing WAN network (such as a MPLS VPN provided by a network service provider). Use ExpressRoute to extend your network to Azure and unlock hybrid IT scenarios. 

ExpressRoute connections offer higher security, more reliability, faster speeds and lower latencies than typical connections over the Internet. In some cases, using ExpressRoute connections to transfer data between your on-premises network and Azure can also yield significant cost benefits. If you already have created a cross-premises connection from your on-premises network to Azure, you can migrate to an ExpressRoute connection while keeping your virtual network intact. 

See the [ExpressRoute FAQ](https://msdn.microsoft.com/library/azure/dn606292.aspx) for more details.

## How does an ExpressRoute connection work? ##

In order to connect your on-premises network and services hosted in Azure (compute, storage, media services, websites and other services), you must order a circuit through a connectivity provider. There are two connectivity provider types to choose from: direct layer 3 through an exchange provider, or layer 3 through a network service provider. You can choose to enable one or both types of connectivity through your circuit to your Azure subscription. You will be able to connect to all supported Azure services through the circuit only if you configure both direct layer 3 and layer 3 connectivity. 
Note the following:
- If you are connecting to Azure through an exchange provider location, you will need a pair of physical cross-connections and will need to configure a pair of BGP sessions per physical cross connection (one public peering and one for private peering) in order to have a highly available link. The cross-connects go into the exchange provider’s cloud connectivity infrastructure. They do not connect directly to Azure routers.
- If you connect to Azure through a network service provider, the network service provider takes care of configuring routes to all the services. Work with your network service provider to have routes configured appropriately.



The figure below shows a logical representation of connectivity between your infrastructure and Azure. In the diagram, a circuit represents a redundant pair of logical cross connections between your network and Azure configured in Active-Active configuration. The circuit is partitioned to 2 sub-circuits to isolate traffic. 
The following traffic is isolated: 
- Traffic is isolated between your premises and Azure compute services. Azure compute services, namely virtual machines (IaaS) and cloud services (PaaS) deployed within a virtual network are covered. 
- Traffic is isolated between your premises and Azure services hosted on public IP addresses. The services that are supported can be found here: Supported Azure Services.

![](https://i-msdn.sec.s-msft.com/dynimg/IC741138.png)


## Next steps

For more details read the Express Route Technical Overview [article](https://msdn.microsoft.com/library/azure/dn606309.aspx) on MSDN.

<!--Image references-->
[5]: ./media/markdown-template-for-new-articles/octocats.png
[6]: ./media/markdown-template-for-new-articles/pretty49.png
[7]: ./media/markdown-template-for-new-articles/channel-9.png
[8]: ./media/markdown-template-for-new-articles/copytemplate.png
