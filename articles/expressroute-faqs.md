<properties 
   pageTitle="ExpressRoute FAQ"
   description="The ExpressRoute FAQ contains information about Supported Azure Services, Cost, Data and Connections, SLA, Providers and Locations, Bandwidth, and additional Technical Details."
   documentationCenter="na"
   services="expressroute"
   authors="cherylmc"
   manager="adinah"
   editor="tysonn"/>
<tags 
   ms.service="expressroute"
   ms.devlang="na"
   ms.topic="article" 
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="03/31/2015"
   ms.author="cherylmc"/>

#  ExpressRoute FAQ


##  What is ExpressRoute?
ExpressRoute is an Azure service that lets you create private connections between Azure datacenters and infrastructure that’s on your premises or in a colocation facility. ExpressRoute connections do not go over the public Internet, and offer higher security, reliability and speeds with lower latencies than typical connections over the Internet.

###  What are the benefits of using ExpressRoute and private network connections?
ExpressRoute connections do not go over the public Internet, and offer higher security, reliability and speeds with lower and consistent latencies than typical connections over the Internet. In some cases, using ExpressRoute connections to transfer data between on-premises devices and Azure can yield significant cost benefits.

###  Where is the service available?
See this page for service location and availability: [ExpressRoute service providers and locations](https://msdn.microsoft.com/library/azure/dn957919.aspx).

###  How can I use ExpressRoute to connect to Azure if I don’t have partnerships with one of the ExpressRoute-carrier partners?
You can select a regional carrier and land Ethernet connections to one of the supported exchange provider locations. You can then peer with Azure at the exchange providers’ location. Check with your NSP to see if they are present in any of the Exchange locations listed above and have your service provider extend your network to the Exchange location of choice. You can then order an ExpressRoute circuit through the Exchange provider to connect to Azure.

###  How much does ExpressRoute cost?
Check [Pricing Details](http://azure.microsoft.com/pricing/details/expressroute/)
for pricing information.

###  If I pay for an ExpressRoute circuit of a given bandwidth, does the VPN connection I purchase from my network service provider have to be the same speed?
No. You can purchase a VPN connection of any speed from your service provider. However, your connection to Azure will be limited to the ExpressRoute circuit bandwidth that you purchase. 

###  If I pay for an ExpressRoute circuit of a given bandwidth, do I have the ability to burst up to higher speeds if required?
Yes. ExpressRoute circuits are configured to support cases where you can burst up to two times the bandwidth limit you procured for no additional cost. Check with your service provider if they support this capability.

###  Can I use the same private network connection with Virtual Network and other Azure services simultaneously?
Yes. An ExpressRoute circuit, once setup will allow you to access services within a virtual network and other Azure services simultaneously.

###  Does ExpressRoute offer a Service Level Agreement (SLA)?
Please refer to the [ExpressRoute SLA page](http://azure.microsoft.com/support/legal/sla/) for more information.

##  Supported Azure Services
Most Azure services are supported over ExpressRoute.

Connectivity to virtual machines and cloud services deployed in virtual networks are supported over the private peering path.

Azure Websites are supported over the public peering path.

All other services are accessible over the public peering path. The exceptions are as follows -

**The following are not supported:**

- CDN
- RemoteApp
- Visual Studio Online Load Testing
- Notification Hubs
- Automation
- Application Insights
- Multi-factor Authentication
- API Management
- Push Notifications



##  Data and Connections

###  Are there limits on the amount of data that I can transfer using ExpressRoute?
We do not set a limit on the amount of data transfer. Refer to the [Pricing Details](http://azure.microsoft.com/pricing/details/expressroute/) for information on bandwidth rates.

###  What connection speeds are supported by ExpressRoute?
Supported bandwidth offers:

|**Provider**|**Bandwidth**|
|---|---|
|**Network providers**|10 Mbps, 50 Mbps, 100 Mbps, 500 Mbps, 1 Gbps|
|**Exchange providers**|200 Mbps, 500 Mbps, 1Gbps, 10Gbps|

###  Which service providers are available?
See [ExpressRoute Locations](https://msdn.microsoft.com/library/azure/dn957919.aspx) for the list of service providers and locations.

##  Technical Details

###  What are the technical requirements for connecting my on-premises location to Azure?
Please see [ExpressRoute prerequisites page](https://msdn.microsoft.com/library/azure/dn606309#ExpressRoute_prereq) for requirements.

###  Are connections to ExpressRoute redundant?
Yes. Each Express Route circuit has a redundant pair of cross connections configured to provide high availability.

###  Will I lose connectivity if one of my ExpressRoute links fail?
You will not lose connectivity if one of the cross connections fails. A redundant connection is available to support the load of your network. You can additionally create multiple circuits in a different peering location to achieve failure resilience.

###  Do I have to configure both links to get the service to work?
If you are connecting through a NSP, the NSP takes care of configuring redundant links on your behalf. If you connect through an EXP, you must configure both links. Our SLA will be void if the circuit is not configured for redundancy.

###  Can I extend one of my VLANs to Azure using ExpressRoute?
No. We do not support layer 2 connectivity extensions into Azure.

###  Can I have more than one ExpressRoute circuit in my subscription?
Yes. You can have more than one ExpressRoute circuit in your subscription. The default limit on the number of dedicated circuits is set to 10. You can contact Microsoft Support to increase the limit if needed.

###  Can I have ExpressRoute circuits from different service providers?
Yes. You can have ExpressRoute circuits with many service providers. Each ExpressRoute circuit will be associated with one service provider only.

###  How do I get my virtual networks connected to an ExpressRoute circuit
The basic steps are outlined below.

- You must establish an ExpressRoute circuit and have the service provider enable it.
- You must configure the BGP for private peering (if you are using an Exchange provider).
- You must link the virtual network to the ExpressRoute circuit.

The following tutorials will help you:

- [Configure an ExpressRoute Connection through a Network Service Provider](https://msdn.microsoft.com/library/azure/dn643736.aspx)
- [Configure an ExpressRoute Connection through an Exchange Provider](https://msdn.microsoft.com/library/azure/dn606306.aspx)
- [Configure a Virtual Network and Gateway for ExpressRoute](https://msdn.microsoft.com/library/azure/dn643737.aspx)

###  Can I link to more than one virtual network to an ExpressRoute circuit?
Yes. You can link up to 10 virtual networks to an ExpressRoute circuit. All virtual networks must be in the same continent as the ExpressRoute circuit.

###  Can I connect virtual networks belonging to many subscriptions to an ExpressRoute circuit?
Yes. You can authorize up to 10 other Azure subscriptions to use a single ExpressRoute circuit. For more details, see [Sharing an ExpressRoute Circuit across multiple subscriptions](https://msdn.microsoft.com/library/azure/dn835110.aspx).

###  Are virtual networks connected to the same circuit isolated from each other?
No. All virtual networks linked to the same ExpressRoute circuit are part of the same routing domain and are not isolated from each other from a routing perspective. If you need route isolation, you’ll need to create a separate ExpressRoute circuit.

###  Can I have one virtual network connected to more than one ExpressRoute circuit?
Yes. You can link a single virtual network with up to 4 ExpressRoute circuits. All ExpressRoute circuits must be in the same continent. They can be ordered through different service providers and in different locations.

###  Can I access the internet from my virtual networks connected to ExpressRoute circuits?
Yes. If you have not advertised default routes (0.0.0.0/0) or internet route prefixes through the BGP session, you will be able to connect to the internet from a virtual network linked to an ExpressRoute circuit.

###  Can I block internet connectivity to virtual networks connected to ExpressRoute circuits?
Yes. You can advertise default routes (0.0.0.0/0) to block all internet connectivity to virtual machines deployed within a virtual network and route all traffic out through the ExpressRoute circuit.

###  Can virtual networks linked to the same ExpressRoute circuit talk to each other?
Yes. Virtual machines deployed in virtual networks connected to the same ExpressRoute circuit can communicate with each other.

###  Can I use site-to-site and point-to-site connectivity for virtual networks in conjunction with ExpressRoute?
No. A virtual network connected to an ExpressRoute circuit cannot be used with site-to-site and point-to-site.

###  Can I move a virtual network from site-to-site / point-to-site configuration to use ExpressRoute?
Yes. There will however be a small downtime associated with the process.

###  What do I need to connect to Azure storage over ExpressRoute?
You must establish an ExpressRoute circuit and configure routes for public peering.

###  Are there limits on the number of routes I can advertise?
Yes. We accept up to 4000 route prefixes for private peering and public peering.

###  Are there restrictions on IP ranges I can advertise over the BGP session?
Prefixes advertised through BGP must be /29 or larger. We will filter out private prefixes (RFC1918) in the public peering BGP session.

###  What happens if I exceed the BGP limits?
BGP sessions will be dropped. They will be reset once the prefix count goes below the limit.

### After I advertise the default route (0.0.0.0/0) to my virtual networks I can't activate Windows running on my Azure VMs. What can I do?
The following steps will help Azure recognize the activation request:

1. Establish the public peering for your ExpressRoute circuit.
2. Perform a DNS lookup and find the IP address of **kms.core.windows.net**
3. Then do one of the following two items so that the Key Management Service will recognize that the activation request comes from Azure and will honor the request.
	- On your on-premises network, route the traffic destined for the IP address (obtained in step 2) back to Azure via the public peering.
	- Have your NSP provider hair-pin the traffic back to Azure via the public peering. 
