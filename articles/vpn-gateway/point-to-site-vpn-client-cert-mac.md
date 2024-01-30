---
title: 'Configure P2S VPN clients - certificate authentication - macOS and iOS'
titleSuffix: Azure VPN Gateway
description: Learn how to configure the VPN client for VPN Gateway P2S configurations that use certificate authentication. This article applies to macOS and iOS.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 02/03/2023
ms.author: cherylmc
---

# Configure point-to-site VPN clients: certificate authentication - macOS and iOS

This article helps you connect to your Azure virtual network (VNet) using VPN Gateway point-to-site (P2S) and **Certificate authentication**. There are multiple sets of steps in this article, depending on the tunnel type you selected for your P2S configuration, the operating system, and the VPN client that is used to connect.

Note the following when working with certificate authentication:

* For the IKEv2 tunnel type, you can connect using the VPN client that is natively installed on the macOS system.

* For the OpenVPN tunnel type, you can use an OpenVPN client.

* The Azure VPN Client isn't available for macOS and iOS when using certificate authentication, even if you selected the OpenVPN tunnel type for your P2S configuration.

## Before you begin

Before beginning, verify that you are on the correct article. The following table shows the configuration articles available for Azure VPN Gateway P2S VPN clients. Steps differ, depending on the authentication type, tunnel type, and the client OS.

[!INCLUDE [All client articles](../../includes/vpn-gateway-vpn-client-install-articles.md)]

>[!IMPORTANT]
>[!INCLUDE [TLS](../../includes/vpn-gateway-tls-change.md)]

## Generate certificates

For certificate authentication, a client certificate must be installed on each client computer. The client certificate you want to use must be exported with the private key, and must contain all certificates in the certification path. Additionally, for some configurations, you'll also need to install root certificate information.

For information about working with certificates, see [Point-to site: Generate certificates - Linux](vpn-gateway-certificates-point-to-site.md).

## Generate VPN client configuration files

All of the necessary configuration settings for the VPN clients are contained in a VPN client profile configuration zip file. You can generate client profile configuration files using PowerShell, or by using the Azure portal. Either method returns the same zip file.

The VPN client profile configuration files that you generate are specific to the P2S VPN gateway configuration for the virtual network. If there are any changes to the P2S VPN configuration after you generate the files, such as changes to the VPN protocol type or authentication type, you need to generate new VPN client profile configuration files and apply the new configuration to all of the VPN clients that you want to connect. For more information about P2S connections, see [About point-to-site VPN](point-to-site-about.md).

To generate files using the Azure portal:

[!INCLUDE [Generate profile configuration files - Azure portal](../../includes/vpn-gateway-generate-profile-portal.md)]

Next, configure the VPN client. Select from the following instructions:

* [IKEv2: native VPN client - macOS steps](#ikev2-native-vpn-client---macos-steps)
* [OpenVPN: macOS steps](#openvpn-macos-steps)
* [OpenVPN: iOS steps](#openvpn-ios-steps)

## IKEv2: native VPN client - macOS steps

The following sections help you configure the native VPN client that is already installed as part of macOS. This type of connection works over IKEv2 only.

### View files

Unzip the file to view the folders. When you configure macOS native clients, you use the files in the **Generic** folder. The Generic folder is present if IKEv2 was configured on the gateway. You can find all of the information that you need to configure the native VPN client in the **Generic** folder. If you don't see the Generic folder, check the following items, then generate the zip file again.

* Check the tunnel type for your configuration. It's likely that IKEv2 wasn’t selected as a tunnel type.
* On the VPN gateway, verify that the SKU isn’t Basic. The VPN Gateway Basic SKU doesn’t support IKEv2. Then, select IKEv2 and generate the zip file again to retrieve the Generic folder.

The **Generic** folder contains the following files.

* **VpnSettings.xml**, which contains important settings like server address and tunnel type.
* **VpnServerRoot.cer**, which contains the root certificate required to validate the Azure VPN gateway during P2S connection setup.

Use the following steps to configure the native VPN client on Mac for certificate authentication. These steps must be completed on every Mac that you want to connect to Azure.

### Install certificates

#### Root certificate

1. Copy to the root certificate file - **VpnServerRoot.cer** - to your Mac. Double-click the certificate. Depending on your operating system, the certificate will either automatically install, or you'll see the **Add Certificates** page.
1. If you see the **Add Certificates** page, for **Keychain:** click the arrows and select **login** from the dropdown.
1. Click **Add** to import the file.

#### Client certificate

The client certificate is used for authentication and is required. Typically, you can just click the client certificate to install. For more information about how to install a client certificate, see [Install a client certificate](point-to-site-how-to-vpn-client-install-azure-cert.md).

#### Verify certificate install

Verify that both the client and the root certificate are installed.

1. Open **Keychain Access**.
1. Go to the **Certificates** tab.
1. Verify that both the client and the root certificate are installed.

### Configure VPN client profile

1. Go to **System Preferences -> Network**. On the Network page, click **'+'** to create a new VPN client connection profile for a P2S connection to the Azure virtual network.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-mac/mac/new.png" alt-text="Screenshot shows the Network window to click on +." lightbox="./media/point-to-site-vpn-client-cert-mac/mac/new.png":::

1. On the **Select the interface** page, click the arrows next to **Interface:**. From the dropdown, click **VPN**.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-mac/mac/vpn.png" alt-text="Screenshot shows the Network window with the option to select an interface, VPN is selected." lightbox="./media/point-to-site-vpn-client-cert-mac/mac/vpn.png":::

1. For **VPN Type**, from the dropdown, click **IKEv2**. In the **Service Name** field, specify a friendly name for the profile, then click **Create**.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-mac/mac/service-name.png" alt-text="Screenshot shows the Network window with the option to select an interface, select VPN type, and enter a service name." lightbox="./media/point-to-site-vpn-client-cert-mac/mac/service-name.png":::

1. Go to the VPN client profile that you downloaded. In the **Generic** folder, open the **VpnSettings.xml** file using a text editor. In the example, you can see information about the tunnel type and the server address. Even though there are two VPN types listed, this VPN client will connect over IKEv2. Copy the **VpnServer** tag value.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-mac/mac/vpn-server.png" alt-text="Screenshot shows the VpnSettings.xml file open with the VpnServer tag highlighted." lightbox="./media/point-to-site-vpn-client-cert-mac/mac/vpn-server.png":::

1. Paste the **VpnServer** tag value in both the **Server Address** and **Remote ID** fields of the profile. Leave **Local ID** blank. Then, click **Authentication Settings...**.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-mac/mac/server-address.png" alt-text="Screenshot shows server info pasted to fields." lightbox="./media/point-to-site-vpn-client-cert-mac/mac/server-address.png":::

### Configure authentication settings

Configure authentication settings. There are two sets of instructions. Choose the instructions that correspond to your OS version.

#### Big Sur and later

1. On the **Authentication Settings** page, for the Authentication settings field, click the arrows to select **Certificate**.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-mac/monterey/certificate.png" alt-text="Screenshot shows authentication settings with certificate selected." lightbox="./media/point-to-site-vpn-client-cert-mac/monterey/certificate.png":::

1. Click **Select** to open the **Choose An Identity** page.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-mac/monterey/select.png" alt-text="Screenshot to click Select." lightbox="./media/point-to-site-vpn-client-cert-mac/monterey/select.png":::

1. The **Choose An Identity** page displays a list of certificates for you to choose from. If you’re unsure which certificate to use, you can select **Show Certificate** to see more information about each certificate. Click the proper certificate, then click **Continue**.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-mac/monterey/choose-identity.png" alt-text="Screenshot shows certificate properties." lightbox="./media/point-to-site-vpn-client-cert-mac/monterey/choose-identity.png":::

1. On the **Authentication Settings** page, verify that the correct certificate is shown, then click **OK**.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-mac/monterey/verify.png" alt-text="Screenshot shows the Choose An Identity dialog box where you can select the proper certificate." lightbox="./media/point-to-site-vpn-client-cert-mac/monterey/verify.png":::

#### Catalina

If you're using Catalina, use these authentication settings steps:

1. For **Authentication Settings** choose **None**.

1. Click **Certificate**, click **Select** and click the correct client certificate that you installed earlier. Then, click **OK**.

### Specify certificate

1. In the **Local ID** field, specify the name of the certificate. In this example, it’s **P2SChildCertMac**.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-mac/monterey/local-id.png" alt-text="Screenshot shows local ID value." lightbox="./media/point-to-site-vpn-client-cert-mac/monterey/local-id.png":::

1. Click **Apply** to save all changes.

### Connect

1. Click **Connect** to start the P2S connection to the Azure virtual network. You may need to enter your "login" keychain password.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-mac/mac/select-connect.png" alt-text="Screenshot shows connect button." lightbox="./media/point-to-site-vpn-client-cert-mac/mac/select-connect.png":::

1. Once the connection has been established, the status shows as **Connected** and you can view the IP address that was pulled from the VPN client address pool.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-mac/mac/connected.png" alt-text="Screenshot shows Connected." lightbox="./media/point-to-site-vpn-client-cert-mac/mac/connected.png":::

## OpenVPN: macOS steps

The following example uses **TunnelBlick**.

[!INCLUDE [OpenVPN Mac](../../includes/vpn-gateway-vwan-config-openvpn-mac.md)]

## OpenVPN: iOS steps

The following example uses **OpenVPN Connect** from the App store.

[!INCLUDE [OpenVPN iOS](../../includes/vpn-gateway-vwan-config-openvpn-ios.md)]

## Next steps

For additional steps, return to the original point-to-site article that you were working from.

* [PowerShell configuration steps](vpn-gateway-howto-point-to-site-rm-ps.md).
* [Azure portal configuration steps](vpn-gateway-howto-point-to-site-resource-manager-portal.md).