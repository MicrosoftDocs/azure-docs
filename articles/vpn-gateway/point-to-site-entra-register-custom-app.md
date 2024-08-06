---
title: Create custom app ID for P2S VPN Microsoft Entra ID authentication
titleSuffix: Azure VPN Gateway
description: Learn how to create a custom audience App ID or upgrade an existing custom App ID to the new Microsoft-registered Azure VPN Client app values.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: concept-article
ms.date: 08/05/2024
ms.author: cherylmc
---

# Create a custom audience app ID for P2S VPN Microsoft Entra ID authentication

The steps in this article help you create a Microsoft Entra ID custom App ID (custom audience) for the new Microsoft-registered Azure VPN Client for point-to-site (P2S) connections. You can also update your existing tenant to [change the new Microsoft-registered Azure VPN Client app](#change) from the previous Azure VPN Client app.

If you need to create a custom audience using a value other than the Azure Public value `c632b3df-fb67-4d84-bdcf-b95ad541b5c8`, you can replace this value with the value you require. For more information and to see the available audience ID values for the Azure VPN Client app, see [Microsoft Entra ID authentication for P2S](point-to-site-about.md#microsoft-entra-id-authentication).

This article provides high-level steps. The screenshots might be different than what you experience in the Azure portal, but the settings are the same. For more information, see [Quickstart: Register an application](/entra/identity-platform/quickstart-register-app).

## Prerequisites

This article assumes that you already have a Microsoft Entra tenant and the permissions to create an Enterprise Application, typically the Cloud Application administrator role or higher. For more information, see [Create a new tenant in Microsoft Entra ID](/entra/fundamentals/create-new-tenant) and [Assign user roles with Microsoft Entra ID](/entra/fundamentals/users-assign-role-azure-portal).

[!INCLUDE [Configure custom audience](../../includes/vpn-gateway-custom-audience.md)]

After you've completed these steps, continue to [Configure P2S VPN Gateway for Microsoft Entra ID authentication – Microsoft-registered app](point-to-site-entra-gateway.md).

## <a name="change"></a>Change to Microsoft-registered VPN client app

[!INCLUDE [Change custom audience](../../includes/vpn-gateway-custom-audience-change.md)]

## Next steps

* [Configure P2S VPN Gateway for Microsoft Entra ID authentication – Microsoft-registered app](point-to-site-entra-gateway.md).
* To connect to your virtual network, you must configure the Azure VPN client on your client computers. See [Configure a VPN client for P2S VPN connections](point-to-site-entra-vpn-client-windows.md).
* For frequently asked questions, see the **Point-to-site** section of the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md#P2S).
