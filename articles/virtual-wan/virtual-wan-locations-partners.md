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

This article provides information on Virtual WAN supported regions and partners for connectivity into the Virtual WAN Hub.

There are two types of offerings that make connecting to Azure easier for customers:

* **Network Virtual Appliances (NVAs) deployed  in the Virtual WAN Hub**: Customers can deploy Network Virtual Appliances directly into the Virtual WAN hub. This solution  is jointly managed by Microsoft Azure and third-party Network Virtual Appliance solution providers. To learn more about NVAs deployed in the Virtual WAN Hub reference [About NVA in the Virtual WAN Hub](about-nva-hub.md).
* **Branch IPsec connectivity automation**: Customers can automatically configure and connect their branch devices to the Azure Virtual WAN Site-to-site VPN Gateway using IPsec tunnels. These configurations are typically set up in the device-management UI (or equivalent).

## Partners with integrated Virtual Hub offerings

Some partners offer Network Virtual Appliances (NVAs) that can be deployed directly into the Azure Virtual WAN hub through a solution that is jointly managed by Microsoft Azure and third-party Network Virtual Appliance solution providers.

When a Network Virtual Appliance is deployed into the Virtual WAN hub, it can serve as a third-party gateway with various functionalities. It could serve as an SD-WAN gateway, Firewall or a combination of both. For more information about the benefits of deploying a NVA into the Virtual WAN hub, reference this [About NVA in the Virtual WAN Hub](about-nva-hub.md).


[!INCLUDE [NVA PARTNERS](../../includes/virtual-wan-nva-hub-partners.md)]


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

## <a name="locations"></a>Locations

[!INCLUDE [Virtual WAN regions file](../../includes/virtual-wan-regions-include.md)]

## Next steps

* For more information about Virtual WAN, see the [Virtual WAN FAQ](virtual-wan-faq.md).

* For more information about how to automate connectivity to Azure Virtual WAN, see [Automation guidelines for Virtual WAN partners](virtual-wan-configure-automation-providers.md).
