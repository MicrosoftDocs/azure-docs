---
title: 'Migrate manually registered Azure VPN client to Microsoft-registered for P2S Microsoft Entra ID authentication'
titleSuffix: Azure VPN Gateway
description: Learn how to update Audience values for P2S VPN gateway connections that use Microsoft Entra ID authentication.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 08/06/2024
ms.author: cherylmc

# Customer intent: As an VPN Gateway administrator, I want to update point-to-site Audience values for Microsoft Entra ID authentication.
---

# Migrate a manually registered Azure VPN Client to the Microsoft-registered client

This article helps you migrate from a manually registered Azure VPN Client to the Microsoft-registered Azure VPN Client for point-to-site (P2S) Microsoft Entra ID authentication. The Microsoft-registered Azure VPN client uses a different Audience value. When you update an Audience value, you must make the change on both the P2S VPN gateway, and on any previously configured VPN clients. For more information about Audience values, see [About point-to-site VPN - Microsoft Entra ID authentication](point-to-site-about.md#entra-id).

The following table shows the available supported Audience values.

[!INCLUDE [Audience values](../../includes/vpn-gateway-entra-audience-values.md)]

The examples in this article use the new Audience value for Azure Public. This article doesn't apply to **custom Audience** value configurations. To modify a custom audience app ID, see [Create or modify a custom audience app ID for P2S VPN Microsoft Entra ID authentication](point-to-site-entra-register-custom-app.md#change).

## Workflow

The standard workflow is:

1. Update P2S gateway settings.
1. Generate and download new VPN client configuration files.
1. Update the VPN client either by importing the client configuration package, or (optionally) updating the settings on the already configured VPN client.
1. Remove the old Azure VPN Client from the tenant. This step isn't required in order to make a P2S connection using the new Audience value, but it's good practice.

## <a name="gateway"></a>Update P2S gateway settings

When you update audience values on an existing gateway, you incur fewer than 5 minutes of downtime.

1. Go to the virtual network gateway. In the left pane, click **Point-to-site configuration**, then **Configure now** to open the Point-to-site configuration page.

   :::image type="content" source="./media/update-entra-audience/audience.png" alt-text="Screenshot showing settings for Tunnel type, Authentication type, and Microsoft Entra settings." lightbox="././media/update-entra-audience/audience.png":::

1. Change the **Audience** value. For this example, we changed the Audience value to the Azure Public value for the Microsoft-registered Azure VPN Client; **c632b3df-fb67-4d84-bdcf-b95ad541b5c8**.
1. Leave the other settings the same, unless you have changed tenants and need to change the tenant IDs. If you update the Issuer field, take care to include the trailing slash at the end. For more information about each of the fields, see [Microsoft Entra ID](point-to-site-entra-gateway.md#configure-vpn) values.
1. Once you finish configuring settings, click **Save** at the top of the page.
1. The new settings save to the P2S gateway and the gateway updates. This takes about 5 minutes to complete.

## <a name="client"></a>Update VPN client settings

When you make a change to a P2S gateway, you typically need to generate and download a new VPN client profile configuration package. This package contains the updated settings from the P2S VPN gateway. If you're configuring new Azure VPN Clients, you must generate this configuration package.

However, when you update only the Audience or tenant values, you have a couple of options when reconfiguring already deployed Azure VPN Clients.

* If the Azure VPN Client is already configured to connect to this P2S gateway, you can [manually update](#manual) the VPN client.

* If you've updated multiple values on the P2S gateway, or you want easily update the VPN clients by importing the new values, you can generate and download a new P2S VPN [client profile configuration package](#generate) and import it to each client.

### <a name="manual"></a>Update an Azure VPN Client

These steps help you update the Azure VPN Client manually, without using the profile configuration package.

1. Launch the Azure VPN Client app.
1. Select the VPN connection profile that you want to update.
1. Click **...**, then **Configure**.
1. Update the **Audience** field to the new Audience value. This value must match the P2S gateway value to which this client connects.
1. If you also updated the Tenant ID values, change them on the client. These values must match the P2S gateway values.
1. Click **Save** to save the settings.

### <a name="generate"></a>Update using a profile configuration package

If you want to use the VPN client profile configuration files to configure your Azure VPN Client, you can generate a profile configuration package that contains the new P2S gateway settings.

[!INCLUDE [Azure VPN client profile configuration package](../../includes/vpn-gateway-point-to-site-client-package-download.md)]

## Next steps

For more information about configuring the Azure VPN Client for Microsoft Entra ID authentication, see the following articles:

* [Azure VPN Client for Linux](point-to-site-entra-vpn-client-linux.md)
* [Azure VPN Client for Windows](point-to-site-entra-vpn-client-windows.md)
* [Azure VPN Client for macOS](point-to-site-entra-vpn-client-mac.md)