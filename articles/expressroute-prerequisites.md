<properties
   pageTitle="Prerequisites for ExpressRoute adoption"
   description="This page provides a list of requirements to be met before you can order an ExpressRoute circuit."
   services="expressroute"
   documentationCenter="na"
   authors="cherylmc"
   manager="adinah"
   editor="tysonn" />
<tags 
   ms.service="expressroute"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="02/23/2015"
   ms.author="cherylmc" />

# Prerequisites to connectivity 
In order to connect to Azure by using ExpressRoute, you’ll need to verify that the following prerequisites have been met. You must have the following:

- Microsoft Azure Account
- A relationship with a network service provider or an exchange provider from the [supported list](expressroute-locations.md) through whom connectivity needs to be facilitated. You must have an existing business relationship with the network service provider or exchange provider. You’ll need to make sure that the service you use is compatible with ExpressRoute. 
- If you want to use a network service provider and your network service provider is not in the list above, you can still get connected to Azure. 
-- Check with your network provider to see if they are present in any of the Exchange locations listed above.
    Have your network provider extend your network to the Exchange location of choice.
    Order an ExpressRoute circuit through the Exchange provider to connect to Azure.
- Contact your Microsoft account team. We recommend contacting your Microsoft account team. Your account team can work with you and your service provider to prioritize your request.

##Connectivity to the service provider’s infrastructure
You must meet the criteria of at least one of the following items listed:

- You are a VPN customer of the network service provider and have at least one on-premises site connected to the network service provider’s VPN infrastructure. Check with your network service provider to see if your VPN service meets the requirements for ExpressRoute.
- Your infrastructure is co-located in the exchange provider’s datacenter.
- You have Ethernet connectivity to the exchange provider’s Ethernet exchange infrastructure.

##IP addresses and AS numbers for routing configuration.
You must use your own public AS numbers for configuring BGP sessions with Azure.

- You can use private AS numbers. If you choose to do so, it must be > 65000. For more information about AS numbers, see Autonomous System (AS) Numbers.
- IP addresses to configure routes. A /28 subnet is required. This must not overlap with any IP address ranges used in your on-premises or in Azure.
- You must use your own public AS numbers for configuring BGP sessions with Azure.
- You can use private AS numbers. If you choose to do so, it must be > 65000. 

For more information about AS numbers, see [Autonomous System (AS) Numbers](http://www.iana.org/assignments/as-numbers/as-numbers.xhtml).
