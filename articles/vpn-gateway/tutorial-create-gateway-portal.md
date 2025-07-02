---
title: 'Tutorial – Create & manage a VPN gateway – Azure portal'
titleSuffix: Azure VPN Gateway
description: In this tutorial, learn how to create and manage an Azure VPN gateway by using the Azure portal.
author: cherylmc
ms.author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: tutorial
ms.date: 06/24/2025

# Customer intent: "As a network administrator, I want to create and manage a VPN gateway using the cloud portal, so that I can securely connect our on-premises resources to our virtual network."
---

# Tutorial: Create and manage a VPN gateway using the Azure portal

This tutorial helps you create and manage a virtual network gateway (VPN gateway) using the Azure portal. The VPN gateway is one part of the connection architecture that helps you securely access resources within a virtual network using VPN Gateway.

:::image type="content" source="./media/tutorial-create-gateway-portal/gateway-diagram.png" alt-text="Diagram that shows a virtual network and a VPN gateway." lightbox="./media/tutorial-create-gateway-portal/gateway-diagram-expand.png":::

* The left side of the diagram shows the virtual network and the VPN gateway that you create by using the steps in this article.
* You can later add different types of connections, as shown on the right side of the diagram. For example, you can create [site-to-site](tutorial-site-to-site-portal.md) and [point-to-site](point-to-site-about.md) connections. To view different design architectures that you can build, see [VPN gateway design](design.md).
* For more information about Azure VPN Gateway, see [What is Azure VPN Gateway](vpn-gateway-about-vpngateways.md)? If you want to learn more about the configuration settings used in this tutorial, see [About VPN Gateway configuration settings](vpn-gateway-about-vpn-gateway-settings.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network.
> * Create an active-active mode zone-redundant VPN gateway.
> * View the gateway public IP address.
> * Upgrade a VPN gateway SKU.
> * Reset a VPN gateway.

> [!NOTE]
> [!INCLUDE [AZ SKU region support note](../../includes/vpn-gateway-az-regions-support-include.md)]

## Prerequisites

You need an Azure account with an active subscription. If you don't have one, [create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

## <a name="CreateVNet"></a>Create a virtual network

This article uses the Azure portal to create a virtual network. You can also use a different tool or method to create a virtual network. For more information or steps, see [Create a virtual network](../virtual-network/quick-create-portal.md). For this exercise, the virtual network doesn't require the configuration of additional services, such as [Azure Bastion](../bastion/bastion-overview.md) or [DDoS Protection](../ddos-protection/ddos-protection-overview.md). However, you can add these services if you want to use them.

[!INCLUDE [Virtual network values](../../includes/vpn-gateway-virtual-network-values.md)]

[!INCLUDE [Create a VNet](../../includes/vpn-gateway-virtual-network-steps.md)]

## Create a gateway subnet

[!INCLUDE [About GatewaySubnet with links](../../includes/vpn-gateway-about-gwsubnet-include.md)]

[!INCLUDE [Create gateway subnet](../../includes/vpn-gateway-create-gateway-subnet-portal-include.md)]

[!INCLUDE [NSG warning](../../includes/vpn-gateway-no-nsg-include.md)]

## <a name="VNetGateway"></a>Create a VPN gateway

In this section, you create the virtual network gateway (VPN gateway) for your virtual network. Creating a gateway can often take 45 minutes or more, depending on the selected gateway SKU. Use the following steps to create a VPN gateway. Note that the VPN Gateway Basic SKU is only available in [PowerShell](create-gateway-basic-sku-powershell.md) or CLI.

[!INCLUDE [Create a vpn gateway](../../includes/vpn-gateway-add-gateway-portal.md)]
[!INCLUDE [Configure PIP settings](../../includes/vpn-gateway-add-gw-pip-portal.md)]

You can see the deployment status on the **Overview** page for your gateway. Once the gateway is created, you can view the IP address assigned to it by looking at the virtual network in the portal. The gateway appears as a connected device.

## <a name="view"></a>View public IP address

To view public IP addresses associated to your virtual network gateway, navigate to your gateway in the portal.

1. On the **Virtual network gateway** portal page, under **Settings**, open the **Properties** page.
1. To view more information about the IP address object, click the associated IP address link.

## <a name="resize"></a>Upgrade a gateway SKU

There are specific rules for upgrading a gateway SKU. Not all SKUs can be upgraded. For more information, see [Upgrade a gateway SKU](gateway-sku-upgrade.md).

1. Go to the **Configuration** page for your virtual network gateway.
1. On the right side of the page, select the dropdown arrow to show a list of available SKUs. Notice that the list only populates SKUs that you're able to select.
1. Select the SKU from the dropdown list and save your changes.

## <a name="reset"></a>Reset a gateway

Gateway resets behave differently, depending on your gateway configuration. For more information, see [Reset a VPN gateway or a connection](reset-gateway.md).

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
> [Point-to-site - Certificate authentication VPN connections](point-to-site-certificate-gateway.md)

> [!div class="nextstepaction"]
> [Point-to-site - Microsoft Entra ID authentication VPN connections](point-to-site-entra-gateway.md)
