---
title: Configure P2S User VPN for Microsoft Entra ID authentication - Microsoft-registered client
titleSuffix: Azure Virtual WAN
description: Learn how to configure Virtual WAN P2S User VPN server settings for Microsoft Entra ID authentication using Microsoft-registered Azure VPN Client.
services: virtual-wan
author: cherylmc
ms.service: azure-virtual-wan
ms.topic: how-to
ms.date: 02/13/2025
ms.author: cherylmc 

#Audience ID values are not sensitive data.

---
# Configure a point-to-site User VPN connection - Microsoft Entra ID authentication

This article helps you configure point-to-site User VPN connection to Virtual WAN that uses Microsoft Entra ID authentication and the new **Microsoft-registered Azure VPN Client App ID**.

[!INCLUDE [About Microsoft-registered app](../../includes/virtual-wan-entra-app-id-descriptions.md)]

[!INCLUDE [OpenVPN note](../../includes/vpn-gateway-openvpn-auth-include.md)]

In this article, you learn how to:

* Create a virtual WAN
* Create a User VPN configuration
* Download a virtual WAN User VPN profile
* Create a virtual hub
* Edit a hub to add P2S gateway
* Connect a virtual network to a virtual hub
* Download and apply the User VPN client configuration
* View your virtual WAN

:::image type="content" source="./media/virtual-wan-about/virtualwanp2s.png" alt-text="Screenshot of Virtual WAN diagram." lightbox="./media/virtual-wan-about/virtualwanp2s.png":::

## Before you begin

Verify that you've met the following criteria before beginning your configuration:

* You have a virtual network that you want to connect to. Verify that none of the subnets of your on-premises networks overlap with the virtual networks that you want to connect to. To create a virtual network in the Azure portal, see the [Quickstart](../virtual-network/quick-create-portal.md).

* Your virtual network doesn't have any virtual network gateways. If your virtual network has a gateway (either VPN or ExpressRoute), you must remove all gateways. The steps for this configuration help you connect your virtual network to the Virtual WAN virtual hub gateway.

* Obtain an IP address range for your hub region. The hub is a virtual network that is created and used by Virtual WAN. The address range that you specify for the hub can't overlap with any of your existing virtual networks that you connect to. It also can't overlap with your address ranges that you connect to on premises. If you're unfamiliar with the IP address ranges located in your on-premises network configuration, coordinate with someone who can provide those details for you.

* You need a Microsoft Entra ID tenant for this configuration. If you don't have one, you can create one by following the instructions in [Create a new tenant](/entra/fundamentals/create-new-tenant).

* If you want to use a custom audience value, see [Create or modify custom audience app ID](point-to-site-entra-register-custom-app.md).

## <a name="wan"></a>Create a virtual WAN

From a browser, navigate to the [Azure portal](https://portal.azure.com) and sign in with your Azure account.

[!INCLUDE [Create a virtual WAN](../../includes/virtual-wan-create-vwan-include.md)]

## <a name="user-config"></a>Create a User VPN configuration

A User VPN configuration defines the parameters for connecting remote clients. It's important to create the User VPN configuration before configuring your virtual hub with P2S settings, as you must specify the User VPN configuration you want to use.

> [!IMPORTANT]
> [!INCLUDE [Microsoft Entra ID note for portal pages](../../includes/vpn-gateway-entra-portal-note.md)]

1. Go to your Virtual WAN. In the left pane, expand **Connectivity** and select the **User VPN configurations** page. On the **User VPN configurations** page, click **+Create user VPN config**.
1. On the **Basics** page, specify the following parameters.

    * **Configuration name** - Enter the name you want to call your User VPN Configuration. For example, **TestConfig1**.
    * **Tunnel type** - Select OpenVPN from the dropdown menu.
1. At the top of the page, click **Azure Active Directory**. You can view the necessary values on the Microsoft Entra ID page for Enterprise applications in the portal.

    :::image type="content" source="./media/virtual-wan-point-to-site-azure-ad/values.png" alt-text="Screenshot of the Microsoft Entra ID page." lightbox="./media/virtual-wan-point-to-site-azure-ad/values.png"::: Configure the following values:

   * **Azure Active Directory** - Select **Yes**.
   * **Audience** - Enter the corresponding value for the Microsoft-registered Azure VPN Client App ID: `c632b3df-fb67-4d84-bdcf-b95ad541b5c8`. [Custom audience](point-to-site-entra-register-custom-app.md) is also supported for this field.
   * **Issuer** - Enter `https://sts.windows.net/<your Directory ID>/`.
   * **AAD Tenant** - Enter the TenantID for the Microsoft Entra tenant. Make sure there isn't an `/` at the end of the Microsoft Entra tenant URL.

1. Click **Create** to create the User VPN configuration. You'll select this configuration later in the exercise.

## <a name="site"></a>Create an empty hub

Next, create the virtual hub. The steps in this section create an empty virtual hub to which you can later add the P2S gateway. However, it's always much more efficient to combine creating the hub along with the gateway because each time you make a configuration change to the hub, you have to wait for the hub settings to build.

For demonstration purposes, we'll create an empty hub first, then add the P2S gateway in the next section. But, you can choose to incorporate the P2S gateway settings from the next section at the same time you configure the hub.

[!INCLUDE [Create an empty hub](../../includes/virtual-wan-hub-basics.md)]

After configuring the settings, click **Review + create** to validate, then **Create** the hub. It can take up to 30 minutes to create a hub.

## <a name="hub"></a>Add a P2S gateway to a hub

This section shows you how to add a gateway to an already existing virtual hub. It can take up to 30 minutes to update a hub.

1. Go to your Virtual WAN. In the left pane, expand **Settings** and select **Hubs**.
1. Click the name of the hub that you want to edit.
1. Click **Edit virtual hub** at the top of the page to open the **Edit virtual hub** page.
1. On the **Edit virtual hub** page, check the checkboxes for **Include vpn gateway for vpn sites** and **Include point-to-site gateway** to reveal the settings. Then configure the values.

   :::image type="content" source="./media/virtual-wan-point-to-site-azure-ad/hub.png" alt-text="Screenshot shows the Edit virtual hub." lightbox="./media/virtual-wan-point-to-site-azure-ad/hub.png":::

   * **Gateway scale units**: Select the Gateway scale units. Scale units represent the aggregate capacity of the User VPN gateway. If you select 40 or more gateway scale units, plan your client address pool accordingly. For information about how this setting impacts the client address pool, see [About client address pools](about-client-address-pools.md). For information about gateway scale units, see the [FAQ](virtual-wan-faq.md#p2s-concurrent).
   * **User VPN configuration**: Select the configuration that you created earlier.
   * **User Groups to Address Pools Mapping**: Specify address pools. For information about this setting, see [Configure user groups and IP address pools for P2S User VPNs](user-groups-create.md).

1. After configuring the settings, click **Confirm** to update the hub. It can take up to 30 minutes to update a hub.

## <a name="connect-vnet"></a>Connect virtual network to hub

In this section, you create a connection between your virtual hub and your virtual network.

[!INCLUDE [Connect virtual network](../../includes/virtual-wan-connect-vnet-hub-include.md)]

## <a name="download-profile"></a>Download User VPN profile

All of the necessary configuration settings for the VPN clients are contained in a VPN client configuration zip file. The settings in the zip file help you easily configure the VPN clients. The VPN client configuration files that you generate are specific to the User VPN configuration for your gateway. You can download global (WAN-level) profiles, or a profile for a specific hub. For information and additional instructions, see [Download global and hub profiles](global-hub-profile.md). The following steps walk you through downloading a global WAN-level profile.

[!INCLUDE [Download profile](../../includes/virtual-wan-p2s-download-profile-include.md)]

##  <a name="configure-client"></a>Configure the Azure VPN Client

Next, you examine the profile configuration package, configure the Azure VPN Client for the client computers, and connect to Azure. See the articles listed in the Next steps section.

## Next steps

Configure the Azure VPN Client. You can use the steps in the VPN Gateway client documentation to configure the Azure VPN Client for Virtual WAN.

* [Azure VPN Client for Linux](../vpn-gateway/point-to-site-entra-vpn-client-linux.md)
* [Azure VPN Client for Windows](../vpn-gateway/point-to-site-entra-vpn-client-windows.md)
* [Azure VPN Client for macOS](../vpn-gateway/point-to-site-entra-vpn-client-mac.md)