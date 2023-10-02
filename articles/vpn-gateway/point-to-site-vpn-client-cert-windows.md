---
title: 'Configure P2S VPN clients - certificate authentication - Windows'
titleSuffix: Azure VPN Gateway
description: Learn how to configure VPN clients for P2S configurations that use certificate authentication. This article applies to Windows.
author: cherylmc
ms.service: vpn-gateway
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 05/04/2023
ms.author: cherylmc
---

# Configure point-to-site VPN clients: certificate authentication - Windows

This article helps you connect to your Azure virtual network (VNet) using VPN Gateway point-to-site (P2S) and **Certificate authentication**. There are multiple sets of steps in this article, depending on the tunnel type you selected for your P2S configuration, the operating system, and the VPN client that is used to connect.

When you connect to an Azure VNet using a P2S IKEv2/SSTP tunnel and certificate authentication, you can use the VPN client that is natively installed on the Windows operating system from which you’re connecting. If you use the tunnel type OpenVPN, you also have the option of using the Azure VPN Client or the OpenVPN client software. This article walks you through configuring the VPN clients.

## Before you begin

Before beginning, verify that you are on the correct article. The following table shows the configuration articles available for Azure VPN Gateway P2S VPN clients. Steps differ, depending on the authentication type, tunnel type, and the client OS.

[!INCLUDE [All client articles](../../includes/vpn-gateway-vpn-client-install-articles.md)]

>[!IMPORTANT]
>[!INCLUDE [TLS](../../includes/vpn-gateway-tls-change.md)]

## 1. Generate VPN client configuration files

All of the necessary configuration settings for the VPN clients are contained in a VPN client profile configuration zip file. You can generate client profile configuration files using PowerShell, or by using the Azure portal. Either method returns the same zip file.

The VPN client profile configuration files that you generate are specific to the P2S VPN gateway configuration for the VNet. If there are any changes to the P2S VPN configuration after you generate the files, such as changes to the VPN protocol type or authentication type, you need to generate new VPN client profile configuration files and apply the new configuration to all of the VPN clients that you want to connect. For more information about P2S connections, see [About point-to-site VPN](point-to-site-about.md).

### PowerShell

[!INCLUDE [Generate profile configuration files - PowerShell](../../includes/vpn-gateway-generate-profile-powershell.md)]

### Azure portal

[!INCLUDE [Generate profile configuration files - Azure portal](../../includes/vpn-gateway-generate-profile-portal.md)]

## 2. Generate client certificates

For certificate authentication, a client certificate must be installed on each client computer. The client certificate you want to use must be exported with the private key, and must contain all certificates in the certification path. Additionally, for some configurations, you'll also need to install root certificate information.

In many cases, you can install the client certificate directly on the client computer by double-clicking. However, for certain OpenVPN client configurations, you may need to extract information from the client certificate in order to complete the configuration.

* For information about working with certificates, see [Point-to site: Generate certificates](vpn-gateway-certificates-point-to-site.md).
* To view an installed client certificate, open **Manage User Certificates**. The client certificate is installed in **Current User\Personal\Certificates**.

## 3. Configure the VPN client

Next, configure the VPN client. Select from the following instructions:

* [IKEv2 and SSTP - native VPN client steps](#ike)
* [OpenVPN - OpenVPN client steps](#openvpn)
* [OpenVPN - Azure VPN Client steps](#azurevpn)

## <a name="ike"></a>IKEv2 and SSTP: native VPN client steps

This section helps you configure the native VPN client that's part of your Windows operating system to connect to your VNet. This configuration doesn't require additional client software.

### <a name="view-ike"></a>View configuration files

Unzip the VPN client profile configuration file to view the following folders:

* **WindowsAmd64** and **WindowsX86**, which contain the Windows 64-bit and 32-bit installer packages, respectively. The **WindowsAmd64** installer package is for all supported 64-bit Windows clients, not just Amd.
* **Generic**, which contains general information used to create your own VPN client configuration. The Generic folder is provided if IKEv2 or SSTP+IKEv2 was configured on the gateway. If only SSTP is configured, then the Generic folder isn’t present.

### <a name="install"></a>Configure VPN client profile

You can use the same VPN client configuration package on each Windows client computer, as long as the version matches the architecture for the client. For the list of client operating systems that are supported, see the point-to-site section of the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md#P2S).

>[!NOTE]
>You must have Administrator rights on the Windows client computer from which you want to connect.

1. Select the VPN client configuration files that correspond to the architecture of the Windows computer. For a 64-bit processor architecture, choose the 'VpnClientSetupAmd64' installer package. For a 32-bit processor architecture, choose the 'VpnClientSetupX86' installer package.

1. Double-click the package to install it. If you see a SmartScreen popup, click **More info**, then **Run anyway**.

1. Install the client certificate. Typically, you can do this by double-clicking the certificate file and providing a password if required. For more information, see [Install client certificates](point-to-site-how-to-vpn-client-install-azure-cert.md).

1. Connect to your VPN. Go to the **VPN** settings and locate the VPN connection that you created. It's the same name as your virtual network. Select **Connect**. A pop-up message may appear. Select **Continue** to use elevated privileges.
1. On the **Connection status** page, select **Connect** to start the connection. If you see a **Select Certificate** screen, verify that the client certificate showing is the one that you want to use to connect. If it isn't, use the drop-down arrow to select the correct certificate, and then select **OK**.

## <a name="azurevpn"></a>OpenVPN: Azure VPN Client steps

This section applies to certificate authentication configurations that use the OpenVPN tunnel type. The following steps help you download, install, and configure the Azure VPN Client to connect to your VNet. Note that these steps apply to certificate authentication. If you're using OpenVPN with Azure AD authentication, see the [Azure AD](openvpn-azure-ad-client.md) configuration article instead.

To connect, each client computer requires the following items:

* The Azure VPN Client software must be installed on each client computer that you want to connect.
* The Azure VPN Client profile must be configured using the downloaded **azurevpnconfig.xml** configuration file.
* The client computer must have a client certificate that's installed locally.

### <a name="view-azurevpn"></a>View configuration files

When you open the zip file, you'll see the **AzureVPN** folder. Locate the **azurevpnconfig.xml** file. This file contains the settings you use to configure the VPN client profile.

If you don't see the file, verify the following items:

* Verify that your VPN gateway is configured to use the OpenVPN tunnel type.
* If you're using Azure AD authentication, you may not have an AzureVPN folder. See the [Azure AD](openvpn-azure-ad-client.md) configuration article instead.

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

## <a name="openvpn"></a>OpenVPN: OpenVPN Client steps

This section applies to certificate authentication configurations that are configured to use the OpenVPN tunnel type. The following steps help you configure the **OpenVPN &reg; Protocol** client and connect to your VNet.

### <a name="view-openvpn"></a>View configuration files

When you open the VPN client configuration package zip file, you should see an OpenVPN folder. If you don't see the folder, verify the following items:

* Verify that your VPN gateway is configured to use the OpenVPN tunnel type.
* If you're using Azure AD authentication, you may not have an OpenVPN folder. See the [Azure AD](openvpn-azure-ad-client.md) configuration article instead.

[!INCLUDE [Configuration steps](../../includes/vpn-gateway-vwan-config-openvpn-windows.md)]

## Next steps

For additional steps, return to the P2S article that you were working from.

* [PowerShell configuration steps](vpn-gateway-howto-point-to-site-rm-ps.md).
* [Azure portal configuration steps](vpn-gateway-howto-point-to-site-resource-manager-portal.md).
