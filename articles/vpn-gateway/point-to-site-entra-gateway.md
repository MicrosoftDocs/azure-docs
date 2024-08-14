---
title: 'Configure P2S VPN gateway for Microsoft Entra ID authentication: Microsoft-registered client'
titleSuffix: Azure VPN Gateway
description: Learn how to configure P2S gateway settings and Microsoft Entra ID authentication using Microsoft-registered Azure VPN Client.
author: cherylmc
ms.service: vpn-gateway
ms.custom: linux-related-content
ms.topic: how-to
ms.date: 07/24/2024
ms.author: cherylmc
# Customer intent: As an VPN Gateway administrator, I want to configure point-to-site to allow Microsoft Entra ID authentication using the Microsoft-registered Azure VPN Client APP ID.
---

# Configure P2S VPN Gateway for Microsoft Entra ID authentication – Microsoft-registered app

This article helps you configure your point-to-site (P2S) VPN gateway for Microsoft Entra ID authentication using the new Microsoft-registered Azure VPN Client App ID.

> [!NOTE]
> The steps in this article apply to Microsoft Entra ID authentication using the new Microsoft-registered Azure VPN Client App ID and associated Audience values. This article doesn't apply to the older, manually registered Azure VPN Client app for your tenant. For the manually registered Azure VPN Client steps, see [Configure P2S using manually registered VPN client](openvpn-azure-ad-tenant.md).

[!INCLUDE [About Microsoft-registered app](../../includes/vpn-gateway-entra-app-id-descriptions.md)]

## Point-to-site workflow

Successfully configuring a P2S connection using Microsoft Entra ID authentication requires a sequence of steps.

This article helps you:

1. Verify your tenant.
1. Configure the VPN gateway with the appropriate required settings.
1. Generate and download the VPN Client configuration package.

The articles in the [Next steps](#next-steps) section help you:

1. Download the Azure VPN Client on the client computer.
1. Configure the client using the settings from the VPN Client configuration package.
1. Connect.

## Prerequisites

This article assumes the following prerequisites:

* **A VPN gateway**

  * Certain gateway options are incompatible with P2S VPN gateways that use Microsoft Entra ID authentication. The VPN gateway can't use the Basic SKU  or a policy-based VPN type. For more information about gateway SKUs, see [About gateway SKUs](about-gateway-skus.md). For more information about VPN types, see [VPN Gateway settings](vpn-gateway-about-vpn-gateway-settings.md#vpntype).

  * If you don't already have a functioning VPN gateway that's compatible with Microsoft Entra ID authentication, see [Create and manage a VPN gateway - Azure portal](tutorial-create-gateway-portal.md). Create a compatible VPN gateway, then return to this article to configure P2S settings.

* **A Microsoft Entra tenant**

  * The steps in this article require a Microsoft Entra tenant. For more information, see [Create a new tenant in Microsoft Entra ID](/entra/fundamentals/create-new-tenant).

## <a name="addresspool"></a>Add the VPN client address pool

The client address pool is a range of private IP addresses that you specify. The clients that connect over a point-to-site VPN dynamically receive an IP address from this range. Use a private IP address range that doesn't overlap with the on-premises location that you connect from, or the VNet that you want to connect to. If you configure multiple protocols and SSTP is one of the protocols, then the configured address pool is split between the configured protocols equally.

1. In the Azure portal, go to your VPN gateway.
1. On the page for your gateway, in the left pane, select **Point-to-site configuration**.
1. Click **Configure now** to open the configuration page.

   :::image type="content" source="./media/vpn-gateway-howto-point-to-site-resource-manager-portal/configuration-address-pool.png" alt-text="Screenshot of Point-to-site configuration page - address pool." lightbox="./media/vpn-gateway-howto-point-to-site-resource-manager-portal/configuration-address-pool.png":::

1. On the **Point-to-site configuration** page, in the **Address pool** box, add the private IP address range that you want to use. VPN clients dynamically receive an IP address from the range that you specify. The minimum subnet mask is 29 bit for active/passive and 28 bit for active/active configuration.
1. Continue to the next section to configure more settings.

## <a name="configure-vpn"></a>Configure tunnel type and authentication

> [!IMPORTANT]
> [!INCLUDE [Microsoft Entra ID note for portal pages](../../includes/vpn-gateway-entra-portal-note.md)]

1. Locate the tenant ID of the directory that you want to use for authentication. For help with finding your tenant ID, see [How to find your Microsoft Entra tenant ID](/entra/fundamentals/how-to-find-tenant).

1. Configure tunnel type and authentication values.

   :::image type="content" source="./media/point-to-site-entra-gateway/values.png" alt-text="Screenshot showing settings for Tunnel type, Authentication type, and Microsoft Entra ID  settings." lightbox="./media/point-to-site-entra-gateway/values.png":::

   Configure the following values:

   * **Address pool**: client address pool
   * **Tunnel type:** OpenVPN (SSL)
   * **Authentication type**: Microsoft Entra ID

   For **Microsoft Entra ID** values, use the following guidelines for **Tenant**, **Audience**, and **Issuer** values. Replace {Microsoft ID Entra Tenant ID} with your tenant ID, taking care to remove **{}** from the examples when you replace this value.

   * **Tenant:** TenantID for the Microsoft Entra ID tenant. Enter the tenant ID that corresponds to your configuration. Make sure the Tenant URL doesn't have a `\` (backslash) at the end. Forward slash is permissible.

      * Azure Public: `https://login.microsoftonline.com/{Microsoft ID Entra Tenant ID}`

   * **Audience**: The corresponding value for the Microsoft-registered Azure VPN Client App ID. Custom audience is also supported for this field.

     * Azure Public: `c632b3df-fb67-4d84-bdcf-b95ad541b5c8`

   * **Issuer**: URL of the Secure Token Service. Include a trailing slash at the end of the **Issuer** value. Otherwise, the connection might fail. Example:

     * `https://sts.windows.net/{Microsoft ID Entra Tenant ID}/`

1. You don't need to click **Grant administrator consent for Azure VPN client application**. This link is only for manually registered VPN clients that use the older Audience values. It opens a page in the Azure portal.
1. Once you finish configuring settings, click **Save** at the top of the page.

## <a name="download"></a>Download the VPN client profile configuration package

In this section, you generate and download the Azure VPN client profile configuration package. This package contains the settings that you can use to configure the Azure VPN client profile on client computers.

[!INCLUDE [Azure VPN client profile configuration package](../../includes/vpn-gateway-point-to-site-client-package-download.md)]

## <a name="configure-client"></a>Configure the Azure VPN Client

Next, you examine the profile configuration package, configure the Azure VPN Client for the client computers, and connect to Azure. See the articles listed in the Next steps section.

## Next steps

Configure the Azure VPN Client.

* [Azure VPN Client for Linux](point-to-site-entra-vpn-client-linux.md)
* [Azure VPN Client for Windows](point-to-site-entra-vpn-client-windows.md)
* [Azure VPN Client for macOS](point-to-site-entra-vpn-client-mac.md)
