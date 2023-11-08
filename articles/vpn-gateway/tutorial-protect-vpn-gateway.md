---
title: 'Tutorial: Protect your VPN gateway with Azure DDoS Protection'
titleSuffix: Azure VPN Gateway
description: Learn how to set up a VPN gateway and protect it with Azure DDoS protection
author: asudbring
ms.author: allensu
ms.service: vpn-gateway
ms.topic: tutorial
ms.date: 06/06/2023

---

# Tutorial: Protect your VPN gateway with Azure DDoS Protection 

This article helps you create an Azure VPN Gateway with a DDoS protected virtual network. Azure DDoS Protection enables enhanced DDoS mitigation capabilities such as adaptive tuning, attack alert notifications, and monitoring to protect your VPN gateway from large scale DDoS attacks.

> [!IMPORTANT]
> Azure DDoS Protection incurs a cost when you use the Network Protection SKU. Overages charges only apply if more than 100 public IPs are protected in the tenant. Ensure you delete the resources in this tutorial if you aren't using the resources in the future. For information about pricing, see [Azure DDoS Protection Pricing]( https://azure.microsoft.com/pricing/details/ddos-protection/). For more information about Azure DDoS protection, see [What is Azure DDoS Protection?](../ddos-protection/ddos-protection-overview.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a DDoS protection plan
> * Create a virtual network
> * Enable DDoS protection on the virtual network
> * Create a VPN gateway
> * View the gateway public IP address
> * Resize a VPN gateway (resize SKU)
> * Reset a VPN gateway

The following diagram shows the virtual network and the VPN gateway created as part of this tutorial.

:::image type="content" source="./media/tutorial-create-gateway-portal/gateway-diagram.png" alt-text="Diagram of VNet and VPN gateway." lightbox="./media/tutorial-create-gateway-portal/gateway-diagram-expand.png":::


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

## Create a DDoS protection plan

1. In the search box at the top of the portal, enter **DDoS protection**. Select **DDoS protection plans** in the search results and then select **+ Create**.

1. In the **Basics** tab of **Create a DDoS protection plan** page, enter or select the following information:

    | Setting | Value |
    |--|--|
    | **Project details** |   |
    | Subscription | Select your Azure subscription. |
    | Resource group | Select **TestRG1**. |
    | **Instance details** |   |
    | Name | Enter **myDDoSProtectionPlan**. |
    | Region | Select **East US**. |

1. Select **Review + create** and then select **Create** to deploy the DDoS protection plan.

## Enable DDoS protection

Azure DDoS Network Protection is enabled at the virtual network where the resource you want to protect reside. 

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

2. Select **VNet1**.

3. Select **DDoS protection** in **Settings**.

4. Select **Enable**.

5. In the pull-down box in DDoS protection plan, select **myDDoSProtectionPlan**.

6. Select **Save**.

## <a name="VNetGateway"></a>Create a VPN gateway

In this step, you create the virtual network gateway (VPN gateway) for your VNet. Creating a gateway can often take 45 minutes or more, depending on the selected gateway SKU.

Create a virtual network gateway using the following values:

* **Name:** VNet1GW
* **Region:** East US
* **Gateway type:** VPN
* **VPN type:** Route-based
* **SKU:** VpnGw2
* **Generation:** Generation 2
* **Virtual network:** VNet1
* **Gateway subnet address range:** 10.1.255.0/27
* **Public IP address:** Create new
* **Public IP address name:** VNet1GWpip

[!INCLUDE [Create a vpn gateway](../../includes/vpn-gateway-add-gw-portal-include.md)]

[!INCLUDE [Configure PIP settings](../../includes/vpn-gateway-add-gw-pip-portal-include.md)]

A gateway can take 45 minutes or more to fully create and deploy. You can see the deployment status on the Overview page for your gateway. After the gateway is created, you can view the IP address that has been assigned to it by looking at the virtual network in the portal. The gateway appears as a connected device.

[!INCLUDE [NSG warning](../../includes/vpn-gateway-no-nsg-include.md)]

## <a name="view"></a>View the public IP address

You can view the gateway public IP address on the **Overview** page for your gateway.

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

Once you have a VPN gateway, you can configure connections. The following articles will help you create a few of the most common configurations:

> [!div class="nextstepaction"]
> [Site-to-Site VPN connections](./tutorial-site-to-site-portal.md)

> [!div class="nextstepaction"]
> [Point-to-Site VPN connections](vpn-gateway-howto-point-to-site-resource-manager-portal.md)
