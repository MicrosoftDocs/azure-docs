---
title: 'Configure P2S VPN clients - certificate authentication - Windows'
titleSuffix: Azure VPN Gateway
description: Learn how to configure VPN clients for P2S configurations that use certificate authentication. This article applies to Windows.
author: cherylmc
ms.service: vpn-gateway
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 01/25/2024
ms.author: cherylmc
---

# Configure point-to-site VPN clients: certificate authentication - Windows

This article walks you through the necessary steps to configure VPN clients for point-to-site (P2S) virtual network connections that use certificate authentication. These steps continue on from previous articles where the [VPN Gateway point-to-site](vpn-gateway-howto-point-to-site-resource-manager-portal.md) server settings are configured.

There are multiple sets of steps in this article, depending on the tunnel type you selected for your P2S configuration, and the VPN client that is used to connect.

## Before you begin

This article assumes that you have already created and configured your VPN gateway for P2S certificate authentication. See [Configure server settings for P2S VPN Gateway connections - certificate authentication](vpn-gateway-howto-point-to-site-resource-manager-portal.md) for steps.

Before beginning the workflow, verify that you're on the correct article. The following table shows the configuration articles available for Azure VPN Gateway P2S VPN clients. Steps differ, depending on the authentication type, tunnel type, and the client OS.

[!INCLUDE [All client articles](../../includes/vpn-gateway-vpn-client-install-articles.md)]

## Workflow

In this article, we start with generating VPN client configuration files and client certificates:

1. [Generate files to configure the VPN client](#1-generate-vpn-client-configuration-files).
1. [Generate certificates for the VPN client](#2-generate-client-certificates).
1. [Configure the VPN client](#3-configure-the-vpn-client). The steps you use to configure your VPN client depend on the tunnel type for your P2S VPN gateway, and the VPN client on the client computer.

   * **IKEv2 and SSTP - native VPN client steps** -  If your P2S VPN gateway is configured to use IKEv2/SSTP and certificate authentication, you can connect to your VNet using the native VPN client that's part of your Windows operating system. This configuration doesn't require additional client software. For steps, see [IKEv2 and SSTP - native VPN client](point-to-site-vpn-client-certificate-windows-native.md).
   * **OpenVPN** - If your P2S VPN gateway is configured to use an OpenVPN tunnel and certificate authentication, you have the option of using either the [Azure VPN Client](#openvpn), or the [OpenVPN client](#azurevpn) steps in this article.

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

* [IKEv2 and SSTP - native VPN client steps](point-to-site-vpn-client-certificate-windows-native.md)
* [OpenVPN - OpenVPN client steps](#openvpn)
* [OpenVPN - Azure VPN Client steps](#azurevpn)

## <a name="azurevpn"></a>Azure VPN Client steps - OpenVPN

If your P2S VPN gateway is configured to use an OpenVPN tunnel type and certificate authentication, you can connect using the Azure VPN Client.

The following steps help you download, install, and configure the Azure VPN Client to connect to your VNet. Note that these steps apply to certificate authentication. If you're using OpenVPN with Microsoft Entra authentication, see the [Microsoft Entra ID](openvpn-azure-ad-client.md) configuration article instead.

To connect, each client computer requires the following items:

* The Azure VPN Client software must be installed on each client computer that you want to connect.
* The Azure VPN Client profile must be configured using the downloaded **azurevpnconfig.xml** configuration file.
* The client computer must have a client certificate that's installed locally.

### <a name="view-azurevpn"></a>View configuration files

When you open the zip file, you'll see the **AzureVPN** folder. Locate the **azurevpnconfig.xml** file. This file contains the settings you use to configure the VPN client profile.

If you don't see the file, verify the following items:

* Verify that your VPN gateway is configured to use the OpenVPN tunnel type.
* If you're using Microsoft Entra authentication, you might not have an AzureVPN folder. See the [Microsoft Entra ID](openvpn-azure-ad-client.md) configuration article instead.

### Download the Azure VPN Client

[!INCLUDE [Download the Azure VPN client](../../includes/vpn-gateway-download-vpn-client.md)]

### Configure the VPN client profile

1. Open the Azure VPN Client.

1. Click **+** on the bottom left of the page, then select **Import**.

1. In the window, navigate to the **azurevpnconfig.xml** file, select it, then click **Open**.

1. From the **Certificate Information** dropdown, select the name of the child certificate (the client certificate). For example, **P2SChildCert**. You can also (optionally) select a [Secondary Profile](#secondary-profile).

   :::image type="content" source="./media/point-to-site-vpn-client-cert-windows/configure-certificate.png" alt-text="Screenshot showing Azure VPN client profile configuration page." lightbox="./media/point-to-site-vpn-client-cert-windows/configure-certificate.png":::

   If you don't see a client certificate in the **Certificate Information** dropdown, you'll need to cancel and fix the issue before proceeding. It's possible that one of the following things is true:

   * The client certificate isn't installed locally on the client computer.
   * There are multiple certificates with exactly the same name installed on your local computer (common in test environments).
   * The child certificate is corrupt.

1. After the import validates (imports with no errors), click **Save**.

1. In the left pane, locate the **VPN connection**, then click **Connect**.

### Optional settings for the Azure VPN Client

The following sections discuss additional optional configuration settings that are available for the Azure VPN Client.

#### Secondary Profile

[!INCLUDE [Secondary profile](../../includes/vpn-gateway-azure-vpn-client-secondary-profile.md)]

#### Custom settings: DNS and routing

You can configure the Azure VPN Client with optional configuration settings such as additional DNS servers, custom DNS, forced tunneling, custom routes, and other additional settings. For a description of the available settings and configuration steps, see [Azure VPN Client optional settings](azure-vpn-client-optional-configurations.md).

## <a name="openvpn"></a>OpenVPN Client steps - OpenVPN

If your P2S VPN gateway is configured to use an OpenVPN tunnel type and certificate authentication, you can connect using an OpenVPN client. The following steps help you configure the **OpenVPN &reg; Protocol** client and connect to your VNet.

### <a name="view-openvpn"></a>View configuration files

When you open the VPN client configuration package zip file, you should see an OpenVPN folder. If you don't see the folder, verify the following items:

* Verify that your VPN gateway is configured to use the OpenVPN tunnel type.
* If you're using Microsoft Entra authentication, you might not have an OpenVPN folder. See the [Microsoft Entra ID](openvpn-azure-ad-client.md) configuration article instead.

[!INCLUDE [Configuration steps](../../includes/vpn-gateway-vwan-config-openvpn-windows.md)]

## Next steps

For additional steps, return to the P2S article that you were working from.

* [PowerShell configuration steps](vpn-gateway-howto-point-to-site-rm-ps.md).
* [Azure portal configuration steps](vpn-gateway-howto-point-to-site-resource-manager-portal.md).
