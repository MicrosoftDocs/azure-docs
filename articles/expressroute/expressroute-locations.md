---
title: Connectivity providers and locations for Azure ExpressRoute
description: This article provides a detailed overview of peering locations served by each ExpressRoute connectivity provider to connect to Azure.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 11/06/2023
ms.author: duau
ms.custom: references_regions, template-concept, engagement-fy23
---

# ExpressRoute connectivity partners and peering locations

> [!div class="op_single_selector"]
> * [Locations By Provider](expressroute-locations.md)
> * [Providers By Location](expressroute-locations-providers.md)


The tables in this article provide information on ExpressRoute geographical coverage and locations, ExpressRoute connectivity providers, and ExpressRoute System Integrators (SIs).

> [!NOTE]
> Azure regions and ExpressRoute locations are two distinct and different concepts, understanding the difference between the two is critical to exploring Azure hybrid networking connectivity. 
>

## Azure regions
Azure regions are global datacenters where Azure compute, networking, and storage resources are located. When creating an Azure resource, a customer needs to select a resource location. The resource location determines which Azure datacenter (or availability zone) the resource is created in.

## ExpressRoute locations
ExpressRoute locations (sometimes referred to as peering locations or meet-me-locations) are co-location facilities where Microsoft Enterprise Edge (MSEE) devices are located. ExpressRoute locations are the entry point to Microsoft's network – and are globally distributed, providing customers the opportunity to connect to Microsoft's network around the world. These locations are where ExpressRoute partners and ExpressRoute Direct customers issue cross connections to Microsoft's network. In general, the ExpressRoute location doesn't need to match the Azure region. For example, a customer can create an ExpressRoute circuit with the resource location *East US*, in the *Seattle* Peering location.

You'll have access to Azure services across all regions within a geopolitical region if you connected to at least one ExpressRoute location within the geopolitical region.

[!INCLUDE [expressroute-azure-regions-geopolitical-region](../../includes/expressroute-azure-regions-geopolitical-region.md)]

## <a name="partners"></a>ExpressRoute connectivity providers

The following table shows locations by service provider. If you want to view available providers by location, see [Service providers by location](expressroute-locations-providers.md).


### Global commercial Azure

|Service provider | Microsoft Azure | Microsoft 365  | Locations |
| --- | --- | --- | --- |
| **[AARNet](https://www.aarnet.edu.au/network-and-services/connectivity-services/azure-expressroute)** |Supported |Supported | Melbourne<br/>Sydney |
| **[Airtel](https://www.airtel.in/business/#/)** | Supported | Supported | Chennai2<br/>Mumbai2<br/>Pune |
| **[AIS](https://business.ais.co.th/solution/en/azure-expressroute.html)** | Supported | Supported | Bangkok |
| **[Aryaka Networks](https://www.aryaka.com/)** | Supported | Supported | Amsterdam<br/>Chicago<br/>Dallas<br/>Hong Kong<br/>Sao Paulo<br/>Seattle<br/>Silicon Valley<br/>Singapore<br/>Tokyo<br/>Washington DC |
| **[Ascenty Data Centers](https://www.ascenty.com/en/cloud/microsoft-express-route)** | Supported | Supported | Campinas<br/>Sao Paulo<br/>Sao Paulo2 |
| **AT&T Dynamic Exchange** | Supported | Supported | Chicago<br/>Dallas<br/>Los Angeles<br/>Miami<br/>Silicon Valley |
| **[AT&T NetBond](https://www.synaptic.att.com/clouduser/html/productdetail/ATT_NetBond.htm)** | Supported | Supported | Amsterdam<br/>Chicago<br/>Dallas<br/>Frankfurt<br/>London<br/>Silicon Valley<br/>Singapore<br/>Sydney<br/>Tokyo<br/>Toronto<br/>Washington DC |
| **[AT TOKYO](https://www.attokyo.com/connectivity/azure.html)** | Supported | Supported | Osaka<br/>Tokyo2 |
| **[BBIX](https://www.bbix.net/en/service/ix/)** | Supported | Supported | Osaka<br/>Tokyo<br/>Tokyo2 |
| **[BCX](https://www.bcx.co.za/solutions/connectivity/)** | Supported | Supported | Cape Town<br/>Johannesburg|
| **[Bell Canada](https://business.bell.ca/shop/enterprise/cloud-connect-access-to-cloud-partner-services)** | Supported | Supported | Montreal<br/>Toronto<br/>Quebec City<br/>Vancouver |
| **[Bezeq International](https://selfservice.bezeqint.net/english)** | Supported | Supported | London<br/>Tel Aviv |
| **[BICS](https://www.bics.com/cloud-connect/)** | Supported | Supported | Amsterdam2<br/>London2 |
| **[British Telecom](https://www.globalservices.bt.com/en/solutions/products/cloud-connect-azure)** | Supported | Supported | Amsterdam<br/>Amsterdam2<br/>Chicago<br/>Frankfurt<br/>Hong Kong<br/>Johannesburg<br/>London<br/>London2<br/>Mumbai<br/>Newport(Wales)<br/>Paris<br/>Sao Paulo<br/>Silicon Valley<br/>Singapore<br/>Sydney<br/>Tokyo<br/>Washington DC |
| **BSNL** | Supported | Supported | Chennai<br/>Mumbai |
| **[C3ntro](https://www.c3ntro.com/)** | Supported | Supported | Miami |
| **CDC** | Supported | Supported | Canberra<br/>Canberra2 |
| **[CenturyLink Cloud Connect](https://www.centurylink.com/cloudconnect)** | Supported | Supported | Amsterdam2<br/>Chicago<br/>Dallas<br/>Dublin<br/>Frankfurt<br/>Hong Kong<br/>Las Vegas<br/>London<br/>London2<br/>Montreal<br/>New York<br/>Paris<br/>Phoenix<br/>San Antonio<br/>Seattle<br/>Silicon Valley<br/>Singapore2<br/>Tokyo<br/>Toronto<br/>Washington DC<br/>Washington DC2 |
| **[Chief Telecom](https://www.chief.com.tw/)** |Supported |Supported | Hong Kong<br/>Taipei |
| **China Mobile International** |Supported |Supported | Hong Kong<br/>Hong Kong2<br/>Singapore |
| **China Telecom Global** |Supported |Supported | Hong Kong<br/>Hong Kong2 |
| **China Unicom Global** |Supported |Supported | Frankfurt<br/>Hong Kong<br/>Singapore2<br/>Tokyo2 |
| **Chunghwa Telecom** |Supported |Supported | Taipei |
| **[Cinia](https://www.cinia.fi/)** |Supported |Supported | Amsterdam2 |
| **[Cirion Technologies](https://lp.ciriontechnologies.com/cloud-connect-lp-latam?c_campaign=HOTSITE&c_tactic=&c_subtactic=&utm_source=SOLUCIONES-CTA&utm_medium=Organic&utm_content=&utm_term=&utm_campaign=HOTSITE-ESP)** | Supported | Supported | Queretaro<br/>Rio De Janeiro |
| **Claro** |Supported |Supported | Miami |
| **Cloudflare** |Supported |Supported | Los Angeles |
| **[Cologix](https://cologix.com/connectivity/cloud/cloud-connect/microsoft-azure/)** |Supported |Supported | Chicago<br/>Dallas<br/>Minneapolis<br/>Montreal<br/>Toronto<br/>Vancouver<br/>Washington DC |
| **[Claro](https://www.usclaro.com/enterprise-mnc/connectivity/mpls/)** |Supported |Supported | Miami |
| **Cloudflare** |Supported |Supported | Los Angeles |
| **[Cologix](https://cologix.com/connectivity/cloud/cloud-connect/microsoft-azure/)** | Supported | Supported | Chicago<br/>Dallas<br/>Minneapolis<br/>Montreal<br/>Toronto<br/>Vancouver<br/>Washington DC |
| **[Colt](https://www.colt.net/direct-connect/azure/)** | Supported | Supported | Amsterdam<br/>Amsterdam2<br/>Berlin<br/>Chicago<br/>Dublin<br/>Frankfurt<br/>Frankfurt2<br/>Geneva<br/>Hong Kong<br/>London<br/>London2<br/>Marseille<br/>Milan<br/>Munich<br/>Newport<br/>Osaka<br/>Paris<br/>Paris2<br/>Seoul<br/>Silicon Valley<br/>Singapore2<br/>Tokyo<br/>Tokyo2<br/>Washington DC<br/>Zurich |
| **[Comcast](https://business.comcast.com/landingpage/microsoft-azure)** | Supported | Supported | Chicago<br/>Silicon Valley<br/>Washington DC |
| **[CoreSite](https://www.coresite.com/solutions/cloud-services/public-cloud-providers/microsoft-azure-expressroute)** | Supported | Supported | Chicago<br/>Chicago2<br/>Denver<br/>Los Angeles<br/>New York<br/>Silicon Valley<br/>Silicon Valley2<br/>Washington DC<br/>Washington DC2 |
| **[Cox Business Cloud Port](https://www.cox.com/business/networking/cloud-connectivity.html)** | Supported | Supported | Dallas<br/>Phoenix<br/>Silicon Valley<br/>Washington DC |
| **Crown Castle** | Supported | Supported | New York<br/>Washington DC |
| **[DE-CIX](https://www.de-cix.net/en/services/directcloud/microsoft-azure)** | Supported |Supported | Amsterdam2<br/>Chennai<br/>Chicago2<br/>Copenhagen<br/>Dallas<br/>Dubai2<br/>Frankfurt<br/>Frankfurt2<br/>Kuala Lumpur<br/>Madrid<br/>Marseille<br/>Mumbai<br/>Munich<br/>New York<br/>Osaka<br/>Phoenix<br/>Seattle<br/>Singapore2<br/>Tokyo2 |
| **[Devoli](https://devoli.com/expressroute)** | Supported |Supported | Auckland<br/>Melbourne<br/>Sydney |
| **[Deutsche Telekom AG IntraSelect](https://geschaeftskunden.telekom.de/vernetzung-digitalisierung/produkt/intraselect)** | Supported |Supported | Frankfurt |
| **[Deutsche Telekom AG](https://www.t-systems.com/de/en/cloud-services/managed-platform-services/azure-managed-services/cloudconnect-for-azure)** | Supported |Supported | Amsterdam<br/>Frankfurt2<br/>Hong Kong2 |
| **du datamena** |Supported |Supported | Dubai2 |
| **[eir evo](https://www.eirevo.ie/cloud-services/cloud-connectivity)** |Supported |Supported | Dublin |
| **[Epsilon Global Communications](https://epsilontel.com/solutions/cloud-connect/)** | Supported | Supported | Hong Kong2<br/>London2<br/>Singapore<br/>Singapore2 |
| **[Equinix](https://www.equinix.com/partners/microsoft-azure/)** | Supported | Supported | Amsterdam<br/>Amsterdam2<br/>Atlanta<br/>Berlin<br/>Canberra2<br/>Chicago<br/>Dallas<br/>Dubai2<br/>Dublin<br/>Frankfurt<br/>Frankfurt2<br/>Geneva<br/>Hong Kong<br/>Hong Kong2<br/>London<br/>London2<br/>Los Angeles*<br/>Los Angeles2<br/>Melbourne<br/>Miami<br/>Milan<br/>New York<br/>Osaka<br/>Paris<br/>Paris2<br/>Perth<br/>Quebec City<br/>Rio de Janeiro<br/>Sao Paulo<br/>Seattle<br/>Seoul<br/>Silicon Valley<br/>Singapore<br/>Singapore2<br/>Stockholm<br/>Sydney<br/>Tokyo<br/>Tokyo2<br/>Toronto<br/>Washington DC<br/>Warsaw<br/>Zurich</br>Zurich2</br></br> **New ExpressRoute circuits are no longer supported with Equinix in Los Angeles. Create new circuits in Los Angeles2.* |
| **Etisalat UAE** |Supported |Supported | Dubai |
| **[euNetworks](https://eunetworks.com/services/solutions/cloud-connect/microsoft-azure-expressroute/)** | Supported | Supported | Amsterdam<br/>Amsterdam2<br/>Dublin<br/>Frankfurt<br/>London<br/>Paris |
| **[FarEasTone](https://www.fetnet.net/corporate/en/Enterprise.html)** | Supported | Supported | Taipei |
| **[Fastweb](https://www.fastweb.it/grandi-aziende/dati-voce/scheda-prodotto/fast-company/)** | Supported |Supported | Milan |
| **[Fibrenoire](https://fibrenoire.ca/en/services/cloudextn-2/)** | Supported | Supported | Montreal<br/>Quebec City<br/>Toronto2 |
| **[GBI](https://www.gbiinc.com/microsoft-azure/)** | Supported | Supported | Dubai2<br/>Frankfurt |
| **[GÉANT](https://www.geant.org/Networks)** | Supported | Supported | Amsterdam<br/>Amsterdam2<br/>Dublin<br/>Frankfurt<br/>Marseille |
| **[GlobalConnect](https://www.globalconnect.no/tjenester/nettverk/cloud-access)** | Supported | Supported | Copenhagen<br/>Oslo<br/>Stavanger<br/>Stockholm | 
| **[GlobalConnect DK](https://www.globalconnect.no/tjenester/nettverk/cloud-access)** | Supported | Supported | Amsterdam | 
| **GTT** |Supported |Supported | Amsterdam<br/>Dallas<br/>Los Angeles2<br/>London2<br/>Singapore<br/>Sydney<br/>Washington DC |
| **[Global Cloud Xchange (GCX)](https://globalcloudxchange.com/cloud-platform/cloud-x-fusion/)** | Supported| Supported | Chennai<br/>Mumbai |
| **[iAdvantage](https://www.scx.sunevision.com/)** | Supported | Supported | Hong Kong2 |
| **Intelsat** | Supported | Supported | London2<br/>Washington DC2 |
| **[InterCloud](https://www.intercloud.com/)** |Supported |Supported | Amsterdam<br/>Chicago<br/>Dallas<br/>Dublin2<br/>Frankfurt<br/>Frankfurt2<br/>Geneva<br/>Hong Kong<br/>London<br/>Madrid<br/>Mumbai<br/>New York<br/>Paris<br/>Paris2<br/>Sao Paulo<br/>Silicon Valley<br/>Singapore<br/>Tokyo<br/>Washington DC<br/>Zurich |
| **[Internet2](https://internet2.edu/services/cloud-connect/#service-cloud-connect)** | Supported | Supported | Chicago<br/>Dallas<br/>Silicon Valley<br/>Washington DC |
| **[Internet Initiative Japan Inc. - IIJ](https://www.iij.ad.jp/en/news/pressrelease/2015/1216-2.html)** | Supported | Supported | Osaka<br/>Tokyo<br/>Tokyo2 |
| **[Internet Solutions - Cloud Connect](https://www.is.co.za/solution/cloud-connect/)** | Supported | Supported | Cape Town<br/>Johannesburg<br/>London |
| **[Interxion](https://www.interxion.com/why-interxion/colocate-with-the-clouds/Microsoft-Azure/)** | Supported | Supported | Amsterdam<br/>Amsterdam2<br/>Copenhagen<br/>Dublin<br/>Dublin2<br/>Frankfurt<br/>London<br/>London2<br/>Madrid<br/>Marseille<br/>Paris<br/>Stockholm<br/>Zurich |
| **[IRIDEOS](https://irideos.it/)** | Supported | Supported | Milan |
| **Iron Mountain** | Supported |Supported | Washington DC |
| **[IX Reach](https://www.ixreach.com/partners/cloud-partners/microsoft-azure/)**| Supported | Supported | Amsterdam<br/>London2<br/>Silicon Valley<br/>Tokyo2<br/>Toronto<br/>Washington DC |
| **Jaguar Network** |Supported |Supported | Marseille<br/>Paris |
| **[Jisc](https://www.jisc.ac.uk/microsoft-azure-expressroute)** | Supported | Supported | London<br/>London2<br/>Newport(Wales) |
| **KDDI** | Supported | Supported | Osaka<br/>Tokyo<br/>Tokyo2 |
| **[KINX](https://www.kinx.net/service/cloudhub/clouds/microsoft_azure_expressroute/?lang=en)** | Supported | Supported | Seoul |
| **[Kordia](https://www.kordia.co.nz/cloudconnect)** | Supported | Supported | Auckland<br/>Sydney |
| **[KPN](https://www.kpn.com/zakelijk/cloud/connect.htm)** | Supported | Supported | Amsterdam<br/>Dublin2|
| **[KT](https://cloud.kt.com/)** | Supported | Supported | Seoul<br/>Seoul2 |
| **[Level 3 Communications](https://www.lumen.com/en-us/hybrid-it-cloud/cloud-connect.html)** | Supported | Supported | Amsterdam<br/>Chicago<br/>Dallas<br/>London<br/>Newport (Wales)<br/>Sao Paulo<br/>Seattle<br/>Silicon Valley<br/>Singapore<br/>Washington DC |
| **LG CNS** | Supported | Supported | Busan<br/>Seoul |
| **Lightpath** | Supported | Supported | New York<br/>Washington DC |
| **[Lightstorm](https://polarin.lightstorm.net/)** | Supported | Supported | Chennai<br/>Dubai2<br/>Pune<br/>Singapore2 |
| **[Liquid Intelligent Technologies](https://liquidcloud.africa/connect/)** | Supported | Supported | Cape Town<br/>Johannesburg |
| **[LGUplus](http://www.uplus.co.kr/)** |Supported |Supported | Seoul |
| **[Megaport](https://www.megaport.com/services/microsoft-expressroute/)** | Supported | Supported | Amsterdam<br/>Amsterdam2<br/>Atlanta<br/>Auckland<br/>Chicago<br/>Dallas<br/>Denver<br/>Dubai2<br/>Dublin<br/>Frankfurt<br/>Geneva<br/>Hong Kong<br/>Hong Kong2<br/>Las Vegas<br/>London<br/>London2<br/>Los Angeles<br/>Madrid<br/>Melbourne<br/>Miami<br/>Minneapolis<br/>Montreal<br/>Munich<br/>New York<br/>Osaka<br/>Oslo<br/>Paris<br/>Perth<br/>Phoenix<br/>Quebec City<br/>Queretaro (Mexico)<br/>San Antonio<br/>Seattle<br/>Silicon Valley<br/>Singapore<br/>Singapore2<br/>Stavanger<br/>Stockholm<br/>Sydney<br/>Sydney2<br/>Tokyo<br/>Tokyo2<br/>Toronto<br/>Vancouver<br/>Washington DC<br/>Washington DC2<br/>Zurich |
| **[Momentum Telecom](https://gomomentum.com/)** | Supported | Supported | Chicago<br/>New York<br/>Washington DC2 |
| **[MTN](https://www.mtnbusiness.co.za/en/Cloud-Solutions/Pages/microsoft-express-route.aspx)** | Supported | Supported | London |
| **MTN Global Connect** | Supported | Supported | Cape Town<br/>Johannesburg|
| **[National Telecom](https://www.nc.ntplc.co.th/cat/category/264/855/CAT+Direct+Cloud+Connect+for+Microsoft+ExpressRoute?lang=en_EN)** | Supported | Supported | Bangkok |
| **NEC** | Supported | Supported | Tokyo3 |
| **[NETSG](https://www.netsg.co/dc-cloud/cloud-and-dc-interconnect/)** | Supported | Supported | Melbourne<br/>Sydney2 |
| **[Neutrona Networks](https://flo.net/)** | Supported | Supported | Dallas<br/>Los Angeles<br/>Miami<br/>Sao Paulo<br/>Washington DC |
| **[Next Generation Data](https://vantage-dc-cardiff.co.uk/)** | Supported | Supported | Newport(Wales) |
| **[NEXTDC](https://www.nextdc.com/services/axon-ethernet/microsoft-expressroute)** | Supported | Supported | Melbourne<br/>Perth<br/>Sydney<br/>Sydney2 |
| **NL-IX** | Supported | Supported | Amsterdam2<br/>Dublin2 |
| **[NOS](https://www.nos.pt/empresas/solucoes/cloud/cloud-publica/nos-cloud-connect)** | Supported | Supported | Amsterdam2<br/>Madrid |
| **[NTT Communications](https://www.ntt.com/en/services/network/virtual-private-network.html)** | Supported | Supported | Amsterdam<br/>Hong Kong<br/>London<br/>Los Angeles<br/>New York<br/>Osaka<br/>Singapore<br/>Sydney<br/>Tokyo<br/>Washington DC |
| **NTT Communications India Network Services Pvt Ltd** | Supported | Supported | Chennai<br/>Mumbai |
| **[NTT Communications - Flexible InterConnect](https://sdpf.ntt.com/)** |Supported |Supported | Jakarta<br/>Osaka<br/>Singapore2<br/>Tokyo<br/>Tokyo2 |
| **[NTT EAST](https://business.ntt-east.co.jp/service/crossconnect/)** |Supported |Supported | Tokyo |
| **[NTT Global DataCenters EMEA](https://hello.global.ntt/)** |Supported |Supported | Amsterdam2<br/>Berlin<br/>Frankfurt<br/>London2 |
| **[NTT SmartConnect](https://cloud.nttsmc.com/cxc/azure.html)** |Supported |Supported | Osaka |
| **[Ooredoo Cloud Connect](https://www.ooredoo.com.kw/portal/en/b2bOffConnAzureExpressRoute)** |Supported |Supported | Doha<br/>Doha2<br/>London2<br/>Marseille |
| **[Optus](https://www.optus.com.au/enterprise/networking/network-connectivity/express-link/)** |Supported |Supported | Melbourne<br/>Sydney |
| **[Orange](https://www.orange-business.com/en/products/business-vpn-galerie)** |Supported |Supported | Amsterdam<br/>Amsterdam2<br/>Chicago<br/>Dallas<br/>Dubai2<br/>Dublin2<br/>Frankfurt<br/>Hong Kong<br/>Johannesburg<br/>London<br/>London2<br/>Mumbai2<br/>Melbourne<br/>Paris<br/>Paris2<br/>Sao Paulo<br/>Silicon Valley<br/>Singapore<br/>Sydney<br/>Tokyo<br/>Toronto<br/>Washington DC |
| **[Orange Poland](https://www.orange.pl/duze-firmy)** | Supported | Supported | Warsaw |
| **[Orixcom](https://www.orixcom.com/solutions/azure-expressroute)** | Supported | Supported | Dubai2 |
| **[PacketFabric](https://www.packetfabric.com/cloud-connectivity/microsoft-azure)** | Supported | Supported | Amsterdam<br/>Chicago<br/>Dallas<br/>Denver<br/>Las Vegas<br/>London<br/>Los Angeles2<br/>Miami<br/>New York<br/>Seattle<br/>Silicon Valley<br/>Toronto<br/>Washington DC |
| **[PCCW Global Limited](https://consoleconnect.com/clouds/#azureRegions)** | Supported | Supported | Chicago<br/>Hong Kong<br/>Hong Kong2<br/>London<br/>Singapore<br/>Singapore2<br/>Tokyo2 |
| **PitChile** | Supported | Supported | Santiago<br/>Miami |
| **[REANNZ](https://www.reannz.co.nz/products-and-services/cloud-connect/)** | Supported | Supported | Auckland |
| **RedCLARA** | Supported | Supported | Sao Paulo |
| **[Reliance Jio](https://www.jio.com/business/jio-cloud-connect)** | Supported | Supported | Mumbai |
| **[Retelit](https://www.retelit.it/EN/Home.aspx)** | Supported | Supported | Milan |
| **RISQ** |Supported | Supported | Quebec City<br/>Montreal |
| **SCSK** |Supported | Supported | Tokyo3 |
| **[Sejong Telecom](https://www.sejongtelecom.net/en/pages/service/cloud_ms)** | Supported | Supported | Seoul |
| **[SES](https://www.ses.com/networks/signature-solutions/signature-cloud/ses-and-azure-expressroute)** | Supported | Supported | London2<br/>Washington DC |
| **[SIFY](https://sifytechnologies.com/)** | Supported | Supported | Chennai<br/>Mumbai2 |
| **[SingTel](https://www.singtel.com/about-us/news-releases/singtel-provide-secure-private-access-microsoft-azure-public-cloud)** |Supported |Supported | Hong Kong2<br/>Singapore<br/>Singapore2 |
| **[SK Telecom](http://b2b.tworld.co.kr/bizts/solution/solutionTemplate.bs?solutionId=0085)** | Supported | Supported | Seoul |
| **[Softbank](https://www.softbank.jp/biz/cloud/cloud_access/direct_access_for_az/)** |Supported |Supported | Osaka<br/>Tokyo<br/>Tokyo2 |
| **[Sohonet](https://www.sohonet.com/product/fastlane/)** | Supported | Supported | Los Angeles<br/>London2 |
| **[Spark NZ](https://www.sparkdigital.co.nz/solutions/connectivity/cloud-connect/)** | Supported | Supported | Auckland<br/>Sydney |
| **[Swisscom](https://www.swisscom.ch/en/business/enterprise/offer/cloud-data-center/microsoft-cloud-services/microsoft-azure-von-swisscom.html)** | Supported | Supported | Geneva<br/>Zurich |
| **[Tata Communications](https://www.tatacommunications.com/solutions/network/cloud-ready-networks/)** | Supported | Supported | Amsterdam<br/>Chennai<br/>Chicago<br/>Hong Kong<br/>London<br/>Mumbai<br/>Pune<br/>Sao Paulo<br/>Silicon Valley<br/>Singapore<br/>Washington DC |
| **[Telefonica](https://www.telefonica.com/es/)** | Supported | Supported | Amsterdam<br/>Dallas<br/>Frankfurt2<br/>Hong Kong<br/>Madrid<br/>Sao Paulo<br/>Singapore<br/>Washington DC |
| **[Telehouse - KDDI](https://www.telehouse.net/solutions/cloud-services/cloud-link)** | Supported | Supported | London<br/>London2<br/>Singapore2 |
| **Telenor** |Supported |Supported | Amsterdam<br/>London<br/>Oslo<br/>Stavanger |
| **[Telia Carrier](https://www.teliacarrier.com/)** | Supported | Supported | Amsterdam<br/>Chicago<br/>Dallas<br/>Frankfurt<br/>Hong Kong<br/>London<br/>Oslo<br/>Paris<br/>Seattle<br/>Silicon Valley<br/>Stockholm<br/>Washington DC |
| **[Telin](https://telin.net/)** | Supported | Supported | Jakarta |
| **Telmex Uninet**| Supported | Supported | Dallas |
| **[Telstra Corporation](https://www.telstra.com.au/business-enterprise/network-services/networks/cloud-direct-connect/)** | Supported | Supported | Melbourne<br/>Singapore<br/>Sydney |
| **[Telus](https://www.telus.com)** | Supported | Supported | Montreal<br/>Quebec City<br/>Seattle<br/>Toronto<br/>Vancouver |
| **[Teraco](https://www.teraco.co.za/services/africa-cloud-exchange/)** | Supported | Supported | Cape Town<br/>Johannesburg |
| **[TIME dotCom](https://www.time.com.my/enterprise/connectivity/direct-cloud)** | Supported | Supported | Kuala Lumpur |
| **[Tivit](https://tivit.com/en/home-ingles/)** |Supported |Supported | Sao Paulo2 |
| **[Tokai Communications](https://www.tokai-com.co.jp/en/)** | Supported | Supported | Osaka<br/>Tokyo2 |
| **TPG Telecom**| Supported | Supported | Melbourne<br/>Sydney |
| **[Transtelco](https://transtelco.net/enterprise-services/)** | Supported | Supported | Dallas<br/>Queretaro(Mexico City)|
| **[T-Mobile/Sprint](https://www.t-mobile.com/business/solutions/networking/cloud-networking)** |Supported |Supported | Chicago<br/>Silicon Valley<br/>Washington DC |
| **[T-Mobile Poland](https://biznes.t-mobile.pl/pl/produkty-i-uslugi/sieci-teleinformatyczne/cloud-on-edge)** |Supported |Supported | warsaw |
| **[T-Systems](https://geschaeftskunden.telekom.de/vernetzung-digitalisierung/produkt/intraselect)** | Supported | Supported | Frankfurt |
| **UOLDIVEO** | Supported | Supported | Sao Paulo |
| **[UIH](https://www.uih.co.th/products-services/managed-services/cloud-direct/)** | Supported | Supported | Bangkok |
| **[Verizon](https://enterprise.verizon.com/products/network/application-enablement/secure-cloud-interconnect/)** | Supported | Supported | Amsterdam<br/>Chicago<br/>Dallas<br/>Frankfurt<br/>Hong Kong<br/>London<br/>Mumbai<br/>Paris<br/>Silicon Valley<br/>Singapore<br/>Sydney<br/>Tokyo<br/>Toronto<br/>Washington DC |
| **[Viasat](https://news.viasat.com/newsroom/press-releases/viasat-introduces-direct-cloud-connect-a-new-service-providing-fast-secure-private-connections-to-business-critical-cloud-services)** | Supported | Supported | Washington DC2 |
| **[Vocus Group NZ](https://www.vocus.co.nz/business/cloud-data-centres)** | Supported | Supported | Auckland<br/>Sydney |
| **Vodacom** | Supported | Supported | Cape Town<br/>Johannesburg|
| **[Vodafone](https://www.vodafone.com/business/global-enterprise/global-connectivity/vodafone-ip-vpn-cloud-connect)** | Supported | Supported | Amsterdam2<br/>Chicago<br/>Dallas<br/>Hong Kong2<br/>London<br/>London2<br/>Milan<br/>Silicon Valley<br/>Singapore |
| **[Vi (Vodafone Idea)](https://www.myvi.in/business/enterprise-solutions/connectivity/vpn-extended-connect)** | Supported | Supported | Chennai<br/>Mumbai2 |
| **Vodafone Qatar** | Supported | Supported | Doha |
| **XL Axiata** | Supported | Supported | Jakarta |
| **[Zayo](https://www.zayo.com/services/packet/cloudlink/)** | Supported | Supported | Amsterdam<br/>Chicago<br/>Dallas<br/>Denver<br/>Dublin<br/>Frankfurt<br/>Hong Kong<br/>London<br/>London2<br/>Los Angeles<br/>Montreal<br/>New York<br/>Paris<br/>Phoenix<br/>San Antonio<br/>Seattle<br/>Silicon Valley<br/>Toronto<br/>Toronto2<br/>Vancouver<br/>Washington DC<br/>Washington DC2<br/>Zurich|

### National cloud environment

Azure national clouds are isolated from each other and from global commercial Azure. ExpressRoute for one Azure cloud can't connect to the Azure regions in the others. 

### US Government cloud

| Service provider | Microsoft Azure | Office 365 | Locations |
| --- | --- | --- | --- |
| **[AT&T NetBond](https://www.synaptic.att.com/clouduser/html/productdetail/ATT_NetBond.htm)** |Supported |Supported |Chicago<br/>Phoenix<br/>Silicon Valley<br/>Washington DC |
| **[CenturyLink Cloud Connect](https://www.centurylink.com/cloudconnect)** |Supported |Supported |New York<br/>Phoenix<br/>San Antonio<br/>Washington DC |
| **[Equinix](https://www.equinix.com/partners/microsoft-azure/)** |Supported |Supported |Atlanta<br/>Chicago<br/>Dallas<br/>New York<br/>Seattle<br/>Silicon Valley<br/>Washington DC |
| **[Internet2](https://internet2.edu/services/microsoft-azure-expressroute/)** |Supported |Supported |Dallas |
| **[Level 3 Communications](https://www.lumen.com/en-us/hybrid-it-cloud/cloud-connect.html)** |Supported |Supported |Chicago<br/>Silicon Valley<br/>Washington DC |
| **[Megaport](https://www.megaport.com/services/microsoft-expressroute/)** |Supported | Supported | Chicago<br/>Dallas<br/>San Antonio<br/>Seattle<br/>Washington DC |
| **[Verizon](http://news.verizonenterprise.com/2014/04/secure-cloud-interconnect-solutions-enterprise/)** |Supported |Supported |Chicago<br/>Dallas<br/>New York<br/>Silicon Valley<br/>Washington DC |

### China

| Service provider | Microsoft Azure | Office 365 | Locations |
| --- | --- | --- | --- |
| **China Telecom** |Supported |Not Supported |Beijing<br/>Beijing2<br/>Shanghai<br/>Shanghai2 |
| **China Mobile** | Supported | Not Supported | Beijing2 |
| **China Unicom** | Supported | Not Supported | Beijing2<br/>Shanghai2 |
| **[GDS](http://www.gds-services.com/en/about_2.html)** |Supported |Not Supported |Beijing2<br/>Shanghai2 |

To learn more<br/>see [ExpressRoute in China](https://www.azure.cn/home/features/expressroute/).

## Connectivity through Exchange providers

If your connectivity provider isn't listed in previous sections, you can still create a connection.

* Check with your connectivity provider to see if they're connected to any of the exchanges in the table above. You can check the following links to gather more information about services offered by exchange providers. Several connectivity providers are already connected to Ethernet exchanges.
  * [Cologix](https://www.cologix.com/)
  * [CoreSite](https://www.coresite.com/)
  * [DE-CIX](https://www.de-cix.net/en/services/microsoft-azure-peering-service)
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
If you're remote and don't have fiber connectivity, or you want to explore other connectivity options you can check the following satellite operators. 

* Intelsat
* [SES](https://www.ses.com/networks/signature-solutions/signature-cloud/ses-and-azure-expressroute)
* [Viasat](https://news.viasat.com/newsroom/press-releases/viasat-introduces-direct-cloud-connect-a-new-service-providing-fast-secure-private-connections-to-business-critical-cloud-services)

## Connectivity through additional service providers

| Connectivity provider | Exchange | Locations |
| --- | --- | --- |
| **[1CLOUDSTAR](https://www.1cloudstar.com/services/cloudconnect-azure-expressroute.html)** | Equinix |Singapore |
| **[Airgate Technologies, Inc.](https://www.airgate.ca/)** | Equinix<br/>Cologix | Toronto<br/>Montreal |
| **[Alaska Communications](https://www.alaskacommunications.com/Business)** |Equinix |Seattle |
| **[Altice Business](https://lightpathfiber.com/applications/cloud-connect)** |Equinix |New York<br/>Washington DC |
| **[Aptum Technologies](https://aptum.com/services/cloud/managed-azure/)**| Equinix | Montreal<br/>Toronto |
| **[Arteria Networks Corporation](https://www.arteria-net.com/business/service/cloud/sca/)** |Equinix |Tokyo |
| **[Axtel](https://alestra.mx/landing/expressrouteazure/)** |Equinix |Dallas|
| **[Beanfield Metroconnect](https://www.beanfield.com/business/cloud-exchange)** |Megaport |Toronto|
| **[Bezeq International Ltd.](https://www.bezeqint.net/english)** | euNetworks | London |
| **[BICS](https://www.bics.com/cloud-connect/)** | Equinix | Amsterdam<br/>Frankfurt<br/>London<br/>Singapore<br/>Washington DC |
| **[BroadBand Tower, Inc.](https://www.bbtower.co.jp/product-service/network/)** | Equinix | Tokyo |
| **[C3ntro Telecom](https://www.c3ntro.com/)** | Equinix<br/>Megaport | Dallas |
| **[Chief](https://www.chief.com.tw/)** | Equinix | Hong Kong |
| **[Cinia](https://www.cinia.fi/palvelutiedotteet)** | Equinix<br/>Megaport | Frankfurt<br/>Hamburg |
| **CloudXpress** | Equinix | Amsterdam | 
| **[CMC Telecom](https://cmctelecom.vn/san-pham/value-added-service-and-it/cmc-telecom-cloud-express-en/)** | Equinix | Singapore | 
| **[CoreAzure](https://www.coreazure.com/)**| Equinix | London |
| **[Cox Business](https://www.cox.com/business/networking/cloud-connectivity.html)**| Equinix | Dallas<br/>Silicon Valley<br/>Washington DC |
| **[Crown Castle](https://fiber.crowncastle.com/solutions/added/cloud-connect)**| Equinix | Atlanta<br/>Chicago<br/>Dallas<br/>Los Angeles<br/>New York<br/>Washington DC |
| **[Data Foundry](https://www.datafoundry.com/services/cloud-connect)** | Megaport | Dallas |
| **[Epsilon Telecommunications Limited](https://www.epsilontel.com/solutions/cloud-connect/)** | Equinix | London<br/>Singapore<br/>Washington DC |
| **[Eurofiber](https://eurofiber.nl/microsoft-azure/)** | Equinix | Amsterdam |
| **[Exponential E](https://www.exponential-e.com/services/connectivity-services/)** | Equinix | London |
| **[Fastweb S.p.A](https://www.fastweb.it/grandi-aziende/dati-voce/scheda-prodotto/fast-company/)** | Equinix | Amsterdam |
| **[Fibrenoire](https://www.fibrenoire.ca/en/cloudextn)** | Megaport | Quebec City |
| **[FPT Telecom International](https://cloudconnect.vn/en)** |Equinix |Singapore|
| **[Gtt Communications Inc](https://www.gtt.net)** |Equinix | Washington DC |
| **[Gulf Bridge International](https://gbiinc.com/)** | Equinix | Amsterdam |
| **[HSO](https://www.hso.co.uk/products/cloud-direct)** |Equinix | London<br/>Slough |
| **[IVedha Inc](https://ivedha.com/cloud-services)**| Equinix | Toronto |
| **[Kaalam Telecom Bahrain B.S.C](https://kalaam-telecom.com/)**| Level 3 Communications |Amsterdam |
| **LGA Telecom** |Equinix |Singapore|
| **[Macroview Telecom](http://www.macroview.com/en/scripts/catitem.php?catid=solution&sectionid=expressroute)** |Equinix |Hong Kong 
| **[Macquarie Telecom Group](https://macquariegovernment.com/secure-cloud/secure-cloud-exchange/)** | Megaport | Sydney |
| **[MainOne](https://www.mainone.net/services/connectivity/cloud-connect/)** |Equinix | Amsterdam |
| **[Masergy](https://www.masergy.com/sd-wan/multi-cloud-connectivity)** | Equinix | Washington DC |
| **[Momentum Telecom](https://gomomentum.com/)** | Equinix<br/>Megaport | Atlanta<br/>Dallas<br/>Los Angeles<br/>Miami<br/>Seattle<br/>Silicon Valley<br/>Washington DC |
| **[MTN](https://www.mtnbusiness.co.za/en/Cloud-Solutions/Pages/microsoft-express-route.aspx)** | Teraco | Cape Town<br/>Johannesburg |
| **[NexGen Networks](https://www.nexgen-net.com/nexgen-networks-direct-connect-microsoft-azure-expressroute.html)** | Interxion | London |
| **[Nianet](https://www.globalconnect.dk/)** |Equinix | Amsterdam<br/>Frankfurt |
| **[Oncore Cloud Service Inc](https://www.oncore.cloud/services/ue-for-expressroute)**| Equinix | Montreal<br/>Toronto |
| **[POST Telecom Luxembourg](https://business.post.lu/grandes-entreprises/telecom-ict/telecom)**| Equinix | Amsterdam |
| **[Proximus](https://www.proximus.be/en/id_cl_explore/companies-and-public-sector/networks/corporate-networks/explore.html)**| Equinix | Amsterdam<br/>Dublin<br/>London<br/>Paris |
| **[QSC AG](https://www2.qbeyond.de/en/)** |Interxion | Frankfurt |  
| **[RETN](https://retn.net/products/cloud-connect)** | Equinix | Amsterdam |
| **[Rogers]** | Cologix<br/>Equinix | Montreal<br/>Toronto |
| **[Spectrum Enterprise](https://enterprise.spectrum.com/services/internet-networking/wan/cloud-connect.html)** | Equinix | Chicago<br/>Dallas<br/>Los Angeles<br/>New York<br/>Silicon Valley | 
| **[Tamares Telecom](http://www.tamarestelecom.com/our-services/#Connectivity)** | Equinix | London | 
| **[Tata Teleservices](https://www.tatatelebusiness.com/data-services/ez-cloud-connect/)** | Tata Communications | Chennai<br/>Mumbai |
| **[TDC Erhverv](https://tdc.dk/)** | Equinix | Amsterdam | 
| **[Telecom Italia Sparkle](https://www.tisparkle.com/our-platform/enterprise-platform/sparkle-cloud-connect)**| Equinix | Amsterdam |
| **[Telekom Deutschland GmbH](https://cloud.telekom.de/de/infrastruktur/managed-it-services/managed-hybrid-infrastructure-mit-microsoft-azure)** | Interxion | Amsterdam<br/>Frankfurt |
| **[Telia](https://www.telia.se/foretag/losningar/produkter-tjanster/datanet)** | Equinix | Amsterdam |
| **[ThinkTel](https://www.thinktel.ca/services/agile-ix-data/expressroute/)** | Equinix | Toronto | 
| **[United Information Highway (UIH)](https://www.uih.co.th/products-services/managed-services/cloud-direct/)**| Equinix | Singapore |
| **[Venha Pra Nuvem](https://venhapranuvem.com.br/)** | Equinix | Sao Paulo |
| **[Webair](https://opti9tech.com/partners/)**| Megaport | New York |
| **[Windstream](https://www.windstreamenterprise.com/solutions/)**| Equinix | Chicago<br/>Silicon Valley<br/>Washington DC |
| **[X2nsat Inc.](https://x2n.com/expressroute/)** |Coresite |Silicon Valley<br/>Silicon Valley 2|
| **Zain** |Equinix |London|
| **[Zertia](https://www.zertia.es)**| Level 3 | Madrid |
| **Zirro**| Cologix<br/>Equinix | Montreal<br/>Toronto |

## Connectivity through datacenter providers

| Provider | Exchange |
| --- | --- |
| **[CyrusOne](https://www.cyrusone.com/cloud-solutions/microsoft-azure)** | Megaport<br/>PacketFabric |
| **[Cyxtera](https://www.cyxtera.com/data-center-services/interconnection)** | Megaport<br/>PacketFabric |
| **[Databank](https://www.databank.com/platforms/connectivity/cloud-direct-connect/)** | Megaport |
| **[DataFoundry](https://www.datafoundry.com/services/cloud-connect/)** | Megaport |
| **[Digital Realty](https://www.digitalrealty.com/services/interconnection/service-exchange/)** | IX Reach<br/>Megaport PacketFabric |
| **[EdgeConnex](https://www.edgeconnex.com/services/edge-data-centers-proximity-matters/)** | Megaport<br/>PacketFabric |
| **[Flexential](https://www.flexential.com/connectivity/cloud-connect-microsoft-azure-expressroute)** | IX Reach<br/>Megaport<br/>PacketFabric |
| **[QTS Data Centers](https://www.qtsdatacenters.com/hybrid-solutions/connectivity/azure-cloud)** | Megaport<br/>PacketFabric |
| **[Stream Data Centers](https://www.streamdatacenters.com/products-services/network-cloud/)** | Megaport |
| **RagingWire Data Centers** | IX Reach<br/>Megaport<br/>PacketFabric |
| **[T5 Datacenters](https://t5datacenters.com/)** | IX Reach |
| **vXchnge** | IX Reach<br/>Megaport |

## Connectivity through National Research and Education Networks (NREN)

| Provider |
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

* If your connectivity provider isn't listed here, check to see if they're connected to any of the ExpressRoute Exchange Partners listed above.

## ExpressRoute system integrators
Enabling private connectivity to fit your needs can be challenging, based on the scale of your network. You can work with any of the system integrators listed in the following table to assist you with onboarding to ExpressRoute.

| System integrator | Continent |
| --- | --- |
| **[Altogee](https://altogee.be/diensten/express-route/)** | Europe |
| **[Avanade Inc.](https://www.avanade.com/)** | Asia<br/>Europe<br/>North America<br/>South America |
| **[Bright Skies GmbH](https://www.rackspace.com/bright-skies)** | Europe
| **[Optus](https://www.optus.com.au/enterprise/networking/network-connectivity/express-link/)** | Australia
| **[Equinix Professional Services](https://www.equinix.com/services/consulting/)** | North America |
| **[FlexManage](https://www.flexmanage.com/cloud)** | North America |
| **[Lightstream](https://www.lightstream.tech/partners/microsoft-azure/)** | North America |
| **[The IT Consultancy Group](https://itconsult.com.au/)** | Australia |
| **[MOQdigital](https://www.brennanit.com.au/solutions/cloud-services/)** | Australia |
| **[MSG Services](https://www.msg-services.de/it-services/managed-services/cloud-outsourcing/)** | Europe (Germany) |
| **[Nelite](https://www.exakis-nelite.com/offres/)** | Europe |
| **[New Signature](https://www.cognizant.com/us/en/services/cloud-solutions/microsoft-business-group)** | Europe |
| **[OneAs1a](https://www.oneas1a.com/connectivity.html)** | Asia |
| **[Orange Networks](https://www.orange-networks.com/blog/88-azureexpressroute)** | Europe |
| **[Perficient](https://www.perficient.com/Partners/Microsoft/Cloud/Azure-ExpressRoute)** | North America |
| **[Presidio](https://www.presidio.com/subpage/1107/microsoft-azure)** | North America |
| **[sol-tec](https://www.sol-tec.com/what-we-do/)** | Europe |
| **[Venha Pra Nuvem](https://venhapranuvem.com.br/)** | South America |
| **[Vigilant.IT](https://vigilant.it/networking-services/microsoft-azure-networking/)** | Australia |

## Next steps
* For more information about ExpressRoute, see the [ExpressRoute FAQ](expressroute-faqs.md).
* Ensure that all prerequisites are met. See [ExpressRoute prerequisites](expressroute-prerequisites.md).

<!--Image References-->
[0]: ./media/expressroute-locations/expressroute-locations-map.png "Location map"
