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
| **Location**  | **Service Providers** |
|---------------|-----------------------|
| **Amsterdam** | Aryaka Networks, AT&T NetBond, British Telecom, Colt, Equinix, euNetworks, GÉANT+, InterCloud, Internet Solutions - Cloud Connect, Interxion, Level 3 Communications, Orange, Tata Communications, TeleCity Group, Telenor, Verizon |
| **Atlanta** | Equinix |
| **Chennai** | Tata Communications |
| **Chicago** | AT&T NetBond, Comcast, Equinix, Level 3 Communications, Zayo Group |
| **Dallas** | AT&T NetBond, Equinix, Level 3 Communications, Megaport |
| **Dublin** | Colt |
| **Hong Kong** | British Telecom, China Telecom Global, Equinix, Megaport, Orange, PCCW Global Limited, Tata Communications, Verizon |
| **London** | AT&T NetBond, British Telecom, Colt, Equinix, InterCloud, Internet Solutions - Cloud Connect, Interxion, Jisc+, Level 3 Communications, MTN, NTT Communications, Orange, Tata Communications, Telecity Group, Telenor, Verizon, Vodafone |
| **Las Vegas** | Level 3 Communications+, Megaport+
| **Los Angeles** | CoreSite, Equinix, Megaport, Zayo Group |
| **Melbourne** | Equinix, Megaport, NEXTDC, Telstra Corporation |
| **New York** | Equinix, Megaport, Zayo Group |
| **Montreal** | Cologix+ |
| **Mumbai** | Tata Communications |
| **Osaka** | Equinix, Internet Initiative Japan Inc. - IIJ, NTT Communications, Softbank |
| **Paris** | Interxion |
| **Sao Paulo** | Equinix, Telefonica+ |
| **Seattle** | Equinix, Level 3 Communications, Megaport |
| **Silicon Valley** | Aryaka Networks, AT&T NetBond, British Telecom, CenturyLink+, Comcast, Equinix, Level 3 Communications, Orange, Tata Communications, Verizon, Zayo Group |
| **Singapore** | Aryaka Networks, AT&T NetBond, British Telecom, Equinix, InterCloud, Megaport, Orange, SingTel, Tata Communications, Verizon |
| **Sydney** | AT&T NetBond, British Telecom, Equinix, Megaport, NEXTDC, Telstra Corporation, Verizon |
| **Tokyo** | Aryaka Networks, British Telecom, Colt, Equinix, Internet Initiative Japan Inc. - IIJ, NTT Communications, Softbank, Verizon |
| **Toronto** | Cologix, Equinix, Zayo Group |
| **Washington DC** | Aryaka Networks, AT&T NetBond, British Telecom, Comcast, Equinix, InterCloud, Level 3 Communications, Megaport, Orange, Tata Communications, Verizon, Zayo Group |

 **+** denotes coming soon

### National cloud environments

#### US Government cloud

| **Location**  |**Service Providers** |
|---------------|--------------------|
| **Chicago** | AT&T NetBond, Equinix, Level 3 Communications, Verizon |
| **Dallas** |  Equinix+, Verizon+ |
| **New York** | Equinix, Level 3 Communications+, Verizon |
| **Washington DC** | AT&T NetBond, Equinix, Level 3 Communications, Verizon |

#### China

| **Location**  | **Service Providers** |
|---------------|-----------------------|
| **Beijing** | China Telecom |
| **Shanghai** |  China Telecom |
To learn more, see [ExpressRoute in China](http://www.windowsazure.cn/home/features/expressroute/)

#### Germany

| **Location**  | **Service Providers** |
|---------------|-----------------------|
| **Berlin** | Colt+, e-shelter+ |
| **Frankfurt** | Colt, Equinix+, Interxion |

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

|**Location**|**Exchange**|**Connectivity Providers**|
|-------------|------------|-------------------------|
| **Seattle** | Equinix | Alaska Communications |
| **Silicon Valley** | Equinix | XO Communications |
| **Singapore** | Equinix | 1CLOUDSTAR |

## ExpressRoute system integrators

Enabling private connectivity to fit your needs can be challenging, based on the scale of your network. You can work with any of the system integrators listed in the following table to assist you with onboarding to ExpressRoute.

|**Continent**|**System integrators**|
|-------------|---------------------|
| **Asia** | Avanade Inc., OneAs1a|
| **Europe** | Avanade Inc., Dotnet Solutions|
| **US** | Avanade Inc., Equinix Professional Services, Perficient, Project Leadership|

## Next steps

- For more information about ExpressRoute, see the [ExpressRoute FAQ](expressroute-faqs.md).
- Ensure that all prerequisites are met. See [ExpressRoute prerequisites](expressroute-prerequisites.md).

<!--Image References-->
[0]: ./media/expressroute-locations/expressroute-locations-map.png "Location map"
