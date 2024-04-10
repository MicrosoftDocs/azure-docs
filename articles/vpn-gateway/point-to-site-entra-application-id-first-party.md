---
title: 'Configure P2S VPN gateway for Microsoft Entra ID authentication using 1st-party App ID - Linux Azure VPN client'
titleSuffix: Azure VPN Gateway
description: Learn how to configure P2S gateway settings and Microsoft Entra ID authentication using a first-party application.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 04/10/2024
ms.author: cherylmc

# Customer intent: As an VPN Gateway administrator, I want to configure point-to-site to allow Microsoft Entra ID authentication using the Azure VPN client for Linux.
---

# Configure a P2S VPN gateway for Microsoft Entra ID authentication - first-party App ID - Linux clients (Preview)

This article helps you configure your point-to-site (P2S) VPN gateway to use Microsoft Entra ID authentication with a first-party Application ID (App ID). This type of P2S Microsoft Entra ID authentication connection is available for Linux clients connecting using the Azure VPN client for Linux.

[!INCLUDE [OpenVPN note](../../includes/vpn-gateway-entra-first-party-open-vpn-note.md)]

## About VPN Gateway and first-party App IDs

Microsoft released a first-party Microsoft Entra application (first-party App ID) for the Azure VPN Client. Previously, Microsoft Entra ID authentication was only available for P2S VPN gateways using a third-party App ID. When you use a first-party Application ID (App ID), you don't need to authorize the Azure VPN client application, as you would with a third-party application. The App ID (Audience) value is different for first-party and third-party applications and isn't interchangeable.

To better understand the difference between the two types of application objects, see [How and why applications are added to Microsoft Entra ID](https://learn.microsoft.com/entra/identity-platform/how-applications-are-added).

VPN Gateway doesn't simultaneously support both Microsoft Entra ID authentication with third-party App ID, and Microsoft Entra ID authentication with first-party App ID: the two mechanisms are mutually exclusive. The VPN gateway supports only a single App ID: it can be either a third-party App ID, or a first-party App ID.

The version of the Azure VPN Client that connects is specific to either first-party, or third-party App ID. This means that a point-to-site VPN that's configured to use Microsoft Entra ID authentication can be configured either to support first-party App ID VPN clients, or third-party App ID VPN clients. But not both.

If you've already configured point-to-site and specified Microsoft Entra ID authentication, you're likely using third-party App ID with your current Azure VPN Clients and therefore can only use versions of the Azure VPN Client that support third-party App ID. The Azure VPN Client for Linux can't connect to the third-party App ID configuration.

When using the Azure VPN client first-party App ID, consider the following:

* The Azure VPN client for Linux is a newly released client and supports only first-party application App ID (not third-party).

* At this time, the Azure VPN client for Linux is the only version of the Azure VPN client that supports the first-party App ID. An annoucement will be made when we release versions that support first-party App ID for other operating systems.

* Azure Government, Azure Germany, and Azure operated by China 21Vianet aren't currently supported for first-party App ID.

* Custom Audience (first-party) is supported.

* The first-party App ID (Audience) value for the Azure VPN Client is different than the value you use for a third-party App ID.

## Prerequisites

**Point-to-site VPN gateway:** If you already have an existing P2S gateway, the steps in this article help you configure the gateway for Microsoft Entra authentication. You can also create a new VPN gateway that specifies Microsoft Entra authentication. The link to create a new gateway is included in this article.

**Microsoft Entra tenant:** The steps in this article require a Microsoft Entra tenant. If you don't have a Microsoft Entra tenant, you can create one using the steps in the [Create a new tenant](https://learn.microsoft.com/entra/fundamentals/create-new-tenant) article. Note the following fields when creating your directory:

* Organizational name
* Initial domain name

You also need tenant users:

1. Create two accounts in the newly created Microsoft Entra tenant. For steps, see [How to create, invite, and delete users](https://learn.microsoft.com/entra/fundamentals/how-to-create-delete-users).

   * Global administrator account
   * User account. The user account can be used to test OpenVPN authentication.

1. Assign one of the accounts the **Global administrator** role. For steps, see [Assign user roles with Microsoft Entra ID](https://learn.microsoft.com/entra/fundamentals/users-assign-role-azure-portal).

## Configure the VPN gateway

> [!IMPORTANT]
> [!INCLUDE [Microsoft Entra ID note for portal pages](../../includes/vpn-gateway-entra-portal-note.md)]

1. Locate the tenant ID of the directory that you want to use for authentication. For help with finding your tenant ID, see [How to find your Microsoft Entra tenant ID](https://learn.microsoft.com/entra/fundamentals/how-to-find-tenant).

1. If you don't already have a functioning P2S gateway environment, follow the instruction to create one. See [Create a point-to-site VPN](vpn-gateway-howto-point-to-site-resource-manager-portal.md) to create and configure a point-to-site VPN gateway. When you create a VPN gateway, be sure to select a SKU other than the Basic SKU. The Basic SKU isn't supported for OpenVPN.

1. Go to the virtual network gateway. In the left pane, click **Point-to-site configuration**.

   :::image type="content" source="./media/point-to-site-entra-application-id-first-party/configuration.png" alt-text="Screenshot showing settings for Tunnel type, Authentication type, and Microsoft Entra settings." lightbox="./media/point-to-site-entra-application-id-first-party/configuration.png":::

   Configure the following values:

   * **Address pool**: client address pool
   * **Tunnel type:** OpenVPN (SSL)
   * **Authentication type**: Microsoft Entra ID

   For **Microsoft Entra ID** values, use the following guidelines for **Tenant**, **Audience**, and **Issuer** values. Replace {MicrosoftEntra TenantID} with your tenant ID, taking care to remove **{}** from the examples when you replace this value.

   > [!NOTE]
   > Azure Government, Azure Germany, and Azure operated by China 21Vianet are not currently supported for first-party Application ID.
   >
  
   * **Tenant:** TenantID for the Microsoft Entra ID tenant. Enter the tenant ID that corresponds to your configuration. Make sure the Tenant URL doesn't have a `\` (backslash) at the end. Forward slash is permissible.

      * Azure Public AD: `https://login.microsoftonline.com/{MicrosoftEntra TenantID}`

   * **Audience**: The Application ID of the "Azure VPN" client - first-party App ID. Custom audience is also supported for this field.

     * Azure Public: `c632b3df-fb67-4d84-bdcf-b95ad541b5c8`

   * **Issuer**: URL of the Secure Token Service. Include a trailing slash at the end of the **Issuer** value. Otherwise, the connection might fail. Example:

     * `https://sts.windows.net/{MicrosoftEntra TenantID}/`

1. Once you finish configuring settings, click **Save** at the top of the page.

## Download the VPN client profile configuration package

In this section, you generate and download the Azure VPN client profile configuration package. This package contains the settings that you can use to configure the Azure VPN client profile on client computers.

[!INCLUDE [Azure VPN client profile configuration package](../../includes/vpn-gateway-point-to-site-client-package-download.md)]

## Next steps

Configure the Azure VPN client for Linux.
