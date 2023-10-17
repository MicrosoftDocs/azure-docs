---
title: 'Tutorial – Create & manage a VPN gateway – Azure portal'
titleSuffix: Azure VPN Gateway
description: In this tutorial, learn how to create and manage an Azure VPN gateway using the Azure portal.
author: cherylmc
ms.author: cherylmc
ms.service: vpn-gateway
ms.topic: tutorial
ms.date: 10/05/2023

---

# Tutorial: Create and manage a VPN gateway using the Azure portal

This tutorial helps you create and manage a virtual network gateway (VPN gateway) using the Azure portal. The VPN gateway is just one part of a connection architecture to help you securely access resources within a VNet.

:::image type="content" source="./media/tutorial-create-gateway-portal/gateway-diagram.png" alt-text="Diagram of VNet and VPN gateway." lightbox="./media/tutorial-create-gateway-portal/gateway-diagram-expand.png":::

* The left side of the diagram shows the virtual network and the VPN gateway that you create using the steps in this article.
* You can later add different types of connections, as shown on the right side of the diagram. For example, you can create [Site-to-Site](tutorial-site-to-site-portal.md) and [Point-to-site](point-to-site-about.md) connections. See [VPN Gateway design](design.md) to view different design architectures that you can build.

If you want to learn more about the configuration settings used in this tutorial, see [About VPN Gateway configuration settings](vpn-gateway-about-vpn-gateway-settings.md). For more information about VPN Gateway, see [What is VPN Gateway?](vpn-gateway-about-vpngateways.md)

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network
> * Create a VPN gateway
> * View the gateway public IP address
> * Resize a VPN gateway (resize SKU)
> * Reset a VPN gateway

## Prerequisites

An Azure account with an active subscription. If you don't have one, [create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

## <a name="CreatVNet"></a>Create a virtual network

Create a VNet using the following values:

* **Resource group:** TestRG1
* **Name:** VNet1
* **Region:** (US) East US
* **IPv4 address space:** 10.1.0.0/16
* **Subnet name:** FrontEnd
* **Subnet address space:** 10.1.0.0/24

[!INCLUDE [Create a virtual network](../../includes/vpn-gateway-basic-vnet-rm-portal-include.md)]

## <a name="VNetGateway"></a>Create a VPN gateway

In this step, you create the virtual network gateway (VPN gateway) for your VNet. Creating a gateway can often take 45 minutes or more, depending on the selected gateway SKU.

Create a virtual network gateway using the following values:

* **Name:** VNet1GW
* **Region:** East US
* **Gateway type:** VPN
* **SKU:** VpnGw2
* **Generation:** Generation 2
* **Virtual network:** VNet1
* **Gateway subnet address range:** 10.1.255.0/27
* **Public IP address:** Create new
* **Public IP address name:** VNet1GWpip

For this exercise, we won't be selecting a zone redundant SKU. If you want to learn about zone-redundant SKUs, see [About zone-redundant VNet gateways](about-zone-redundant-vnet-gateways.md).

[!INCLUDE [Create a vpn gateway](../../includes/vpn-gateway-add-gw-portal-include.md)]
[!INCLUDE [Configure PIP settings](../../includes/vpn-gateway-add-gw-pip-portal-include.md)]

A gateway can take 45 minutes or more to fully create and deploy. You can see the deployment status on the **Overview** page for your gateway. After the gateway is created, you can view the IP address that has been assigned to it by looking at the virtual network in the portal. The gateway appears as a connected device.

[!INCLUDE [NSG warning](../../includes/vpn-gateway-no-nsg-include.md)]

## <a name="view"></a>View the public IP address

You can view the gateway public IP address on the **Overview** page for your gateway. The public IP address is used when you configure a site-to-site connection to your VPN gateway.

:::image type="content" source="./media/tutorial-create-gateway-portal/address.png" alt-text="Screenshot of Overview page used to view the Public IP address field." lightbox="./media/tutorial-create-gateway-portal/address.png":::

To see additional information about the public IP address object, select the name/IP address link next to **Public IP address**.

## <a name="resize"></a>Resize a gateway SKU

There are specific rules regarding resizing vs. changing a gateway SKU. In this section, we'll resize the SKU. For more information, see [Gateway settings - resizing and changing SKUs](vpn-gateway-about-vpn-gateway-settings.md#resizechange).

[!INCLUDE [resize a gateway](../../includes/vpn-gateway-resize-gw-portal-include.md)]

## <a name="reset"></a>Reset a gateway

[!INCLUDE [reset a gateway](../../includes/vpn-gateway-reset-gw-portal-include.md)]

## Clean up resources

If you're not going to continue to use this application or go to the next tutorial, delete
these resources using the following steps:

1. Enter the name of your resource group in the **Search** box at the top of the portal and select it from the search results.

1. Select **Delete resource group**.

1. Enter your resource group for **TYPE THE RESOURCE GROUP NAME** and select **Delete**.

## Next steps

Once you've created a VPN gateway, you can configure additional gateway settings and connections. The following articles help you create a few of the most common configurations:

> [!div class="nextstepaction"]
> [Site-to-Site VPN connections](./tutorial-site-to-site-portal.md)

> [!div class="nextstepaction"]
> [Point-to-Site VPN connections](vpn-gateway-howto-point-to-site-resource-manager-portal.md)
