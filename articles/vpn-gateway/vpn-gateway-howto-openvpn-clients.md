---
title: 'How to configure OpenVPN Clients for Azure VPN Gateway| Microsoft Docs'
description: Steps to configure OpenVPN Clients for Azure VPN Gateway
services: vpn-gateway
author: cherylmc

ms.service: vpn-gateway
ms.topic: conceptual
ms.date: 09/21/2018
ms.author: cherylmc

---
# Configure OpenVPN clients for Azure VPN Gateway (Preview)

This article helps you configure OpenVPN clients.

> [!IMPORTANT]
> This Public Preview is provided without a service level agreement and should not be used for production workloads. Certain features may not be supported, may have constrained capabilities, or may not be available in all Azure locations. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.
>

## Before you begin

Verify that you have completed the steps to configure OpenVPN for your VPN gateway. For details, see [Configure OpenVPN for Azure VPN Gateway](vpn-gateway-howto-openvpn.md).

## <a name="windows"></a>Windows clients

1. Download and install the OpenVPN client from the official [OpenVPN website](https://openvpn.net/index.php/open-source/downloads.html).
2. Download the VPN profile for the gateway. This can be done from the Point-to-site configuration tab in the Azure portal, or' New-AzureRmVpnClientConfiguration' in PowerShell.
3. Unzip the profile. Then, open the vpnconfig.ovpn configuration file from the OpenVPN folder in Notepad.
4.	Export the P2S client certificate you created and uploaded to your P2S configuration on the gateway. Example: [Create Certificate with PowerShell](vpn-gateway/vpn-gateway-certificates-point-to-site.md) while obtaining the Private key. See [export the key](vpn-gateway/vpn-gateway-certificates-point-to-site.md)
5.	You will now need to extract the private key and the base64 thumbprint from the .pfx you just created. There are multiple ways to do this, and using an OpenSSL on your machine is one. Alternately you can use an online tool like [NameCheap](https://decoder.link/converter)'s tool found here. Select PKCS#12 to PEM.
6.	Using web method above download the zip file, inside you will find two .crt files and a .key file. Open the file without the -bundle.crt in notepad. This will give you the base64 of your cert. Select all and copy, you will include the -----BEGIN and END Certificate-----.
```
-----BEGIN CERTIFICATE-----
<Thumprint of certificate>
-----END CERTIFICATE-----
```
7.	Now switch to vpnconfig.ovpn file you opened in notepad from step 3. Find the section shown below replace everything between the and <cert> and </cert>
```
# P2S client certificate
# please fill this field with a PEM formatted cert
<cert>
$CLIENTCERTIFICATE
</cert>
```
8.	Now open the .key file in notepad, and select all again and copy.
```
-----BEGIN PRIVATE KEY-----
<Private Key Data>
-----END PRIVATE KEY-----
```
9.	Go back to the vpnconfig.ovpn file in notepad and find this section. Paste the private key replacing everything between and <key> and </key>
```
# P2S client root certificate private key
# please fill this field with a PEM formatted key
<key>
$PRIVATEKEY
</key>
```
10.	Do not change any other fields. Use the filled in configuration in client input to connect to the VPN.
11.	Save the vpnconfig.ovpn file.
12.	Copy the vpnconfig.ovpn file to C:\Program Files\OpenVPN\config folder.
13.	Right-click the OpenVPN icon in the system tray and click connect. 

## <a name="mac"></a>Mac clients

1. Download and install an OpenVPN client, such as [TunnelBlik](https://tunnelblick.net/downloads.html). 
2. Download the VPN profile for the gateway. This can be done from the point-to-site configuration tab in the Azure portal, or by using 'New-AzureRmVpnClientConfiguration' in PowerShell.
3. Unzip the profile. Open the vpnconfig.ovpn configuration file from the OpenVPN folder in notepad.
4. Fill in the P2S client certificate section with the P2S client certificate public key in base64. In a PEM formatted certificate, you can simply open the .cer file and copy over the base64 key between the certificate headers. See [Export the public key](vpn-gateway-certificates-point-to-site.md#cer) for information about how to export a certificate to get the encoded public key.
5. Fill in the private key section with the P2S client certificate private key in base64. See [Export your private key](https://www.geotrust.eu/en/support/manuals/microsoft/all+windows+servers/export+private+key+or+certificate/) for information about how to extract private key.
6. Do not change any other fields. Use the filled in configuration in client input to connect to the VPN.
7. Double-click the profile file to create the profile in tunnelblik.
8. Launch Tunnelblik from the applications folder.
9. Click on the Tunneblik icon in the system tray and pick connect.

## <a name="linux"></a>Linux clients

1. Open a new Terminal session. You can open a new session by pressing 'Ctrl + Alt + t' at the same time
2. Enter the following command to install needed components:

  ```
  sudo apt-get install openvpn
  sudo apt-get -y install network-manager-openvpn
  sudo service network-manager restart
  ```
3. Download the VPN profile for the gateway. This can be done from the Point-to-site configuration tab in the Azure portal, or by using 'New-AzureRmVpnClientConfiguration' in PowerShell.
4. Fill in the private key section with the P2S client certificate private key in base64. See [Export your private key](https://www.geotrust.eu/en/support/manuals/microsoft/all+windows+servers/export+private+key+or+certificate/) for information about how to extract private key.
5. To connect using the command line, type the following:
  
  ```
  Sudo openvpn –config <name and path of your VPN profile file>
  ```
5. To connect using the GUI, go to system settings.
6. Click **+** to add a new VPN connection.
7. Under **Add VPN**, pick **Import from file…**
8. Browse to the profile file and double-click or pick **Open**
9. Click **Add** on the **Add VPN** window.
  
  ![Import from file](./media/vpn-gateway-howto-openvpn-clients/importfromfile.png)
10. You can connect by turning the VPN **ON** on the **Network Settings** page, or under the network icon in the system tray.

## Next steps

If you want the VPN clients to be able to access resources in another vnet (production), then follow the instructions on the [Vnet-to-VNet](vpn-gateway-howto-vnet-vnet-resource-manager-portal.md) article to set up a vnet-to-vnet connection. Please be sure to enable BGP on the gateways and the connections, otherwise traffic will not flow.
