---
title: 'Configure P2S VPN clients: certificate authentication: Azure VPN client: Windows'
titleSuffix: Azure VPN Gateway
description: Learn how to configure VPN clients for P2S configurations that use certificate authentication. This article applies to Windows and the Azure VPN client.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 05/20/2024
ms.author: cherylmc
---

# Configure Azure VPN Client for P2S certificate authentication connections - Windows

If your point-to-site (P2S) VPN gateway is configured to use OpenVPN and certificate authentication, you can connect to your virtual network using the Azure VPN Client. This article walks you through the steps to configure the **Azure VPN Client** and connect to your virtual network.

## Before you begin

Before beginning client configuration steps, verify that you're on the correct VPN client configuration article. The following table shows the configuration articles available for VPN Gateway point-to-site VPN clients. Steps differ, depending on the authentication type, tunnel type, and the client OS.

[!INCLUDE [All client articles](../../includes/vpn-gateway-vpn-client-install-articles.md)]

### Prerequisites

This article assumes that you've already performed the following prerequisites:

* You created and configured your VPN gateway for point-to-site certificate authentication and the OpenVPN tunnel type. See [Configure server settings for P2S VPN Gateway connections - certificate authentication](vpn-gateway-howto-point-to-site-resource-manager-portal.md) for steps.
* You generated and downloaded the VPN client configuration files. See [Generate VPN client profile configuration files](vpn-gateway-howto-point-to-site-resource-manager-portal.md#profile-files) for steps.
* You can either generate client certificates, or acquire the appropriate client certificates necessary for authentication.

### Connection requirements

To connect to Azure, each connecting client computer requires the following items:

* The Azure VPN Client software must be installed on each client computer.
* The Azure VPN Client profile must be configured using the downloaded **azurevpnconfig.xml** configuration file.
* The client computer must have a client certificate that's installed locally.

## Generate and install client certificates

For certificate authentication, a client certificate must be installed on each client computer. The client certificate you want to use must be exported with the private key, and must contain all certificates in the certification path. Additionally, for some configurations, you'll also need to install root certificate information.

* For information about working with certificates, see [Point-to site: Generate certificates](vpn-gateway-certificates-point-to-site.md).
* To view an installed client certificate, open **Manage User Certificates**. The client certificate is installed in **Current User\Personal\Certificates**.

### Install the client certificate

Each computer needs a client certificate in order to authenticate. If the client certificate isn't already installed on the local computer, you can install it using the following steps:

1. Locate the client certificate. For more information about client certificates, see [Install client certificates](point-to-site-how-to-vpn-client-install-azure-cert.md).
1. Install the client certificate. Typically, you can do this by double-clicking the certificate file and providing a password (if required).

## View configuration files

The VPN client profile configuration package contains specific folders. The files within the folders contain the settings needed to configure the VPN client profile on the client computer. The files and the settings they contain are specific to the VPN gateway and the type of authentication and tunnel your VPN gateway is configured to use.

Locate and unzip the VPN client profile configuration package you generated. For Certificate authentication and OpenVPN, you'll see the **AzureVPN** folder. Locate the **azurevpnconfig.xml** file. This file contains the settings you use to configure the VPN client profile.

If you don't see the file, verify the following items:

* Verify that your VPN gateway is configured to use the OpenVPN tunnel type.
* If you're using Microsoft Entra authentication, you might not have an AzureVPN folder. See the [Microsoft Entra ID](point-to-site-entra-vpn-client-windows.md) configuration article instead.

## Download the Azure VPN Client

[!INCLUDE [Download the Azure VPN client](../../includes/vpn-gateway-download-vpn-client.md)]

## Configure the Azure VPN Client profile

1. Open the Azure VPN Client.

1. Select **+** on the bottom left of the page, then select **Import**.

1. In the window, navigate to the **azurevpnconfig.xml** file. Select the file, then select **Open**.

1. On the client profile page, notice that many of the settings are already specified. The preconfigured settings are contained in the VPN client profile package that you imported. Even though most of the settings are already specified, you need to configure settings specific to the client computer.

   From the **Certificate Information** dropdown, select the name of the child certificate (the client certificate). For example, **P2SChildCert**. You can also (optionally) select a [Secondary Profile](#secondary-profile). For this exercise, select **None**.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-windows/configure-certificate.png" alt-text="Screenshot showing Azure VPN client profile configuration page." lightbox="./media/point-to-site-vpn-client-cert-windows/configure-certificate.png":::

   If you don't see a client certificate in the **Certificate Information** dropdown, you'll need to cancel and fix the issue before proceeding. It's possible that one of the following things is causing the problem:

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

Follow up with any additional server or connection settings. See [Point-to-site configuration steps](vpn-gateway-howto-point-to-site-resource-manager-portal.md).