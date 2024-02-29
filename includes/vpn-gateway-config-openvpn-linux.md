---
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 05/04/2023
 ms.author: cherylmc
 ms.custom: include file

#Customer intent: This file is duplicated as vpn-gateway-vwan-config-openvpn-linux.md. If the steps and screenshots in this file are updated, they need to be also updated in the other file unless specific to VPN Gateway.
---

[!INCLUDE [OpenVPN client version 2.6 not supported](vpn-gateway-vwan-open-vpn-client-version-unsupported.md)]

1. Open a new Terminal session. You can open a new session by pressing 'Ctrl + Alt + t' at the same time.

1. Enter the following command to install needed components:

   ```
   sudo apt-get install openvpn
   sudo apt-get -y install network-manager-openvpn
   sudo service network-manager restart
   ```
1. Next, go to the VPN client profile folder and unzip to view the files.

1. Export the P2S client certificate you created and uploaded to your P2S configuration on the gateway. For steps, see [VPN Gateway point-to-site](../articles/vpn-gateway/vpn-gateway-certificates-point-to-site.md#clientexport).

1. Extract the private key and the base64 thumbprint from the .pfx. There are multiple ways to do this. Using OpenSSL on your computer is one way.

   ```
   openssl pkcs12 -in "filename.pfx" -nodes -out "profileinfo.txt"
   ```

   The *profileinfo.txt* file will contain the private key and the thumbprint for the CA, and the Client certificate. Be sure to use the thumbprint of the client certificate.

1. Open *profileinfo.txt* in a text editor. To get the thumbprint of the client (child) certificate, select the text including and between "-----BEGIN CERTIFICATE-----" and "-----END CERTIFICATE-----" for the child certificate and copy it. You can identify the child certificate by looking at the subject=/ line.

1. Open the *vpnconfig.ovpn* file and find the section shown below. Replace everything between "cert" and "/cert".

   ```
   # P2S client certificate
   # please fill this field with a PEM formatted cert
   <cert>
   $CLIENTCERTIFICATE
   </cert>
   ```

1. Open the profileinfo.txt in a text editor. To get the private key, select the text including and between "-----BEGIN PRIVATE KEY-----" and "-----END PRIVATE KEY-----" and copy it.

1. Open the vpnconfig.ovpn file in a text editor and find this section. Paste the private key replacing everything between "key" and "/key".

   ```
   # P2S client root certificate private key
   # please fill this field with a PEM formatted key
   <key>
   $PRIVATEKEY
   </key>
   ```

1. Don't change any other fields. Use the filled in configuration in client input to connect to the VPN.

   - To connect using the command line, type the following command:
  
     ```
     sudo openvpn --config <name and path of your VPN profile file>&
     ```
   - To disconnect using command line, type the following command:

     ```
     sudo pkill openvpn
     ```
   - To connect using the GUI, go to system settings.

1. Select **+** to add a new VPN connection.

1. Under **Add VPN**, pick **Import from file…**.

1. Browse to the profile file and double-click or pick **Open**.

1. Select **Add** on the **Add VPN** window.
  
   :::image type="content" source="./media/vpn-gateway-vwan-config-openvpn-linux/import.png" alt-text="Screenshot shows Import from file on the Add VPN page." lightbox="./media/vpn-gateway-vwan-config-openvpn-linux/import.png":::

1. You can connect by turning the VPN **ON** on the **Network Settings** page, or under the network icon in the system tray.
