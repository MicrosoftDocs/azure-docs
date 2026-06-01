---
 author: cherylmc
 ms.service: azure-vpn-gateway
 ms.topic: include
 ms.date: 02/12/2025
 ms.author: cherylmc

#Customer intent: this file is used for both virtual wan and vpn gateway articles.
---

### Connection requirements

To connect to Azure using the strongSwan client and certificate authentication via IKEv2 tunnel type, each connecting client requires the following items:

* Each client must be configured to use strongSwan.
* The client must have the correct certificates installed locally.

### Workflow

The workflow for this article is:

1. Install strongSwan.
1. View the VPN client profile configuration files contained in the VPN client profile configuration package that you generated.
1. Locate any necessary client certificates.
1. Configure strongSwan.
1. Connect to Azure.

### About certificates

For certificate authentication, a client certificate must be installed on each client computer. The client certificate you want to use must be exported with the private key, and must contain all certificates in the certification path. Additionally, for some configurations, you'll also need to install root certificate information.

For more information about certificates for Linux, see the following articles:

* [Generate certificates - OpenSSL](../articles/vpn-gateway/point-to-site-certificates-linux-openssl.md)
* [Generate certificates - strongSwan](../articles/vpn-gateway/vpn-gateway-certificates-point-to-site-linux.md)

## Install strongSwan

[!INCLUDE [Install strongSwan](vpn-gateway-strongswan-install-include.md)]

## View VPN client profile configuration files

When you generate a VPN client profile configuration package, all the necessary configuration settings for VPN clients are contained in a VPN client profile configuration zip file. The VPN client profile configuration files are specific to the P2S VPN gateway configuration for the virtual network. If there are any changes to the P2S VPN configuration after you generate the files, such as changes to the VPN protocol type or authentication type, you need to generate new VPN client profile configuration files and apply the new configuration to all of the VPN clients that you want to connect.

Locate and unzip the VPN client profile configuration package you generated and downloaded. You can find all of the information that you need for configuration in the **Generic** folder. Azure doesn’t provide a *mobileconfig* file for this configuration.

If you don't see the Generic folder, check the following items, then generate the zip file again.

* Check the tunnel type for your configuration. It's likely that IKEv2 wasn’t selected as a tunnel type.
* On the VPN gateway, verify that the SKU isn’t Basic. The VPN Gateway Basic SKU doesn’t support IKEv2. Then, select IKEv2 and generate the zip file again to retrieve the Generic folder.

The Generic folder contains the following files:

* **VpnSettings.xml**, which contains important settings like server address and tunnel type.
* **VpnServerRoot.cer**, which contains the root certificate required to validate the Azure VPN gateway during P2S connection setup.

## Configure the VPN client

After viewing the VPN client profile files, continue with the steps that you want to use:

* [GUI steps](#gui)
* [CLI steps](#cli)

### <a name="gui"></a>GUI steps

This section walks you through the configuration using the strongSwan GUI. The following instructions were created on Ubuntu 18.0.4. Ubuntu 16.0.10 doesn’t support strongSwan GUI. If you want to use Ubuntu 16.0.10, you’ll have to use the [command line](#cli). The following examples might not match screens that you see, depending on your version of Linux and strongSwan.

1. Open the **Terminal** to install **strongSwan** and its Network Manager by running the command in the example.

   ```
   sudo apt install network-manager-strongswan
   ```

1. Select **Settings**, then select **Network**. Select the **+** button to create a new connection.

   :::image type="content" source="./media/vpn-gateway-vwan-linux-ike/edit-connections.png" alt-text="Screenshot shows the network connections page." lightbox="./media/vpn-gateway-vwan-linux-ike/expanded/edit-connections.png":::

1. On the **Add VPN** page, select **IPsec/IKEv2 (strongSwan)** from the  menu, and double-click.

1. On the **Add VPN** page, add a name for your VPN connection.

1. Open the **VpnSettings.xml** file from the **Generic** folder contained in the downloaded VPN client profile configuration package files. Find the tag called **VpnServer** and copy the name, beginning with 'azuregateway' and ending with '.cloudapp.net'.

   :::image type="content" source="./media/vpn-gateway-vwan-linux-ike/vpn-server.png" alt-text="Screenshot shows copy data." lightbox="./media/vpn-gateway-vwan-linux-ike/expanded/vpn-server.png":::

1. Paste the name in the **Address** field of your new VPN connection in the **Gateway** section. Next, select the folder icon at the end of the **Certificate** field, browse to the **Generic** folder, and select the **VpnServerRoot** file.

1. In the **Client** section of the connection, for **Authentication**, select **Certificate/private key**. For **Certificate** and **Private key**, choose the certificate and the private key that were created earlier. In **Options**, select **Request an inner IP address**. Then, select **Add**.

   :::image type="content" source="./media/vpn-gateway-vwan-linux-ike/ip-request.png" alt-text="Screenshot shows Request an inner IP address." lightbox="./media/vpn-gateway-vwan-linux-ike/expanded/ip-request.png":::

1. Turn the connection **On**.

   :::image type="content" source="./media/vpn-gateway-vwan-linux-ike/turn-on.png" alt-text="Screenshot shows copy." lightbox="./media/vpn-gateway-vwan-linux-ike/expanded/turn-on.png":::

### <a name="cli"></a>CLI steps

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

1. Run the following commands:

   ```cli
   sudo ipsec restart
   sudo ipsec up azure
   ```
