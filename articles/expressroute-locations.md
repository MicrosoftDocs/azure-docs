<properties
   pageTitle="ExpressRoute Locations"
   description="This page provides a detailed overview of locations where services are offered and how to connect to Azure regions."
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
   ms.date="03/31/2015"
   ms.author="cherylmc" />

# Connectivity Providers and Peering Locations
ExpressRoute is supported across all Azure regions and locations. The map below provides a list of Azure regions and ExpressRoute locations. ExpressRotue locations refer to those where Microsoft peers with several service providers.
 
![](./media/expressroute-locations/expressroute-locations-map.png)

You will have access to Azure services across all regions within a geopolitical region if you connected to at least one ExpressRoute location within the geopolitical region. The table below provides a map of azure regions to ExpressRoute locations within a geopolitical region.

|**Geopolitical Region**|**Azure Regions**|**ExpressRoute Locations**|
|---|---|---|
|**US**|All US Regions - East US, West US,East US 2, Central US, South Central US, North Central US|Atlanta, Chicago, Dallas, Los Angeles, New York, Seattle, Silicon Valley, Washington DC|
|**South America**|Brazil South|Sao Paulo|
|**Europe**|North Europe, West Europe|Amsterdam, London|
|**Asia**|East Asia, Southeast Asia|Hong Kong, Singapore|
|**Japan**|Japan West, Japan East|Tokyo|
|**Australia**|Australia Southeast, Australia East|Sydney|

Connectivity across geopolitical regions is not supported. You can work with your connectivity provider to extend connectivity across geopolitical regions using their network.

## Exchange Provider (EXP) Locations
- See this [table](https://msdn.microsoft.com/library/azure/4da69a0f-8f52-49ea-a990-dacd4202150a#BKMK_EXP) for a list of Exchange Providers and locations where they are supported.
-  Visit the [Configure your EXP connection](https://msdn.microsoft.com/library/azure/dn606306.aspx) for steps to set up your connection.

## Network Service Provider (NSP) Locations
- See this [table](https://msdn.microsoft.com/library/azure/4da69a0f-8f52-49ea-a990-dacd4202150a#BKMK_NSP) for a list of Network Service Providers and locations where they are supported.
- Visit [Configure your NSP connection](https://msdn.microsoft.com/library/azure/dn643736.aspx) for steps to set up your connection.

## Connectivity through service providers not listed above

If your connectivity provider is not in the list above sections, you can still create a connection.

- Check with your connectivity provider to see if they are connected to any of the Exchange providers in the listed EXP locations. You can check the links below to gather more information on services offered by Exchange Providers. Several connectivity providers are already connected to EXPs' Ethernet exchanges.
	- [Equinix Cloud Exchange](http://www.equinix.com/services/interconnection-connectivity/cloud-exchange/) 
	- [TeleCity CloudIX](http://www.telecitygroup.com/colocation-services/cloud-ix.htm)
- Have your connectivity provider extend your network to the Exchange location of choice.
	- Ensure that your connectivity provider extends your connectivity in a highly available manner so that there are no single points of failure.
	- Connectivity providers (specifically Ethernet providers) may require you to procure a pair of circuits to the Ethernet exchanges to ensure high availability 
- Order an ExpressRoute circuit through the Exchange provider to connect to Azure
	- Follow steps in [Configure your EXP connection](https://msdn.microsoft.com/library/azure/dn606306.aspx) to set up connectivity.

## Next Steps
- Verify that you meet the [ExpressRoute prerequisites](https://msdn.microsoft.com/library/azure/dn606309#ExpressRoute_prereq).
- Visit the [FAQ](https://msdn.microsoft.com/library/azure/dn606292.aspx) for more information.
- Select your provider and configure your connection. See 
[Configure your EXP connection](https://msdn.microsoft.com/library/azure/dn606306.aspx) or [Configure your NSP connection](https://msdn.microsoft.com/library/azure/dn643736.aspx) for configuration information.



