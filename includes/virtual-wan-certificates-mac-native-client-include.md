---
 author: cherylmc
 ms.service: virtual-wan
 ms.topic: include
 ms.date: 04/28/2023
 ms.author: cherylmc
---
After you generate and download the VPN client configuration package, unzip it to view the folders. When you configure macOS native clients, you use the files in the **Generic** folder. The Generic folder is present if IKEv2 was configured on the gateway. You can find all of the information that you need to configure the native VPN client in the **Generic** folder. If you don't see the Generic folder, make sure IKEv2 is one of the tunnel types, then download the configuration package again.

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

The client certificate is used for authentication and is required. Typically, you can just click the client certificate to install. For more information about how to install a client certificate, see [Install a client certificate](../articles/virtual-wan/install-client-certificates.md).

#### Verify certificate install

Verify that both the client and the root certificate are installed.

1. Open **Keychain Access**.
1. Go to the **Certificates** tab.
1. Verify that both the client and the root certificate are installed.
  
### Configure VPN client profile

1. Go to **System Preferences -> Network**. On the Network page, click **'+'** to create a new VPN client connection profile for a P2S connection to the Azure virtual network.

   :::image type="content" source="./media/virtual-wan-certificates-mac-native-client/mac/new.png" alt-text="Screenshot shows the Network window to click on the plus sign." lightbox="./media/virtual-wan-certificates-mac-native-client/mac/new.png":::

1. On the **Select the interface** page, click the arrows next to **Interface:**. From the dropdown, click **VPN**.

   :::image type="content" source="./media/virtual-wan-certificates-mac-native-client/mac/vpn.png" alt-text="Screenshot shows the Network window with the option to select an interface, VPN is selected." lightbox="./media/virtual-wan-certificates-mac-native-client/mac/vpn.png":::

1. For **VPN Type**, from the dropdown, click **IKEv2**. In the **Service Name** field, specify a friendly name for the profile, then click **Create**.

   :::image type="content" source="./media/virtual-wan-certificates-mac-native-client/mac/service-name.png" alt-text="Screenshot shows the Network window with the option to select an interface, select VPN type, and enter a service name." lightbox="./media/virtual-wan-certificates-mac-native-client/mac/service-name.png":::

1. Go to the VPN client profile that you downloaded. In the **Generic** folder, open the **VpnSettings.xml** file using a text editor. In the example, you can see that this VPN client profile connects to a WAN-level User VPN profile and that the VpnTypes are IKEv2 and OpenVPN. Even though there are two VPN types listed, this VPN client will connect over IKEv2. Copy the **VpnServer** tag value.

   :::image type="content" source="./media/virtual-wan-certificates-mac-native-client/mac/vpn-server.png" alt-text="Screenshot shows the VpnSettings.xml file open with the VpnServer tag highlighted." lightbox="./media/virtual-wan-certificates-mac-native-client/mac/vpn-server.png":::

1. Paste the **VpnServer** tag value in both the **Server Address** and **Remote ID** fields of the profile. Leave **Local ID** blank. Then, click **Authentication Settings...**.

   :::image type="content" source="./media/virtual-wan-certificates-mac-native-client/mac/server-address.png" alt-text="Screenshot shows server info pasted to fields." lightbox="./media/virtual-wan-certificates-mac-native-client/mac/server-address.png":::

### Configure authentication settings

#### Big Sur and later

1. On the **Authentication Settings** page, for the Authentication settings field, click the arrows to select **Certificate**.

   :::image type="content" source="./media/virtual-wan-certificates-mac-native-client/monterey/certificate.png" alt-text="Screenshot shows authentication settings with certificate selected." lightbox="./media/virtual-wan-certificates-mac-native-client/monterey/certificate.png":::

1. Click **Select** to open the **Choose An Identity** page.

   :::image type="content" source="./media/virtual-wan-certificates-mac-native-client/monterey/select.png" alt-text="Screenshot to click Select." lightbox="./media/virtual-wan-certificates-mac-native-client/monterey/select.png":::

1. The **Choose An Identity** page displays a list of certificates for you to choose from. If you’re unsure which certificate to use, you can select **Show Certificate** to see more information about each certificate. Click the proper certificate, then click **Continue**.

   :::image type="content" source="./media/virtual-wan-certificates-mac-native-client/monterey/choose-identity.png" alt-text="Screenshot shows certificate properties." lightbox="./media/virtual-wan-certificates-mac-native-client/monterey/choose-identity.png":::

1. On the **Authentication Settings** page, verify that the correct certificate is shown, then click **OK**.

   :::image type="content" source="./media/virtual-wan-certificates-mac-native-client/monterey/verify.png" alt-text="Screenshot shows the Choose An Identity dialog box where you can select the proper certificate." lightbox="./media/virtual-wan-certificates-mac-native-client/monterey/verify.png":::

#### Catalina

If you're using Catalina, use these authentication settings steps:

1. For **Authentication Settings** choose **None**.

1. Click **Certificate**, click **Select** and click the correct client certificate that you installed earlier. Then, click **OK**.

### Specify certificate

1. In the **Local ID** field, specify the name of the certificate. In this example, it’s **P2SChildCertMac**.

   :::image type="content" source="./media/virtual-wan-certificates-mac-native-client/monterey/local-id.png" alt-text="Screenshot shows local ID value." lightbox="./media/virtual-wan-certificates-mac-native-client/monterey/local-id.png":::

1. Click **Apply** to save all changes.

### Connect

1. Click **Connect** to start the P2S connection to the Azure virtual network. You may need to enter your "login" keychain password.

   :::image type="content" source="./media/virtual-wan-certificates-mac-native-client/mac/select-connect.png" alt-text="Screenshot shows connect button." lightbox="./media/virtual-wan-certificates-mac-native-client/mac/select-connect.png":::

1. Once the connection has been established, the status shows as **Connected** and you can view the IP address that was pulled from the VPN client address pool.

   :::image type="content" source="./media/virtual-wan-certificates-mac-native-client/mac/connected.png" alt-text="Screenshot shows Connected." lightbox="./media/virtual-wan-certificates-mac-native-client/mac/connected.png":::
