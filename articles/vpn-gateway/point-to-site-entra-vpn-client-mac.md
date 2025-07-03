---
title: 'Configure P2S Azure VPN Client - Microsoft Entra ID authentication - macOS'
description: Learn how to configure macOS client computers to connect to Azure using the Azure VPN Client. These steps are for gateways configured to use Microsoft Entra ID authentication.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 02/10/2025
ms.author: cherylmc
# Customer intent: "As a macOS user, I want to configure my client to connect to Azure using P2S VPN with Microsoft Entra ID authentication, so that I can securely access the Azure virtual network."
---

# Configure Azure VPN Client – Microsoft Entra ID authentication – macOS

This article helps you configure your macOS client computer to connect to an Azure virtual network using a VPN Gateway point-to-site (P2S) connection. These steps apply to Azure VPN gateways configured for Microsoft Entra ID authentication. Microsoft Entra ID authentication only supports OpenVPN® protocol connections and requires the Azure VPN Client. The Azure VPN client for macOS is currently not available in France and China due to local regulations and requirements.

## Prerequisites

Make sure you have the following prerequisites before you proceed with the steps in this article:

* Configure your VPN gateway for point-to-site VPN connections that specify Microsoft Entra ID authentication. See [Configure a P2S VPN gateway for Microsoft Entra ID authentication](point-to-site-entra-gateway.md).

[!INCLUDE [Supported OS, processors, Rosetta software](../../includes/vpn-gateway-vwan-macos-prerequisites-vpn-client-include.md)]

[!INCLUDE [Configuration steps](../../includes/vpn-gateway-vwan-entra-vpn-client-mac.md)]

## Optional client configuration settings

You can configure the Azure VPN Client with optional configuration settings such as additional DNS servers, custom DNS, forced tunneling, custom routes, and other additional settings. For a description of the available optional settings and configuration steps, see [Azure VPN Client optional settings](azure-vpn-client-optional-configurations.md).

## Next steps

For more information, see [Configure P2S VPN Gateway for Microsoft Entra ID authentication](point-to-site-entra-gateway.md).
