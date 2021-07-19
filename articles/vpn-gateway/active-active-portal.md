---
title: 'Configure active-active S2S VPN connections'
titleSuffix: Azure VPN Gateway
description: Learn how to configure active-active connections with VPN gateways using the Azure portal.
services: vpn-gateway
author: jstrom

ms.service: vpn-gateway
ms.topic: how-to
ms.date: 07/16/2020
ms.author: jstrom

# Configure active-active S2S VPN connections for Azure VPN gateways
---

# Tutorial: Create and manage a VPN gateway using Azure portal

This article helps you create highly available active-active cross-premises and VNet-to-VNet connections using the Resource Manager deployment model and Azure portal. You can also configure an active-active gateway using PowerShell.

## About highly available cross-premises connections

To achieve high availability for cross-premises and VNet-to-VNet connectivity, you should deploy multiple VPN gateways and establish multiple parallel connections between your networks and Azure. See [Highly Available cross-premises and VNet-to-VNet connectivity](vpn-gateway-highlyavailable.md) for an overview of connectivity options and topology.

If you already have a VPN gateway, you can [Update an existing VPN gateway from active-standby to active-active, or vice versa](#active).

> [!IMPORTANT]
> The active-active mode is available for all SKUs except Basic.
>

## Prerequisites

An Azure account with an active subscription. If you don't have one, [create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

## <a name="vnet"></a>Create a virtual network

Create a VNet using the following values:

* **Resource group:** TestRG1
* **Name:** VNet1
* **Region:** (US) East US
* **IPv4 address space:** 10.1.0.0/16
* **Subnet name:** FrontEnd
* **Subnet address space:** 10.1.0.0/24

[!INCLUDE [Create a virtual network](../../includes/vpn-gateway-basic-vnet-rm-portal-include.md)]

## <a name="gateway"></a>Create a VPN gateway

In this step, you create the virtual network gateway (VPN gateway) for your VNet. Creating a gateway can often take 45 minutes or more, depending on the selected gateway SKU.

Create a virtual network gateway using the following values:

* **Name:** VNet1GW
* **Region:** East US
* **Gateway type:** VPN
* **VPN type:** Route-based
* **SKU:** VpnGw1
* **Generation:** Generation1
* **Virtual network:** VNet1
* **Gateway subnet address range:** 10.1.255.0/27
* **Public IP address:** Create new
* **Public IP address name:** VNet1GWpip

[!INCLUDE [Create a vpn gateway](../../includes/vpn-gateway-add-gw-portal-include.md)]
[!INCLUDE [Configure PIP settings](../../includes/vpn-gateway-add-gw-pip-active-portal-include.md)]

A gateway can take up to 45 minutes to fully create and deploy. You can see the deployment status on the Overview page for your gateway. After the gateway is created, you can view the IP address that has been assigned to it by looking at the virtual network in the portal. The gateway appears as a connected device.

[!INCLUDE [NSG warning](../../includes/vpn-gateway-no-nsg-include.md)]

## <a name ="active"></a> Change an active-standby gateway to active-active

1. Click the top left menu icon and select *All services*
1. Search for *Virtual Network Gateways*
   :::image type="content" source="./media/active-active-portal/allservices-virtualnetworkgateway.png" alt-text="All Services - Virtual Network Gateways" lightbox="./media/active-active-portal/allservices-virtualnetworkgateway.png":::
1. Select the virtual network gateway that you want to make Active/Active.
1. Click Configuration on the left menu
   :::image type="content" source="./media/active-active-portal/virtualnetworkgateway-configuration.png" alt-text="Virtual Network Gateway - Configuration Menu" lightbox="./media/active-active-portal/virtualnetworkgateway-configuration.png":::
1. Change Active/active mode to *Enabled* and click on the Second Public IP address option.
   :::image type="content" source="./media/active-active-portal/virtualnetworkgateway-configuration-activeactive.png" alt-text="Enable Active/Active mode" lightbox="./media/active-active-portal/virtualnetworkgateway-configuration-activeactive.png":::
1. Specify an existing or define a new public IP address to use for the second VPN Gateway instance.
   :::image type="content" source="./media/active-active-portal/virtualnetworkgateway-configuration-secondpublicip-save.png" alt-text="Select a secondary Public IP page." lightbox="./media/active-active-portal/virtualnetworkgateway-configuration-secondpublicip-save.png":::
1. Click *Save*
   :::image type="content" source="./media/active-active-portal/virtualnetworkgateway-configuration-save.png" alt-text="Save configuration page." lightbox="./media/active-active-portal/virtualnetworkgateway-configuration-save.png":::

>[!NOTE]
>This update can take up to 30 to 45 minutes.

## Next steps

Once you have a VPN gateway, you can configure connections. The articles below will help you create a few of the most common configurations:

> [!div class="nextstepaction"]
> [Site-to-Site VPN connections](./tutorial-site-to-site-portal.md)

> [!div class="nextstepaction"]
> [Point-to-Site VPN connections](vpn-gateway-howto-point-to-site-resource-manager-portal.md)