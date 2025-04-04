---
 author: cherylmc
 ms.service: azure-vpn-gateway
 ms.topic: include
 ms.date: 01/30/2025
 ms.author: cherylmc

#Customer intent: this file is used for both virtual wan and vpn gateway articles.
---
## View the VPN client profile configuration files

All of the necessary configuration settings for the VPN clients are contained in a VPN client profile configuration zip file. You can generate client profile configuration files using PowerShell, or by using the Azure portal. Either method returns the same zip file.

The VPN client profile configuration files are specific to the P2S VPN gateway configuration for the virtual network. If there are any changes to the P2S VPN configuration after you generate the files, such as changes to the VPN protocol type or authentication type, you need to generate new VPN client profile configuration files and apply the new configuration to all of the VPN clients that you want to connect.

Unzip the file to view the folders. When you configure macOS native clients, you use the files in the **Generic** folder. The Generic folder is present if IKEv2 was configured on the gateway. If you don't see the Generic folder, check the following items, then generate the zip file again.

* Check the tunnel type for your configuration. It's likely that IKEv2 wasn’t selected as a tunnel type.

The **Generic** folder contains the following files.

* **VpnSettings.xml**, which contains important settings like server address and tunnel type.
* **VpnServerRoot.cer**, which contains the root certificate required to validate the Azure VPN gateway during P2S connection setup.

## Install certificates

You'll need both the root certificate and the child certificate installed on your Mac. The child certificate must be exported with the private key and must contain all certificates in the certification path.

### Root certificate

1. Copy the root certificate file (the .cer file) - to your Mac. Double-click the certificate. Depending on your operating system, the certificate will either automatically install, or you'll see the **Add Certificates** page.
1. If you see the **Add Certificates** page, for **Keychain:** click the arrows and select **login** from the dropdown.
1. Click **Add** to import the file.

### Client certificate

The client certificate (.pfx file) is used for authentication and is required. Typically, you can just click the client certificate to install.

### Verify certificates are installed

Verify that both the client and the root certificate are installed.

1. Open **Keychain Access**.
1. Go to the **Certificates** tab.
1. Verify that both the client and the root certificate are installed.

## Configure VPN client profile

Use the steps in the [Mac User Guide](https://support.apple.com/guide/mac-help/set-up-a-vpn-connection-on-mac-mchlp2963/mac) that are appropriate for your operating system version  to add a VPN client profile configuration with the following settings.

* Select **IKEv2** as the VPN type.
* For **Display Name**, select a friendly name for the profile.
* For both **Server Address** and **Remote ID**, use the value from the **VpnServer** tag in the **VpnSettings.xml** file.

   :::image type="content" source="./media/vpn-gateway-vwan-native-certificate/vpn-server.png" alt-text="Screenshot to click Select." lightbox="./media/vpn-gateway-vwan-native-certificate/vpn-server.png":::

* For **Authentication** settings, select **Certificate**.
* For the **Certificate**, choose the child certificate you want to use for authentication. If you have multiple certificates, you can select **Show Certificate** to see more information about each certificate.
* For **Local ID**, type the name of the child certificate that you selected.

Once you finished configuring the VPN client profile, save the profile.

## Connect

The steps to connect are specific to the macOS operating system version. Refer to the [Mac User Guide](https://support.apple.com/guide/mac-help/set-up-a-vpn-connection-on-mac-mchlp2963/mac). Select the operating system version that you're using and follow the steps to connect.

Once the connection has been established, the status shows as **Connected**. The IP address is allocated from the VPN client address pool.