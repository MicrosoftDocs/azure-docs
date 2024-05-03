---
title: 'Configure P2S VPN clients: certificate authentication: Azure VPN client: Windows'
titleSuffix: Azure VPN Gateway
description: Learn how to configure VPN clients for P2S configurations that use certificate authentication. This article applies to Windows and the Azure VPN client.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 01/31/2024
ms.author: cherylmc
---

# Configure Azure VPN client for P2S certificate authentication connections - Windows

If your point-to-site (P2S) VPN gateway is configured to use OpenVPN and certificate authentication, you can connect to your virtual network using the Azure VPN Client or the OpenVPN client. This article walks you through the steps to configure the **Azure VPN Client** and connect to your virtual network.

## Before you begin

This article assumes that you've already performed the following prerequisites:

* You created and configured your VPN gateway for point-to-site certificate authentication and the OpenVPN tunnel type. See [Configure server settings for P2S VPN Gateway connections - certificate authentication](vpn-gateway-howto-point-to-site-resource-manager-portal.md) for steps.
* You generated client certificates and downloaded the VPN client configuration files. See [Point-to-site VPN clients: certificate authentication - Windows ](point-to-site-vpn-client-cert-windows.md)

Before beginning client configuration steps, verify that you're on the correct VPN client configuration article. The following table shows the configuration articles available for VPN Gateway point-to-site VPN clients. Steps differ, depending on the authentication type, tunnel type, and the client OS.

[!INCLUDE [All client articles](../../includes/vpn-gateway-vpn-client-install-articles.md)]

### Connection requirements

To connect to Azure, each connecting client computer requires the following items:

* The Azure VPN Client software must be installed on each client computer.
* The Azure VPN Client profile must be configured using the downloaded **azurevpnconfig.xml** configuration file.
* The client computer must have a client certificate that's installed locally.

## View configuration files

The VPN client profile configuration package contains specific folders. The files within the folders contain the settings needed to configure the VPN client profile on the client computer. The files and the settings they contain are specific to the VPN gateway and the type of authentication and tunnel your VPN gateway is configured to use.

Locate and unzip the VPN client profile configuration package you generated. For Certificate authentication and OpenVPN, you'll see the **AzureVPN** folder. Locate the **azurevpnconfig.xml** file. This file contains the settings you use to configure the VPN client profile.

If you don't see the file, verify the following items:

* Verify that your VPN gateway is configured to use the OpenVPN tunnel type.
* If you're using Microsoft Entra authentication, you might not have an AzureVPN folder. See the [Microsoft Entra ID](openvpn-azure-ad-client.md) configuration article instead.

## Download the Azure VPN Client

[!INCLUDE [Download the Azure VPN client](../../includes/vpn-gateway-download-vpn-client.md)]

## Configure the Azure VPN Client profile

1. Open the Azure VPN Client.

1. Select **+** on the bottom left of the page, then select **Import**.

1. In the window, navigate to the **azurevpnconfig.xml** file, select it, then select **Open**.

1. From the **Certificate Information** dropdown, select the name of the child certificate (the client certificate). For example, **P2SChildCert**. You can also (optionally) select a [Secondary Profile](#secondary-profile).

   :::image type="content" source="./media/point-to-site-vpn-client-cert-windows/configure-certificate.png" alt-text="Screenshot showing Azure VPN client profile configuration page." lightbox="./media/point-to-site-vpn-client-cert-windows/configure-certificate.png":::

   If you don't see a client certificate in the **Certificate Information** dropdown, you'll need to cancel and fix the issue before proceeding. It's possible that one of the following things is true:

   * The client certificate isn't installed locally on the client computer.
   * There are multiple certificates with exactly the same name installed on your local computer (common in test environments).
   * The child certificate is corrupt.

1. After the import validates (imports with no errors), select **Save**.

1. In the left pane, locate the **VPN connection**, then select **Connect**.

### Optional settings for the Azure VPN Client

The following sections discuss optional configuration settings that are available for the Azure VPN Client.

#### Secondary Profile

[!INCLUDE [Secondary profile](../../includes/vpn-gateway-azure-vpn-client-secondary-profile.md)]

#### Custom settings: DNS and routing

You can configure the Azure VPN Client with optional configuration settings such as more DNS servers, custom DNS, forced tunneling, custom routes, and other settings. For a description of the available settings and configuration steps, see [Azure VPN Client optional settings](azure-vpn-client-optional-configurations.md).

## Next steps

[Point-to-site configuration steps](vpn-gateway-howto-point-to-site-resource-manager-portal.md)
[Point-to-site VPN clients: certificate authentication - Windows ](point-to-site-vpn-client-cert-windows.md)
