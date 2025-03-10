---
title: 'Configure a P2S User VPN - Microsoft Entra ID authentication - manually registered Azure VPN Client App ID'
titleSuffix: Azure Virtual WAN
description: Learn how to configure Microsoft Entra ID authentication for Virtual WAN User VPN (point-to-site) using a manually registered Azure VPN Client App ID.
services: virtual-wan
author: cherylmc
ms.service: azure-virtual-wan
ms.topic: how-to
ms.date: 02/25/2025
ms.author: cherylmc 

#Audience ID values are not sensitive data.

---
# Configure P2S User VPN gateway for Microsoft Entra ID authentication – manually registered app

This article shows you how to use Virtual WAN to connect to your resources in Azure. In this article, you create a point-to-site User VPN connection to Virtual WAN that uses Microsoft Entra ID authentication. Microsoft Entra ID authentication is only available for gateways that use the OpenVPN protocol. While the steps and Audience values in this article do result in a working configuration, we recommend that you use the [Configure P2S VPN Gateway for Microsoft Entra ID authentication](point-to-site-entra-gateway.md) article instead.

> [!IMPORTANT]
> We recommend using the new [Configure P2S VPN Gateway for Microsoft Entra ID authentication](point-to-site-entra-gateway.md) article. The new article offers a more efficient setup process using the new **Microsoft-registered Azure VPN Client App ID** Audience value. Additionally, the new Audience value now supports the Azure VPN Client for Linux. If your P2S User VPN gateway is already set up with the manually configured Azure VPN Client Audience values, you can [migrate](point-to-site-entra-gateway-update.md) to the new Microsoft-registered App ID.

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

* Your virtual network doesn't have any virtual network gateways. If your virtual network has a gateway (either VPN or ExpressRoute), you must remove all gateways. This configuration requires that virtual networks are connected instead, to the Virtual WAN hub gateway.

* Obtain an IP address range for your hub region. The hub is a virtual network that is created and used by Virtual WAN. The address range that you specify for the hub can't overlap with any of your existing virtual networks that you connect to. It also can't overlap with your address ranges that you connect to on premises. If you're unfamiliar with the IP address ranges located in your on-premises network configuration, coordinate with someone who can provide those details for you.

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## <a name="wan"></a>Create a virtual WAN

From a browser, navigate to the [Azure portal](https://portal.azure.com) and sign in with your Azure account.

[!INCLUDE [Create a virtual WAN](../../includes/virtual-wan-create-vwan-include.md)]

## <a name="user-config"></a>Create a User VPN configuration

A User VPN configuration defines the parameters for connecting remote clients. It's important to create the User VPN configuration before configuring your virtual hub with P2S settings, as you must specify the User VPN configuration you want to use.

1. Navigate to your **Virtual WAN ->User VPN configurations** page and click **+Create user VPN config**.

1. On the **Basics** page, specify the parameters.

   :::image type="content" source="./media/virtual-wan-point-to-site-azure-ad/basics.png" alt-text="Screenshot of the Basics page." lightbox="./media/virtual-wan-point-to-site-azure-ad/basics.png":::

    * **Configuration name** - Enter the name you want to call your User VPN Configuration.
    * **Tunnel type** - Select OpenVPN from the dropdown menu.

1. Click **Microsoft Entra ID** to open the page. This page might also still be labeled **Azure Active Directory**.

   :::image type="content" source="./media/virtual-wan-point-to-site-azure-ad/values.png" alt-text="Screenshot of the Microsoft Entra ID page." lightbox="./media/virtual-wan-point-to-site-azure-ad/values.png":::

    Toggle **Microsoft Entra ID** to **Yes** and supply the following values based on your tenant details. You can view the necessary values on the Microsoft Entra ID page for Enterprise applications in the portal.
   * **Authentication method** - Select Microsoft Entra ID.
   * **Audience** - Type the Application ID of the Azure VPN Client Enterprise Application registered in your Microsoft Entra tenant. For values, see: [Azure VPN Client Audience values](openvpn-azure-ad-tenant.md)
   * **Issuer** - `https://sts.windows.net/<your Directory ID>/`
   * **Microsoft Entra tenant:** TenantID for the Microsoft Entra tenant. Make sure there isn't a `/` at the end of the Microsoft Entra tenant URL.

     * Enter `https://login.microsoftonline.com/<your Directory Tenant ID>` for Azure Public AD
     * Enter `https://login.microsoftonline.us/<your Directory Tenant ID>` for Azure Government AD
     * Enter `https://login-us.microsoftonline.de/<your Directory Tenant ID>` for Azure Germany AD
     * Enter `https://login.chinacloudapi.cn/<your Directory Tenant ID>` for China 21Vianet AD

1. Click **Create** to create the User VPN configuration. You'll select this configuration later in the exercise.

## <a name="site"></a>Create an empty hub

For this exercise, we create an empty virtual hub in this step and, in the next section, you add a P2S gateway to this hub. However, you can combine these steps and create the hub with the P2S gateway settings all at once. The result is the same either way. After configuring the settings, click **Review + create** to validate, then **Create**.

[!INCLUDE [Create an empty hub](../../includes/virtual-wan-hub-basics.md)]

## <a name="hub"></a>Add a P2S gateway to a hub

This section shows you how to add a gateway to an already existing virtual hub. This step can take up to 30 minutes for the hub to complete updating.

1. Navigate to the **Hubs** page under the virtual WAN.
1. Click the name of the hub that you want to edit to open the page for the hub.
1. Click **Edit virtual hub** at the top of the page to open the **Edit virtual hub** page.
1. On the **Edit virtual hub** page, check the checkboxes for **Include vpn gateway for vpn sites** and **Include point-to-site gateway** to reveal the settings. Then configure the values.

   :::image type="content" source="./media/virtual-wan-point-to-site-azure-ad/hub.png" alt-text="Screenshot shows the Edit virtual hub." lightbox="./media/virtual-wan-point-to-site-azure-ad/hub.png":::

   * **Gateway scale units**: Select the Gateway scale units. Scale units represent the aggregate capacity of the User VPN gateway. If you select 40 or more gateway scale units, plan your client address pool accordingly. For information about how this setting impacts the client address pool, see [About client address pools](about-client-address-pools.md). For information about gateway scale units, see the [FAQ](virtual-wan-faq.md#p2s-concurrent).
   * **User VPN configuration**: Select the configuration that you created earlier.
   * **User Groups to Address Pools Mapping**: For information about this setting, see [Configure user groups and IP address pools for P2S User VPNs (preview)](user-groups-create.md).

1. After configuring the settings, click **Confirm** to update the hub. It can take up to 30 minutes to update a hub.

## <a name="connect-vnet"></a>Connect virtual network to hub

In this section, you create a connection between your virtual hub and your virtual network.

[!INCLUDE [Connect virtual network](../../includes/virtual-wan-connect-vnet-hub-include.md)]

## <a name="download-profile"></a>Download User VPN profile

All of the necessary configuration settings for the VPN clients are contained in a VPN client configuration zip file. The settings in the zip file help you easily configure the VPN clients. The VPN client configuration files that you generate are specific to the User VPN configuration for your gateway. You can download global (WAN-level) profiles, or a profile for a specific hub. For information and additional instructions, see [Download global and hub profiles](global-hub-profile.md). The following steps walk you through downloading a global WAN-level profile.

[!INCLUDE [Download profile](../../includes/virtual-wan-p2s-download-profile-include.md)]

##  <a name="configure-client"></a>Configure User VPN clients

Each computer that connects must have a client installed. You configure each client by using the VPN User client profile files that you downloaded in the previous steps. Use the article that pertains to the operating system that you want to connect.

[!INCLUDE [All client articles](../../includes/vpn-gateway-vpn-client-install-articles.md)]

## <a name="viewwan"></a>View your virtual WAN

1. Navigate to the virtual WAN.
2. On the Overview page, each point on the map represents a hub.
3. In the Hubs and connections section, you can view hub status, site, region, VPN connection status, and bytes in and out.

## <a name="cleanup"></a>Clean up resources

When you no longer need the resources that you created, delete them. Some of the Virtual WAN resources must be deleted in a certain order due to dependencies. Deleting can take about 30 minutes to complete.

[!INCLUDE [Delete resources](../../includes/virtual-wan-resource-cleanup.md)]

## Next steps

For Virtual WAN frequently asked questions, see the [Virtual WAN FAQ](virtual-wan-faq.md).
