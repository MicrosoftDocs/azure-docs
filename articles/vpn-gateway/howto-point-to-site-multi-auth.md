---
title: 'Connect to a VNet using P2S VPN & multiple authentication types: portal'
titleSuffix: Azure VPN Gateway
description: Learn how to connect to a VNet via P2S using multiple authentication types.
services: vpn-gateway
author: cherylmc

ms.service: vpn-gateway
ms.topic: how-to
ms.date: 07/21/2021
ms.author: cherylmc

---
# Configure a Point-to-Site VPN connection to a VNet using multiple authentication types: Azure portal

This article helps you securely connect individual clients running Windows, Linux, or macOS to an Azure VNet. Point-to-Site VPN connections are useful when you want to connect to your VNet from a remote location, such when you are telecommuting from home or a conference. You can also use P2S instead of a Site-to-Site VPN when you have only a few clients that need to connect to a VNet. Point-to-Site connections do not require a VPN device or a public-facing IP address. P2S creates the VPN connection over either SSTP (Secure Socket Tunneling Protocol), or IKEv2. For more information about Point-to-Site VPN, see [About Point-to-Site VPN](point-to-site-about.md).

:::image type="content" source="./media/vpn-gateway-howto-point-to-site-resource-manager-portal/point-to-site-diagram.png" alt-text="Connect from a computer to an Azure VNet - point-to-site connection diagram":::

For more information about point-to-site VPN, see [About point-to-site VPN](point-to-site-about.md). To create this configuration using the Azure PowerShell, see [Configure a point-to-site VPN using Azure PowerShell](vpn-gateway-howto-point-to-site-rm-ps.md).

## Prerequisites

Verify that you have an Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial).

Multiple authentication types on the same VPN gateway are only supported with OpenVPN tunnel type.

### <a name="example"></a>Example values

You can use the following values to create a test environment, or refer to these values to better understand the examples in this article:

* **VNet Name:** VNet1
* **Address space:** 10.1.0.0/16<br>For this example, we use only one address space. You can have more than one address space for your VNet.
* **Subnet name:** FrontEnd
* **Subnet address range:** 10.1.0.0/24
* **Subscription:** If you have more than one subscription, verify that you are using the correct one.
* **Resource Group:** TestRG1
* **Location:** East US
* **GatewaySubnet:** 10.1.255.0/27<br>
* **SKU:** VpnGw2
* **Generation:** Generation 2
* **Gateway type:** VPN
* **VPN type:** Route-based
* **Public IP address name:** VNet1GWpip
* **Connection type:** Point-to-site
* **Client address pool:** 172.16.201.0/24<br>VPN clients that connect to the VNet using this Point-to-Site connection receive an IP address from the client address pool.

## <a name="createvnet"></a>Create a virtual network

Before beginning, verify that you have an Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial).

[!INCLUDE [About cross-premises addresses](../../includes/vpn-gateway-cross-premises.md)]

[!INCLUDE [Basic Point-to-Site VNet](../../includes/vpn-gateway-basic-vnet-rm-portal-include.md)]

## <a name="creategw"></a>Virtual network gateway

In this step, you create the virtual network gateway for your VNet. Creating a gateway can often take 45 minutes or more, depending on the selected gateway SKU.

>[!NOTE]
>The Basic gateway SKU does not support OpenVPN tunnel type.
>

[!INCLUDE [About gateway subnets](../../includes/vpn-gateway-about-gwsubnet-portal-include.md)]

[!INCLUDE [Create a vpn gateway](../../includes/vpn-gateway-add-gw-portal-include.md)]
[!INCLUDE [Configure PIP settings](../../includes/vpn-gateway-add-gw-pip-portal-include.md)]

You can see the deployment status on the Overview page for your gateway. A gateway can often take 45 minutes or more to fully create and deploy. After the gateway is created, you can view the IP address that has been assigned to it by looking at the virtual network in the portal. The gateway appears as a connected device.

[!INCLUDE [NSG warning](../../includes/vpn-gateway-no-nsg-include.md)]

## <a name="addresspool"></a>Client address pool

The client address pool is a range of private IP addresses that you specify. The clients that connect over a Point-to-Site VPN dynamically receive an IP address from this range. Use a private IP address range that does not overlap with the on-premises location that you connect from, or the VNet that you want to connect to. If you configure multiple protocols and SSTP is one of the protocols, then the configured address pool is split between the configured protocols equally.

1. Once the virtual network gateway has been created, navigate to the **Settings** section of the virtual network gateway page. In **Settings**, select **Point-to-site configuration**. Select **Configure now** to open the configuration page.

   :::image type="content" source="./media/vpn-gateway-howto-point-to-site-resource-manager-portal/configure-now.png" alt-text="Screenshot of point-to-site configuration page." lightbox="./media/vpn-gateway-howto-point-to-site-resource-manager-portal/configure-now.png":::
1. On the **Point-to-site configuration** page, you can configure a variety of settings. In the **Address pool** box, add the private IP address range that you want to use. VPN clients dynamically receive an IP address from the range that you specify. The minimum subnet mask is 29 bit for active/passive and 28 bit for active/active configuration.

   :::image type="content" source="./media/howto-point-to-site-multi-auth/address.jpg" alt-text="Screenshot of address pool.":::

1. Continue to the next section to configure authentication and tunnel types.

## <a name="type"></a>Authentication and tunnel types

In this section, you configure authentication type and tunnel type. On the **Point-to-site configuration** page, if you don't see **Tunnel type** or **Authentication type**, your gateway is using the Basic SKU. The Basic SKU does not support IKEv2 or RADIUS authentication. If you want to use these settings, you need to delete and recreate the gateway using a different gateway SKU.

   :::image type="content" source="./media/howto-point-to-site-multi-auth/multiauth.jpg" alt-text="Screenshot of authentication type.":::

### <a name="tunneltype"></a>Tunnel type

On the **Point-to-site configuration** page, select **OpenVPN (SSL)** as the tunnel type.

### <a name="authenticationtype"></a>Authentication type

For **Authentication type**, select the desired types. Options are:

* Azure certificate
* RADIUS
* Azure Active Directory

Depending on the authentication type(s) selected, you will see different configuration setting fields that will have to be filled in. Fill in the required information and select **Save** at the top of the page to save all of the configuration settings.

For more information about authentication type, see:

* [Azure certificate](vpn-gateway-howto-point-to-site-resource-manager-portal.md#type)
* [RADIUS](point-to-site-how-to-radius-ps.md)
* [Azure Active Directory](openvpn-azure-ad-tenant.md)

## <a name="clientconfig"></a>VPN client configuration package

VPN clients must be configured with client configuration settings. The VPN client configuration package contains files with the settings to configure VPN clients in order to connect to a VNet over a P2S connection.

For instructions to generate and install VPN client configuration files, use the article that pertains to your configuration:

* [Create and install VPN client configuration files for native Azure certificate authentication P2S configurations](point-to-site-vpn-client-configuration-azure-cert.md).
* [Azure Active Directory authentication: Configure a VPN client for P2S OpenVPN protocol connections](openvpn-azure-ad-client.md).

## <a name="faq"></a>Point-to-Site FAQ

This section contains FAQ information that pertains to Point-to-Site configurations. You can also view the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md) for additional information about VPN Gateway.

[!INCLUDE [Point-to-Site FAQ](../../includes/vpn-gateway-faq-p2s-azurecert-include.md)]

## Next steps

Once your connection is complete, you can add virtual machines to your virtual networks. For more information, see [Virtual Machines](../index.yml). To understand more about networking and virtual machines, see [Azure and Linux VM network overview](../virtual-machines/network-overview.md).

For P2S troubleshooting information, [Troubleshooting Azure point-to-site connections](vpn-gateway-troubleshoot-vpn-point-to-site-connection-problems.md).
