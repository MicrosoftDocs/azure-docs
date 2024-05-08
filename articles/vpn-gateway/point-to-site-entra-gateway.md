---
title: 'Configure P2S VPN gateway for Microsoft Entra ID authentication: Microsoft-registered Azure VPN Client App ID'
titleSuffix: Azure VPN Gateway
description: Learn how to configure P2S gateway settings and Microsoft Entra ID authentication using Microsoft-registered Azure VPN Client App ID.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 05/02/2024
ms.author: cherylmc

# Customer intent: As an VPN Gateway administrator, I want to configure point-to-site to allow Microsoft Entra ID authentication using the Azure VPN client for Linux.
---

# Configure a P2S VPN gateway for Microsoft Entra ID authentication: Microsoft-registered App ID (Preview)

This article helps you configure your point-to-site (P2S) VPN gateway to use Microsoft Entra ID authentication and the new Microsoft-registered Azure VPN Client App ID.

[!INCLUDE [OpenVPN requirement note](../../includes/vpn-gateway-entra-registered-app-openvpn-note.md)]

## About the Microsoft-registered Azure VPN Client App ID

[!INCLUDE [About the Microsoft-registered App ID](../../includes/vpn-gateway-entra-app-id-descriptions.md)]

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

**Point-to-site VPN gateway:** If you already have an existing P2S gateway, the steps in this article help you configure the gateway for Microsoft Entra ID authentication. You can also create a new VPN gateway that specifies Microsoft Entra ID authentication. The link to create a new gateway is included in this article.

**Microsoft Entra tenant:** The steps in this article require a Microsoft Entra tenant. For more information, see [Create a new tenant in Microsoft Entra ID](https://learn.microsoft.com/entra/fundamentals/create-new-tenant).

## Configure the VPN gateway

> [!IMPORTANT]
> [!INCLUDE [Microsoft Entra ID note for portal pages](../../includes/vpn-gateway-entra-portal-note.md)]

1. Locate the tenant ID of the directory that you want to use for authentication. For help with finding your tenant ID, see [How to find your Microsoft Entra tenant ID](https://learn.microsoft.com/entra/fundamentals/how-to-find-tenant).

1. If you don't already have a functioning P2S gateway environment, follow the instruction to create one. See [Create a point-to-site VPN](vpn-gateway-howto-point-to-site-resource-manager-portal.md) to create and configure a point-to-site VPN gateway. When you create a VPN gateway, be sure to select a SKU other than the Basic SKU. The Basic SKU isn't supported for OpenVPN.

1. Go to the virtual network gateway. In the left pane, click **Point-to-site configuration**.

   :::image type="content" source="./media/point-to-site-entra-gateway/configuration.png" alt-text="Screenshot showing settings for Tunnel type, Authentication type, and Microsoft Entra settings." lightbox="./media/point-to-site-entra-gateway/configuration.png":::

   Configure the following values:

   * **Address pool**: client address pool
   * **Tunnel type:** OpenVPN (SSL)
   * **Authentication type**: Microsoft Entra ID

   For **Microsoft Entra ID** values, use the following guidelines for **Tenant**, **Audience**, and **Issuer** values. Replace {MicrosoftEntra TenantID} with your tenant ID, taking care to remove **{}** from the examples when you replace this value.

   > [!NOTE]
   > Azure Government, Azure Germany, and Azure operated by China 21Vianet are not currently supported for the Microsoft-registered Azure VPN Client App ID.
   >
  
   * **Tenant:** TenantID for the Microsoft Entra ID tenant. Enter the tenant ID that corresponds to your configuration. Make sure the Tenant URL doesn't have a `\` (backslash) at the end. Forward slash is permissible.

      * Azure Public: `https://login.microsoftonline.com/{MicrosoftEntra TenantID}`

   * **Audience**: The corresponding value for the Microsoft-registered Azure VPN Client App ID. Custom audience is also supported for this field.

     * Azure Public: `c632b3df-fb67-4d84-bdcf-b95ad541b5c8`

   * **Issuer**: URL of the Secure Token Service. Include a trailing slash at the end of the **Issuer** value. Otherwise, the connection might fail. Example:

     * `https://sts.windows.net/{MicrosoftEntra TenantID}/`

1. Once you finish configuring settings, click **Save** at the top of the page.

## Download the VPN client profile configuration package

In this section, you generate and download the Azure VPN client profile configuration package. This package contains the settings that you can use to configure the Azure VPN client profile on client computers.

[!INCLUDE [Azure VPN client profile configuration package](../../includes/vpn-gateway-point-to-site-client-package-download.md)]

## Configure the Azure VPN Client

Next, you examine the profile configuration package, configure the Azure VPN Client for the client computers, and connect to Azure. See the articles listed in the Next steps section.

## Next steps

Configure the Azure VPN Client.

* [Azure VPN Client for Linux](point-to-site-entra-vpn-client-linux.md)
* [Azure VPN Client for Windows](openvpn-azure-ad-client.md)
* [Azure VPN Client for macOS](openvpn-azure-ad-client-mac.md)