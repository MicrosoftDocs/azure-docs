---
title: Configure Azure VPN Client - Microsoft Entra ID authentication - Linux
description: Learn how to configure the Linux Azure VPN Client for Microsoft Entra ID authentication for gateways configured to use the Microsoft-registered Azure VPN Client App ID.
titleSuffix: Azure VPN Gateway
author: cherylmc
ms.service: azure-vpn-gateway
ms.custom: linux-related-content
ms.topic: how-to
ms.date: 02/10/2025
ms.author: cherylmc
# Customer intent: "As a Linux user, I want to configure the Azure VPN Client with Microsoft Entra ID authentication, so that I can securely connect to my organization's virtual network via a point-to-site VPN."
---

# Configure the Azure VPN Client – Microsoft Entra ID authentication – Linux (Preview)

This article helps you configure the Azure VPN Client on a Linux computer (Ubuntu) to connect to a virtual network using a VPN Gateway point-to-site (P2S) VPN and Microsoft Entra ID authentication. For more information about point-to-site connections, see [About Point-to-Site connections](point-to-site-about.md).

The steps in this article apply to Microsoft Entra ID authentication using the Microsoft-registered Azure VPN Client app with associated App ID and Audience values. This article doesn't apply to the older, manually registered Azure VPN Client app for your tenant. For more information, see [About point-to-site VPN - Microsoft Entra ID authentication](point-to-site-about.md#entra-id).

[!INCLUDE [Supported versions](../../includes/vpn-gateway-azure-vpn-client-linux-supported-releases.md)]

## Prerequisites

Complete the steps for the point-to-site server configuration. See [Configure a P2S VPN gateway for Microsoft Entra ID authentication](point-to-site-entra-gateway.md).

## Workflow

After your Azure VPN Gateway P2S server configuration is complete, your next steps are as follows:

1. Download and install the Azure VPN Client for Linux.
1. Import the client profile settings to the VPN client.
1. Create a connection.

## Install the Azure VPN Client

[!INCLUDE [Download the Azure VPN Client for Linux](../../includes/virtual-wan-download-azure-vpn-client-linux.md)]

## Extract the VPN client profile configuration package

To configure your Azure VPN Client profile, you download a VPN Client profile configuration package from the Azure P2S gateway. This package contains the necessary settings to configure the VPN client.

If you used the P2S server configuration steps as mentioned in the [Prerequisites](#prerequisites) section, you've already generated and downloaded the VPN client profile configuration package that contains the VPN profile configuration files you'll need. If you need to generate configuration files, see [Download the VPN client profile configuration package](point-to-site-entra-gateway.md#download).

If your P2S gateway configuration was previously configured to use the older, manually registered App ID versions, your P2S configuration doesn't support the Linux VPN client. See [About the Microsoft-registered App ID for Azure VPN Client](point-to-site-entra-gateway.md).

Locate and extract the zip file that contains the VPN client profile configuration package. The zip file contains the **AzureVPN** folder. In the AzureVPN folder, you'll see either the **azurevpnconfig_aad.xml** file, or the **azurevpnconfig.xml** file, depending on whether your P2S configuration includes multiple authentication types. The .xml file contains the settings you use to configure the VPN client profile.

## Modify profile configuration files

[!INCLUDE [custom audience steps](../../includes/vpn-gateway-entra-vpn-client-custom.md)]

## Import client profile configuration settings

[!INCLUDE [Import Azure VPN Client settings for Linux](../../includes/virtual-wan-import-azure-vpn-client-settings-linux.md)]

## Next steps

* For more information about VPN Gateway, see the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md).
* For more information about point-to-site connections, see [About Point-to-Site connections](point-to-site-about.md).
