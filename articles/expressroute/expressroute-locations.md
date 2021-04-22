---
title: 'Connectivity providers and locations: Azure ExpressRoute | Microsoft Docs'
description: This article provides a detailed overview of locations where services are offered and how to connect to Azure regions. Sorted by connectivity provider.
services: expressroute
author: duongau

ms.service: expressroute
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 02/10/2021
ms.author: duau

---
# ExpressRoute connectivity partners and peering locations

> [!div class="op_single_selector"]
> * [Locations By Provider](expressroute-locations.md)
> * [Providers By Location](expressroute-locations-providers.md)


The tables in this article provide information on ExpressRoute geographical coverage and locations, ExpressRoute connectivity providers,and ExpressRoute System Integrators (SIs).

> [!Note]
> Azure regions and ExpressRoute locations are two distinct and different concepts, understanding the difference between the two is critical to exploring Azure hybrid networking connectivity. 
>
>

## Azure regions
Azure regions are global datacenters where Azure compute, networking and storage resources are located. When creating an Azure resource, a customer needs to select a resource location. The resource location determines which Azure datacenter (or availability zone) the resource is created in.

## ExpressRoute locations
ExpressRoute locations (sometimes referred to as peering locations or meet-me-locations) are co-location facilities where Microsoft Enterprise Edge (MSEE) devices are located. ExpressRoute locations are the entry point to Microsoft's network – and are globally distributed, providing customers the opportunity to connect to Microsoft's network around the world. These locations are where ExpressRoute partners and ExpressRoute Direct customers issue cross connections to Microsoft's network. In general, the ExpressRoute location does not need to match the Azure region. For example, a customer can create an ExpressRoute circuit with the resource location *East US*, in the *Seattle* Peering location.

You will have access to Azure services across all regions within a geopolitical region if you connected to at least one ExpressRoute location within the geopolitical region.

## <a name="locations"></a>Azure regions to ExpressRoute locations within a geopolitical region.
The following table provides a map of Azure regions to ExpressRoute locations within a geopolitical region.

| **Geopolitical region** | **Azure regions** | **ExpressRoute locations** |
| --- | --- | --- |
| **Australia Government** |Australia Central, Australia Central 2 |Canberra, Canberra2 |
| **Europe** | France Central, France South, Germany North, Germany West Central, North Europe, Norway East, Norway West, Switzerland North, Switzerland West, UK West, UK South, West Europe |Amsterdam, Amsterdam2, Berlin, Copenhagen, Dublin, Frankfurt, Frankfurt2, Geneva, London, London2, Madrid, Marseille, Milan, Munich, Newport(Wales), Oslo, Paris, Stavanger, Stockholm, Zurich |
| **North America** |East US, West US, East US 2, West US 2, Central US, South Central US, North Central US, West Central US, Canada Central, Canada East |Atlanta, Chicago, Dallas, Denver, Las Vegas, Los Angeles, Los Angeles2, Miami, Minneapolis, Montreal, New York, Phoenix, Quebec City, Queretaro(Mexico), Quincy, San Antonio, Seattle, Silicon Valley, Silicon Valley2, Toronto, Toronto2, Vancouver, Washington DC, Washington DC2 |
| **Asia** | East Asia, Southeast Asia | Bangkok, Hong Kong, Hong Kong2, Jakarta, Kuala Lumpur, Singapore, Singapore2, Taipei |
| **India** | India West, India Central, India South |Chennai, Chennai2, Mumbai, Mumbai2 |
| **Japan** | Japan West, Japan East |Osaka, Tokyo, Tokyo2 |
| **Oceania** | Australia Southeast, Australia East |Auckland, Melbourne, Perth, Sydney, Sydney2 |
| **South Korea** | Korea Central, Korea South |Busan, Seoul|
| **UAE** | UAE Central, UAE North | Dubai, Dubai2 |
| **South Africa** | South Africa West, South Africa North |Cape Town, Johannesburg |
| **South America** | Brazil South |Bogota, Rio de Janeiro, Sao Paulo |


## Regions and geopolitical boundaries for national clouds
The table below provides information on regions and geopolitical boundaries for national clouds.

| **Geopolitical region** | **Azure regions** | **ExpressRoute locations** |
| --- | --- | --- |
| **US Government cloud** |US Gov Arizona, US Gov Iowa, US Gov Texas, US Gov Virginia, US DoD Central, US DoD East  |Atlanta,Chicago, Dallas, New York, Phoenix, San Antonio, Seattle, Silicon Valley, Washington DC |
| **China East** |China East, China East2 |Shanghai, Shanghai2 |
| **China North** |China North, China North2 |Beijing, Beijing2 |
| **Germany** |Germany Central, Germany East |Berlin, Frankfurt |

Connectivity across geopolitical regions is not supported on the standard ExpressRoute SKU. You will need to enable the ExpressRoute premium add-on to support global connectivity. Connectivity to national cloud environments is not supported. You can work with your connectivity provider if such a need arises.

## <a name="partners"></a>ExpressRoute connectivity providers

The following table shows locations by service provider. If you want to view available providers by location, see [Service providers by location](expressroute-locations-providers.md).


### Global commercial Azure

| **Service provider** | **Microsoft Azure** | **Microsoft 365**  | **Locations** |
| --- | --- | --- | --- |
| **[AARNet](https://www.aarnet.edu.au/network-and-services/connectivity-services/azure-expressroute)** |Supported |Supported |Melbourne, Sydney |
| **[Airtel](https://www.airtel.in/business/#/)** | Supported | Supported | Chennai2, Mumbai2 |
| **[AIS](https://business.ais.co.th/solution/en/azure-expressroute.html)** | Supported | Supported | Bangkok |
| **[Aryaka Networks](https://www.aryaka.com/)** |Supported |Supported |Amsterdam, Chicago, Dallas, Hong Kong SAR, Sao Paulo, Seattle, Silicon Valley, Singapore, Tokyo, Washington DC |
| **[Ascenty Data Centers](https://www.ascenty.com/en/cloud/microsoft-express-route)** |Supported |Supported |Sao Paulo |
| **[AT&T NetBond](https://www.synaptic.att.com/clouduser/html/productdetail/ATT_NetBond.htm)** |Supported |Supported |Amsterdam, Chicago, Dallas, Frankfurt, London, Silicon Valley, Singapore, Sydney, Tokyo, Toronto, Washington DC |
| **[AT TOKYO](https://www.attokyo.com/connectivity/azure.html)** | Supported | Supported | Osaka, Tokyo2 |
| **[BBIX](https://www.bbix.net/en/service/ix/)** | Supported | Supported | Tokyo |
| **[BCX](https://www.bcx.co.za/solutions/connectivity/data-networks)** |Supported |Supported |Cape Town, Johannesburg|
| **[Bell Canada](https://business.bell.ca/shop/enterprise/cloud-connect-access-to-cloud-partner-services)** |Supported |Supported |Montreal, Toronto, Quebec City |
| **[British Telecom](https://www.globalservices.bt.com/en/solutions/products/cloud-connect-azure)** |Supported |Supported |Amsterdam, Amsterdam2, Chicago, Hong Kong SAR, Johannesburg, London, London2, Newport(Wales), Paris, Sao Paulo, Silicon Valley, Singapore, Sydney, Tokyo, Washington DC |
| **[BSNL](https://www.bsnl.co.in/opencms/bsnl/BSNL/services/enterprises/cloudway.html)** |Supported |Supported |Chennai, Mumbai |
| **[C3ntro](https://www.c3ntro.com/)** |Supported |Supported |Miami |
| **CDC** | Supported | Supported | Canberra, Canberra2 |
| **[CenturyLink Cloud Connect](https://www.centurylink.com/cloudconnect)** |Supported |Supported |Amsterdam2, Chicago, Dublin, Frankfurt, Hong Kong, Las Vegas, London2, New York, Paris, San Antonio, Silicon Valley, Tokyo, Toronto, Washington DC, Washington DC2 |
| **[Chief Telecom](https://www.chief.com.tw/)** |Supported |Supported |Hong Kong, Taipei |
| **China Mobile International** |Supported |Supported | Hong Kong, Hong Kong2, Singapore |
| **China Telecom Global** |Supported |Supported |Hong Kong, Hong Kong2 |
| **China Unicom Global** |Supported |Supported | Hong Kong, Singapore2 |
| **[Chunghwa Telecom](https://www.cht.com.tw/en/home/cht/about-cht/products-and-services/International/Cloud-Service)** |Supported |Supported |Taipei |
| **[Claro](https://www.usclaro.com/enterprise-mnc/connectivity/mpls/)** |Supported |Supported |Miami |
| **[Cologix](https://www.cologix.com/hyperscale/microsoft-azure/)** |Supported |Supported |Chicago, Dallas, Minneapolis, Montreal, Toronto, Vancouver, Washington DC |
| **[Colt](https://www.colt.net/direct-connect/azure/)** |Supported |Supported |Amsterdam, Amsterdam2, Berlin, Chicago, Dublin, Frankfurt, Hong Kong, London, London2, Milan, Newport, New York, Osaka, Paris, Silicon Valley, Silicon Valley2, Singapore2, Tokyo, Washington DC, Zurich |
| **[Comcast](https://business.comcast.com/landingpage/microsoft-azure)** |Supported |Supported |Chicago, Silicon Valley, Washington DC |
| **[CoreSite](https://www.coresite.com/solutions/cloud-services/public-cloud-providers/microsoft-azure-expressroute)** |Supported |Supported |Chicago, Denver, Los Angeles, New York, Silicon Valley, Silicon Valley2, Washington DC, Washington DC2 |
| **[DE-CIX](https://www.de-cix.net/en/de-cix-service-world/cloud-exchange/find-a-cloud-service/detail/microsoft-azure)** | Supported |Supported |Amsterdam2, Dubai2, Frankfurt, Marseille, Mumbai, Munich, New York |
| **[Devoli](https://devoli.com/expressroute)** | Supported |Supported | Auckland, Melbourne, Sydney |
| **du datamena** |Supported |Supported | Dubai2 |
| **eir** |Supported |Supported |Dublin|
| **[Epsilon Global Communications](https://www.epsilontel.com/solutions/direct-cloud-connect)** |Supported |Supported |Singapore, Singapore2 |
| **[Equinix](https://www.equinix.com/partners/microsoft-azure/)** |Supported |Supported |Amsterdam, Amsterdam2, Atlanta, Berlin, Bogota, Canberra2, Chicago, Dallas, Dubai2, Dublin, Frankfurt, Frankfurt2, Geneva, Hong Kong SAR, London, London2, Los Angeles, Los Angeles2, Melbourne, Miami, Milan, New York, Osaka, Paris, Rio de Janeiro, Sao Paulo, Seattle, Seoul, Silicon Valley, Singapore, Stockholm, Sydney, Tokyo, Toronto, Washington DC, Zurich |
| **Etisalat UAE** |Supported |Supported |Dubai|
| **[euNetworks](https://eunetworks.com/services/solutions/cloud-connect/microsoft-azure-expressroute/)** |Supported |Supported |Amsterdam, Amsterdam2, Dublin, Frankfurt, London |
| **[FarEasTone](https://www.fetnet.net/corporate/en/Enterprise.html)** |Supported |Supported |Taipei|
| **[Fastweb](https://www.fastweb.it/grandi-aziende/cloud/scheda-prodotto/fastcloud-interconnect/)** | Supported |Supported |Milan|
| **[Fibrenoire](https://fibrenoire.ca/en/services/cloudextn-2/)** |Supported |Supported |Montreal|
| **[GÉANT](https://www.geant.org/Networks)** |Supported |Supported |Amsterdam, Amsterdam2, Dublin, Frankfurt, Marseille |
| **[GlobalConnect]()** | Supported |Supported | Oslo, Stavanger | 
| **GTT** |Supported |Supported |London2 |
| **[Global Cloud Xchange (GCX)](https://globalcloudxchange.com/cloud-platform/cloud-x-fusion/)** | Supported| Supported | Chennai, Mumbai |
| **[iAdvantage](https://www.scx.sunevision.com/)** | Supported | Supported | Hong Kong2 |
| **Intelsat** | Supported | Supported | Washington DC2 |
| **[InterCloud](https://www.intercloud.com/)** |Supported |Supported |Amsterdam, Chicago, Frankfurt, Hong Kong, London, New York, Paris, Silicon Valley, Singapore, Washington DC, Zurich |
| **[Internet2](https://internet2.edu/services/cloud-connect/#service-cloud-connect)** |Supported |Supported |Chicago, Dallas, Silicon Valley, Washington DC |
| **[Internet Initiative Japan Inc. - IIJ](https://www.iij.ad.jp/en/news/pressrelease/2015/1216-2.html)** |Supported |Supported |Osaka, Tokyo |
| **[Internet Solutions - Cloud Connect](https://www.is.co.za/solution/cloud-connect/)** |Supported |Supported |Cape Town, Johannesburg, London |
| **[Interxion](https://www.interxion.com/why-interxion/colocate-with-the-clouds/Microsoft-Azure/)** |Supported |Supported |Amsterdam, Amsterdam2, Copenhagen, Dublin, Frankfurt, London, Madrid, Marseille, Paris, Zurich |
| **[IRIDEOS](https://irideos.it/)** |Supported |Supported |Milan |
| **Iron Mountain** | Supported |Supported |Washington DC |
| **[IX Reach](https://www.ixreach.com/partners/cloud-partners/microsoft-azure/)**|Supported |Supported | Amsterdam, London2, Silicon Valley, Toronto, Washington DC |
| **Jaguar Network** |Supported |Supported |Marseille, Paris |
| **[Jisc](https://www.jisc.ac.uk/microsoft-azure-expressroute)** |Supported |Supported |London, Newport(Wales) |
| **[KINX](https://www.kinx.net/service/cloudhub/ms-expressroute/?lang=en)** |Supported |Supported |Seoul |
| **[Kordia](https://www.kordia.co.nz/cloudconnect)** | Supported |Supported |Auckland, Sydney |
| **[KPN](https://www.kpn.com/zakelijk/cloud/connect.htm)** | Supported | Supported | Amsterdam |
| **[KT](https://cloud.kt.com/)** | Supported | Supported | Seoul |
| **[Level 3 Communications](http://your.level3.com/LP=882?WT.tsrc=02192014LP882AzureVanityAzureText)** |Supported |Supported |Amsterdam, Chicago, Dallas, London, Newport (Wales), Sao Paulo, Seattle, Silicon Valley, Singapore, Washington DC |
| **LG CNS** |Supported |Supported |Busan, Seoul |
| **[Liquid Telecom](https://www.liquidtelecom.com/products-and-services/cloud.html)** |Supported |Supported |Cape Town, Johannesburg |
| **[Megaport](https://www.megaport.com/services/microsoft-expressroute/)** |Supported |Supported |Amsterdam, Atlanta, Auckland, Chennai, Chicago, Dallas, Denver, Dubai2, Dublin, Frankfurt, Geneva, Hong Kong, Hong Kong2, Las Vegas, London, London2, Los Angeles, Melbourne, Miami, Minneapolis, Montreal, New York, Osaka, Oslo, Paris, Perth, Quebec City, San Antonio, Seattle, Silicon Valley, Singapore, Singapore2, Stavanger, Stockholm, Sydney, Sydney2, Tokyo, Tokyo2 Toronto, Vancouver, Washington DC, Washington DC2, Zurich |
| **[MTN](https://www.mtnbusiness.co.za/en/Cloud-Solutions/Pages/microsoft-express-route.aspx)** |Supported |Supported |London |
| **[Neutrona Networks](https://www.neutrona.com/index.php/azure-expressroute/)** |Supported |Supported |Dallas, Los Angeles, Miami, Sao Paulo, Washington DC |
| **[Next Generation Data](https://vantage-dc-cardiff.co.uk/)** |Supported |Supported |Newport(Wales) |
| **[NEXTDC](https://www.nextdc.com/services/axon-ethernet/microsoft-expressroute)** |Supported |Supported |Melbourne, Perth, Sydney, Sydney2 |
| **[NOS](https://www.nos.pt/empresas/corporate/cloud/cloud/Pages/nos-cloud-connect.aspx)** |Supported |Supported |Amsterdam2 |
| **[NTT Communications](https://www.ntt.com/en/services/network/virtual-private-network.html)** |Supported |Supported |Amsterdam, Hong Kong SAR, London, Los Angeles, Osaka, Singapore, Sydney, Tokyo, Washington DC |
| **[NTT EAST](https://business.ntt-east.co.jp/service/crossconnect/)** |Supported |Supported |Tokyo |
| **[NTT Global DataCenters EMEA](https://hello.global.ntt/)** |Supported |Supported |Amsterdam2, Berlin |
| **[NTT SmartConnect](https://cloud.nttsmc.com/cxc/azure.html)** |Supported |Supported |Osaka |
| **[Ooredoo Cloud Connect](https://www.ooredoo.qa/portal/OoredooQatar/cloud-connect-expressroute)** |Supported |Supported |Marseille |
| **[Optus](https://www.optus.com.au/enterprise/)** |Supported |Supported |Melbourne, Sydney |
| **[Orange](https://www.orange-business.com/en/products/business-vpn-galerie)** |Supported |Supported |Amsterdam, Amsterdam2, Dubai2, Frankfurt, Hong Kong SAR, Johannesburg, London, Paris, Sao Paulo, Silicon Valley, Singapore, Sydney, Tokyo, Washington DC |
| **[Orixcom](https://www.orixcom.com/cloud-solutions/)** | Supported | Supported | Dubai2 |
| **[PacketFabric](https://www.packetfabric.com/cloud-connectivity/microsoft-azure)** |Supported |Supported |Chicago, Dallas, Las Vegas, Silicon Valley, Washington DC |
| **[PCCW Global Limited](https://consoleconnect.com/clouds/#azureRegions)** |Supported |Supported |Chicago, Hong Kong, Hong Kong2, London, Singapore2 |
| **[REANNZ](https://www.reannz.co.nz/products-and-services/cloud-connect/)** | Supported | Supported | Auckland |
| **[Retelit](https://www.retelit.it/EN/Home.aspx)** | Supported | Supported | Milan | 
| **[Sejong Telecom](https://www.sejongtelecom.net/en/pages/service/cloud_ms)** |Supported |Supported |Seoul |
| **[SES](https://www.ses.com/networks/signature-solutions/signature-cloud/ses-and-azure-expressroute)** | Supported |Supported | London2, Washington DC |
| **[SIFY](http://telecom.sify.com/azure-expressroute.html)** |Supported |Supported |Chennai, Mumbai2 |
| **[SingTel](https://www.singtel.com/about-us/news-releases/singtel-provide-secure-private-access-microsoft-azure-public-cloud)** |Supported |Supported |Hong Kong2, Singapore, Singapore2 |
| **[Softbank](https://www.softbank.jp/biz/cloud/cloud_access/direct_access_for_az/)** |Supported |Supported |Osaka, Tokyo |
| **[Sohonet](https://www.sohonet.com/fastlane/)** |Supported |Supported |London2 |
| **[Spark NZ](https://www.sparkdigital.co.nz/solutions/connectivity/cloud-connect/)** |Supported |Supported |Auckland, Sydney |
| **[Sprint](https://business.sprint.com/solutions/cloud-networking/)** |Supported |Supported |Chicago, Silicon Valley, Washington DC |
| **[Swisscom](https://www.swisscom.ch/en/business/enterprise/offer/cloud-data-center/microsoft-cloud-services/microsoft-azure-von-swisscom.html)** | Supported | Supported | Geneva, Zurich |
| **[Tata Communications](https://www.tatacommunications.com/solutions/network/cloud-ready-networks/)** |Supported |Supported |Amsterdam, Chennai, Hong Kong SAR, London, Mumbai, Sao Paulo, Silicon Valley, Singapore, Washington DC |
| **[Telefonica](https://www.business-solutions.telefonica.com/es/enterprise/solutions/efficient-infrastructure/managed-voice-data-connectivity/)** |Supported |Supported |Amsterdam, Sao Paulo |
| **[Telehouse - KDDI](https://www.telehouse.net/solutions/cloud-services/cloud-link)** |Supported |Supported |London, London2, Singapore2 |
| **Telenor** |Supported |Supported |Amsterdam, London, Oslo |
| **[Telia Carrier](https://www.teliacarrier.com/)** | Supported | Supported |Amsterdam, Chicago, Dallas, Frankfurt, Hong Kong, London, Oslo, Paris, Silicon Valley, Stockholm, Washington DC |
| **[Telin](https://www.telin.net/product/data-connectivity/telin-cloud-exchange)** | Supported | Supported |Jakarta |
| **Telmex Uninet**| Supported | Supported | Dallas |
| **[Telstra Corporation](https://www.telstra.com.au/business-enterprise/network-services/networks/cloud-direct-connect/)** |Supported |Supported |Melbourne, Singapore, Sydney |
| **[Telus](https://www.telus.com)** |Supported |Supported |Montreal, Seattle, Quebec City, Toronto, Vancouver |
| **[Teraco](https://www.teraco.co.za/services/africa-cloud-exchange/)** |Supported |Supported |Cape Town, Johannesburg |
| **[TIME dotCom](https://www.time.com.my/enterprise/connectivity/direct-cloud)** | Supported | Supported | Kuala Lumpur |
| **[Tokai Communications](https://www.tokai-com.co.jp/en/)** | Supported | Supported | Osaka, Tokyo2 |
| **[Transtelco](https://transtelco.net/enterprise-services/)** |Supported |Supported |Dallas, Queretaro(Mexico)|
| **T-Systems** |Supported |Supported |Frankfurt|
| **[UOLDIVEO](https://www.uoldiveo.com.br/)** |Supported |Supported |Sao Paulo |
| **[UIH](https://www.uih.co.th/en/network-solutions/global-network/cloud-direct-for-microsoft-azure-expressroute)** | Supported | Supported | Bangkok |
| **[Verizon](https://enterprise.verizon.com/products/network/application-enablement/secure-cloud-interconnect/)** |Supported |Supported |Amsterdam, Chicago, Dallas, Hong Kong SAR, London, Mumbai, Silicon Valley, Singapore, Sydney, Tokyo, Toronto, Washington DC |
| **[Viasat](http://www.directcloud.viasatbusiness.com/)** | Supported | Supported | Washington DC2 |
| **[Vocus Group NZ](https://www.vocus.co.nz/business/cloud-data-centres)** | Supported | Supported | Auckland, Sydney |
| **[Vodafone](https://www.vodafone.com/business/global-enterprise/global-connectivity/vodafone-ip-vpn-cloud-connect)** |Supported |Supported |Amsterdam2, London, Singapore |
| **[Vodafone Idea](https://www.vodafone.in/business/enterprise-solutions/connectivity/vpn-extended-connect)** | Supported | Supported | Mumbai2 |
| **[Zayo](https://www.zayo.com/solutions/industries/cloud-connectivity/microsoft-expressroute)** |Supported |Supported |Amsterdam, Chicago, Dallas, Denver, London, Los Angeles, Montreal, New York, Paris, Seattle, Silicon Valley, Toronto, Washington DC, Washington DC2 |

 **+** denotes coming soon

### National cloud environment

Azure national clouds are isolated from each other and from global commercial Azure. ExpressRoute for one Azure cloud can't connect to the Azure regions in the others. 

### US Government cloud

| **Service provider** | **Microsoft Azure** | **Office 365** | **Locations** |
| --- | --- | --- | --- |
| **[AT&T NetBond](https://www.synaptic.att.com/clouduser/html/productdetail/ATT_NetBond.htm)** |Supported |Supported |Chicago, Phoenix, Silicon Valley, Washington DC |
| **[CenturyLink Cloud Connect](https://www.centurylink.com/cloudconnect)** |Supported |Supported |New York, Phoenix, San Antonio, Washington DC |
| **[Equinix](https://www.equinix.com/partners/microsoft-azure/)** |Supported |Supported |Atlanta, Chicago, Dallas, New York, Seattle, Silicon Valley, Washington DC |
| **[Level 3 Communications](http://your.level3.com/LP=882?WT.tsrc=02192014LP882AzureVanityAzureText)** |Supported |Supported |Chicago, Silicon Valley, Washington DC |
| **[Megaport](https://www.megaport.com/services/microsoft-expressroute/)** |Supported | Supported | Chicago, Dallas, San Antonio, Seattle, Washington DC |
| **[Verizon](http://news.verizonenterprise.com/2014/04/secure-cloud-interconnect-solutions-enterprise/)** |Supported |Supported |Chicago, Dallas, New York, Silicon Valley, Washington DC |

### China

| **Service provider** | **Microsoft Azure** | **Office 365** | **Locations** |
| --- | --- | --- | --- |
| **China Telecom** |Supported |Not Supported |Beijing, Beijing2, Shanghai, Shanghai2 |
| **China Unicom** | Supported | Not Supported | Beijing2, Shanghai2 |
| **[GDS](http://www.gds-services.com/en/about_2.html)** |Supported |Not Supported |Beijing2, Shanghai2 |

To learn more, see [ExpressRoute in China](http://www.windowsazure.cn/home/features/expressroute/).

### Germany

| **Service provider** | **Microsoft Azure** | **Office 365** | **Locations** |
| --- | --- | --- | --- |
| **[Colt](https://www.colt.net/direct-connect/azure/)** |Supported |Not Supported |Frankfurt |
| **[Equinix](https://www.equinix.com/partners/microsoft-azure/)** |Supported |Not Supported |Frankfurt |
| **[e-shelter](https://www.e-shelter.de/en/microsoft-expressroute)** |Supported |Not Supported |Berlin |
| **Interxion** |Supported |Not Supported |Frankfurt |
| **[Megaport](https://www.megaport.com/services/microsoft-expressroute/)** |Supported  | Not Supported | Berlin |
| **T-Systems** |Supported |Not Supported |Berlin |

## Connectivity through Exchange providers

If your connectivity provider is not listed in previous sections, you can still create a connection.

* Check with your connectivity provider to see if they are connected to any of the exchanges in the table above. You can check the following links to gather more information about services offered by exchange providers. Several connectivity providers are already connected to Ethernet exchanges.
  * [Cologix](https://www.cologix.com/)
  * [CoreSite](https://www.coresite.com/)
  * [DE-CIX](https://www.de-cix.net/en/de-cix-service-world/cloud-exchange)
  * [Equinix Cloud Exchange](https://www.equinix.com/interconnection-services/equinix-fabric)
  * [Interxion](https://www.interxion.com/products/interconnection/cloud-connect/)
  * [IX Reach](https://www.ixreach.com/partners/cloud-partners/microsoft-azure/)
  * [Megaport](https://www.megaport.com/services/microsoft-expressroute/)
  * [NextDC](https://www.nextdc.com/)
  * [PacketFabric](https://www.packetfabric.com/cloud-connectivity/microsoft-azure) 
  * [Teraco](https://www.teraco.co.za/platform-teraco/africa-cloud-exchange/)

* Have your connectivity provider extend your network to the peering location of choice.
  * Ensure that your connectivity provider extends your connectivity in a highly available manner so that there are no single points of failure.
* Order an ExpressRoute circuit with the exchange as your connectivity provider to connect to Microsoft.
  * Follow steps in [Create an ExpressRoute circuit](expressroute-howto-circuit-classic.md) to set up connectivity.

## Connectivity through satellite operators
If you are remote and don't have fiber connectivity or you want to explore other connectivity options you can check the following satellite operators. 

* Intelsat
* [SES](https://www.ses.com/networks/signature-solutions/signature-cloud/ses-and-azure-expressroute)
* [Viasat](http://www.directcloud.viasatbusiness.com/)

## Connectivity through additional service providers

| **Connectivity provider** | **Exchange** | **Locations** |
| --- | --- | --- |
| **[1CLOUDSTAR](https://www.1cloudstar.com/service/cloudconnect-azure-expressroute/)** | Equinix |Singapore |
| **[Airgate Technologies, Inc.](https://www.airgate.ca/)** | Equinix, Cologix | Toronto, Montreal |
| **[Alaska Communications](https://www.alaskacommunications.com/Business)** |Equinix |Seattle |
| **[Altice Business](https://golightpath.com/transport)** |Equinix |New York, Washington DC |
| **[Arteria Networks Corporation](https://www.arteria-net.com/business/service/cloud/sca/)** |Equinix |Tokyo |
| **[Axtel](https://alestra.mx/landing/expressrouteazure/)** |Equinix |Dallas|
| **[Beanfield Metroconnect](https://www.beanfield.com/business/cloud-exchange)** |Megaport |Toronto|
| **[Bezeq International Ltd.](https://www.bezeqint.net/english)** | euNetworks | London |
| **[BICS](https://bics.com/bics-solutions-suite/cloud-connect/)** | Equinix | Amsterdam, Frankfurt, London, Singapore, Washington DC |
| **[BroadBand Tower, Inc.](https://www.bbtower.co.jp/product-service/data-center/network/dcconnect-for-azure/)** | Equinix | Tokyo |
| **[C3ntro Telecom](https://www.c3ntro.com/)** | Equinix, Megaport | Dallas |
| **[Chief](https://www.chief.com.tw/)** | Equinix | Hong Kong SAR |
| **[Cinia](https://www.cinia.fi/en/services/connectivity-services/direct-public-cloud-connection.html)** | Equinix, Megaport | Frankfurt, Hamburg |
| **[CloudXpress](https://www2.telenet.be/fr/business/produits-services/internet/cloudxpress/)** | Equinix | Amsterdam | 
| **[CMC Telecom](https://cmctelecom.vn/san-pham/value-added-service-and-it/cmc-telecom-cloud-express-en/)** | Equinix | Singapore | 
| **[Aptum Technologies](https://aptum.com/services/cloud/managed-azure/)**| Equinix | Montreal, Toronto |
| **[CoreAzure](https://www.coreazure.com/)**| Equinix | London |
| **[Cox Business](https://www.cox.com/business/networking/cloud-connectivity.html)**| Equinix | Dallas, Silicon Valley, Washington DC |
| **[Crown Castle](https://fiber.crowncastle.com/solutions/added/cloud-connect)**| Equinix | Atlanta, Chicago, Dallas, Los Angeles, New York, Washington DC |
| **[Data Foundry](https://www.datafoundry.com/services/cloud-connect)** | Megaport | Dallas |
| **[Epsilon Telecommunications Limited](https://www.epsilontel.com/solutions/cloud-connect/)** | Equinix | London, Singapore, Washington DC |
| **[Eurofiber](https://eurofiber.nl/microsoft-azure/)** | Equinix | Amsterdam |
| **[Exponential E](https://www.exponential-e.com/services/connectivity-services/cloud-connect-exchange)** | Equinix | London |
| **[Fastweb S.p.A](https://www.fastweb.it/grandi-aziende/connessione-voce-e-wifi/scheda-prodotto/rete-privata-virtuale/)** | Equinix | Amsterdam |
| **[Fibrenoire](https://www.fibrenoire.ca/en/cloudextn)** | Megaport | Quebec City |
| **[Gtt Communications Inc](https://www.gtt.net)** |Equinix | Washington DC |
| **[Gulf Bridge International](https://gbiinc.com/)** | Equinix | Amsterdam |
| **[HSO](https://www.hso.co.uk/products/cloud-direct)** |Equinix | London, Slough |
| **[IVedha Inc](http://www.ivedha.com/cloud/manage-azure-cloud/express-route-4/)**| Equinix | Toronto |
| **[Kaalam Telecom Bahrain B.S.C](http://www.kalaam-telecom.com/azure/)**| Level 3 Communications |Amsterdam |
| **LGA Telecom** |Equinix |Singapore|
| **[Macroview Telecom](http://www.macroview.com/en/scripts/catitem.php?catid=solution&sectionid=expressroute)** |Equinix |Hong Kong SAR 
| **[Macquarie Telecom Group](https://macquariegovernment.com/secure-cloud/secure-cloud-exchange/)** | Megaport | Sydney |
| **[MainOne](https://www.mainone.net/services/connectivity/cloud-connect/)** |Equinix | Amsterdam |
| **[Masergy](https://www.masergy.com/solutions/hybrid-networking/cloud-marketplace/microsoft-azure)** | Equinix | Washington DC |
| **[MTN](https://www.mtnbusiness.co.za/en/Cloud-Solutions/Pages/microsoft-express-route.aspx)** | Teraco | Cape Town, Johannesburg |
| **[NexGen Networks](https://www.nexgen-net.com/nexgen-networks-direct-connect-microsoft-azure-expressroute.html)** | Interxion | London |
| **[Nianet](https://nianet.dk/produkter/internet/microsoft-expressroute)** |Equinix | Amsterdam, Frankfurt |
| **[Oncore Cloud Service Inc](https://www.oncore.cloud/services/ue-for-expressroute)**| Equinix | Toronto |
| **[POST Telecom Luxembourg](https://www.teralinksolutions.com/cloud-connectivity/cloudbridge-to-azure-expressroute/)**|Equinix | Amsterdam |
| **[Proximus](https://www.proximus.be/en/id_b_cl_proximus_external_cloud_connect/companies-and-public-sector/discover/magazines/expert-blog/proximus-external-cloud-connect.html)**|Equinix | Amsterdam, Dublin, London, Paris |
| **[QSC AG](https://www2.qbeyond.de/en/)** |Interxion | Frankfurt |  
| **[RETN](https://retn.net/services/cloud-connect/)** | Equinix | Amsterdam |
| **[Tata Teleservices](https://www.tatateleservices.com/business-services/data-services/secure-cloud-connect)** | Tata Communications | Chennai, Mumbai |
| **Rogers** | Cologix, Equinix | Montreal, Toronto |
| **[Spectrum Enterprise](https://enterprise.spectrum.com/services/cloud/cloud-connect.html)** | Equinix | Chicago, Dallas, Los Angeles, New York, Silicon Valley | 
| **[Tamares Telecom](http://www.tamarestelecom.com/our-services/#Connectivity)** | Equinix | London | 
| **[TDC Erhverv](https://tdc.dk/Produkter/cloudaccessplus)** | Equinix | Amsterdam | 
| **[Telecom Italia Sparkle](https://www.tisparkle.com/our-platform/corporate-platform/sparkle-cloud-connect#catalogue)**| Equinix | Amsterdam |
| **[Telekom Deutschland GmbH](https://cloud.telekom.de/de/infrastruktur/managed-it-services/managed-hybrid-infrastructure-mit-microsoft-azure)** | Interxion | Amsterdam, Frankfurt |
| **[Telia](https://www.telia.se/foretag/losningar/produkter-tjanster/datanet)** | Equinix | Amsterdam |
| **[ThinkTel](https://www.thinktel.ca/services/agile-ix-data/expressroute/)** | Equinix | Toronto | 
| **[United Information Highway (UIH)](https://www.uih.co.th/en/internet-solution/cloud-direct/uih-cloud-direct-for-microsoft-azure-expressroute)**| Equinix | Singapore |
| **[Venha Pra Nuvem](https://venhapranuvem.com.br/)** | Equinix | Sao Paulo |
| **[Webair](https://www.webair.com/microsoft-express-route-partnership/)**| Megaport | New York |
| **[Windstream](https://www.windstreambusiness.com/solutions/cloud-services/cloud-and-managed-hosting-services)**| Equinix | Chicago, Silicon Valley, Washington DC |
| **[X2nsat Inc.](https://www.x2nsat.com/expressroute/)** |Coresite |Silicon Valley, Silicon Valley 2|
| **Zain** |Equinix |London|
| **[Zertia](https://www.zertia.es)**| Level 3 | Madrid |
| **[Zirro](https://zirro.com/services/)**| Cologix, Equinix | Montreal, Toronto |

## Connectivity through datacenter providers

| **Provider** | **Exchange** |
| --- | --- |
| **[CyrusOne](https://cyrusone.com/enterprise-data-center-services/connectivity-and-interconnection/cloud-connectivity-reaching-amazon-microsoft-google-and-more/microsoft-azure-expressroute/?doing_wp_cron=1498512235.6733090877532958984375)** | Megaport, PacketFabric |
| **[Cyxtera](https://www.cyxtera.com/data-center-services/interconnection)** | Megaport, PacketFabric |
| **[Databank](https://www.databank.com/platforms/connectivity/cloud-direct-connect/)** | Megaport |
| **[DataFoundry](https://www.datafoundry.com/services/cloud-connect/)** | Megaport |
| **[Digital Realty](https://www.digitalrealty.com/services/interconnection/service-exchange/)** | IX Reach, Megaport PacketFabric |
| **[EdgeConnex](https://www.edgeconnex.com/services/edge-data-centers-proximity-matters/)** | Megaport, PacketFabric |
| **[Flexential](https://www.flexential.com/connectivity/cloud-connect-microsoft-azure-expressroute)** | IX Reach, Megaport, PacketFabric |
| **[QTS Data Centers](https://www.qtsdatacenters.com/hybrid-solutions/connectivity/azure-cloud )** | Megaport, PacketFabric |
| **[Stream Data Centers]( https://www.streamdatacenters.com/products-services/network-cloud/ )** | Megaport |
| **[RagingWire Data Centers](https://www.ragingwire.com/wholesale/wholesale-data-centers-worldwide-nexcenters)** | IX Reach, Megaport, PacketFabric |
| **[vXchnge](https://www.vxchnge.com/colocation-services/interconnection)** | IX Reach, Megaport |
| **[T5 Datacenters](https://t5datacenters.com/)** | IX Reach |

## Connectivity through National Research and Education Networks (NREN)

| **Provider**|
| --- |
| **AARNET**| 
| **DeIC, through GÉANT**|
| **GARR, through GÉANT**|
| **GÉANT**|
| **HEAnet, through GÉANT**|
| **Internet2**|
| **JISC**|
| **RedIRIS, through GÉANT**|
| **SINET**|
| **Surfnet, through GÉANT**|

* If your connectivity provider is not listed here, please check to see if they are connected to any of the ExpressRoute Exchange Partners listed above.

## ExpressRoute system integrators
Enabling private connectivity to fit your needs can be challenging, based on the scale of your network. You can work with any of the system integrators listed in the following table to assist you with onboarding to ExpressRoute.

| **System integrator** | **Continent** |
| --- | --- |
| **[Altogee](https://altogee.be/diensten/express-route/)** | Europe |
| **[Avanade Inc.](https://www.avanade.com/)** | Asia, Europe, North America, South America |
| **[Bright Skies GmbH](https://bskies.io/expressroute)** | Europe
| **[Ensyst](https://www.ensyst.com.au)** | Asia
| **[Equinix Professional Services](https://www.equinix.com/services/consulting/)** | North America |
| **[FlexManage](https://www.flexmanage.com/cloud)** | North America |
| **[Lightstream](https://www.lightstream.tech/partners/microsoft-azure/)** | North America |
| **[The IT Consultancy Group](https://itconsult.com.au/)** | Australia |
| **[MOQdigital](https://www.moqdigital.com/insights)** | Australia |
| **[MSG Services](https://www.msg-services.de/it-services/managed-services/cloud-outsourcing/)** | Europe (Germany) |
| **[Nelite](https://www.exakis-nelite.com/offres/)** | Europe |
| **[New Signature](https://newsignature.com/technologies/express-route/)** | Europe |
| **[OneAs1a](https://www.oneas1a.com/connectivity.html)** | Asia |
| **[Orange Networks](https://orange-networks.com/blog/88-azureexpressroute)** | Europe |
| **[Perficient](https://www.perficient.com/Partners/Microsoft/Cloud/Azure-ExpressRoute)** | North America |
| **[Presidio](https://www.presidio.com/subpage/1107/microsoft-azure)** | North America |
| **[sol-tec](https://www.sol-tec.com/what-we-do/)** | Europe |
| **[Venha Pra Nuvem](https://venhapranuvem.com.br/)** | South America |
| **[Vigilant.IT](https://vigilant.it/expressroute)** | Australia |

## Next steps
* For more information about ExpressRoute, see the [ExpressRoute FAQ](expressroute-faqs.md).
* Ensure that all prerequisites are met. See [ExpressRoute prerequisites](expressroute-prerequisites.md).

<!--Image References-->
[0]: ./media/expressroute-locations/expressroute-locations-map.png "Location map"
