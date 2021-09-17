---
title: 'Create & install P2S VPN client configuration files: certificate authentication'
titleSuffix: Azure VPN Gateway
description: Learn how to generate and install VPN client configuration files for Windows, Linux (strongSwan), and macOS. This article applies to VPN Gateway P2S configurations that use certificate authentication.
services: vpn-gateway
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 07/15/2021
ms.author: cherylmc
---

# Generate and install VPN client configuration files for P2S certificate authentication

When you connect to an Azure VNet using Point-to-Site and certificate authentication, you use the VPN client that is natively installed on the operating system from which you are connecting. All of the necessary configuration settings for the VPN clients are contained in a VPN client configuration zip file. The settings in the zip file help you easily configure the VPN clients for Windows, Mac IKEv2 VPN, or Linux.

The VPN client configuration files that you generate are specific to the P2S VPN gateway configuration for the virtual network. If there are any changes to the Point-to-Site VPN configuration after you generate the files, such as changes to the VPN protocol type or authentication type, you need to generate new VPN client configuration files and apply the new configuration to all of the VPN clients that you want to connect.

* For more information about Point-to-Site connections, see [About Point-to-Site VPN](point-to-site-about.md).
* For OpenVPN instructions, see [Configure OpenVPN for P2S](vpn-gateway-howto-openvpn.md) and [Configure OpenVPN clients](vpn-gateway-howto-openvpn-clients.md).

>[!IMPORTANT]
>[!INCLUDE [TLS](../../includes/vpn-gateway-tls-change.md)]
>

## <a name="generate"></a>Generate VPN client configuration files

You can generate client configuration files using PowerShell, or by using the Azure portal. Either method returns the same zip file. Unzip the file to view the following folders:

* **WindowsAmd64** and **WindowsX86**, which contain the Windows 32-bit and 64-bit installer packages, respectively. The **WindowsAmd64** installer package is for all supported 64-bit Windows clients, not just Amd.
* **Generic**, which contains general information used to create your own VPN client configuration. The Generic folder is provided if IKEv2 or SSTP+IKEv2 was configured on the gateway. If only SSTP is configured, then the Generic folder is not present.

### <a name="zipportal"></a>Generate files using the Azure portal

1. In the Azure portal, navigate to the virtual network gateway for the virtual network that you want to connect to.
1. On the virtual network gateway page, select **Point-to-site configuration** to open the Point-to-site configuration page.
1. At the top of the Point-to-site configuration page, select **Download VPN client**. This doesn't download VPN client software, it generates the configuration package used to configure VPN clients. It takes a few minutes for the client configuration package to generate. During this time, you may not see any indications until the packet has generated.

   :::image type="content" source="./media/point-to-site-vpn-client-configuration-azure-cert/download-client.png" alt-text="Download the VPN client configuration." lightbox="./media/point-to-site-vpn-client-configuration-azure-cert/expanded/download-client.png":::
1. Once the configuration package has been generated, your browser indicates that a client configuration zip file is available. It's named the same name as your gateway. Unzip the file to view the folders.

### <a name="zipps"></a>Generate files using PowerShell

1. When generating VPN client configuration files, the value for '-AuthenticationMethod' is 'EapTls'. Generate the VPN client configuration files using the following command:

   ```azurepowershell-interactive
   $profile=New-AzVpnClientConfiguration -ResourceGroupName "TestRG" -Name "VNet1GW" -AuthenticationMethod "EapTls"

   $profile.VPNProfileSASUrl
   ```

1. Copy the URL to your browser to download the zip file, then unzip the file to view the folders.

## <a name="installwin"></a>Windows

[!INCLUDE [Windows instructions](../../includes/vpn-gateway-p2s-client-configuration-windows.md)]

## <a name="installmac"></a>Mac (macOS)

In order to connect to Azure, you must manually configure the native IKEv2 VPN client. Azure does not provide a *mobileconfig* file. You can find all of the information that you need for configuration in the **Generic** folder. 

If you don't see the Generic folder in your download, it's likely that IKEv2 was not selected as a tunnel type. Note that the VPN gateway Basic SKU does not support IKEv2. On the VPN gateway, verify that the SKU is not Basic. Then, select IKEv2 and generate the zip file again to retrieve the Generic folder.

The Generic folder contains the following files:

* **VpnSettings.xml**, which contains important settings like server address and tunnel type. 
* **VpnServerRoot.cer**, which contains the root certificate required to validate the Azure VPN Gateway during P2S connection setup.

Use the following steps to configure the native VPN client on Mac for certificate authentication. These steps must be completed on every Mac that you want to connect to Azure.

### Import root certificate file

1. Copy to the root certificate file to your Mac. Double-click the certificate. The certificate will either automatically install, or you will see the **Add Certificates** page.
1. On the **Add Certificates** page, select **login** from the dropdown.

   :::image type="content" source="./media/point-to-site-vpn-client-configuration-azure-cert/login.png" alt-text="Screenshot shows Add Certificates page with login selected.":::
1. Click **Add** to import the file.

   :::image type="content" source="./media/point-to-site-vpn-client-configuration-azure-cert/add.png" alt-text="Screenshot shows Add Certificates page with Add selected.":::

### Verify certificate install

Verify that both the client and the root certificate are installed. The client certificate is used for authentication and is required. For information about how to install a client certificate, see [Install a client certificate](point-to-site-how-to-vpn-client-install-azure-cert.md).

1. Open the **Keychain Access** application.
1. Navigate to the **Certificates** tab.
1. Verify that both the client and the root certificate are installed.

   :::image type="content" source="./media/point-to-site-vpn-client-configuration-azure-cert/keychain.png" alt-text="Screenshot shows Keychain Access with certificates installed." lightbox="./media/point-to-site-vpn-client-configuration-azure-cert/expanded/keychain.png":::
  
### Create VPN client profile

1. Navigate to **System Preferences -> Network**. On the Network page, select **'+'** to create a new VPN client connection profile for a P2S connection to the Azure virtual network.
1. For **Interface**, from the dropdown, select **VPN**.

   :::image type="content" source="./media/point-to-site-vpn-client-configuration-azure-cert/select-vpn.png" alt-text="Screenshot shows the Network window with the option to select an interface, VPN is selected." lightbox="./media/point-to-site-vpn-client-configuration-azure-cert/expanded/select-vpn.png":::

1. For **VPN Type**, from the dropdown, select **IKEv2**. In the **Service Name** field,specify a friendly name for the profile.

   :::image type="content" source="./media/point-to-site-vpn-client-configuration-azure-cert/vpn-type.png" alt-text="Screenshot shows the Network window with the option to select an interface, select VPN type, and enter a service name." lightbox="./media/point-to-site-vpn-client-configuration-azure-cert/expanded/vpn-type.png":::

1. Select **Create** to create the VPN client connection profile.
1. In the **Generic** folder, open the **VpnSettings.xml** file using a text editor, and copy the **VpnServer** tag value.

   :::image type="content" source="./media/point-to-site-vpn-client-configuration-azure-cert/server-tag.png" alt-text="Screenshot shows the VpnSettings.xml file open with the VpnServer tag highlighted." lightbox="./media/point-to-site-vpn-client-configuration-azure-cert/expanded/server-tag.png":::

1. Paste the **VpnServer** tag value in both the **Server Address** and **Remote ID** fields of the profile.

   :::image type="content" source="./media/point-to-site-vpn-client-configuration-azure-cert/paste-value.png" alt-text="Screenshot shows the Network window with the value pasted." lightbox="./media/point-to-site-vpn-client-configuration-azure-cert/expanded/paste-value.png":::

1. Configure authentication settings. There are two sets of instructions. Choose the instructions that correspond to your OS version.

   **Catalina:** 

     * For **Authentication Settings** select **None**. 
     * Select **Certificate**, click **Select** and select the correct client certificate that you installed earlier. Then, click **OK**.
   
        :::image type="content" source="./media/point-to-site-vpn-client-configuration-azure-cert/catalina.png" alt-text="Screenshot shows the Network window with None selected for Authentication Settings and Certificate selected.":::

   **Big Sur:**

      * Click **Authentication Settings**, then select **Certificate**. 

        :::image type="content" source="./media/point-to-site-vpn-client-configuration-azure-cert/authentication-certificate.png" alt-text="Screenshot shows authentication settings with certificate selected." lightbox="./media/point-to-site-vpn-client-configuration-azure-cert/expanded/authentication-certificate.png":::

      * Click **Select** to open the **Choose An Identity** page. The **Choose An Identity** page displays a list of certificates for you to choose from. If you are unsure which certificate to use, you can click **Show Certificate** to see more information about each certificate.

        :::image type="content" source="./media/point-to-site-vpn-client-configuration-azure-cert/show-certificate.png" alt-text="Screenshot shows certificate properties.." lightbox="./media/point-to-site-vpn-client-configuration-azure-cert/expanded/show-certificate.png":::
      * Select the proper certificate, then select **Continue**.

        :::image type="content" source="./media/point-to-site-vpn-client-configuration-azure-cert/choose-identity.png" alt-text="Screenshot shows Choose an Identity, where you can select a certificate." lightbox="./media/point-to-site-vpn-client-configuration-azure-cert/expanded/choose-identity.png":::
   
      * On the **Authentication Settings** page, verify that the correct certificate is shown, then click **OK**.

        :::image type="content" source="./media/point-to-site-vpn-client-configuration-azure-cert/certificate.png" alt-text="Screenshot shows the Choose An Identity dialog box where you can select the proper certificate." lightbox="./media/point-to-site-vpn-client-configuration-azure-cert/expanded/certificate.png":::

1. For both Catalina and Big Sur, in the **Local ID** field, specify the name of the certificate. In this example, it is `P2SChildCert`.

   :::image type="content" source="./media/point-to-site-vpn-client-configuration-azure-cert/local-id.png" alt-text="Screenshot shows local ID value." lightbox="./media/point-to-site-vpn-client-configuration-azure-cert/expanded/local-id.png":::
1. Select **Apply** to save all changes. 
1. Select **Connect** to start the P2S connection to the Azure virtual network.

   :::image type="content" source="./media/point-to-site-vpn-client-configuration-azure-cert/select-connect.png" alt-text="Screenshot shows connect button." lightbox="./media/point-to-site-vpn-client-configuration-azure-cert/expanded/select-connect.png":::

1. Once the connection has been established, the status shows as **Connected** and you can view the IP address that was pulled from the VPN client address pool.

   :::image type="content" source="./media/point-to-site-vpn-client-configuration-azure-cert/connected.png" alt-text="Screenshot shows Connected." lightbox="./media/point-to-site-vpn-client-configuration-azure-cert/expanded/connected.png":::

## <a name="linuxgui"></a>Linux (strongSwan GUI)

### <a name="installstrongswan"></a>Install strongSwan

[!INCLUDE [install strongSwan](../../includes/vpn-gateway-strongswan-install-include.md)]

### <a name="genlinuxcerts"></a>Generate certificates

If you have not already generated certificates, use the following steps:

[!INCLUDE [strongSwan certificates](../../includes/vpn-gateway-strongswan-certificates-include.md)]

### <a name="install"></a>Install and configure

The following instructions were created on Ubuntu 18.0.4. Ubuntu 16.0.10 does not support strongSwan GUI. If you want to use Ubuntu 16.0.10, you will have to use the [command line](#linuxinstallcli). The examples below may not match screens that you see, depending on your version of Linux and strongSwan.

1. Open the **Terminal** to install **strongSwan** and its Network Manager by running the command in the example.

   ```
   sudo apt install network-manager-strongswan
   ```
1. Select **Settings**, then select **Network**. Select the **+** button to create a new connection.

   :::image type="content" source="./media/point-to-site-vpn-client-configuration-azure-cert/edit-connections.png" alt-text="Screenshot shows the network connections page." lightbox="./media/point-to-site-vpn-client-configuration-azure-cert/expanded/edit-connections.png":::

1. Select **IPsec/IKEv2 (strongSwan)** from the  menu, and double-click.

   :::image type="content" source="./media/point-to-site-vpn-client-configuration-azure-cert/add-connection.png" alt-text="Screenshot shows the Add VPN page." lightbox="./media/point-to-site-vpn-client-configuration-azure-cert/expanded/add-connection.png":::

1. On the **Add VPN** page, add a name for your VPN connection.

   :::image type="content" source="./media/point-to-site-vpn-client-configuration-azure-cert/choose-type.png" alt-text="Screenshot shows Choose a connection type." lightbox="./media/point-to-site-vpn-client-configuration-azure-cert/expanded/choose-type.png":::
1. Open the **VpnSettings.xml** file from the **Generic** folder contained in the downloaded client configuration files. Find the tag called **VpnServer** and copy the name, beginning with 'azuregateway' and ending with '.cloudapp.net'.

   :::image type="content" source="./media/point-to-site-vpn-client-configuration-azure-cert/vpn-server.png" alt-text="Screenshot shows copy data." lightbox="./media/point-to-site-vpn-client-configuration-azure-cert/expanded/vpn-server.png":::
1. Paste the name in the **Address** field of your new VPN connection in the **Gateway** section. Next, select the folder icon at the end of the **Certificate** field, browse to the **Generic** folder, and select the **VpnServerRoot** file.
1. In the **Client** section of the connection, for **Authentication**, select **Certificate/private key**. For **Certificate** and **Private key**, choose the certificate and the private key that were created earlier. In **Options**, select **Request an inner IP address**. Then, select **Add**.

   :::image type="content" source="./media/point-to-site-vpn-client-configuration-azure-cert/ip-request.png" alt-text="Screenshot shows Request an inner IP address." lightbox="./media/point-to-site-vpn-client-configuration-azure-cert/expanded/ip-request.png":::

1. Turn the connection **On**.

   :::image type="content" source="./media/point-to-site-vpn-client-configuration-azure-cert/turn-on.png" alt-text="Screenshot shows copy." lightbox="./media/point-to-site-vpn-client-configuration-azure-cert/expanded/turn-on.png":::

## <a name="linuxinstallcli"></a>Linux (strongSwan CLI)

### Install strongSwan

[!INCLUDE [install strongSwan](../../includes/vpn-gateway-strongswan-install-include.md)]

### Generate certificates

If you have not already generated certificates, use the following steps:

[!INCLUDE [strongSwan certificates](../../includes/vpn-gateway-strongswan-certificates-include.md)]

### Install and configure

1. Download the VPNClient package from Azure portal.
1. Extract the file.
1. From the **Generic** folder, copy or move the **VpnServerRoot.cer** to **/etc/ipsec.d/cacerts**.
1. Copy or move **cp client.p12** to **/etc/ipsec.d/private/**. This file is the client certificate for the VPN gateway.
1. Open the **VpnSettings.xml** file and copy the `<VpnServer>` value. You will use this value in the next step.
1. Adjust the values in the example below, then add the example to the **/etc/ipsec.conf** configuration.
  
   ```
   conn azure
         keyexchange=ikev2
         type=tunnel
         leftfirewall=yes
         left=%any
         leftauth=eap-tls
         leftid=%client # use the DNS alternative name prefixed with the %
         right= Enter the VPN Server value here# Azure VPN gateway address
         rightid=% # Enter the VPN Server value here# Azure VPN gateway FQDN with %
         rightsubnet=0.0.0.0/0
         leftsourceip=%config
         auto=add
   ```
1. Add the following values to **/etc/ipsec.secrets**.

   ```
   : P12 client.p12 'password' # key filename inside /etc/ipsec.d/private directory
   ```

1. Run the following commands:

   ```
   # ipsec restart
   # ipsec up azure
   ```

## Next steps

Return to the original article that you were working from, then complete your P2S configuration.

* [PowerShell configuration steps](vpn-gateway-howto-point-to-site-rm-ps.md).
* [Azure portal configuration steps](vpn-gateway-howto-point-to-site-resource-manager-portal.md).
