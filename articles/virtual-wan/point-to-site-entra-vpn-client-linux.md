---
title: Configure Azure VPN Client - P2S Microsoft Entra ID authentication - Linux
titleSuffix: Azure Virtual WAN
description: Learn how to configure the Azure VPN Client for Virtual WAN P2S configurations that use Microsoft Entra ID authentication.
ms.service: azure-virtual-wan
ms.custom: linux-related-content
ms.topic: how-to
ms.date: 02/10/2025
ms.author: cherylmc
author: cherylmc
---

# Configure Azure VPN Client – Microsoft Entra ID authentication – Linux (Preview)

This article helps you configure the Azure VPN Client on a Linux computer (Ubuntu) to connect to a virtual network using a Virtual WAN User VPN (point-to-site) and Microsoft Entra ID authentication.

The steps in this article apply to Microsoft Entra ID authentication using the Microsoft-registered Azure VPN Client app with associated App ID and Audience values. This article doesn't apply to the older, manually registered Azure VPN Client app for your tenant. For more information, see [Point-to-site User VPN for Microsoft Entra ID authentication: Microsoft-registered app](point-to-site-entra-gateway.md).

## Before you begin

Verify that you are on the correct article. The following table shows the configuration articles available for Azure Virtual WAN point-to-site (P2S) VPN clients. Steps differ, depending on the authentication type, tunnel type, and the client OS.

[!INCLUDE [P2S client configuration articles](../../includes/virtual-wan-vpn-client-install-articles.md)]

## Prerequisites

This article assumes that you've already performed the following prerequisites:

* You configured a virtual WAN according to the steps in the [Configure a User VPN (P2S) gateway for Microsoft Entra ID authentication](point-to-site-entra-gateway.md) article. Your User VPN configuration must use Microsoft Entra ID (Azure Active Directory) authentication and the OpenVPN tunnel type.
* You generated and downloaded the VPN client configuration files. For steps to generate a VPN client profile configuration package, see [Download global and hub profiles](global-hub-profile.md).

### Workflow

After your Virtual WAN  server configuration is complete, your next steps are as follows:

1. Download and install the Azure VPN Client for Linux.
1. Import the client profile settings to the VPN client.
1. Create a connection.

## Install the Azure VPN Client

[!INCLUDE [Download the Azure VPN Client for Linux](../../includes/virtual-wan-download-azure-vpn-client-linux.md)]

## Extract the VPN client profile configuration package

To configure your Azure VPN Client profile, you download a VPN Client profile configuration package from the Azure P2S gateway. This package contains the necessary settings to configure the VPN client.

If your P2S gateway configuration was previously configured to use the older, manually registered App ID versions, your P2S configuration doesn't support the Linux VPN client. You'll need to change your P2S configuration to use the Microsoft-registered App ID version. For more information, see [Configure P2S User VPN for Microsoft Entra ID authentication – Microsoft-registered app](point-to-site-entra-gateway-update.md).

1. Locate and extract the zip file that contains the VPN client profile configuration package. The zip file contains the **AzureVPN** folder.
1. In the AzureVPN folder, you'll see either the **azurevpnconfig_aad.xml** file, or the **azurevpnconfig.xml** file, depending on whether your P2S configuration includes multiple authentication types. The .xml file contains the settings you use to configure the VPN client profile.

## Modify VPN profile configuration files

[!INCLUDE [custom audience steps](../../includes/vpn-gateway-entra-vpn-client-custom.md)]

## Import VPN client profile configuration settings

[!INCLUDE [Import Azure VPN Client settings for Linux](../../includes/virtual-wan-import-azure-vpn-client-settings-linux.md)]

## Next steps

For more information about Microsoft-registered Azure VPN Client, see [Configure P2S User VPN for Microsoft Entra ID authentication](point-to-site-entra-gateway.md).