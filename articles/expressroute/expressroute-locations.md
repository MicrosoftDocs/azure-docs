---
title: Connectivity providers and locations for Azure ExpressRoute
description: This article provides a detailed overview of peering locations served by each ExpressRoute connectivity provider to connect to Azure.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: conceptual
ms.date: 07/31/2024
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

Azure regions are global datacenters where Azure compute, networking, and storage resources are hosted. When creating an Azure resource, you need to select the resource location, which determines the specific Azure datacenter (or availability zone) where the resource is deployed.

## ExpressRoute locations

ExpressRoute locations, also known as peering locations or meet-me locations, are co-location facilities where Microsoft Enterprise Edge (MSEE) devices are situated. These locations serve as the entry points to Microsoft's network and are globally distributed, offering the ability to connect to Microsoft's network worldwide. ExpressRoute partners and ExpressRoute Direct user establish cross connections to Microsoft's network at these locations. Generally, the ExpressRoute location doesn't need to correspond with the Azure region. For instance, you can create an ExpressRoute circuit with the resource location in *East US* for the *Seattle* peering location.

You have access to Azure services across all regions within a geopolitical region if you're connecting to at least one ExpressRoute location within the geopolitical region.

[!INCLUDE [expressroute-azure-regions-geopolitical-region](../../includes/expressroute-azure-regions-geopolitical-region.md)]

## <a name="partners"></a>ExpressRoute connectivity providers

The following table shows locations by service provider. If you want to view available providers by location, see [Service providers by location](expressroute-locations-providers.md).

### Global commercial Azure

#### [A-C](#tab/a-c)

|Service provider | Microsoft Azure | Microsoft 365  | Locations |
| --- | --- | --- | --- |
| **[AARNet](https://www.aarnet.edu.au/network-and-services/connectivity-services/azure-expressroute)** |&check; |&check; | Melbourne<br/>Sydney |
| **[Airtel](https://www.airtel.in/business/#/)** | &check; | &check; | Chennai2<br/>Mumbai2<br/>Pune |
| **[AIS](https://business.ais.co.th/solution/en/azure-expressroute.html)** | &check; | &check; | Bangkok |
| **[Aryaka Networks](https://www.aryaka.com/)** | &check; | &check; | Amsterdam<br/>Chicago<br/>Dallas<br/>Hong Kong<br/>Sao Paulo<br/>Seattle<br/>Silicon Valley<br/>Singapore<br/>Tokyo<br/>Washington DC |
| **[Ascenty Data Centers](https://www.ascenty.com/en/cloud/microsoft-express-route)** | &check; | &check; | Campinas<br/>Sao Paulo<br/>Sao Paulo2 |
| **AT&T Connectivity Plus** | &check; | &check; | Dallas |
| **AT&T Dynamic Exchange** | &check; | &check; | Chicago<br/>Dallas<br/>Los Angeles<br/>Miami<br/>Silicon Valley |
| **[AT&T NetBond](https://www.synaptic.att.com/clouduser/html/productdetail/ATT_NetBond.htm)** | &check; | &check; | Amsterdam<br/>Chicago<br/>Dallas<br/>Frankfurt<br/>London<br/>Phoenix<br/>Silicon Valley<br/>Singapore<br/>Sydney<br/>Tokyo<br/>Toronto<br/>Washington DC |
| **[AT TOKYO](https://www.attokyo.com/connectivity/azure.html)** | &check; | &check; | Osaka<br/>Tokyo2 |
| **[BBIX](https://www.bbix.net/en/service/ix/)** | &check; | &check; | Osaka<br/>Tokyo<br/>Tokyo2 |
| **[BCX](https://www.bcx.co.za/solutions/connectivity/)** | &check; | &check; | Cape Town<br/>Johannesburg|
| **[Bell Canada](https://business.bell.ca/shop/enterprise/cloud-connect-access-to-cloud-partner-services)** | &check; | &check; | Montreal<br/>Toronto<br/>Quebec City<br/>Vancouver |
| **[Bezeq International](https://selfservice.bezeqint.net/web/guest/english/company-profile)** | &check; | &check; | London<br/>Tel Aviv |
| **[BICS](https://www.bics.com/cloud-connect/)** | &check; | &check; | Amsterdam2<br/>London2 |
| **[British Telecom](https://www.globalservices.bt.com/en/solutions/products/cloud-connect-azure)** | &check; | &check; | Amsterdam<br/>Amsterdam2<br/>Chicago<br/>Frankfurt<br/>Hong Kong<br/>Johannesburg<br/>London<br/>London2<br/>Mumbai<br/>Newport(Wales)<br/>Paris<br/>Sao Paulo<br/>Silicon Valley<br/>Singapore<br/>Sydney<br/>Tokyo<br/>Washington DC |
| **BSNL** | &check; | &check; | Chennai<br/>Mumbai |
| **[C3ntro](https://www.c3ntro.com/)** | &check; | &check; | Miami |
| **Cello** | &check; | &check; | Sydney |
| **CDC** | &check; | &check; | Canberra<br/>Canberra2 |
| **[CenturyLink Cloud Connect](https://www.centurylink.com/cloudconnect)** | &check; | &check; | Amsterdam2<br/>Chicago<br/>Dallas<br/>Dublin<br/>Frankfurt<br/>Hong Kong<br/>Las Vegas<br/>London<br/>London2<br/>Montreal<br/>New York<br/>Paris<br/>Phoenix<br/>San Antonio<br/>Seattle<br/>Silicon Valley<br/>Singapore2<br/>Tokyo<br/>Toronto<br/>Washington DC<br/>Washington DC2 |
| **[Chief Telecom](https://www.chief.com.tw/)** |&check; |&check; | Hong Kong<br/>Taipei |
| **China Mobile International** |&check; |&check; | Hong Kong<br/>Hong Kong2<br/>Singapore |
| **China Telecom Global** |&check; |&check; | Hong Kong<br/>Hong Kong2 |
| **China Unicom Global** |&check; |&check; | Frankfurt<br/>Hong Kong<br/>Los Angeles<br/>Silicon Valley<br/>Singapore2<br/>Tokyo2 |
| **Chunghwa Telecom** |&check; |&check; | Taipei |
| **[Cinia](https://www.cinia.fi/)** |&check; |&check; | Amsterdam2<br/>Stockholm |
| **[Cirion Technologies](https://lp.ciriontechnologies.com/cloud-connect-lp-latam?c_campaign=HOTSITE&c_tactic=&c_subtactic=&utm_source=SOLUCIONES-CTA&utm_medium=Organic&utm_content=&utm_term=&utm_campaign=HOTSITE-ESP)** | &check; | &check; | Queretaro<br/>Rio De Janeiro<br/>Santiago |
| **Claro** |&check; |&check; | Miami |
| **Cloudflare** |&check; |&check; | Los Angeles |
| **[Cologix](https://cologix.com/connectivity/cloud/cloud-connect/microsoft-azure/)** |&check; |&check; | Chicago<br/>Dallas<br/>Minneapolis<br/>Montreal<br/>Toronto<br/>Vancouver<br/>Washington DC |
| **[Claro](https://www.usclaro.com/enterprise-mnc/connectivity/mpls/)** |&check; |&check; | Miami |
| **Cloudflare** |&check; |&check; | Los Angeles |
| **[Cologix](https://cologix.com/connectivity/cloud/cloud-connect/microsoft-azure/)** | &check; | &check; | Chicago<br/>Dallas<br/>Minneapolis<br/>Montreal<br/>Toronto<br/>Vancouver<br/>Washington DC |
| **[Colt](https://www.colt.net/direct-connect/azure/)** | &check; | &check; | Amsterdam<br/>Amsterdam2<br/>Berlin<br/>Chicago<br/>Dublin<br/>Frankfurt<br/>Frankfurt2<br/>Geneva<br/>Hong Kong<br/>London<br/>London2<br/>Marseille<br/>Milan<br/>Munich<br/>Newport<br/>Osaka<br/>Paris<br/>Paris2<br/>Seoul<br/>Silicon Valley<br/>Singapore2<br/>Tokyo<br/>Tokyo2<br/>Washington DC<br/>Zurich |
| **[Comcast](https://business.comcast.com/landingpage/microsoft-azure)** | &check; | &check; | Chicago<br/>Silicon Valley<br/>Washington DC |
| **[CoreSite](https://www.coresite.com/solutions/cloud-services/public-cloud-providers/microsoft-azure-expressroute)** | &check; | &check; | Chicago<br/>Chicago2<br/>Denver<br/>Los Angeles<br/>New York<br/>Silicon Valley<br/>Silicon Valley2<br/>Washington DC<br/>Washington DC2 |
| **[Cox Business Cloud Port](https://www.cox.com/business/networking/cloud-connectivity.html)** | &check; | &check; | Dallas<br/>Phoenix<br/>Silicon Valley<br/>Washington DC |
| **Crown Castle** | &check; | &check; | Los Angeles2<br/>New York<br/>Washington DC |

#### [D-I](#tab/d-i)

|Service provider | Microsoft Azure | Microsoft 365  | Locations |
| --- | --- | --- | --- |
| **[DE-CIX](https://www.de-cix.net/en/services/directcloud/microsoft-azure)** | &check; |&check; | Amsterdam2<br/>Chennai<br/>Chicago2<br/>Copenhagen<br/>Dallas<br/>Dubai2<br/>Frankfurt<br/>Frankfurt2<br/>Kuala Lumpur<br/>Madrid<br/>Marseille<br/>Mumbai<br/>Munich<br/>New York<br/>Osaka<br/>Oslo<br/>Phoenix<br/>Seattle<br/>Singapore2<br/>Tokyo2 |
| **[Devoli](https://devoli.com/expressroute)** | &check; |&check; | Auckland<br/>Melbourne<br/>Sydney |
| **[Deutsche Telekom AG IntraSelect](https://geschaeftskunden.telekom.de/vernetzung-digitalisierung/produkt/intraselect)** | &check; |&check; | Frankfurt |
| **[Deutsche Telekom AG](https://www.t-systems.com/de/en/cloud-services/solutions/public-cloud/azure-managed-cloud-services/cloud-connect-for-azure)** | &check; |&check; | Amsterdam<br/>Frankfurt2<br/>Hong Kong2 |
| **[Digital Realty](https://www.digitalrealty.com/partners/microsoft-azure)** | &check; | &check; | Dallas2<br/>Seattle<br/>Silicon Valley<br/>Washington DC |
| **du datamena** |&check; |&check; | Dubai2 |
| **[eir evo](https://www.eirevo.ie/cloud-services/cloud-connectivity)** |&check; |&check; | Dublin |
| **[Epsilon Global Communications](https://epsilontel.com/solutions/cloud-connect/)** | &check; | &check; | Hong Kong2<br/>London2<br/>Singapore<br/>Singapore2 |
| **[Equinix](https://www.equinix.com/partners/microsoft-azure/)** | &check; | &check; | Amsterdam<br/>Amsterdam2<br/>Atlanta<br/>Berlin<br/>Canberra2<br/>Chicago<br/>Dallas<br/>Dubai2<br/>Dublin<br/>Frankfurt<br/>Frankfurt2<br/>Geneva<br/>Hong Kong<br/>Hong Kong2<br/>London<br/>London2<br/>Los Angeles*<br/>Los Angeles2<br/>Madrid2<br/>Melbourne<br/>Miami<br/>Milan<br/>Mumbai2<br/>New York<br/>Osaka<br/>Paris<br/>Paris2<br/>Perth<br/>Quebec City<br/>Rio de Janeiro<br/>Sao Paulo<br/>Seattle<br/>Seoul<br/>Silicon Valley<br/>Singapore<br/>Singapore2<br/>Stockholm<br/>Sydney<br/>Tokyo<br/>Tokyo2<br/>Toronto<br/>Washington DC<br/>Warsaw<br/>Zurich</br>Zurich2</br></br> **New ExpressRoute circuits are no longer supported with Equinix in Los Angeles. Create new circuits in Los Angeles2.* |
| **Etisalat UAE** |&check; |&check; | Dubai |
| **[euNetworks](https://eunetworks.com/services/solutions/cloud-connect/microsoft-azure-expressroute/)** | &check; | &check; | Amsterdam<br/>Amsterdam2<br/>Dublin<br/>Frankfurt<br/>London<br/>Paris |
| **Exatel** |&check; |&check; | Warsaw |
| **[FarEasTone](https://www.fetnet.net/corporate/en/Enterprise.html)** | &check; | &check; | Taipei |
| **[Fastweb](https://www.fastweb.it/grandi-aziende/dati-voce/scheda-prodotto/fast-company/)** | &check; |&check; | Milan |
| **[Fibrenoire](https://fibrenoire.ca/en/services/cloudextn-2/)** | &check; | &check; | Montreal<br/>Quebec City<br/>Toronto2 |
| **[GBI](https://www.gbiinc.com/microsoft-azure/)** | &check; | &check; | Dubai2<br/>Frankfurt |
| **[GÉANT](https://www.geant.org/Networks)** | &check; | &check; | Amsterdam<br/>Amsterdam2<br/>Dublin<br/>Frankfurt<br/>Marseille |
| **[GlobalConnect](https://www.globalconnect.no/)** | &check; | &check; | Amsterdam<br/>Copenhagen<br/>Oslo<br/>Stavanger<br/>Stockholm | 
| **[GlobalConnect DK](https://www.globalconnect.no/)** | &check; | &check; | Amsterdam | 
| **GTT** |&check; |&check; | Amsterdam<br/>Dallas<br/>Los Angeles2<br/>London2<br/>Singapore<br/>Sydney<br/>Washington DC |
| **[Global Cloud Xchange (GCX)](https://globalcloudxchange.com/cloud-platform/cloud-x-fusion/)** | &check;| &check; | Chennai<br/>Mumbai |
| **[iAdvantage](https://www.scx.sunevision.com/)** | &check; | &check; | Hong Kong2 |
| **Intelsat** | &check; | &check; | London2<br/>Washington DC2 |
| **[InterCloud](https://www.intercloud.com/)** |&check; |&check; | Amsterdam<br/>Chicago<br/>Dallas<br/>Dublin2<br/>Frankfurt<br/>Frankfurt2<br/>Geneva<br/>Hong Kong<br/>London<br/>Madrid<br/>Mumbai<br/>New York<br/>Paris<br/>Paris2<br/>Sao Paulo<br/>Silicon Valley<br/>Singapore<br/>Tokyo<br/>Washington DC<br/>Zurich |
| **[Internet2](https://internet2.edu/services/cloud-connect/#service-cloud-connect)** | &check; | &check; | Chicago<br/>Dallas<br/>Silicon Valley<br/>Washington DC |
| **[Internet Initiative Japan Inc. - IIJ](https://www.iij.ad.jp/en/news/pressrelease/2015/1216-2.html)** | &check; | &check; | Osaka<br/>Tokyo<br/>Tokyo2 |
| **[Internet Solutions - Cloud Connect](https://www.is.co.za/solution/cloud-connect/)** | &check; | &check; | Cape Town<br/>Johannesburg<br/>London |
| **[Interxion (Digital Realty)](https://www.digitalrealty.com/partners/microsoft-azure)** | &check; | &check; | Amsterdam<br/>Amsterdam2<br/>Copenhagen<br/>Dublin<br/>Dublin2<br/>Frankfurt<br/>London<br/>London2<br/>Madrid<br/>Marseille<br/>Paris<br/>Stockholm<br/>Zurich |
| **IPC** | &check; |&check; | Washington DC |
| **[IRIDEOS](https://irideos.it/)** | &check; | &check; | Milan |
| **Iron Mountain** | &check; |&check; | Washington DC |
| **[IX Reach](https://www.ixreach.com/partners/cloud-partners/microsoft-azure/)**| &check; | &check; | Amsterdam<br/>London2<br/>Silicon Valley<br/>Tokyo2<br/>Toronto<br/>Washington DC |

#### [J-M](#tab/j-m)

|Service provider | Microsoft Azure | Microsoft 365  | Locations |
| --- | --- | --- | --- |
| **Jaguar Network** |&check; |&check; | Marseille<br/>Paris |
| **[Jisc](https://www.jisc.ac.uk/microsoft-azure-expressroute)** | &check; | &check; | London<br/>London2<br/>Newport(Wales) |
| **KDDI** | &check; | &check; | Osaka<br/>Tokyo<br/>Tokyo2 |
| **[KINX](https://www.kinx.net/service/cloudhub/clouds/microsoft_azure_expressroute/?lang=en)** | &check; | &check; | Seoul |
| **[Kordia](https://www.kordia.co.nz/cloudconnect)** | &check; | &check; | Auckland<br/>Sydney |
| **[KPN](https://www.kpn.com/zakelijk/cloud/connect.htm)** | &check; | &check; | Amsterdam<br/>Dublin2|
| **[KT](https://cloud.kt.com/)** | &check; | &check; | Seoul<br/>Seoul2 |
| **[Level 3 Communications](https://www.lumen.com/en-us/hybrid-it-cloud/cloud-connect.html)** | &check; | &check; | Amsterdam<br/>Chicago<br/>Dallas<br/>London<br/>Newport (Wales)<br/>Sao Paulo<br/>Seattle<br/>Silicon Valley<br/>Singapore<br/>Washington DC |
| **LG CNS** | &check; | &check; | Busan<br/>Seoul |
| **Lightpath** | &check; | &check; | New York<br/>Washington DC |
| **[Lightstorm](https://polarin.lightstorm.net/)** | &check; | &check; | Chennai<br/>Dubai2<br/>Mumbai<br/>Pune<br/>Singapore2 |
| **[Liquid Intelligent Technologies](https://liquidcloud.africa/connect/)** | &check; | &check; | Cape Town<br/>Johannesburg |
| **[LGUplus](http://www.uplus.co.kr/)** |&check; |&check; | Seoul |
| **[MCM Telecom](https://www.mcmtelecom.com/alianza-microsoft)** | &check; | &check; | Dallas<br/>Queretaro (Mexico)|
| **[Megaport](https://www.megaport.com/services/microsoft-expressroute/)** | &check; | &check; | Amsterdam<br/>Amsterdam2<br/>Atlanta<br/>Auckland<br/>Chicago<br/>Dallas<br/>Denver<br/>Dubai2<br/>Dublin<br/>Dublin2<br/>Frankfurt<br/>Geneva<br/>Hong Kong<br/>Hong Kong2<br/>Las Vegas<br/>London<br/>London2<br/>Los Angeles<br/>Madrid<br/>Melbourne<br/>Miami<br/>Minneapolis<br/>Montreal<br/>Munich<br/>New York<br/>Osaka<br/>Oslo<br/>Paris<br/>Perth<br/>Phoenix<br/>Quebec City<br/>Queretaro (Mexico)<br/>San Antonio<br/>Seattle<br/>Silicon Valley<br/>Singapore<br/>Singapore2<br/>Stavanger<br/>Stockholm<br/>Sydney<br/>Sydney2<br/>Tokyo<br/>Tokyo2<br/>Toronto<br/>Vancouver<br/>Washington DC<br/>Washington DC2<br/>Zurich |
| **[Momentum Telecom](https://gomomentum.com/)** | &check; | &check; | Atlanta<br/>Chicago<br/>Dallas<br/>Miami<br/>New York<br/>Silicon Valley<br/>Washington DC2 |
| **[MTN](https://www.mtnbusiness.co.za/en/Cloud-Solutions/Pages/microsoft-express-route.aspx)** | &check; | &check; | London |
| **MTN Global Connect** | &check; | &check; | Cape Town<br/>Johannesburg|

#### [N-Q](#tab/n-q)

|Service provider | Microsoft Azure | Microsoft 365  | Locations |
| --- | --- | --- | --- |
| **[National Telecom](https://www.nc.ntplc.co.th/cat/category/264/855/CAT+Direct+Cloud+Connect+for+Microsoft+ExpressRoute?lang=en_EN)** | &check; | &check; | Bangkok |
| **NEC** | &check; | &check; | Tokyo3 |
| **[NETSG](https://www.netsg.co/dc-cloud/cloud-and-dc-interconnect/)** | &check; | &check; | Melbourne<br/>Sydney2 |
| **[Neutrona Networks](https://flo.net/)** | &check; | &check; | Dallas<br/>Los Angeles<br/>Miami<br/>Sao Paulo<br/>Washington DC |
| **[Next Generation Data](https://vantage-dc-cardiff.co.uk/)** | &check; | &check; | Newport(Wales) |
| **[NEXTDC](https://www.nextdc.com/services/axon-ethernet/microsoft-expressroute)** | &check; | &check; | Melbourne<br/>Perth<br/>Sydney<br/>Sydney2 |
| **NL-IX** | &check; | &check; | Amsterdam2<br/>Dublin2 |
| **[NOS](https://www.nos.pt/empresas/solucoes/cloud/cloud-publica/nos-cloud-connect)** | &check; | &check; | Amsterdam2<br/>Madrid |
| **Noovle** | &check; | &check; | Milan |
| **[NTT Communications](https://www.ntt.com/en/services/network/virtual-private-network.html)** | &check; | &check; | Amsterdam<br/>Hong Kong<br/>London<br/>Los Angeles<br/>New York<br/>Osaka<br/>Singapore<br/>Sydney<br/>Tokyo<br/>Washington DC |
| **NTT Communications India Network Services Pvt Ltd** | &check; | &check; | Chennai<br/>Mumbai |
| **[NTT Communications - Flexible InterConnect](https://sdpf.ntt.com/)** |&check; |&check; | Jakarta<br/>Osaka<br/>Singapore2<br/>Tokyo<br/>Tokyo2 |
| **[NTT EAST](https://business.ntt-east.co.jp/service/crossconnect/)** |&check; |&check; | Tokyo |
| **[NTT Global DataCenters EMEA](https://hello.global.ntt/)** |&check; |&check; | Amsterdam2<br/>Berlin<br/>Frankfurt<br/>London2 |
| **[NTT SmartConnect](https://cloud.nttsmc.com/cxc/azure.html)** |&check; |&check; | Osaka |
| **[Ooredoo Cloud Connect](https://www.ooredoo.com.kw/portal/en/b2bOffConnAzureExpressRoute)** |&check; |&check; | Doha<br/>Doha2<br/>London2<br/>Marseille |
| **[Optus](https://www.optus.com.au/enterprise/networking/network-connectivity/express-link/)** |&check; |&check; | Melbourne<br/>Sydney |
| **[Orange](https://www.orange-business.com/en/products/business-vpn-galerie)** |&check; |&check; | Amsterdam<br/>Amsterdam2<br/>Chicago<br/>Dallas<br/>Dubai2<br/>Dublin2<br/>Frankfurt<br/>Hong Kong<br/>Johannesburg<br/>London<br/>London2<br/>Mumbai2<br/>Melbourne<br/>Paris<br/>Paris2<br/>Sao Paulo<br/>Silicon Valley<br/>Singapore<br/>Sydney<br/>Tokyo<br/>Toronto<br/>Washington DC |
| **[Orange Poland](https://www.orange.pl/duze-firmy/rozwiazania-chmurowe)** | &check; | &check; | Warsaw |
| **[Orixcom](https://www.orixcom.com/solutions/azure-expressroute)** | &check; | &check; | Dubai2 |
| **Pacific Northwest Gigapop** | &check; | &check; | Seattle |
| **[PacketFabric](https://www.packetfabric.com/cloud-connectivity/microsoft-azure)** | &check; | &check; | Amsterdam<br/>Atlanta<br/>Chicago<br/>Dallas<br/>Denver<br/>Las Vegas<br/>London<br/>Los Angeles2<br/>Miami<br/>New York<br/>Seattle<br/>Silicon Valley<br/>Toronto<br/>Washington DC |
| **[PCCW Global Limited](https://consoleconnect.com/clouds/#azureRegions)** | &check; | &check; | Chicago<br/>Hong Kong<br/>Hong Kong2<br/>London<br/>Singapore<br/>Singapore2<br/>Tokyo2 |
| **PitChile** | &check; | &check; | Santiago<br/>Miami |

#### [R-S](#tab/r-s)

|Service provider | Microsoft Azure | Microsoft 365  | Locations |
| --- | --- | --- | --- |
| **[REANNZ](https://www.reannz.co.nz/products-and-services/cloud-connect/)** | &check; | &check; | Auckland |
| **RedCLARA** | &check; | &check; | Sao Paulo |
| **[Reliance Jio](https://www.jio.com/business/jio-cloud-connect)** | &check; | &check; | Mumbai |
| **[Retelit](https://www.retelit.it/EN/Home.aspx)** | &check; | &check; | Milan |
| **RISQ** |&check; | &check; | Quebec City<br/>Montreal |
| **SCSK** |&check; | &check; | Tokyo3 |
| **[Sejong Telecom](https://www.sejongtelecom.net/)** | &check; | &check; | Seoul |
| **[SES](https://www.ses.com/networks/signature-solutions/signature-cloud/ses-and-azure-expressroute)** | &check; | &check; | London2<br/>Washington DC |
| **[SIFY](https://sifytechnologies.com/)** | &check; | &check; | Chennai<br/>Mumbai2 |
| **[SingTel](https://www.singtel.com/about-us/news-releases/singtel-provide-secure-private-access-microsoft-azure-public-cloud)** |&check; |&check; | Hong Kong2<br/>Singapore<br/>Singapore2 |
| **[SK Telecom](http://b2b.tworld.co.kr/bizts/solution/solutionTemplate.bs?solutionId=0085)** | &check; | &check; | Seoul |
| **[Softbank](https://www.softbank.jp/biz/cloud/cloud_access/direct_access_for_az/)** |&check; |&check; | Osaka<br/>Tokyo<br/>Tokyo2 |
| **[Sohonet](https://www.sohonet.com/product/fastlane/)** | &check; | &check; | Los Angeles<br/>London2 |
| **[Spark NZ](https://www.sparkdigital.co.nz/solutions/connectivity/cloud-connect/)** | &check; | &check; | Auckland<br/>Sydney |
| **[Swisscom](https://www.swisscom.ch/en/business/enterprise/offer/cloud-data-center/microsoft-cloud-services/microsoft-azure-von-swisscom.html)** | &check; | &check; | Geneva<br/>Zurich |

#### [T-Z](#tab/t-z)

|Service provider | Microsoft Azure | Microsoft 365  | Locations |
| --- | --- | --- | --- |
| **[Tata Communications](https://www.tatacommunications.com/solutions/network/cloud-ready-networks/)** | &check; | &check; | Amsterdam<br/>Chennai<br/>Chicago<br/>Hong Kong<br/>London<br/>Mumbai<br/>Pune<br/>Sao Paulo<br/>Silicon Valley<br/>Singapore<br/>Washington DC |
| **[Telefonica](https://www.telefonica.com/es/)** | &check; | &check; | Amsterdam<br/>Dallas<br/>Frankfurt2<br/>Hong Kong<br/>Madrid<br/>Sao Paulo<br/>Singapore<br/>Washington DC |
| **[Telehouse - KDDI](https://www.telehouse.net/solutions/cloud-services/cloud-link)** | &check; | &check; | London<br/>London2<br/>Singapore2 |
| **Telenor** |&check; |&check; | Amsterdam<br/>London<br/>Oslo<br/>Stavanger |
| **[Telia Carrier](https://www.arelion.com/products-and-services/internet-and-cloud/cloud-connect)** | &check; | &check; | Amsterdam<br/>Chicago<br/>Dallas<br/>Frankfurt<br/>Hong Kong<br/>London<br/>Oslo<br/>Paris<br/>Seattle<br/>Silicon Valley<br/>Stockholm<br/>Washington DC |
| **[Telin](https://telin.net/)** | &check; | &check; | Jakarta |
| **Telmex Uninet**| &check; | &check; | Dallas |
| **[Telstra Corporation](https://www.telstra.com.au/business-enterprise/network-services/networks/cloud-direct-connect/)** | &check; | &check; | Canberra<br/>Melbourne<br/>Singapore<br/>Sydney |
| **[Telus](https://www.telus.com)** | &check; | &check; | Montreal<br/>Quebec City<br/>Seattle<br/>Toronto<br/>Vancouver |
| **[Teraco](https://www.teraco.co.za/services/africa-cloud-exchange/)** | &check; | &check; | Cape Town<br/>Johannesburg |
| **[TIME dotCom](https://www.time.com.my/enterprise/connectivity/direct-cloud)** | &check; | &check; | Kuala Lumpur |
| **[Tivit](https://tivit.com/en/home-ingles/)** |&check; |&check; | Sao Paulo2 |
| **[Tokai Communications](https://www.tokai-com.co.jp/en/)** | &check; | &check; | Osaka<br/>Tokyo2 |
| **TPG Telecom**| &check; | &check; | Melbourne<br/>Sydney |
| **[Transtelco](https://transtelco.net/enterprise-services/)** | &check; | &check; | Dallas<br/>Queretaro(Mexico City)|
| **[T-Mobile/Sprint](https://www.t-mobile.com/business/solutions/networking/cloud-networking)** |&check; |&check; | Chicago<br/>Silicon Valley<br/>Washington DC |
| **[T-Mobile Poland](https://biznes.t-mobile.pl/pl/produkty-i-uslugi/sieci-teleinformatyczne/cloud-on-edge)** |&check; |&check; | Warsaw |
| **[T-Systems](https://geschaeftskunden.telekom.de/vernetzung-digitalisierung/produkt/intraselect)** | &check; | &check; | Frankfurt |
| **UOLDIVEO** | &check; | &check; | Sao Paulo |
| **[UIH](https://www.uih.co.th/products-services/managed-services/cloud-direct/)** | &check; | &check; | Bangkok |
| **[Verizon](https://enterprise.verizon.com/products/network/application-enablement/secure-cloud-interconnect/)** | &check; | &check; | Amsterdam<br/>Chicago<br/>Dallas<br/>Frankfurt<br/>Hong Kong<br/>London<br/>Mumbai<br/>Paris<br/>Silicon Valley<br/>Singapore<br/>Sydney<br/>Tokyo<br/>Toronto<br/>Washington DC |
| **[Viasat](https://news.viasat.com/newsroom/press-releases/viasat-introduces-direct-cloud-connect-a-new-service-providing-fast-secure-private-connections-to-business-critical-cloud-services)** | &check; | &check; | Washington DC2 |
| **[Vocus Group NZ](https://www.vocus.co.nz/business/cloud-data-centres)** | &check; | &check; | Auckland<br/>Sydney |
| **Vodacom** | &check; | &check; | Cape Town<br/>Johannesburg|
| **[Vodafone](https://www.vodafone.com/business/products/cloud-and-edge)** | &check; | &check; | Amsterdam2<br/>Chicago<br/>Dallas<br/>Hong Kong2<br/>London<br/>London2<br/>Milan<br/>Silicon Valley<br/>Singapore |
| **[Vi (Vodafone Idea)](https://www.myvi.in/business/enterprise-solutions/connectivity/vpn-extended-connect)** | &check; | &check; | Chennai<br/>Mumbai2 |
| **Vodafone Qatar** | &check; | &check; | Doha |
| **XL Axiata** | &check; | &check; | Jakarta |
| **[Zayo](https://www.zayo.com/services/packet/cloudlink/)** | &check; | &check; | Amsterdam<br/>Chicago<br/>Dallas<br/>Denver<br/>Dublin<br/>Frankfurt<br/>Hong Kong<br/>London<br/>London2<br/>Los Angeles<br/>Montreal<br/>New York<br/>Paris<br/>Phoenix<br/>San Antonio<br/>Seattle<br/>Silicon Valley<br/>Toronto<br/>Toronto2<br/>Vancouver<br/>Washington DC<br/>Washington DC2<br/>Zurich|

---

### National cloud environment

Azure national clouds are isolated from each other and from the Azure public cloud. ExpressRoute for one Azure cloud can't connect to the Azure regions in the others. 

#### [US Government cloud](#tab/us-government-cloud)

| Service provider | Microsoft Azure | Office 365 | Locations |
| --- | --- | --- | --- |
| **[AT&T NetBond](https://www.synaptic.att.com/clouduser/html/productdetail/ATT_NetBond.htm)** |&check; |&check; |Chicago<br/>Phoenix<br/>Silicon Valley<br/>Washington DC |
| **[CenturyLink Cloud Connect](https://www.centurylink.com/cloudconnect)** |&check; |&check; |New York<br/>Phoenix<br/>San Antonio<br/>Washington DC |
| **[Equinix](https://www.equinix.com/partners/microsoft-azure/)** |&check; |&check; |Atlanta<br/>Chicago<br/>Dallas<br/>New York<br/>Seattle<br/>Silicon Valley<br/>Washington DC |
| **[Internet2](https://internet2.edu/services/microsoft-azure-expressroute/)** |&check; |&check; |Dallas |
| **[Level 3 Communications](https://www.lumen.com/en-us/hybrid-it-cloud/cloud-connect.html)** |&check; |&check; |Chicago<br/>Silicon Valley<br/>Washington DC |
| **[Megaport](https://www.megaport.com/services/microsoft-expressroute/)** |&check; | &check; | Chicago<br/>Dallas<br/>San Antonio<br/>Seattle<br/>Washington DC |
| **[Verizon](http://news.verizonenterprise.com/2014/04/secure-cloud-interconnect-solutions-enterprise/)** |&check; |&check; |Chicago<br/>Dallas<br/>New York<br/>Silicon Valley<br/>Washington DC |

#### [China cloud](#tab/china-cloud)

| Service provider | Microsoft Azure | Office 365 | Locations |
| --- | --- | --- | --- |
| **China Telecom** |&check; |&cross; |Beijing<br/>Beijing2<br/>Shanghai<br/>Shanghai2 |
| **China Mobile** | &check; | &cross; | Beijing2<br/>Shanghai2 |
| **China Unicom** | &check; | &cross; | Beijing2<br/>Shanghai2 |
| **[GDS](http://www.gds-services.com/en/about_2.html)** |&check; |&cross; |Beijing2<br/>Shanghai2 |

To learn more, see [ExpressRoute in China](https://www.azure.cn/home/features/expressroute/).

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
  * [Momentum Telecom](https://gomomentum.com/)
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

#### [A-C](#tab/a-C)

| Connectivity provider | Exchange | Locations |
| --- | --- | --- |
| **[1CLOUDSTAR](https://www.1cloudstar.com/services/cloudconnect-azure-expressroute.html)** | Equinix |Singapore |
| **[Airgate Technologies, Inc.](https://www.airgate.ca/)** | Equinix<br/>Cologix | Toronto<br/>Montreal |
| **[Alaska Communications](https://www.alaskacommunications.com/Business)** |Equinix |Seattle |
| **[Altice Business](https://lightpathfiber.com/applications/cloud-connect)** |Equinix |New York<br/>Washington DC |
| **[Aptum Technologies](https://aptum.com/services/cloud/managed-azure/)**| Equinix | Montreal<br/>Toronto |
| **[Arteria Networks Corporation](https://www.arteria-net.com/business/service/cloud/sca/)** |Equinix |Tokyo |
| **Axtel** |Equinix |Dallas|
| **[Beanfield Metroconnect](https://www.beanfield.com/business/cloud-exchange)** |Megaport |Toronto|
| **[Bezeq International Ltd.](https://selfservice.bezeqint.net/english/company-profile)** | euNetworks | London |
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

#### [D-M](#tab/d-m)

| Connectivity provider | Exchange | Locations |
| --- | --- | --- |
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
| **[MainOne](https://www.mainone.net/connectivity-services/cloud-connect/)** |Equinix | Amsterdam |
| **[Masergy](https://www.masergy.com/sd-wan/multi-cloud-connectivity)** | Equinix | Washington DC |
| **[Momentum Telecom](https://gomomentum.com/)** | Equinix<br/>Megaport | Atlanta<br/>Los Angeles<br/>Seattle<br/>Washington DC |
| **[MTN](https://www.mtnbusiness.co.za/en/Cloud-Solutions/Pages/microsoft-express-route.aspx)** | Teraco | Cape Town<br/>Johannesburg |

#### [N-Z](#tab/n-z)

| Connectivity provider | Exchange | Locations |
| **[NexGen Networks](https://www.nexgen-net.com/nexgen-networks-direct-connect-microsoft-azure-expressroute.html)** | Interxion | London |
| **[Nianet](https://www.globalconnect.dk/)** |Equinix | Amsterdam<br/>Frankfurt |
| **[Oncore Cloud Service Inc](https://www.oncore.cloud/services/ue-for-expressroute)**| Equinix | Montreal<br/>Toronto |
| **POST Telecom Luxembourg**| Equinix | Amsterdam |
| **[Proximus](https://www.proximus.be/en/id_cl_explore/companies-and-public-sector/networks/corporate-networks/explore.html)**| Bics | Amsterdam<br/>Dublin<br/>London<br/>Paris |
| **[QSC AG](https://www2.qbeyond.de/en/)** |Interxion | Frankfurt |  
| **[RETN](https://retn.net/products/cloud-connect)** | Equinix | Amsterdam |
| **Rogers** | Cologix<br/>Equinix | Montreal<br/>Toronto |
| **[Spectrum Enterprise](https://enterprise.spectrum.com/services/internet-networking/wan/cloud-connect.html)** | Equinix | Chicago<br/>Dallas<br/>Los Angeles<br/>New York<br/>Silicon Valley | 
| **[Tamares Telecom](https://www.tamarestelecom.com/services/)** | Equinix | London | 
| **[Tata Teleservices](https://www.tatatelebusiness.com/data-services/ez-cloud-connect/)** | Tata Communications | Chennai<br/>Mumbai |
| **[TDC Erhverv](https://tdc.dk/)** | Equinix | Amsterdam | 
| **Telecom Italia Sparkle**| Equinix | Amsterdam |
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
| **[Cyxtera](https://centersquaredc.com/products)** | Megaport<br/>PacketFabric |
| **[Databank](https://www.databank.com/platforms/connectivity/cloud-direct-connect/)** | Megaport |
| **[DataFoundry](https://www.datafoundry.com/services/cloud-connect/)** | Megaport |
| **[Digital Realty](https://www.digitalrealty.com/platform-digital/connectivity)** | IX Reach<br/>Megaport PacketFabric |
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

> [!NOTE]
> If your connectivity provider isn't listed here, you can verify if they are connected to any of the other ExpressRoute Exchange Partners mentioned previously.

## ExpressRoute system integrators

Enabling private connectivity to meet your needs can be challenging, depending on the scale of your network. You can collaborate with any of the system integrators listed in the following table to assist with onboarding to ExpressRoute.

| System integrator | Continent |
| --- | --- |
| **[Altogee](https://altogee.be/diensten/express-route/)** | Europe |
| **[Avanade Inc.](https://www.avanade.com/)** | Asia<br/>Europe<br/>North America<br/>South America |
| **[Bright Skies GmbH](https://www.rackspace.com/bright-skies)** | Europe
| **[Optus](https://www.optus.com.au/enterprise/networking/network-connectivity/express-link/)** | Australia
| **[Equinix Professional Services](https://www.equinix.com/services/consulting/)** | North America |
| **[New Era](https://www.neweratech.com/us/)** | North America |
| **[Lightstream](https://www.lightstream.tech/partners/microsoft-azure/)** | North America |
| **[The IT Consultancy Group](https://itconsult.com.au/)** | Australia |
| **[MOQdigital](https://www.brennanit.com.au/solutions/cloud-services/)** | Australia |
| **[MSG Services](https://www.msg-services.de/it-services/managed-services/cloud-outsourcing/)** | Europe (Germany) |
| **[Nelite](https://www.exakis-nelite.com/offres/)** | Europe |
| **[New Signature](https://www.cognizant.com/us/en/services/cloud-solutions/microsoft-business-group)** | Europe |
| **[OneAs1a](https://www.oneas1a.com/connectivity.html)** | Asia |
| **Orange Networks** | Europe |
| **[Perficient](https://www.perficient.com/Partners/Microsoft/Cloud/Azure-ExpressRoute)** | North America |
| **[Presidio](https://www.presidio.com/subpage/1107/microsoft-azure)** | North America |
| **[sol-tec](https://www.advania.co.uk/our-services/azure-and-cloud/)** | Europe |
| **[Venha Pra Nuvem](https://venhapranuvem.com.br/)** | South America |
| **[Vigilant.IT](https://vigilant.it/networking-services/microsoft-azure-networking/)** | Australia |

## Next steps

* For more information about ExpressRoute, see the [ExpressRoute FAQ](expressroute-faqs.md).
* Ensure that all prerequisites are met. For more information, see [ExpressRoute prerequisites](expressroute-prerequisites.md).

<!--Image References-->
[0]: ./media/expressroute-locations/expressroute-locations-map.png "Location map"
