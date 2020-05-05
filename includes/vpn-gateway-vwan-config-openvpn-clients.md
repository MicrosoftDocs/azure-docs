---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 03/17/2020
 ms.author: cherylmc
 ms.custom: include file

#intent: this file is used for both virtual wan and vpn gateway articles
---
## <a name="windows"></a>Windows clients

1. Download and install the OpenVPN client (version 2.4 or higher) from the official [OpenVPN website](https://openvpn.net/index.php/open-source/downloads.html).
2. Download the VPN profile for the gateway. This can be done from the Point-to-site configuration tab in the Azure portal, or 'New-AzVpnClientConfiguration' in PowerShell.
3. Unzip the profile. Next, open the *vpnconfig.ovpn* configuration file from the OpenVPN folder using Notepad.
4. Export the point-to-site client certificate you created and uploaded to your P2S configuration on the gateway. Use the following article links:

   * [VPN Gateway](../articles/vpn-gateway/vpn-gateway-certificates-point-to-site.md#clientexport) instructions
   
   * [Virtual WAN](../articles/virtual-wan/certificates-point-to-site.md#clientexport) instructions
5. Extract the private key and the base64 thumbprint from the *.pfx*. There are multiple ways to do this. Using OpenSSL on your machine is one way. The *profileinfo.txt* file contains the private key and the thumbprint for the CA and the Client certificate. Be sure to use the thumbprint of the client certificate.

   ```
   openssl pkcs12 -in "filename.pfx" -nodes -out "profileinfo.txt"
   ```
6. Open *profileinfo.txt* in Notepad. To get the thumbprint of the client (child) certificate, select the text (including and between)"-----BEGIN CERTIFICATE-----" and "-----END CERTIFICATE-----" for the child certificate and copy it. You can identify the child certificate by looking at the subject=/ line.
7. Switch to the *vpnconfig.ovpn* file you opened in Notepad from step 3. Find the section shown below and replace everything between "cert" and "/cert".

   ```
   # P2S client certificate
   # please fill this field with a PEM formatted cert
   <cert>
   $CLIENTCERTIFICATE
   </cert>
   ```
8. Open the *profileinfo.txt* in Notepad. To get the private key, select the text (including and between) "-----BEGIN PRIVATE KEY-----" and "-----END PRIVATE KEY-----" and copy it.
9. Go back to the vpnconfig.ovpn file in Notepad and find this section. Paste the private key replacing everything between and "key" and "/key".

   ```
   # P2S client root certificate private key
   # please fill this field with a PEM formatted key
   <key>
   $PRIVATEKEY
   </key>
   ```
10. Do not change any other fields. Use the filled in configuration in client input to connect to the VPN.
11. Copy the vpnconfig.ovpn file to C:\Program Files\OpenVPN\config folder.
12. Right-click the OpenVPN icon in the system tray and click connect.

## <a name="mac"></a>Mac clients

1. Download and install an OpenVPN client, such as [TunnelBlick](https://tunnelblick.net/downloads.html). 
2. Download the VPN profile for the gateway. This can be done from the point-to-site configuration tab in the Azure portal, or by using 'New-AzVpnClientConfiguration' in PowerShell.
3. Unzip the profile. Open the vpnconfig.ovpn configuration file from the OpenVPN folder in a text editor.
4. Fill in the P2S client certificate section with the P2S client certificate public key in base64. In a PEM formatted certificate, you can simply open the .cer file and copy over the base64 key between the certificate headers. Use the following article links for information about how to export a certificate to get the encoded public key:

   * [VPN Gateway](../articles/vpn-gateway/vpn-gateway-certificates-point-to-site.md#cer) instructions 
   
   * [Virtual WAN](../articles/virtual-wan/certificates-point-to-site.md#cer) instructions
5. Fill in the private key section with the P2S client certificate private key in base64. See the [Export your private key](https://openvpn.net/community-resources/how-to/#pki) on the OpenVPN site for information about how to extract a private key.
6. Do not change any other fields. Use the filled in configuration in client input to connect to the VPN.
7. Double-click the profile file to create the profile in Tunnelblick.
8. Launch Tunnelblick from the applications folder.
9. Click on the Tunnelblick icon in the system tray and pick connect.

> [!IMPORTANT]
>Only iOS 11.0 and above and MacOS 10.13 and above are supported with OpenVPN protocol.
>
## <a name="iOS"></a>iOS clients

1. Install the OpenVPN client (version 2.4 or higher) from the App store.
2. Download the VPN profile for the gateway. This can be done from the point-to-site configuration tab in the Azure portal, or by using 'New-AzVpnClientConfiguration' in PowerShell.
3. Unzip the profile. Open the vpnconfig.ovpn configuration file from the OpenVPN folder in a text editor.
4. Fill in the P2S client certificate section with the P2S client certificate public key in base64. In a PEM formatted certificate, you can simply open the .cer file and copy over the base64 key between the certificate headers. Use the following article links for information about how to export a certificate to get the encoded public key:

   * [VPN Gateway](../articles/vpn-gateway/vpn-gateway-certificates-point-to-site.md#cer) instructions 
   
   * [Virtual WAN](../articles/virtual-wan/certificates-point-to-site.md#cer) instructions
5. Fill in the private key section with the P2S client certificate private key in base64. See [Export your private key](https://openvpn.net/community-resources/how-to/#pki) on the OpenVPN site for information about how to extract a private key.
6. Do not change any other fields.
7. E-mail the profile file (.ovpn) to your email account that is configured in the mail app on your iPhone. 
8. Open the e-mail in the mail app on the iPhone, and tap the attached file

    ![Open email](./media/vpn-gateway-vwan-config-openvpn-clients/ios2.png)

9. Tap on **More** if you do not see **Copy to OpenVPN** option

    ![More](./media/vpn-gateway-vwan-config-openvpn-clients/ios3.png)

10. Tap on **Copy to OpenVPN** 

    ![Copy to OpenVPN](./media/vpn-gateway-vwan-config-openvpn-clients/ios4.png)

11. Tap on **ADD** in the **Import Profile** page

    ![Add](./media/vpn-gateway-vwan-config-openvpn-clients/ios5.png)

12. Tap on **ADD** in the **Imported Profile** page

    ![Tap ADD](./media/vpn-gateway-vwan-config-openvpn-clients/ios6.png)

13. Launch the OpenVPN app and slide the switch in the **Profile** page right to connect

    ![Connect](./media/vpn-gateway-vwan-config-openvpn-clients/ios8.png)


## <a name="linux"></a>Linux clients

1. Open a new Terminal session. You can open a new session by pressing 'Ctrl + Alt + t' at the same time.
2. Enter the following command to install needed components:

   ```
   sudo apt-get install openvpn
   sudo apt-get -y install network-manager-openvpn
   sudo service network-manager restart
   ```
3. Download the VPN profile for the gateway. This can be done from the Point-to-site configuration tab in the Azure portal.
4. Export the P2S client certificate you created and uploaded to your P2S configuration on the gateway. Use the following article links:

   * [VPN Gateway](../articles/vpn-gateway/vpn-gateway-certificates-point-to-site.md#clientexport) instructions 
   
   * [Virtual WAN](../articles/virtual-wan/certificates-point-to-site.md#clientexport) instructions
5. Extract the private key and the base64 thumbprint from the .pfx. There are multiple ways to do this. Using OpenSSL on your computer is one way.

    ```
    openssl pkcs12 -in "filename.pfx" -nodes -out "profileinfo.txt"
    ```
   The *profileinfo.txt* file will contain the private key and the thumbprint for the CA, and the Client certificate. Be sure to use the thumbprint of the client certificate.

6. Open *profileinfo.txt* in a text editor. To get the thumbprint of the client (child) certificate, select the text including and between "-----BEGIN CERTIFICATE-----" and "-----END CERTIFICATE-----" for the child certificate and copy it. You can identify the child certificate by looking at the subject=/ line.

7. Open the *vpnconfig.ovpn* file and find the section shown below. Replace everything between the and "cert" and "/cert".

   ```
   # P2S client certificate
   # please fill this field with a PEM formatted cert
   <cert>
   $CLIENTCERTIFICATE
   </cert>
   ```
8. Open the profileinfo.txt in a text editor. To get the private key, select the text including and between "-----BEGIN PRIVATE KEY-----" and "-----END PRIVATE KEY-----" and copy it.

9. Open the vpnconfig.ovpn file in a text editor and find this section. Paste the private key replacing everything between and "key" and "/key".

   ```
   # P2S client root certificate private key
   # please fill this field with a PEM formatted key
   <key>
   $PRIVATEKEY
   </key>
   ```

10. Do not change any other fields. Use the filled in configuration in client input to connect to the VPN.
11. To connect using the command line, type the following command:
  
    ```
    sudo openvpn --config <name and path of your VPN profile file>&
    ```
12. To connect using the GUI, go to system settings.
13. Click **+** to add a new VPN connection.
14. Under **Add VPN**, pick **Import from file…**
15. Browse to the profile file and double-click or pick **Open**.
16. Click **Add** on the **Add VPN** window.
  
    ![Import from file](./media/vpn-gateway-vwan-config-openvpn-clients/import.png)
17. You can connect by turning the VPN **ON** on the **Network Settings** page, or under the network icon in the system tray.
