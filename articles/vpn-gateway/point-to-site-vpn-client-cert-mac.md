---
title: 'Configure P2S VPN clients - certificate authentication - macOS native client'
titleSuffix: Azure VPN Gateway
description: Learn how to configure the VPN client for VPN Gateway P2S configurations that use certificate authentication. This article applies to macOS native client.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 06/18/2024
ms.author: cherylmc
---

# Configure P2S VPN clients: certificate authentication - native VPN client - macOS

If your point-to-site (P2S) VPN gateway is configured to use IKEv2 and certificate authentication, you can connect to your virtual network using the native VPN client that's part of your macOS operating system. This article walks you through the steps to configure the native VPN client and connect to your virtual network.

## Before you begin

Before you begin configuring your client, verify that you're on the correct article. The following table shows the configuration articles available for Azure VPN Gateway P2S VPN clients. Steps differ, depending on the authentication type, tunnel type, and the client OS.

[!INCLUDE [All client articles](../../includes/vpn-gateway-vpn-client-install-articles.md)]

### Prerequisites

This article assumes that you've already performed the following prerequisites:

* You created and configured your VPN gateway for point-to-site certificate authentication and the OpenVPN tunnel type. See [Configure server settings for P2S VPN Gateway connections - certificate authentication](vpn-gateway-howto-point-to-site-resource-manager-portal.md) for steps.
* You generated and downloaded the VPN client configuration files. See [Generate VPN client profile configuration files](vpn-gateway-howto-point-to-site-resource-manager-portal.md#profile-files) for steps.
* You can either generate client certificates, or acquire the appropriate client certificates necessary for authentication.

### Workflow

The workflow for this article is as follows:

1. Generate client certificates if you haven't already done so.
1. View the VPN client profile configuration files contained in the VPN client profile configuration package that you generated.
1. Install certificates.
1. Configure the native VPN client that's already installed your OS.
1. Connect to Azure.

## Generate certificates

For certificate authentication, a client certificate must be installed on each client computer. The client certificate you want to use must be exported with the private key, and must contain all certificates in the certification path. Additionally, for some configurations, you'll also need to install root certificate information.

For information about working with certificates, see [Point-to site: Generate certificates - Linux](vpn-gateway-certificates-point-to-site.md).

## View the VPN client profile configuration files

All of the necessary configuration settings for the VPN clients are contained in a VPN client profile configuration zip file. You can generate client profile configuration files using PowerShell, or by using the Azure portal. Either method returns the same zip file.

The VPN client profile configuration files are specific to the P2S VPN gateway configuration for the virtual network. If there are any changes to the P2S VPN configuration after you generate the files, such as changes to the VPN protocol type or authentication type, you need to generate new VPN client profile configuration files and apply the new configuration to all of the VPN clients that you want to connect.

Unzip the file to view the folders. When you configure macOS native clients, you use the files in the **Generic** folder. The Generic folder is present if IKEv2 was configured on the gateway. You can find all the information that you need to configure the native VPN client in the **Generic** folder. If you don't see the Generic folder, check the following items, then generate the zip file again.

* Check the tunnel type for your configuration. It's likely that IKEv2 wasn’t selected as a tunnel type.
* On the VPN gateway, verify that the SKU isn’t Basic. The VPN Gateway Basic SKU doesn’t support IKEv2. You'll have to rebuild the gateway with the appropriate SKU and tunnel type if you want macOS clients to connect.

The **Generic** folder contains the following files.

* **VpnSettings.xml**, which contains important settings like server address and tunnel type.
* **VpnServerRoot.cer**, which contains the root certificate required to validate the Azure VPN gateway during P2S connection setup.

## Install certificates

### Root certificate

1. Copy the root certificate file - **VpnServerRoot.cer** - to your Mac. Double-click the certificate. Depending on your operating system, the certificate will either automatically install, or you'll see the **Add Certificates** page.
1. If you see the **Add Certificates** page, for **Keychain:** click the arrows and select **login** from the dropdown.
1. Click **Add** to import the file.

### Client certificate

The client certificate is used for authentication and is required. Typically, you can just click the client certificate to install. For more information about how to install a client certificate, see [Install a client certificate](point-to-site-how-to-vpn-client-install-azure-cert.md).

### Verify certificate install

Verify that both the client and the root certificate are installed.

1. Open **Keychain Access**.
1. Go to the **Certificates** tab.
1. Verify that both the client and the root certificate are installed.

## Configure VPN client profile

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

## Configure authentication settings

Configure authentication settings.

1. On the **Authentication Settings** page, for the Authentication settings field, click the arrows to select **Certificate**.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-mac/monterey/certificate.png" alt-text="Screenshot shows authentication settings with certificate selected." lightbox="./media/point-to-site-vpn-client-cert-mac/monterey/certificate.png":::

1. Click **Select** to open the **Choose An Identity** page.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-mac/monterey/select.png" alt-text="Screenshot to click Select." lightbox="./media/point-to-site-vpn-client-cert-mac/monterey/select.png":::

1. The **Choose An Identity** page displays a list of certificates for you to choose from. If you’re unsure which certificate to use, you can select **Show Certificate** to see more information about each certificate. Click the proper certificate, then click **Continue**.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-mac/monterey/choose-identity.png" alt-text="Screenshot shows certificate properties." lightbox="./media/point-to-site-vpn-client-cert-mac/monterey/choose-identity.png":::

1. On the **Authentication Settings** page, verify that the correct certificate is shown, then click **OK**.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-mac/monterey/verify.png" alt-text="Screenshot shows the Choose An Identity dialog box where you can select the proper certificate." lightbox="./media/point-to-site-vpn-client-cert-mac/monterey/verify.png":::

## Specify certificate

1. In the **Local ID** field, specify the name of the certificate. In this example, it’s **P2SChildCertMac**.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-mac/monterey/local-id.png" alt-text="Screenshot shows local ID value." lightbox="./media/point-to-site-vpn-client-cert-mac/monterey/local-id.png":::

1. Click **Apply** to save all changes.

## Connect

1. Click **Connect** to start the P2S connection to the Azure virtual network. You might need to enter your "login" keychain password.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-mac/mac/select-connect.png" alt-text="Screenshot shows connect button." lightbox="./media/point-to-site-vpn-client-cert-mac/mac/select-connect.png":::

1. Once the connection has been established, the status shows as **Connected** and you can view the IP address that was pulled from the VPN client address pool.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-mac/mac/connected.png" alt-text="Screenshot shows Connected." lightbox="./media/point-to-site-vpn-client-cert-mac/mac/connected.png":::

## Next steps

Follow up with any additional server or connection settings. See [Point-to-site configuration steps](vpn-gateway-howto-point-to-site-resource-manager-portal.md).