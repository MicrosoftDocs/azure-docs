---
title: 'Configure P2S VPN clients: certificate authentication: Azure VPN client: Windows'
titleSuffix: Azure VPN Gateway
description: Learn how to configure VPN clients for P2S configurations that use certificate authentication. This article applies to Windows and the Azure VPN client.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 07/03/2025
ms.author: cherylmc
---

# Configure Azure VPN Client for P2S certificate authentication connections - Windows

If your point-to-site (P2S) VPN gateway is configured to use OpenVPN and certificate authentication, you can connect to your virtual network using the Azure VPN Client. This article walks you through the steps to configure the **Azure VPN Client** and connect to your virtual network.

## Before you begin

Before beginning client configuration steps, verify that you're on the correct VPN client configuration article. The following table shows the configuration articles available for VPN Gateway point-to-site VPN clients. Steps differ, depending on the authentication type, tunnel type, and the client OS.

[!INCLUDE [All client articles](../../includes/vpn-gateway-vpn-client-install-articles.md)]

### Prerequisites

This article assumes that you already completed the following prerequisites:

* You created and configured your VPN gateway for point-to-site certificate authentication and the OpenVPN tunnel type. See [Configure server settings for P2S VPN Gateway connections - certificate authentication](point-to-site-certificate-gateway.md) for steps.
* You generated and downloaded the VPN client configuration files. See [Generate VPN client profile configuration files](point-to-site-certificate-gateway.md#profile-files) for steps.
* You can either generate client certificates, or acquire the appropriate client certificates necessary for authentication.

[!INCLUDE [Supported Windows versions](../../includes/vpn-gateway-vwan-azure-vpn-client-windows-supported.md)]

### Connection requirements

To connect to Azure, each connecting client computer requires the following items:

* The Azure VPN Client software must be installed on each client computer.
* The Azure VPN Client profile is configured using the settings contained in the downloaded **azurevpnconfig.xml** or **azurevpnconfig_cert.xml** configuration file.
* The client computer must have a client certificate installed locally.

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

Locate and unzip the VPN client profile configuration package you generated. For Certificate authentication and OpenVPN, you'll see the **AzureVPN** folder. In this folder, you'll see either the **azurevpnconfig_cert.xml** file or the **azurevpnconfig.xml** file, depending on whether your P2S configuration includes multiple authentication types. The .xml file contains the settings you use to configure the VPN client profile.

If you don't see either file, or you don't have an **AzureVPN** folder, verify that your VPN gateway is configured to use the OpenVPN tunnel type and that certificate authentication is selected.

## Download the Azure VPN Client

The features and settings that are available for the Azure VPN Client are dependent on the version of the client that you're using. For information about Azure VPN Client versions, see the [Azure VPN Client versions](azure-vpn-client-versions.md) article.

[!INCLUDE [Download the Azure VPN client](../../includes/vpn-gateway-download-vpn-client.md)]

## Configure the Azure VPN Client and connect

[!INCLUDE [Configure the Azure VPN client profile](../../includes/vpn-gateway-vwan-configure-azure-vpn-client-certificate.md)]

If you experience connection issues, if you're running the v4.0.0.0 version of the Azure VPN Client or later, you can click the **...** at the bottom of the Azure VPN Client page and select **Prerequisites**. On the **Test Application Prerequisites** page, select **Run Prerequisites Test**. Fix any issues and try connecting again. For more information, see [Azure VPN Client prerequisites check](azure-vpn-client-prerequisites-check.md).

[!INCLUDE [Work with profiles](../../includes/vpn-gateway-vwan-azure-vpn-client-certificate-windows.md)]

### <a name="secondary"></a>Configure a secondary profile

[!INCLUDE [Secondary profile](../../includes/vpn-gateway-azure-vpn-client-secondary-profile.md)]

## Working with connections

### <a name="autoconnect"></a>To connect automatically

These steps help you configure your connection to connect automatically with Always-on.

1. On the home page for your VPN client, select **VPN Settings**. If you see the switch apps dialogue box, select **Yes**.

   :::image type="content" source="../../includes/media/vpn-gateway-vwan-azure-vpn-client-entra-windows/vpn-settings.png" alt-text="Screenshot of the VPN home page with VPN Settings selected." lightbox="../../includes/media/vpn-gateway-vwan-azure-vpn-client-entra-windows/vpn-settings.png":::

1. If the profile that you want to configure is connected, disconnect the connection, then highlight the profile and select the **Connect automatically** check box.

   :::image type="content" source="../../includes/media/vpn-gateway-vwan-azure-vpn-client-entra-windows/automatic.png" alt-text="Screenshot of the Settings window, with the Connect automatically box checked." lightbox="../../includes/media/vpn-gateway-vwan-azure-vpn-client-entra-windows/automatic.png":::

1. Select **Connect** to initiate the VPN connection.

### <a name="diagnose"></a>Diagnose connection issues

#### Prerequisites check

If your Azure VPN Client is version 4.0.0.0 or later, you can run a prerequisites check to verify that your computer has the necessary items configured and installed in order to successfully connect. To view the version number of an installed Azure VPN Client, launch the client and select **Help**.

1. Click the **...** at the bottom of the Azure VPN Client page and select **Prerequisites**.
1. On the **Test Application Prerequisites** page, select **Run Prerequisites Test**.
1. Fix any issues and try connecting again. For more information, see [Azure VPN Client prerequisites check](azure-vpn-client-prerequisites-check.md).

#### Diagnostics tool

1. Select the **...** next to the VPN connection that you want to diagnose to reveal the menu. Then select **Diagnose**.
1. On the **Connection Properties** page, select **Run Diagnostics**. If asked, sign in with your credentials, then view the results.

   :::image type="content" source="../../includes/media/vpn-gateway-vwan-azure-vpn-client-entra-windows/diagnose.png" alt-text="Screenshot of the ellipsis and Diagnose selected." lightbox="../../includes/media/vpn-gateway-vwan-azure-vpn-client-entra-windows/diagnose.png":::

## Custom settings: DNS and routing

You can configure the Azure VPN Client with optional configuration settings such as more DNS servers, custom DNS, forced tunneling, custom routes, and other settings. For a description of the available settings and configuration steps, see [Azure VPN Client optional settings](azure-vpn-client-optional-configurations.md).

## Next steps

Follow up with any additional server or connection settings. See [Point-to-site configuration steps](point-to-site-certificate-gateway.md).