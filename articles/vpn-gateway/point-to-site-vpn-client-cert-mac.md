---
title: 'Configure P2S VPN clients -certificate authentication - macOS and iOS'
titleSuffix: Azure VPN Gateway
description: Learn how to configure the VPN client for VPN Gateway P2S configurations that use certificate authentication. This article applies to macOS and iOS.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 05/18/2022
ms.author: cherylmc
---

# Configure point-to-site VPN clients - certificate authentication - macOS and iOS

When you connect to an Azure virtual network (VNet) using VPN Gateway point-to-site (P2S), IKEv2, and certificate authentication, you use the VPN client that is natively installed on the operating system from which you’re connecting. For OpenVPN connections, you use an OpenVPN client. All of the necessary configuration settings for the VPN clients are contained in a VPN client configuration zip file. The settings in the zip file help you easily configure the VPN clients macOS.

The VPN client configuration files that you generate are specific to the P2S VPN gateway configuration for the virtual network. If there are any changes to the P2S VPN configuration after you generate the files, such as changes to the VPN protocol type or authentication type, you need to generate new VPN client configuration files and apply the new configuration to all of the VPN clients that you want to connect. For more information about P2S connections, see [About point-to-site VPN](point-to-site-about.md).

## <a name="generate"></a>Before you begin

Before beginning, verify that you are on the correct article. The following table shows the configuration articles available for Azure VPN Gateway P2S VPN clients. Steps differ, depending on the authentication type, tunnel type, and the client OS.

[!INCLUDE [All client articles](../../includes/vpn-gateway-vpn-client-install-articles.md)]

>[!IMPORTANT]
>[!INCLUDE [TLS](../../includes/vpn-gateway-tls-change.md)]

## <a name="generate"></a>Generate VPN client configuration files

You can generate client configuration files using PowerShell, or by using the Azure portal. Either method returns the same zip file.

### <a name="zipportal"></a>Generate files using the Azure portal

1. In the Azure portal, navigate to the virtual network gateway for the virtual network that you want to connect to.
1. On the virtual network gateway page, select **Point-to-site configuration** to open the Point-to-site configuration page.
1. At the top of the Point-to-site configuration page, select **Download VPN client**. This doesn't download VPN client software, it generates the configuration package used to configure VPN clients. It takes a few minutes for the client configuration package to generate. During this time, you may not see any indications until the packet has generated.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-mac/download-configuration.png" alt-text="Download the VPN client configuration." lightbox="./media/point-to-site-vpn-client-cert-mac/download-configuration.png":::
1. Once the configuration package has been generated, your browser indicates that a client configuration zip file is available. It's named the same name as your gateway. Unzip the file to view the folders.

### <a name="zipps"></a>Generate files using PowerShell

1. When generating VPN client configuration files, the value for '-AuthenticationMethod' is 'EapTls'. Generate the VPN client configuration files using the following command:

   ```azurepowershell-interactive
   $profile=New-AzVpnClientConfiguration -ResourceGroupName "TestRG" -Name "VNet1GW" -AuthenticationMethod "EapTls"

   $profile.VPNProfileSASUrl
   ```

1. Copy the URL to your browser to download the zip file, then unzip the file to view the folders.

## IKEv2 - macOS steps

### <a name="view"></a>View files

Unzip the file to view the following folders.

* **WindowsAmd64** and **WindowsX86**, which contain the Windows 32-bit and 64-bit installer packages, respectively. The **WindowsAmd64** installer package is for all supported 64-bit Windows clients, not just Amd.
* **Generic**, which contains general information used to create your own VPN client configuration. The Generic folder is provided if IKEv2 or SSTP+IKEv2 was configured on the gateway. If only SSTP is configured, then the Generic folder isn’t present.

To connect to Azure, you manually configure the native IKEv2 VPN client. Azure doesn’t provide a *mobileconfig* file. You can find all of the information that you need for configuration in the **Generic** folder.

If you don't see the Generic folder, check the following items, then generate the zip file again.

* Check the tunnel type for your configuration. It's likely that IKEv2 wasn’t selected as a tunnel type.
* On the VPN gateway, verify that the SKU isn’t Basic. The VPN Gateway Basic SKU doesn’t support IKEv2. Then, select IKEv2 and generate the zip file again to retrieve the Generic folder.

The **Generic** folder contains the following files.

* **VpnSettings.xml**, which contains important settings like server address and tunnel type.
* **VpnServerRoot.cer**, which contains the root certificate required to validate the Azure VPN gateway during P2S connection setup.

Use the following steps to configure the native VPN client on Mac for certificate authentication. These steps must be completed on every Mac that you want to connect to Azure.

### <a name="certificate"></a>Install certificates

1. Copy to the root certificate file - **VpnServerRoot.cer** - to your Mac. Double-click the certificate. The certificate will either automatically install, or you’ll see the **Add Certificates** page.
1. On the **Add Certificates** page, select **login** from the dropdown.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-mac/login.png" alt-text="Screenshot shows Add Certificates page with login selected.":::
1. Click **Add** to import the file.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-mac/add.png" alt-text="Screenshot shows Add Certificates page with Add selected.":::

### Verify certificate install

Verify that both the client and the root certificate are installed. The client certificate is used for authentication and is required. For information about how to install a client certificate, see [Install a client certificate](point-to-site-how-to-vpn-client-install-azure-cert.md).

1. Open the **Keychain Access** application.
1. Navigate to the **Certificates** tab.
1. Verify that both the client and the root certificate are installed.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-mac/keychain.png" alt-text="Screenshot shows Keychain Access with certificates installed." lightbox="./media/point-to-site-vpn-client-cert-mac/expanded/keychain.png":::
  
### <a name="create"></a>Configure VPN client profile

1. Navigate to **System Preferences -> Network**. On the Network page, select **'+'** to create a new VPN client connection profile for a P2S connection to the Azure virtual network.
1. For **Interface**, from the dropdown, select **VPN**.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-mac/select-vpn.png" alt-text="Screenshot shows the Network window with the option to select an interface, VPN is selected." lightbox="./media/point-to-site-vpn-client-cert-mac/expanded/select-vpn.png":::

1. For **VPN Type**, from the dropdown, select **IKEv2**. In the **Service Name** field,specify a friendly name for the profile.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-mac/vpn-type.png" alt-text="Screenshot shows the Network window with the option to select an interface, select VPN type, and enter a service name." lightbox="./media/point-to-site-vpn-client-cert-mac/expanded/vpn-type.png":::

1. Select **Create** to create the VPN client connection profile.
1. In the **Generic** folder, open the **VpnSettings.xml** file using a text editor, and copy the **VpnServer** tag value.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-mac/server-tag.png" alt-text="Screenshot shows the VpnSettings.xml file open with the VpnServer tag highlighted." lightbox="./media/point-to-site-vpn-client-cert-mac/expanded/server-tag.png":::

1. Paste the **VpnServer** tag value in both the **Server Address** and **Remote ID** fields of the profile.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-mac/paste-value.png" alt-text="Screenshot shows the Network window with the value pasted." lightbox="./media/point-to-site-vpn-client-cert-mac/expanded/paste-value.png":::

### <a name="auth"></a>Configure authentication settings

Configure authentication settings. There are two sets of instructions. Choose the instructions that correspond to your OS version.

#### Catalina

* For **Authentication Settings** select **None**.
* Select **Certificate**, select **Select** and select the correct client certificate that you installed earlier. Then, select **OK**.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-mac/catalina.png" alt-text="Screenshot shows the Network window with None selected for Authentication Settings and Certificate selected.":::

#### Big Sur

* Select **Authentication Settings**, then select **Certificate**.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-mac/authentication-certificate.png" alt-text="Screenshot shows authentication settings with certificate selected." lightbox="./media/point-to-site-vpn-client-cert-mac/expanded/authentication-certificate.png":::

* Select **Select** to open the **Choose An Identity** page. The **Choose An Identity** page displays a list of certificates for you to choose from. If you’re unsure which certificate to use, you can select **Show Certificate** to see more information about each certificate.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-mac/show-certificate.png" alt-text="Screenshot shows certificate properties." lightbox="./media/point-to-site-vpn-client-cert-mac/expanded/show-certificate.png":::

* Select the proper certificate, then select **Continue**.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-mac/choose-identity.png" alt-text="Screenshot shows Choose an Identity, where you can select a certificate." lightbox="./media/point-to-site-vpn-client-cert-mac/expanded/choose-identity.png":::

* On the **Authentication Settings** page, verify that the correct certificate is shown, then select **OK**.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-mac/certificate.png" alt-text="Screenshot shows the Choose An Identity dialog box where you can select the proper certificate." lightbox="./media/point-to-site-vpn-client-cert-mac/expanded/certificate.png":::

### <a name="certificate"></a>Specify certificate

1. For both Catalina and Big Sur, in the **Local ID** field, specify the name of the certificate. In this example, it’s `P2SChildCert`.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-mac/local-id.png" alt-text="Screenshot shows local ID value." lightbox="./media/point-to-site-vpn-client-cert-mac/expanded/local-id.png":::
1. Select **Apply** to save all changes.

### <a name="connect"></a>Connect

1. Select **Connect** to start the P2S connection to the Azure virtual network.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-mac/select-connect.png" alt-text="Screenshot shows connect button." lightbox="./media/point-to-site-vpn-client-cert-mac/expanded/select-connect.png":::

1. Once the connection has been established, the status shows as **Connected** and you can view the IP address that was pulled from the VPN client address pool.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-mac/connected.png" alt-text="Screenshot shows Connected." lightbox="./media/point-to-site-vpn-client-cert-mac/expanded/connected.png":::

## OpenVPN - macOS steps

>[!INCLUDE [OpenVPN Mac](../../includes/vpn-gateway-vwan-config-openvpn-mac.md)]

## OpenVPN - iOS steps

>[!INCLUDE [OpenVPN iOS](../../includes/vpn-gateway-vwan-config-openvpn-ios.md)]

## Next steps

For additional steps, return to the original point-to-site article that you were working from.

* [PowerShell configuration steps](vpn-gateway-howto-point-to-site-rm-ps.md).
* [Azure portal configuration steps](vpn-gateway-howto-point-to-site-resource-manager-portal.md).
