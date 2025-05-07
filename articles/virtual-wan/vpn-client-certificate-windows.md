---
title: 'Configure User VPN clients: certificate authentication: Azure VPN client: Windows'
titleSuffix: Azure Virtual WAN
description: Learn how to configure the Azure VPN Client on a Windows operating system for P2S configurations that use certificate authentication.
author: cherylmc
ms.service: azure-virtual-wan
ms.topic: how-to
ms.date: 03/20/2025
ms.author: cherylmc
---

# Configure Azure VPN Client for User VPN P2S certificate authentication connections - Windows

If your User VPN point-to-site (P2S) VPN gateway is configured to use OpenVPN and certificate authentication, you can connect to your virtual network using the Azure VPN Client. This article walks you through the steps to configure the **Azure VPN Client** and connect to your virtual network.

This article applies to Windows operating system clients. For more information about other VPN client configuration articles, see the following table:

## Before you begin

Before beginning client configuration steps, verify that you're on the correct VPN client configuration article. The following table shows the configuration articles available for Virtual WAN point-to-site VPN clients. Steps differ, depending on the authentication type, tunnel type, and the client OS.

[!INCLUDE [P2S client configuration articles](../../includes/virtual-wan-vpn-client-install-articles.md)]

### Prerequisites

This article assumes that you've already performed the following prerequisites:

* You configured a virtual WAN according to the steps in the [Create User VPN point-to-site connections](virtual-wan-point-to-site-portal.md) article. Your User VPN configuration must use certificate authentication and the OpenVPN tunnel type.
* You generated and downloaded the VPN client configuration files. For steps to generate a VPN client profile configuration package, see [Generate VPN client configuration files](virtual-wan-point-to-site-portal.md#download).
* You can either generate client certificates, or acquire the appropriate client certificates necessary for authentication.

### Workflow

The workflow for this article is as follows:

1. Generate and install client certificates if you haven't already done so.
1. View the VPN client profile configuration files contained in the VPN client profile configuration package that you generated.
1. Configure the Azure VPN Client.
1. Connect to Azure.

## <a name="certificates"></a>Install client certificates

When your User VPN configuration settings are configured for certificate authentication, in order to authenticate, a client certificate must be installed on each connecting client computer. Later in this article, you specify the client certificates that you install in this section. The client certificate that you install must have been exported with its private key, and must contain all certificates in the certification path.

* For steps to generate a client certificate, see [Generate and export certificates](certificates-point-to-site.md#clientcert).

* For steps to install a client certificate see [Install client certificates](install-client-certificates.md).

* To view an installed client certificate, open **Manage User Certificates**. The client certificate is installed in **Current User\Personal\Certificates**.

## <a name="generate"></a>View configuration files

The VPN client profile configuration package contains specific folders. The files within the folders contain the settings needed to configure the VPN client profile on the client computer. The files and the settings they contain are specific to the P2S VPN gateway and the type of authentication and tunnel your VPN gateway is configured to use.

Locate and unzip the VPN client profile configuration package you generated. For Certificate authentication and OpenVPN, you'll see the **AzureVPN** folder. In this folder, you'll see either the **azurevpnconfig_cert.xml** file or the **azurevpnconfig.xml** file, depending on whether your P2S configuration includes multiple authentication types. The .xml file contains the settings you use to configure the VPN client profile.

If you don't see either file, or you don't have an **AzureVPN** folder, verify that your VPN gateway is configured to use the OpenVPN tunnel type and that certificate authentication is selected.

## Download the Azure VPN Client

The features and settings that are available for the Azure VPN Client are dependent on the version of the client that you're using. For information about Azure VPN Client versions, see the [Azure VPN Client versions](azure-vpn-client-versions.md) article.

[!INCLUDE [Download the Azure VPN client](../../includes/vpn-gateway-download-vpn-client.md)]

## Configure the Azure VPN Client and connect

[!INCLUDE [Configure the Azure VPN client](../../includes/vpn-gateway-vwan-configure-azure-vpn-client-certificate.md)]

[!INCLUDE [Work with profiles](../../includes/vpn-gateway-vwan-azure-vpn-client-certificate-windows.md)]

## Working with connections

### <a name="autoconnect"></a>Connect automatically

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

## Configure custom settings: DNS and routing

You can configure the Azure VPN Client with optional configuration settings such as more DNS servers, custom DNS, forced tunneling, custom routes, and other settings. For a description of the available settings and configuration steps, see [Azure VPN Client optional settings](azure-vpn-client-optional-configurations.md).

## Next steps

To modify additional P2S User VPN connection settings, see [Tutorial: Create a P2S User VPN connection](virtual-wan-point-to-site-portal.md).
