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
   ms.date="05/05/2015"
   ms.author="cherylmc"/>

# ExpressRoute FAQ


## What is ExpressRoute?
ExpressRoute is an Azure service that lets you create private connections between Microsoft datacenters and infrastructure that’s on your premises or in a colocation facility. ExpressRoute connections do not go over the public Internet, and offer higher security, reliability and speeds with lower latencies than typical connections over the Internet.

### What are the benefits of using ExpressRoute and private network connections?
ExpressRoute connections do not go over the public Internet, and offer higher security, reliability and speeds with lower and consistent latencies than typical connections over the Internet. In some cases, using ExpressRoute connections to transfer data between on-premises devices and Azure can yield significant cost benefits.

### What Microsoft cloud services are supported over ExpressRoute?
ExpressRoute supports most Microsoft Azure services today. We are announcing support for Office 365 services over ExpressRoute. Look for updates on general availability soon.

### Where is the service available?
See this page for service location and availability: [ExpressRoute partners and locations](expressroute-locations.md).

### How can I use ExpressRoute to connect to Microsoft if I don’t have partnerships with one of the ExpressRoute-carrier partners?
You can select a regional carrier and land Ethernet connections to one of the supported exchange provider locations. You can then peer with Microsoft at the EXP location. Check the last section of [ExpressRoute partners and locations](expressroute-locations.md) to see if your network procider is present in any of the Exchange locations. You can then order an ExpressRoute circuit through the Exchange provider to connect to Azure.

### How much does ExpressRoute cost?
Check [Pricing Details](http://azure.microsoft.com/pricing/details/expressroute/) for pricing information.

### If I pay for an ExpressRoute circuit of a given bandwidth, does the VPN connection I purchase from my network service provider have to be the same speed?
No. You can purchase a VPN connection of any speed from your service provider. However, your connection to Azure will be limited to the ExpressRoute circuit bandwidth that you purchase. 

### If I pay for an ExpressRoute circuit of a given bandwidth, do I have the ability to burst up to higher speeds if required?
Yes. ExpressRoute circuits are configured to support cases where you can burst up to two times the bandwidth limit you procured for no additional cost. Check with your service provider if they support this capability.

### Can I use the same private network connection with Virtual Network and other Azure services simultaneously?
Yes. An ExpressRoute circuit, once setup will allow you to access services within a virtual network and other Azure services simultaneously. You will connect to virtual networks over the private peering path and other services over the public peering path. 

### Does ExpressRoute offer a Service Level Agreement (SLA)?
Please refer to the [ExpressRoute SLA page](http://azure.microsoft.com/support/legal/sla/) for more information.

## Supported Azure Services
Most Azure services are supported over ExpressRoute.

Connectivity to virtual machines and cloud services deployed in virtual networks are supported over the private peering path.

Azure Websites are supported over the public peering path.

All other services are accessible over the public peering path. The exceptions are as follows -

**The following are not supported:**

- CDN
- Visual Studio Online Load Testing
- Multi-factor Authentication

## Data and Connections

### Are there limits on the amount of data that I can transfer using ExpressRoute?
We do not set a limit on the amount of data transfer. Refer to the [Pricing Details](http://azure.microsoft.com/pricing/details/expressroute/) for information on bandwidth rates.

### What connection speeds are supported by ExpressRoute?
Supported bandwidth offers:

|**Provider**|**Bandwidth**|
|---|---|
|**Network providers**|10 Mbps, 50 Mbps, 100 Mbps, 500 Mbps, 1 Gbps|
|**Exchange providers**|200 Mbps, 500 Mbps, 1Gbps, 10Gbps|

### Which service providers are available?
See [ExpressRoute partners and locations](expressroute-locations.md) for the list of service providers and locations.

## Technical Details

### What are the technical requirements for connecting my on-premises location to Azure?
Please see [ExpressRoute prerequisites page](expressroute-prerequisites.md) for requirements.

### Are connections to ExpressRoute redundant?
Yes. Each Express Route circuit has a redundant pair of cross connections configured to provide high availability.

### Will I lose connectivity if one of my ExpressRoute links fail?
You will not lose connectivity if one of the cross connections fails. A redundant connection is available to support the load of your network. You can additionally create multiple circuits in a different peering location to achieve failure resilience.

### Do I have to configure both links to get the service to work?
If you are connecting through a NSP, the NSP takes care of configuring redundant links on your behalf. If you connect through an EXP, you must configure both links. Our SLA will be void if the circuit is not configured for redundancy.

### Can I extend one of my VLANs to Azure using ExpressRoute?
No. We do not support layer 2 connectivity extensions into Azure.

### Can I have more than one ExpressRoute circuit in my subscription?
Yes. You can have more than one ExpressRoute circuit in your subscription. The default limit on the number of dedicated circuits is set to 10. You can contact Microsoft Support to increase the limit if needed.

### Can I have ExpressRoute circuits from different service providers?
Yes. You can have ExpressRoute circuits with many service providers. Each ExpressRoute circuit will be associated with one service provider only.

### How do I get my virtual networks connected to an ExpressRoute circuit
The basic steps are outlined below.

- You must establish an ExpressRoute circuit and have the service provider enable it.
- You must configure the BGP for private peering (if you are using an Exchange provider).
- You must link the virtual network to the ExpressRoute circuit.

The following tutorials will help you:

- [Configure an ExpressRoute Connection through a Network Service Provider](expressroute-configuring-exps.md)
- [Configure an ExpressRoute Connection through an Exchange Provider](expressroute-configuring-nsps.md)
- [Configure a Virtual Network and Gateway for ExpressRoute](expressroute-configuring-vnet-gateway.md)

### Are there connectivity boundaries for my ExpressRoute circuit?
Yes. [ExpressRoute partners and locations](expressroute-locations.md) page provides an overview of the connectivity boundaries for an ExpressRoute circuit. Connectivity for an ExpressRoute circuit is limited to a single geopolitical region. Connectivity can be expanded to cross geopolitical regions by enabling the ExpressRoute premium feature.

### Can I link to more than one virtual network to an ExpressRoute circuit?
Yes. You can link up to 10 virtual networks to an ExpressRoute circuit. 

### Can I connect virtual networks belonging to many subscriptions to an ExpressRoute circuit?
Yes. You can authorize up to 10 other Azure subscriptions to use a single ExpressRoute circuit. This limit can be increased by enabling the ExpressRoute premium feature.

For more details, see [Sharing an ExpressRoute Circuit across multiple subscriptions](https://msdn.microsoft.com/library/azure/dn835110.aspx).

### Are virtual networks connected to the same circuit isolated from each other?
No. All virtual networks linked to the same ExpressRoute circuit are part of the same routing domain and are not isolated from each other from a routing perspective. If you need route isolation, you’ll need to create a separate ExpressRoute circuit.

### Can I have one virtual network connected to more than one ExpressRoute circuit?
Yes. You can link a single virtual network with up to 4 ExpressRoute circuits. All ExpressRoute circuits must be in the same continent. They can be ordered through different service providers and in different locations.

### Can I access the internet from my virtual networks connected to ExpressRoute circuits?
Yes. If you have not advertised default routes (0.0.0.0/0) or internet route prefixes through the BGP session, you will be able to connect to the internet from a virtual network linked to an ExpressRoute circuit.

### Can I block internet connectivity to virtual networks connected to ExpressRoute circuits?
Yes. You can advertise default routes (0.0.0.0/0) to block all internet connectivity to virtual machines deployed within a virtual network and route all traffic out through the ExpressRoute circuit. Note that if you advertise default routes, we will force traffic to services offered over public peering (such as Azure storage and SQL DB) back to your premises. You will have to configure your routers to return traffic to Azure through the public peering path or over the internet.

### Can virtual networks linked to the same ExpressRoute circuit talk to each other?
Yes. Virtual machines deployed in virtual networks connected to the same ExpressRoute circuit can communicate with each other.

### Can I use site-to-site and point-to-site connectivity for virtual networks in conjunction with ExpressRoute?
Yes. ExpressRoute can coexist with site-to-site and point-to-site VPN. YOu must create the ExpressRoute gateway first and then a dynamic routing gateway for the same virtual network for this to work. 

### Can I move a virtual network from site-to-site / point-to-site configuration to use ExpressRoute?
Yes. You will have to create an ExpressRoute gateway within your virtual network. There will be a small downtime associated with the process.

### What do I need to connect to Azure storage over ExpressRoute?
You must establish an ExpressRoute circuit and configure routes for public peering.

### Are there limits on the number of routes I can advertise?
Yes. We accept up to 4000 route prefixes for private peering and public peering. You can increase this to 10,000 routes if you enable ExpressRoute the premium feature.

### Are there restrictions on IP ranges I can advertise over the BGP session?
Prefixes advertised through BGP must be /29 or larger (/28 to /8). 

We will filter out private prefixes (RFC1918) in the public peering BGP session.

### What happens if I exceed the BGP limits?
BGP sessions will be dropped. They will be reset once the prefix count goes below the limit.

### After I advertise the default route (0.0.0.0/0) to my virtual networks I can't activate Windows running on my Azure VMs. What can I do?
The following steps will help Azure recognize the activation request:

1. Establish the public peering for your ExpressRoute circuit.
2. Perform a DNS lookup and find the IP address of **kms.core.windows.net**
3. Then do one of the following two items so that the Key Management Service will recognize that the activation request comes from Azure and will honor the request.
	- On your on-premises network, route the traffic destined for the IP address (obtained in step 2) back to Azure via the public peering.
	- Have your NSP provider hair-pin the traffic back to Azure via the public peering. 

### Can I change the bandwidth of an ExpressRoute circuit?
Yes. You can increase the bandwidth of an ExpressRoute circuit without having to tear it down. You will have to follow up with your connectivity provider to ensure that they update the throttles within their networks to support the bandwidth increase. You will however not be able to reduce the bandwidth of an ExpressRoute circuit. Having to lower the bandwidth will mean a tear down and recreation of an ExpressRoute circuit.

### How can I change the bandwidth of an ExpressRoute circuit? 
You can update the bandwidth of the ExpressRoute circuit using the update dedicated circuit API and PowerShell cmdlet.

## ExpressRoute Premium

### What is ExpressRoute premium?
ExpressRoute premium is a collection of features listed below.
 
 - Increased routing table limit from 4000 routes to 10,000 routes for public peering and private peering.
 - Increased number of VNets that can be connected to the ExpressRoute circuit (default is 10). See table below for more details.
 - Global connectivity over the Microsoft core network. You will now be able to link a VNet in one geopolitical region with an ExpressRoute circuit in another region. **Example:** You can link a VNet created in Europe West to an ExpressRoute circuit created in Silicon Valley. 

### How many VNets can I link to an ExpressRoute circuit if I enabled ExpressRoute premium?
The table below provides the increased limits for the number of VNets you can link to an ExpressRoute circuit. Default limit is 10.

**Limits for circuits created through NSPs**

| **Circuit Size** | **Number of VNet links for default setup** | **Number of VNet Links with ExpressRoute Premium** |
|--------------|----------------------------------------|-----------------------------------------------|
| 10 Mbps      | 10                                     | Not Supported                                 |
| 50 Mbps      | 10                                     | 20                                            |
| 100 Mbps     | 10                                     | 25                                            |
| 500 Mbps     | 10                                     | 40                                            |
| 1Gbps         | 10                                     | 50                                                                                     
|


**Limits for circuits created through EXPs**

| **Circuit Size** | **Number of VNet links for default setup** | **Number of VNet links with ExpressRoute Premium** |
|--------------|-----------------------------------|------------------------------------------------|
| 200 Mbps     | 10                                | 25                                             |
| 500 Mbps     | 10                                | 40                                             |
| 1 Gbps       | 10                                | 50                                             |
| 10 Gbps      | 10                                |  100                                              |



### How do I enable ExpressRoute premium?
ExpressRoute premium features can be enabled when the feature is enabled and can be shut down by updating the circuit state. You can enable ExpressRoute premium at circuit creation time or can call the update dedicated circuit API / PowerShell cmdlet to enable ExpressRoute premium.

### How do I disable ExpressRoute premium?
You can disable ExpressRoute premium by calling the update dedicated circuit API / PowerShell cmdlet You must ensure that you have scaled your connectivity needs to meet the default limits before you disable ExpressRoute premium. We will fail request to disable ExpressRoute premium if your utilization scales beyond the default limits.

### Can I pick and choose the features I want from the premium feature set?
No. You will not be able to pick the features you need. We enable all features when you turn on ExpressRoute premium. 

### How much does ExpressRoute premium cost?
Refer to the [Pricing Details](http://azure.microsoft.com/pricing/details/expressroute/) for cost.

### Do I pay for ExpressRoute premium in addition to standard ExpressRoute charges?
Yes. ExpressRoute premium charges apply on top of ExpressRoute circuit charges and charges required by the connectivity provider.

### Does ExpressRoute premium work with both EXP and NSP models?
Yes. ExpressRoute premium is supported cor ExpressRoute circuits connected through EXPs and NSPs.


## ExpressRoute and Office 365

### How do I create an ExpressRoute circuit to connect to Office 365 services?

1. Review the  [ExpressRoute prerequisites page](expressroute-prerequisites.md) page to make sure you meet the requirements
2. Review the list of service providers and locations at [ExpressRoute partners and locations](expressroute-locations.md) to ensure that your connectivity needs are met.
3. Plan your capacity requirements by reviewing [Network planning and performance tuning for Office 365](http://aka.ms/tune/)
4. Follow the steps listed in the workflows below to setup connectivity. 

	- [Configure an ExpressRoute Connection through a Network Service Provider](expressroute-configuring-nsps.md)
	- [Configure an ExpressRoute Connection through an Exchange Provider](expressroute-configuring-exps.md)

### Can my existing ExpressRoute circuits support connectivity to Office 365 services?
Yes. Your existing ExpressRoute circuit can be configured to support connectivity to Office 365 services. Ensure that you have sufficient capacity to connect to Office 365 services. [Network planning and performance tuning for Office 365](http://aka.ms/tune/) will help you plan your connectivity needs.

The following tutorials will help you:

- [Configure an ExpressRoute Connection through a Network Service Provider](expressroute-configuring-nsps.md)
- [Configure an ExpressRoute Connection through an Exchange Provider](expressroute-configuring-exps.md)

### What Office 365 services can be accessed over an ExpressRoute connection? 

**The following Office 365 services are supported**

- Exchange Online & Exchange Online Protection
- SharePoint Online
- Skype for Business Online
- Office Online
- Azure AD & Azure AD Sync
- CRM Online
- Office 365 Video
- Power BI
- Delve
- Project Online

**The following Office 365 services are not supported**

- Yammer
- Office 365 ProPlus client downloads
- On-premises Identity Provider Sign-In 
- Office 365 (operated by 21 Vianet) service in China

You can connect to these services over the internet.

### How much does ExpressRoute for Office 365 cost?
There is no additional cost for connecting to Office 365 over ExpressRoute.  The [pricing details page](http://azure.microsoft.com/pricing/details/expressroute/) provides details of costs for ExpressRoute.

### What regions is ExpressRoute for Office 365 supported in?
Refer to [ExpressRoute partners and locations](expressroute-locations.md) for more information on the list of partners and locations where ExpressRoute is supported.

### Can I use NSPs and EXPs to connect to Office 365 services?
We support connectivity to Office 365 services through both NSPs and EXPs. Refer to [ExpressRoute partners and locations](expressroute-locations.md) for more information on the list of supported partners and locations.

### Can I access Office 365 over the internet even if ExpressRoute was configured for my organization?
Yes. Office 365 service endpoints are reachable through the internet even though ExpressRoute has been configured for your network. If you are in a location that is configured to connect to Office 365 services through ExpressRoute, you will connect through ExpressRoute.