---
title: 'Tutorial – Create & manage a VPN gateway – Azure portal'
titleSuffix: Azure VPN Gateway
description: In this tutorial, learn how to create and manage an Azure VPN gateway by using the Azure portal.
author: cherylmc
ms.author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: tutorial
ms.date: 08/01/2024

---

# Tutorial: Create and manage a VPN gateway using the Azure portal

This tutorial helps you create and manage a virtual network gateway (VPN gateway) using the Azure portal. The VPN gateway is one part of the connection architecture that helps you securely access resources within a virtual network using VPN Gateway.

:::image type="content" source="./media/tutorial-create-gateway-portal/gateway-diagram.png" alt-text="Diagram that shows a virtual network and a VPN gateway." lightbox="./media/tutorial-create-gateway-portal/gateway-diagram-expand.png":::

* The left side of the diagram shows the virtual network and the VPN gateway that you create by using the steps in this article.
* You can later add different types of connections, as shown on the right side of the diagram. For example, you can create [site-to-site](tutorial-site-to-site-portal.md) and [point-to-site](point-to-site-about.md) connections. To view different design architectures that you can build, see [VPN gateway design](design.md).

If you want to learn more about the configuration settings used in this tutorial, see [About VPN Gateway configuration settings](vpn-gateway-about-vpn-gateway-settings.md). For more information about Azure VPN Gateway, see [What is Azure VPN Gateway](vpn-gateway-about-vpngateways.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network.
> * Create a VPN gateway.
> * View the gateway public IP address.
> * Resize a VPN gateway (resize SKU).
> * Reset a VPN gateway.

[!INCLUDE [Availability zones](../../includes/vpn-gateway-az-regions-support-include.md)]

## Prerequisites

You need an Azure account with an active subscription. If you don't have one, [create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

## <a name="CreatVNet"></a>Create a virtual network

Create a virtual network using the following example values:

* **Resource group:** TestRG1
* **Name:** VNet1
* **Region:** (US) East US (or region of your choosing)
* **IPv4 address space:** 10.1.0.0/16
* **Subnet name:** FrontEnd
* **Subnet address space:** 10.1.0.0/24

[!INCLUDE [Create a VNet](../../includes/vpn-gateway-basic-vnet-rm-portal-include.md)]

After you create your virtual network, you can optionally configure Azure DDoS Protection. Protection is simple to enable on any new or existing virtual network, and it requires no application or resource changes. For more information about Azure DDoS Protection, see [What is Azure DDoS Protection](../ddos-protection/ddos-protection-overview.md).

## Create a gateway subnet

The virtual network gateway requires a specific subnet named **GatewaySubnet**. The gateway subnet is part of the IP address range for your virtual network and contains the IP addresses that the virtual network gateway resources and services use. Specify a gateway subnet that's /27 or larger.

[!INCLUDE [Create gateway subnet](../../includes/vpn-gateway-create-gateway-subnet-portal-include.md)]

[!INCLUDE [NSG warning](../../includes/vpn-gateway-no-nsg-include.md)]

## <a name="VNetGateway"></a>Create a VPN gateway

In this section, you create the virtual network gateway (VPN gateway) for your virtual network. Creating a gateway can often take 45 minutes or more, depending on the selected gateway SKU.

Create a gateway using the following values:

* **Name**: VNet1GW
* **Gateway type**: VPN
* **SKU**: VpnGw2AZ
* **Generation**: Generation 2
* **Virtual network**: VNet1
* **Gateway subnet address range**: 10.1.255.0/27
* **Public IP address**: Create new
* **Public IP address name:** VNet1GWpip1
* **Public IP address SKU:** Standard
* **Assignment:** Static
* **Second Public IP address name:** VNet1GWpip2

[!INCLUDE [Create a vpn gateway](../../includes/vpn-gateway-add-azgw-portal-include.md)]
[!INCLUDE [Configure PIP settings](../../includes/vpn-gateway-add-azgw-pip-portal-include.md)]

A gateway can take 45 minutes or more to fully create and deploy. You can see the deployment status on the **Overview** page for your gateway. After the gateway is created, you can view the IP address assigned to it by looking at the virtual network in the portal. The gateway appears as a connected device.

## <a name="view"></a>View public IP address

To view public IP addresses associated to your virtual network gateway, navigate to your gateway in the portal.

1. On the portal page for your virtual network gateway, under **Settings**, open the **Properties** page.
1. To view more information about the IP address object, click the associated IP address link.

## <a name="resize"></a>Resize a gateway SKU

There are specific rules for resizing versus changing a gateway SKU. In this section, you resize the SKU. For more information, see [Resize or change gateway SKUs](about-gateway-skus.md#resizechange).

The basic steps are:

1. Go to the **Configuration** page for your virtual network gateway.
1. On the right side of the page, select the dropdown arrow to show a list of available SKUs. Notice that the list only populates SKUs that you're able to use to resize your current SKU. If you don't see the SKU you want to use, instead of resizing, you have to change to a new SKU.
1. Select the SKU from the dropdown list and save your changes.

## <a name="reset"></a>Reset a gateway

Gateway resets behave differently, depending on your gateway configuration. For more information, see [Reset a VPN gateway or a connection](reset-gateway.md).

The basic steps are:

[!INCLUDE [reset a gateway](../../includes/vpn-gateway-reset-gw-portal-include.md)]

## Clean up resources

If you're not going to continue to use this application or go to the next tutorial, delete
these resources.

1. Enter the name of your resource group in the **Search** box at the top of the portal and select it from the search results.
1. Select **Delete resource group**.
1. Enter your resource group for **TYPE THE RESOURCE GROUP NAME** and select **Delete**.

## Next steps

After you create a VPN gateway, you can configure more gateway settings and connections. The following articles help you create a few of the most common configurations:

> [!div class="nextstepaction"]
> [Site-to-site VPN connections](./tutorial-site-to-site-portal.md)

> [!div class="nextstepaction"]
> [Point-to-site VPN connections](vpn-gateway-howto-point-to-site-resource-manager-portal.md)
