---
title: 'Create & install P2S VPN client configuration files: certificate authentication'
titleSuffix: Azure VPN Gateway
description: Create and install Windows, Linux, Linux (strongSwan), and macOS X VPN client configuration files for P2S certificate authentication.
services: vpn-gateway
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 11/11/2020
ms.author: cherylmc
---

# Create and install VPN client configuration files for native Azure certificate authentication P2S configurations

VPN client configuration files are contained in a zip file. Configuration files provide the settings required for a native Windows, Mac IKEv2 VPN, or Linux clients to connect to a virtual network over Point-to-Site connections that use native Azure certificate authentication.

Client configuration files are specific to the VPN configuration for the virtual network. If there are any changes to the Point-to-Site VPN configuration after you generate the VPN client configuration files, such as the VPN protocol type or authentication type, be sure to generate new VPN client configuration files for your user devices.

* For more information about Point-to-Site connections, see [About Point-to-Site VPN](point-to-site-about.md).
* For OpenVPN instructions, see [Configure OpenVPN for P2S](vpn-gateway-howto-openvpn.md) and [Configure OpenVPN clients](vpn-gateway-howto-openvpn-clients.md).

>[!IMPORTANT]
>[!INCLUDE [TLS](../../includes/vpn-gateway-tls-change.md)]
>

## <a name="generate"></a>Generate VPN client configuration files

Before you begin, make sure that all connecting users have a valid certificate installed on the user's device. For more information about installing a client certificate, see [Install a client certificate](point-to-site-how-to-vpn-client-install-azure-cert.md).

You can generate client configuration files using PowerShell, or by using the Azure portal. Either method returns the same zip file. Unzip the file to view the following folders:

* **WindowsAmd64** and **WindowsX86**, which contain the Windows 32-bit and 64-bit installer packages, respectively. The **WindowsAmd64** installer package is for all supported 64-bit Windows clients, not just Amd.
* **Generic**, which contains general information used to create your own VPN client configuration. The Generic folder is provided if IKEv2 or SSTP+IKEv2 was configured on the gateway. If only SSTP is configured, then the Generic folder is not present.

### <a name="zipportal"></a>Generate files using the Azure portal

1. In the Azure portal, navigate to the virtual network gateway for the virtual network that you want to connect to.
1. On the virtual network gateway page, select **Point-to-site configuration**.

   :::image type="content" source="./media/point-to-site-vpn-client-configuration-azure-cert/download-client.png" alt-text="Download the VPN client":::
1. At the top of the Point-to-site configuration page, select **Download VPN client**. It takes a few minutes for the client configuration package to generate.
1. Your browser indicates that a client configuration zip file is available. It is named the same name as your gateway. Unzip the file to view the folders.

### <a name="zipps"></a>Generate files using PowerShell

1. When generating VPN client configuration files, the value for '-AuthenticationMethod' is 'EapTls'. Generate the VPN client configuration files using the following command:

   ```azurepowershell-interactive
   $profile=New-AzVpnClientConfiguration -ResourceGroupName "TestRG" -Name "VNet1GW" -AuthenticationMethod "EapTls"

   $profile.VPNProfileSASUrl
   ```

1. Copy the URL to your browser to download the zip file, then unzip the file to view the folders.

## <a name="installwin"></a>Windows

[!INCLUDE [Windows instructions](../../includes/vpn-gateway-p2s-client-configuration-windows.md)]

## <a name="installmac"></a>Mac (OS X)

 You have to manually configure the native IKEv2 VPN client on every Mac that will connect to Azure. Azure does not provide mobileconfig file for native Azure certificate authentication. The **Generic** contains all of the information that you need for configuration. If you don't see the Generic folder in your download, it's likely that IKEv2 was not selected as a tunnel type. Note that the VPN gateway Basic SKU does not support IKEv2. Once IKEv2 is selected, generate the zip file again to retrieve the Generic folder.<br>The Generic folder contains the following files:

* **VpnSettings.xml**, which contains important settings like server address and tunnel type. 
* **VpnServerRoot.cer**, which contains the root certificate required to validate the Azure VPN Gateway during P2S connection setup.

Use the following steps to configure the native VPN client on Mac for certificate authentication. You have to complete these steps on every Mac that will connect to Azure:

1. Import the **VpnServerRoot** root certificate to your Mac. This can be done by copying the file over to your Mac and double-clicking on it. Select **Add** to import.

   :::image type="content" source="./media/point-to-site-vpn-client-configuration-azure-cert/add-certificate.png" alt-text="Screenshot shows Certificates page":::
  
    >[!NOTE]
    >Double-clicking on the certificate may not display the **Add** dialog, but the certificate is installed in the correct store. You can check for the certificate in the login keychain under the certificates category.
    >
  
1. Verify that you have installed a client certificate that was issued by the root certificate that you uploaded to Azure when you configured you P2S settings. This is different from the VPNServerRoot that you installed in the previous step. The client certificate is used for authentication and is required. For more information about generating certificates, see [Generate Certificates](vpn-gateway-howto-point-to-site-resource-manager-portal.md#generatecert). For information about how to install a client certificate, see [Install a client certificate](point-to-site-how-to-vpn-client-install-azure-cert.md).
1. Open the **Network** dialog under **Network Preferences** and select **'+'** to create a new VPN client connection profile for a P2S connection to the Azure virtual network.

   The **Interface** value is 'VPN' and **VPN Type** value is 'IKEv2'. Specify a name for the profile in the **Service Name** field, then select **Create** to create the VPN client connection profile.

   :::image type="content" source="./media/point-to-site-vpn-client-configuration-azure-cert/network.png" alt-text="Screenshot shows the Network window with the option to select an interface, select VPN type, and enter a service name":::
1. In the **Generic** folder, from the **VpnSettings.xml** file, copy the **VpnServer** tag value. Paste this value in the **Server Address** and **Remote ID** fields of the profile.

   :::image type="content" source="./media/point-to-site-vpn-client-configuration-azure-cert/server.png" alt-text="Screenshot shows server information.":::
1. Select **Authentication Settings** and select **Certificate**. For **Catalina**, select **None**, and then **certificate**.

   :::image type="content" source="./media/point-to-site-vpn-client-configuration-azure-cert/authentication-settings.png" alt-text="Screenshot shows authentication settings.":::

   For Catalina, select **None** and then **Certificate**. **Select** the correct certificate:
   
   :::image type="content" source="./media/point-to-site-vpn-client-configuration-azure-cert/catalina.png" alt-text="Screenshot shows the Network window with None selected for Authentication Settings and Certificate selected.":::

1. Click **Select…** to choose the client certificate that you want to use for authentication. This is the certificate that you installed in Step 2.

   :::image type="content" source="./media/point-to-site-vpn-client-configuration-azure-cert/certificate.png" alt-text="Screenshot shows the Network window with Authentication Settings, where you can select a certificate.":::
1. **Choose An Identity** displays a list of certificates for you to choose from. Select the proper certificate, then select **Continue**.

   :::image type="content" source="./media/point-to-site-vpn-client-configuration-azure-cert/identity.png" alt-text="Screenshot shows the Choose An Identity dialog box where you can select the proper certificate.":::

1. In the **Local ID** field, specify the name of the certificate (from Step 6). In this example, it is `ikev2Client.com`. Then, select **Apply** to save the changes.

   :::image type="content" source="./media/point-to-site-vpn-client-configuration-azure-cert/apply-connect.png" alt-text="Screenshot shows Apply.":::
1. On the **Network** dialog, select **Apply** to save all changes. Then, select **Connect** to start the P2S connection to the Azure virtual network.

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

   :::image type="content" source="./media/point-to-site-vpn-client-configuration-azure-cert/edit-connections.png" alt-text="Screenshot shows the network connections page.":::

1. Select **IPsec/IKEv2 (strongSwan)** from the  menu, and double-click.

   :::image type="content" source="./media/point-to-site-vpn-client-configuration-azure-cert/add-connection.png" alt-text="Screenshot shows the Add VPN page.":::

1. On the **Add VPN** page, add a name for your VPN connection.

   :::image type="content" source="./media/point-to-site-vpn-client-configuration-azure-cert/choose-type.png" alt-text="Screenshot shows Choose a connection type.":::
1. Open the **VpnSettings.xml** file from the **Generic** folder contained in the downloaded client configuration files. Find the tag called **VpnServer** and copy the name, beginning with 'azuregateway' and ending with '.cloudapp.net'.

   :::image type="content" source="./media/point-to-site-vpn-client-configuration-azure-cert/vpn-server.png" alt-text="Screenshot shows copy data.":::
1. Paste the name in the **Address** field of your new VPN connection in the **Gateway** section. Next, select the folder icon at the end of the **Certificate** field, browse to the **Generic** folder, and select the **VpnServerRoot** file.
1. In the **Client** section of the connection, for **Authentication**, select **Certificate/private key**. For **Certificate** and **Private key**, choose the certificate and the private key that were created earlier. In **Options**, select **Request an inner IP address**. Then, select **Add**.

   :::image type="content" source="./media/point-to-site-vpn-client-configuration-azure-cert/ip-request.png" alt-text="Screenshot shows Request an inner IP address.":::

1. Turn the connection **On**.

   :::image type="content" source="./media/point-to-site-vpn-client-configuration-azure-cert/turn-on.png" alt-text="Screenshot shows copy.":::

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
