---
title: 'User VPN client configuration: certificate authentication - Windows'
titleSuffix: Azure Virtual WAN
description: Learn how to configure VPN clients on Windows computers for User VPN connections that use certificate authentication.
author: cherylmc
ms.service: azure-virtual-wan
ms.topic: how-to
ms.date: 02/04/2025
ms.author: cherylmc
---

# User VPN (P2S) client configuration - certificate authentication - Windows

This article helps you configure Virtual WAN User VPN clients on a Windows operating system for P2S configurations that use certificate authentication. When you connect to Virtual WAN using User VPN (P2S) and certificate authentication, you can use the VPN client that is natively installed on the operating system from which you’re connecting. If you use the tunnel type OpenVPN, you also have the additional options of using the Azure VPN Client or OpenVPN client software. All of the necessary configuration settings for the VPN clients are contained in a VPN client configuration zip file. The settings in the zip file help you easily configure VPN clients.

The VPN client configuration files that you generate are specific to the P2S User VPN gateway configuration. If there are any changes to the P2S VPN configuration after you generate the files, such as changes to the VPN protocol type or authentication type, you need to generate new VPN client configuration files and apply the new configuration to all of the VPN clients that you want to connect.

This article applies to Windows operating system clients. For more information about other VPN client configuration articles, see the following table:

[!INCLUDE [P2S client configuration articles](../../includes/virtual-wan-vpn-client-install-articles.md)]

## <a name="generate"></a>Before you begin

Before beginning, make sure you've configured a virtual WAN according to the steps in the [Create User VPN point-to-site connections](virtual-wan-point-to-site-portal.md) article. Your User VPN configuration must use certificate authentication.

## <a name="certificates"></a>1. Install client certificates

When your User VPN configuration settings are configured for certificate authentication, in order to authenticate, a client certificate must be installed on each connecting client computer. Later in this article, you specify the client certificate(s) that you install in this section. The client certificate that you install must have been exported with its private key, and must contain all certificates in the certification path.

* For steps to generate a client certificate, see [Generate and export certificates](certificates-point-to-site.md#clientcert).

* For steps to install a client certificate see [Install client certificates](install-client-certificates.md).

* To view an installed client certificate, open **Manage User Certificates**. The client certificate is installed in **Current User\Personal\Certificates**.

## <a name="generate"></a>2. Generate VPN client profile configuration files

The files contained in the profile configuration package are used to configure the VPN client and are specific to the User VPN configuration. You can generate VPN client profile configuration files using PowerShell, or by using the Azure portal. Either method returns the same zip file.

After you configure the Azure VPN Client, if you later update or change the User VPN configuration (change tunnel type, add or remove/revoke certificates, etc.), you must generate a new VPN client profile configuration package and use it to reconfigure connecting Azure VPN clients.

To generate a VPN client profile configuration package, see [Generate VPN client configuration files](virtual-wan-point-to-site-portal.md#p2sconfig).

After you generate the client profile configuration package, use the instructions below that correspond to your User VPN configuration.

* [IKEv2 and SSTP - native VPN client steps](#native)
* [OpenVPN - Azure VPN Client steps](#vpn-client)
* [OpenVPN - OpenVPN Client steps](howto-openvpn-clients.md)

## <a name="native"></a>IKEv2 and SSTP - native VPN client

If you specified the IKEv2 VPN tunnel type for the User VPN configuration, you can connect using the Windows native VPN client already installed on your computer.

1. Select the VPN client configuration files that correspond to the architecture of the Windows computer. For a 64-bit processor architecture, choose the 'VpnClientSetupAmd64' installer package. For a 32-bit processor architecture, choose the 'VpnClientSetupX86' installer package.

1. Double-click the package to install it. If you see a SmartScreen popup, select **More info**, then **Run anyway**.

1. On the client computer, go to your VPN page and select the connection that you configured. Then, click **Connect**.

## <a name="vpn-client"></a>OpenVPN - Azure VPN Client

The following steps help you download, install, and configure the Azure VPN Client to connect. This section assumes that you have already installed required [client certificates](#certificates) locally on the client computer.

> [!NOTE]
> The Azure VPN Client is only supported for OpenVPN® protocol connections. If the VPN tunnel type is not OpenVPN, use the [native VPN client](#native) that is part of the Windows operating system.
>

### View client profile config files

When you open the zip file, you'll see the **AzureVPN** folder. Locate the **azurevpnconfig.xml** file. This file contains the settings you use to configure the VPN client profile. If you don't see the file, verify the following items:

* Verify that your User VPN gateway is configured to use the OpenVPN tunnel type.
* If you're using Microsoft Entra authentication, you may not have an AzureVPN folder. See the [Microsoft Entra ID](openvpn-azure-ad-client.md) configuration article instead.

For more information about User VPN client profile files, see [Working with User VPN client profile files](about-vpn-profile-download.md).

### Download the Azure VPN Client

[!INCLUDE [Download the Azure VPN client](../../includes/vpn-gateway-download-vpn-client.md)]

### Configure the Azure VPN Client

[!INCLUDE [Configure the Azure VPN client](../../includes/vpn-gateway-vwan-configure-azure-vpn-client-certificate.md)]

## Next steps

To modify additional P2S User VPN connection settings, see [Tutorial: Create a P2S User VPN connection](virtual-wan-point-to-site-portal.md).
