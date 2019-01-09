---
title: 'Azure Virtual WAN partners locations | Microsoft Docs'
description: This article contains a list of Azure Virtual WAN partners and hub locations
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: conceptual
ms.date: 09/21/2018
ms.author: cherylmc
Customer intent: As someone with a networking background, I want to connect find a Virtual WAN partner
---
# Virtual WAN partners and virtual hub locations

This article provides information on Virtual WAN supported regions and preferred partners for connectivity into Virtual Hub.

Azure Virtual WAN is a networking service that provides optimized and automated branch-to-branch connectivity through Azure. Virtual WAN lets you connect and configure branch devices to communicate with Azure. This can be done either manually, or by using preferred provider devices through a Virtual WAN preferred partner. Using preferred partner devices allows you ease of use, simplification of connectivity, and configuration management. Connectivity from the on-premises device is established in an automated way to the Virtual Hub. A virtual hub is a Microsoft-managed virtual network. The hub contains various service endpoints to enable connectivity from your on-premises network (vpnsite). You can only have one hub per region.

## Regions

The list of regions supported and available are as follows:

|Geopolitical region | Azure regions|
|---|---|
|North America | East US, West US, East US 2, West US 2, Central US, South Central US, North Central US, West Central US, Canada Central, Canada East |
|South America |Brazil South |
| Europe | France Central, France South, North Europe, West Europe, UK West, UK South |
| Asia | East Asia, Southeast Asia |
| Japan  | Japan West, Japan East |
| Australia | Australia Southeast, Australia East | 
| Australia Government | Australia Central, Australia Central 2 |
| India | India West, India Central, India South |
| South Korea | Korea Central, Korea South | 

## Automation from connectivity partners

This section describes the high-level details of automation from the connectivity providers.

Devices that connect to Azure Virtual WAN have built-in automation to connect. This is typically set up in the device-management UI (or equivalent), which sets up the connectivity and configuration management between the VPN branch device to an Azure Virtual Hub VPN endpoint (VPN gateway).

The following high-level automation is set up in the device console/management center:

* Appropriate permissions for the device to access Azure Virtual WAN Resource Group
* Uploading of Branch Device into Azure Virtual WAN
* Automatic download of Azure connectivity information 
* Configuration of on-premises branch device 

Some connectivity partners may extend the automation to include creating the Azure Virtual Hub VNet and VPN Gateway. If you want to know more about automation, see [Configure Automation – WAN Partners](virtual-wan-configure-automation-providers.md).

## Connectivity through preferred partners

If your branch device partner is not listed in the section below, please contact your branch device provider and have them contact us by sending an email to azurevirtualwan@microsoft.com.

You can check the following links to gather more information about services offered by the preferred partners. 

|Preferred Partners|
|---|
|[Barracuda Networks](https://www.barracuda.com/AzurevWAN)|
| [Check Point](https://www.checkpoint.com/solutions/microsoft-azure-virtual-wan/) |
| [Citrix](https://www.citrix.com/global-partners/microsoft/sd-wan-for-azure-virtual-wan.html)|
|[Netfoundry](https://netfoundry.io/solutions/netfoundry-for-microsoft-azure-virtual-wan/)|
|[Palo Alto Networks](https://researchcenter.paloaltonetworks.com/2018/09/azure-vwan-integration/) |
|[Riverbed Technology](https://www.riverbed.com/go/steelconnect-azurewan.html)|
|[128 Technology](https://www.128technology.com/partners/azure) |

## Next steps

For more information about Virtual WAN, see the [Virtual WAN FAQ](virtual-wan-faq.md).

For more information about how to automate connectivity to Azure Virtual WAN, see [Virtual WAN Partners - How to automate](virtual-wan-configure-automation-providers.md).
