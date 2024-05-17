---
title: 'Configure P2S VPN clients - certificate authentication workflow - Windows'
titleSuffix: Azure VPN Gateway
description: Learn about the workflow to configure VPN clients for P2S configurations that use certificate authentication. In this article, you generate the client configuration package and install client certificates. This article applies to clients running Windows.
author: cherylmc
ms.service: vpn-gateway
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 03/20/2024
ms.author: cherylmc
---

# Point-to-site VPN client configuration workflow: Certificate authentication - Windows

This article walks you through the workflow and steps to configure VPN clients for point-to-site (P2S) virtual network connections that use certificate authentication. These steps continue on from previous articles where the [VPN Gateway point-to-site](vpn-gateway-howto-point-to-site-resource-manager-portal.md) server settings are configured. In this article, you'll generate the client configuration files and install the necessary client certificates used for authentication.

## Before you begin

This article assumes that you have already created and configured your VPN gateway for P2S certificate authentication. See [Configure server settings for P2S VPN Gateway connections - certificate authentication](vpn-gateway-howto-point-to-site-resource-manager-portal.md) for steps.

Before beginning the workflow, verify that you're on the correct article. The following table shows the configuration articles available for Azure VPN Gateway P2S VPN clients. Steps differ, depending on the authentication type, tunnel type, and the client OS.

[!INCLUDE [All client articles](../../includes/vpn-gateway-vpn-client-install-articles.md)]

## Workflow

In this article, we start with generating VPN client configuration files and client certificates:

1. [Generate files to configure the VPN client](#1-generate-vpn-client-configuration-files).
1. [Generate certificates for the VPN client](#2-generate-client-certificates).
1. [Configure the VPN client](#3-configure-the-vpn-client). The steps you use to configure your VPN client depend on the tunnel type for your P2S VPN gateway, and the VPN client on the client computer. Links are provided to configuration articles for the specific tunnel and corresponding client.

   * **IKEv2 and SSTP - native VPN client** -  If your P2S VPN gateway is configured to use IKEv2/SSTP and certificate authentication, you connect to your VNet using the native VPN client that's part of your Windows operating system. This configuration doesn't require additional client software. For steps, see [IKEv2 and SSTP - native VPN client](point-to-site-vpn-client-certificate-windows-native.md).
   * **OpenVPN - Azure VPN Client and OpenVPN client** - If your P2S VPN gateway is configured to use an OpenVPN tunnel and certificate authentication, you have the option to connect using either the [Azure VPN Client](point-to-site-vpn-client-certificate-windows-azure-vpn-client.md), or the [OpenVPN client](point-to-site-vpn-client-certificate-windows-openvpn-client.md).

## 1. Generate VPN client configuration files

All of the necessary configuration settings for the VPN clients are contained in a VPN client profile configuration zip file. You can generate client profile configuration files using PowerShell, or by using the Azure portal. Either method returns the same zip file.

The VPN client profile configuration files that you generate are specific to the P2S VPN gateway configuration for the VNet. If there are any changes to the P2S VPN configuration after you generate the files, such as changes to the VPN protocol type or authentication type, you need to generate new VPN client profile configuration files and apply the new configuration to all of the VPN clients that you want to connect. For more information about P2S connections, see [About point-to-site VPN](point-to-site-about.md).

### PowerShell

[!INCLUDE [Generate profile configuration files - PowerShell](../../includes/vpn-gateway-generate-profile-powershell.md)]

### Azure portal

[!INCLUDE [Generate profile configuration files - Azure portal](../../includes/vpn-gateway-generate-profile-portal.md)]

## 2. Generate client certificates

For certificate authentication, a client certificate must be installed on each client computer. The client certificate you want to use must be exported with the private key, and must contain all certificates in the certification path. Additionally, for some configurations, you'll also need to install root certificate information.

In many cases, you can install the client certificate directly on the client computer by double-clicking. However, for certain OpenVPN client configurations, you might need to extract information from the client certificate in order to complete the configuration.

* For information about working with certificates, see [Point-to site: Generate certificates](vpn-gateway-certificates-point-to-site.md).
* To view an installed client certificate, open **Manage User Certificates**. The client certificate is installed in **Current User\Personal\Certificates**.

## 3. Configure the VPN client

Next, configure the VPN client. Select from the following instructions:

|Tunnel | VPN client |
|---|---|
| IKEv2 and SSTP | [Native VPN client steps](point-to-site-vpn-client-certificate-windows-native.md)|
| OpenVPN | [Azure VPN Client steps](point-to-site-vpn-client-certificate-windows-azure-vpn-client.md)|
| OpenVPN | [OpenVPN Client steps](point-to-site-vpn-client-certificate-windows-openvpn-client.md) |


## Next steps

For additional steps, return to the P2S article that you were working from.

* [PowerShell configuration steps](vpn-gateway-howto-point-to-site-rm-ps.md).
* [Azure portal configuration steps](vpn-gateway-howto-point-to-site-resource-manager-portal.md).
