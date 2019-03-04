---
title: 'Azure Virtual WAN partners locations | Microsoft Docs'
description: This article contains a list of Azure Virtual WAN partners and hub locations
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: conceptual
ms.date: 03/04/2019
ms.author: cherylmc
Customer intent: As someone with a networking background, I want to connect find a Virtual WAN partner
---
# Virtual WAN partners and virtual hub locations

This article provides information on Virtual WAN supported regions and preferred partners for connectivity into Virtual Hub.

Azure Virtual WAN is a networking service that provides optimized and automated branch-to-branch connectivity through Azure. Virtual WAN lets you connect and configure branch devices to communicate with Azure. This can be done either manually, or by using preferred provider devices through a Virtual WAN preferred partner. Using preferred partner devices allows you ease of use, simplification of connectivity, and configuration management.

Connectivity from the on-premises device is established in an automated way to the Virtual Hub. A virtual hub is a Microsoft-managed virtual network. The hub contains various service endpoints to enable connectivity from your on-premises network (vpnsite). You can only have one hub per region.

## Automation from connectivity partners

Devices that connect to Azure Virtual WAN have built-in automation to connect. This is typically set up in the device-management UI (or equivalent), which sets up the connectivity and configuration management between the VPN branch device to an Azure Virtual Hub VPN endpoint (VPN gateway).

The following high-level automation is set up in the device console/management center:

* Appropriate permissions for the device to access Azure Virtual WAN Resource Group
* Uploading of Branch Device into Azure Virtual WAN
* Automatic download of Azure connectivity information 
* Configuration of on-premises branch device 

Some connectivity partners may extend the automation to include creating the Azure Virtual Hub VNet and VPN Gateway. If you want to know more about automation, see [Configure Automation – WAN Partners](virtual-wan-configure-automation-providers.md).

## Connectivity through preferred partners

You can check the following links to gather more information about services offered by the preferred partners. If your branch device partner is not listed in this section, contact your branch device provider and have them contact us by sending an email to azurevirtualwan@microsoft.com.

[!INCLUDE [partners](../../includes/virtual-wan-partners-include.md)]

## Regions

The list of regions supported and available are as follows:

[!INCLUDE [regions](../../includes/virtual-wan-regions-include.md)]

## Next steps

For more information about Virtual WAN, see the [Virtual WAN FAQ](virtual-wan-faq.md).

For more information about how to automate connectivity to Azure Virtual WAN, see [Virtual WAN Partners - How to automate](virtual-wan-configure-automation-providers.md).
