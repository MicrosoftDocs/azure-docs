---
title: 'Configure P2S VPN clients -certificate authentication - Windows'
titleSuffix: Azure VPN Gateway
description: Learn how to configure VPN clients for P2S configurations that use certificate authentication. This article applies to Windows.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 10/12/2022
ms.author: cherylmc
---

# Configure point-to-site VPN clients - certificate authentication - Windows

When you connect to an Azure virtual network (VNet) using point-to-site (P2S) and certificate authentication, you can use the VPN client that is natively installed on the operating system from which you’re connecting. If you use the tunnel type OpenVPN, you also have the option of using the Azure VPN Client or the OpenVPN client software. All of the necessary configuration settings for the VPN clients are contained in a VPN client configuration zip file. The settings in the zip file help you easily configure the VPN clients.

The VPN client configuration files that you generate are specific to the P2S VPN gateway configuration for the VNet. If there are any changes to the P2S VPN configuration after you generate the files, such as changes to the VPN protocol type or authentication type, you need to generate new VPN client configuration files and apply the new configuration to all of the VPN clients that you want to connect. For more information about P2S connections, see [About point-to-site VPN](point-to-site-about.md).

## <a name="generate"></a>Before you begin

Before beginning, verify that you are on the correct article. The following table shows the configuration articles available for Azure VPN Gateway P2S VPN clients. Steps differ, depending on the authentication type, tunnel type, and the client OS.

[!INCLUDE [All client articles](../../includes/vpn-gateway-vpn-client-install-articles.md)]

>[!IMPORTANT]
>[!INCLUDE [TLS](../../includes/vpn-gateway-tls-change.md)]

## <a name="certificates"></a>1. Install certificates

A client certificate is required for authentication when using the Azure certificate authentication type. A client certificate must be installed on each client computer. The exported client certificate must be exported with the private key, and must contain all certificates in the certification path.

* For information about client certificates, see [Point-to site: generate certificates](vpn-gateway-howto-point-to-site-resource-manager-portal.md#generatecert).
* To view an installed client certificate, open **Manage User Certificates**. The client certificate is installed in **Current User\Personal\Certificates**.

## <a name="generate"></a>2. Generate VPN client configuration files

You can generate VPN client profile configuration files using PowerShell, or by using the Azure portal. Either method returns the same zip file.

### <a name="zip-portal"></a>Generate files using the Azure portal

1. In the Azure portal, navigate to the virtual network gateway for the VNet that you want to connect to.

1. On the virtual network gateway page, select **Point-to-site configuration** to open the Point-to-site configuration page.

1. At the top of the Point-to-site configuration page, select **Download VPN client**. This doesn't download VPN client software, it generates the configuration package used to configure VPN clients. It takes a few minutes for the client configuration package to generate. During this time, you may not see any indications until the packet has generated.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-windows/download-configuration.png" alt-text="Download the VPN client configuration." lightbox="./media/point-to-site-vpn-client-cert-windows/download-configuration.png":::

1. Once the configuration package has been generated, your browser indicates that a client configuration zip file is available. It's named the same name as your gateway. The folders and files that the zip file contains depend on the settings that you selected when creating your P2S configuration.

1. For next steps, depending on your P2S configuration, go to one of the following sections:

   * [IKEv2 and SSTP - native client steps](#ike)
   * [OpenVPN - OpenVPN client steps](#openvpn)
   * [OpenVPN - Azure VPN client steps](#azurevpn)

### <a name="zip-powershell"></a>Generate files using PowerShell

1. When generating VPN client configuration files, the value for '-AuthenticationMethod' is 'EapTls'. Generate the VPN client configuration files using the following command:

   ```azurepowershell-interactive
   $profile=New-AzVpnClientConfiguration -ResourceGroupName "TestRG" -Name "VNet1GW" -AuthenticationMethod "EapTls"

   $profile.VPNProfileSASUrl
   ```

1. Copy the URL to your browser to download the zip file. The folders and files that the zip file contains depend on the settings that you selected when creating your P2S configuration.

1. For next steps, depending on your P2S configuration, go to one of the following sections:

   * [IKEv2 and SSTP - native VPN client steps](#ike)
   * [OpenVPN - OpenVPN client steps](#openvpn)
   * [OpenVPN - Azure VPN Client steps](#azurevpn)

## <a name="ike"></a>IKEv2 and SSTP - native VPN client steps

This section helps you configure the native VPN client that's part of your Windows operating system to connect to your VNet. This configuration doesn't require additional client software.

### <a name="view-ike"></a>View config files

Unzip the configuration file to view the following folders:

* **WindowsAmd64** and **WindowsX86**, which contain the Windows 64-bit and 32-bit installer packages, respectively. The **WindowsAmd64** installer package is for all supported 64-bit Windows clients, not just Amd.
* **Generic**, which contains general information used to create your own VPN client configuration. The Generic folder is provided if IKEv2 or SSTP+IKEv2 was configured on the gateway. If only SSTP is configured, then the Generic folder isn’t present.

### <a name="install"></a>Configure VPN client profile

You can use the same VPN client configuration package on each Windows client computer, as long as the version matches the architecture for the client. For the list of client operating systems that are supported, see the point-to-site section of the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md#P2S).

>[!NOTE]
>You must have Administrator rights on the Windows client computer from which you want to connect.

1. Select the VPN client configuration files that correspond to the architecture of the Windows computer. For a 64-bit processor architecture, choose the 'VpnClientSetupAmd64' installer package. For a 32-bit processor architecture, choose the 'VpnClientSetupX86' installer package.

1. Double-click the package to install it. If you see a SmartScreen popup, click **More info**, then **Run anyway**.

## <a name="azurevpn"></a>OpenVPN - Azure VPN Client steps

This section applies to certificate authentication configurations that use the OpenVPN tunnel type. The following steps help you download, install, and configure the Azure VPN Client to connect to your VNet. To connect to your VNet, each client must have the following items:

* The Azure VPN Client software is installed.
* Azure VPN Client profile is configured using the downloaded **azurevpnconfig.xml** configuration file.
* The client certificate is installed locally.

### <a name="view-azurevpn"></a>View config files

When you open the zip file, you'll see the **AzureVPN** folder. Locate the **azurevpnconfig.xml** file. This file contains the settings you use to configure the VPN client profile. If you don't see the file, verify the following items:

* Verify that your VPN gateway is configured to use the OpenVPN tunnel type.
* If you're using Azure AD authentication, you may not have an AzureVPN folder. See the [Azure AD](openvpn-azure-ad-client.md) configuration article instead.

### Download the Azure VPN Client

[!INCLUDE [Download the Azure VPN client](../../includes/vpn-gateway-download-vpn-client.md)]

### Configure the VPN client profile

1. Open the Azure VPN Client.

1. Click **+** on the bottom left of the page, then select **Import**.

1. In the window, navigate to the **azurevpnconfig.xml** file, select it, then click **Open**.

1. From the **Certificate Information** dropdown, select the name of the child certificate (the client certificate). For example, **P2SChildCert**.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-windows/configure-certificate.png" alt-text="Screenshot showing Azure VPN client profile configuration page." lightbox="./media/point-to-site-vpn-client-cert-windows/configure-certificate.png":::

   If you don't see a client certificate in the **Certificate Information** dropdown, you'll need cancel the profile configuration import and fix the issue before proceeding. It's possible that one of the following things is true:

   * The client certificate isn't installed locally on the client computer.
   * There are multiple certificates with exactly the same name installed on your local computer (common in test environments).
   * The child certificate is corrupt.

1. After the import validates (imports with no errors), click **Save**.

1. In the left pane, locate the **VPN connection**, then click **Connect**.

Azure VPN client provides high availability by allowing you to add a secondary VPN client profile, providing a more resilient way to access VPN. You can choose to add a secondary client profile using any of the already imported client profiles and that **enables the high availability** option for windows. In case of any **region outage** or failure to connect to the primary VPN client profile, Azure VPN provides the capability to auto-connect to the secondary client profile without causing any disruptions.

## <a name="openvpn"></a>OpenVPN - OpenVPN Client steps

This section applies to certificate authentication configurations that are configured to use the OpenVPN tunnel type. The following steps help you configure the **OpenVPN &reg; Protocol** client and connect to your VNet.

### <a name="view-openvpn"></a>View config files

When you open the zip file, you should see an OpenVPN folder. If you don't see the folder, verify the following items:

* Verify that your VPN gateway is configured to use the OpenVPN tunnel type.
* If you're using Azure AD authentication, you may not have an OpenVPN folder. See the [Azure AD](openvpn-azure-ad-client.md) configuration article instead.

[!INCLUDE [Configuration steps](../../includes/vpn-gateway-vwan-config-openvpn-windows.md)]

## Connect

To connect, return to the previous article that you were working from, and see [Connect to Azure](vpn-gateway-howto-point-to-site-resource-manager-portal.md#connect).

## Next steps

For additional steps, return to the point-to-site article that you were working from.

* [PowerShell configuration steps](vpn-gateway-howto-point-to-site-rm-ps.md).
* [Azure portal configuration steps](vpn-gateway-howto-point-to-site-resource-manager-portal.md).
