---
title: Locations and connectivity providers for Azure ExpressRoute
description: This article provides a detailed overview of available providers and services per each ExpressRoute location to connect to Azure.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: concept-article
ms.date: 02/10/2025
ms.author: duau
ms.custom: references_regions, template-concept, engagement-fy23
---

# ExpressRoute peering locations and connectivity partners 

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

The following table shows connectivity locations and the service providers for each location. If you want to view service providers and the locations for which they can provide service, see [Locations by service provider](expressroute-locations.md).

* **Local Azure Regions** refers to the regions that can be accessed by [ExpressRoute Local](expressroute-faqs.md#expressroute-local) at each peering location. **&cross;** indicates that ExpressRoute Local isn't available at that peering location.

* **Zone** refers to [pricing](https://azure.microsoft.com/pricing/details/expressroute/).

* **ER Direct** refers to [ExpressRoute Direct](expressroute-erdirect-about.md) support at each peering location. If you want to view the available bandwidth at a location, see [Determine available bandwidth](expressroute-howto-erdirect.md#resources)

### Global commercial Azure

#### [A-C](#tab/a-c)

| Location | Address | Zone | Local Azure regions | ER Direct | Service providers |
|--|--|--|--|--|--|
| **Abu Dhabi** | Etisalat KDC | 3 | UAE Central | &check; |  |
| **Amsterdam** | [Equinix AM5](https://www.equinix.com/locations/europe-colocation/netherlands-colocation/amsterdam-data-centers/am5/) | 1 | West Europe | &check; | Aryaka Networks<br/>AT&T NetBond<br/>British Telecom<br/>Colt<br/>China Unicom Global<br/>Deutsche Telekom AG<br/>Equinix<br/>euNetworks<br/>GÉANT<br/>GlobalConnect<br/>InterCloud<br/>Interxion (Digital Realty)<br/>KPN<br/>IX Reach<br/>Level 3 Communications<br/>Megaport<br/>NTT Communications<br/>Orange<br/>Tata Communications<br/>Telecom Italia Sparkle<br/>Telefonica<br/>Telenor<br/>Telia Carrier<br/>Verizon<br/>Zayo |
| **Amsterdam2** | [Interxion AMS8](https://www.interxion.com/Locations/amsterdam/schiphol/) | 1 | West Europe | &check; | BICS<br/>British Telecom<br/>CenturyLink Cloud Connect<br/>Cinia<br/>Colt<br/>DE-CIX<br/>Equinix<br/>euNetworks<br/>GÉANT<br/>Interxion (Digital Realty)<br/>Megaport<br/>NL-IX<br/>NOS<br/>NTT Global DataCenters EMEA<br/>Orange<br/>Vodafone |
| **Atlanta** | [Equinix AT1](https://www.equinix.com/data-centers/americas-colocation/united-states-colocation/atlanta-data-centers/at1) | 1 | &cross; | &check; | Equinix<br/>Megaport<br/>Momentum Telecom<br/>PacketFabric |
| **Auckland** | [Vocus Group NZ Albany](https://www.2degrees.nz/business/business-services/data-centres) | 2 | New Zealand North | &check; | Devoli<br/>Kordia<br/>Megaport<br/>REANNZ<br/>Spark NZ<br/>Vocus Group NZ |
| **Bangkok** | [AIS](https://business.ais.co.th/solution/en/azure-expressroute.html) | 2 | &cross; | &check; | AIS<br/>National Telecom UIH |
| **Berlin** | [NTT GDC](https://services.global.ntt/en-us/newsroom/ntt-ltd-announces-access-to-microsoft-azure-expressroute-at-ntts-berlin-1-data-center) | 1 | Germany North | &check; | Colt<br/>Equinix<br/>NTT Global DataCenters EMEA |
| **Busan** | [LG CNS](https://www.lgcns.com/business/cloud/datacenter/) | 2 | Korea South | &cross; | LG CNS |
| **Campinas** | [Ascenty](https://www.ascenty.com/en/data-centers-en/campinas/) | 3 | Brazil South | &check; | Ascenty |
| **Canberra** | [CDC](https://cdcdatacentres.com.au/about-us/) | 1 | Australia Central | &check; | CDC<br/>Telstra Corporation |
| **Canberra2** | [CDC](https://cdcdatacentres.com.au/about-us/) | 1 | Australia Central 2 | &check; | CDC<br/>Equinix |
| **Cape Town** | [Teraco CT1](https://www.teraco.co.za/data-centre-locations/cape-town/) | 3 | South Africa West | &check; | BCX<br/>Internet Solutions - Cloud Connect<br/>Liquid Telecom<br/>MTN Global Connect<br/>Teraco<br/>Vodacom |
| **Chennai** | Tata Communications | 2 | South India | &check; | BSNL<br/>DE-CIX<br/>Global CloudXchange (GCX)<br/>Lightstorm<br/>SIFY<br/>Tata Communications<br/>VodafoneIdea |
| **Chennai2** | Airtel | 2 | South India | &check; | Airtel |
| **Chicago** | [Equinix CH1](https://www.equinix.com/locations/americas-colocation/united-states-colocation/chicago-data-centers/ch1/) | 1 | North Central US | &check; | Aryaka Networks<br/>AT&T Dynamic Exchange<br/>AT&T NetBond<br/>British Telecom<br/>CenturyLink Cloud Connect<br/>Cologix<br/>Colt<br/>Comcast<br/>Coresite<br/>Equinix<br/>InterCloud<br/>Internet2<br/>Level 3 Communications<br/>Megaport<br/>Momentum Telecom<br/>PacketFabric<br/>PCCW Global Limited<br/>Sprint<br/>Tata Communications<br/>Telia Carrier<br/>Verizon<br/>Vodafone<br/>Zayo |
| **Chicago2** | [CoreSite CH1](https://www.coresite.com/data-center/ch1-chicago-il) | 1 | North Central US | &check; | CoreSite<br/>DE-CIX<br/>Megaport<br/>Momentum Telecom |
| **Copenhagen** | [Interxion CPH1](https://www.interxion.com/Locations/copenhagen/) | 1 | &cross; | &check; | DE-CIX<br/>GlobalConnect<br/>Interxion (Digital Realty) |

#### [D-I](#tab/d-h)

| Location | Address | Zone | Local Azure regions | ER Direct | Service providers |
|--|--|--|--|--|--|
| **Dallas** | [Equinix DA3](https://www.equinix.com/locations/americas-colocation/united-states-colocation/dallas-data-centers/da3/)<br/>[Equinix DA6](https://www.equinix.com/data-centers/americas-colocation/united-states-colocation/dallas-data-centers/da6) | 1 | &cross; | &check; | Aryaka Networks<br/>AT&T Connectivity Plus<br/>AT&T Dynamic Exchange<br/>AT&T NetBond<br/>Cologix<br/>Cox Business Cloud Port<br/>Equinix<br/>Flo Networks<br/>GTT<br/>Intercloud<br/>Internet2<br/>Level 3 Communications<br/>MCM Telecom<br/>Megaport<br/>Momentum Telecom<br/>Orange<br/>PacketFabric<br/>Telmex Uninet<br/>Telia Carrier<br/>Telefonica<br/>Verizon<br/>Vodafone<br/>Zayo |
| **Dallas2** | [Digital Realty DFW10](https://www.digitalrealty.com/data-centers/americas/dallas/dfw10) | 1 | &cross; | &check; | Digital Realty<br/>Momentum Telecom |
| **Denver** | [CoreSite DE1](https://www.coresite.com/data-centers/locations/denver/de1) | 1 | West Central US | &check; | CoreSite<br/>Megaport<br/>Momentum Telecom<br/>PacketFabric<br/>Zayo |
| **Doha** | [MEEZA MV2](https://www.meeza.net/services/data-centre-services/) | 3 | Qatar Central | &check; | Ooredoo Cloud Connect<br/>Vodafone |
| **Doha2** | [Ooredoo](https://www.ooredoo.qa/) | 3 | Qatar Central | &check; | Ooredoo Cloud Connect |
| **Dubai** | [PCCS](http://www.pacificcontrols.net/cloudservices/) | 3 | UAE North | &check; | Etisalat UAE |
| **Dubai2** | [du datamena](http://datamena.com/solutions/data-centre) | 3 | UAE North | &cross; | DE-CIX<br/>du datamena<br/>Equinix<br/>GBI<br/>Lightstorm<br/>Megaport<br/>Orange<br/>Orixcom |
| **Dublin** | [Equinix DB3](https://www.equinix.com/locations/europe-colocation/ireland-colocation/dublin-data-centers/db3/) | 1 | North Europe | &check; | CenturyLink Cloud Connect<br/>Colt<br/>eir<br/>Equinix<br/>GEANT<br/>euNetworks<br/>Interxion (Digital Realty)<br/>Megaport<br/>Zayo |
| **Dublin2** | [Interxion DUB2](https://www.interxion.com/locations/europe/dublin) | 1 | North Europe | &check; | InterCloud<br/>Interxion (Digital Realty)<br/>KPN<br/><br/>Megaport<br/>NL-IX<br/>Orange |
| **Frankfurt** | [Interxion FRA11](https://www.digitalrealty.com/data-centers/emea/frankfurt) | 1 | Germany West Central | &check; | AT&T NetBond<br/>British Telecom<br/>CenturyLink Cloud Connect<br/>China Unicom Global<br/>Colt<br/>DE-CIX<br/>Equinix<br/>euNetworks<br/>GBI<br/>GEANT<br/>InterCloud<br/>Interxion (Digital Realty)<br/>Megaport<br/>NTT Global DataCenters EMEA<br/>Orange<br/>Telia Carrier<br/>T-Systems<br/>Verizon<br/>Zayo |
| **Frankfurt2** | [Equinix FR7](https://www.equinix.com/locations/europe-colocation/germany-colocation/frankfurt-data-centers/fr7/) | 1 | Germany West Central | &check; | DE-CIX<br/>Deutsche Telekom AG<br/>Equinix<br/>InterCloud<br/>Telefonica |
| **Geneva** | [Equinix GV2](https://www.equinix.com/locations/europe-colocation/switzerland-colocation/geneva-data-centers/gv2/) | 1 | Switzerland West | &check; | Colt<br/>Equinix<br/>InterCloud<br/>Megaport<br/>Swisscom |
| **Hong Kong** | [Equinix HK1](https://www.equinix.com/data-centers/asia-pacific-colocation/hong-kong-colocation/hong-kong-data-centers/hk1) | 2 | East Asia | &check; | Aryaka Networks<br/>British Telecom<br/>CenturyLink Cloud Connect<br/>Chief Telecom<br/>China Telecom Global<br/>China Unicom Global<br/>Colt<br/>Equinix<br/>InterCloud<br/>Megaport<br/>NTT Communications<br/>Orange<br/>PCCW Global Limited<br/>Tata Communications<br/>Telia Carrier<br/>Telefonica<br/>Verizon<br/>Zayo |
| **Hong Kong2** | [iAdvantage MEGA-i](https://www.iadvantage.net/index.php/locations/mega-i) | 2 | East Asia | &check; | China Mobile International<br/>China Telecom Global<br/>Deutsche Telekom AG<br/>Digital Realty<br/>Equinix<br/>iAdvantage<br/>Megaport<br/>PCCW Global Limited<br/>SingTel<br/>Vodafone |

#### [J-M](#tab/j-m)

| Location | Address | Zone | Local Azure regions | ER Direct | Service providers |
|--|--|--|--|--|--|
| **Jakarta** | [Telin](https://www.telin.net/) | 4 | &cross; | &check; | DCI Indonesia<br/>DE-CIX<br/>NTT Communications<br/>NTT Indonesia<br/>Telin<br/>XL Axiata |
| **Johannesburg** | [Teraco JB1](https://www.teraco.co.za/data-centre-locations/johannesburg/#jb1) | 3 | South Africa North | &check; | BCX<br/>British Telecom<br/>Internet Solutions - Cloud Connect<br/>Liquid Telecom<br/>MTN Business<br/>MTN Global Connect<br/>Orange<br/>Teraco<br/>Vodacom |
| **Kuala Lumpur** | [TIME dotCom Menara AIMS](https://www.time.com.my/enterprise/connectivity/direct-cloud) | 2 | &cross; | &cross; | DE-CIX<br/>TIME dotCom |
| **Las Vegas** | [Switch LV](https://www.switch.com/las-vegas) | 1 | &cross; | &check; | CenturyLink Cloud Connect<br/>Megaport<br/>PacketFabric |
| **London** | [Equinix LD5](https://www.equinix.com/locations/europe-colocation/united-kingdom-colocation/london-data-centers/ld5/) | 1 | UK South | &check; | AT&T NetBond<br/>Bezeq International<br/>British Telecom<br/>CenturyLink<br/>Colt<br/>Equinix<br/>euNetworks<br/>Intelsat<br/>InterCloud<br/>Internet Solutions - Cloud Connect<br/>Interxion (Digital Realty)<br/>Jisc<br/>Level 3 Communications<br/>Megaport<br/>Momentum Telecom<br/>MTN<br/>NTT Communications<br/>Orange<br/>PCCW Global Limited<br/>Tata Communications<br/>Telehouse - KDDI<br/>Telenor<br/>Telia Carrier<br/>Verizon<br/>Vodafone<br/>Zayo |
| **London2** | [Telehouse North Two](https://www.telehouse.net/data-centres/emea/uk-data-centres/london-data-centres/north-two) | 1 | UK South | &check; | BICS<br/>British Telecom<br/>CenturyLink Cloud Connect<br/>Colt<br/>Equinix<br/>Epsilon Global Communications<br/>GTT<br/>Interxion (Digital Realty)<br/>IX Reach<br/>JISC<br/>Megaport<br/>NTT Global DataCenters EMEA<br/>Ooredoo Cloud Connect<br/>Orange<br/>SES<br/>Sohonet<br/>Tata Communications<br/>Telehouse - KDDI<br/>Zayo<br/>Vodafone |
| **Los Angeles** | [CoreSite LA1](https://www.coresite.com/data-centers/locations/los-angeles/one-wilshire) | 1 | &cross; | &check; | AT&T Dynamic Exchange<br/>CoreSite<br/>China Unicom Global<br/>Cloudflare<br/>Flo Networks<br/>Megaport<br/>Momentum Telecom<br/>NTT<br/>Zayo</br></br>  |
| **Los Angeles2** | [Equinix LA1](https://www.equinix.com/locations/americas-colocation/united-states-colocation/los-angeles-data-centers/la1/) | 1 | &cross; | &check; | Crown Castle<br/>Equinix<br/>GTT<br/>PacketFabric |
| **Madrid** | [Interxion MAD1](https://www.interxion.com/es/donde-estamos/europa/madrid) | 1 | Spain Central | &check; | DE-CIX<br/>GTT<br/>InterCloud<br/>Interxion (Digital Realty)<br/>Megaport<br/>Telefonica |
| **Madrid2** | [Equinix MD2](https://www.equinix.com/data-centers/europe-colocation/spain-colocation/madrid-data-centers/md2) | 1 | Spain Central | &check; | Equinix<br/>GÉANT<br/>Intercloud |
| **Marseille** | [Interxion MRS1](https://www.interxion.com/Locations/marseille/) | 1 | France South | &cross; | Colt<br/>DE-CIX<br/>GEANT<br/>Interxion (Digital Realty)<br/>Jaguar Network<br/>Ooredoo Cloud Connect |
| **Melbourne** | [NextDC M1](https://www.nextdc.com/data-centres/m1-melbourne-data-centre) | 2 | Australia Southeast | &check; | AARNet<br/>Devoli<br/>Equinix<br/>Megaport<br/>NETSG<br/>NEXTDC<br/>Optus<br/>Orange<br/>Telstra Corporation<br/>TPG Telecom |
| **Miami** | [Equinix MI1](https://www.equinix.com/locations/americas-colocation/united-states-colocation/miami-data-centers/mi1/) | 1 | &cross; | &check; | AT&T Dynamic Exchange<br/>Claro<br/>C3ntro<br/>Equinix<br/>Flo Networks<br/>Megaport<br/>Momentum Telecom<br/>PitChile |
| **Milan** | [IRIDEOS](https://irideos.it/en/data-centers/) | 1 | Italy North | &check; | Colt<br/>Equinix<br/>Fastweb<br/>IRIDEOS<br/>Megaport<br/>Noovle<br/>Retelit<br/>Vodafone |
| **Milan2** | [DATA4](https://www.data4group.com/it/data-center-a-milano-italia/) | 1 | Italy North | &check; | |
| **Minneapolis** | [Cologix MIN1](https://www.cologix.com/data-centers/minneapolis/min1/) and [Cologix MIN3](https://www.cologix.com/data-centers/minneapolis/min3/) | 1 | &cross; | &check; | Cologix<br/>Megaport<br/>Zayo |
| **Montreal** | [Cologix MTL3](https://www.cologix.com/data-centers/montreal/mtl3/)<br/>[Cologix MTL7](https://cologix.com/data-centers/montreal/mtl7/) | 1 | &cross; | &check; | Bell Canada<br/>CenturyLink Cloud Connect<br/>Cologix<br/>Fibrenoire<br/>Megaport<br/>RISQ<br/>Telus<br/>Zayo |
| **Mumbai** | Tata Communications | 2 | West India | &check; | BSNL<br/>British Telecom<br/>DE-CIX<br/>Global CloudXchange (GCX)<br/>InterCloud<br/>Lightstorm<br/>Reliance Jio<br/>Sify<br/>Tata Communications<br/>Verizon |
| **Mumbai2** | Airtel | 2 | West India | &check; | Airtel<br/>Equinix<br/>Sify<br/>Orange<br/>Vodafone Idea |
| **Munich** | [EdgeConneX](https://www.edgeconnex.com/locations/europe/munich/) | 1 | &cross; | &check; | Colt<br/>DE-CIX<br/>Megaport |

#### [N-Q](#tab/n-q)

| Location | Address | Zone | Local Azure regions | ER Direct | Service providers |
|--|--|--|--|--|--|
| **New York** | [Equinix NY5](https://www.equinix.com/locations/americas-colocation/united-states-colocation/new-york-data-centers/ny5/) | 1 | &cross; | &check; | CenturyLink Cloud Connect<br/>Coresite<br/>Crown Castle<br/>DE-CIX<br/>Equinix<br/>InterCloud<br/>Lightpath<br/>Megaport<br/>Momentum Telecom<br/>NTT Communications<br/>Packet<br/>Zayo |
| **Newport(Wales)** | [Next Generation Data](https://www.nextgenerationdata.co.uk) | 1 | UK West | &check; | British Telecom<br/>Colt<br/>Jisc<br/>Level 3 Communications<br/>Next Generation Data |
| **Osaka** | [Equinix OS1](https://www.equinix.com/locations/asia-colocation/japan-colocation/osaka-data-centers/os1/) | 2 | Japan West | &check; | AT TOKYO<br/>BBIX<br/>Colt<br/>DE-CIX<br/>Equinix<br/>Internet Initiative Japan Inc. - IIJ<br/>Megaport<br/>NTT Communications<br/>NTT SmartConnect<br/>Softbank<br/>Tokai Communications |
| **Oslo** | DigiPlex Ulven | 1 | Norway East | &check; | GlobalConnect<br/>Megaport<br/>Telenor<br/>Telia Carrier |
| **Paris** | [Interxion PAR5](https://www.interxion.com/Locations/paris/) | 1 | France Central | &check; | British Telecom<br/>CenturyLink Cloud Connect<br/>Colt<br/>Equinix<br/>euNetworks<br/>Intercloud<br/>Interxion<br/>Jaguar Network<br/>Megaport<br/>Orange<br/>Telia Carrier<br/>Zayo<br/>Verizon |
| **Paris2** | [Equinix](https://www.equinix.com/data-centers/europe-colocation/france-colocation/paris-data-centers/pa4) | 1 | France Central | &check; | Equinix<br/>InterCloud<br/>Megaport<br/>Orange |
| **Perth** | [NextDC P1](https://www.nextdc.com/data-centres/p1-perth-data-centre) | 2 | &cross; | &check; | Equinix<br/>Megaport<br/>NextDC |
| **Phoenix** | [EdgeConneX PHX01](https://www.cyrusone.com/data-centers/north-america/arizona/phx1-phx8-phoenix) | 1 | West US 3 | &check; | AT&T NetBond<br/>Cox Business Cloud Port<br/>CenturyLink Cloud Connect<br/>DE-CIX<br/>Megaport<br/>Zayo |
| **Phoenix2** | [PhoenixNAP](https://phoenixnap.com/) | 1 | West US 3 | &check; | Digital Realty |
| **Portland** | [EdgeConnex POR01](https://www.edgeconnex.com/locations/north-america/portland-or/) | 1 | West US 2 | &check; |  |
| **Pune** | [STT GDC Pune DC1](https://www.sttelemediagdc.in/our-data-centres-in-india) | 2 | Central India | &check; | Airtel<br/>Lightstorm<br/>SIFY<br/>Tata Communications |
| **Quebec City** | [Vantage](https://vantage-dc.com/data_centers/quebec-city-data-center-campus/) | 1 | Canada East | &check; | Bell Canada<br/>Equinix<br/>Megaport<br/>RISQ<br/>Telus |
| **Queretaro (Mexico)** | [KIO Networks QR01](https://www.kionetworks.com/es-mx/) | 4 | Mexico Central | &check; | Cirion Technologies<br/>Equinix<br/>Flo Networks<br/>KIO<br/>MCM Telecom<br/>Megaport |
| **Quincy** | Sabey Datacenter - Building A | 1 | West US 2 | &check; |  |


#### [R-S](#tab/r-s)

| Location | Address | Zone | Local Azure regions | ER Direct | Service providers |
|--|--|--|--|--|--|
| **Rio de Janeiro** | [Equinix-RJ2](https://www.equinix.com/locations/americas-colocation/brazil-colocation/rio-de-janeiro-data-centers/rj2/) | 3 | Brazil Southeast | &check; | Cirion Technologies<br/>Equinix |
| **San Antonio** | [CyrusOne SA1](https://cyrusone.com/locations/texas/san-antonio-texas/) | 1 | South Central US | &check; | CenturyLink Cloud Connect<br/>Megaport<br/>Zayo |
| **Santiago** | [EdgeConnex SCL](https://www.edgeconnex.com/locations/south-america/santiago/) | 3 | &cross; | &check; | Cirion Technologies<br/>Equinix<br/>PitChile |
| **Sao Paulo** | [Equinix SP2](https://www.equinix.com/locations/americas-colocation/brazil-colocation/sao-paulo-data-centers/sp2/) | 3 | Brazil South | &check; | Aryaka Networks<br/>Ascenty Data Centers<br/>British Telecom<br/>Equinix<br/>InterCloud<br/>Level 3 Communications<br/>Neutrona Networks<br/>Orange<br/>RedCLARA<br/>Tata Communications<br/>Telefonica<br/>UOLDIVEO |
| **Sao Paulo2** | [TIVIT TSM](https://www.tivit.com/en/tivit/) | 3 | Brazil South | &check; | Ascenty Data Centers<br/>Tivit |
| **Seattle** | [Equinix SE2](https://www.equinix.com/locations/americas-colocation/united-states-colocation/seattle-data-centers/se2/) | 1 | West US 2 | &check; | Aryaka Networks<br/>CenturyLink Cloud Connect<br/>DE-CIX<br/>Digital Realty<br/>Equinix<br/>Level 3 Communications<br/>Megaport<br/>Pacific Northwest Gigapop<br/>PacketFabric<br/>Telus<br/>Zayo |
| **Seoul** | [KINX Gasan IDC](https://www.kinx.net/?lang=en) | 2 | Korea Central | &check; | Digital Realty<br/>KINX<br/>KT<br/>LG CNS<br/>LGUplus<br/>Equinix<br/>Sejong Telecom<br/>SK Telecom |
| **Seoul2** | [KT IDC](https://www.kt-idc.com/eng/introduce/sub1_4_10.jsp#tab) | 2 | Korea Central | &cross; | KT |
| **Silicon Valley** | [Equinix SV1](https://www.equinix.com/locations/americas-colocation/united-states-colocation/silicon-valley-data-centers/sv1/) | 1 | West US | &check; | Aryaka Networks<br/>AT&T Dynamic Exchange<br/>AT&T NetBond<br/>British Telecom<br/>CenturyLink Cloud Connect<br/>China Unicom Global<br/>Colt<br/>Comcast<br/>Coresite<br/>Cox Business Cloud Port<br/>Digital Realty<br/>Equinix<br/>InterCloud<br/>Internet2<br/>IX Reach<br/>Level 3 Communications<br/>Megaport<br/>Momentum Telecom<br/>Orange<br/>Packet<br/>Sprint<br/>Tata Communications<br/>Telia Carrier<br/>Verizon<br/>Vodafone<br/>Zayo |
| **Silicon Valley2** | [Coresite SV7](https://www.coresite.com/data-centers/locations/silicon-valley/sv7) | 1 | West US | &check; | Colt<br/>Coresite<br/>Momentum Telecom |
| **Singapore** | [Equinix SG1](https://www.equinix.com/data-centers/asia-pacific-colocation/singapore-colocation/singapore-data-center/sg1) | 2 | Southeast Asia | &check; | Aryaka Networks<br/>AT&T NetBond<br/>British Telecom<br/>China Mobile International<br/>China Telecom Global<br/>Epsilon Global Communications<br/>Equinix<br/>GTT<br/>IPC<br/>InterCloud<br/>Level 3 Communications<br/>Megaport<br/>NTT Communications<br/>Orange<br/>PCCW Global Limited<br/>SingTel<br/>Tata Communications<br/>Telstra Corporation<br/>Telefonica<br/>Verizon<br/>Vodafone |
| **Singapore2** | [Global Switch Tai Seng](https://www.globalswitch.com/locations/singapore-data-centres/) | 2 | Southeast Asia | &check; | CenturyLink Cloud Connect<br/>China Mobile International<br/>China Unicom Global<br/>Colt<br/>DE-CIX<br/>Digital Realty<br/>Epsilon Global Communications<br/>Equinix<br/>Lightstorm<br/>Megaport<br/>PCCW Global Limited<br/>SingTel<br/>Telehouse - KDDI |
| **Stavanger** | [Green Mountain DC1](https://greenmountain.no/dc1-stavanger/) | 1 | Norway West | &check; | GlobalConnect<br/>Megaport<br/>Telenor |
| **Stockholm** | [Equinix SK1](https://www.equinix.com/locations/europe-colocation/sweden-colocation/stockholm-data-centers/sk1/) | 1 | Sweden Central | &check; | Cinia<br/>Equinix<br/>GlobalConnect<br/>Interxion (Digital Realty)<br/>Megaport<br/>Telia Carrier |
| **Sydney** | [Equinix SY2](https://www.equinix.com/locations/asia-colocation/australia-colocation/sydney-data-centers/sy2/) | 2 | Australia East | &check; | AARNet<br/>AT&T NetBond<br/>British Telecom<br/>Cello<br/>Devoli<br/>Equinix<br/>GTT<br/>Kordia<br/>Megaport<br/>NEXTDC<br/>NTT Communications<br/>Optus<br/>Orange<br/>Spark NZ<br/>Telstra Corporation<br/>TPG Telecom<br/>Verizon<br/>Vocus Group NZ |
| **Sydney2** | [NextDC S1](https://www.nextdc.com/data-centres/s1-sydney-data-centre) | 2 | Australia East | &check; | AARNet<br/>Megaport<br/>NETSG<br/>NextDC |

#### [T-Z](#tab/t-z)

| Location | Address | Zone | Local Azure regions | ER Direct | Service providers |
|--|--|--|--|--|--|
| **Taipei** | Chief Telecom | 2 | Taiwan North | &check; | Chief Telecom<br/>Chunghwa Telecom<br/>FarEasTone |
| **Taipei2** | Chunghwa Telecom | 2 | Taiwan North | &check; | |
| **Tel Aviv** | Bezeq International | 2 | Israel Central | &check; | Bezeq International<br/>Cellcom Fixed Line Communication (l.p.) |
| **Tel Aviv2** | SDS | 2 | Israel Central | &check; | Hot Telecom |
| **Tokyo** | [Equinix TY4](https://www.equinix.com/locations/asia-colocation/japan-colocation/tokyo-data-centers/ty4/) | 2 | Japan East | &check; | Aryaka Networks<br/>AT&T NetBond<br/>BBIX<br/>British Telecom<br/>CenturyLink Cloud Connect<br/>Colt<br/>Equinix<br/>Intercloud<br/>Internet Initiative Japan Inc. - IIJ<br/>Megaport<br/>NTT Communications<br/>NTT EAST<br/>Orange<br/>Softbank<br/>Telehouse - KDDI<br/>Verizon </br></br> |
| **Tokyo2** | [AT TOKYO](https://www.attokyo.com/) | 2 | Japan East | &check; | AT TOKYO<br/>BBIX<br/>China Telecom Global<br/>China Unicom Global<br/>Colt<br/>DE-CIX<br/>Digital Realty<br/>Equinix<br/>IPC<br/>IX Reach<br/>Megaport<br/>PCCW Global Limited<br/>Tokai Communications |
| **Tokyo3** | [NEC](https://www.nec.com/en/global/solutions/cloud/inzai_datacenter.html) | 2 | Japan East | &check; | NEC<br/>SCSK |
| **Toronto** | [Cologix TOR1](https://www.cologix.com/data-centers/toronto/tor1/) | 1 | Canada Central | &check; | AT&T NetBond<br/>Bell Canada<br/>CenturyLink Cloud Connect<br/>Cologix<br/>Equinix<br/>IX Reach<br/>Megaport<br/>Orange<br/>Telus<br/>Verizon<br/>Zayo |
| **Toronto2** | [Allied REIT](https://www.alliedreit.com/property/905-king-st-w/) | 1 | Canada Central | &check; | Fibrenoire<br/>Megaport<br/>Zayo |
| **Vancouver** | [Cologix VAN1](https://www.cologix.com/data-centers/vancouver/van1/) | 1 | &cross; | &check; | Bell Canada<br/>Cologix<br/>Megaport<br/>Telus<br/>Zayo |
| **Vienna** | [Digital Realty VIE1](https://www.digitalrealty.com/data-centers/emea/vienna/vie1) | 1 | &cross; | &check; | Digital Realty |
| **Vienna2** | [NTT Data VIE1](https://services.global.ntt/en-us/services-and-products/global-data-centers/global-locations/emea/vienna-1-data-center) | 1 | &cross; | &check; |  |
| **Warsaw** | [Equinix WA1](https://www.equinix.com/data-centers/europe-colocation/poland-colocation/warsaw-data-centers/wa1) | 1 | Poland Central | &check; | Equinix<br/>Exatel<br/>Orange Poland<br/>T-mobile Poland |
| **Washington DC** | [Equinix DC2](https://www.equinix.com/locations/americas-colocation/united-states-colocation/washington-dc-data-centers/dc2/)<br/>[Equinix DC6](https://www.equinix.com/data-centers/americas-colocation/united-states-colocation/washington-dc-data-centers/dc6) | 1 | East US<br/>East US 2 | &check; | Aryaka Networks<br/>AT&T NetBond<br/>British Telecom<br/>CenturyLink Cloud Connect<br/>Cologix<br/>Colt<br/>Comcast<br/>Coresite<br/>Cox Business Cloud Port<br/>Crown Castle<br/>Digital Realty<br/>Equinix<br/>Flo Networks<br/>IPC<br/>Internet2<br/>InterCloud<br/>IPC<br/>Iron Mountain<br/>IX Reach<br/>Level 3 Communications<br/>Lightpath<br/>Megaport<br/>Momentum Telecom<br/>NTT Communications<br/>Orange<br/>PacketFabric<br/>SES<br/>Sprint<br/>Tata Communications<br/>Telia Carrier<br/>Telefonica<br/>Verizon<br/>Zayo |
| **Washington DC2** | [Coresite VA2](https://www.coresite.com/data-center/va2-reston-va) | 1 | East US<br/>East US 2 | &cross; | CenturyLink Cloud Connect<br/>Coresite<br/>Intelsat<br/>Megaport<br/>Momentum Telecom<br/>Viasat<br/>Zayo |
| **Zurich** | [Interxion ZUR2](https://www.interxion.com/Locations/zurich/) | 1 | Switzerland North | &check; | Colt<br/>Equinix<br/>Intercloud<br/>Interxion (Digital Realty)<br/>Megaport<br/>Swisscom<br/>Zayo |
| **Zurich2** | [Equinix ZH5](https://www.equinix.com/data-centers/europe-colocation/switzerland-colocation/zurich-data-centers/zh5) | 1 | Switzerland North | &check; | Equinix |

---

### National cloud environments

Azure national clouds are isolated from each other and from global commercial Azure. ExpressRoute for one Azure cloud can't connect to the Azure regions in the others.

### US Government cloud

| Location | Address | Local Azure regions | ER Direct | Service providers |
|--|--|--|--|--|
| **Atlanta** | [Equinix AT1](https://www.equinix.com/locations/americas-colocation/united-states-colocation/atlanta-data-centers/at1/) | &cross; | &check; | Equinix |
| **Chicago** | [Equinix CH1](https://www.equinix.com/locations/americas-colocation/united-states-colocation/chicago-data-centers/ch1/) | &cross; | &check; | AT&T NetBond<br/>British Telecom<br/>Equinix<br/>Level 3 Communications<br/>Verizon |
| **Dallas** | [Equinix DA3](https://www.equinix.com/locations/americas-colocation/united-states-colocation/dallas-data-centers/da3/) | &cross; | &check; | Equinix<br/>Internet2<br/>Megaport<br/>Verizon |
| **New York** | [Equinix NY5](https://www.equinix.com/locations/americas-colocation/united-states-colocation/new-york-data-centers/ny5/) | &cross; | &check; | Equinix<br/>CenturyLink Cloud Connect<br/>Verizon |
| **Phoenix** | [CyrusOne Chandler](https://www.cyrusone.com/data-centers/north-america/arizona/phx1-phx8-phoenix) | US Gov Arizona | &check; | AT&T NetBond<br/>CenturyLink Cloud Connect<br/>Megaport |
| **San Antonio** | [CyrusOne SA2](https://cyrusone.com/locations/texas/san-antonio-texas-ii/) | US Gov Texas | &check; | CenturyLink Cloud Connect<br/>Megaport |
| **Silicon Valley** | [Equinix SV4](https://www.equinix.com/locations/americas-colocation/united-states-colocation/silicon-valley-data-centers/sv4/) | &cross; | &check; | AT&T<br/>Equinix<br/>Level 3 Communications<br/>Verizon |
| **Seattle** | [Equinix SE2](https://www.equinix.com/locations/americas-colocation/united-states-colocation/seattle-data-centers/se2/) | &cross; | &check; | Equinix<br/>Megaport |
| **Washington DC** | [Equinix DC2](https://www.equinix.com/locations/americas-colocation/united-states-colocation/washington-dc-data-centers/dc2/) | US DoD East<br/>US Gov Virginia | &check; | AT&T NetBond<br/>CenturyLink Cloud Connect<br/>Equinix<br/>Level 3 Communications<br/>Megaport<br/>Verizon |

### China

| Location | Address | Local Azure regions | ER Direct | Service providers |
|--|--|--|--|--|
| **Beijing** | China Telecom | &cross; | &check; | China Telecom |
| **Beijing2** | GDS | &cross; | &check; | China Telecom<br/>China Mobile<br/>China Unicom<br/>GDS |
| **Shanghai** | China Telecom | &cross; | &check; | China Telecom |
| **Shanghai2** | GDS | &cross; | &check; | China Mobile<br/>China Telecom<br/>China Unicom<br/>GDS |

To learn more, see [ExpressRoute in China](https://www.azure.cn/home/features/expressroute/).

## <a name="c1partners"></a>Connectivity through Exchange providers

If your connectivity provider isn't listed in previous sections, you can still create a connection.

* Check with your connectivity provider to see if they're connected to any of the exchanges in the table. You can check the following links to gather more information about services offered by exchange providers. Several connectivity providers are already connected to Ethernet exchanges.
  * [Cologix](https://www.cologix.com/)
  * [CoreSite](https://www.coresite.com/)
  * [DE-CIX](https://www.de-cix.net/en/services/microsoft-azure-peering-service)
  * [Equinix Cloud Exchange](https://www.equinix.com/resources/videos/cloud-exchange-overview)
  * [InterXion](https://www.interxion.com/)
  * [NextDC](https://www.nextdc.com/)
  * [Megaport](https://www.megaport.com/services/microsoft-expressroute/)
  * [Momentum Telecom](https://gomomentum.com/)
  * [PacketFabric](https://www.packetfabric.com/cloud-connectivity/microsoft-azure)
  * [Teraco](https://www.teraco.co.za/platform-teraco/africa-cloud-exchange/)
  
* Have your connectivity provider extend your network to the peering location of choice.
  * Ensure that your connectivity provider extends your connectivity in a highly available manner so that there are no single points of failure.
* Order an ExpressRoute circuit with the exchange as your connectivity provider to connect to Microsoft.
  * Follow steps in [Create an ExpressRoute circuit](expressroute-howto-circuit-classic.md) to set up connectivity.

## Connectivity through satellite operators
If you're remote and don't have fiber connectivity or want to explore other connectivity options, you can check the following satellite operators. 

* Intelsat
* [SES](https://www.ses.com/networks/signature-solutions/signature-cloud/ses-and-azure-expressroute)
* [Viasat](https://news.viasat.com/newsroom/press-releases/viasat-introduces-direct-cloud-connect-a-new-service-providing-fast-secure-private-connections-to-business-critical-cloud-services)

## Connectivity through additional service providers

#### [A-K](#tab/a-k)

| Location | Exchange | Connectivity providers |
|--|--|--|
| **Amsterdam** | Equinix<br/>Interxion<br/>Level 3 Communications | BICS<br/>CloudXpress<br/>Eurofiber<br/>Fastweb S.p.A<br/>Gulf Bridge International<br/>Kalaam Telecom Bahrain B.S.C<br/>MainOne<br/>Nianet<br/>POST Telecom Luxembourg<br/>Proximus<br/>RETN<br/>TDC Erhverv<br/>Telecom Italia Sparkle<br/>Telekom Deutschland GmbH<br/>Telia |
| **Atlanta** | Equinix | Crown Castle<br/>Momentum Telecom |
| **Cape Town** | Teraco | MTN |
| **Chennai** | Tata Communications | Tata Teleservices |
| **Chicago** | Equinix | Crown Castle<br/>Spectrum Enterprise<br/>Windstream |
| **Dallas** | Equinix<br/>Megaport | Axtel<br/>C3ntro Telecom<br/>Cox Business<br/>Crown Castle<br/>Data Foundry<br/>Momentum Telecom<br/>Spectrum Enterprise<br/>Transtelco |
| **Frankfurt** | Interxion | BICS<br/>Cinia<br/>Equinix<br/>Nianet<br/>QSC AG<br/>Telekom Deutschland GmbH |
| **Hamburg** | Equinix | Cinia |
| **Hong Kong** | Equinix | Chief<br/>Macroview Telecom |
| **Johannesburg** | Teraco | MTN |

#### [L-Q](#tab/l-q)

| Location | Exchange | Connectivity providers |
|--|--|--|
| **London** | BICS<br/>Equinix<br/>euNetworks | Bezeq International Ltd.<br/>CoreAzure<br/>Epsilon Telecommunications Limited<br/>Exponential E<br/>HSO<br/>NexGen Networks<br/>Proximus<br/>Tamares Telecom<br/>Zain |
| **Los Angeles** | Equinix | Crown Castle<br/>Momentum Telecom<br/>Spectrum Enterprise<br/>Transtelco |
| **Madrid** | Level3 | Zertia |
| **Miami** | Equinix<br/>Megaport | Momentum Telecom<br/>Zertia |
| **Montreal** | Cologix | Airgate Technologies<br/>Inc. Aptum Technologies<br/>Oncore Cloud Services Inc.<br/>Rogers<br/>Zirro |
| **Mumbai** | Tata Communications | Tata Teleservices |
| **New York** | Equinix<br/>Megaport | Altice Business<br/>Crown Castle<br/>Spectrum Enterprise<br/>Webair |
| **Paris** | Equinix | Proximus |
| **Quebec City** | Megaport | Fibrenoire |

#### [S-Z](#tab/s-z)

| Location | Exchange | Connectivity providers |
|--|--|--|
| **Sao Paulo** | Equinix | Venha Pra Nuvem |
| **Seattle** | Equinix | Alaska Communications<br/>Momentum Telecom |
| **Silicon Valley** | Coresite<br/>Equinix<br/>Megaport | Cox Business<br/>Momentum Telecom<br/>Spectrum Enterprise<br/>Windstream<br/>X2nsat Inc. |
| **Singapore** | Equinix | 1CLOUDSTAR<br/>BICS<br/>CMC Telecom<br/>Epsilon Telecommunications Limited<br/>LGA Telecom<br/>United Information Highway (UIH) |
| **Slough** | Equinix | HSO |
| **Sydney** | Megaport | Macquarie Telecom Group |
| **Tokyo** | Equinix | ARTERIA Networks Corporation<br/>BroadBand Tower<br/>Inc. |
| **Toronto** | Equinix<br/>Megaport | Airgate Technologies Inc.<br/>Beanfield Metroconnect<br/>Aptum Technologies<br/>IVedha Inc<br/>Oncore Cloud Services Inc.<br/>Rogers<br/>Thinktel<br/>Zirro |
| **Washington DC** | Equinix | Altice Business<br/>BICS<br/>Cox Business<br/>Crown Castle<br/>Gtt Communications Inc<br/>Epsilon Telecommunications Limited<br/>Masergy<br/>Momentum Telecom<br/>Windstream |

---

## ExpressRoute system integrators
Enabling private connectivity to fit your needs can be challenging, based on the scale of your network. You can work with any of the system integrators listed in the following table to assist you with onboarding to ExpressRoute.

| Continent | System integrators |
|--|--|
| **Asia** | Avanade Inc.<br/>OneAs1a |
| **Australia** | Ensyst<br/>IT Consultancy<br/>MOQdigital<br/>Vigilant.IT |
| **Europe** | Avanade Inc.<br/>Altogee<br/>Bright Skies GmbH<br/>Inframon<br/>MSG Services<br/>New Signature<br/>Nelite<br/>Orange Networks<br/>sol-tec |
| **North America** | Avanade Inc.<br/>Equinix Professional Services<br/>FlexManage<br/>Lightstream<br/>Perficient<br/>Presidio |
| **South America** | Avanade Inc.<br/>Venha Pra Nuvem |

## Next steps
* For more information about ExpressRoute, see the [ExpressRoute FAQ](expressroute-faqs.md).
* Ensure that all prerequisites are met. For more information, see [ExpressRoute prerequisites & checklist](expressroute-prerequisites.md).

<!--Image References-->
[0]: ./media/expressroute-locations/expressroute-locations-map.png "Location map"


