---
title: 'Azure Virtual WAN partners and locations | Microsoft Docs'
description: This article contains a list of Azure Virtual WAN partners.
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: conceptual
ms.date: 04/27/2021
ms.author: cherylmc
ms.custom: references_regions
# Customer intent: As someone with a networking background, I want to find a Virtual WAN partner
---
# Virtual WAN partners and virtual hub locations

This article provides information on Virtual WAN supported regions and partners for connectivity into Virtual Hub.

Azure Virtual WAN is a networking service that provides optimized and automated branch-to-branch connectivity through Azure. Virtual WAN lets you connect and configure branch devices to communicate with Azure. Connection and configuration can be done either manually, or by using provider devices through a Virtual WAN partner. Using partner devices allows you ease of use, simplification of connectivity, and configuration management.

Connectivity from the on-premises device is established in an automated way to the Virtual Hub. A virtual hub is a Microsoft-managed virtual network. The hub contains various service endpoints to enable connectivity from your on-premises network (vpnsite). 

## <a name="automation"></a>Branch IPsec connectivity automation from partners

Devices that connect to Azure Virtual WAN have built-in automation to connect. This is typically set up in the device-management UI (or equivalent), which sets up the connectivity and configuration management between the VPN branch device to an Azure Virtual Hub VPN endpoint (VPN gateway).

The following high-level automation is set up in the device console/management center:

* Appropriate permissions for the device to access Azure Virtual WAN Resource Group
* Uploading of Branch Device into Azure Virtual WAN
* Automatic download of Azure connectivity information
* Configuration of on-premises branch device 

Some connectivity partners may extend the automation to include creating the Azure Virtual Hub VNet and VPN Gateway. If you want to know more about automation, see [Automation guidelines for Virtual WAN partners](virtual-wan-configure-automation-providers.md).

## <a name="partners"></a>Branch IPsec Connectivity partners

[!INCLUDE [partners](../../includes/virtual-wan-partners-include.md)]

The following partners are slated on our roadmap based on a terms sheet signed between the companies indicating the scope of work to automate IPsec connectivity between the partner device and Azure Virtual WAN VPN Gateways: 128 Technologies, Arista, F5 Networks, Oracle SD-WAN (Talari), and SharpLink.

## Next steps

* For more information about Virtual WAN, see the [Virtual WAN FAQ](virtual-wan-faq.md).

* For more information about how to automate connectivity to Azure Virtual WAN, see [Automation guidelines for Virtual WAN partners](virtual-wan-configure-automation-providers.md).
