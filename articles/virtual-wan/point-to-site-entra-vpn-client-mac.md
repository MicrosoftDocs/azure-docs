---
title: Configure Azure VPN Client - P2S Microsoft Entra ID authentication - macOS
titleSuffix: Azure Virtual WAN
description: Learn how to configure the Azure VPN Client on macOS for Virtual WAN P2S configurations that use Microsoft Entra ID authentication.
ms.service: azure-virtual-wan
ms.topic: how-to
ms.date: 03/07/2025
ms.author: cherylmc
author: cherylmc
---

# Configure Azure VPN Client - Microsoft Entra ID authentication - macOS

This article helps you configure your macOS client computer to connect to an Azure virtual network using a Virtual WAN User VPN point-to-site (P2S) connection. These steps apply to Azure VPN gateways configured for Microsoft Entra ID authentication. Microsoft Entra ID authentication only supports OpenVPN® protocol connections and requires the Azure VPN Client. The Azure VPN client for macOS is currently not available in France and China due to local regulations and requirements.

## Before you begin

Verify that you are on the correct article. The following table shows the configuration articles available for Azure Virtual WAN point-to-site (P2S) VPN clients. Steps differ, depending on the authentication type, tunnel type, and the client OS.

[!INCLUDE [P2S client configuration articles](../../includes/virtual-wan-vpn-client-install-articles.md)]

## Prerequisites

This article assumes that you've already performed the following prerequisites:

* You configured a virtual WAN according to the steps in the [Configure a User VPN (P2S) gateway for Microsoft Entra ID authentication](point-to-site-entra-gateway.md) article. Your User VPN configuration must use Microsoft Entra ID (Azure Active Directory) authentication and the OpenVPN tunnel type.
* You generated and downloaded the VPN client configuration files. For steps to generate a VPN client profile configuration package, see [Download global and hub profiles](global-hub-profile.md).

[!INCLUDE [Supported OS, processors, Rosetta software](../../includes/vpn-gateway-vwan-macos-prerequisites-vpn-client-include.md)]

[!INCLUDE [Configuration steps](../../includes/vpn-gateway-vwan-entra-vpn-client-mac.md)]

## Optional client configuration settings

You can configure the Azure VPN Client with optional configuration settings such as additional DNS servers, custom DNS, forced tunneling, custom routes, and other additional settings. For a description of the available optional settings and configuration steps, see [Azure VPN Client optional settings](azure-vpn-client-optional-configurations.md).

## Next steps

For more information about Microsoft-registered Azure VPN Client, see [Configure P2S User VPN for Microsoft Entra ID authentication](point-to-site-entra-gateway.md).