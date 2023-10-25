---
title: 'Configure P2S VPN clients - certificate authentication - Linux'
titleSuffix: Azure VPN Gateway
description: Learn how to configure a Linux VPN client solution for VPN Gateway P2S configurations that use certificate authentication.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 05/04/2023
ms.author: cherylmc
---

# Configure point-to-site VPN clients: certificate authentication - Linux

This article helps you connect to your Azure virtual network (VNet) using VPN Gateway point-to-site (P2S) and **Certificate authentication** from a Linux client. There are multiple sets of steps in this article, depending on the tunnel type you selected for your P2S configuration, the operating system, and the VPN client that is used to connect.

## Before you begin

Before beginning, verify that you are on the correct article. The following table shows the configuration articles available for Azure VPN Gateway P2S VPN clients. Steps differ, depending on the authentication type, tunnel type, and the client OS.

[!INCLUDE [All client articles](../../includes/vpn-gateway-vpn-client-install-articles.md)]

>[!IMPORTANT]
>[!INCLUDE [TLS](../../includes/vpn-gateway-tls-change.md)]

## Generate certificates

For certificate authentication, a client certificate must be installed on each client computer. The client certificate you want to use must be exported with the private key, and must contain all certificates in the certification path. Additionally, for some configurations, you'll also need to install root certificate information.

For information about working with certificates, see [Point-to site: Generate certificates](vpn-gateway-certificates-point-to-site-linux.md).

## Generate VPN client configuration files

All of the necessary configuration settings for the VPN clients are contained in a VPN client profile configuration zip file. The VPN client profile configuration files that you generate are specific to the P2S VPN gateway configuration for the virtual network. If there are any changes to the P2S VPN configuration after you generate the files, such as changes to the VPN protocol type or authentication type, you need to generate new VPN client profile configuration files and apply the new configuration to all of the VPN clients that you want to connect. For more information about P2S connections, see [About point-to-site VPN](point-to-site-about.md).

To generate configuration files using the Azure portal:

[!INCLUDE [generate profile configuration files - Azure Portal](../../includes/vpn-gateway-generate-profile-portal.md)]

Next, configure the VPN client. Select from the following instructions:

* [IKEv2 tunnel type steps](#ike) for strongSwan
* [OpenVPN tunnel type steps](#openvpn) for OpenVPN client

## <a name="ike"></a>IKEv2 - strongSwan steps

### Install strongSwan

[!INCLUDE [Install strongSwan](../../includes/vpn-gateway-strongswan-install-include.md)]

### Install certificates

A client certificate is required for authentication when using the Azure certificate authentication type. A client certificate must be installed on each client computer. The exported client certificate must be exported with the private key, and must contain all certificates in the certification path. Make sure that the client computer has the appropriate client certificate installed before proceeding to the next section.

For information about client certificates, see [Generate certificates - Linux](vpn-gateway-certificates-point-to-site-linux.md).

### View VPN client profile files

Go to the downloaded VPN client profile configuration files. You can find all of the information that you need for configuration in the **Generic** folder. Azure doesn’t provide a *mobileconfig* file for this configuration.

If you don't see the Generic folder, check the following items, then generate the zip file again.

* Check the tunnel type for your configuration. It's likely that IKEv2 wasn’t selected as a tunnel type.
* On the VPN gateway, verify that the SKU isn’t Basic. The VPN Gateway Basic SKU doesn’t support IKEv2. Then, select IKEv2 and generate the zip file again to retrieve the Generic folder.

The Generic folder contains the following files:

* **VpnSettings.xml**, which contains important settings like server address and tunnel type.
* **VpnServerRoot.cer**, which contains the root certificate required to validate the Azure VPN gateway during P2S connection setup.

After viewing the files, continue with the steps that you want to use:

* [GUI steps](#gui)
* [CLI steps](#cli)

#### <a name="gui"></a>strongSwan GUI steps

This section walks you through the configuration using the strongSwan GUI. The following instructions were created on Ubuntu 18.0.4. Ubuntu 16.0.10 doesn’t support strongSwan GUI. If you want to use Ubuntu 16.0.10, you’ll have to use the [command line](#cli). The following examples may not match screens that you see, depending on your version of Linux and strongSwan.

1. Open the **Terminal** to install **strongSwan** and its Network Manager by running the command in the example.

   ```
   sudo apt install network-manager-strongswan
   ```
1. Select **Settings**, then select **Network**. Select the **+** button to create a new connection.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-linux/edit-connections.png" alt-text="Screenshot shows the network connections page." lightbox="./media/point-to-site-vpn-client-cert-linux/expanded/edit-connections.png":::

1. Select **IPsec/IKEv2 (strongSwan)** from the  menu, and double-click.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-linux/add-connection.png" alt-text="Screenshot shows the Add VPN page." lightbox="./media/point-to-site-vpn-client-cert-linux/expanded/add-connection.png":::

1. On the **Add VPN** page, add a name for your VPN connection.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-linux/choose-type.png" alt-text="Screenshot shows Choose a connection type." lightbox="./media/point-to-site-vpn-client-cert-linux/expanded/choose-type.png":::

1. Open the **VpnSettings.xml** file from the **Generic** folder contained in the downloaded VPN client profile configuration files. Find the tag called **VpnServer** and copy the name, beginning with 'azuregateway' and ending with '.cloudapp.net'.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-linux/vpn-server.png" alt-text="Screenshot shows copy data." lightbox="./media/point-to-site-vpn-client-cert-linux/expanded/vpn-server.png":::

1. Paste the name in the **Address** field of your new VPN connection in the **Gateway** section. Next, select the folder icon at the end of the **Certificate** field, browse to the **Generic** folder, and select the **VpnServerRoot** file.

1. In the **Client** section of the connection, for **Authentication**, select **Certificate/private key**. For **Certificate** and **Private key**, choose the certificate and the private key that were created earlier. In **Options**, select **Request an inner IP address**. Then, select **Add**.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-linux/ip-request.png" alt-text="Screenshot shows Request an inner IP address." lightbox="./media/point-to-site-vpn-client-cert-linux/expanded/ip-request.png":::

1. Turn the connection **On**.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-linux/turn-on.png" alt-text="Screenshot shows copy." lightbox="./media/point-to-site-vpn-client-cert-linux/expanded/turn-on.png":::

#### <a name="cli"></a>strongSwan CLI steps

This section walks you through the configuration using the strongSwan CLI.

1. From the VPN client profile configuration files **Generic** folder, copy or move the **VpnServerRoot.cer** to **/etc/ipsec.d/cacerts**.

1. Copy or move the files you generated to **/etc/ipsec.d/certs** and **/etc/ipsec.d/private/** respectively. These files are the client certificate and the private key, they need to be located in their corresponding directories. Use the following commands:

   ```cli
   sudo cp ${USERNAME}Cert.pem /etc/ipsec.d/certs/
   sudo cp ${USERNAME}Key.pem /etc/ipsec.d/private/
   sudo chmod -R go-rwx /etc/ipsec.d/private /etc/ipsec.d/certs
   ```

1. Run the following command to take note of your hostname. You’ll use this value in the next step.

   ```cli
   hostnamectl --static
   ```

1. Open the **VpnSettings.xml** file and copy the `<VpnServer>` value. You’ll use this value in the next step.

1. Adjust the values in the following example, then add the example to the **/etc/ipsec.conf** configuration.
  
   ```cli
   conn azure
         keyexchange=ikev2
         type=tunnel
         leftfirewall=yes
         left=%any
         # Replace ${USERNAME}Cert.pem with the key filename inside /etc/ipsec.d/certs  directory. 
         leftcert=${USERNAME}Cert.pem
         leftauth=pubkey
         leftid=%client # use the hostname of your machine with % character prepended. Example: %client
         right= #Azure VPN gateway address. Example: azuregateway-xxx-xxx.vpn.azure.com
         rightid=% #Azure VPN gateway FQDN with % character prepended. Example: %azuregateway-xxx-xxx.vpn.azure.com
         rightsubnet=0.0.0.0/0
         leftsourceip=%config
         auto=add
         esp=aes256gcm16
   ```
   
   

1. Add the secret values to **/etc/ipsec.secrets**.

   The name of the PEM file must match what you have used earlier as your client key file.
      
   ```cli
   : RSA ${USERNAME}Key.pem  # Replace ${USERNAME}Key.pem with the key filename inside /etc/ipsec.d/private directory. 
   ```

1. Finally run the following commands:

   ```cli
   sudo ipsec restart
   sudo ipsec up azure
   ```

## <a name="openvpn"></a>OpenVPN steps

This section helps you configure Linux clients for certificate authentication that uses the OpenVPN tunnel type. To connect to Azure, download the OpenVPN client and configure the connection profile.

[!INCLUDE [Configuration steps for OpenVPN Linux](../../includes/vpn-gateway-config-openvpn-linux.md)]

## Next steps

For additional steps, return to the original point-to-site article that you were working from.

* [P2S Azure portal steps](vpn-gateway-howto-point-to-site-resource-manager-portal.md).
* [P2S PowerShell steps](vpn-gateway-howto-point-to-site-rm-ps.md).
