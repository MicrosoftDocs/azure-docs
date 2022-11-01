---
 title: include file
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 10/18/2022
 ms.author: cherylmc

#Customer intent: this file is used for both virtual wan and vpn gateway articles.
---
1. Download and install the OpenVPN client (version 2.4 or higher) from the official [OpenVPN website](https://openvpn.net/index.php/open-source/downloads.html).
1. Download the VPN client profile package from the Azure portal, or use the 'New-AzVpnClientConfiguration' cmdlet in PowerShell.
1. Unzip the profile. Next, open the *vpnconfig.ovpn* configuration file from the OpenVPN folder using Notepad.
1. Export the point-to-site client certificate that you created. While many of the steps in this section of the article can apply to both VPN Gateway and Virtual WAN configurations, the procedure is different for this step. Use the link that pertains to your environment.

   * [VPN Gateway](../articles/vpn-gateway/vpn-gateway-certificates-point-to-site.md#clientexport) instructions
   * [Virtual WAN](../articles/virtual-wan/certificates-point-to-site.md#clientexport) instructions
1. Extract the private key and the base64 thumbprint from the *.pfx*. There are multiple ways to do this. Using OpenSSL on your machine is one way. The *profileinfo.txt* file contains the private key and the thumbprint for the CA and the Client certificate. Be sure to use the thumbprint of the client certificate.

   ```
   openssl pkcs12 -in "filename.pfx" -nodes -out "profileinfo.txt"
   ```
1. Switch to the *vpnconfig.ovpn* file you opened in Notepad from step 3. Fill in the section between `<cert>` and `</cert>`, getting the values for `$CLIENT_CERTIFICATE`, `$INTERMEDIATE_CERTIFICATE`, and `$ROOT_CERTIFICATE` as shown below.

   ```
      # P2S client certificate
      # please fill this field with a PEM formatted cert
      <cert>
      $CLIENT_CERTIFICATE
      $INTERMEDIATE_CERTIFICATE (optional)
      $ROOT_CERTIFICATE
      </cert>
      ```

   * Open *profileinfo.txt* from the previous step in Notepad. You can identify each certificate by looking at the `subject=` line. For example, if your child certificate is called P2SChildCert, your client certificate will be after the `subject=CN = P2SChildCert` attribute. 
   * For each certificate in the chain, copy the text (including and between) "-----BEGIN CERTIFICATE-----" and "-----END CERTIFICATE-----". 
   * Only include an  `$INTERMEDIATE_CERTIFICATE` value if you have an intermediate certificate in your *profileinfo.txt* file. 
1. Open the *profileinfo.txt* in Notepad. To get the private key, select the text (including and between) "-----BEGIN PRIVATE KEY-----" and "-----END PRIVATE KEY-----" and copy it.
1. Go back to the vpnconfig.ovpn file in Notepad and find this section. Paste the private key replacing everything between and `<key>` and `</key>`.

   ```
   # P2S client root certificate private key
   # please fill this field with a PEM formatted key
   <key>
   $PRIVATEKEY
   </key>
   ```

1. Do not change any other fields. Use the filled in configuration in client input to connect to the VPN.
1. Copy the vpnconfig.ovpn file to C:\Program Files\OpenVPN\config folder.
1. Right-click the OpenVPN icon in the system tray and click connect.
