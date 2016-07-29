<properties
   pageTitle="ExpressRoute locations | Microsoft Azure"
   description="This article provides a detailed overview of locations where services are offered and how to connect to Azure regions."
   services="expressroute"
   documentationCenter="na"
   authors="cherylmc"
   manager="carmonm"
   editor="" />
<tags
   ms.service="expressroute"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="07/28/2016"
   ms.author="cherylmc" />

# ExpressRoute partners and peering locations

The tables in this article provide information on ExpressRoute connectivity providers, ExpressRoute geographical coverage, Microsoft cloud services supported over ExpressRoute, and ExpressRoute System Integrators (SIs).

## <a name="partners"></a>ExpressRoute connectivity providers

ExpressRoute is supported across all Azure regions and locations. The following map provides a list of Azure regions and ExpressRoute locations. ExpressRoute locations refer to those where Microsoft peers with several service providers.

![Location map][0]

You will have access to Azure services across all regions within a geopolitical region if you connected to at least one ExpressRoute location within the geopolitical region. The following table provides a map of Azure regions to ExpressRoute locations within a geopolitical region.

|**Geopolitical region**|**Azure regions**|**ExpressRoute locations**|
|---|---|---|
|**North America**|East US, West US, East US 2, Central US, South Central US, North Central US, Canada Central, Canada East|Atlanta, Chicago, Dallas, Las Vegas+, Los Angeles, New York, Seattle, Silicon Valley, Washington DC, Montreal+, Quebec City+, Toronto|
|**South America**|Brazil South|Sao Paulo|
|**Europe**|North Europe, West Europe|Amsterdam, Dublin, London, Newport(Wales)+, Paris|
|**Asia**|East Asia, Southeast Asia|Hong Kong, Singapore|
|**Japan**|Japan West, Japan East|Osaka, Tokyo|
|**Australia**|Australia Southeast, Australia East|Melbourne, Sydney|
|**India**|India West, India Central, India South|Chennai, Mumbai|



The table below provides information on regions and geopolitical boundaries for national clouds.

|**Geopolitical region**|**Azure regions**|**ExpressRoute locations**|
|---|---|---|---|
|**US Government cloud**|US Gov Iowa, US Gov Virginia|Chicago, Dallas+, New York, Washington DC|
|**China**|China North, China East|Beijing, Shanghai|
|**Germany**|Germany Central, Germany East|Berlin, Frankfurt|


Connectivity across geopolitical regions is not supported on the standard ExpressRoute SKU. You will need to enable the ExpressRoute premium add-on to support global connectivity. Connectivity to national cloud environments is not supported. You can work with your connectivity provider if such a need arises.


## Connectivity provider locations

> [AZURE.SELECTOR]
[Locations By Provider](expressroute-locations.md#connectivity-provider-locations)
[Providers By Location](expressroute-locations-providers.md#connectivity-provider-locations)

### Production Azure

| **Service provider**  |**Microsoft Azure** | **Office 365 and CRM Online** | **Locations** |
|-----------------------|--------------------|----------------|---------------|
| **[Aryaka Networks]( http://www.aryaka.com/)** | Supported | Supported | Amsterdam, Silicon Valley, Singapore, Tokyo, Washington DC |
| **[AT&T NetBond]( https://www.synaptic.att.com/clouduser/html/productdetail/ATT_NetBond.htm)** | Supported | Supported | Amsterdam, Chicago, Dallas, London, Silicon Valley, Singapore, Sydney, Washington DC |
| **[British Telecom]( http://www.globalservices.bt.com/uk/en/news/bt_to_provide_connectivity_to_microsoft_azure)** | Supported | Supported | Amsterdam, Hong Kong, London, Silicon Valley, Singapore, Sydney, Tokyo, Washington DC |
|**CenturyLink** | Coming soon | Coming soon| Silicon Valley |
|**China Telecom Global** | Supported | Not Supported | Hong Kong |
|**[Cologix](http://www.cologix.com/solutions/cloud-connect/public-clouds/microsoft-cloud/)** | Supported | Coming soon | Montreal+, Toronto |
| **[Colt]( http://www.colt.net/uk/en/news/colt-announces-dedicated-cloud-access-for-microsoft-azure-services-en.htm)**  |  Supported | Supported | Amsterdam, Dublin, London, Tokyo |
| **Comcast** | Supported | Supported | Chicago, Silicon Valley, Washington DC |
| **[CoreSite](http://www.coresite.com/solutions/cloud-services/public-cloud-providers/microsoft-azure-expressroute)** | Supported | Supported | Los Angeles | 
| **[Equinix](http://www.equinix.com/partners/microsoft-azure/)** | Supported | Supported | Amsterdam, Atlanta, Chicago, Dallas, Hong Kong, London, Los Angeles, Melbourne, New York, Osaka, Sao Paulo, Seattle, Silicon Valley, Singapore, Sydney, Tokyo, Toronto, Washington DC |
| **euNetworks** |  Supported | Supported | Amsterdam |
| **GÉANT** | Coming soon | Coming soon | Amsterdam+ |
| **[Internet Initiative Japan Inc. - IIJ](http://www.iij.ad.jp/en/news/pressrelease/2015/1216-2.html)** |  Supported | Supported | Osaka, Tokyo |
| **[InterCloud]( https://www.intercloud.com/)** | Supported | Supported | Amsterdam, London, Singapore, Washington DC |
| **Internet Solutions - Cloud Connect** | Supported | Supported | Amsterdam, London |
| **Interxion** | Supported | Supported | Amsterdam, London, Paris |
| **Jisc** | Coming soon | Coming soon | London+ | 
| **[Level 3 Communications]( http://your.level3.com/LP=882?WT.tsrc=02192014LP882AzureVanityAzureText)** | Supported | Supported | Amsterdam, Chicago, Dallas, Las Vegas+, London, Seattle, Silicon Valley, Washington DC |
| **Megaport** | Supported | Supported | Dallas, Hong Kong, Las Vegas+, Los Angeles, Melbourne, New York, Seattle, Singapore, Sydney, Washington DC |
| **MTN** | Supported | Supported | London |
| **NEXTDC** | Supported | Supported | Melbourne, Sydney |
| **NTT Communications** | Supported | Supported | London, Osaka, Tokyo |
| **[Orange]( http://www.orange-business.com/en/products/business-vpn-galerie)** | Supported | Supported | Amsterdam, Hong Kong, London, Silicon Valley, Singapore, Washington DC |
| **PCCW Global Limited** | Supported | Supported | Hong Kong |
| **[SingTel]( http://info.singtel.com/about-us/news-releases/singtel-provide-secure-private-access-microsoft-azure-public-cloud)** |  Supported | Supported | Singapore |
| **Softbank** | Supported | Supported | Osaka, Tokyo | 
| **[Tata Communications](http://www.tatacommunications.com/lp/izo/azure/azure_index.html)** | Supported | Supported | Amsterdam, Chennai, Hong Kong, London, Mumbai, Silicon Valley, Singapore, Washington DC |
| **[TeleCity Group]( http://www.telecitygroup.com/investor-centre/news_details.htm?locid=03100500400b00d&xml)** | Supported | Supported | Amsterdam, London |
| **Telefonica** | Coming soon | Coming soon | Sao Paulo+ |
| **Telenor** | Supported | Supported | Amsterdam, London |
| **[Telstra Corporation]( http://www.telstra.com.au/business-enterprise/network-services/networks/cloud-direct-connect/)** | Supported | Coming Soon | Melbourne, Sydney |
| **[Verizon](http://www.verizonenterprise.com/products/networking/secure-cloud-interconnect/)** | Supported | Supported | Amsterdam, Hong Kong, London, Silicon Valley, Singapore, Sydney, Tokyo, Washington DC |
| **Vodafone** | Supported | Not Supported | London | 
| **[Zayo Group]( http://www.zayo.com/solutions/industries/connect-to-cloud-data-centers/cloud-connectivity/microsoft-expressroute/)** | Supported | Supported | Chicago, Los Angeles, New York, Silicon Valley, Toronto, Washington DC |

 **+** denotes coming soon

### National cloud environments

#### US Government cloud

| **Service provider**  |**Microsoft Azure** | **Office 365** | **Locations** |
|-----------------------|--------------------|----------------|---------------|
| **[AT&T NetBond]( https://www.synaptic.att.com/clouduser/html/productdetail/ATT_NetBond.htm)** | Supported | Supported | Chicago, Washington DC |
| **[Equinix](http://www.equinix.com/partners/microsoft-azure/)** | Supported | Supported | Chicago, Dallas+, New York, Washington DC |
| **[Level 3 Communications]( http://your.level3.com/LP=882?WT.tsrc=02192014LP882AzureVanityAzureText)** | Supported | Coming soon | Chicago, New York+, Washington DC |
| **[Verizon](http://news.verizonenterprise.com/2014/04/secure-cloud-interconnect-solutions-enterprise/)** | Supported | Supported | Chicago, Dallas+, New York, Washington DC |

#### China

| **Service provider**  |**Microsoft Azure** | **Office 365** | **Locations** |
|-----------------------|--------------------|----------------|---------------|
| **China Telecom** | Supported | Not Supported | Beijing, Shanghai|
To learn more, see [ExpressRoute in China](http://www.windowsazure.cn/home/features/expressroute/).

#### Germany

| **Service provider**  |**Microsoft Azure** | **Office 365** | **Locations** |
|-----------------------|--------------------|----------------|---------------|
| **[Colt]( http://www.colt.net/uk/en/news/colt-announces-dedicated-cloud-access-for-microsoft-azure-services-en.htm)** | Supported | Not Supported | Berlin+, Frankfurt|
| **[Equinix](http://www.equinix.com/partners/microsoft-azure/)** | Coming soon | Not Supported | Frankfurt+|
| **e-shelter** | Coming soon | Not Supported | Berlin+|
| **Interxion** | Supported | Not Supported | Frankfurt|

## <a name="nonpartners"></a>Connectivity through service providers not listed

If your connectivity provider is not listed in previous sections, you can still create a connection.

- Check with your connectivity provider to see if they are connected to any of the exchanges in the table above. You can check the following links to gather more information about services offered by exchange providers. Several connectivity providers are already connected to Ethernet exchanges.

	- [Equinix Cloud Exchange](http://www.equinix.com/services/interconnection-connectivity/cloud-exchange/)
	- [TeleCity CloudIX](http://www.telecitygroup.com/colocation-services/cloud-ix.htm)
	- [InterXion](http://www.interxion.com/)
	- [NextDC](http://www.nextdc.com/)
	- [CoreSite](http://www.coresite.com/)
	- [Cologix](http://www.cologix.com/)
- Have your connectivity provider extend your network to the peering location of choice.
	- Ensure that your connectivity provider extends your connectivity in a highly available manner so that there are no single points of failure.
- Order an ExpressRoute circuit with the exchange as your connectivity provider to connect to Microsoft.
	- Follow steps in [Create an ExpressRoute circuit](expressroute-howto-circuit-classic.md) to set up connectivity.

|**Connectivity provider**|**Exchange**|**Locations**|
|---|---|---|
|**Alaska Communications**|Equinix|Seattle|
|**[XO Communications](http://www.xo.com/)**|Equinix|Silicon Valley|
|**[1CLOUDSTAR](http://www.1cloudstar.com/service/cloudconnect-azure-expressroute/)**|Equinix|Singapore|

## ExpressRoute system integrators

Enabling private connectivity to fit your needs can be challenging, based on the scale of your network. You can work with any of the system integrators listed in the following table to assist you with onboarding to ExpressRoute.

|**System integrator**|**Continent**|
|---|---|
|**[Avanade Inc.](http://www.avanade.com/)**| Asia, Europe, US |
|**[Dotnet Solutions](http://www.dotnetsolutions.co.uk/)**| Europe |
|**[Equinix Professional Services](http://www.equinix.com/services/consulting/)**|US|
|**[OneAs1a](http://www.oneas1a.com/express-connect-any-cloud-ecac)** | Asia |
|**[Perficient](http://www.perficient.com/Partners/Microsoft/Cloud/Azure-ExpressRoute)** | US |
|**[Project Leadership](http://www.projectleadership.net/azure)** | US |

## Next steps

- For more information about ExpressRoute, see the [ExpressRoute FAQ](expressroute-faqs.md).
- Ensure that all prerequisites are met. See [ExpressRoute prerequisites](expressroute-prerequisites.md).

<!--Image References-->
[0]: ./media/expressroute-locations/expressroute-locations-map.png "Location map"
