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
   ms.date="02/23/2015"
   ms.author="cherylmc" />

#ExpressRoute Service Locations
ExpressRoute is supported across all azure regions and locations. The map below provides a list of Azure regions and ExpressRoute locations. ExpressRotue locations refer to those where Microsoft peers with several service providers.
 
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

Connectivity across geopolitical regions is not supported. You can work with your NSP to extend connectivity across geopolitical regions using their network

## Exchange Provider (EXP) Locations
The table below provides a list of Exchange Providers and locations where they are supported.

| |**Amsterdam**|**Atlanta**|**Chicago**|**Dallas**|**Hong Kong**|**London**|**Los Angeles**|**New York**|**Sao Paulo**|**Seattle**|**Silicon Valley**|**Singapore**|**Sydney**|**Tokyo**|**Washington DC**|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|**[Aryaka](http://www.aryaka.com/)**| | | | | | | | | | |Available|Available| | |Available|
|**[Colt Ethernet](http://www.colt.net/uk/en/news/colt-announces-dedicated-cloud-access-for-microsoft-azure-services-en.htm)**|Available| | | | |Available| | | | | | | | | | |
|**[Equinix](http://www.equinix.com/solutions/partner-solutions/microsoft-windows-azure/)**|Available|Available|Available|Available|Available|Available|Available|Available|Available|Available|Available|Available|Available|Available|Available| 
|**[InterCloud](https://www.intercloud.com/)**|Available| | | | | | | | | | | | | |Available|
|**[Level3 EVPL Service](http://your.level3.com/LP=882?WT.tsrc=02192014LP882AzureVanityAzureText)**| | |Available|Available| |Available| | | |Available|Available| | | |Available|
|**[TeleCityGroup](http://www.telecitygroup.com/investor-centre/news_details.htm?locid=03100500400b00d&xml)**|Available| | | | |Available| | | | | | | | | |
|**[Zayo Group](http://www.zayo.com/)**| | | | | | | | | | | | | | |Available|



Visit the [Exchange Providers page](expressroute-exchange-providers.md) for more information on how to enable the service.


## Network Service Provider (NSP) Locations
The table below provides a list of Network Service Providers and locations where they are supported.

| |**Amsterdam**|**Atlanta**|**Chicago**|**Dallas**|**Hong Kong**|**London**|**Los Angeles**|**New York**|**Sao Paulo**|**Seattle**|**Silicon Valley**|**Singapore**|**Sydney**|**Tokyo**|**Washington DC**|
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|**[AT&T](https://www.synaptic.att.com/clouduser/html/productdetail/ATT_NetBond.htm)**| | | | | | | | | | |Available| | | |Available|
|**[British Telecom](http://www.globalservices.bt.com/uk/en/news/bt_to_provide_connectivity_to_microsoft_azure)**|Available| | | | |Available| | | | | | | | | |
|**[Colt IPVPN](http://www.colt.net/uk/en/news/colt-announces-dedicated-cloud-access-for-microsoft-azure-services-en.htm)**|Available| | | | |Available| | | | | | | | | |
|**[Internet Initiative Japan Inc. - IIJ](http://www.iij.ad.jp/en/news/pressrelease/2013/pdf/Azure_E.pdf)**| | | | | | | | | | | | | |Available| |
|**[Level3 IPVPN](http://your.level3.com/LP=882?WT.tsrc=02192014LP882AzureVanityAzureText)**| | |Available|Available| |Available| | | |Available|Available| | | |Available|
|**[Orange](http://www.orange-business.com/)**|Available| | | | |Available| | | | | | | | | |
|**[SingTel](http://info.singtel.com/about-us/news-releases/singtel-provide-secure-private-access-microsoft-azure-public-cloud)**| | | | | | | | | | | |Available| | | |
|**[Tata Communications](http://www.tatacommunications.com/lp/izo/azure/azure_index.html)**| | | | |Available| | | | | | |Available| | | |
|**[Telstra Corporation](http://www.telstra.com.au/business-enterprise/network-services/networks/cloud-direct-connect/)**| | | | | | | | | | | | |Available| | |
|**[Verizon](http://www.verizonenterprise.com/news/2014/04/secure-cloud-interconnect-solutions-enterprise)**| | | | | |Available| | | | |Available| | | |Available|

Visit the [Network Service Providers page](expressroute-network-service-providers.md) for more information on how to enable the service.

## Connectivity through service providers that are not listed above
If your network provider is not in the list above, you can still get connected to Azure. 

- Check with your network provider to see if they are present in any of the Exchange locations listed above.
- Have your network provider extend your network to the Exchange location of choice.
- Order an ExpressRoute circuit through the Exchange provider to connect to Azure.

