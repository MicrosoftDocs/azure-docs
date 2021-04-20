---
title: 'Tutorial - Create and manage a VPN Gateway: Azure portal'
description: Follow this tutorial to learn how to create, deploy, and manage an Azure VPN Gateway using the portal
author: cherylmc
ms.author: cherylmc
ms.service: vpn-gateway
ms.topic: tutorial
ms.date: 12/01/2020

#Customer intent: I want to create a VPN gateway for my virtual network so that I can connect to my VNet and communicate with resources remotely.
---

# Tutorial: Create and manage a VPN gateway using Azure portal

Azure VPN gateways provide cross-premises connectivity between customer premises and Azure. This tutorial covers basic Azure VPN gateway deployment items such as creating and managing a VPN gateway. You can also create a gateway using [Azure CLI](create-routebased-vpn-gateway-cli.md) or [Azure PowerShell](create-routebased-vpn-gateway-powershell.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network
> * Create a VPN gateway
> * View the gateway public IP address
> * Resize a VPN gateway (resize SKU)
> * Reset a VPN gateway

The following diagram shows the virtual network and the VPN gateway created as part of this tutorial.

:::image type="content" source="./media/tutorial-create-gateway-portal/gateway-diagram.png" alt-text="VNet and VPN gateway diagram":::

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

In this step, you create the virtual network gateway for your VNet. Creating a gateway can often take 45 minutes or more, depending on the selected gateway SKU.

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
* **Enable active-active mode:** Disabled
* **Configure BGP:** Disabled

[!INCLUDE [Create a vpn gateway](../../includes/vpn-gateway-add-gw-rm-portal-include.md)]

[!INCLUDE [NSG warning](../../includes/vpn-gateway-no-nsg-include.md)]

## <a name="view"></a>View the public IP address

You can view the gateway public IP address on the **Overview** page for your gateway.

:::image type="content" source="./media/tutorial-create-gateway-portal/address.png" alt-text="Overview page":::

To see additional information about the public IP address object, click the name/IP address link next to **Public IP address**.

## <a name="resize"></a>Resize a gateway SKU

There are specific rules regarding resizing vs. changing a gateway SKU. In this section, we will resize the SKU. For more information, see [Gateway settings - resizing and changing SKUs](vpn-gateway-about-vpn-gateway-settings.md#resizechange).

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

Once you have a VPN gateway, you can configure connections. The articles below will help you create a few of the most common configurations:

> [!div class="nextstepaction"]
> [Site-to-Site VPN connections](./tutorial-site-to-site-portal.md)

> [!div class="nextstepaction"]
> [Point-to-Site VPN connections](vpn-gateway-howto-point-to-site-resource-manager-portal.md)