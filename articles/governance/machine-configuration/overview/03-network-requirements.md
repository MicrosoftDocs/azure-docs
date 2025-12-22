---
description: Configure network connectivity, endpoints, and private link settings for Azure Machine Configuration across Azure and hybrid environments.
ms.date: 11/07/2025
ms.topic: how-to
title: Azure Machine Configuration network requirements
ms.custom: references_regions
---

# Azure Machine Configuration network requirements

## Network requirements

Azure virtual machines can use either their local virtual network adapter (vNIC) or Azure Private
Link to communicate with the machine configuration service.

Azure Arc-enabled machines connect using the on-premises network infrastructure to reach Azure
services and report compliance status.

The following table shows the supported endpoints for Azure and Azure Arc-enabled machines:

| **Region** | **Geography** | **URL** | **Storage endpoint**|
|---| ---| ---| ---|
| **EastAsia**  | Asia Pacific | agentserviceapi.guestconfiguration.azure.com</br>eastasia-gas.guestconfiguration.azure.com</br> ea-gas.guestconfiguration.azure.com | oaasguestconfigeas1.blob.core.windows.net</br> oaasguestconfigseas1.blob.core.windows.net </br> oaasguestconfigwcuss1.blob.core.windows.net |
| **SoutheastAsia** | Asia Pacific | agentserviceapi.guestconfiguration.azure.com</br>southeastasia-gas.guestconfiguration.azure.com</br> sea-gas.guestconfiguration.azure.com | oaasguestconfigeas1.blob.core.windows.net</br> oaasguestconfigseas1.blob.core.windows.net </br> oaasguestconfigwcuss1.blob.core.windows.net |
| **AustraliaEast** | Australia | agentserviceapi.guestconfiguration.azure.com</br>australiaeast-gas.guestconfiguration.azure.com</br> ae-gas.guestconfiguration.azure.com | oaasguestconfigases1.blob.core.windows.net</br> oaasguestconfigaes1.blob.core.windows.net </br> oaasguestconfigwcuss1.blob.core.windows.net |
| **AustraliaSoutheast** | Australia | agentserviceapi.guestconfiguration.azure.com</br>australiaeast-gas.guestconfiguration.azure.com</br> ae-gas.guestconfiguration.azure.com | oaasguestconfigases1.blob.core.windows.net</br> oaasguestconfigaes1.blob.core.windows.net </br> oaasguestconfigwcuss1.blob.core.windows.net |
|**BrazilSouth**| Brazil | agentserviceapi.guestconfiguration.azure.com</br>brazilsouth-gas.guestconfiguration.azure.com</br> brs-gas.guestconfiguration.azure.com | oaasguestconfigbrss1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**CanadaCentral**| Canada | agentserviceapi.guestconfiguration.azure.com</br>canadacentral-gas.guestconfiguration.azure.com</br> cc-gas.guestconfiguration.azure.com | oaasguestconfigccs1.blob.core.windows.net</br> oaasguestconfigces1.blob.core.windows.net </br> oaasguestconfigwcuss1.blob.core.windows.net |
|**CanadaEast**| Canada | agentserviceapi.guestconfiguration.azure.com</br>canadaeast-gas.guestconfiguration.azure.com</br> ce-gas.guestconfiguration.azure.com | oaasguestconfigccs1.blob.core.windows.net</br> oaasguestconfigces1.blob.core.windows.net </br> oaasguestconfigwcuss1.blob.core.windows.net |
|**ChinaEast2**| China | agentserviceapi.guestconfiguration.azure.cn</br>chinaeast2-gas.guestconfiguration.azure.cn</br> chne2-gas.guestconfiguration.azure.cn | oaasguestconfigchne2s2.blob.core.chinacloudapi.cn |
|**ChinaNorth**| China | agentserviceapi.guestconfiguration.azure.cn</br>chinanorth-gas.guestconfiguration.azure.cn</br> chnn-gas.guestconfiguration.azure.cn | oaasguestconfigchnns2.blob.core.chinacloudapi.cn |
|**ChinaNorth2**| China | agentserviceapi.guestconfiguration.azure.cn</br>chinanorth2-gas.guestconfiguration.azure.cn</br> chnn2-gas.guestconfiguration.azure.cn | oaasguestconfigchnn2s2.blob.core.chinacloudapi.cn |
|**ChinaNorth3**| China | agentserviceapi.guestconfiguration.azure.cn</br>chinanorth3-gas.guestconfiguration.azure.cn</br> chnn3-gas.guestconfiguration.azure.cn | oaasguestconfigchnn3s1.blob.core.chinacloudapi.cn |
|**NorthEurope**| Europe | agentserviceapi.guestconfiguration.azure.com</br>northeurope-gas.guestconfiguration.azure.com</br> ne-gas.guestconfiguration.azure.com | oaasguestconfignes1.blob.core.windows.net</br> oaasguestconfigwes1.blob.core.windows.net </br> oaasguestconfigwcuss1.blob.core.windows.net |
|**WestEurope**| Europe | agentserviceapi.guestconfiguration.azure.com</br>westeurope-gas.guestconfiguration.azure.com</br> we-gas.guestconfiguration.azure.com | oaasguestconfignes1.blob.core.windows.net</br> oaasguestconfigwes1.blob.core.windows.net </br> oaasguestconfigwcuss1.blob.core.windows.net |
|**FranceCentral**| France | agentserviceapi.guestconfiguration.azure.com</br>francecentral-gas.guestconfiguration.azure.com</br> fc-gas.guestconfiguration.azure.com | oaasguestconfigfcs1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**GermanyNorth** | Germany | agentserviceapi.guestconfiguration.azure.com</br>germanynorth-gas.guestconfiguration.azure.com</br> gen-gas.guestconfiguration.azure.com | oaasguestconfiggens1.blob.core.windows.net</br> oaasguestconfiggewcs1.blob.core.windows.net </br> oaasguestconfigwcuss1.blob.core.windows.net |
|**GermanyWestCentral** | Germany | agentserviceapi.guestconfiguration.azure.com</br>germanywestcentral-gas.guestconfiguration.azure.com</br> gewc-gas.guestconfiguration.azure.com | oaasguestconfiggens1.blob.core.windows.net</br> oaasguestconfiggewcs1.blob.core.windows.net </br> oaasguestconfigwcuss1.blob.core.windows.net |
|**CentralIndia**| India | agentserviceapi.guestconfiguration.azure.com</br>centralindia-gas.guestconfiguration.azure.com</br> cid-gas.guestconfiguration.azure.com | oaasguestconfigcids1.blob.core.windows.net</br> oaasguestconfigsids1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**SouthIndia**| India | agentserviceapi.guestconfiguration.azure.com</br>southindia-gas.guestconfiguration.azure.com</br> sid-gas.guestconfiguration.azure.com | oaasguestconfigcids1.blob.core.windows.net</br> oaasguestconfigsids1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**IsraelCentral**| Israel | agentserviceapi.guestconfiguration.azure.com</br>israelcentral-gas.guestconfiguration.azure.com</br> ilc-gas.guestconfiguration.azure.com | oaasguestconfigilcs1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**ItalyNorth**| Italy | agentserviceapi.guestconfiguration.azure.com</br>italynorth-gas.guestconfiguration.azure.com</br> itn-gas.guestconfiguration.azure.com | oaasguestconfigitns1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**JapanEast**| Japan | agentserviceapi.guestconfiguration.azure.com</br>japaneast-gas.guestconfiguration.azure.com</br> jpe-gas.guestconfiguration.azure.com | oaasguestconfigjpws1.blob.core.windows.net</br> oaasguestconfigjpes1.blob.core.windows.net </br> oaasguestconfigwcuss1.blob.core.windows.net |
|**JapanWest**| Japan | agentserviceapi.guestconfiguration.azure.com</br>japanwest-gas.guestconfiguration.azure.com</br> jpw-gas.guestconfiguration.azure.com | oaasguestconfigjpws1.blob.core.windows.net</br> oaasguestconfigjpes1.blob.core.windows.net </br> oaasguestconfigwcuss1.blob.core.windows.net |
|**KoreaCentral**| Korea | agentserviceapi.guestconfiguration.azure.com</br>koreacentral-gas.guestconfiguration.azure.com</br> kc-gas.guestconfiguration.azure.com | oaasguestconfigkcs1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**MexicoCentral**| Mexico | agentserviceapi.guestconfiguration.azure.com</br>mexicocentral-gas.guestconfiguration.azure.com</br> mxc-gas.guestconfiguration.azure.com | oaasguestconfigmxcs1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**NorwayEast**| Norway | agentserviceapi.guestconfiguration.azure.com</br>norwayeast-gas.guestconfiguration.azure.com</br> noe-gas.guestconfiguration.azure.com | oaasguestconfignoes2.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**PolandCentral**| Poland | agentserviceapi.guestconfiguration.azure.com</br>polandcentral-gas.guestconfiguration.azure.com</br> plc-gas.guestconfiguration.azure.com | oaasguestconfigwcuss1.blob.core.windows.net |
|**QatarCentral**| Qatar | agentserviceapi.guestconfiguration.azure.com</br>qatarcentral-gas.guestconfiguration.azure.com</br> qac-gas.guestconfiguration.azure.com | oaasguestconfigqacs1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**SouthAfricaNorth** | SouthAfrica | agentserviceapi.guestconfiguration.azure.com</br>southafricanorth-gas.guestconfiguration.azure.com</br> san-gas.guestconfiguration.azure.com | oaasguestconfigsans1.blob.core.windows.net</br> oaasguestconfigsaws1.blob.core.windows.net </br> oaasguestconfigwcuss1.blob.core.windows.net |
|**SouthAfricaWest** | SouthAfrica | agentserviceapi.guestconfiguration.azure.com</br>southafricawest-gas.guestconfiguration.azure.com</br> saw-gas.guestconfiguration.azure.com | oaasguestconfigsans1.blob.core.windows.net</br> oaasguestconfigsaws1.blob.core.windows.net </br> oaasguestconfigwcuss1.blob.core.windows.net |
|**SpainCentral**| Spain | agentserviceapi.guestconfiguration.azure.com</br>spaincentral-gas.guestconfiguration.azure.com</br> spc-gas.guestconfiguration.azure.com | oaasguestconfigspcs1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**SwedenCentral**| Sweden | agentserviceapi.guestconfiguration.azure.com</br>swedencentral-gas.guestconfiguration.azure.com</br> swc-gas.guestconfiguration.azure.com | oaasguestconfigswcs1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**SwitzerlandNorth**| Switzerland | agentserviceapi.guestconfiguration.azure.com</br>switzerlandnorth-gas.guestconfiguration.azure.com</br> stzn-gas.guestconfiguration.azure.com | oaasguestconfigstzns1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**SwitzerlandWest**| Switzerland | agentserviceapi.guestconfiguration.azure.com</br>switzerlandwest-gas.guestconfiguration.azure.com</br> stzw-gas.guestconfiguration.azure.com | oaasguestconfigstzns1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**TaiwanNorth**| Taiwan | agentserviceapi.guestconfiguration.azure.com</br>taiwannorth-gas.guestconfiguration.azure.com</br> twn-gas.guestconfiguration.azure.com | oaasguestconfigtwns1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**UAENorth**| United Arab Emirates| agentserviceapi.guestconfiguration.azure.com</br>uaenorth-gas.guestconfiguration.azure.com</br> uaen-gas.guestconfiguration.azure.com | oaasguestconfiguaens1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**UKSouth**| United Kingdom | agentserviceapi.guestconfiguration.azure.com</br>uksouth-gas.guestconfiguration.azure.com</br> uks-gas.guestconfiguration.azure.com | oaasguestconfigukss1.blob.core.windows.net</br> oaasguestconfigukws1.blob.core.windows.net </br> oaasguestconfigwcuss1.blob.core.windows.net |
|**UKWest**| United Kingdom | agentserviceapi.guestconfiguration.azure.com</br>ukwest-gas.guestconfiguration.azure.com</br> ukw-gas.guestconfiguration.azure.com | oaasguestconfigukss1.blob.core.windows.net</br> oaasguestconfigukws1.blob.core.windows.net </br> oaasguestconfigwcuss1.blob.core.windows.net |
|**EastUS**| US | agentserviceapi.guestconfiguration.azure.com</br>eastus-gas.guestconfiguration.azure.com</br> eus-gas.guestconfiguration.azure.com | oaasguestconfigeuss1.blob.core.windows.net</br> oaasguestconfigeus2s1.blob.core.windows.net</br> oaasguestconfigwuss1.blob.core.windows.net</br> oaasguestconfigwus2s1.blob.core.windows.net</br> oaasguestconfigncuss1.blob.core.windows.net</br> oaasguestconfigcuss1.blob.core.windows.net</br> oaasguestconfigscuss1.blob.core.windows.net</br> oaasguestconfigwus3s1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**EastUS2**| US | agentserviceapi.guestconfiguration.azure.com</br>eastus2-gas.guestconfiguration.azure.com</br> eus2-gas.guestconfiguration.azure.com | oaasguestconfigeuss1.blob.core.windows.net</br> oaasguestconfigeus2s1.blob.core.windows.net</br> oaasguestconfigwuss1.blob.core.windows.net</br> oaasguestconfigwus2s1.blob.core.windows.net</br> oaasguestconfigncuss1.blob.core.windows.net</br> oaasguestconfigcuss1.blob.core.windows.net</br> oaasguestconfigscuss1.blob.core.windows.net</br> oaasguestconfigwus3s1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**WestUS**| US | agentserviceapi.guestconfiguration.azure.com</br>westus-gas.guestconfiguration.azure.com</br> wus-gas.guestconfiguration.azure.com | oaasguestconfigeuss1.blob.core.windows.net</br> oaasguestconfigeus2s1.blob.core.windows.net</br> oaasguestconfigwuss1.blob.core.windows.net</br> oaasguestconfigwus2s1.blob.core.windows.net</br> oaasguestconfigncuss1.blob.core.windows.net</br> oaasguestconfigcuss1.blob.core.windows.net</br> oaasguestconfigscuss1.blob.core.windows.net</br> oaasguestconfigwus3s1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**WestUS2**| US | agentserviceapi.guestconfiguration.azure.com</br>westus2-gas.guestconfiguration.azure.com</br> wus2-gas.guestconfiguration.azure.com | oaasguestconfigeuss1.blob.core.windows.net</br> oaasguestconfigeus2s1.blob.core.windows.net</br> oaasguestconfigwuss1.blob.core.windows.net</br> oaasguestconfigwus2s1.blob.core.windows.net</br> oaasguestconfigncuss1.blob.core.windows.net</br> oaasguestconfigcuss1.blob.core.windows.net</br> oaasguestconfigscuss1.blob.core.windows.net</br> oaasguestconfigwus3s1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**WestUS3**| US | agentserviceapi.guestconfiguration.azure.com</br>westus3-gas.guestconfiguration.azure.com</br> wus3-gas.guestconfiguration.azure.com | oaasguestconfigeuss1.blob.core.windows.net</br> oaasguestconfigeus2s1.blob.core.windows.net</br> oaasguestconfigwuss1.blob.core.windows.net</br> oaasguestconfigwus2s1.blob.core.windows.net</br> oaasguestconfigncuss1.blob.core.windows.net</br> oaasguestconfigcuss1.blob.core.windows.net</br> oaasguestconfigscuss1.blob.core.windows.net</br> oaasguestconfigwus3s1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**CentralUS**| US | agentserviceapi.guestconfiguration.azure.com</br>centralus-gas.guestconfiguration.azure.com</br> cus-gas.guestconfiguration.azure.com | oaasguestconfigeuss1.blob.core.windows.net</br> oaasguestconfigeus2s1.blob.core.windows.net</br> oaasguestconfigwuss1.blob.core.windows.net</br> oaasguestconfigwus2s1.blob.core.windows.net</br> oaasguestconfigncuss1.blob.core.windows.net</br> oaasguestconfigcuss1.blob.core.windows.net</br> oaasguestconfigscuss1.blob.core.windows.net</br> oaasguestconfigwus3s1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**NorthCentralUS**| US | agentserviceapi.guestconfiguration.azure.com</br>northcentralus-gas.guestconfiguration.azure.com</br> ncus-gas.guestconfiguration.azure.com | oaasguestconfigeuss1.blob.core.windows.net</br> oaasguestconfigeus2s1.blob.core.windows.net</br> oaasguestconfigwuss1.blob.core.windows.net</br> oaasguestconfigwus2s1.blob.core.windows.net</br> oaasguestconfigncuss1.blob.core.windows.net</br> oaasguestconfigcuss1.blob.core.windows.net</br> oaasguestconfigscuss1.blob.core.windows.net</br> oaasguestconfigwus3s1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**SouthCentralUS**| US | agentserviceapi.guestconfiguration.azure.com</br>southcentralus-gas.guestconfiguration.azure.com</br> scus-gas.guestconfiguration.azure.com | oaasguestconfigeuss1.blob.core.windows.net</br> oaasguestconfigeus2s1.blob.core.windows.net</br> oaasguestconfigwuss1.blob.core.windows.net</br> oaasguestconfigwus2s1.blob.core.windows.net</br> oaasguestconfigncuss1.blob.core.windows.net</br> oaasguestconfigcuss1.blob.core.windows.net</br> oaasguestconfigscuss1.blob.core.windows.net</br> oaasguestconfigwus3s1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**WestCentralUS**| US | agentserviceapi.guestconfiguration.azure.com</br>westcentralus-gas.guestconfiguration.azure.com</br> wcus-gas.guestconfiguration.azure.com | oaasguestconfigeuss1.blob.core.windows.net</br> oaasguestconfigeus2s1.blob.core.windows.net</br> oaasguestconfigwuss1.blob.core.windows.net</br> oaasguestconfigwus2s1.blob.core.windows.net</br> oaasguestconfigncuss1.blob.core.windows.net</br> oaasguestconfigcuss1.blob.core.windows.net</br> oaasguestconfigscuss1.blob.core.windows.net</br> oaasguestconfigwus3s1.blob.core.windows.net</br> oaasguestconfigwcuss1.blob.core.windows.net |
|**USGovArizona** | US Gov | agentserviceapi.guestconfiguration.azure.us</br>usgovarizona-gas.guestconfiguration.azure.us</br> usga-gas.guestconfiguration.azure.us | oaasguestconfigusgas1.blob.core.usgovcloudapi.net |
|**USGovTexas** | US Gov | agentserviceapi.guestconfiguration.azure.us</br>usgovtexas-gas.guestconfiguration.azure.us</br> usgt-gas.guestconfiguration.azure.us | oaasguestconfigusgts1.blob.core.usgovcloudapi.net |
|**USGovVirginia** | US Gov | agentserviceapi.guestconfiguration.azure.us</br>usgovvirginia-gas.guestconfiguration.azure.us</br> usgv-gas.guestconfiguration.azure.us | oaasguestconfigusgvs1.blob.core.usgovcloudapi.net |



### Communicate over virtual networks in Azure

To communicate with the machine configuration resource provider in Azure, machines require outbound
access to Azure datacenters on port `443`*. If a network in Azure doesn't allow outbound traffic,
configure exceptions with [Network Security Group][18] rules. The [service tags][19]
`AzureArcInfrastructure` and `Storage` can be used to reference the guest configuration and Storage
services rather than manually maintaining the [list of IP ranges][20] for Azure datacenters. Both
tags are required because Azure Storage hosts the machine configuration content packages.

### Communicate over Private Link in Azure

Virtual machines can use [private link][21] for communication to the machine configuration service.
Apply tag with the name `EnablePrivateNetworkGC` and value `TRUE` to enable this feature. The tag
can be applied before or after machine configuration policy definitions are applied to the machine.

> [!IMPORTANT]
> To communicate over private link for custom packages, the link to the location of the
> package must be added to the list of allowed URLs.

Traffic is routed using the Azure [virtual public IP address][22] to establish a secure,
authenticated channel with Azure platform resources.

### Communicate over public endpoints outside of Azure

Servers located on-premises or in other clouds can be managed with machine configuration
by connecting them to [Azure Arc][01].

For Azure Arc-enabled servers, allow traffic using the following patterns:

- Port: Only TCP 443 required for outbound internet access
- Global URL: `*.guestconfiguration.azure.com`

See the [Azure Arc-enabled servers network requirements][23] for a full list of all network
endpoints required by the Azure Connected Machine Agent for core Azure Arc and machine
configuration scenarios.

### Communicate over Private Link outside of Azure

When you use [private link with Arc-enabled servers][24], built-in policy packages are
automatically downloaded over the private link. You don't need to set any tags on the Arc-enabled
server to enable this feature.

## Next steps

Now that you understand the network requirements, continue to the next article to learn about operations and troubleshooting:

[Troubleshooting Machine Configuration][25]


<!-- Link reference definitions -->
[01]: /azure/azure-arc/servers/overview
[18]: /azure/virtual-network/manage-network-security-group#create-a-security-rule
[19]: /azure/virtual-network/service-tags-overview
[20]: https://www.microsoft.com/download/details.aspx?id=56519
[21]: /azure/private-link/private-link-overview
[22]: /azure/virtual-network/what-is-ip-address-168-63-129-16
[23]: /azure/azure-arc/servers/network-requirements
[24]: /azure/azure-arc/servers/private-link-security
[25]: ./04-operations-troubleshooting.md
