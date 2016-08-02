<properties
	pageTitle="Title | Microsoft Azure"
	description="This provides a comparision of features and guidance on developing applications for Azure Government"
	services=""
	documentationCenter=""
	authors="ryansoc"
	manager=""
	editor=""/>

<tags
	ms.service="multiple"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="azure-government"
	ms.date="10/29/2015"
	ms.author="ryansoc"/>


	#  Azure Government Private Connectivity

	Message to include CAP and TIC.  

	There are two basic services that provDelete details about ER.

	ide private network connectivity into Azure Government: VPN (site-to-site for a typical organization) and ExpressRoute.

	Azure ExpressRoute is used to create private connections between Azure Government datacenters, and your on-premise infrastructure, or in a colocation environment. ExpressRoute connections do not go over the public Internet—they offer more reliability, faster speeds, and lower latencies than typical Internet connections. In some cases, using ExpressRoute connections to transfer data between on premise systems and Azure yields significant cost benefits.   

	With ExpressRoute, you establish connections to Azure at an ExpressRoute location (such as an Exchange provider facility), or you directly connect to Azure from your existing WAN network (such as a multiprotocol label switching (MPLS) VPN, supplied by a network service provider).

	![alt text](./media/azure-government-capability-private-connectivity-options.PNG)  ![alt text](./media/government-capability-expressroute.PNG)  

	For network services to support Azure Government customer applications and solutions, it is strongly recommended that ExpressRoute (private connectivity) is implemented to connect to Azure Government. If VPN connections are used, the following should be considered:

	•	Customers should contact their authorizing official/agency to determine whether private connectivity or other secure connection mechanism is required and to identify any additional restrictions to consider.

	•	Customers should decide whether to mandate that the site-to-site VPN is routed through a private connectivity zone.

	•	Customers should obtain either an MPLS circuit or VPN with a licensed private connectivity access provider.

	All customers who utilize a private connectivity architecture should validate that an appropriate implementation is established and maintained for the customer connection to the Gateway Network/Internet (GN/I) edge router demarcation point for Azure Government. Similarly, your organization must establish network connectivity between your on-premise environment and Gateway Network/Customer (GN/C) edge router demarcation point for Azure Government.

	ExpressRoute is generally available in Azure Government. For more information (including partners and peering locations), please see the <a href="https://azure.microsoft.com/en-us/documentation/services/expressroute/"> ExpressRoute public documentation </a>.

	For supplemental information and updates please subscribe to the
	<a href="https://blogs.msdn.microsoft.com/azuregov/">Microsoft Azure Government Blog. </a>
