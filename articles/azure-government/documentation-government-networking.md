<properties
	pageTitle="Azure Governmenmt documentation | Microsoft Azure"
	description="This provides a comparison of features and guidance for private connectivity to e Government"
	services="Azure-Government"
	cloud="gov" 
	documentationCenter=""
	authors="ryansoc"
	manager="zakramer"
	editor=""/>

<tags
	ms.service="multiple"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="azure-government"
	ms.date="09/28/2016"
	ms.author="ryansoc"/>

#  Azure Government Networking

##  ExpressRoute (Private Connectivity)

ExpressRoute is generally available in Azure Government. For more information (including partners and peering locations), see the <a href="https://azure.microsoft.com/en-us/documentation/services/expressroute/"> ExpressRoute public documentation </a>.

###  Variations

ExpressRoute is generally available (GA) in Azure Government. 

- Government customers connect to a physically isolated capacity over a dedicated Azure Government (Gov)  ExpressRoute (ER) connection

- Azure Gov provides Increased availability & durability by leveraging multiple region pairs located a minimum of 500 miles apart 

- By default all Azure Gov ER connectivity is configured active-active redundant with support for bursting and delivers up to 10G circuit capacity (smallest is 50MB)

- Azure Gov ER locations provide optimized pathways (shortest hops, low latency, high performance, etc.) for customers and Azure Gov geo-redundant regions

- The Azure Gov ER private connection does not utilize, traverse, or depend on the Internet

- Azure Gov physical and logical infrastructure is physically dedicated and separated, and access is restricted to U.S. persons

- Microsoft owns and operates all fiber infrastructure between Azure Gov Regions and Azure Gov ER Meet-Me locations

- Azure Gov ER provides connectivity to Microsoft Azure, O365, and CRM cloud services

### Considerations

There are two basic services that provide private network connectivity into Azure Government: VPN (site-to-site for a typical organization) and ExpressRoute.

Azure ExpressRoute is used to create private connections between Azure Government datacenters, and your on-premise infrastructure, or in a colocation environment. ExpressRoute connections do not go over the public Internet—they offer more reliability, faster speeds, and lower latencies than typical Internet connections. In some cases, using ExpressRoute connections to transfer data between on premise systems and Azure yields significant cost benefits.   

With ExpressRoute, you establish connections to Azure at an ExpressRoute location (such as an Exchange provider facility), or you directly connect to Azure from your existing WAN network (such as a multiprotocol label switching (MPLS) VPN, supplied by a network service provider).

![alt text](./media/azure-government-capability-private-connectivity-options.PNG)  ![alt text](./media/government-capability-expressroute.PNG)  

For network services to support Azure Government customer applications and solutions, it is strongly recommended that ExpressRoute (private connectivity) is implemented to connect to Azure Government. If VPN connections are used, the following should be considered:

- Customers should contact their authorizing official/agency to determine whether private connectivity or other secure connection mechanism is required and to identify any additional restrictions to consider.

- Customers should decide whether to mandate that the site-to-site VPN is routed through a private connectivity zone.

- Customers should obtain either an MPLS circuit or VPN with a licensed private connectivity access provider.

All customers who utilize a private connectivity architecture should validate that an appropriate implementation is established and maintained for the customer connection to the Gateway Network/Internet (GN/I) edge router demarcation point for Azure Government. Similarly, your organization must establish network connectivity between your on-premise environment and Gateway Network/Customer (GN/C) edge router demarcation point for Azure Government.

## Next Steps

For supplemental information and updates please subscribe to the
<a href="https://blogs.msdn.microsoft.com/azuregov/">Microsoft Azure Government Blog. </a>
