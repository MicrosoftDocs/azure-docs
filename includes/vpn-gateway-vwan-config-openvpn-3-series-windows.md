---
 title: include file
 author: cherylmc
 ms.service: azure-vpn-gateway
 ms.topic: include
 ms.date: 10/08/2024
 ms.author: cherylmc

#Customer intent: This file is used for both virtual wan and vpn gateway articles.
---

1. Download and install the OpenVPN client version 3.x from the official [OpenVPN website](https://openvpn.net/client/client-connect-vpn-for-windows/).
1. Locate the VPN client profile configuration package that you generated and downloaded to your computer. Extract the package. Go to the OpenVPN folder and open the *vpnconfig.ovpn* configuration file using Notepad.
1. Next, locate the child certificate you created. If you don't have the certificate, use one of the following links for steps to export the certificate. You'll use the certificate information in the next step.

   * [VPN Gateway](/azure/vpn-gateway/vpn-gateway-certificates-point-to-site#clientexport) instructions
   * [Virtual WAN](/azure/virtual-wan/certificates-point-to-site#clientexport) instructions
1. From the child certificate, extract the private key and the base64 thumbprint from the *.pfx*. There are multiple ways to do this. Using OpenSSL on your computer is one way. The *profileinfo.txt* file contains the private key and the thumbprint for the CA and the Client certificate. Be sure to use the thumbprint of the client certificate.

   ```
   openssl pkcs12 -in "filename.pfx" -nodes -out "profileinfo.txt"
   ```
1. Switch to the **vpnconfig.ovpn** file you opened in Notepad. Fill in the section between `<cert>` and `</cert>`, getting the values for `$CLIENT_CERTIFICATE`, and `$ROOT_CERTIFICATE` as shown in the following example.

   ```
      # P2S client certificate
      # please fill this field with a PEM formatted cert
      <cert>
      $CLIENT_CERTIFICATE
      $ROOT_CERTIFICATE
      </cert>
      ```

   * Open **profileinfo.txt** from the previous step in Notepad. You can identify each certificate by looking at the `subject=` line. For example, if your child certificate is called P2SChildCert, your client certificate will be after the `subject=CN = P2SChildCert` attribute.
   * For each certificate in the chain, copy the text (including and between) "-----BEGIN CERTIFICATE-----" and "-----END CERTIFICATE-----".

1. Open the *profileinfo.txt* in Notepad. To get the private key, select the text (including and between) "-----BEGIN PRIVATE KEY-----" and "-----END PRIVATE KEY-----" and copy it.
1. Go back to the vpnconfig.ovpn file in Notepad and find this section. Paste the private key replacing everything between and `<key>` and `</key>`.

   ```
   # P2S client root certificate private key
   # please fill this field with a PEM formatted key
   <key>
   $PRIVATEKEY
   </key>
   ```

1. Comment out the "log openvpn.log" line. If it's not commented out, the OpenVPN client reports that the log is no longer a supported option. See the [User profile example](#example) for an example of how to comment out the log line. After commenting out the log line, you can still access logs via the OpenVPN client interface. To access, click the log icon at the top right corner of the client UI. Microsoft recommends that customers check the OpenVPN connect documentation for log file location because logging is controlled by the OpenVPN client.
1. Don't change any other fields. Use the filled in configuration in client input to connect to the VPN.
1. Import the vpnconfig.ovpn file in OpenVPN client.
1. Right-click the OpenVPN icon in the system tray and click **Connect**.
