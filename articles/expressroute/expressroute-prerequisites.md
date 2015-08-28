<properties
   pageTitle="Prerequisites for ExpressRoute adoption | Microsoft Azure"
   description="This page provides a list of requirements to be met before you can order an Azure ExpressRoute circuit."
   documentationCenter="na"
   services="expressroute"
   authors="cherylmc"
   manager="carolz"
   editor="tysonn"/>
<tags
   ms.service="expressroute"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="07/28/2015"
   ms.author="cherylmc"/>


# Azure ExpressRoute prerequisites  

To connect to Microsoft cloud services using ExpressRoute, you’ll need to verify that the following prerequisites have been met.

## Prerequisites for connectivity

- A valid and active Microsoft Azure account.
- A relationship with a network service provider (NSP) or an exchange provider (EXP) from the [supported list](expressroute-locations.md) through whom connectivity needs to be facilitated. You must have an existing business relationship with the network service provider or exchange provider. You’ll need to make sure that the service you use is compatible with ExpressRoute.
- If you want to use a network service provider and your network service provider is not in the supported list, you can still create a connection to Azure.
	- Check with your network provider to see if they are present in any of the Exchange locations appearing in supported list.
	- Have your network provider extend your network to the Exchange location of choice.
	- Order an ExpressRoute circuit through the Exchange provider to connect to Azure.
- Connectivity to the service provider's infrastructure. You must meet the criteria for at least one of the following items:
	- You are a VPN customer of the network service provider and have at least one on-premises site connected to the network service provider’s VPN infrastructure. Check with your network service provider to see if your VPN service meets the requirements for ExpressRoute.
	- Your infrastructure is co-located in the exchange provider’s datacenter.
	- You have Ethernet connectivity to the exchange provider’s Ethernet exchange infrastructure.
- IP addresses and AS numbers for routing configuration.
	- You can use private AS numbers to connect to an Azure private peering routing domain. If you choose to do so, it must be > 65000. For more information about AS numbers, see [Autonomous System (AS) Numbers](http://www.iana.org/assignments/as-numbers/as-numbers.xhtml).
	- IP addresses to configure routes. A /28 subnet is required. This must not overlap with any IP address ranges used in your on-premises or in Azure.
	- You must use your own public AS numbers for configuring BGP sessions with Azure public services.

## Next steps

- For more information about ExpressRoute, see the [ExpressRoute FAQ](expressroute-faqs.md).
- For information about how to configure your ExpressRoute connection, see:
	- [Configure an ExpressRoute connection through a Network Service Provider](expressroute-configuring-nsps.md).
	- [Configure an ExpressRoute connection through an Exchange Provider](expressroute-configuring-exps.md).
